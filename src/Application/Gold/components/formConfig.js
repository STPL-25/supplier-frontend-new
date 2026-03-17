
export const getFormFields = (
  formData,
  po,
  orderType,
  COMPANY_PRESETS,
  Tct_COMPANY_PRESETS,
  Parent_COMPANY_PRESETS
) => {
  return {
    step1: [
      {
        section: 'companyType',
        field: 'companyType',
        label: '',
        type: 'select',
        placeholder: 'Select company type',
        disabled: po === 'tct',
        options: [
          { value: '', label: 'Select company type', disabled: true },
          ...(po === 'tct'
            ? Object.entries(Tct_COMPANY_PRESETS)
            : Object.entries(COMPANY_PRESETS)
          ).map(([key, preset]) => ({
            value: key,
            label: `${preset.name} ${preset.subTitle}`,
          })),
        ],
        gridClass: 'col-span-full',
      },
      ...(formData?.from?.poPreFix === 'TCT'
        ? [
            {
              section: 'from',
              field: 'parentCompany',
              label: 'PO From',
              type: 'select',
              required: true,
              placeholder: 'Select parent company',
              options: [
                { value: '', label: 'Select parent company', disabled: true },
                ...Object.entries(Parent_COMPANY_PRESETS).map(([key, preset]) => ({
                  value: key,
                  label: `${preset.name} ${preset.subTitle}`,
                })),
              ],
              gridClass: 'col-span-full',
            },
          ]
        : []),
      {
        section: 'poDetails',
        field: 'poDate',
        label: formData?.from?.poPreFix === 'TCT' ? 'Issue Date' : 'PO Date',
        type: 'date',
        required: true,
        disabled: true,
        gridClass: 'col-span-1',
      },
      {
        section: 'poDetails',
        field: 'dueDate',
        label: 'Due Date',
        type: 'date',
        required: true,
        disabled: true,

        gridClass: 'col-span-1',
      },
    ],

    step2: [
      {
        section: 'supplier',
        field: 'name',
        label: 'Supplier Name',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter supplier name',
        gridClass: 'col-span-1',
      },
      {
        section: 'supplier',
        field: 'gstNo',
        label: 'GST Number',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter GST number',
        gridClass: 'col-span-1',
      },
      {
        section: 'supplier',
        field: 'phone',
        label: 'Phone',
        type: 'tel',
        required: true,
        placeholder: 'Enter phone number',
        gridClass: 'col-span-1',
      },
      {
        section: 'supplier',
        field: 'email',
        label: 'Email',
        type: 'email',
        required: true,
        disabled: true,
        placeholder: 'Enter email address',
        gridClass: 'col-span-1',
      },
      {
        section: 'supplier',
        field: 'doorNo',
        label: '',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Door No*',
        gridClass: 'col-span-1',
        wrapper: 'address',
      },
      {
        section: 'supplier',
        field: 'streetName',
        label: '',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Street Name*',
        gridClass: 'col-span-1',
        wrapper: 'address',
      },
      {
        section: 'supplier',
        field: 'area',
        label: '',
        type: 'text',
        disabled: true,
        placeholder: 'Area',
        gridClass: 'col-span-1',
        wrapper: 'address',
      },
      {
        section: 'supplier',
        field: 'city',
        label: 'City',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter city',
        gridClass: 'col-span-1',
      },
      {
        section: 'supplier',
        field: 'state',
        label: 'State',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter state',
        gridClass: 'col-span-1',
      },
      {
        section: 'supplier',
        field: 'pincode',
        label: 'Pincode',
        type: 'text',
        required: true,
        disabled: true,
        placeholder: 'Enter pincode',
        gridClass: 'col-span-1',
      },
    ],

    step3: [
      {
        section: 'counterDetails',
        field: 'purchaseIncharge',
        label: 'Purchase Incharge',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
        gridClass: 'col-span-full',
      },
      {
        section: 'counterDetails',
        field: 'purchaseManager',
        label: 'Purchase Manager',
        type: 'text',
        required: true,
        placeholder: 'Enter name',
        gridClass: 'col-span-full',
      },
    
       {
        section: 'Hallmark Details',
        field: 'hallmarking',
        label: 'Hallmarking',
        type: 'radio',
        options: [
          { name: 'Separate Bill', value: 'Separate Bill', label: 'Separate Bill' },
          { name: 'Included In Bill', value: 'Included In Bill', label: 'Included In Bill' },
          { name: 'Marking By Own', value: 'Marking By Own', label: 'Marking By Own' },
          { name: 'Hallmark by Own', value: 'Hallmark by Own', label: 'Hallmark by Own' },
        ],
         required: true,
        gridClass: 'col-span-full',
      },
       
      {
        section: 'delivery',
        field: 'locationType',
        label: 'Delivery Type',
        type: 'radio',
        options: [
          { name: 'locationType', value: 'direct', label: 'Direct' },
          { name: 'locationType', value: 'courier', label: 'Courier' },
        ],
        gridClass: 'col-span-full',
      },
      {
        section: 'delivery',
        field: 'paymentType',
        label: 'Payment Type',
        type: 'radio',
        required: true,
        options: [
          { name: 'paymentType', value: 'RSB', label: 'RTGS' },
          ...(formData?.from?.poPreFix !== 'TCT'
            ? [
                { name: 'paymentType', value: 'IV', label: 'Issue Voucher' },
                { name: 'paymentType', value: 'MSB', label: 'MSB' },
              ]
            : []),
          ...(formData?.from?.poPreFix === 'TCT' && orderType !== 'unfix'
            ? [{ name: 'paymentType', value: 'IV', label: 'Issue Voucher' }]
            : []),
        ],
        gridClass: 'col-span-full',
      },
      {
        section: 'delivery',
        field: 'address',
        label: 'Delivery Address',
        type: 'textarea',
        required: true,
        placeholder: 'Enter full delivery address',
        rows: 4,
        gridClass: 'col-span-full',
      },
    ],
  };
};
