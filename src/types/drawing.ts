export type Tool = 'brush' | 'eraser';

export interface Point {
  x: number;
  y: number;
}

export interface DrawingStroke {
  id: string;
  points: Point[];
  color: string;
  width: number;
  tool: Tool;
  userId: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  color: string;
  cursor: Point | null;
  isOnline: boolean;
}

export interface DrawingAction {
  type: 'draw' | 'undo' | 'redo' | 'clear';
  stroke?: DrawingStroke;
  userId: string;
  timestamp: number;
}

export interface CursorUpdate {
  userId: string;
  position: Point | null;
}

export const USER_COLORS = [
  'hsl(0, 84%, 60%)',      // red
  'hsl(25, 95%, 53%)',     // orange
  'hsl(38, 92%, 50%)',     // amber
  'hsl(142, 71%, 45%)',    // green
  'hsl(173, 80%, 40%)',    // teal
  'hsl(189, 94%, 43%)',    // cyan
  'hsl(217, 91%, 60%)',    // blue
  'hsl(239, 84%, 67%)',    // indigo
  'hsl(280, 85%, 65%)',    // purple
  'hsl(330, 80%, 60%)',    // pink
];

export const BRUSH_COLORS = [
  '#000000', // black
  '#374151', // gray
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
];
