import { createContext, useState, useEffect, useContext } from "react";

const MultiTabStateContext = createContext();

export const MultiTabStateProvider = ({ children }) => {
  // Store states for all tabs across all sections
  const [globalTabState, setGlobalTabState] = useState(() => {
    const savedState = localStorage.getItem('globalTabState');
    return savedState ? JSON.parse(savedState) : {
      sections: {},      // Stores section-level states
      activeSections: {}, // Currently active section for each main area
      tabHistory: {},    // Navigation history for each section
      nestedTabs: {},    // States for nested tabs
      scrollPositions: {} // Scroll positions for each tab
    };
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem('globalTabState', JSON.stringify(globalTabState));
  }, [globalTabState]);

  // Update section state
  const updateSectionState = (sectionId, newState) => {
    setGlobalTabState(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionId]: {
          ...prev.sections[sectionId],
          ...newState
        }
      }
    }));
  };

  // Update active section
  const setActiveSection = (areaId, sectionId) => {
    setGlobalTabState(prev => ({
      ...prev,
      activeSections: {
        ...prev.activeSections,
        [areaId]: sectionId
      },
      tabHistory: {
        ...prev.tabHistory,
        [areaId]: [...(prev.tabHistory[areaId] || []), sectionId].slice(-5) // Keep last 5 entries
      }
    }));
  };

  // Update nested tab state
  const updateNestedTabState = (sectionId, tabId, newState) => {
    setGlobalTabState(prev => ({
      ...prev,
      nestedTabs: {
        ...prev.nestedTabs,
        [sectionId]: {
          ...prev.nestedTabs[sectionId],
          [tabId]: {
            ...prev.nestedTabs[sectionId]?.[tabId],
            ...newState
          }
        }
      }
    }));
  };

  // Save scroll position
  const saveScrollPosition = (sectionId, tabId, position) => {
    setGlobalTabState(prev => ({
      ...prev,
      scrollPositions: {
        ...prev.scrollPositions,
        [sectionId]: {
          ...prev.scrollPositions[sectionId],
          [tabId]: position
        }
      }
    }));
  };

  // Get all states for a section
  const getSectionState = (sectionId) => {
    return {
      sectionData: globalTabState.sections[sectionId] || {},
      activeTab: globalTabState.activeSections[sectionId],
      nestedTabs: globalTabState.nestedTabs[sectionId] || {},
      scrollPositions: globalTabState.scrollPositions[sectionId] || {},
      history: globalTabState.tabHistory[sectionId] || []
    };
  };

  // Clear specific section state
  const clearSectionState = (sectionId) => {
    setGlobalTabState(prev => {
      const newState = { ...prev };
      delete newState.sections[sectionId];
      delete newState.activeSections[sectionId];
      delete newState.nestedTabs[sectionId];
      delete newState.scrollPositions[sectionId];
      delete newState.tabHistory[sectionId];
      return newState;
    });
  };

  // Clear all stored states
  const clearAllStates = () => {
    setGlobalTabState({
      sections: {},
      activeSections: {},
      tabHistory: {},
      nestedTabs: {},
      scrollPositions: {}
    });
    localStorage.removeItem('globalTabState');
  };

  return (
    <MultiTabStateContext.Provider value={{
      updateSectionState,
      setActiveSection,
      updateNestedTabState,
      saveScrollPosition,
      getSectionState,
      clearSectionState,
      clearAllStates,
      globalTabState
    }}>
      {children}
    </MultiTabStateContext.Provider>
  );
};

// Custom hook for using the multi-tab state
export const useMultiTabState = (sectionId) => {
  const context = useContext(MultiTabStateContext);
  if (!context) {
    throw new Error('useMultiTabState must be used within a MultiTabStateProvider');
  }

  return {
    ...context,
    sectionState: context.getSectionState(sectionId)
  };
};