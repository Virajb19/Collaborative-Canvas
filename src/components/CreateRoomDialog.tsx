"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Lock, Hash, Copy, Check, Wand2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '~/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "~/components/ui/form";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema } from '~/lib/zod';
import { z } from 'zod';
import { api } from '~/trpc/react';
import { toast } from 'sonner';
import { useRouter } from 'nextjs-toploader/app';
import { useCopyToClipboard } from 'usehooks-ts'

type CreateRoomData = z.infer<typeof createRoomSchema>

type CreateRoomDialogProps = {
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

export const CreateRoomDialog = ({ open, onOpenChange }: CreateRoomDialogProps) => {
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const router = useRouter();

    const form = useForm({
        resolver: zodResolver(createRoomSchema),
        defaultValues: { roomId: "", passcode: "" },
    });

    const roomId = useWatch({
        control: form.control,
        name: "roomId",
    });

    const utils = api.useUtils();
    const createRoom = api.room.create.useMutation();

    const generateRoomId = async () => {
        setIsGenerating(true);
        await new Promise(res => setTimeout(res, 800));
        const id = Math.random().toString(36).substring(2, 8).toUpperCase();
        form.setValue("roomId", id, { shouldValidate: true });
        setIsGenerating(false);
    };

    const copyRoomId = () => {
        const id = form.getValues("roomId");
        if (!id) return;
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleCreate = async (data: CreateRoomData) => {
        if (!data.roomId) return;

        try {
            const { exists } = await utils.room.checkExists.fetch({ roomId: data.roomId });

            if (exists) {
                form.setError('roomId', {
                    type: 'manual',
                    message: 'A room with this ID already exists. Please try a different room ID.'
                });
                return;
            }

            await createRoom.mutateAsync(data, {
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
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    const resetState = () => {
        form.reset();
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            onOpenChange(isOpen);
            if (!isOpen) resetState();
        }}>
            <DialogContent className="sm:max-w-lg border border-transparent bg-[#E7E8EC] backdrop-blur-2xl overflow-hidden p-0">
                {/* Background decorations */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            opacity: [0.3, 0.5, 0.3],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{ duration: 5, repeat: Infinity }}
                        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-linear-to-br from-primary/30 to-[hsl(var(--user-purple))]/20 blur-3xl"
                    />
                    <motion.div
                        animate={{
                            opacity: [0.2, 0.4, 0.2],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{ duration: 6, repeat: Infinity, delay: 1 }}
                        className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-linear-to-tr from-[hsl(var(--user-cyan))]/20 to-transparent blur-3xl"
                    />
                    <DialogParticle delay={0} x="10%" y="20%" size={6} color="--primary" />
                    <DialogParticle delay={0.5} x="85%" y="30%" size={4} color="--user-purple" />
                    <DialogParticle delay={1} x="20%" y="70%" size={5} color="--user-cyan" />
                    <DialogParticle delay={1.5} x="75%" y="80%" size={4} color="--user-pink" />
                </div>

                <div className="relative p-6">
                    <DialogHeader className="space-y-3 mb-6">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-300 via-[hsl(var(--user-indigo))] to-[hsl(var(--user-purple))] flex items-center justify-center shadow-lg shadow-blue-400"
                        >
                            <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>
                        <DialogTitle className="text-4xl font-bold text-center bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                            Create New Room
                        </DialogTitle>
                        <DialogDescription className="text-center text-gray-600 text-[16px] font-semibold">
                            Generate a unique room ID and set passcode
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5">
                        <Form {...form}>
                            <form className='space-y-3 w-full' onSubmit={form.handleSubmit(handleCreate)}>
                                <FormField
                                    control={form.control}
                                    name="roomId"
                                    render={({ field }) => (
                                        <FormItem className="space-y-2">
                                            <FormLabel className="text-lg font-medium flex items-center gap-2">
                                                <Hash className="size-6 text-blue-400" />
                                                Room ID
                                            </FormLabel>

                                            <div className="flex gap-2">
                                                <div className="relative flex-1">
                                                    <FormControl>
                                                        <input
                                                            {...field}
                                                            value={field.value ?? ""}
                                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                            placeholder="XXXXXX"
                                                            maxLength={6}
                                                            className="w-full px-4 py-3.5 bg-secondary/60 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 font-mono text-center text-xl tracking-[0.3em] uppercase transition-all duration-200"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />

                                                    <AnimatePresence>
                                                        {isGenerating && (
                                                            <motion.div
                                                                initial={{ opacity: 0 }}
                                                                animate={{ opacity: 1 }}
                                                                exit={{ opacity: 0 }}
                                                                className="absolute inset-0 flex items-center justify-center bg-secondary/80 rounded-xl"
                                                            >
                                                                <motion.div
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                >
                                                                    <Wand2 className="w-6 h-6 text-primary" />
                                                                </motion.div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>

                                                <motion.button
                                                    type="button"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        generateRoomId()
                                                    }}
                                                    className="px-4 py-4 cursor-pointer bg-linear-to-r from-blue-200 to-[hsl(var(--user-purple))]/20 border border-blue-300 rounded-xl text-blue-500  hover:from-blue-300 hover:to-[hsl(var(--user-purple))]/30 transition-all duration-200"
                                                >
                                                    <Wand2 className="w-6 h-6" />
                                                </motion.button>

                                                {roomId && (
                                                    <motion.button
                                                        type='button'
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={copyRoomId}
                                                        className="px-4 py-4 bg-secondary cursor-pointer border border-gray-300 rounded-xl text-foreground hover:bg-secondary transition-all duration-200"
                                                        title="Copy Room ID"
                                                    >
                                                        {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                                                    </motion.button>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

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
                                                    placeholder="Enter passcode"
                                                    className="w-full px-4 py-3.5 bg-secondary/60 border border-border/60 rounded-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <motion.button type='submit'
                                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px hsl(var(--primary) / 0.4)' }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={!roomId || form.formState.isSubmitting}
                                    className="w-full cursor-pointer relative bg-gradient-to-r from-primary via-[hsl(var(--user-indigo))] to-[hsl(var(--user-purple))] text-primary-foreground py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-primary/30 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
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
                                                Creating Room...
                                            </>
                                        ) : (
                                            <>
                                                Create & Enter Room
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </span>
                                </motion.button>

                            </form>
                        </Form>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateRoomDialog;
