import { useState, useCallback, useEffect, useRef } from 'react';
import { useSocket } from '~/hooks/useSocket';
import type { DrawingStroke, User, Point } from '~/types/drawing';
import { USER_COLORS } from '~/types/drawing';

interface CollaborativeState {
    undoStack: DrawingStroke[][];
    redoStack: DrawingStroke[][];
}

export const useCollaborativeDrawing = (roomId: string) => {
    const [localState, setLocalState] = useState<CollaborativeState>({
        undoStack: [],
        redoStack: [],
    });

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const userIdRef = useRef<string>('');

    // Initialize user
    useEffect(() => {
        const storedUserId = localStorage.getItem('drawing-user-id');
        const odUserId = storedUserId || `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        if (!storedUserId) {
            localStorage.setItem('drawing-user-id', odUserId);
        }

        userIdRef.current = odUserId;

        const colorIndex = Math.abs(odUserId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % USER_COLORS.length;
        const userName = `User ${odUserId.slice(-4).toUpperCase()}`;

        const user: User = {
            id: odUserId,
            name: userName,
            color: USER_COLORS[colorIndex] as string,
            cursor: null,
            isOnline: true,
        };

        setCurrentUser(user);
    }, []);

    // Setup socket connection
    const {
        isConnected,
        users,
        strokes,
        error,
        roomDeleted,
        emitStroke,
        emitCursor,
        emitUndo,
        emitRedo,
        emitClear,
    } = useSocket({
        roomId,
        userId: currentUser?.id || '',
        userName: currentUser?.name || '',
        userColor: currentUser?.color || USER_COLORS[0] as string,
    });

    // Keep a ref to the current strokes to avoid stale closure issues
    const strokesRef = useRef<DrawingStroke[]>(strokes);
    useEffect(() => {
        strokesRef.current = strokes;
    }, [strokes]);

    const addStroke = useCallback((stroke: DrawingStroke) => {
        // Capture current strokes before state update
        const currentStrokes = strokesRef.current;
        setLocalState(prev => ({
            undoStack: [...prev.undoStack, currentStrokes],
            redoStack: [],
        }));
        emitStroke(stroke);
    }, [emitStroke]);

    const updateCursor = useCallback((position: Point | null) => {
        if (!currentUser) return;
        emitCursor(position);
    }, [currentUser, emitCursor]);

    const undo = useCallback(() => {
        // Capture current strokes BEFORE the state update
        const currentStrokes = strokesRef.current;

        setLocalState(prev => {
            if (prev.undoStack.length === 0) return prev;

            const newUndoStack = [...prev.undoStack];
            const previousStrokes = newUndoStack.pop()!;

            // Emit the strokes we want to revert to
            emitUndo(previousStrokes);

            return {
                undoStack: newUndoStack,
                redoStack: [...prev.redoStack, currentStrokes],
            };
        });
    }, [emitUndo]);

    const redo = useCallback(() => {
        // Capture current strokes BEFORE the state update
        const currentStrokes = strokesRef.current;

        setLocalState(prev => {
            if (prev.redoStack.length === 0) return prev;

            const newRedoStack = [...prev.redoStack];
            const nextStrokes = newRedoStack.pop()!;

            // Emit the strokes we want to redo to
            emitRedo(nextStrokes);

            return {
                undoStack: [...prev.undoStack, currentStrokes],
                redoStack: newRedoStack,
            };
        });
    }, [emitRedo]);

    const clearCanvas = useCallback(() => {
        const currentStrokes = strokesRef.current;
        setLocalState(prev => ({
            undoStack: [...prev.undoStack, currentStrokes],
            redoStack: [],
        }));
        emitClear();
    }, [emitClear]);

    return {
        strokes,
        users,
        currentUser,
        addStroke,
        updateCursor,
        undo,
        redo,
        clearCanvas,
        canUndo: localState.undoStack.length > 0,
        canRedo: localState.redoStack.length > 0,
        isConnected,
        error,
        roomDeleted,
    };
};
