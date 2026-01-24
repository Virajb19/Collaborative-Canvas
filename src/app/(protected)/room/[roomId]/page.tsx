import { notFound, redirect } from "next/navigation"
import Room from "~/components/Room"
import { auth } from "~/server/auth"
import { db } from "~/server/db"

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {

  const session = await auth()
  if (!session || !session.user) return redirect('/')
  const userId = parseInt(session.user.id)

  const { roomId } = await params

  // Find the room by its roomId (the 6-char code)
  const room = await db.room.findUnique({
    where: { roomId },
    select: { id: true, roomId: true }
  })

  if (!room) return notFound()

  // Check if user is a member of this room
  const isMember = await db.roomMember.findUnique({
    where: {
      userId_roomId: {
        userId,
        roomId: room.id
      }
    },
    select: { id: true }
  })

  if (!isMember) return redirect('/')

  const roomMembers = await db.roomMember.findMany({
    where: { roomId: room.id },
    select: {
      userId: true,
      role: true,
      user: {
        select: {
          id: true,
          username: true,
          profilePicture: true
        }
      }
    }
  })

  return <Room roomMembers={roomMembers} />
}