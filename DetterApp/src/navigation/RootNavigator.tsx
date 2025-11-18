/**
 * Root Stack Navigator配置
 * 包含Bottom Tab Navigator和详情页面
 */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './BottomTabNavigator';
import { RootStackParamList } from './types';
import { useTheme } from '../contexts/ThemeContext';
import { ReflectionDetailScreen, TaskEditScreen } from '../screens';

const Stack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.background },
        // 快速过渡动画
        animationEnabled: true,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          headerShown: false,
        }}
      />
      {/* 复盘详情页面 */}
      <Stack.Screen
        name="ReflectionDetail"
        component={ReflectionDetailScreen}
        options={{
          headerShown: true,
          title: '复盘详情',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
      {/* 任务编辑页面 */}
      <Stack.Screen
        name="TaskEdit"
        component={TaskEditScreen}
        options={{
          headerShown: true,
          title: '编辑任务',
          headerStyle: {
            backgroundColor: theme.card,
          },
          headerTintColor: theme.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
