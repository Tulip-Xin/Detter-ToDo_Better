/**
 * ThemeContext 测试
 */

import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider, useTheme } from '../ThemeContext';
import { lightTheme, darkTheme } from '../../utils/theme';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock Appearance
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Appearance: {
    getColorScheme: jest.fn(() => 'light'),
    addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
  },
}));

describe('ThemeContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should initialize with light theme by default', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toEqual(lightTheme);
    expect(result.current.themeMode).toBe('light');
    expect(result.current.isDark).toBe(false);
  });

  it('should set theme mode to dark', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      await result.current.setThemeMode('dark');
    });

    expect(result.current.theme).toEqual(darkTheme);
    expect(result.current.themeMode).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@detter_theme_mode',
      'dark'
    );
  });

  it('should set theme mode to system', async () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    await act(async () => {
      await result.current.setThemeMode('system');
    });

    expect(result.current.themeMode).toBe('system');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@detter_theme_mode',
      'system'
    );
  });

  it('should load saved theme mode from AsyncStorage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { result, waitForNextUpdate } = renderHook(() => useTheme(), {
      wrapper,
    });

    await waitForNextUpdate();

    expect(result.current.themeMode).toBe('dark');
    expect(result.current.theme).toEqual(darkTheme);
  });

  it('should follow system theme when mode is system', () => {
    (Appearance.getColorScheme as jest.Mock).mockReturnValue('dark');

    const { result } = renderHook(() => useTheme(), { wrapper });

    act(() => {
      result.current.setThemeMode('system');
    });

    // When system is dark and mode is system, should use dark theme
    expect(result.current.isDark).toBe(true);
  });

  it('should throw error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });
});
