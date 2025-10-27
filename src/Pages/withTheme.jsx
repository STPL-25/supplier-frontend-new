import React, { useState, useEffect } from 'react';

// Theme context to manage theme state globally
export const ThemeContext = React.createConetxt({
  isDarkMode: false,
  toggleTheme: () => {},
});

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// HOC to inject theme functionality
export const withTheme = (WrappedComponent) => {
  return function WithThemeComponent(props) {
    return (
      <ThemeContext.Consumer>
        {({ isDarkMode, toggleTheme }) => {
          const themeClasses = {
            // Base classes
            layout: `min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-blue-50'}`,
            sidebar: `fixed top-0 left-0 h-full w-64 transition-transform duration-300 ease-in-out transform 
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-100' 
                : 'bg-gradient-to-b from-sky-600 to-blue-700 text-white'}`,
            sidebarItem: `main-button cursor-pointer px-4 rounded-lg transition-all duration-300
              ${isDarkMode 
                ? 'hover:bg-gray-700' 
                : 'hover:bg-sky-500'}`,
            activeItem: `${isDarkMode 
              ? 'bg-gray-600 text-white' 
              : 'bg-blue-200 text-blue-900'} shadow-lg`,
            mainContent: `flex-1 shadow-2xl rounded-lg border-t-4 
              ${isDarkMode 
                ? 'bg-gray-800 text-gray-100 border-gray-600' 
                : 'bg-white border-sky-600'}`,
            header: `${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-md p-4`,
            text: isDarkMode ? 'text-gray-100' : 'text-gray-900',
            userImage: `w-8 h-8 rounded-full ml-10 mb-3 border-2 
              ${isDarkMode ? 'border-gray-600' : 'border-blue-300'}`,
          };

          return (
            <WrappedComponent 
              {...props} 
              themeClasses={themeClasses}
              isDarkMode={isDarkMode}
              toggleTheme={toggleTheme}
            />
          );
        }}
      </ThemeContext.Consumer>
    );
  };
};