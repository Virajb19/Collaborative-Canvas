"use client"

import { motion } from 'framer-motion';
import { ArrowRight, Lock, Hash, Users, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { joinRoomSchema } from '~/lib/zod';
import { z } from 'zod';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { useRouter } from 'nextjs-toploader/app';

type JoinRoomData = z.infer<typeof joinRoomSchema>

type JoinRoomDialogProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Floating particle for dialog background
const DialogParticle = ({ delay, x, y, size, color }: { delay: number; x: string; y: string; size: number; color: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
        }}
        transition={{
            duration: 3,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }}
        className="absolute rounded-full blur-[2px]"
        style={{
            left: x,
            top: y,
            width: size,
            height: size,
            background: `hsl(var(${color}))`,
        }}
    />
);

export const JoinRoomDialog = ({ open, onOpenChange }: JoinRoomDialogProps) => {
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(joinRoomSchema),
        defaultValues: { roomId: "", passcode: "" },
    });

    const roomId = useWatch({
        control: form.control,
        name: "roomId",
    });

    const joinRoom = api.room.join.useMutation();

    const handleJoin = async (data: JoinRoomData) => {
        if (!data.roomId) return;

        await joinRoom.mutateAsync(data, {
            onSuccess: (result) => {
                toast.success(result.message);
                form.reset();
                onOpenChange(false);
                router.push(`/room/${result.room.roomId}`);
            },
            onError: (err) => {
                toast.error(err.message);
            }
        });
    };

    const resetState = () => {
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen: boolean) => {
            onOpenChange(isOpen);
            if (!isOpen) resetState();
        }}>
            <DialogContent className="sm:max-w-md border-border/50 bg-background/95 backdrop-blur-2xl overflow-hidden p-0">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[hsl(var(--user-cyan))]/30 to-[hsl(var(--user-green))]/20 blur-3xl"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-tr from-[hsl(var(--user-blue))]/20 to-transparent blur-3xl"
                    />
                    <DialogParticle delay={0} x="15%" y="25%" size={5} color="--user-cyan" />
                    <DialogParticle delay={0.7} x="80%" y="35%" size={4} color="--user-green" />
                    <DialogParticle delay={1.2} x="25%" y="75%" size={5} color="--user-blue" />
                    <DialogParticle delay={1.8} x="70%" y="85%" size={4} color="--user-teal" />
                </div>

                <div className="relative p-6">
                    <DialogHeader className="space-y-3 mb-6">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-[hsl(var(--user-cyan))] via-[hsl(var(--user-blue))] to-[hsl(var(--user-green))] flex items-center justify-center shadow-xl shadow-[hsl(var(--user-cyan))]/30"
                        >
                            <Users className="w-8 h-8 text-primary-foreground" />
                        </motion.div>
                        <DialogTitle className="text-3xl font-bold text-center">
                            Join a Room
                        </DialogTitle>
                        <DialogDescription className="text-center text-sm font-semibold text-muted-foreground">
                            Enter the room ID and passcode to join your friends
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form className="space-y-5" onSubmit={form.handleSubmit(handleJoin)}>
                            {/* Room ID Section */}
                            <FormField
                                control={form.control}
                                name="roomId"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-lg font-medium flex items-center gap-2">
                                            <Hash className="w-6 h-6 text-[hsl(var(--user-cyan))]" />
                                            Room ID
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                placeholder="XXXXXX"
                                                maxLength={6}
                                                autoFocus
                                                className="w-full px-4 py-3.5 bg-secondary/60 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--user-cyan))]/50 focus:border-[hsl(var(--user-cyan))]/50 font-mono text-center text-xl tracking-[0.3em] uppercase transition-all duration-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Passcode Section */}
                            <FormField
                                control={form.control}
                                name="passcode"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-lg font-medium flex items-center gap-2">
                                            <Lock className="w-5 h-5 text-muted-foreground" />
                                            Passcode
                                        </FormLabel>
                                        <FormControl>
                                            <input
                                                {...field}
                                                type="password"
                                                placeholder="Enter room passcode"
                                                className="w-full px-4 py-3.5 bg-secondary/60 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--user-cyan))]/50 focus:border-[hsl(var(--user-cyan))]/50 transition-all duration-200"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Join Button */}
                            <motion.button
                                type="submit"
                                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px hsl(var(--user-cyan) / 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                disabled={!roomId || joinRoom.isPending || form.formState.isSubmitting}
                                className="w-full cursor-pointer relative bg-gradient-to-r from-[hsl(var(--user-cyan))] via-[hsl(var(--user-blue))] to-[hsl(var(--user-green))] text-primary-foreground py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-[hsl(var(--user-cyan))]/30 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                            >
                                <motion.div
                                    initial={{ x: '-100%' }}
                                    animate={{ x: '200%' }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
                                />
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {form.formState.isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Joining Room...
                                        </>
                                    ) : (
                                        <>
                                            Join Room
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </span>
                            </motion.button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JoinRoomDialog;
