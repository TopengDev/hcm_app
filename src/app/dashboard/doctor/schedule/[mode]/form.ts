import { TFormProps } from '@/components/custom/form';

export const formFields: TFormProps['fields'] = [
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
];
