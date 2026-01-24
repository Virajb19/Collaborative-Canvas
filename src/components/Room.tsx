"use client"

import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Copy, Check, AlertTriangle } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'nextjs-toploader/app';
import { CollaborativeCanvas } from '~/components/drawing/CollaborativeCanvas';
import { Button } from '~/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '~/components/ui/tooltip';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '~/components/ui/alert-dialog';
import { LeaveRoomButton } from '~/components/LeaveRoomButton';
import Link from 'next/link';
import type { UserRole } from 'generated/prisma';
import { useRoomStore } from '~/lib/store';

export type RoomMemberWithUser = {
    userId: number;
    role: UserRole;
    user: {
        id: number;
        username: string;
        profilePicture: string | null;
    };
};


// Floating particle component
const FloatingParticle = ({ delay, duration, x, y, size }: {
    delay: number;
    duration: number;
    x: string;
    y: string;
    size: number;
}) => (
    <motion.div
        className="absolute rounded-full bg-gradient-to-br from-primary/20 to-primary/5 blur-sm"
        style={{ left: x, top: y, width: size, height: size }}
        animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
        }}
    />
);

export default function Room({ roomMembers }: { roomMembers: RoomMemberWithUser[] }) {
    const params = useParams<{ roomId: string }>();
    const router = useRouter();
    const roomId = params.roomId;
    const [copied, setCopied] = useState(false);

    const copyRoomId = async () => {
        if (roomId) {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
        <div className="relative min-h-screen bg-background overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {/* Gradient orbs */}
                <motion.div
                    className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                />

                {/* Floating particles */}
                <FloatingParticle delay={0} duration={4} x="10%" y="20%" size={8} />
                <FloatingParticle delay={1} duration={5} x="80%" y="15%" size={6} />
                <FloatingParticle delay={2} duration={4.5} x="70%" y="70%" size={10} />
                <FloatingParticle delay={0.5} duration={5.5} x="20%" y="80%" size={7} />
                <FloatingParticle delay={1.5} duration={4} x="90%" y="50%" size={5} />
                <FloatingParticle delay={3} duration={6} x="5%" y="60%" size={8} />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                        backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* Header bar */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    {/* Logo and room info */}
                    <motion.div
                        className="flex items-center gap-4"
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Logo */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 cursor-pointer group"
                        >
                            <motion.div
                                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg"
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Sparkles className="w-5 h-5 text-primary-foreground" />
                                <motion.div
                                    className="absolute inset-0 rounded-xl bg-primary/20"
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                            </motion.div>
                            <span className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden sm:block">
                                Canvas
                            </span>
                        </Link>

                        {/* Separator */}
                        <div className="h-8 w-px bg-border/50" />

                        {/* Room ID badge */}
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <motion.button
                                    onClick={copyRoomId}
                                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-lg hover:bg-card transition-colors group"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-xs text-muted-foreground">Room</span>
                                    <span className="font-mono font-semibold text-sm text-foreground">{roomId}</span>
                                    <AnimatePresence mode="wait">
                                        {copied ? (
                                            <motion.div
                                                key="check"
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                exit={{ scale: 0, rotate: 180 }}
                                            >
                                                <Check className="w-4 h-4 text-green-500" />
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="copy"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Copy className="w-4 h-4 text-muted-foreground" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{copied ? 'Copied!' : 'Click to copy room ID'}</p>
                            </TooltipContent>
                        </Tooltip>
                    </motion.div>

                    {/* Right side controls */}
                    <motion.div
                        className="flex items-center gap-3"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* Leave button */}
                        <LeaveRoomButton roomId={roomId} />
                    </motion.div>
                </div>
            </motion.header>

            {/* Main canvas area */}
            <motion.main
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="pt-16"
            >
                <CollaborativeCanvas
                    roomId={roomId}
                    roomMembers={roomMembers}
                />
            </motion.main>

            {/* Decorative corner elements */}
            <div className="fixed bottom-4 left-4 pointer-events-none">
                <motion.div
                    className="w-20 h-20 border-l-2 border-b-2 border-primary/20 rounded-bl-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                />
            </div>
            <div className="fixed bottom-4 right-4 pointer-events-none">
                <motion.div
                    className="w-20 h-20 border-r-2 border-b-2 border-primary/20 rounded-br-3xl"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                />
            </div>

            {/* Room Deleted Dialog */}
            <AlertDialog open={showDeletedDialog} onOpenChange={setShowDeletedDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="text-center sm:text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
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
        </div>
    );
}
