import React, { useState, useEffect, useRef } from 'react';
import { createWorker } from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Set PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

function OcrReader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [progress, setProgress] = useState(0);
  const workerRef = useRef(null);

  // Form state
  const [formData, setFormData] = useState({
    gstNumber: '',
    legalName: '',
    tradeName: '',
    constitution: '',
    address: '',
    state: '',
    pincode: '',
    dateOfIssue: '',
    panNumber: ''
  });

  // Initialize Tesseract worker
  useEffect(() => {
    const initWorker = async () => {
      workerRef.current = await createWorker('eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setProgress(Math.round(m.progress * 100));
          }
        }
      });
    };
    initWorker();
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setExtractedText('');
      setProgress(0);
      
      if (file.type.startsWith('image/')) {
        setFileType('image');
      } else if (file.type === 'application/pdf') {
        setFileType('pdf');
      }
    }
  };

  // Parse GST certificate data from extracted text
  const parseGSTData = (text) => {
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    // GST Number Pattern: 15 characters (2 digits state code + 10 PAN + 3 chars)
    const gstRegex = /\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}Z[A-Z\d]{1}\b/g;
    const gstMatch = cleanText.match(gstRegex);
    
    // PAN Number Pattern: Extract from GST or standalone
    let panNumber = '';
    if (gstMatch && gstMatch[0]) {
      panNumber = gstMatch[0].substring(2, 12); // Extract PAN from GST
    }
    
    // Legal Name - typically after "Legal Name" or "Name of Business"
    const legalNameRegex = /(?:Legal Name|Name of Business|Registered Name)[:\s]+([A-Z\s\.]+?)(?:\n|Trade Name|Constitution)/i;
    const legalNameMatch = cleanText.match(legalNameRegex);
    
    // Trade Name
    const tradeNameRegex = /Trade Name[:\s]+([A-Z\s&\.]+?)(?:\n|Constitution|Address)/i;
    const tradeNameMatch = cleanText.match(tradeNameRegex);
    
    // Constitution
    const constitutionRegex = /Constitution[:\s]+([A-Za-z\s]+?)(?:\n|Address|Principal)/i;
    const constitutionMatch = cleanText.match(constitutionRegex);
    
    // Address
    const addressRegex = /(?:Address|Principal Place)[:\s]+(.+?)(?:\d{6}|\n\n)/is;
    const addressMatch = cleanText.match(addressRegex);
    
    // Pincode - 6 digits
    const pincodeRegex = /\b\d{6}\b/g;
    const pincodeMatch = cleanText.match(pincodeRegex);
    
    // Date - various formats
    const dateRegex = /(?:Date of [Ii]ssue|Effective Date)[:\s]+(\d{2}[\/\-]\d{2}[\/\-]\d{4})/;
    const dateMatch = cleanText.match(dateRegex);
    
    // State Code to State Name mapping
    const stateCodeMap = {
      '01': 'Jammu and Kashmir', '02': 'Himachal Pradesh', '03': 'Punjab',
      '04': 'Chandigarh', '05': 'Uttarakhand', '06': 'Haryana',
      '07': 'Delhi', '08': 'Rajasthan', '09': 'Uttar Pradesh',
      '10': 'Bihar', '11': 'Sikkim', '12': 'Arunachal Pradesh',
      '13': 'Nagaland', '14': 'Manipur', '15': 'Mizoram',
      '16': 'Tripura', '17': 'Meghalaya', '18': 'Assam',
      '19': 'West Bengal', '20': 'Jharkhand', '21': 'Odisha',
      '22': 'Chhattisgarh', '23': 'Madhya Pradesh', '24': 'Gujarat',
      '27': 'Maharashtra', '29': 'Karnataka', '32': 'Kerala',
      '33': 'Tamil Nadu', '34': 'Puducherry', '35': 'Andaman and Nicobar',
      '36': 'Telangana', '37': 'Andhra Pradesh'
    };
    
    let state = '';
    if (gstMatch && gstMatch[0]) {
      const stateCode = gstMatch[0].substring(0, 2);
      state = stateCodeMap[stateCode] || '';
    }

    return {
      gstNumber: gstMatch ? gstMatch[0] : '',
      legalName: legalNameMatch ? legalNameMatch[1].trim() : '',
      tradeName: tradeNameMatch ? tradeNameMatch[1].trim() : '',
      constitution: constitutionMatch ? constitutionMatch[1].trim() : '',
      address: addressMatch ? addressMatch[1].trim().replace(/\s+/g, ' ') : '',
      state: state,
      pincode: pincodeMatch ? pincodeMatch[pincodeMatch.length - 1] : '',
      dateOfIssue: dateMatch ? dateMatch[1] : '',
      panNumber: panNumber
    };
  };

  const extractTextFromImage = async () => {
    if (!workerRef.current) return;
    
    setIsProcessing(true);
    try {
      const imageUrl = URL.createObjectURL(selectedFile);
      const { data: { text } } = await workerRef.current.recognize(imageUrl);
      
      setExtractedText(text);
      const parsedData = parseGSTData(text);
      setFormData(parsedData);
      
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      // console.error('OCR Error:', error);
      alert('Failed to extract text from image');
    } finally {
      setIsProcessing(false);
    }
  };

  const extractTextFromPDF = async () => {
    setIsProcessing(true);
    
    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async function() {
        try {
          const typedArray = new Uint8Array(this.result);
          const pdf = await pdfjsLib.getDocument(typedArray).promise;
          
          let fullText = '';
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map(item => item.str)
              .join(' ');
            fullText += pageText + '\n';
          }
          
          setExtractedText(fullText);
          const parsedData = parseGSTData(fullText);
          setFormData(parsedData);
          
          setIsProcessing(false);
        } catch (error) {
          // console.error('PDF Processing Error:', error);
          alert('Failed to extract text from PDF');
          setIsProcessing(false);
        }
      };
      
      fileReader.readAsArrayBuffer(selectedFile);
    } catch (error) {
      // console.error('PDF Error:', error);
      alert('Failed to extract text from PDF');
      setIsProcessing(false);
    }
  };

  const handleExtract = () => {
    if (!selectedFile) return;
    
    if (fileType === 'image') {
      extractTextFromImage();
    } else if (fileType === 'pdf') {
      extractTextFromPDF();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log('Form Data:', formData);
    alert('Form submitted! Check console for data.');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>GST Certificate Data Extractor</h2>
      
      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Upload GST Certificate</h3>
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          onChange={handleFileUpload}
          style={{ padding: '10px', marginBottom: '10px' }}
        />
        
        {selectedFile && (
          <div style={{ marginTop: '15px' }}>
            <p><strong>File:</strong> {selectedFile.name}</p>
            <p><strong>Type:</strong> {fileType.toUpperCase()}</p>
            
            {fileType === 'image' && (
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px',
                  marginTop: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }} 
              />
            )}
            
            <button 
              onClick={handleExtract} 
              disabled={isProcessing}
              style={{ 
                padding: '12px 24px', 
                fontSize: '16px',
                backgroundColor: isProcessing ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                marginTop: '15px'
              }}
            >
              {isProcessing 
                ? fileType === 'image' 
                  ? `Extracting... ${progress}%` 
                  : 'Extracting from PDF...'
                : '🔍 Extract & Auto-Fill'
              }
            </button>
          </div>
        )}
      </div>

      {/* GST Registration Form */}
      <form onSubmit={handleSubmit} style={{ 
        padding: '20px', 
        backgroundColor: '#ffffff', 
        border: '1px solid #ddd',
        borderRadius: '8px' 
      }}>
        <h3>GST Registration Details</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              GST Number (GSTIN) *
            </label>
            <input
              type="text"
              name="gstNumber"
              value={formData.gstNumber}
              onChange={handleInputChange}
              placeholder="27AABCU9603R1ZM"
              maxLength="15"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              PAN Number
            </label>
            <input
              type="text"
              name="panNumber"
              value={formData.panNumber}
              onChange={handleInputChange}
              placeholder="AABCU9603R"
              maxLength="10"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Legal Name of Business *
            </label>
            <input
              type="text"
              name="legalName"
              value={formData.legalName}
              onChange={handleInputChange}
              placeholder="ABC PRIVATE LIMITED"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Trade Name
            </label>
            <input
              type="text"
              name="tradeName"
              value={formData.tradeName}
              onChange={handleInputChange}
              placeholder="ABC Company"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Constitution of Business
            </label>
            <input
              type="text"
              name="constitution"
              value={formData.constitution}
              onChange={handleInputChange}
              placeholder="Private Limited Company"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Maharashtra"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Principal Place of Business Address"
              rows="3"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontFamily: 'inherit'
              }}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              placeholder="400001"
              maxLength="6"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Date of Issue
            </label>
            <input
              type="text"
              name="dateOfIssue"
              value={formData.dateOfIssue}
              onChange={handleInputChange}
              placeholder="DD/MM/YYYY"
              style={{ 
                width: '100%', 
                padding: '10px', 
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        <button 
          type="submit"
          style={{ 
            marginTop: '20px',
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Submit Form
        </button>
      </form>

      {/* Debug Section */}
      {extractedText && (
        <details style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            View Extracted Text (Debug)
          </summary>
          <pre style={{ 
            marginTop: '10px', 
            padding: '15px', 
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px'
          }}>
            {extractedText}
          </pre>
        </details>
      )}
    </div>
  );
}

export default OcrReader;
