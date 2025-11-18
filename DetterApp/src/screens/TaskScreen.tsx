/**
 * 任务管理屏幕（行）
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useTaskContext } from '../contexts/TaskContext';
import { COLORS } from '../utils/constants';
import { BottomSheet, BottomSheetRef } from '../components/common/BottomSheet';
import TaskAddPanel from '../components/task/TaskAddPanel';
import { DateSelector } from '../components/common/DateSelector';
import TaskBoard from '../components/task/TaskBoard';
import { ReflectionInputPanel } from '../components/reflection';
import ReflectionService from '../services/ReflectionService';
import { Priority, Task, SwipeAction } from '../models/types';
import { TaskScreenProps } from '../navigation/types';

const TaskScreen: React.FC<TaskScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const {
    state,
    loadTasks,
    addTask,
    completeTask,
    updateTaskOrders,
    deleteTask,
    archiveTask,
    setSelectedDate,
  } = useTaskContext();
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [initialPriority, setInitialPriority] = useState<Priority | undefined>(
    undefined
  );
  const [refreshing, setRefreshing] = useState(false);
  const [showReflectionPanel, setShowReflectionPanel] = useState(false);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const reflectionSheetRef = useRef<BottomSheetRef>(null);

  // 加载任务
  useEffect(() => {
    loadTasks(state.selectedDate);
  }, [state.selectedDate]);

  // 打开添加面板
  const handleOpenAddPanel = (priority?: Priority) => {
    setInitialPriority(priority);
    setShowAddPanel(true);
    setTimeout(() => {
      bottomSheetRef.current?.expand();
    }, 100);
  };

  // 关闭添加面板
  const handleCloseAddPanel = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      setShowAddPanel(false);
      setInitialPriority(undefined);
    }, 300);
  };

  // 保存任务
  const handleSaveTask = async (taskData: any) => {
    try {
      await addTask(taskData);
      handleCloseAddPanel();
      // 重新加载任务
      await loadTasks(state.selectedDate);
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  // 刷新任务
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await loadTasks(state.selectedDate);
    } finally {
      setRefreshing(false);
    }
  };

  // 完成任务
  const handleCompleteTask = async (taskId: string) => {
    try {
      // 找到要完成的任务
      const task = state.tasks.find(t => t.id === taskId);
      if (!task) {
        return;
      }

      // 如果任务已完成，则取消完成
      if (task.completed) {
        await completeTask(taskId);
        await loadTasks(state.selectedDate);
        return;
      }

      // 完成任务
      await completeTask(taskId);
      
      // 延迟300ms后显示复盘输入面板
      setTimeout(() => {
        setCompletedTask(task);
        setShowReflectionPanel(true);
        setTimeout(() => {
          reflectionSheetRef.current?.expand();
        }, 100);
      }, 300);

      // 重新加载任务
      await loadTasks(state.selectedDate);
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  // 点击任务
  const handlePressTask = (taskId: string) => {
    // 导航到任务编辑页面
    navigation.navigate('TaskEdit', { taskId });
  };

  // 滑动操作
  const handleSwipeAction = async (taskId: string, action: SwipeAction) => {
    try {
      switch (action) {
        case 'delete':
          await deleteTask(taskId);
          break;
        case 'archive':
          await archiveTask(taskId);
          break;
        case 'moveUp':
        case 'moveDown':
          // TODO: 实现上移下移逻辑
          console.log('Move task:', taskId, action);
          break;
      }
    } catch (error) {
      console.error('Error handling swipe action:', error);
    }
  };

  // 重新排序任务
  const handleReorderTasks = async (
    priority: Priority,
    reorderedTasks: Task[]
  ) => {
    try {
      const updates = reorderedTasks.map((task, index) => ({
        id: task.id,
        order: index,
      }));
      await updateTaskOrders(updates);
    } catch (error) {
      console.error('Error reordering tasks:', error);
    }
  };

  // 保存复盘笔记
  const handleSaveReflection = async (taskId: string, content: string) => {
    try {
      await ReflectionService.createReflection({
        taskId,
        content,
      });
      handleCloseReflectionPanel();
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  };

  // 跳过复盘
  const handleSkipReflection = () => {
    handleCloseReflectionPanel();
  };

  // 关闭复盘面板
  const handleCloseReflectionPanel = () => {
    reflectionSheetRef.current?.close();
    setTimeout(() => {
      setShowReflectionPanel(false);
      setCompletedTask(null);
    }, 300);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 日期选择器 */}
      <DateSelector
        selectedDate={state.selectedDate}
        onDateSelect={setSelectedDate}
      />

      {/* 任务看板 */}
      {state.loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.PRIMARY} />
        </View>
      ) : (
        <TaskBoard
          tasks={state.tasks}
          onAddTask={handleOpenAddPanel}
          onCompleteTask={handleCompleteTask}
          onPressTask={handlePressTask}
          onSwipeAction={handleSwipeAction}
          onReorderTasks={handleReorderTasks}
          onRefresh={handleRefresh}
          refreshing={refreshing}
        />
      )}

      {/* 悬浮添加按钮 */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => handleOpenAddPanel()}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* 添加任务面板 */}
      {showAddPanel && (
        <BottomSheet ref={bottomSheetRef} onClose={handleCloseAddPanel}>
          <TaskAddPanel
            onSave={handleSaveTask}
            onCancel={handleCloseAddPanel}
            initialPriority={initialPriority}
            initialDate={state.selectedDate}
            existingTasks={state.tasks}
          />
        </BottomSheet>
      )}

      {/* 复盘输入面板 */}
      {showReflectionPanel && completedTask && (
        <BottomSheet
          ref={reflectionSheetRef}
          onClose={handleCloseReflectionPanel}
          snapPointIndex={0}>
          <ReflectionInputPanel
            task={completedTask}
            onSave={handleSaveReflection}
            onSkip={handleSkipReflection}
          />
        </BottomSheet>
      )}

      {/* 错误提示 */}
      {state.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{state.error}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 32,
    color: COLORS.WHITE,
    fontWeight: '300',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: COLORS.ERROR,
    borderRadius: 8,
  },
  errorText: {
    color: COLORS.WHITE,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default TaskScreen;
