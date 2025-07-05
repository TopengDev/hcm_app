import { Button } from '@/components/ui/button';
import {
   Card,
   CardAction,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';

export default function Page() {
   return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
         <div className="mb-16">
            <h1 className="text-2xl font-bold">
               Choose your preferred account type
            </h1>
         </div>
         <div className="flex items-center justify-center gap-8 w-full">
            <a
               href="/auth/registration/patient"
               className="w-full max-w-sm hover:cursor-pointer hover:scale-110 transition-all duration-150"
            >
               <Card>
                  <CardHeader>
                     <CardTitle>Patient</CardTitle>
                     <CardDescription>
                        Use this type of account if you want to have a
                        consultation appointment
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                     <Image src="/user.png" width={160} height={160} alt="" />
                  </CardContent>
               </Card>
            </a>
            <a
               href="/auth/registration/nurse"
               className="w-full max-w-sm hover:cursor-pointer hover:scale-110 transition-all duration-150"
            >
               <Card>
                  <CardHeader>
                     <CardTitle>Admin</CardTitle>
                     <CardDescription>
                        Use this type of account if you are an administrator
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                     <Image src="/admin.png" width={160} height={160} alt="" />
                  </CardContent>
               </Card>
            </a>
            <a
               href="/auth/registration/doctor"
               className="w-full max-w-sm hover:cursor-pointer hover:scale-110 transition-all duration-150"
            >
               <Card>
                  <CardHeader>
                     <CardTitle>Doctor</CardTitle>
                     <CardDescription>
                        Use this type of account if you are a doctor
                     </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center">
                     <Image src="/doctor.png" width={160} height={160} alt="" />
                  </CardContent>
               </Card>
            </a>
         </div>
      </div>
   );
}
