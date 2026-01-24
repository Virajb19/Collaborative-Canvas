import { createRoomSchema, joinRoomSchema } from '~/lib/zod';
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt';
import { z } from 'zod';

export const roomRouter = createTRPCRouter({
    // Check if a room with the given ID already exists
    checkExists: protectedProcedure
        .input(z.object({ roomId: z.string().min(1) }))
        .query(async ({ ctx, input }) => {
            const room = await ctx.db.room.findUnique({
                where: { roomId: input.roomId },
                select: { id: true }
            });
            return { exists: !!room };
        }),

    create: protectedProcedure.input(createRoomSchema).mutation(async ({ ctx, input }) => {
        const { roomId, passcode } = input;
        const userId = ctx.session.user.id;

        // Check if room already exists
        const existingRoom = await ctx.db.room.findUnique({
            where: { roomId },
            select: { id: true }
        });

        if (existingRoom) {
            throw new TRPCError({
                code: 'CONFLICT',
                message: 'A room with this ID already exists. Please try a different room ID.'
            });
        }

        // Hash the passcode
        const hashedPasscode = await bcrypt.hash(passcode, 10);

        // Create the room and add the user as OWNER
        const room = await ctx.db.room.create({
            data: {
                roomId,
                passcode: hashedPasscode,
                members: {
                    create: {
                        userId: parseInt(userId),
                        role: 'OWNER'
                    }
                }
            },
            select: {
                id: true,
                roomId: true,
                createdAt: true
            }
        });

        return {
            message: 'Room created successfully!',
            room
        };
    }),

    join: protectedProcedure.input(joinRoomSchema).mutation(async ({ ctx, input }) => {
        const { roomId, passcode } = input;
        const userId = ctx.session.user.id;

        // Find the room
        const room = await ctx.db.room.findUnique({
            where: { roomId },
            select: {
                id: true,
                roomId: true,
                passcode: true
            }
        });

        if (!room) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'Room not found. Please check the room ID.'
            });
        }

        // Verify passcode
        const isValidPasscode = await bcrypt.compare(passcode, room.passcode);
        if (!isValidPasscode) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Incorrect passcode. Please try again.'
            });
        }

        // Check if user is already a member
        const existingMembership = await ctx.db.roomMember.findUnique({
            where: {
                userId_roomId: {
                    userId: parseInt(userId),
                    roomId: room.id
                }
            }
        });

        if (existingMembership) {
            return {
                message: 'You are already a member of this room!',
                room: { id: room.id, roomId: room.roomId },
                alreadyMember: true
            };
        }

        // Add user as GUEST member
        await ctx.db.roomMember.create({
            data: {
                userId: parseInt(userId),
                roomId: room.id,
                role: 'GUEST'
            }
        });

        return {
            message: 'Successfully joined the room!',
            room: { id: room.id, roomId: room.roomId },
            alreadyMember: false
        };
    }),

    delete: protectedProcedure
        .input(z.object({ roomId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const { roomId } = input;
            const userId = ctx.session.user.id;

            // Find the room
            const room = await ctx.db.room.findUnique({
                where: { roomId },
                select: {
                    id: true,
                    roomId: true,
                    members: {
                        select: {
                            userId: true,
                            role: true
                        }
                    }
                }
            });

            if (!room) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Room not found.'
                });
            }

            // Check if the user is the owner
            const membership = room.members.find(m => m.userId === parseInt(userId));
            if (!membership || membership.role !== 'OWNER') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Only the room owner can delete the room.'
                });
            }

            // Delete the room (cascade will delete members)
            await ctx.db.room.delete({
                where: { id: room.id }
            });

            return {
                message: 'Room deleted successfully!',
                roomId: room.roomId
            };
        }),

    // Leave room - removes user from RoomMember table
    leave: protectedProcedure
        .input(z.object({ roomId: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const { roomId } = input;
            const userId = ctx.session.user.id;

            // Find the room
            const room = await ctx.db.room.findUnique({
                where: { roomId },
                select: {
                    id: true,
                    roomId: true,
                    members: {
                        select: {
                            userId: true,
                            role: true
                        }
                    }
                }
            });

            if (!room) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Room not found.'
                });
            }

            // Check if the user is a member
            const membership = room.members.find(m => m.userId === parseInt(userId));
            if (!membership) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'You are not a member of this room.'
                });
            }

            // Owners cannot leave - they must delete the room
            if (membership.role === 'OWNER') {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'Room owners cannot leave. You must delete the room instead.'
                });
            }

            // Remove the user from the room
            await ctx.db.roomMember.delete({
                where: {
                    userId_roomId: {
                        userId: parseInt(userId),
                        roomId: room.id
                    }
                }
            });

            return {
                message: 'Successfully left the room!',
                roomId: room.roomId
            };
        }),
});