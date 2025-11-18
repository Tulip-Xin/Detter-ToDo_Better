/**
 * TaskBoard - 任务看板组件
 * 组合三个优先级容器，展示所有任务
 * 支持下拉刷新和任务排序
 */

import React, { useMemo } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Task, Priority, SwipeAction } from '../../models/types';
import { COLORS, SIZES } from '../../utils/constants';
import PriorityContainer from './PriorityContainer';
import DraggableTaskList from './DraggableTaskList';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (priority: Priority) => void;
  onCompleteTask: (taskId: string) => void;
  onPressTask: (taskId: string) => void;
  onSwipeAction: (taskId: string, action: SwipeAction) => void;
  onReorderTasks: (priority: Priority, reorderedTasks: Task[]) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

const TaskBoard: React.FC<TaskBoardProps> = ({
  tasks,
  onAddTask,
  onCompleteTask,
  onPressTask,
  onSwipeAction,
  onReorderTasks,
  onRefresh,
  refreshing,
}) => {
  // 按优先级分组任务
  const tasksByPriority = useMemo(() => {
    const grouped = {
      important: [] as Task[],
      urgent: [] as Task[],
      trivial: [] as Task[],
    };

    tasks.forEach((task) => {
      if (!task.archived && !task.completed) {
        grouped[task.priority].push(task);
      }
    });

    // 按 order 字段排序
    Object.keys(grouped).forEach((priority) => {
      grouped[priority as Priority].sort((a, b) => a.order - b.order);
    });

    return grouped;
  }, [tasks]);

  const handleReorder = (priority: Priority) => (reorderedTasks: Task[]) => {
    onReorderTasks(priority, reorderedTasks);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.TEXT_SECONDARY}
          />
        }
      >
        {/* 重要任务容器 */}
        <PriorityContainer
          priority="important"
          tasks={tasksByPriority.important}
          onAddTask={onAddTask}
        >
          <DraggableTaskList
            tasks={tasksByPriority.important}
            onComplete={onCompleteTask}
            onPress={onPressTask}
            onSwipeAction={onSwipeAction}
            onReorder={handleReorder('important')}
          />
        </PriorityContainer>

        {/* 紧急任务容器 */}
        <PriorityContainer
          priority="urgent"
          tasks={tasksByPriority.urgent}
          onAddTask={onAddTask}
        >
          <DraggableTaskList
            tasks={tasksByPriority.urgent}
            onComplete={onCompleteTask}
            onPress={onPressTask}
            onSwipeAction={onSwipeAction}
            onReorder={handleReorder('urgent')}
          />
        </PriorityContainer>

        {/* 琐事任务容器 */}
        <PriorityContainer
          priority="trivial"
          tasks={tasksByPriority.trivial}
          onAddTask={onAddTask}
        >
          <DraggableTaskList
            tasks={tasksByPriority.trivial}
            onComplete={onCompleteTask}
            onPress={onPressTask}
            onSwipeAction={onSwipeAction}
            onReorder={handleReorder('trivial')}
          />
        </PriorityContainer>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: SIZES.PADDING,
  },
});

export default TaskBoard;
