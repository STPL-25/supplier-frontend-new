// SecureApiHOC.js
import React, { useState, useEffect } from 'react';
import CryptoJS from 'crypto-js'; // Make sure to install this: npm install crypto-js

// Set up a singleton encryption key for the application session
const SESSION_ENCRYPTION_KEY = (() => {
  // Generate a random key for this session or use from sessionStorage if exists
  if (!sessionStorage.getItem('app_encryption_key')) {
    const randomKey = Math.random().toString(36).substring(2, 15) + 
                     Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('app_encryption_key', randomKey);
  }
  return sessionStorage.getItem('app_encryption_key');
})();

// Utility functions for encryption/decryption
export const secureUtils = {
  // Encrypt data
  encrypt: (data) => {
    try {
      if (!data) return null;
      const jsonStr = typeof data === 'object' ? JSON.stringify(data) : String(data);
      return CryptoJS.AES.encrypt(jsonStr, SESSION_ENCRYPTION_KEY).toString();
    } catch (err) {
      console.error('Encryption error:', err);
      return null;
    }
  },
  
  // Decrypt data
  decrypt: (encryptedData, returnObject = true) => {
    try {
      if (!encryptedData) return null;
      const bytes = CryptoJS.AES.decrypt(encryptedData, SESSION_ENCRYPTION_KEY);
      const decryptedStr = bytes.toString(CryptoJS.enc.Utf8);
      
      if (returnObject) {
        try {
          return JSON.parse(decryptedStr);
        } catch {
          return decryptedStr;
        }
      }
      return decryptedStr;
    } catch (err) {
      console.error('Decryption error:', err);
      return null;
    }
  },
  
  // Process data securely with a callback function
  processSecurely: (encryptedData, processFn) => {
    try {
      if (!encryptedData || typeof processFn !== 'function') return null;
      
      // Decrypt temporarily
      const decrypted = secureUtils.decrypt(encryptedData);
      
      // Process data without exposing it
      const result = processFn(decrypted);
      
      // Return processed result
      return result;
    } catch (err) {
      console.error('Secure processing error:', err);
      return null;
    }
  },
  
  // Mask sensitive data (for display purposes)
  maskSensitiveData: (data, sensitiveFields = ['email', 'phone', 'password', 'ssn', 'address', 'creditCard']) => {
    if (!data) return null;
    
    if (Array.isArray(data)) {
      return data.map(item => secureUtils.maskSensitiveData(item, sensitiveFields));
    }
    
    if (typeof data === 'object' && data !== null) {
      const masked = {};
      for (const [key, value] of Object.entries(data)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
          if (typeof value === 'string') {
            // Mask all except first and last characters if long enough
            if (value.length > 5) {
              masked[key] = value.charAt(0) + '*'.repeat(value.length - 2) + value.charAt(value.length - 1);
            } else {
              masked[key] = '*'.repeat(value.length);
            }
          } else if (typeof value === 'object' && value !== null) {
            masked[key] = secureUtils.maskSensitiveData(value, sensitiveFields);
          } else {
            masked[key] = value;
          }
        } else if (typeof value === 'object' && value !== null) {
          masked[key] = secureUtils.maskSensitiveData(value, sensitiveFields);
        } else {
          masked[key] = value;
        }
      }
      return masked;
    }
    
    return data;
  }
};

// Higher-Order Component for secure API fetching
export const withSecureApi = (WrappedComponent) => {
  return function WithSecureApiComponent(props) {
    const [isEncryptionReady, setIsEncryptionReady] = useState(!!CryptoJS);
    
    // This would normally check if CryptoJS is loaded if you're using it via CDN
    // For npm package this is immediate
    useEffect(() => {
      if (!isEncryptionReady && typeof CryptoJS !== 'undefined') {
        setIsEncryptionReady(true);
      }
    }, [isEncryptionReady]);
    
    // Enhanced fetch function that automatically encrypts responses
    const secureFetch = async (url, options = {}) => {
      try {
        const response = await fetch(url, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Check content type to handle different response types
        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          // Handle text, blob, etc. as needed
          data = await response.text();
        }
        
        // Immediately encrypt the response data
        const encryptedData = secureUtils.encrypt(data);
        
        // Create a masked version for display
        const maskedData = secureUtils.maskSensitiveData(data);
        
        return {
          isEncrypted: true,
          encrypted: encryptedData,
          masked: maskedData,
          status: response.status,
          headers: Object.fromEntries(response.headers.entries()),
          
          // Methods to work with the data
          process: (callback) => secureUtils.processSecurely(encryptedData, callback),
          decrypt: () => secureUtils.decrypt(encryptedData)
        };
      } catch (error) {
        console.error('Secure fetch error:', error);
        throw error;
      }
    };
    
    // Create a secure API object to pass to the wrapped component
    const secureApi = {
      fetch: secureFetch,
      isReady: isEncryptionReady,
      utils: secureUtils
    };
    
    // Pass the secure API object as a prop to the wrapped component
    return <WrappedComponent {...props} secureApi={secureApi} />;
  };
};

export default withSecureApi;