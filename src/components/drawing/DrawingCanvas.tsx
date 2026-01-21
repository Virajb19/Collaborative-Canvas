import { useDrawingCanvas } from '~/hooks/useDrawingCanvas';
import type { DrawingStroke, Point, Tool } from '~/types/drawing';

interface DrawingCanvasProps {
  strokes: DrawingStroke[];
  userId: string;
  currentTool: Tool;
  currentColor: string;
  currentWidth: number;
  onStrokeComplete: (stroke: DrawingStroke) => void;
  onCursorMove: (position: Point | null) => void;
}

export const DrawingCanvas = ({
  strokes,
  userId,
  currentTool,
  currentColor,
  currentWidth,
  onStrokeComplete,
  onCursorMove,
}: DrawingCanvasProps) => {
  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    handleMouseLeave,
  } = useDrawingCanvas({
    onStrokeComplete,
    onCursorMove,
    strokes,
    userId,
    currentTool,
    currentColor,
    currentWidth,
  });

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-crosshair touch-none"
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={handleMouseLeave}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
};
