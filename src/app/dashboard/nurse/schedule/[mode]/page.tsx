'use client';

import Form, { TFormProps } from '@/components/custom/form';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import {
   createSchedule,
   getScheduleById,
   updateSchedule,
} from '@/services/schedules.service';
import { getDoctors } from '@/services/doctors.service';

function Page() {
   const router = useRouter();
   const params = useParams();
   const searchParams = useSearchParams();

   async function onSubmit(formData: FormData) {
      try {
         let response;

         switch (params.mode) {
            case 'create':
               response = await createSchedule(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/schedule');
               }

               return response;
            case 'detail':
               response = await updateSchedule(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/schedule');
               }

               return response;
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [doctors, setDoctors] = useState<any[]>([]);
   async function fetchDoctors() {
      setDoctors((await getDoctors())?.data || []);
   }
   useEffect(() => {
      fetchDoctors();
   }, []);

   const [initialValues, setInitialValues] = useState<any>({});
   async function fetchSchedule() {
      const schedule = (await getScheduleById(searchParams.get('id') || ''))
         ?.data;
      setInitialValues({ ...schedule, doctorId: String(schedule?.doctorId) });
   }
   useEffect(() => {
      if (searchParams.get('id')) fetchSchedule();
   }, [router]);
   useEffect(() => {
      console.log({ initialValues });
   }, [initialValues]);

   const formFields: TFormProps['fields'] = useMemo(
      () => [
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
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Hari',
                  inputProps: {
                     name: 'dayOfWeek',
                     required: true,
                  },
                  isSelect: true,
                  options: [
                     {
                        label: 'Senin',
                        value: '0',
                     },
                     {
                        label: 'Selasa',
                        value: '1',
                     },
                     {
                        label: 'Rabu',
                        value: '2',
                     },
                     {
                        label: 'Kamis',
                        value: '3',
                     },
                     {
                        label: 'Jumat',
                        value: '4',
                     },
                     {
                        label: 'Sabtu',
                        value: '5',
                     },
                  ],
               },
               {
                  label: 'Waktu Mulai',
                  inputProps: {
                     name: 'startTime',
                     required: true,
                     type: 'time',
                  },
               },
               {
                  label: 'Waktu Berakhir',
                  inputProps: {
                     name: 'endTime',
                     required: true,
                     type: 'time',
                  },
               },
            ],
         },
         {
            horizontalFieldsContainer: true,
            fields: [
               {
                  label: 'Maksimal Pasien',
                  inputProps: {
                     name: 'maxPatients',
                     required: true,
                     type: 'number',
                  },
               },
               {
                  label: 'Berlaku Mulai',
                  inputProps: {
                     name: 'validFrom',
                     required: true,
                     type: 'date',
                  },
               },
               {
                  label: 'Berlaku Sampai',
                  inputProps: {
                     name: 'validTo',
                     required: true,
                     type: 'date',
                  },
               },
            ],
         },
      ],
      [doctors, initialValues, router],
   );

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         {params.mode !== 'detail' ||
            (Object.keys(initialValues)?.length > 0 && (
               <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
                  <Form
                     title="Pendaftaran Jadwal"
                     description="Silahkan mengisi detail jadwal praktik"
                     submitButtonCaption={
                        params.mode === 'detail' ? 'Simpan' : 'Buat'
                     }
                     fields={formFields}
                     actionCallback={onSubmit}
                     initialValues={
                        params.mode === 'detail' ? initialValues : undefined
                     }
                  />
               </div>
            ))}
      </div>
   );
}

export default Page;
