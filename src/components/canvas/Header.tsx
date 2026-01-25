"use client";

import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import type { User } from "~/types/drawing";

interface HeaderProps {
    roomCode: string;
    users: User[];
}

export function Header({ roomCode, users }: HeaderProps) {
    const [copied, setCopied] = useState(false);

    const copyRoomCode = async () => {
        await navigator.clipboard.writeText(roomCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <header className="h-16 border-b bg-card/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-50">
            <div className="flex items-center gap-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                        <Sparkles className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Canvas</span>
                </Link>

                {/* Room Code Badge */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={copyRoomCode}
                    className="h-8 gap-2 font-mono text-sm bg-secondary/50 border-border hover:bg-secondary transition-colors"
                >
                    <span className="text-muted-foreground text-xs font-sans">Room</span>
                    <span className="font-semibold">{roomCode}</span>
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                </Button>
            </div>

            <div className="flex items-center gap-3">
                {/* User avatars */}
                <div className="flex -space-x-2">
                    {users.slice(0, 4).map((user, i) => (
                        <div
                            key={user.id}
                            className="w-8 h-8 rounded-full border-2 border-card flex items-center justify-center text-xs font-medium text-white shadow-sm"
                            style={{ backgroundColor: user.color }}
                            title={user.name}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                    {users.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                            +{users.length - 4}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
