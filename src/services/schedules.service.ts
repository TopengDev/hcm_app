'use server';

import { db } from '@/db/db';
import { schedules } from '@/db/schema';

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
      });

      // Group by doctorId
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
