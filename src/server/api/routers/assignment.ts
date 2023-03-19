import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { addAssignmentSchema, deleteAssignmentSchema } from "~/schemas";

export const assignmentRouter = createTRPCRouter({
  add: protectedProcedure
    .input(addAssignmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.assignment.create({
        data: {
          title: input.title,
          description: input.description,
          deadline: new Date(input.deadline),
          protected: input.protected,
          password: input.password,
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(deleteAssignmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.assignment.deleteMany({
        where: {
          id: input.id,
          AND: [
            {
              userId: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });
    }),
  close: protectedProcedure
    .input(deleteAssignmentSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.assignment.updateMany({
        where: {
          id: input.id,
          AND: [
            {
              userId: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
        data: {
          closed: true,
        },
      });
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.assignment.findMany({
      where: { userId: ctx.session.user.id },
      select: {
        id: true,
        title: true,
        description: true,
        deadline: true,
        protected: true,
        closed: true,
        userId: false,
        password: true,
        students: true,
        questions: true,
      },
    });
  }),
});
