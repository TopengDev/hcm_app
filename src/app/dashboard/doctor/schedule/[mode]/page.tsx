'use client';

import Form from '@/components/custom/form';
import React from 'react';
import { formFields } from './form';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { createSchedule } from '@/services/schedules.service';

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
                  router.push('/dashboard/doctor/schedule');
               }

               return response;
            // case 'detail':
            //    response = await updatePatient(formData);
            //    if (!response?.success) {
            //       toast.info(response?.msg);
            //    } else {
            //       router.push('/dashboard/nurse/patient');
            //    }

            //    return response;
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   return (
      <div className="w-fulll h-fulll flex flex-col items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Pendaftaran Jadwal"
               description="Silahkan mengisi detail jadwal praktik"
               submitButtonCaption={'Buat'}
               fields={formFields}
               actionCallback={onSubmit}
               initialValues={{ doctorId: searchParams.get('doctorId') }}
            />
         </div>
      </div>
   );
}

export default Page;
