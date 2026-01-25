"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Tool } from '~/types/drawing';
import { useCollaborativeDrawing } from '~/hooks/useCollaborativeDrawing';
import { DrawingCanvas } from '~/components/drawing/DrawingCanvas';
import { Toolbar } from '~/components/drawing/ToolBar';
import { UserCursors } from '~/components/drawing/UserCursors';
import { useRoomStore } from '~/lib/store';
import { Header } from './Header';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';
import type { RoomMemberWithUser } from '~/components/Room';

interface CanvasLayoutProps {
    roomId: string;
    roomMembers: RoomMemberWithUser[];
}

export function CanvasLayout({ roomId, roomMembers }: CanvasLayoutProps) {
    const { data: session } = useSession();
    const { setShowDeletedDialog } = useRoomStore();
    const [currentTool, setCurrentTool] = useState<Tool>('brush');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [currentWidth, setCurrentWidth] = useState(8);

    // Check if current user is owner
    const isOwner = session?.user?.id
        ? roomMembers.some(m => m.user.id === parseInt(session.user.id) && m.role === 'OWNER')
        : false;

    const {
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
        canUndo,
        canRedo,
        isConnected,
        error,
        roomDeleted,
    } = useCollaborativeDrawing(roomId);

    // Handle room deleted
    useEffect(() => {
        if (roomDeleted) {
            setShowDeletedDialog(true);
        }
    }, [roomDeleted, setShowDeletedDialog]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'b' || e.key === 'B') {
                setCurrentTool('brush');
            } else if (e.key === 'e' || e.key === 'E') {
                setCurrentTool('eraser');
            } else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <div className="text-muted-foreground">Connecting...</div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <Header roomCode={roomId} users={users} />

            {/* Main content area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar */}
                <LeftSidebar
                    roomCode={roomId}
                    isConnected={isConnected}
                    isOwner={isOwner}
                />

                {/* Canvas Area */}
                <div className="flex-1 relative bg-[#f8f9fa] dark:bg-zinc-900 overflow-hidden">
                    {/* Grid pattern background */}
                    <div
                        className="absolute inset-0 opacity-50"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)
              `,
                            backgroundSize: '20px 20px',
                        }}
                    />

                    {/* Canvas container */}
                    <div className="absolute inset-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-xl overflow-hidden border border-border/50">
                        <DrawingCanvas
                            strokes={strokes}
                            streamingStrokes={streamingStrokes}
                            userId={currentUser.id}
                            currentTool={currentTool}
                            currentColor={currentColor}
                            currentWidth={currentWidth}
                            onStrokeComplete={addStroke}
                            onStrokeStream={streamStrokePoint}
                            onCursorMove={updateCursor}
                        />
                        <UserCursors users={users} currentUserId={currentUser.id} />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-destructive/10 backdrop-blur-sm text-destructive text-sm px-4 py-2 rounded-xl border border-destructive/20">
                            {error}
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <RightSidebar
                    activeUsers={users}
                    roomMembers={roomMembers}
                    currentUserId={currentUser.id}
                />
            </div>

            {/* Bottom Toolbar - keeping existing design */}
            <Toolbar
                currentTool={currentTool}
                currentColor={currentColor}
                currentWidth={currentWidth}
                onToolChange={setCurrentTool}
                onColorChange={setCurrentColor}
                onWidthChange={setCurrentWidth}
                onUndo={undo}
                onRedo={redo}
                onClear={clearCanvas}
                canUndo={canUndo}
                canRedo={canRedo}
            />
        </div>
    );
}
