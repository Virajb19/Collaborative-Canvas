"use client";

import { LogOut, Radio, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useRouter } from "nextjs-toploader/app";
import { api } from "~/trpc/react";
import { toast } from "sonner";

interface LeftSidebarProps {
    roomCode: string;
    isConnected: boolean;
    isOwner: boolean;
}

export function LeftSidebar({ roomCode, isConnected, isOwner }: LeftSidebarProps) {
    const router = useRouter();

    const leaveRoomMutation = api.room.leave.useMutation({
        onMutate: () => {
            toast.loading('Leaving room...', { id: 'leave-room' });
        },
        onSuccess: (data) => {
            toast.success(data.message, { id: 'leave-room' });
            router.push('/');
        },
        onError: (error) => {
            toast.dismiss('leave-room');
            if (error.data?.code === 'FORBIDDEN') {
                toast.error(error.message, {
                    description: 'Delete the room from the rooms page instead.',
                });
            } else {
                toast.error(error.message);
            }
        },
    });

    const handleLeaveRoom = () => {
        leaveRoomMutation.mutate({ roomId: roomCode });
    };

    return (
        <aside className="w-56 border-r bg-card flex flex-col">
            {/* Room Info Card */}
            <div className="p-4">
                <div className="p-4 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="flex items-center gap-2 mb-1">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Room
                        </span>
                    </div>
                    <p className="font-mono font-semibold text-lg tracking-wide">{roomCode}</p>
                </div>
            </div>

            {/* Live Indicator */}
            <div className="px-4 pb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Radio className={`w-4 h-4 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
                    <span>{isConnected ? 'Live session active' : 'Connecting...'}</span>
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Leave Room Button - only for non-owners */}
            {!isOwner && (
                <div className="p-4 border-t">
                    <Button
                        variant="outline"
                        onClick={handleLeaveRoom}
                        disabled={leaveRoomMutation.isPending}
                        className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20 hover:border-destructive/40 transition-colors"
                    >
                        {leaveRoomMutation.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <LogOut className="w-4 h-4" />
                        )}
                        {leaveRoomMutation.isPending ? 'Leaving...' : 'Leave Room'}
                    </Button>
                </div>
            )}
        </aside>
    );
}
