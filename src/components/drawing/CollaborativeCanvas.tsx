import { useState, useEffect } from 'react';
import type { Tool } from '~/types/drawing';
import { useCollaborativeDrawing } from '~/hooks/useCollaborativeDrawing';
import { DrawingCanvas } from '~/components/drawing/DrawingCanvas';
import { Toolbar } from './ToolBar';
import { UserCursors } from './UserCursors';
import { UsersPanel } from './UsersPanel';

interface CollaborativeCanvasProps {
  roomId: string;
  onRoomDeleted?: () => void;
}

export const CollaborativeCanvas = ({ roomId, onRoomDeleted }: CollaborativeCanvasProps) => {
  const [currentTool, setCurrentTool] = useState<Tool>('brush');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentWidth, setCurrentWidth] = useState(8);

  const {
    strokes,
    users,
    currentUser,
    addStroke,
    updateCursor,
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
    if (roomDeleted && onRoomDeleted) {
      onRoomDeleted();
    }
  }, [roomDeleted, onRoomDeleted]);

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
          userId={currentUser.id}
          currentTool={currentTool}
          currentColor={currentColor}
          currentWidth={currentWidth}
          onStrokeComplete={addStroke}
          onCursorMove={updateCursor}
        />
        <UserCursors users={users} currentUserId={currentUser.id} />
      </div>

      {/* Room ID badge with connection status */}
      <div className="fixed top-4 left-4 z-50">
        <div className="bg-card rounded-lg shadow-panel px-3 py-2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs text-muted-foreground">Room: </span>
          <span className="text-sm font-mono font-medium">{roomId}</span>
        </div>
        {error && (
          <div className="mt-2 bg-destructive/10 text-destructive text-xs px-3 py-2 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {/* Users panel */}
      <UsersPanel users={users} currentUserId={currentUser.id} />

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
