import {
   pgTable,
   foreignKey,
   serial,
   integer,
   time,
   boolean,
   date,
   timestamp,
   varchar,
   text,
   numeric,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const schedules = pgTable(
   'schedules',
   {
      scheduleId: serial('schedule_id').notNull().primaryKey(),
      doctorId: integer('doctor_id').notNull(),
      dayOfWeek: integer('day_of_week').notNull(),
      startTime: time('start_time').notNull(),
      endTime: time('end_time').notNull(),
      maxPatients: integer('max_patients'),
      isRecurring: boolean('is_recurring'),
      validFrom: date('valid_from').notNull(),
      validTo: date('valid_to'),
      createdAt: timestamp('created_at', { mode: 'string' }),
      updatedAt: timestamp('updated_at', { mode: 'string' }),
   },
   (table) => [
      foreignKey({
         columns: [table.doctorId],
         foreignColumns: [doctors.doctorId],
         name: 'schedules_doctor_id_fkey',
      }),
   ],
);

export const doctors = pgTable('doctors', {
   doctorId: serial('doctor_id').notNull().primaryKey(),
   registrationNumber: varchar('registration_number', { length: 50 }).notNull(),
   specialization: varchar({ length: 100 }).notNull(),
   education: text(),
   experienceYears: integer('experience_years'),
   isAvailable: boolean('is_available'),
   createdAt: timestamp('created_at', { mode: 'string' }),
   updatedAt: timestamp('updated_at', { mode: 'string' }),

   name: varchar({ length: 100 }).notNull(),
   phoneNumber: varchar('phone_number', { length: 20 }),
   email: varchar({ length: 64 }),
   address: varchar({ length: 240 }),
   gender: varchar({ length: 6 }),
   birthDate: date('birth_date').notNull(),
   profession: varchar({ length: 64 }),
   idCard: varchar('id_card', { length: 80 }),
   password: varchar({ length: 255 }),
});

export const nurses = pgTable('nurses', {
   nurseId: serial('nurse_id').notNull().primaryKey(),
   department: varchar({ length: 100 }),
   position: varchar({ length: 100 }),
   createdAt: timestamp('created_at', { mode: 'string' }),
   updatedAt: timestamp('updated_at', { mode: 'string' }),

   name: varchar({ length: 100 }).notNull(),
   phoneNumber: varchar('phone_number', { length: 20 }),
   email: varchar({ length: 64 }),
   address: varchar({ length: 240 }),
   gender: varchar({ length: 6 }),
   birthDate: date('birth_date').notNull(),
   profession: varchar({ length: 64 }),
   idCard: varchar('id_card', { length: 80 }),
   password: varchar({ length: 255 }),
});

export const patients = pgTable('patients', {
   patientId: serial('patient_id').notNull().primaryKey(),
   bloodType: varchar('blood_type', { length: 5 }),
   allergies: text(),
   heightCm: integer('height_cm'),
   weightKg: numeric('weight_kg', { precision: 5, scale: 2 }),
   createdAt: timestamp('created_at', { mode: 'string' }),
   updatedAt: timestamp('updated_at', { mode: 'string' }),

   name: varchar({ length: 100 }).notNull(),
   phoneNumber: varchar('phone_number', { length: 20 }),
   email: varchar({ length: 64 }),
   address: varchar({ length: 240 }),
   gender: varchar({ length: 6 }),
   birthDate: date('birth_date').notNull(),
   profession: varchar({ length: 64 }),
   idCard: varchar('id_card', { length: 80 }),
   password: varchar({ length: 255 }),
});

export const appointments = pgTable(
   'appointments',
   {
      appointmentId: serial('appointment_id').notNull().primaryKey(),
      patientId: integer('patient_id').notNull(),
      scheduleId: integer('schedule_id').notNull(),
      appointmentDate: date('appointment_date').notNull(),
      startTime: time('start_time').notNull(),
      endTime: time('end_time'),
      status: varchar({ length: 20 }).notNull(),
      complaint: text(),
      createdAt: timestamp('created_at', { mode: 'string' }),
      updatedAt: timestamp('updated_at', { mode: 'string' }),
   },
   (table) => [
      foreignKey({
         columns: [table.patientId],
         foreignColumns: [patients.patientId],
         name: 'appointments_patient_id_fkey',
      }),
      foreignKey({
         columns: [table.scheduleId],
         foreignColumns: [schedules.scheduleId],
         name: 'appointments_schedule_id_fkey',
      }),
   ],
);

export const medicalRecords = pgTable(
   'medical_records',
   {
      recordId: serial('record_id').notNull().primaryKey(),
      appointmentId: integer('appointment_id').notNull(),
      nurseId: integer('nurse_id'),
      symptoms: text(),
      diagnosis: text(),
      treatment: text(),
      notes: text(),
      paymentStatus: varchar('payment_status', { length: 20 }),
      totalFee: numeric('total_fee', { precision: 10, scale: 2 }),
      createdAt: timestamp('created_at', { mode: 'string' }),
      updatedAt: timestamp('updated_at', { mode: 'string' }),
   },
   (table) => [
      foreignKey({
         columns: [table.appointmentId],
         foreignColumns: [appointments.appointmentId],
         name: 'medical_records_appointment_id_fkey',
      }),
      foreignKey({
         columns: [table.nurseId],
         foreignColumns: [nurses.nurseId],
         name: 'medical_records_nurse_id_fkey',
      }),
   ],
);

export const recipes = pgTable(
   'recipes',
   {
      recipeId: serial('recipe_id').notNull().primaryKey(),
      recordId: integer('record_id').notNull(),
      medicineName: varchar('medicine_name', { length: 255 }).notNull(),
      dosage: varchar({ length: 100 }).notNull(),
      frequency: varchar({ length: 100 }).notNull(),
      duration: varchar({ length: 50 }).notNull(),
      instructions: text(),
      createdAt: timestamp('created_at', { mode: 'string' }),
   },
   (table) => [
      foreignKey({
         columns: [table.recordId],
         foreignColumns: [medicalRecords.recordId],
         name: 'recipes_record_id_fkey',
      }),
   ],
);
