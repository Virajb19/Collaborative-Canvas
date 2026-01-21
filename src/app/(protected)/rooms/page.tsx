import { redirect } from "next/navigation"
import { auth } from "~/server/auth"
import { db } from "~/server/db"
import RoomsContainer from "~/components/RoomsContainer"

export default async function RoomsPage() {
    const session = await auth()
    if (!session || !session.user) return redirect('/')
    const userId = parseInt(session.user.id)

    const roomMembers = await db.roomMember.findMany({
        where: {
            userId: Number(userId),
            role: "OWNER",
        },
        include: {
            room: {
                include: {
                    _count: {
                        select: { members: true }
                    }
                }
            },
        },
        orderBy: {
            joinedAt: "desc",
        },
    });

    const rooms = roomMembers.map((member) => ({
        id: member.room.id,
        roomId: member.room.roomId,
        name: member.room.name,
        createdAt: member.room.createdAt,
        memberCount: member.room._count.members,
    }));

    return <RoomsContainer rooms={rooms} />
}