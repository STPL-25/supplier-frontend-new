// import React, { useState } from 'react';
// import { FileSpreadsheet, Download } from 'lucide-react';
// import { generateWorkbook } from '../utils/excelBuilder';
// import { COLUMN_HEADER_MAP, PT_COLUMNS, GOLD_COLUMNS } from '../constants/diamondConstants';
// /**
//  * Props:
//  *   supplierName  – string (pre-filled in Excel B2)
//  *   supplierCode  – string (pre-filled in Excel B3)
//  *   onSuccess     – (message: string) => void
//  */
// const TemplateDownload = ({ supplierName = '', supplierCode = '', onSuccess ,poNumber,poDetails}) => {
//   const [open, setOpen] = useState(false);

//   const download = (columns, filename, title) => {
//     generateWorkbook(columns, supplierName, supplierCode, title, filename, poNumber, poDetails);
//     setOpen(false);
//     onSuccess?.('Template downloaded successfully!');
//   };
// console.log(poDetails)
//   const TEMPLATES = [
//     {
//       label: 'Diamond Gold with Platinum',
//       icon: 'text-blue-600',
//       onClick: () => download(
//         Object.keys(COLUMN_HEADER_MAP),
//         'Diamond_Purchase_Standard_Template.xlsx',
//         'DIAMOND PURCHASE ENTRY — STANDARD TEMPLATE (Gold + Platinum)'
//       ),
//     },
//     {
//       label: 'Diamond and Platinum Only',
//       icon: 'text-purple-600',
//       onClick: () => download(
//         PT_COLUMNS,
//         'Diamond_Purchase_Platinum_Template.xlsx',
//         'DIAMOND PURCHASE ENTRY — PLATINUM TEMPLATE'
//       ),
//     },
//     {
//       label: 'Diamond with Gold Only ',
//       icon: 'text-yellow-600',
//       onClick: () => download(
//         GOLD_COLUMNS,
//         'Diamond_Purchase_Gold_Template.xlsx',
//         'DIAMOND PURCHASE ENTRY — GOLD TEMPLATE'
//       ),
//     },
//   ];

//   return (
//     <>
//       {/* Backdrop */}
//       {open && (
//         <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
//       )}

//       <div className="relative">
//         <button
//           onClick={() => setOpen(prev => !prev)}
//           className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 text-sm font-medium"
//         >
//           <Download className="w-4 h-4" />
//           Download Template
//         </button>

//         {open && (
//           <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50">
//             <div className="px-4 py-2 border-b">
//               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Choose Template Type
//               </p>
//             </div>
//             <div className="py-1">
//               {TEMPLATES.map(t => (
//                 <button
//                   key={t.label}
//                   onClick={t.onClick}
//                   className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
//                 >
//                   <FileSpreadsheet className={`w-5 h-5 shrink-0 ${t.icon}`} />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">{t.label}</div>
//                     <div className="text-xs text-gray-500">{t.desc}</div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//             <div className="px-4 py-2 border-t bg-gray-50 rounded-b-lg">
//               <p className="text-xs text-gray-400">
//                 <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#1E3A5F' }}></span>Normal&nbsp;&nbsp;
//                 <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#6A1B9A' }}></span>Dropdown&nbsp;&nbsp;
//                 <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#2E7D32' }}></span>Auto-calc
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default TemplateDownload;
// import React, { useState } from 'react';
// import { FileSpreadsheet, Download } from 'lucide-react';
// import { generateWorkbook } from '../utils/excelBuilder';
// import { COLUMN_HEADER_MAP, PT_COLUMNS, GOLD_COLUMNS } from '../constants/diamondConstants';

// /**
//  * Props:
//  *   supplierName  – string (pre-filled in Excel B2)
//  *   supplierCode  – string (pre-filled in Excel B3)
//  *   poNumber      – string
//  *   poDetails     – object with productAvlTypes: {Gold, Diamond, Platinum}
//  *   onSuccess     – (message: string) => void
//  */
// const TemplateDownload = ({ 
//   supplierName = '', 
//   supplierCode = '', 
//   onSuccess, 
//   poNumber, 
//   poDetails 
// }) => {
//   const [open, setOpen] = useState(false);

//   const download = (columns, filename, title) => {
//     generateWorkbook(columns, supplierName, supplierCode, title, filename, poNumber, poDetails);
//     console.log('Workbook generated with columns:', columns);
//     setOpen(false);
//     onSuccess?.('Template downloaded successfully!');
//   };

