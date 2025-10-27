import { useEffect } from "react";
const withProtection = (Component) => {
    return () => {
      useEffect(() => {
        // Disable right-click
        // const disableRightClick = (event) => event.preventDefault();
        // document.addEventListener('contextmenu', disableRightClick);
  
        // Disable shortcuts
        const disableShortcuts = (event) => {
            console.log(event)
          if (
            event.key === "F12" || 
            (event.ctrlKey && event.shiftKey && event.key === "I") ||
            (event.ctrlKey && event.shiftKey && event.key === "J") ||
            (event.ctrlKey && event.shiftKey && event.key === "C") ||
            (event.ctrlKey && event.key === "U")
          ) {
            event.preventDefault();
          }
        };
        document.addEventListener('keydown', disableShortcuts);
  
        return () => {
        //   document.removeEventListener('contextmenu', disableRightClick);
          document.removeEventListener('keydown', disableShortcuts);
        };
      }, []);
  
      return <Component />;
    };
  };
  
  export default withProtection;


  // withPersistentState.jsx
// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';

// export const withPersistentState = (WrappedComponent, componentId) => {
//   return function WithPersistentStateComponent(props) {
//     const location = useLocation();
    
//     // Initialize state from sessionStorage
//     const loadPersistedState = () => {
//       const persistedData = sessionStorage.getItem(`persistentState_${componentId}`);
//       return persistedData ? JSON.parse(persistedData) : null;
//     };

//     const [componentState, setComponentState] = useState(loadPersistedState());
    
//     // Save state to sessionStorage whenever it changes
//     useEffect(() => {
//       if (componentState) {
//         sessionStorage.setItem(
//           `persistentState_${componentId}`,
//           JSON.stringify(componentState)
//         );
//       }
//     }, [componentState]);

//     // Clear state when navigating away (optional)
//     useEffect(() => {
//       return () => {
//         // Uncomment if you want to clear state when component unmounts
//         // sessionStorage.removeItem(`persistentState_${componentId}`);
//       };
//     }, []);

//     const updateState = (newState) => {
//       setComponentState(prev => ({
//         ...prev,
//         ...newState
//       }));
//     };

//     return (
//       <WrappedComponent
//         {...props}
//         persistentState={componentState}
//         updatePersistentState={updateState}
//       />
//     );
//   };
// };

// // PersistentStateProvider.jsx
// import React, { createContext, useContext, useEffect, useState } from 'react';

// const PersistentStateContext = createContext();

// export const PersistentStateProvider = ({ children }) => {
//   const [globalStates, setGlobalStates] = useState(() => {
//     const saved = sessionStorage.getItem('globalPersistentStates');
//     return saved ? JSON.parse(saved) : {};
//   });

//   useEffect(() => {
//     sessionStorage.setItem('globalPersistentStates', JSON.stringify(globalStates));
//   }, [globalStates]);

//   const updateGlobalState = (componentId, newState) => {
//     setGlobalStates(prev => ({
//       ...prev,
//       [componentId]: { ...prev[componentId], ...newState }
//     }));
//   };

//   const getComponentState = (componentId) => globalStates[componentId] || {};

//   return (
//     <PersistentStateContext.Provider value={{ 
//       updateGlobalState, 
//       getComponentState 
//     }}>
//       {children}
//     </PersistentStateContext.Provider>
//   );
// };

// export const usePersistentState = (componentId) => {
//   const context = useContext(PersistentStateContext);
//   if (!context) {
//     throw new Error('usePersistentState must be used within a PersistentStateProvider');
//   }

//   return {
//     state: context.getComponentState(componentId),
//     updateState: (newState) => context.updateGlobalState(componentId, newState)
//   };
// };

