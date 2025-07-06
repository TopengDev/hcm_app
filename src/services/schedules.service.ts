'use server';

import { db } from '@/db/db';
import { schedules } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function createSchedule(payload: FormData) {
   try {
      const newSchedule: any = {};
      payload
         .entries()
         .forEach((entry) => ((newSchedule as any)[entry[0]] = entry[1]));

      console.log({ newSchedule });

      const result = (
         await db.insert(schedules).values(newSchedule).returning()
      )[0];

      return {
         success: !!result,
         data: result,
         msg: 'Success',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}

export async function updateSchedule(payload: FormData) {
   try {
      const updatedSchedule: any = {};
      payload
         .entries()
         .forEach((entry) => ((updatedSchedule as any)[entry[0]] = entry[1]));

      if (!updatedSchedule.scheduleId) {
         return {
            success: false,
            msg: 'Missing scheduleId for update.',
         };
      }

      const scheduleId = updatedSchedule.scheduleId;
      delete updatedSchedule.scheduleId;
      delete updatedSchedule.isRecurring;

      console.log({ updatedSchedule });

      const result = (
         await db
            .update(schedules)
            .set(updatedSchedule)
            .where(eq(schedules.scheduleId, scheduleId))
            .returning()
      )[0];

      return {
         success: !!result,
         data: result,
         msg: 'Schedule updated successfully.',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}

export async function getAllSchedules(payload?: FormData) {
   try {
      const request: any = {};
      if (payload)
         payload
            .entries()
            .forEach((entry) => ((request as any)[entry[0]] = entry[1]));

      const schedulesResult = await db.query.schedules.findMany({
         with: {
            doctor: true,
         },
         limit: request?.limit || 10,
         offset: request?.offset || 0,
         where: request?.doctorId
            ? (schedules, { eq }) => eq(schedules?.doctorId, request?.doctorId)
            : undefined,
      });

      const groupedSchedules: Record<
         number,
         {
            doctor: (typeof schedulesResult)[0]['doctor'];
            schedules: typeof schedulesResult;
         }
      > = {};

      for (const schedule of schedulesResult) {
         const doctorId = schedule.doctorId;

         if (!groupedSchedules[doctorId]) {
            groupedSchedules[doctorId] = {
               doctor: schedule.doctor,
               schedules: [],
            };
         }

         groupedSchedules[doctorId].schedules.push({
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime,
            endTime: schedule.endTime,
            scheduleId: schedule.scheduleId,
            maxPatients: schedule.maxPatients,
            isRecurring: schedule.isRecurring,
            validFrom: schedule.validFrom,
            validTo: schedule.validTo,
            createdAt: schedule.createdAt,
            updatedAt: schedule.updatedAt,
         } as any);
      }

      const groupedArray = Object.values(groupedSchedules);

      return {
         success: true,
         data: groupedArray,
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}

export async function getScheduleById(scheduleId: string) {
   try {
      const schedule = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, scheduleId as any),
      });

      return {
         success: true,
         data: { ...schedule, createdAt: undefined, updatedAt: undefined },
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occured ${err.toString()}`,
      };
   }
}
