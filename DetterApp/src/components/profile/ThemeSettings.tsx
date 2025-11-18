/**
 * ThemeSettings - 主题设置组件
 * 允许用户选择浅色、深色或跟随系统主题
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeMode } from '../../models/types';

const ThemeSettings: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  const themeOptions: { mode: ThemeMode; label: string; description: string }[] = [
    { mode: 'light', label: '浅色模式', description: '始终使用浅色主题' },
    { mode: 'dark', label: '深色模式', description: '始终使用深色主题' },
    { mode: 'system', label: '跟随系统', description: '根据系统设置自动切换' },
  ];

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  return (
    <View style={styles.container}>
      {themeOptions.map((option) => (
        <TouchableOpacity
          key={option.mode}
          style={[
            styles.optionButton,
            {
              backgroundColor: theme.cardBackground,
              borderColor: themeMode === option.mode ? theme.primary : theme.border,
              borderWidth: themeMode === option.mode ? 2 : 1,
            },
          ]}
          onPress={() => handleThemeChange(option.mode)}
        >
          <View style={styles.optionContent}>
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionLabel, { color: theme.text }]}>
                {option.label}
              </Text>
              <Text style={[styles.optionDescription, { color: theme.textSecondary }]}>
                {option.description}
              </Text>
            </View>
            {themeMode === option.mode && (
              <View style={[styles.checkmark, { backgroundColor: theme.primary }]}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ThemeSettings;
