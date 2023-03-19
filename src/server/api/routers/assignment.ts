import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import {
  addAssignmentSchema,
  deleteAssignmentSchema,
  updateAssignmentSchema,
} from "~/schemas";

function filterSensitiveValues(inputObj) {
  const sensitiveValues = ["password", "students", "userId", "protected"]; // an array of sensitive values to filter
  const filteredObj = {};
  for (const key in inputObj) {
    if (!sensitiveValues.includes(key)) {
      filteredObj[key] = inputObj[key];
    }
  }

  return filteredObj;
}

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
  update: protectedProcedure
    .input(updateAssignmentSchema)
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
          title: input.title,
          description: input.description,
          deadline: new Date(input.deadline),
          protected: input.protected,
          password: input.password,
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
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const assignment = await ctx.prisma.assignment.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          title: true,
          description: true,
          deadline: true,
          protected: true,
          closed: true,
          userId: true,
          password: true,
          students: true,
          questions: true,
        },
      });

      const filteredAssignment = filterSensitiveValues(assignment);

      if (!ctx.session) {
        return filteredAssignment;
      }

      if (assignment!.userId !== ctx.session.user.id) {
        return filteredAssignment;
      }

      return assignment;
    }),
});
