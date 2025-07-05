'use server';
import { db } from '../db/db';
import { patients } from '../db/schema';

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
