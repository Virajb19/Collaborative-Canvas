import { useEffect, useRef, useCallback, useState } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket, connectSocket, disconnectSocket } from '~/lib/socket';
import { SOCKET_EVENTS } from '~/lib/socket.events';
import type { DrawingStroke, User, Point } from '~/types/drawing';

interface UseSocketOptions {
  roomId: string;
  userId: string;
  userName: string;
  userColor: string;
}

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  users: User[];
  strokes: DrawingStroke[];
  error: string | null;
  roomDeleted: boolean;
  emitStroke: (stroke: DrawingStroke) => void;
  emitCursor: (position: Point | null) => void;
  emitUndo: (strokes: DrawingStroke[]) => void;
  emitRedo: (strokes: DrawingStroke[]) => void;
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
  const [error, setError] = useState<string | null>(null);
  const [roomDeleted, setRoomDeleted] = useState(false);

  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    // Connection handlers
    socket.on(SOCKET_EVENTS.CONNECT, () => {
      setIsConnected(true);
      setError(null);
      // Auto-join room on connect
      socket.emit(SOCKET_EVENTS.JOIN_ROOM, {
        roomId,
        userId,
        userName,
        userColor,
      });
    });

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setIsConnected(false);
    });

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
      setError(`Connection error: ${err.message}`);
      setIsConnected(false);
    });

    // Room handlers
    socket.on(SOCKET_EVENTS.ROOM_JOINED, (data: { users: User[]; strokes: DrawingStroke[] }) => {
      setUsers(data.users);
      setStrokes(data.strokes);
    });

    socket.on(SOCKET_EVENTS.ROOM_ERROR, (data: { message: string }) => {
      setError(data.message);
    });

    // User presence handlers
    socket.on(SOCKET_EVENTS.USER_JOIN, (user: User) => {
      setUsers((prev) => [...prev.filter((u) => u.id !== user.id), user]);
    });

    socket.on(SOCKET_EVENTS.USER_LEAVE, (data: { userId: string }) => {
      setUsers((prev) => prev.filter((u) => u.id !== data.userId));
    });

    socket.on(SOCKET_EVENTS.USERS_LIST, (usersList: User[]) => {
      setUsers(usersList);
    });

    // Drawing handlers
    socket.on(SOCKET_EVENTS.STROKE_RECEIVED, (stroke: DrawingStroke) => {
      setStrokes((prev) => [...prev, stroke]);
    });

    socket.on(SOCKET_EVENTS.CANVAS_CLEARED, () => {
      setStrokes([]);
    });

    socket.on(SOCKET_EVENTS.CANVAS_STATE, (data: { strokes: DrawingStroke[] }) => {
      setStrokes(data.strokes);
    });

    // Cursor handlers
    socket.on(SOCKET_EVENTS.CURSOR_UPDATE, (data: { userId: string; position: Point | null }) => {
      setUsers((prev) =>
        prev.map((u) => (u.id === data.userId ? { ...u, cursor: data.position } : u))
      );
    });

    // Room deleted handler
    socket.on(SOCKET_EVENTS.ROOM_DELETED, () => {
      setRoomDeleted(true);
    });

    return () => {
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
      socket.off(SOCKET_EVENTS.CANVAS_CLEARED);
      socket.off(SOCKET_EVENTS.CANVAS_STATE);
      socket.off(SOCKET_EVENTS.CURSOR_UPDATE);
      socket.off(SOCKET_EVENTS.ROOM_DELETED);
      disconnectSocket();
    };
  }, [roomId, userId, userName, userColor]);

  const emitStroke = useCallback((stroke: DrawingStroke) => {
    socketRef.current?.emit(SOCKET_EVENTS.STROKE_ADD, { roomId, stroke });
  }, [roomId]);

  const emitCursor = useCallback((position: Point | null) => {
    socketRef.current?.emit(SOCKET_EVENTS.CURSOR_MOVE, { roomId, userId, position });
  }, [roomId, userId]);

  const emitUndo = useCallback((newStrokes: DrawingStroke[]) => {
    socketRef.current?.emit(SOCKET_EVENTS.CANVAS_UNDO, { roomId, strokes: newStrokes });
  }, [roomId]);

  const emitRedo = useCallback((newStrokes: DrawingStroke[]) => {
    socketRef.current?.emit(SOCKET_EVENTS.CANVAS_REDO, { roomId, strokes: newStrokes });
  }, [roomId]);

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
    error,
    roomDeleted,
    emitStroke,
    emitCursor,
    emitUndo,
    emitRedo,
    emitClear,
    joinRoom,
    leaveRoom,
  };
};
