'use client';
import { useGlobalContext } from '@/app/globalProvider';
import { Button } from '@/components/ui/button';
import {
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
   Table,
} from '@/components/ui/table';
import { getAllSchedules } from '@/services/schedules.service';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

function Page() {
   const { states } = useGlobalContext();

   const [schedules, setSchedules] = useState<any[]>([]);
   async function fetchSchedules() {
      setSchedules((await getAllSchedules())?.data || []);
   }
   useEffect(() => {
      fetchSchedules();
   }, []);

   return (
      <div className="w-full h-full overflow-scroll p-8">
         <div className="w-full flex items-center justify-end my-4">
            <Link
               href={`/dashboard/doctor/schedule/create?doctorId=${
                  states?.user?.doctorId || ''
               }`}
            >
               <Button className="hover:cursor-pointer">Tambah Jadwal</Button>
            </Link>
         </div>
         <Table>
            <TableCaption>Jadwal Praktik</TableCaption>
            <TableHeader>
               <TableRow>
                  <TableHead className="text-center">Nama Dokter</TableHead>
                  <TableHead className="text-center">Senin</TableHead>
                  <TableHead className="text-center">Selasa</TableHead>
                  <TableHead className="text-center">Rabu</TableHead>
                  <TableHead className="text-center">Kamis</TableHead>
                  <TableHead className="text-center">Jumat</TableHead>
                  <TableHead className="text-center">Sabtu</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               {schedules?.map((schedule: any) => (
                  <TableRow
                     key={schedule?.doctor?.doctorId}
                     className="hover:cursor-pointer"
                  >
                     <TableCell className="text-center">
                        {schedule?.doctor?.name}
                     </TableCell>
                     <TableCell className="text-center">
                        {`${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 0,
                           )?.startTime || ''
                        } - ${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 0,
                           )?.endTime || ''
                        }`}
                     </TableCell>
                     <TableCell className="text-center">
                        {`${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 1,
                           )?.startTime || ''
                        } - ${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 1,
                           )?.endTime || ''
                        }`}
                     </TableCell>
                     <TableCell className="text-center">
                        {`${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 2,
                           )?.startTime || ''
                        } - ${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 2,
                           )?.endTime || ''
                        }`}
                     </TableCell>
                     <TableCell className="text-center">
                        {`${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 3,
                           )?.startTime || ''
                        } - ${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 3,
                           )?.endTime || ''
                        }`}
                     </TableCell>
                     <TableCell className="text-center">
                        {`${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 4,
                           )?.startTime || ''
                        } - ${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 4,
                           )?.endTime || ''
                        }`}
                     </TableCell>
                     <TableCell className="text-center">
                        {`${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 5,
                           )?.startTime || ''
                        } - ${
                           (schedule.schedules as any[]).findLast(
                              (sched) => sched.dayOfWeek === 5,
                           )?.endTime || ''
                        }`}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </div>
   );
}

export default Page;
