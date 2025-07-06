'use client';
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
import { getAllAppointments } from '@/services/appointments.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
   const router = useRouter();

   const [appointments, setAppointments] = useState<any[]>([]);
   async function fetchAppointments() {
      setAppointments((await getAllAppointments())?.data || []);
   }
   useEffect(() => {
      fetchAppointments();
   }, []);

   return (
      <div className="w-full h-full flex flex-col items-center justify-center">
         <div className="w-full p-8">
            <h2 className="text-lg">Kunjungan</h2>
         </div>
         <div className="w-full h-full overflow-scroll p-8">
            <div className="w-full flex items-center justify-end my-4">
               <Link href={`/dashboard/nurse/appointment/create`}>
                  <Button className="hover:cursor-pointer">
                     Buat Kunjungan
                  </Button>
               </Link>
            </div>
            <div className="w-full text-center">
               <h2 className="text-lg font-semibold my-4">List Kunjungan</h2>
               <Table>
                  <TableCaption>List Kunjungan</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="text-center">No</TableHead>
                        <TableHead className="text-center">Pasien</TableHead>
                        <TableHead className="text-center">Keluhan</TableHead>
                        <TableHead className="text-center">
                           Status Kunjungan
                        </TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {appointments?.map((appointment, i) => (
                        <TableRow
                           key={appointment.appointmentId}
                           className="hover:cursor-pointer"
                           onClick={() =>
                              router.push(
                                 `/dashboard/nurse/appointment/detail?id=${appointment.appointmentId}`,
                              )
                           }
                        >
                           <TableCell className="text-center">
                              {i + 1}
                           </TableCell>
                           <TableCell className="text-center">
                              {(appointment as any).patient?.name || ''}
                           </TableCell>
                           <TableCell className="text-center">
                              {(appointment as any).complaint || ''}
                           </TableCell>
                           <TableCell className="text-center">
                              {(appointment as any)?.status || ''}
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </div>
         </div>
      </div>
   );
}

export default Page;
