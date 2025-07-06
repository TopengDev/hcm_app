'use client';

import Form, { TFormProps } from '@/components/custom/form';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { getAllSchedules } from '@/services/schedules.service';
import { getPatients } from '@/services/patients.service';
import { getDoctors } from '@/services/doctors.service';
import { dayOfWeekAsString } from '@/lib/utils';
import {
   createAppointments,
   getAppointment,
   updateAppointments,
} from '@/services/appointments.service';
import {
   TableCaption,
   TableHeader,
   TableRow,
   TableHead,
   TableBody,
   TableCell,
   Table,
} from '@/components/ui/table';

function Page() {
   const router = useRouter();
   const params = useParams();
   const searchParams = useSearchParams();

   const [initialValues, setInitialValues] = useState<any>({});
   useEffect(() => {
      const appointmentId = searchParams.get('id');
      async function fetchAppointment() {
         const response = await getAppointment(appointmentId || '');

         setInitialValues({
            ...response.data,
            patientId: String(response.data?.patientId),
            doctorId: String(response?.data?.doctorId),
            scheduleId: String(response?.data?.scheduleId),
         });
         if (response.data?.doctorId) setChosenDoctor(response?.data?.doctorId);
      }

      if (appointmentId) {
         fetchAppointment();
      }
   }, [router]);

   async function onSubmit(formData: FormData) {
      try {
         let response;

         switch (params.mode) {
            case 'create':
               response = await createAppointments(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/appointment');
               }

               return response;
            case 'detail':
               response = await updateAppointments(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/appointment');
               }

               return response;
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [patients, setPatients] = useState<any[]>([]);
   async function fetchPatients() {
      setPatients((await getPatients())?.data || []);
   }
   const [doctors, setDoctors] = useState<any[]>([]);
   async function fetchDoctors() {
      setDoctors((await getDoctors())?.data || []);
   }
   const [schedulesTable, setSchedulesTable] = useState<any[]>([]);
   const [schedules, setSchedules] = useState<any[]>([]);
   async function fetchSchedulesSelection(doctorId: string) {
      const payload = new FormData();
      if (doctorId) payload.append('doctorId', doctorId);
      const response = (await getAllSchedules(payload))?.data || [];
      const result = (response || [])?.[0]?.schedules;
      setSchedules(result);
   }
   async function fetchSchedulesTable() {
      const response = (await getAllSchedules())?.data || [];
      const result = response || [];
      setSchedulesTable(result);
   }
   useEffect(() => {
      fetchPatients();
      fetchDoctors();
      fetchSchedulesTable();
   }, [initialValues]);
   const [chosenDoctor, setChosenDoctor] = useState<any>();
   useEffect(() => {
      if (chosenDoctor) fetchSchedulesSelection(chosenDoctor);
   }, [chosenDoctor]);

   const formFields: TFormProps['fields'] = useMemo(
      () => [
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Pasien',
                  inputProps: {
                     name: 'patientId',
                     required: true,
                  },
                  isSelect: true,
                  options: patients.map((patient) => ({
                     label: patient.name,
                     value: String(patient.patientId),
                  })),
               },
               {
                  label: 'Dokter',
                  inputProps: {
                     name: 'doctorId',
                     required: true,
                  },
                  isSelect: true,
                  options: doctors.map((doctor) => ({
                     label: doctor.name,
                     value: String(doctor.doctorId),
                  })),
                  onChoice: (v) => setChosenDoctor(v),
               },
            ],
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Jadwal',
                  inputProps: {
                     name: 'scheduleId',
                     required: true,
                     disabled: !chosenDoctor,
                  },
                  isSelect: true,
                  options: schedules.map((schedule) => ({
                     label: dayOfWeekAsString(schedule.dayOfWeek),

                     value: String(schedule?.scheduleId),
                  })),
               },
               {
                  label: 'Tanggal',
                  inputProps: {
                     name: 'appointmentDate',
                     required: true,
                     type: 'date',
                  },
               },
            ],
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Waktu Mulai',
                  inputProps: {
                     name: 'startTime',
                     required: true,
                     type: 'time',
                  },
               },
               {
                  label: 'Sampai',
                  inputProps: {
                     name: 'endTime',
                     type: 'time',
                  },
               },
            ],
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Keluhan',
                  inputProps: {
                     name: 'complaint',
                     type: 'text',
                  },
               },
               {
                  label: 'status',
                  inputProps: {
                     name: 'status',
                     required: true,
                  },
                  isSelect: true,
                  options: [
                     {
                        label: 'Sedang Antri',
                        value: 'pending',
                     },
                     {
                        label: 'Sedang Tindakan',
                        value: 'treating',
                     },
                     {
                        label: 'Selesai',
                        value: 'done',
                     },
                  ],
               },
            ],
         },
      ],
      [patients, doctors, schedules, initialValues, chosenDoctor, router],
   );

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            {(params.mode !== 'detail' ||
               (initialValues && Object.keys(initialValues).length > 0)) && (
               <Form
                  title="Pendaftaran Jadwal Kunjungan"
                  description="Silahkan mengisi detail jadwal kunjungan"
                  submitButtonCaption={
                     params.mode === 'create' ? 'Buat' : 'Simpan'
                  }
                  fields={formFields}
                  actionCallback={onSubmit}
                  initialValues={
                     params.mode === 'detail' ? initialValues : undefined
                  }
               />
            )}
            <div className="w-full my-8 text-center">
               <h2 className="text-lg font-semibold my-4">
                  Jadwal Praktik Dokter
               </h2>
               <Table>
                  <TableCaption>Jadwal Praktik</TableCaption>
                  <TableHeader>
                     <TableRow>
                        <TableHead className="text-center">
                           Nama Dokter
                        </TableHead>
                        <TableHead className="text-center">Senin</TableHead>
                        <TableHead className="text-center">Selasa</TableHead>
                        <TableHead className="text-center">Rabu</TableHead>
                        <TableHead className="text-center">Kamis</TableHead>
                        <TableHead className="text-center">Jumat</TableHead>
                        <TableHead className="text-center">Sabtu</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {schedulesTable?.map((schedule: any) => (
                        <TableRow
                           key={schedule?.doctor?.doctorId}
                           className="hover:cursor-pointer"
                        >
                           <TableCell className="text-center">
                              {schedule?.doctor?.name}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 0,
                                 )?.startTime || ''
                              } - ${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 0,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 1,
                                 )?.startTime || ''
                              } - ${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 1,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 2,
                                 )?.startTime || ''
                              } - ${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 2,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 3,
                                 )?.startTime || ''
                              } - ${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 3,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 4,
                                 )?.startTime || ''
                              } - ${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 4,
                                 )?.endTime || ''
                              }`}
                           </TableCell>
                           <TableCell className="text-center">
                              {`${
                                 (schedule?.schedules as any[]).findLast(
                                    (sched) => sched.dayOfWeek === 5,
                                 )?.startTime || ''
                              } - ${
                                 (schedule?.schedules as any[]).findLast(
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
      </div>
   );
}

export default Page;
