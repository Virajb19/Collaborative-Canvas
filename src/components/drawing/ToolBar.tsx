import { Paintbrush, Eraser, Undo2, Redo2, Trash2 } from 'lucide-react';
import { BRUSH_COLORS } from '~/types/drawing';
import type { Tool } from '~/types/drawing';
import { cn } from '~/lib/utils';
import { Slider } from '~/components/ui/slider';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip';

interface ToolbarProps {
  currentTool: Tool;
  currentColor: string;
  currentWidth: number;
  onToolChange: (tool: Tool) => void;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar = ({
  currentTool,
  currentColor,
  currentWidth,
  onToolChange,
  onColorChange,
  onWidthChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo,
}: ToolbarProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
      <div className="flex items-center gap-1 bg-toolbar text-toolbar-foreground rounded-2xl p-2 shadow-toolbar">
        {/* Tools */}
        <div className="flex items-center gap-1 pr-3 border-r border-toolbar-hover">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToolChange('brush')}
                className={cn(
                  'p-3 rounded-xl transition-all duration-200',
                  currentTool === 'brush'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-toolbar-hover'
                )}
              >
                <Paintbrush size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Brush (B)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onToolChange('eraser')}
                className={cn(
                  'p-3 rounded-xl transition-all duration-200',
                  currentTool === 'eraser'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-toolbar-hover'
                )}
              >
                <Eraser size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Eraser (E)</TooltipContent>
          </Tooltip>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-1 px-3 border-r border-toolbar-hover">
          {BRUSH_COLORS.map((color) => (
            <Tooltip key={color}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => onColorChange(color)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-all duration-200 border-2',
                    currentColor === color && currentTool === 'brush'
                      ? 'border-white scale-110'
                      : 'border-transparent hover:scale-110'
                  )}
                  style={{ backgroundColor: color }}
                />
              </TooltipTrigger>
              <TooltipContent>{color}</TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Stroke Width */}
        <div className="flex items-center gap-3 px-3 border-r border-toolbar-hover min-w-[140px]">
          <div
            className="w-5 h-5 rounded-full bg-toolbar-foreground flex-shrink-0"
            style={{
              transform: `scale(${0.3 + (currentWidth / 50) * 0.7})`,
            }}
          />
          <Slider
            value={[currentWidth]}
            onValueChange={(value) => onWidthChange(value[0] as number)}
            min={2}
            max={50}
            step={1}
            className="w-20"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 pl-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onUndo}
                disabled={!canUndo}
                className={cn(
                  'p-3 rounded-xl transition-all duration-200',
                  canUndo
                    ? 'hover:bg-toolbar-hover'
                    : 'opacity-40 cursor-not-allowed'
                )}
              >
                <Undo2 size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRedo}
                disabled={!canRedo}
                className={cn(
                  'p-3 rounded-xl transition-all duration-200',
                  canRedo
                    ? 'hover:bg-toolbar-hover'
                    : 'opacity-40 cursor-not-allowed'
                )}
              >
                <Redo2 size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Redo (Ctrl+Y)</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onClear}
                className="p-3 rounded-xl transition-all duration-200 hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 size={20} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Clear Canvas</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