//   // Determine available templates based on productAvlTypes
//   const getAvailableTemplates = () => {
//     if (!poDetails?.productAvlTypes) {
//       // Default: show all templates if productAvlTypes not available
//       return [
//         {
//           label: 'Diamond Gold with Platinum',
//           icon: 'text-blue-600',
//           onClick: () => download(
//             Object.keys(COLUMN_HEADER_MAP),
//             'Diamond_Purchase_Standard_Template.xlsx',
//             'DIAMOND PURCHASE ENTRY — STANDARD TEMPLATE (Gold + Platinum)'
//           ),
//         },
//         {
//           label: 'Diamond and Platinum Only',
//           icon: 'text-purple-600',
//           onClick: () => download(
//             PT_COLUMNS,
//             'Diamond_Purchase_Platinum_Template.xlsx',
//             'DIAMOND PURCHASE ENTRY — PLATINUM TEMPLATE'
//           ),
//         },
//         {
//           label: 'Diamond with Gold Only',
//           icon: 'text-yellow-600',
//           onClick: () => download(
//             GOLD_COLUMNS,
//             'Diamond_Purchase_Gold_Template.xlsx',
//             'DIAMOND PURCHASE ENTRY — GOLD TEMPLATE'
//           ),
//         },
//       ];
//     }

//     const { Gold, Diamond, Platinum } = poDetails.productAvlTypes;
//     const templates = [];

//     // Template 1: Gold + Platinum (both must be true)
//     if (Gold && Platinum && Diamond) {
//       templates.push({
//         label: 'Diamond Gold with Platinum',
//         desc: 'Full template with all metals',
//         icon: 'text-blue-600',
//         onClick: () => download(
//           Object.keys(COLUMN_HEADER_MAP),
//           'Diamond_Purchase_Standard_Template.xlsx',
//           'DIAMOND PURCHASE ENTRY — STANDARD TEMPLATE (Gold + Platinum)'
//         ),
//       });
//     }

//     // Template 2: Platinum Only (Platinum true, Gold false)
//     if (Platinum && !Gold && Diamond) {
//       templates.push({
//         label: 'Diamond and Platinum Only',
//         desc: 'Platinum metals template',
//         icon: 'text-purple-600',
//         onClick: () => download(
//           PT_COLUMNS,
//           'Diamond_Purchase_Platinum_Template.xlsx',
//           'DIAMOND PURCHASE ENTRY — PLATINUM TEMPLATE'
//         ),
//       });
//     }

//     // Template 3: Gold Only (Gold true, Platinum false)
//     if (Gold && !Platinum && Diamond) {
//       templates.push({
//         label: 'Diamond with Gold Only',
//         desc: 'Gold metals template',
//         icon: 'text-yellow-600',
//         onClick: () => download(
//           GOLD_COLUMNS,
//           'Diamond_Purchase_Gold_Template.xlsx',
//           'DIAMOND PURCHASE ENTRY — GOLD TEMPLATE'
//         ),
//       });
//     }

//     return templates;
//   };

//   const TEMPLATES = getAvailableTemplates();



//   // Don't render button if no templates available
//   if (TEMPLATES.length === 0) {
//     return (
//       <div className="px-3 py-2 bg-gray-300 text-gray-600 rounded flex items-center gap-2 text-sm font-medium cursor-not-allowed">
//         <Download className="w-4 h-4" />
//         No Templates Available
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Backdrop */}
//       {open && (
//         <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
//       )}
//       <div className="relative">
//         <button
//           onClick={() => TEMPLATES[0].onClick()} // Directly trigger first available template
//           className="px-3 py-2 bg-green-600 text-white rounded flex items-center gap-2 hover:bg-green-700 text-sm font-medium"
//         >
//           <Download className="w-4 h-4" />
//           Download Template
//         </button>

//         {/* {open && (
//           <div className="absolute right-0 mt-2 w-60 bg-white rounded-lg shadow-xl border z-50">
//             <div className="px-4 py-2 border-b">
//               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
//                 Choose Template Type
//               </p>
//             </div>
//             <div className="py-1">
//               {TEMPLATES.map((t, idx) => (
//                 <button
//                   key={idx}
//                   onClick={t.onClick}
//                   className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors"
//                 >
//                   <FileSpreadsheet className={`w-5 h-5 shrink-0 ${t.icon}`} />
//                   <div>
//                     <div className="text-sm font-medium text-gray-900">{t.label}</div>
//                     {t.desc && (
//                       <div className="text-xs text-gray-500">{t.desc}</div>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//             <div className="px-4 py-2 border-t bg-gray-50 rounded-b-lg">
//               <p className="text-xs text-gray-400">
//                 <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#1E3A5F' }}></span>Normal&nbsp;&nbsp;
//                 <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#6A1B9A' }}></span>Dropdown&nbsp;&nbsp;
//                 <span className="inline-block w-2 h-2 rounded mr-1" style={{ background: '#2E7D32' }}></span>Auto-calc
//               </p>
//             </div>
//           </div>
//         )} */}
//       </div>
//     </>
//   );
// };

