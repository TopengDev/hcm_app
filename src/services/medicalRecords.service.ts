'use server';
import { db } from '../db/db';
import { medicalRecords } from '../db/schema';
import { desc, eq, ilike, or } from 'drizzle-orm';

export async function createMedicalRecord(payload: FormData) {
   try {
      const newMedicalRecord: any = {};
      payload
         .entries()
         .forEach((entry) => ((newMedicalRecord as any)[entry[0]] = entry[1]));

      delete newMedicalRecord.complaint;

      const result = (
         await db.insert(medicalRecords).values(newMedicalRecord).returning()
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

// export async function updateMedicalRecord(payload: FormData) {
//    try {
//       let updatedMedicalRecord: any = {};
//       payload
//          .entries()
//          .forEach((entry) => ((updatedMedicalRecord as any)[entry[0]] = entry[1]));

//       updatedMedicalRecord.medicalRecordId = parseInt(updatedMedicalRecord.medicalRecordId);

//       const existingMedicalRecordByEmail = await db.query.medicalRecords.findFirst({
//          where: (medicalRecords, { eq }) => eq(medicalRecords.email, updatedMedicalRecord.email),
//       });
//       if (
//          existingMedicalRecordByEmail?.medicalRecordId &&
//          existingMedicalRecordByEmail?.medicalRecordId !== updatedMedicalRecord.medicalRecordId
//       )
//          return {
//             success: false,
//             msg: 'Email is already used',
//          };

//       const existingMedicalRecordByPhoneNumber = await db.query.medicalRecords.findFirst({
//          where: (medicalRecords, { eq }) =>
//             eq(medicalRecords.phoneNumber, updatedMedicalRecord.phoneNumber),
//       });
//       if (
//          existingMedicalRecordByPhoneNumber &&
//          existingMedicalRecordByPhoneNumber?.medicalRecordId !== updatedMedicalRecord.medicalRecordId
//       )
//          return {
//             success: false,
//             msg: 'Phone number is already used',
//          };

//       const existingMedicalRecordByIdCard = await db.query.medicalRecords.findFirst({
//          where: (medicalRecords, { eq }) =>
//             eq(medicalRecords.idCard, updatedMedicalRecord.idCard),
//       });
//       if (
//          existingMedicalRecordByIdCard &&
//          existingMedicalRecordByIdCard?.medicalRecordId !== updatedMedicalRecord.medicalRecordId
//       )
//          return {
//             success: false,
//             msg: 'Id card number is already used',
//          };

//       updatedMedicalRecord = {
//          ...updatedMedicalRecord,
//          createdAt: undefined,
//          updatedAt: undefined,
//       };
//       const result = await db
//          .update(medicalRecords)
//          .set(updatedMedicalRecord)
//          .where(eq(medicalRecords.medicalRecordId, updatedMedicalRecord.medicalRecordId))
//          .returning();

//       return {
//          success: !!result,
//          data: result,
//          msg: 'Success',
//       };
//    } catch (err: any) {
//       console.error(err.toString());
//       return {
//          success: false,
//          msg: `An error occured ${err.toString()}`,
//       };
//    }
// }

// export async function deleteMedicalRecord(medicalRecordId: string) {
//    try {
//       await db.delete(medicalRecords).where(eq(medicalRecords.medicalRecordId, medicalRecordId as any));

//       return {
//          success: true,
//          msg: 'Data deleted successfully',
//       };
//    } catch (err: any) {
//       console.error(err.toString());
//       return {
//          success: false,
//          msg: `An error occured ${err.toString()}`,
//       };
//    }
// }
// export async function getMedicalRecords(payload?: FormData) {
//    try {
//       const request: any = {};
//       if (payload)
//          payload
//             .entries()
//             .forEach((entry) => ((request as any)[entry[0]] = entry[1]));

//       const limit = Number(request.limit || 10);
//       const offset = Number(request.offset || 0);
//       const search = (request.search || '').toLowerCase();

//       const p = medicalRecords;

//       const whereClause = search ? or(ilike(p.name, `%${search}%`)) : undefined;

//       const results = await db
//          .select()
//          .from(p)
//          .where(whereClause)
//          .limit(limit)
//          .offset(offset)
//          .orderBy(desc(p.updatedAt));

//       return {
//          success: true,
//          data: results,
//          msg: 'Data fetched successfully',
//       };
//    } catch (err: any) {
//       console.error(err.toString());
//       return {
//          success: false,
//          msg: `An error occured ${err.toString()}`,
//       };
//    }
// }

// export async function getMedicalRecordById(medicalRecordId: string) {
//    try {
//       const medicalRecord = await db.query.medicalRecords.findFirst({
//          where: (medicalRecords, { eq }) => eq(medicalRecords.medicalRecordId, medicalRecordId as any),
//       });

//       return {
//          success: true,
//          data: medicalRecord,
//          msg: 'Data fetched successfully',
//       };
//    } catch (err: any) {
//       console.error(err.toString());
//       return {
//          success: false,
//          msg: `An error occured ${err.toString()}`,
//       };
//    }
// }
