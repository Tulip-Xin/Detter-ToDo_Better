/**
 * DraggableTaskList - 支持拖拽排序的任务列表组件
 * 使用 react-native-draggable-flatlist 实现长按拖拽排序
 * 性能优化：使用useCallback和优化的列表配置
 */

import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Task, SwipeAction } from '../../models/types';
import SwipeableTaskItem from './SwipeableTaskItem';

interface DraggableTaskListProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
  onPress: (taskId: string) => void;
  onSwipeAction: (taskId: string, action: SwipeAction) => void;
  onReorder: (data: Task[]) => void;
}

const DraggableTaskList: React.FC<DraggableTaskListProps> = React.memo(({
  tasks,
  onComplete,
  onPress,
  onSwipeAction,
  onReorder,
}) => {
  const renderItem = useCallback(({ item, drag, isActive, getIndex }: RenderItemParams<Task>) => {
    const index = getIndex();
    const priorityOrder = index !== undefined ? index + 1 : 1;
    const isFirst = index === 0;
    const isLast = index === tasks.length - 1;

    return (
      <ScaleDecorator>
        <View
          style={[
            styles.itemContainer,
            isActive && styles.itemContainerActive,
          ]}
        >
          <SwipeableTaskItem
            task={item}
            priorityOrder={priorityOrder}
            onComplete={onComplete}
            onPress={onPress}
            onSwipeAction={onSwipeAction}
            isFirst={isFirst}
            isLast={isLast}
          />
        </View>
      </ScaleDecorator>
    );
  }, [tasks.length, onComplete, onPress, onSwipeAction]);

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const handleDragEnd = useCallback(({ data }: { data: Task[] }) => {
    onReorder(data);
  }, [onReorder]);

  return (
    <DraggableFlatList
      data={tasks}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onDragEnd={handleDragEnd}
      activationDistance={10}
      // 性能优化配置
      maxToRenderPerBatch={5}
      windowSize={3}
    />
  );
});

const styles = StyleSheet.create({
  itemContainer: {
    // 普通状态
  },
  itemContainerActive: {
    // 拖拽时的状态
    opacity: 0.9,
  },
});

export default DraggableTaskList;
