
import React, { useState } from 'react';

// Fixed version of useSnackbar hook
const useSnackbar = (options = {}) => {
  const { duration = 5000, defaultPosition = 'top-right' } = options;
  
  const [snackbarState, setSnackbarState] = useState({
    open: false,
    message: '',
    severity: 'success',
    position: defaultPosition,
    currentDuration: duration
  });

  // Close the snackbar
  const closeSnackbar = () => {
    setSnackbarState(prev => ({ ...prev, open: false }));
  };

  // Open the snackbar with custom configuration
  const showSnackbar = ({ 
    message, 
    severity = 'success', 
    position = defaultPosition,
    customDuration
  }) => {
    
    // Immediately force close any existing snackbar first
    setSnackbarState(prev => ({ ...prev, open: false }));
    
    setTimeout(() => {
      setSnackbarState({
        open: true,
        message,
        severity,
        position,
        currentDuration: 3000
      });
    }, 10);
  };

  // Show different types of notifications with simplified API
  const showSuccess = (message, options = {}) => {
    showSnackbar({ message, severity: 'success', ...options });
  };

  const showError = (message, options = {}) => {
    showSnackbar({ message, severity: 'error', ...options });
  };

  const showWarning = (message, options = {}) => {
    showSnackbar({ message, severity: 'warning', ...options });
  };

  const showInfo = (message, options = {}) => {
    showSnackbar({ message, severity: 'info', ...options });
  };

  // Auto-close functionality
  React.useEffect(() => {
    let timer;
    if (snackbarState.open) {
      timer = setTimeout(() => {
        closeSnackbar();
      }, snackbarState.currentDuration);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [snackbarState.open, snackbarState.currentDuration]);

  // Snackbar Component
  const SnackbarComponent = () => {
    if (!snackbarState.open) return null;

    // Position classes with proper positioning
    const positionClasses = {
      top: 'top-4 left-1/2 transform -translate-x-1/2',
      bottom: 'bottom-4 left-1/2 transform -translate-x-1/2',
      'top-left': 'top-4 left-4',
      'top-right': 'top-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-right': 'bottom-4 right-4'
    };

    // Severity-based styling
    const severityClasses = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    const severityIcons = {
      success: (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      warning: (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      info: (
        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };

    return (
      <div 
        className={`fixed ${positionClasses[snackbarState.position]} z-50 transition-all duration-300 ease-in-out`}
        style={{opacity: snackbarState.open ? 1 : 0}}
      >
        <div className={`flex items-center ${severityClasses[snackbarState.severity]} text-white px-6 py-3 rounded-lg shadow-lg max-w-md`}>
          {severityIcons[snackbarState.severity]}
          <span className="flex-1">{snackbarState.message}</span>
          <button
            className="ml-4 text-white focus:outline-none"
            onClick={closeSnackbar}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  return {
    // State
    isOpen: snackbarState.open,
    
    // Methods
    showSnackbar,
    closeSnackbar,
    showSuccess,
    showError, 
    showWarning,
    showInfo,
    
    SnackbarComponent
  };
};


export default useSnackbar;