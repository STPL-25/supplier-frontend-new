import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

function MasterExcelUpload() {
  const [data, setData] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setData(jsonData);

      // Send data to backend
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.post(`${DIA_API}/upload-excel`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // console.log('Upload successful:', response.data);
        // Handle success
      } catch (error) {
        // console.error('Upload failed:', error);
        // Handle error
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {data.length > 0 && (
        <div>
          <h3>Uploaded Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default MasterExcelUpload;
