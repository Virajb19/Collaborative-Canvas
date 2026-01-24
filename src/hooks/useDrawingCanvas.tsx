import { useRef, useCallback, useEffect, useState } from 'react';
import type { Point, DrawingStroke, Tool } from '~/types/drawing';

type UseDrawingCanvasProps = {
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
    strokes: DrawingStroke[];
    userId: string;
    currentTool: Tool;
    currentColor: string;
    currentWidth: number;
}

function isTouchEvent(
    e: React.MouseEvent | React.TouchEvent
): e is React.TouchEvent {
    return "touches" in e;
}


export const useDrawingCanvas = ({
    onStrokeComplete,
    onStrokeStream,
    onCursorMove,
    strokes,
    userId,
    currentTool,
    currentColor,
    currentWidth,
}: UseDrawingCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const isDrawingRef = useRef(false);
    const currentStrokeRef = useRef<Point[]>([]);
    const currentStrokeIdRef = useRef<string>('');
    const [isReady, setIsReady] = useState(false);

    const setupCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const parent = canvas.parentElement;
        if (!parent) return;

        const rect = parent.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        contextRef.current = ctx;
        setIsReady(true);
    }, []);

    useEffect(() => {
        setupCanvas();

        const handleResize = () => {
            setupCanvas();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [setupCanvas]);

    const drawStroke = useCallback((stroke: DrawingStroke) => {
        const ctx = contextRef.current;
        if (!ctx || stroke.points.length < 2) return;

        const firstPoint = stroke.points[0];
        if (!firstPoint) return;

        ctx.beginPath();
        ctx.strokeStyle = stroke.tool === 'eraser' ? '#ffffff' : stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.globalCompositeOperation = stroke.tool === 'eraser' ? 'destination-out' : 'source-over';

        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (let i = 1; i < stroke.points.length; i++) {
            const point = stroke.points[i];
            if (point) {
                ctx.lineTo(point.x, point.y);
            }
        }
        ctx.stroke();
        ctx.globalCompositeOperation = 'source-over';
    }, []);

    const redrawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = contextRef.current;
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

        strokes.forEach(drawStroke);
    }, [strokes, drawStroke]);

    useEffect(() => {
        if (isReady) {
            redrawCanvas();
        }
    }, [strokes, isReady, redrawCanvas]);

    const getCanvasPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        let clientX: number, clientY: number;

        if ('touches' in e || isTouchEvent(e)) {
            const touch = e.touches[0];
            if (!touch) return null;
            clientX = touch.clientX;
            clientY = touch.clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }, []);

    const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const point = getCanvasPoint(e);
        if (!point) return;

        // Generate a unique stroke ID for this drawing session
        const strokeId = `${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        currentStrokeIdRef.current = strokeId;

        isDrawingRef.current = true;
        currentStrokeRef.current = [point];

        const ctx = contextRef.current;
        if (!ctx) return;

        ctx.beginPath();
        ctx.strokeStyle = currentTool === 'eraser' ? '#ffffff' : currentColor;
        ctx.lineWidth = currentWidth;
        ctx.globalCompositeOperation = currentTool === 'eraser' ? 'destination-out' : 'source-over';
        ctx.moveTo(point.x, point.y);

        // Stream the first point to other users
        onStrokeStream({
            strokeId,
            point,
            color: currentColor,
            width: currentWidth,
            tool: currentTool,
            isStart: true,
        });
    }, [getCanvasPoint, currentTool, currentColor, currentWidth, userId, onStrokeStream]);

    const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const point = getCanvasPoint(e);
        if (point) {
            onCursorMove(point);
        }

        if (!isDrawingRef.current || !point) return;

        const ctx = contextRef.current;
        if (!ctx) return;

        currentStrokeRef.current.push(point);
        ctx.lineTo(point.x, point.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(point.x, point.y);

        // Stream the point to other users
        onStrokeStream({
            strokeId: currentStrokeIdRef.current,
            point,
            color: currentColor,
            width: currentWidth,
            tool: currentTool,
            isStart: false,
        });
    }, [getCanvasPoint, onCursorMove, currentColor, currentWidth, currentTool, onStrokeStream]);

    const stopDrawing = useCallback(() => {
        if (!isDrawingRef.current) return;

        isDrawingRef.current = false;
        const ctx = contextRef.current;
        if (ctx) {
            ctx.globalCompositeOperation = 'source-over';
        }

        if (currentStrokeRef.current.length > 1) {
            const stroke: DrawingStroke = {
                id: currentStrokeIdRef.current,
                points: [...currentStrokeRef.current],
                color: currentColor,
                width: currentWidth,
                tool: currentTool,
                userId,
                timestamp: Date.now(),
            };
            onStrokeComplete(stroke);
        }
        currentStrokeRef.current = [];
        currentStrokeIdRef.current = '';
    }, [userId, currentColor, currentWidth, currentTool, onStrokeComplete]);

    const handleMouseLeave = useCallback(() => {
        onCursorMove(null);
        if (isDrawingRef.current) {
            stopDrawing();
        }
    }, [onCursorMove, stopDrawing]);

    return {
        canvasRef,
        startDrawing,
        draw,
        stopDrawing,
        handleMouseLeave,
        isReady,
    };
};
