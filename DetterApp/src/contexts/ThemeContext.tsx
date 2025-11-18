/**
 * ThemeContext - 主题状态管理
 * 支持浅色、深色和跟随系统主题
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode } from '../models/types';
import { lightTheme, darkTheme } from '../utils/theme';

// Context 接口
interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

// 创建 Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Provider Props
interface ThemeProviderProps {
  children: ReactNode;
}

// AsyncStorage key
const THEME_MODE_KEY = '@detter_theme_mode';

/**
 * 根据主题模式和系统配色方案获取实际主题
 */
const getTheme = (mode: ThemeMode, systemColorScheme: ColorSchemeName): Theme => {
  if (mode === 'system') {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }
  return mode === 'dark' ? darkTheme : lightTheme;
};

/**
 * 判断是否为深色主题
 */
const getIsDark = (mode: ThemeMode, systemColorScheme: ColorSchemeName): boolean => {
  if (mode === 'system') {
    return systemColorScheme === 'dark';
  }
  return mode === 'dark';
};

// Provider 组件
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // 计算当前主题
  const theme = getTheme(themeMode, systemColorScheme);
  const isDark = getIsDark(themeMode, systemColorScheme);

  /**
   * 从 AsyncStorage 加载保存的主题模式
   */
  useEffect(() => {
    const loadThemeMode = async () => {
      try {
        const savedMode = await AsyncStorage.getItem(THEME_MODE_KEY);
        if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
          setThemeModeState(savedMode as ThemeMode);
          console.log('Loaded theme mode:', savedMode);
        }
      } catch (error) {
        console.error('Error loading theme mode:', error);
      }
    };

    loadThemeMode();
  }, []);

  /**
   * 监听系统配色方案变化
   */
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('System color scheme changed:', colorScheme);
      setSystemColorScheme(colorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  /**
   * 设置主题模式并保存到 AsyncStorage
   */
  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_MODE_KEY, mode);
      console.log('Theme mode set to:', mode);
    } catch (error) {
      console.error('Error saving theme mode:', error);
    }
  }, []);

  const value: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

/**
 * 自定义 Hook 用于访问 ThemeContext
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
