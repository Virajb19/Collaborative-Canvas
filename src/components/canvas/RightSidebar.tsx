"use client";

import { Users, Crown } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { User } from "~/types/drawing";
import type { RoomMemberWithUser } from "~/components/Room";

interface RightSidebarProps {
    activeUsers: User[];
    roomMembers: RoomMemberWithUser[];
    currentUserId: string;
}

export function RightSidebar({ activeUsers, roomMembers, currentUserId }: RightSidebarProps) {
    return (
        <aside className="w-64 border-l bg-card flex flex-col">
            {/* Active Now Section */}
            <div className="p-4 border-b">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Active Now ({activeUsers.length})
                    </h3>
                </div>
                <div className="space-y-2">
                    {activeUsers.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            <div className="relative">
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-sm"
                                    style={{ backgroundColor: user.color }}
                                >
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">
                                    {user.name}
                                    {user.id === currentUserId && (
                                        <span className="text-muted-foreground font-normal ml-1">(you)</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                    {activeUsers.length === 0 && (
                        <p className="text-sm text-muted-foreground px-2">Connecting...</p>
                    )}
                </div>
            </div>

            {/* Room Members Section */}
            <div className="p-4 flex-1">
                <div className="flex items-center gap-2 mb-4">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Room Members ({roomMembers.length})
                    </h3>
                </div>
                <ScrollArea className="h-[calc(100vh-400px)]">
                    <div className="space-y-1">
                        {roomMembers.map((member) => (
                            <div
                                key={member.userId}
                                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                            >
                                <div
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 shadow-sm"
                                >
                                    {member.user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{member.user.username}</p>
                                </div>
                                {member.role === 'OWNER' && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50">
                                        <Crown className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                        <span className="text-xs font-medium text-amber-600 dark:text-amber-400">Owner</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </aside>
    );
}
