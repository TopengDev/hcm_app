'use server';
import { db } from '../db/db';
import { doctors } from '../db/schema';

export async function registerDoctor(payload: FormData) {
   try {
      const newDoctor: any = {};
      payload
         .entries()
         .forEach((entry) => ((newDoctor as any)[entry[0]] = entry[1]));

      const existingDoctorByEmail = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.email, newDoctor.email),
      });
      if (existingDoctorByEmail)
         return {
            success: false,
            msg: 'Email is already used',
         };

      const existingDoctorByPhoneNumber = await db.query.doctors.findFirst({
         where: (doctors, { eq }) =>
            eq(doctors.phoneNumber, newDoctor.phoneNumber),
      });
      if (existingDoctorByPhoneNumber)
         return {
            success: false,
            msg: 'Phone number is already used',
         };

      const existingDoctorByIdCard = await db.query.doctors.findFirst({
         where: (doctors, { eq }) => eq(doctors.idCard, newDoctor.idCard),
      });
      if (existingDoctorByIdCard)
         return {
            success: false,
            msg: 'Id card number is already used',
         };

      const result = (
         await db.insert(doctors).values(newDoctor).returning()
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
