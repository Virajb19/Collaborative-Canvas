import { SignUpSchema } from '~/lib/zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from '@trpc/server';
import bcrypt from 'bcrypt'

export const userRouter = createTRPCRouter({
  signup: publicProcedure.input(SignUpSchema).mutation(async ({ ctx, input}) => {

        const { username, email, password} = input

        const userExists = await ctx.db.user.findUnique({ where: { email }, select: { id: true}})
        if(userExists) throw new TRPCError({ code: 'FORBIDDEN', message: 'user already exists. Check your email'})

        const hashedPassword = await bcrypt.hash(password,10)
        await ctx.db.user.create({data: {username,email,password: hashedPassword}})

        return { message: 'signed up successfully'}
  }),

  getRooms: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const rooms = await ctx.db.roomMember.findMany({
      where: {
        userId: Number(userId),
        role: "OWNER",
      },
      include: {
        room: true,
      },
      orderBy: {
        joinedAt: "desc",
      },
    });

    return rooms.map((m) => m.room);
  }),
})