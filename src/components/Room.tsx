"use client"

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { Button } from '~/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import Link from 'next/link';
import type { UserRole } from 'generated/prisma';
import { useRoomStore } from '~/lib/store';
import { CanvasLayout } from '~/components/canvas/CanvasLayout';

export type RoomMemberWithUser = {
    userId: number;
    role: UserRole;
    user: {
        id: number;
        username: string;
        profilePicture: string | null;
    };
};

export default function Room({ roomMembers }: { roomMembers: RoomMemberWithUser[] }) {
    const params = useParams<{ roomId: string }>();
    const router = useRouter();
    const roomId = params.roomId;

    const { showDeletedDialog, setShowDeletedDialog } = useRoomStore();

    const handleGoHome = () => {
        setShowDeletedDialog(false);
        router.push('/');
    };

    if (!roomId) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <h1 className="text-2xl font-bold text-foreground mb-4">Invalid Room</h1>
                    <Button asChild>
                        <Link href="/">Go Home</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            {/* New Canvas Layout */}
            <CanvasLayout roomId={roomId} roomMembers={roomMembers} />

            {/* Room Deleted Dialog */}
            <AlertDialog open={showDeletedDialog} onOpenChange={setShowDeletedDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="text-center sm:text-center">
                        <motion.div
                            className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center"
                            animate={{ rotate: [0, 7, -7, 0] }}
                            transition={{ duration: 0.7, repeat: Infinity, repeatDelay: 0.5 }}
                        >
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </motion.div>
                        <AlertDialogTitle className="text-2xl font-bold">
                            Room Deleted
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            This room has been deleted by the owner. You will be redirected to the home page.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="sm:justify-center">
                        <AlertDialogAction
                            onClick={handleGoHome}
                            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                        >
                            Go to Home
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
