'use server';
import { db } from '../db/db';
import { patients } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function registerPatient(payload: FormData) {
   try {
      const newPatient: any = {};
      payload
         .entries()
         .forEach((entry) => ((newPatient as any)[entry[0]] = entry[1]));

      const existingPatientByEmail = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.email, newPatient.email),
      });
      if (existingPatientByEmail)
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingPatientByPhoneNumber = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.phoneNumber, newPatient.phoneNumber),
      });
      if (existingPatientByPhoneNumber)
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingPatientByIdCard = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.idCard, newPatient.idCard),
      });
      if (existingPatientByIdCard)
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      const result = (
         await db.insert(patients).values(newPatient).returning()
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

export async function updatePatient(payload: FormData) {
   try {
      let updatedPatient: any = {};
      payload
         .entries()
         .forEach((entry) => ((updatedPatient as any)[entry[0]] = entry[1]));

      updatedPatient.patientId = parseInt(updatedPatient.patientId);

      const existingPatientByEmail = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.email, updatedPatient.email),
      });
      if (
         existingPatientByEmail?.patientId &&
         existingPatientByEmail?.patientId !== updatedPatient.patientId
      )
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingPatientByPhoneNumber = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.phoneNumber, updatedPatient.phoneNumber),
      });
      if (
         existingPatientByPhoneNumber &&
         existingPatientByPhoneNumber?.patientId !== updatedPatient.patientId
      )
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingPatientByIdCard = await db.query.patients.findFirst({
         where: (patients, { eq }) =>
            eq(patients.idCard, updatedPatient.idCard),
      });
      if (
         existingPatientByIdCard &&
         existingPatientByIdCard?.patientId !== updatedPatient.patientId
      )
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      updatedPatient = {
         ...updatedPatient,
         createdAt: undefined,
         updatedAt: undefined,
      };
      const result = await db
         .update(patients)
         .set(updatedPatient)
         .where(eq(patients.patientId, updatedPatient.patientId))
         .returning();

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

export async function deletePatient(patientId: string) {
   try {
      await db.delete(patients).where(eq(patients.patientId, patientId as any));

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
export async function getPatients(payload?: FormData) {
   try {
      const request: any = {};
      if (payload)
         payload
            .entries()
            .forEach((entry) => ((request as any)[entry[0]] = entry[1]));

      const patients = await db.query.patients.findMany({
         limit: request.limit || 10,
         offset: request.offset || 1,
      });

      return {
         success: true,
         data: patients,
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

export async function getPatientById(patientId: string) {
   try {
      const patient = await db.query.patients.findFirst({
         where: (patients, { eq }) => eq(patients.patientId, patientId as any),
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
