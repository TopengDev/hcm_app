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
import React, { useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';

type TFormField = {
   label: string;
   inputProps: React.ComponentProps<'input'>;
   horizontalFieldsContainer?: false;
} & (
   | {
        isSelect?: false;
     }
   | {
        onChoice?: (params?: any) => any;
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
   initialValues?: object;
};

export default function Form(props: TFormProps) {
   const router = useRouter();
   const formRef = useRef<HTMLFormElement>(null);
   const { pending } = useFormStatus();

   const [fieldValues, setFieldValues] = React.useState<Record<string, any>>(
      {},
   );

   useEffect(() => {
      if (formRef.current && props.initialValues) {
         setFieldValues(props.initialValues);
         for (const [key, value] of Object.entries(props.initialValues)) {
            let input = formRef.current.elements.namedItem(
               key,
            ) as HTMLInputElement;
            if (!input) {
               input = document.createElement('input');
               input.type = 'hidden';
               input.name = key;
               formRef.current.appendChild(input);
            }
            input.value = value;
         }
      }
   }, [props.initialValues, router]);

   if (
      (props.initialValues && Object.keys(props.initialValues)?.length) ||
      !props.initialValues
   )
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
                                       className="w-full flex flex-col gap-2"
                                       key={`form-field-${i}-${j}`}
                                    >
                                       {field.label && (
                                          <Label
                                             htmlFor={
                                                field.inputProps.name || ''
                                             }
                                          >
                                             {field.label}
                                          </Label>
                                       )}
                                       {field.isSelect ? (
                                          <Select
                                             name={field?.inputProps?.name}
                                             value={
                                                fieldValues[
                                                   field.inputProps.name!
                                                ]
                                             }
                                             required={
                                                field?.inputProps?.required
                                             }
                                             disabled={
                                                field?.inputProps?.disabled
                                             }
                                             onValueChange={(v) => {
                                                setFieldValues({
                                                   ...fieldValues,
                                                   [field.inputProps.name ||
                                                   '']: v,
                                                });
                                                if (field.onChoice) {
                                                   field.onChoice(v);
                                                }
                                             }}
                                          >
                                             <SelectTrigger className="w-full">
                                                <SelectValue
                                                   placeholder={field.label}
                                                />
                                             </SelectTrigger>
                                             <SelectContent>
                                                {field.options.map(
                                                   (option, k) => (
                                                      <SelectItem
                                                         value={option.value}
                                                         key={`form-field-select-${i}-${j}-${k}-${option.value}-${option.label}`}
                                                      >
                                                         {option.label}
                                                      </SelectItem>
                                                   ),
                                                )}
                                             </SelectContent>
                                          </Select>
                                       ) : (
                                          <Input {...field.inputProps} />
                                       )}
                                    </div>
                                 ))}
                              </div>
                           ) : (
                              <div className="w-full flex flex-col gap-2">
                                 {field.label && (
                                    <Label
                                       htmlFor={field.inputProps.name || ''}
                                    >
                                       {field.label}
                                    </Label>
                                 )}
                                 {field.isSelect ? (
                                    <Select
                                       name={field?.inputProps?.name}
                                       value={
                                          fieldValues[field.inputProps.name!]
                                       }
                                       required={field?.inputProps?.required}
                                       disabled={field?.inputProps?.disabled}
                                       onValueChange={(v) => {
                                          setFieldValues({
                                             ...fieldValues,
                                             [field.inputProps.name || '']: v,
                                          });
                                          if (field.onChoice) {
                                             field.onChoice(v);
                                          }
                                       }}
                                    >
                                       <SelectTrigger className="w-full">
                                          <SelectValue
                                             placeholder={field.label}
                                          />
                                       </SelectTrigger>
                                       <SelectContent>
                                          {field.options.map((option, k) => (
                                             <SelectItem
                                                value={option.value}
                                                key={`form-field-select-${i}-${k}-${option.value}-${option.label}`}
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
                  <Button
                     type="submit"
                     className="w-full hover:cursor-pointer"
                     disabled={pending}
                  >
                     {props.submitButtonCaption
                        ? props.submitButtonCaption
                        : 'Submit'}
                  </Button>
               </form>
            </CardContent>
         </Card>
      );
   else return null;
}
