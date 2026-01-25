"use client"

import { motion } from 'framer-motion';
import { Trash2, Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useRouter } from 'nextjs-toploader/app';
import { api } from '~/trpc/react';
import { connectSocket, disconnectSocket } from '~/lib/socket';
import { SOCKET_EVENTS } from '~/lib/socket.events';
import { toast } from 'sonner';

type DeleteButtonProps = {
    roomId: string;
};

export default function DeleteButton({ roomId }: DeleteButtonProps) {
    const router = useRouter();

    // const utils = api.useUtils();

    const deleteRoomMutation = api.room.delete.useMutation({
        onSuccess: async (data) => {
            // Connect to socket and broadcast to all users in the room
            const socket = connectSocket();

            // Wait for socket to connect before emitting
            const emitRoomDeleted = () => {
                socket.emit(SOCKET_EVENTS.ROOM_DELETED, { roomId: data.roomId });
                // Disconnect after a short delay to ensure the event is sent
                setTimeout(() => {
                    disconnectSocket();
                }, 500);
            };

            if (socket.connected) {
                emitRoomDeleted();
            } else {
                socket.once('connect', emitRoomDeleted);
            }

            await new Promise((resolve) => setTimeout(resolve, 1000));

            router.refresh();  
            // utils.user.getRooms.refetch();
        },
        onError: (err) => {
            console.error(err)
            toast.error(err.message)
        }
    });

    const handleDeleteRoom = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent card click navigation
        if (deleteRoomMutation.isPending) return;

        deleteRoomMutation.mutate({ roomId });
    };

    const isDeleting = deleteRoomMutation.isPending;

    return (
        <motion.button
            onClick={handleDeleteRoom}
            disabled={isDeleting}
            className={twMerge(
                "absolute top-3 right-3 z-10 p-2 rounded-lg transition-all duration-200",
                isDeleting
                    ? "bg-red-500/20"
                    : "hover:bg-red-500/40 cursor-pointer"
            )}
        >
            {isDeleting ? (
                <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
            ) : (
                <Trash2 className="w-4 h-4 text-red-500" />
            )}
        </motion.button>
    );
}
