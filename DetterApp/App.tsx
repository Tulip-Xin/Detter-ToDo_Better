/**
 * Detter App - 待办事项管理应用
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, ActivityIndicator } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { TaskProvider } from './src/contexts/TaskContext';
import { AppNavigator } from './src/navigation';
import StartupService from './src/services/StartupService';
import ErrorBoundary from './src/components/common/ErrorBoundary';

function App(): JSX.Element {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[App] Starting initialization...');
        const startTime = Date.now();
        
        // 使用优化的启动服务
        await StartupService.initialize();
        
        const duration = Date.now() - startTime;
        console.log(`[App] Initialization completed in ${duration}ms`);
        
        setIsReady(true);
        
        // 隐藏启动屏幕
        SplashScreen.hide();
      } catch (err) {
        console.error('[App] Error initializing app:', err);
        setError('应用初始化失败，请重启应用');
        SplashScreen.hide();
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: '#dc663c', fontSize: 16, textAlign: 'center' }}>
          {error}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#dc663c" />
        <Text style={{ marginTop: 16, color: '#666' }}>正在初始化...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <TaskProvider>
              <StatusBar
                barStyle="dark-content"
                backgroundColor="transparent"
                translucent
              />
              <AppNavigator />
            </TaskProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

export default App;
