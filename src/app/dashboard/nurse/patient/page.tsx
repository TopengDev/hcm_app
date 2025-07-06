'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
   Table,
} from '@/components/ui/table';
import { getPatients } from '@/services/patients.service';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function Page() {
   const router = useRouter();
   const [patients, setPatients] = useState<any[]>([]);
   async function fetchPatients() {
      setPatients((await getPatients())?.data || []);
   }
   useEffect(() => {
      fetchPatients();
   }, []);

   return (
      <div className="w-full h-full flex flex-col items-center justify-center">
         <div className="w-full p-8">
            <h2 className="text-lg">List Pasien</h2>
         </div>
         <div className="w-full p-8 flex items-center justify-end gap-4">
            <Link
               href={'/dashboard/nurse/patient/create'}
               className="flex flex-col gap-2"
            >
               <Label>&nbsp;</Label>
               <Button className="hover:cursor-pointer">Tambah Pasien</Button>
            </Link>
            <div>
               <form className="flex items-center gap-4">
                  <div className="flex flex-col gap-2">
                     <Label>&nbsp;</Label>
                     <Input type="string" name="keyword" />
                  </div>
                  <div className="flex flex-col gap-2">
                     <Label>&nbsp;</Label>
                     <Button className="hover:cursor-pointer">Cari</Button>
                  </div>
               </form>
            </div>
         </div>

         <div className="w-full h-full overflow-scroll">
            <Table>
               <TableCaption>List Pasien</TableCaption>
               <TableHeader>
                  <TableRow>
                     <TableHead className="text-center">No</TableHead>
                     <TableHead className="text-center">
                        No. Registrasi
                     </TableHead>
                     <TableHead className="text-center">Nama</TableHead>
                     <TableHead className="text-center">
                        Jenis Kelamin
                     </TableHead>
                     <TableHead className="text-center">Alamat</TableHead>
                     <TableHead className="text-center">Kontak</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {patients?.map((patient, i) => (
                     <TableRow
                        key={patient.patientId}
                        className="hover:cursor-pointer"
                        onClick={() =>
                           router.push(
                              `/dashboard/nurse/patient/detail?id=${patient.patientId}`,
                           )
                        }
                     >
                        <TableCell className="text-center">{i + 1}</TableCell>
                        <TableCell className="text-center">
                           {patient.patientId}
                        </TableCell>
                        <TableCell className="text-center">
                           {patient.name}
                        </TableCell>
                        <TableCell className="text-center">
                           {patient.gender}
                        </TableCell>
                        <TableCell className="text-center">
                           {patient.address}
                        </TableCell>
                        <TableCell className="text-center">
                           {patient.phoneNumber}
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
