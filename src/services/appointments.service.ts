'use server';

import { db } from '@/db/db';
import { appointments, patients } from '@/db/schema';
import { desc, eq, ilike, or, sql } from 'drizzle-orm';
import { seed } from 'drizzle-seed';
import * as schema from '../db/schema';

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

export async function updateAppointments(payload: FormData) {
   try {
      const updateData: any = {};
      payload
         .entries()
         .forEach((entry) => ((updateData as any)[entry[0]] = entry[1]));

      if (!updateData.appointmentId) {
         return {
            success: false,
            msg: 'Appointment ID is required',
         };
      }

      const existingAppointment = await db.query.appointments.findFirst({
         where: (appointments, { eq }) =>
            eq(appointments.appointmentId, updateData.appointmentId),
      });

      if (!existingAppointment) {
         return {
            success: false,
            msg: 'Appointment not found',
         };
      }

      const patient = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.patientId, updateData.patientId),
      });
      if (!patient)
         return {
            success: false,
            msg: 'Patient data could not be found',
         };

      const schedule = await db.query.schedules.findFirst({
         where: (schedules, { eq }) =>
            eq(schedules.scheduleId, updateData.scheduleId),
      });
      if (!schedule)
         return {
            success: false,
            msg: 'Schedule data could not be found',
         };

      const doctor = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.doctorId, updateData.doctorId),
      });
      if (!doctor)
         return {
            success: false,
            msg: 'Doctor data could not be found',
         };

      const result = await db
         .update(appointments)
         .set(updateData)
         .where(eq(appointments.appointmentId, updateData.appointmentId))
         .returning();

      return {
         success: !!result,
         data: result,
         msg: 'Update successful',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}

export async function deleteAppointment(appointmentId: string) {
   try {
      const appointmentResult = await db.query.appointments.findFirst({
         where: (appointments, { eq }) =>
            eq(appointments.appointmentId, appointmentId as any),
      });

      if (!appointmentResult) {
         return {
            success: false,
            msg: "Appointment doesn't exist",
         };
      }

      await db
         .delete(appointments)
         .where(eq(appointments.appointmentId, appointmentId as any));

      return {
         success: true,
         msg: 'Data deleted successfully',
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
         with: {
            patient: true,
            schedule: true,
            medicalRecords: true,
         },
         orderBy: (appointment, { desc }) => desc(appointment.updatedAt),
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
export async function getAllAppointments(payload?: FormData) {
   try {
      const request: any = {};
      if (payload) {
         payload.entries().forEach((entry) => {
            request[entry[0]] = entry[1];
         });
      }

      const limit = Number(request.limit || 10);
      const offset = Number(request.offset || 0);
      const search = (request.search || '').toLowerCase();

      const a = appointments;
      const p = patients;

      const whereClause = search
         ? or(
              ilike(a.status, `%${search}%`),
              ilike(a.complaint, `%${search}%`),
              ilike(p.name, `%${search}%`),
           )
         : undefined;

      const results = await db
         .select()
         .from(a)
         .leftJoin(p, eq(a.patientId, p.patientId))
         .where(whereClause)
         .limit(limit)
         .offset(offset)
         .orderBy(desc(a.updatedAt));
      return {
         success: true,
         data: results?.map((resultData) => ({
            ...resultData?.appointments,
            patient: resultData?.patients,
         })),
         msg: 'Data fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred ${err.toString()}`,
      };
   }
}
export async function getAppointment(appointmentId?: string) {
   try {
      const appointmentsResult = await db.query.appointments.findFirst({
         with: {
            patient: true,
            schedule: true,
            medicalRecords: true,
         },
         where: (appointments, { eq }) =>
            eq(appointments.appointmentId, appointmentId as any),
      });

      return {
         success: true,
         data: {
            ...appointmentsResult,
            createdAt: undefined,
            updatedAt: undefined,
         },
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
export async function getAppointmentTotals() {
   try {
      const result = await db
         .select({
            status: appointments.status,
            count: sql<number>`COUNT(*)`,
         })
         .from(appointments)
         .groupBy(appointments.status);

      return {
         success: true,
         data: result,
         msg: 'Appointment totals grouped by status fetched successfully',
      };
   } catch (err: any) {
      console.error(err.toString());
      return {
         success: false,
         msg: `An error occurred: ${err.toString()}`,
      };
   }
}
