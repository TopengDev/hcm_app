'use client';
import { PropsWithChildren, useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { createContext, useContext } from 'react';
import { cookies } from 'next/headers';
import { getProfile } from '@/services/auth.service';

const globalContext = createContext<any>({});

export default function GlobalProvider({ children }: PropsWithChildren) {
   const [user, setUser] = useState<any>();

   useEffect(() => {
      async function setProfile() {
         const response = await getProfile();
         if (response) setUser(response.data);
      }

      setProfile();
   }, []);

   return (
      <globalContext.Provider
         value={{
            states: { user },
            actions: { setUser },
         }}
      >
         <ToastContainer />
         {children}
      </globalContext.Provider>
   );
}

export const useGlobalContext = () => useContext(globalContext);
