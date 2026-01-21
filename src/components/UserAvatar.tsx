'use client'

import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { useSession } from 'next-auth/react'

export default function UserAvatar({ className }: { className?: string }) {
    const { data: session } = useSession()
    const user = session?.user

    const getInitials = (name: string | null | undefined) => {
        if (!name) return 'U'
        const names = name.trim().split(' ')
        if (names.length === 1) return names[0]?.charAt(0)?.toUpperCase() || 'U'
        return `${names[0]?.charAt(0)?.toUpperCase() || ''}${names[names.length - 1]?.charAt(0)?.toUpperCase() || ''}`
    }

    return (
        <Avatar className={className}>
            {user?.image && <AvatarImage src={user.image} alt={user.name || 'User avatar'} />}
            <AvatarFallback className="bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold text-sm">
                {getInitials(user?.name)}
            </AvatarFallback>
        </Avatar>
    )
}
