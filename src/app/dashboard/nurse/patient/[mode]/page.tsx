'use client';

import React, { useEffect, useState } from 'react';
import Form from '@/components/custom/form';
import {
   deletePatient,
   getPatientById,
   registerPatient,
   updatePatient,
} from '@/services/patients.service';
import { formFields } from './form';
import { toast } from 'react-toastify';
import GlobalProvider from '@/app/globalProvider';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

function PageComponent() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const params = useParams();
   const submitButtonCaption =
      params.mode === 'create'
         ? 'Create'
         : params.mode === 'detail'
         ? 'Save'
         : '';

   async function onSubmit(formData: FormData) {
      try {
         let response;

         switch (params.mode) {
            case 'create':
               response = await registerPatient(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard');
               }

               return response;
            case 'detail':
               response = await updatePatient(formData);
               if (!response?.success) {
                  toast.info(response?.msg);
               } else {
                  router.push('/dashboard/nurse/patient');
               }

               return response;
         }
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   async function onDelete() {
      try {
         const response = await deletePatient(searchParams.get('id') || '');

         if (!response?.success) {
            toast.info(response?.msg);
         } else {
            router.push('/dashboard/nurse/patient');
         }

         console.log({ response });
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   const [initialValues, setInitialValues] = useState<any>();
   useEffect(() => {
      const patientId = searchParams.get('id');
      async function getUser() {
         const response = await getPatientById(patientId || '');

         setInitialValues(response.data);
      }

      if (patientId) getUser();
   }, []);

   return (
      <div className="w-fulll h-fulll flex items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Patient Registration"
               description="Please fill in the form below"
               submitButtonCaption={submitButtonCaption}
               fields={formFields}
               actionCallback={onSubmit}
               initialValues={initialValues}
            />
            {params.mode === 'detail' && (
               <div className="w-full my-4">
                  <Button
                     variant={'destructive'}
                     className=" hover:cursor-pointer"
                     type="button"
                     onClick={onDelete}
                  >
                     Delete Patient
                     <Trash2 />
                  </Button>
               </div>
            )}
         </div>
      </div>
   );
}

export default function Page() {
   return (
      <GlobalProvider>
         <PageComponent />
      </GlobalProvider>
   );
}
