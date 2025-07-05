import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { patients } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
   const patient: typeof patients.$inferInsert = {
      name: 'Wawa',
      birthDate: '2020-09-09',
   };

   await db.insert(patients).values(patient);
   console.log('New patient created!');

   const patientsResult = await db.select().from(patients);
   console.log('Getting all patients from the database: ', patients);

   await db.update(patients).set({
      address: 'Jl mawar 2',
   });
   console.log('Patient info updated!');

   await db.delete(patients);
   console.log('Patients deleted!');
}

main();
