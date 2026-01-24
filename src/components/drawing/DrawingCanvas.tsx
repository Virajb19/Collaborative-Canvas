import { useRef, useEffect, useCallback } from 'react';
import { useDrawingCanvas } from '~/hooks/useDrawingCanvas';
import type { DrawingStroke, Point, Tool } from '~/types/drawing';

interface StreamingStroke {
  strokeId: string;
  userId: string;
  points: Point[];
  color: string;
  width: number;
  tool: string;
}

interface DrawingCanvasProps {
  strokes: DrawingStroke[];
  streamingStrokes: Map<string, StreamingStroke>;
  userId: string;
  currentTool: Tool;
  currentColor: string;
  currentWidth: number;
  onStrokeComplete: (stroke: DrawingStroke) => void;
  onStrokeStream: (data: {
    strokeId: string;
    point: Point;
    color: string;
    width: number;
    tool: Tool;
    isStart: boolean;
  }) => void;
  onCursorMove: (position: Point | null) => void;
}

export const DrawingCanvas = ({
  strokes,
  streamingStrokes,
  userId,
  currentTool,
  currentColor,
  currentWidth,
  onStrokeComplete,
  onStrokeStream,
  onCursorMove,
}: DrawingCanvasProps) => {
  const streamingCanvasRef = useRef<HTMLCanvasElement>(null);

  const {
    canvasRef,
    startDrawing,
    draw,
    stopDrawing,
    handleMouseLeave,
  } = useDrawingCanvas({
    onStrokeComplete,
    onStrokeStream,
    onCursorMove,
    strokes,
    userId,
    currentTool,
    currentColor,
    currentWidth,
  });

  // Draw streaming strokes from other users on the overlay canvas
  const drawStreamingStrokes = useCallback(() => {
    const canvas = streamingCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Resize canvas if needed
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
    }

    // Clear the streaming canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw each streaming stroke (only from other users)
    streamingStrokes.forEach((stroke) => {
      if (stroke.userId === userId || stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';

      const firstPoint = stroke.points[0];
      if (!firstPoint) return;

      ctx.moveTo(firstPoint.x, firstPoint.y);
      for (let i = 1; i < stroke.points.length; i++) {
        const point = stroke.points[i];
        if (point) {
          ctx.lineTo(point.x, point.y);
        }
      }
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
    });
  }, [streamingStrokes, userId]);

  // Redraw streaming strokes whenever they change
  useEffect(() => {
    drawStreamingStrokes();
  }, [streamingStrokes, drawStreamingStrokes]);

  return (
    <div className="relative w-full h-full">
      {/* Main canvas for completed strokes */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={handleMouseLeave}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {/* Overlay canvas for streaming strokes from other users */}
      <canvas
        ref={streamingCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
};
