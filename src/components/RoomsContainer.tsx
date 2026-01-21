"use client"

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Plus, Hash, Users, Calendar, ArrowRight, Star, LayoutGrid } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { useRouter } from 'nextjs-toploader/app';
import CreateRoomDialog from '~/components/CreateRoomDialog';
import JoinRoomDialog from '~/components/JoinRoomDialog';
import DeleteButton from '~/components/DeleteButton';
import UserAccountNav from '~/components/UserAccountNav';
import { api } from '~/trpc/react';

const STAR_COLORS = [
    "text-red-400 fill-red-300",
    "text-orange-400 fill-orange-300",
    "text-yellow-400 fill-yellow-300",
    "text-green-400 fill-green-300",
    "text-blue-400 fill-blue-300",
    "text-indigo-400 fill-indigo-300",
    "text-purple-400 fill-purple-300",
    "text-pink-400 fill-pink-300",
];

const pick = (arr: string[], seed: number) =>
    arr[seed % arr.length];

const Particle = ({ delay, duration, x, y, size, color }: { delay: number; duration: number; x: string; y: string; size: number; color: string }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0],
            y: [0, -100, -200, -300],
        }}
        transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeOut"
        }}
        className={twMerge("absolute rounded-full blur-[1px]", color)}
        style={{
            left: x,
            top: y,
            width: size,
            height: size,
        }}
    />
);

type Room = {
    id: string;
    roomId: string;
    name: string | null;
    createdAt: Date;
    memberCount: number;
};

type RoomsContainerProps = {
    rooms: Room[];
};