// export default TemplateDownload;



import React, { useState } from 'react';
import { FileSpreadsheet, Download, Loader2 } from 'lucide-react';


/**
 * Props:
 *   supplierName  – string (not used for URL-based download, but kept for compatibility)
 *   supplierCode  – string (not used for URL-based download, but kept for compatibility)
 *   poNumber      – string (not used for URL-based download, but kept for compatibility)
 *   poDetails     – object with productAvlTypes: {Gold, Diamond, Platinum}
 *   onSuccess     – (message: string) => void
 */
const TemplateDownload = ({ 
  supplierName = '', 
  supplierCode = '', 
  onSuccess, 
  poNumber, 
  poDetails 
}) => {
  const [downloading, setDownloading] = useState(false);

  // Template URL mapping based on metal types
  const TEMPLATE_URLS = {
    'gold_diamond': 'https://advback.spacetextiles.net/dwl/KTM_Images/dia_pur_entry_files/gold_diamond.xlsx',
    'gold_platinum_diamond': 'https://advback.spacetextiles.net/dwl/KTM_Images/dia_pur_entry_files/gold_platinum_diamond.xlsx',
    'platinum_diamond': 'https://advback.spacetextiles.net/dwl/KTM_Images/dia_pur_entry_files/platinum_diamond.xlsx',
  };

  const downloadFile = async (url, filename) => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      
      onSuccess?.('Template downloaded successfully!');
    } catch (error) {
      // console.error('Download error:', error);
      onSuccess?.('Failed to download template. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Determine which template to download based on productAvlTypes
  const getTemplateConfig = () => {
    if (!poDetails?.productAvlTypes) {
      // Default: gold_platinum_diamond template if productAvlTypes not available
      return {
        url: TEMPLATE_URLS.gold_platinum_diamond,
        filename: 'Diamond_Purchase_Standard_Template.xlsx',
        label: 'Diamond Gold with Platinum',
        available: true,
      };
    }

    const { Gold, Diamond, Platinum } = poDetails.productAvlTypes;

    // Template 1: Gold + Platinum + Diamond
    if (Gold && Platinum && Diamond || Gold && Platinum && !Diamond) {
      return {
        url: TEMPLATE_URLS.gold_platinum_diamond,
        filename: 'Diamond_Purchase_Gold_Platinum_Template.xlsx',
        label: 'Diamond Gold with Platinum',
        desc: 'Full template with all metals',
        icon: 'text-blue-600',
        available: true,
      };
    }

    // Template 2: Platinum + Diamond Only
    if (Platinum && !Gold && Diamond) {
      return {
        url: TEMPLATE_URLS.platinum_diamond,
        filename: 'Diamond_Purchase_Platinum_Template.xlsx',
        label: 'Diamond and Platinum Only',
        desc: 'Platinum metals template',
        icon: 'text-purple-600',
        available: true,
      };
    }

    // Template 3: Gold + Diamond Only
    if (Gold && !Platinum && Diamond) {
      return {
        url: TEMPLATE_URLS.gold_diamond,
        filename: 'Diamond_Purchase_Gold_Template.xlsx',
        label: 'Diamond with Gold Only',
        desc: 'Gold metals template',
        icon: 'text-yellow-600',
        available: true,
      };
    }

    // No matching template
    return {
      available: false,
      label: 'No Template Available',
    };
  };

  const templateConfig = getTemplateConfig();

  // Don't render button if no template available
  if (!templateConfig.available) {
    return (
      <div className="px-3 py-2 bg-gray-300 text-gray-600 rounded flex items-center gap-2 text-sm font-medium cursor-not-allowed">
        <Download className="w-4 h-4" />
        No Templates Available
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => downloadFile(templateConfig.url, templateConfig.filename)}
        disabled={downloading}
        className={`px-3 py-2 rounded flex items-center gap-2 text-sm font-medium transition-colors ${
          downloading
            ? 'bg-green-400 text-white cursor-not-allowed'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download Template
          </>
        )}
      </button>

      {/* Optional: Show which template will be downloaded */}
      {templateConfig.desc && (
        <div className="absolute top-full mt-1 left-0 text-xs text-gray-500 whitespace-nowrap">
          {templateConfig.desc}
        </div>
      )}
    </div>
  );
};

export default TemplateDownload;
