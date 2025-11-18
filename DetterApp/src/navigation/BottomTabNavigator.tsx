/**
 * Bottom Tab Navigator配置
 */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TaskScreen, ReflectionScreen, ProfileScreen } from '../screens';
import { BottomTabParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';
import { COLORS, ANIMATION_DURATION } from '../utils/constants';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="Task"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
          borderTopWidth: 1,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        // 确保Tab切换动画在100ms内完成
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Task"
        component={TaskScreen}
        options={{
          tabBarLabel: '行',
          tabBarAccessibilityLabel: '任务管理',
        }}
      />
      <Tab.Screen
        name="Reflection"
        component={ReflectionScreen}
        options={{
          tabBarLabel: '思',
          tabBarAccessibilityLabel: '复盘反思',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: '我',
          tabBarAccessibilityLabel: '个人中心',
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
