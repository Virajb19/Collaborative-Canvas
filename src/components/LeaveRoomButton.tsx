"use client"

import { LogOut, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'nextjs-toploader/app';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '~/components/ui/tooltip';

interface LeaveRoomButtonProps {
    roomId: string;
    onLeaveRoom?: () => void;
}

export const LeaveRoomButton = ({ roomId, onLeaveRoom }: LeaveRoomButtonProps) => {
    const router = useRouter();

    const leaveRoomMutation = api.room.leave.useMutation({
        onSuccess: (data) => {
            toast.success(data.message);
            // Call onLeaveRoom callback if provided (for socket cleanup)
            onLeaveRoom?.();
            router.push('/');
        },
        onError: (error) => {
            // If owner tries to leave, show helpful message
            if (error.data?.code === 'FORBIDDEN') {
                toast.error(error.message, {
                    description: 'Delete the room from the rooms page instead.',
                });
            } else {
                toast.error(error.message);
            }
        },
    });

    const handleLeave = () => {
        leaveRoomMutation.mutate({ roomId });
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <motion.div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLeave}
                        disabled={leaveRoomMutation.isPending}
                        className="
                            relative overflow-hidden group
                            bg-gradient-to-r from-red-600 to-red-500
                            hover:from-red-500 hover:to-red-400
                            text-white
                            border border-red-700/50
                            shadow-lg shadow-red-500/30
                            px-4 py-2 gap-2
                            transition-all duration-300 ease-out
                            disabled:opacity-60 disabled:cursor-not-allowed
                        "
                    >
                        {/* glow sweep */}
                        <span
                            className="
                            absolute inset-0 -translate-x-full
                            bg-gradient-to-r
                            from-transparent
                            via-white/20
                            to-transparent
                            group-hover:translate-x-full
                            transition-transform duration-700
                            "
                        />

                        {leaveRoomMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                        ) : (
                            <LogOut className="w-4 h-4 relative z-10" />
                        )}
                        <span className="relative z-10">
                            {leaveRoomMutation.isPending ? 'Leaving...' : 'Leave Room'}
                        </span>
                    </Button>
                </motion.div>
            </TooltipTrigger>
            <TooltipContent>
                <p>Leave this room</p>
            </TooltipContent>
        </Tooltip>
    );
};
