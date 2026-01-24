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
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLeave}
                        disabled={leaveRoomMutation.isPending}
                        className="
                            group relative gap-2 overflow-hidden
                            bg-card/70 backdrop-blur-xl
                            border border-destructive/30
                            text-destructive
                            hover:text-destructive
                            transition-all duration-300

                            hover:bg-destructive/10
                            hover:border-destructive/60
                            hover:shadow-[0_0_20px_-5px_hsl(var(--destructive)/0.6)]
                            disabled:opacity-50 disabled:cursor-not-allowed
                        "
                    >
                        {/* glow sweep */}
                        <span
                            className="
                            absolute inset-0 -translate-x-full
                            bg-gradient-to-r
                            from-transparent
                            via-destructive/20
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
                        <span className="hidden sm:inline relative z-10">
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
