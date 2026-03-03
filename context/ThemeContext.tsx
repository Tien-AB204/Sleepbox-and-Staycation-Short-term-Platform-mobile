// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa bộ màu
export const Colors = {
  light: {
    background: '#FFFFFF',
    card: '#F8F8F8',
    text: '#1A1A1A',
    subText: '#999999',
    primary: '#8D613A',
    border: '#E5E5E5',
    tint: '#8D613A',
  },
  dark: {
    background: '#121212', // Màu đen dịu
    card: '#1E1E1E',       // Màu xám đậm cho thẻ
    text: '#FFFFFF',
    subText: '#AAAAAA',
    primary: '#A67C52',    // Màu nâu sáng hơn chút để nổi trên nền đen
    border: '#333333',
    tint: '#FFFFFF',
  },
};

const ThemeContext = createContext({
  isDarkMode: false,
  colors: Colors.light,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const savedTheme = await AsyncStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  };

  const toggleTheme = async () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const theme = {
    isDarkMode,
    colors: isDarkMode ? Colors.dark : Colors.light,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);