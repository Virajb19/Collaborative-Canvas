import { useState, useCallback, useEffect, useRef } from 'react';
import { useSocket } from '~/hooks/useSocket';
import type { DrawingStroke, User, Point, Tool } from '~/types/drawing';
import { USER_COLORS } from '~/types/drawing';

export const useCollaborativeDrawing = (roomId: string) => {
    // Local undo/redo removed in favor of server-side history

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
        streamingStrokes,
        error,
        roomDeleted,
        emitStroke,
        emitStrokeStream,
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

    const addStroke = useCallback((stroke: DrawingStroke) => {
        emitStroke(stroke);
    }, [emitStroke]);

    const updateCursor = useCallback((position: Point | null) => {
        if (!currentUser) return;
        emitCursor(position);
    }, [currentUser, emitCursor]);

    const streamStrokePoint = useCallback((data: {
        strokeId: string;
        point: Point;
        color: string;
        width: number;
        tool: Tool;
        isStart: boolean;
    }) => {
        emitStrokeStream(data);
    }, [emitStrokeStream]);

    const undo = useCallback(() => {
        emitUndo();
    }, [emitUndo]);

    const redo = useCallback(() => {
        emitRedo();
    }, [emitRedo]);

    const clearCanvas = useCallback(() => {
        emitClear();
    }, [emitClear]);

    return {
        strokes,
        streamingStrokes,
        users,
        currentUser,
        addStroke,
        updateCursor,
        streamStrokePoint,
        undo,
        redo,
        clearCanvas,
        canUndo: strokes.length > 0,
        canRedo: true, // Optimistically allow redo
        isConnected,
        error,
        roomDeleted,
    };
};
