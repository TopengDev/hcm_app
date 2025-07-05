'use client';

import {
   Card,
   CardHeader,
   CardTitle,
   CardDescription,
   CardContent,
} from '@/components/ui/card';
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import React, { useRef } from 'react';
import { useFormStatus } from 'react-dom';

type TFormField = {
   label: string;
   inputProps: React.ComponentProps<'input'>;
   horizontalFieldsContainer?: false;
} & (
   | {
        isSelect?: false;
     }
   | {
        isSelect: true;
        options: { label: string; value: any }[];
     }
);

export type TFormProps = {
   title?: string;
   description?: string;
   submitButtonCaption?: string;
   fields: (
      | { horizontalFieldsContainer: true; fields: TFormField[] }
      | TFormField
   )[];
   actionCallback?: (props?: any) => any;
};

export default function Form(props: TFormProps) {
   const formRef = useRef<HTMLFormElement>(null);
   const { pending } = useFormStatus();

   return (
      <Card className="w-full h-full">
         <CardHeader>
            {props.title && <CardTitle>{props.title}</CardTitle>}
            {props.description && (
               <CardDescription>{props.description}</CardDescription>
            )}
         </CardHeader>
         <CardContent>
            <form
               ref={formRef}
               onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const response = await props.actionCallback?.(formData);
                  if (response?.success) formRef.current?.reset();
               }}
            >
               <div className="flex flex-col gap-6">
                  {props.fields.map((field, i) => (
                     <div key={`form-field-${i}`}>
                        {field.horizontalFieldsContainer ? (
                           <div className="w-full flex items-center gap-4">
                              {field.fields.map((field, j) => (
                                 <div
                                    className="flex flex-col gap-2"
                                    key={`form-field-${i}-${j}`}
                                 >
                                    {field.label && (
                                       <Label
                                          htmlFor={field.inputProps.name || ''}
                                       >
                                          {field.label}
                                       </Label>
                                    )}
                                    {field.isSelect ? (
                                       <Select name={field.inputProps.name}>
                                          <SelectTrigger className="w-full">
                                             <SelectValue
                                                placeholder={field.label}
                                             />
                                          </SelectTrigger>
                                          <SelectContent>
                                             {field.options.map((option, k) => (
                                                <SelectItem
                                                   value={option.value}
                                                   key={`form-field-select-${i}-${j}-${k}`}
                                                >
                                                   {option.label}
                                                </SelectItem>
                                             ))}
                                          </SelectContent>
                                       </Select>
                                    ) : (
                                       <Input {...field.inputProps} />
                                    )}
                                 </div>
                              ))}
                           </div>
                        ) : (
                           <div className="flex flex-col gap-2">
                              {field.label && (
                                 <Label htmlFor={field.inputProps.name || ''}>
                                    {field.label}
                                 </Label>
                              )}
                              {field.isSelect ? (
                                 <Select name={field.inputProps.name}>
                                    <SelectTrigger className="w-full">
                                       <SelectValue placeholder={field.label} />
                                    </SelectTrigger>
                                    <SelectContent>
                                       {field.options.map((option, k) => (
                                          <SelectItem
                                             value={option.value}
                                             key={`form-field-select-${i}-${k}`}
                                          >
                                             {option.label}
                                          </SelectItem>
                                       ))}
                                    </SelectContent>
                                 </Select>
                              ) : (
                                 <Input {...field.inputProps} />
                              )}
                           </div>
                        )}
                     </div>
                  ))}
               </div>
               <div className="h-8" />
               <Button type="submit" className="w-full" disabled={pending}>
                  {props.submitButtonCaption
                     ? props.submitButtonCaption
                     : 'Submit'}
               </Button>
            </form>
         </CardContent>
      </Card>
   );
}
