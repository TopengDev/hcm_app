'use server';

import { db } from '@/db/db';
import { appointments } from '@/db/schema';

export async function createAppointments(payload: FormData) {
   try {
      const newAppoointment: any = {};
      payload
         .entries()
         .forEach((entry) => ((newAppoointment as any)[entry[0]] = entry[1]));

      const patient = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.patientId, newAppoointment.patientId),
      });
      if (!patient)
         return {
            success: false,
            msg: 'Patient data could not be found',
         };

      const schedule = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, newAppoointment.scheduleId),
      });
      if (!schedule)
         return {
            success: false,
            msg: 'Schedule data could not be found',
         };
      const doctor = await db.query.doctors.findFirst({
         where: (doctors, { eq }) =>
            eq(doctors.doctorId, newAppoointment.doctorId),
      });
      if (!doctor)
         return {
            success: false,
            msg: 'Doctor data could not be found',
         };

      const result = (
         await db.insert(appointments).values(newAppoointment).returning()
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

export async function getPatientAppointments(patientId: string) {
   try {
      const patient = await db.query.appointments.findMany({
         where: (appointments, { eq }) =>
            eq(appointments.patientId, patientId as any),
      });

      return {
         success: true,
         data: patient,
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
export async function getAllAppointments(payload: FormData) {
   try {
      const request: any = {};
      if (payload)
         payload
            .entries()
            .forEach((entry) => ((request as any)[entry[0]] = entry[1]));

      const appointmentsResult = await db.query.appointments.findMany({
         limit: request?.limit || 10,
         offset: request?.offset || 0,
      });

      return {
         success: true,
         data: appointmentsResult,
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
