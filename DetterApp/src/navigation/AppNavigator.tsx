/**
 * 应用主导航组件
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './RootNavigator';
import { useTheme } from '../contexts/ThemeContext';

const AppNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: theme.primary,
          background: theme.background,
          card: theme.card,
          text: theme.text,
          border: theme.border,
          notification: theme.error,
        },
      }}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
