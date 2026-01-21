'use client'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { LogOut, LayoutGrid, Plus, Home } from 'lucide-react'
import { signOut, useSession } from 'next-auth/react'
import UserAvatar from './UserAvatar'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function UserAccountNav() {
    const { data: session } = useSession()
    const user = session?.user

    if (!user) return null

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative cursor-pointer focus:outline-none"
                >
                    {/* Glow effect */}
                    <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 blur-md opacity-50"
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <div className="relative ring-2 ring-white/80 rounded-full shadow-lg">
                        <UserAvatar className="size-10" />
                    </div>
                </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="m-2 min-w-52 z-[99999] rounded-xl bg-white/95 backdrop-blur-xl border border-gray-200 shadow-xl font-medium"
                align="end"
                sideOffset={8}
            >
                {/* User info section */}
                <div className="px-3 py-3">
                    <div className="flex items-center gap-3">
                        <UserAvatar className="size-10" />
                        <div className="flex flex-col min-w-0">
                            {user.name && (
                                <p className="text-base font-semibold text-foreground truncate">
                                    {user.name}
                                </p>
                            )}
                            {user.email && (
                                <p className="text-sm text-muted-foreground truncate">
                                    {user.email}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <DropdownMenuSeparator className="bg-gray-200" />

                {/* Navigation links */}
                <div className="py-1">
                    <DropdownMenuItem asChild className="cursor-pointer px-3 py-2.5 focus:bg-gray-100">
                        <Link href="/" className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                                <Home className="size-4 text-blue-600" />
                            </div>
                            <span>Home</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer px-3 py-2.5 focus:bg-gray-100">
                        <Link href="/rooms" className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                <LayoutGrid className="size-4 text-purple-600" />
                            </div>
                            <span>My Rooms</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-gray-200" />

                {/* Logout button */}
                <div className="py-1">
                    <DropdownMenuItem
                        className="cursor-pointer px-3 py-2.5 focus:bg-red-50 group"
                        onClick={() => signOut({ callbackUrl: '/' })}
                    >
                        <div className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                <LogOut className="size-4 text-red-600" />
                            </div>
                            <span className="group-hover:text-red-600 transition-colors">
                                Log out
                            </span>
                        </div>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
