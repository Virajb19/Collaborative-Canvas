import { useEffect, useRef, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket } from '~/lib/socket';
import { SOCKET_EVENTS } from '~/lib/socket.events';
import type { DrawingStroke, User, Point } from '~/types/drawing';
import { toast } from 'sonner';
import { useRoomStore } from '~/lib/store'
import { useRouter } from 'next/navigation';

interface UseSocketOptions {
  roomId: string;
  userId: string;
  userName: string;
  userColor: string;
}

interface StreamingStroke {
  strokeId: string;
  userId: string;
  points: Point[];
  color: string;
  width: number;
  tool: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  users: User[];
  strokes: DrawingStroke[];
  streamingStrokes: Map<string, StreamingStroke>;
  error: string | null;
  roomDeleted: boolean;
  canUndo: boolean;
  canRedo: boolean;
  emitStroke: (stroke: DrawingStroke) => void;
  emitStrokeStream: (data: { strokeId: string; point: Point; color: string; width: number; tool: string; isStart: boolean }) => void;
  emitCursor: (position: Point | null) => void;
  emitUndo: () => void;
  emitRedo: () => void;
  emitClear: () => void;
  joinRoom: () => void;
  leaveRoom: () => void;
}

export const useSocket = ({
  roomId,
  userId,
  userName,
  userColor,
}: UseSocketOptions): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [strokes, setStrokes] = useState<DrawingStroke[]>([]);
  const [streamingStrokes, setStreamingStrokes] = useState<Map<string, StreamingStroke>>(new Map());
  const [error, setError] = useState<string | null>(null);
  const [roomDeleted, setRoomDeleted] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);


  const { setShowDeletedDialog } = useRoomStore()
  const router = useRouter()

  useEffect(() => {
    // Don't connect until we have a valid userId
    if (!userId) {
      return;
    }

    const socket = connectSocket();
    socketRef.current = socket;

    // Helper function to join room
    const joinRoomHandler = () => {
      setIsConnected(true);
      setError(null);
      // Auto-join room on connect/reconnect
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        roomId,
        userId,
        userName,
        userColor,
      });
    };

    // Connection handlers
    socket.on(SOCKET_EVENTS.CONNECT, joinRoomHandler);

    // Handle reconnection - rejoin room automatically
    socket.io.on('reconnect', () => {
      console.log('Socket reconnected, rejoining room...');
      joinRoomHandler();
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    // Room handlers
    socket.on(SOCKET_EVENTS.ROOM_JOINED, (data: { 
      users: User[]; 
      strokes: DrawingStroke[];
      canUndo?: boolean;
      canRedo?: boolean;
    }) => {
      setUsers(data.users);
      setStrokes(data.strokes);
      if (data.canUndo !== undefined) setCanUndo(data.canUndo);
      if (data.canRedo !== undefined) setCanRedo(data.canRedo);
    });

    socket.on(SOCKET_EVENTS.ROOM_ERROR, (data: { message: string }) => {
      setError(data.message);
    });

    // User presence handlers
    socket.on(SOCKET_EVENTS.USER_JOIN, (user: User) => {
      setUsers((prev) => {
        // Only show toast if this is a new user (not ourselves and not already in list)
        const isNew = !prev.some((u) => u.id === user.id) && user.id !== userId;
        if (isNew) {
          toast.success(`${user.name} joined the room`, {
            style: {
              background: `linear-gradient(135deg, ${user.color}15, ${user.color}05)`,
              borderLeft: `4px solid ${user.color}`,
            },
            duration: 3000,
          });
        }
        router.refresh();
        return [...prev.filter((u) => u.id !== user.id), user];
      });
    });

    socket.on(SOCKET_EVENTS.USER_LEAVE, (data: { userId: string; userName?: string; userColor?: string }) => {
      setUsers((prev) => {
        const leavingUser = prev.find((u) => u.id === data.userId);
        if (leavingUser && leavingUser.id !== userId) {
          toast.info(`${leavingUser.name} left the room`, {
            style: {
              background: `linear-gradient(135deg, ${leavingUser.color}15, ${leavingUser.color}05)`,
              borderLeft: `4px solid ${leavingUser.color}`,
            },
            duration: 3000,
          });
        }
        router.refresh();
        return prev.filter((u) => u.id !== data.userId);
      });
    });

    socket.on(SOCKET_EVENTS.USERS_LIST, (usersList: User[]) => {
      setUsers(usersList);
    });

    // Drawing handlers
    socket.on(SOCKET_EVENTS.STROKE_RECEIVED, (stroke: DrawingStroke) => {
      setStrokes((prev) => [...prev, stroke]);
      // Remove from streaming strokes when final stroke is received
      setStreamingStrokes((prev) => {
        const next = new Map(prev);
        // Find and remove any streaming stroke from this user
        for (const [key, value] of next) {
          if (value.userId === stroke.userId) {
            next.delete(key);
          }
        }
        return next;
      });
    });

    // Handle real-time stroke streaming
    socket.on(SOCKET_EVENTS.STROKE_STREAM_RECEIVED, (data: {
      strokeId: string;
      userId: string;
      point: { x: number; y: number };
      color: string;
      width: number;
      tool: string;
      isStart: boolean;
    }) => {
      setStreamingStrokes((prev) => {
        const next = new Map(prev);
        if (data.isStart) {
          // Start a new streaming stroke
          next.set(data.strokeId, {
            strokeId: data.strokeId,
            userId: data.userId,
            points: [data.point],
            color: data.color,
            width: data.width,
            tool: data.tool,
          });
        } else {
          // Add point to existing streaming stroke
          const existing = next.get(data.strokeId);
          if (existing) {
            next.set(data.strokeId, {
              ...existing,
              points: [...existing.points, data.point],
            });
          }
        }
        return next;
      });
    });

    socket.on(SOCKET_EVENTS.CANVAS_CLEARED, () => {
      setStrokes([]);
      setCanUndo(false);
      setCanRedo(false);
    });

    socket.on(SOCKET_EVENTS.CANVAS_STATE, (data: { 
      strokes: DrawingStroke[]; 
      canUndo?: boolean;
      canRedo?: boolean;
      action?: 'undo' | 'redo';
      actionBy?: { id: string; name: string } | null;
    }) => {
      setStrokes(data.strokes);
      if (data.canUndo !== undefined) setCanUndo(data.canUndo);
      if (data.canRedo !== undefined) setCanRedo(data.canRedo);
      
      // Show toast for undo/redo actions by other users
      if (data.action && data.actionBy && data.actionBy.id !== userId) {
        const actionText = data.action === 'undo' ? 'undid a stroke' : 'redid a stroke';
        toast.info(`${data.actionBy.name} ${actionText}`, {
          duration: 2000,
        });
      }
    });

    // Cursor handlers
    socket.on(SOCKET_EVENTS.CURSOR_UPDATE, (data: { userId: string; position: Point | null }) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === data.userId ? { ...u, cursor: data.position } : u))
      );
    });

    // Room deleted handler
    socket.on(SOCKET_EVENTS.ROOM_DELETED, () => {
        setShowDeletedDialog(true)
    });

    // Handle tab close/navigation - send leave room before unloading
    const handleBeforeUnload = () => {
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId });
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Remove beforeunload listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Leave room and cleanup socket listeners
      socket.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId });
      socket.off(SOCKET_EVENTS.CONNECT);
      socket.off(SOCKET_EVENTS.DISCONNECT);
      socket.off(SOCKET_EVENTS.CONNECT_ERROR);
      socket.off(SOCKET_EVENTS.ROOM_JOINED);
      socket.off(SOCKET_EVENTS.ROOM_ERROR);
      socket.off(SOCKET_EVENTS.USER_JOIN);
      socket.off(SOCKET_EVENTS.USER_LEAVE);
      socket.off(SOCKET_EVENTS.USERS_LIST);
      socket.off(SOCKET_EVENTS.STROKE_RECEIVED);
      socket.off(SOCKET_EVENTS.STROKE_STREAM_RECEIVED);
      socket.off(SOCKET_EVENTS.CANVAS_CLEARED);
      socket.off(SOCKET_EVENTS.CANVAS_STATE);
      socket.off(SOCKET_EVENTS.CURSOR_UPDATE);
      socket.off(SOCKET_EVENTS.ROOM_DELETED);
      socket.io.off('reconnect');
      disconnectSocket();
    };
  }, [roomId, userId, userName, userColor]);

  const emitStroke = useCallback((stroke: DrawingStroke) => {
    // Add stroke to local state immediately (server only broadcasts to others)
    setStrokes((prev) => [...prev, stroke]);
    setCanUndo(true);
    setCanRedo(false); // New stroke clears redo stack
    socketRef.current?.emit(SOCKET_EVENTS.STROKE_ADD, { roomId, stroke });
  }, [roomId]);

  const emitStrokeStream = useCallback((data: {
    strokeId: string;
    point: Point;
    color: string;
    width: number;
    tool: string;
    isStart: boolean;
  }) => {
    socketRef.current?.emit(SOCKET_EVENTS.STROKE_STREAM, { roomId, userId, ...data });
  }, [roomId, userId]);

  const emitCursor = useCallback((position: Point | null) => {
    socketRef.current?.emit(SOCKET_EVENTS.CURSOR_MOVE, { roomId, userId, position });
  }, [roomId, userId]);

  const emitUndo = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.CANVAS_UNDO, { roomId, userId });
  }, [roomId, userId]);

  const emitRedo = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.CANVAS_REDO, { roomId, userId });
  }, [roomId, userId]);

  const emitClear = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.CANVAS_CLEAR, { roomId });
  }, [roomId]);

  const joinRoom = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.JOIN_ROOM, {
      roomId,
      userId,
      userName,
      userColor,
    });
  }, [roomId, userId, userName, userColor]);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit(SOCKET_EVENTS.LEAVE_ROOM, { roomId, userId });
  }, [roomId, userId]);

  return {
    socket: socketRef.current,
    isConnected,
    users,
    strokes,
    streamingStrokes,
    error,
    roomDeleted,
    canUndo,
    canRedo,
    emitStroke,
    emitStrokeStream,
    emitCursor,
    emitUndo,
    emitRedo,
    emitClear,
    joinRoom,
    leaveRoom,
  };
};