export default function RoomsContainer({ rooms }: RoomsContainerProps) {
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const router = useRouter();

    // const { data: roomsData, isLoading, isError, isFetching, isRefetching, isFetched } = api.user.getRooms.useQuery();

    const particles = [
        { delay: 0, duration: 8, x: '10%', y: '80%', size: 8, color: 'bg-blue-500' },
        { delay: 1, duration: 10, x: '20%', y: '90%', size: 6, color: 'bg-purple-500' },
        { delay: 2, duration: 9, x: '80%', y: '85%', size: 7, color: 'bg-pink-500' },
        { delay: 3, duration: 11, x: '90%', y: '75%', size: 6, color: 'bg-cyan-500' },
        { delay: 0.5, duration: 8, x: '30%', y: '95%', size: 8, color: 'bg-indigo-500' },
        { delay: 1.5, duration: 9, x: '70%', y: '88%', size: 7, color: 'bg-green-500' },
        { delay: 2.5, duration: 10, x: '50%', y: '92%', size: 6, color: 'bg-amber-500' },
        { delay: 3.5, duration: 8, x: '60%', y: '80%', size: 8, color: 'bg-violet-500' },
    ];

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date(date));
    };

    return (
        <div className="min-h-screen bg-background relative overflow-hidden">
            {/* User Account Nav - Top Right */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="fixed top-4 right-4 z-50"
            >
                <UserAccountNav />
            </motion.div>

            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Large gradient orbs */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, x: 100, y: -100 }}
                    animate={{
                        opacity: [0.4, 0.6, 0.4],
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/30 via-[hsl(var(--user-indigo))]/20 to-transparent blur-[80px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{
                        opacity: [0.3, 0.5, 0.3],
                        scale: [1, 1.3, 1],
                        x: [0, -40, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                    className="absolute -bottom-60 -left-60 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-[hsl(var(--user-purple))]/30 via-[hsl(var(--user-pink))]/20 to-transparent blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.2, 0.4, 0.2],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-r from-[hsl(var(--user-cyan))]/20 to-[hsl(var(--user-green))]/10 blur-[60px]"
                />

                {/* Floating particles */}
                {particles.map((p, i) => (
                    <Particle key={i} {...p} />
                ))}

                {/* Sparkle stars */}
                {[...Array(8)].map((_, i) => {
                    const color = pick(STAR_COLORS, i * 13);
                    return (
                        <motion.div
                            key={`star-${i}`}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0],
                                rotate: [0, 180, 360],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                delay: i * 0.8,
                                ease: "easeInOut"
                            }}
                            className="absolute"
                            style={{
                                left: `${15 + i * 12}%`,
                                top: `${20 + (i % 3) * 25}%`,
                            }}
                        >
                            <Star className={twMerge("w-6 h-6", color)} />
                        </motion.div>
                    );
                })}

                {/* Grid pattern */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    transition={{ duration: 2 }}
                    className="absolute inset-0 bg-[linear-gradient(to_right,#dee1f5_1px,transparent_1px),linear-gradient(to_bottom,#dee1f5_1px,transparent_1px)] bg-size-[60px_60px]"
                />
            </div>

            <div className="relative z-10 min-h-screen p-6 md:p-12">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="flex items-center gap-4 mb-3">
                                <motion.div
                                    className="relative w-14 h-14 bg-gradient-to-br from-blue-500 via-indigo-400 to-purple-400 rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center"
                                    whileHover={{ scale: 1.05, rotate: 5 }}
                                >
                                    <LayoutGrid className="w-7 h-7 text-white" />
                                    <motion.div
                                        className="absolute inset-0 rounded-2xl bg-primary/20"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                                <div>
                                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                        My Rooms
                                    </h1>
                                    <p className="text-lg text-muted-foreground mt-1">
                                        Manage and access your collaborative spaces
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex gap-3"
                        >
                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setJoinDialogOpen(true)}
                                className="px-5 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-foreground hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
                            >
                                Join Room
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -8px hsl(var(--primary) / 0.4)' }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setCreateDialogOpen(true)}
                                className="px-5 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary/30 flex items-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-5 h-5" />
                                Create Room
                            </motion.button>
                        </motion.div>
                    </div>

                    {/* Rooms Grid */}
                    {rooms.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="text-center py-20"
                        >
                            <motion.div
                                className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <LayoutGrid className="w-12 h-12 text-gray-400" />
                            </motion.div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">No rooms yet</h3>
                            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                                Create your first collaborative canvas room or join an existing one to get started!
                            </p>
                            <div className="flex gap-4 justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setJoinDialogOpen(true)}
                                    className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-semibold text-foreground hover:bg-gray-50 transition-all duration-200 shadow-sm cursor-pointer"
                                >
                                    Join Existing Room
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 15px 30px -8px hsl(var(--primary) / 0.4)' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setCreateDialogOpen(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-primary/30 flex items-center gap-2 cursor-pointer"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Create Your First Room
                                </motion.button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        >
                            {rooms.map((room, index) => {
                                return (
                                    <motion.div
                                        key={room.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.1 * index }}
                                        whileHover={{ y: -5, scale: 1.01 }}
                                        className="group relative bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 hover:border-blue-300 p-6 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
                                        onClick={() => router.push(`/room/${room.roomId}`)}
                                    >
                                        {/* Card background glow */}
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            whileHover={{ opacity: 1 }}
                                            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-[hsl(var(--user-purple))]/5"
                                        />

                                        {/* Delete button */}
                                        <DeleteButton roomId={room.roomId} />

                                        {/* Room Icon */}
                                        <div className="relative mb-4">
                                            <div
                                                className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                                            >
                                                <Hash className="w-7 h-7 text-blue-600" />
                                            </div>
                                        </div>

                                        {/* Room Info */}
                                        <div className="relative">
                                            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-blue-600 transition-colors">
                                                {room.name || `Room ${room.roomId}`}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="font-mono text-sm px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                                                    {room.roomId}
                                                </span>
                                            </div>

                                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(room.createdAt)}
                                                </div>
                                                {room.memberCount !== undefined && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4" />
                                                        {room.memberCount} {room.memberCount === 1 ? 'member' : 'members'}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Enter button */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 10 }}
                                            whileHover={{ opacity: 1, x: 0 }}
                                            className="absolute right-4 top-1/2 -translate-y-1/2"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                                                <ArrowRight className="w-5 h-5 text-white" />
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    )}

                    {/* Quick Actions Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mt-12 text-center"
                    >
                        <Link href="/">
                            <motion.span
                                whileHover={{ scale: 1.02 }}
                                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                                Back to Home
                            </motion.span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>

            <CreateRoomDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
            />
            <JoinRoomDialog
                open={joinDialogOpen}
                onOpenChange={setJoinDialogOpen}
            />
        </div>
    );
}
