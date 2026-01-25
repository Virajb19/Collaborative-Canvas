import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Tool } from '~/types/drawing';
import { useCollaborativeDrawing } from '~/hooks/useCollaborativeDrawing';
import { DrawingCanvas } from '~/components/drawing/DrawingCanvas';
import { Toolbar } from './ToolBar';
import { UserCursors } from './UserCursors';
import { UsersPanel } from './UsersPanel';
import { useRoomStore } from '~/lib/store';
import { LeaveRoomButton } from '~/components/LeaveRoomButton';
import type { RoomMemberWithUser } from '~/components/Room';

// ...

interface CollaborativeCanvasProps {
  roomId: string;
  roomMembers: RoomMemberWithUser[];
}

export const CollaborativeCanvas = ({ roomId, roomMembers }: CollaborativeCanvasProps) => {
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
    <div className="relative w-full h-screen bg-background overflow-hidden">
      {/* Canvas container */}
      <div className="absolute inset-4 bottom-24 bg-canvas rounded-2xl shadow-panel overflow-hidden canvas-grid">
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

      {/* Top left controls - Connection status and Leave button */}
      <div className="fixed top-20 left-4 z-40 flex flex-col gap-2">
        {/* Connection status badge */}
        <div className="bg-card/90 backdrop-blur-sm rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3 border border-border/50">
          <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${isConnected ? 'bg-green-500 shadow-[0_0_8px_2px_rgba(34,197,94,0.4)]' : 'bg-red-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.4)]'}`} />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Room</span>
            <span className="text-sm font-mono font-bold text-foreground">{roomId}</span>
          </div>
        </div>

        {/* Leave Room button - only show for non-owners */}
        {!isOwner && <LeaveRoomButton roomId={roomId} />}

        {/* Error message */}
        {error && (
          <div className="bg-destructive/10 backdrop-blur-sm text-destructive text-xs px-4 py-2 rounded-xl border border-destructive/20">
            {error}
          </div>
        )}
      </div>

      {/* Users panel */}
      <UsersPanel users={users} currentUserId={currentUser.id} roomMembers={roomMembers} />

      {/* Toolbar */}
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
};
