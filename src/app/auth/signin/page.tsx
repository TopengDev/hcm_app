'use client';
import React from 'react';
import Form, { TFormProps } from '@/components/custom/form';
import { formFields } from './form';
import { signIn } from '@/services/auth.service';
import { toast } from 'react-toastify';

function Page() {
   async function onSubmit(formData: FormData) {
      try {
         const response = await signIn(formData);

         if (!response.success) {
            toast.info(response.msg);
         }

         return response;
      } catch (error: any) {
         toast.error(error.toString());
      }
   }

   return (
      <div className="w-screen h-screen flex items-center justify-center overflow-y-scroll">
         <div className="w-full sm:w-md md:w-lg lg:w-xl xl:w-2xl 2xl:w-3xl">
            <Form
               title="Sign in to your account"
               description="Please input your credentials"
               submitButtonCaption="Sign In"
               fields={formFields}
               actionCallback={onSubmit}
            />
            <div className=" w-full flex items-center justify-center gap-2 my-4 text-slate-400">
               <p>Don't hace an account?</p>
               <a
                  href="/auth/registration"
                  className="text-slate-500 hover:text-slate-700"
               >
                  Register
               </a>
            </div>
         </div>
      </div>
   );
}

export default Page;
