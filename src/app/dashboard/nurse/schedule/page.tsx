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
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
   const router = useRouter();
   const [schedules, setSchedules] = useState<any[]>([]);
   async function fetchSchedules() {
      setSchedules((await getAllSchedules())?.data || []);
   }
   useEffect(() => {
      fetchSchedules();
   }, []);

   return (
      <div className="w-full h-full overflow-scroll ">
         <div className="w-full p-8">
            <h2 className="text-lg">Jadwal</h2>
         </div>
         <div className="w-full flex items-center justify-end p-8">
            <Link href={`/dashboard/nurse/schedule/create`}>
               <Button className="hover:cursor-pointer">Tambah Jadwal</Button>
            </Link>
         </div>
         <div className="w-full text-center">
            <h2 className="text-lg font-semibold my-4">
               Jadwal Praktik Dokter
            </h2>

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
                     <TableRow key={schedule?.doctor?.doctorId}>
                        <TableCell className="text-center">
                           {schedule?.doctor?.name}
                        </TableCell>
                        <TableCell
                           className="text-center hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/schedule/detail?id=${
                                    (schedule.schedules as any[]).findLast(
                                       (sched) => sched.dayOfWeek === 0,
                                    )?.scheduleId
                                 }`,
                              );
                           }}
                        >
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
                        <TableCell
                           className="text-center hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/schedule/detail?id=${
                                    (schedule.schedules as any[]).findLast(
                                       (sched) => sched.dayOfWeek === 1,
                                    )?.scheduleId
                                 }`,
                              );
                           }}
                        >
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
                        <TableCell
                           className="text-center hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/schedule/detail?id=${
                                    (schedule.schedules as any[]).findLast(
                                       (sched) => sched.dayOfWeek === 2,
                                    )?.scheduleId
                                 }`,
                              );
                           }}
                        >
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
                        <TableCell
                           className="text-center hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/schedule/detail?id=${
                                    (schedule.schedules as any[]).findLast(
                                       (sched) => sched.dayOfWeek === 3,
                                    )?.scheduleId
                                 }`,
                              );
                           }}
                        >
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
                        <TableCell
                           className="text-center hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/schedule/detail?id=${
                                    (schedule.schedules as any[]).findLast(
                                       (sched) => sched.dayOfWeek === 4,
                                    )?.scheduleId
                                 }`,
                              );
                           }}
                        >
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
                        <TableCell
                           className="text-center hover:cursor-pointer"
                           onClick={() => {
                              router.push(
                                 `/dashboard/nurse/schedule/detail?id=${
                                    (schedule.schedules as any[]).findLast(
                                       (sched) => sched.dayOfWeek === 5,
                                    )?.scheduleId
                                 }`,
                              );
                           }}
                        >
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
      </div>
   );
}

export default Page;
