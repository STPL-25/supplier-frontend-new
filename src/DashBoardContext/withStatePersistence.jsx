import React, { useState, useEffect } from 'react';

// Create a state storage object outside the HOC to persist state across remounts
const stateStorage = new Map();

// HOC to add state persistence to any component
 const withStatePersistence = (WrappedComponent, componentId) => {
  return function WithStatePersistence(props) {
    // Initialize state from storage or empty object
    const [persistedState, setPersistedState] = useState(() => {
      return stateStorage.get(componentId) || {};
    });

    // Save state to storage whenever it changes
    useEffect(() => {
      stateStorage.set(componentId, persistedState);
      
      // Cleanup when component unmounts
      return () => {
        // Optional: Remove state when component is fully unmounted
        // Uncomment if you want state to reset when navigating away completely
        // stateStorage.delete(componentId);
      };
    }, [persistedState]);

    // Function to update persisted state
    const updatePersistedState = (newState) => {
      setPersistedState(prevState => ({
        ...prevState,
        ...newState
      }));
    };

    // Function to reset state
    const resetState = () => {
      stateStorage.delete(componentId);
      setPersistedState({});
    };

    return (
      <WrappedComponent
        {...props}
        persistedState={persistedState}
        updatePersistedState={updatePersistedState}
        resetState={resetState}
      />
    );
  };
};
export { withStatePersistence };