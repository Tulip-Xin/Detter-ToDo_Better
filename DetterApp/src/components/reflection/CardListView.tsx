/**
 * CardListView - 卡片列表视图
 * 使用动态缩放效果展示已完成任务
 */
import React, { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  scrollTo,
  clamp,
} from 'react-native-reanimated';
import { TaskWithReflection } from '../../models/types';
import { CARD_LIST } from '../../utils/constants';
import ReflectionCard from './ReflectionCard';
import { CompletedTasksEmptyState } from '../common/EmptyState';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CardListViewProps {
  tasks: TaskWithReflection[];
  onTaskPress: (taskId: string) => void;
}

const CardListView: React.FC<CardListViewProps> = React.memo(({ tasks, onTaskPress }) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  
  // 使用 useSharedValue 管理滚动位置
  const scrollY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  // 使用 useCallback 缓存回调函数
  const handleTaskPress = useCallback((taskId: string) => {
    onTaskPress(taskId);
  }, [onTaskPress]);

  // 监听滚动事件
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
    onBeginDrag: (event) => {
      'worklet';
      lastScrollY.value = event.contentOffset.y;
    },
    onMomentumEnd: (event) => {
      'worklet';
      const offsetY = event.contentOffset.y;
      const velocity = event.velocity?.y || 0;
      
      // 计算当前卡片索引
      const currentIndex = offsetY / CARD_LIST.CARD_HEIGHT;
      
      // 根据速度计算惯性滚动距离
      let targetIndex = Math.round(currentIndex);
      
      // 如果速度较大，根据速度方向调整目标索引
      if (Math.abs(velocity) > 500) {
        const velocityFactor = velocity / 1000; // 归一化速度
        const maxCards = CARD_LIST.MAX_SWIPE_CARDS;
        
        // 限制最大滚动卡片数
        const cardOffset = clamp(
          Math.round(velocityFactor),
          -maxCards,
          maxCards
        );
        
        targetIndex = Math.round(currentIndex + cardOffset);
      }
      
      // 确保目标索引在有效范围内
      targetIndex = clamp(targetIndex, 0, tasks.length - 1);
      
      const targetOffset = targetIndex * CARD_LIST.CARD_HEIGHT;
      
      // 如果当前位置与目标位置不同，平滑滚动到目标位置
      if (Math.abs(offsetY - targetOffset) > 1) {
        scrollTo(
          scrollViewRef,
          0,
          targetOffset,
          true
        );
      }
    },
  });

  // 如果没有任务，显示空状态
  if (tasks.length === 0) {
    return (
      <View style={styles.container}>
        <CompletedTasksEmptyState />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollViewRef}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={CARD_LIST.CARD_HEIGHT}
        decelerationRate="fast"
        bounces={true}
      >
        {tasks.map((task, index) => (
          <ReflectionCard
            key={task.id}
            task={task}
            index={index}
            scrollY={scrollY}
            onPress={() => handleTaskPress(task.id)}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: SCREEN_HEIGHT / 2 - CARD_LIST.CARD_HEIGHT / 2,
  },
});

export default CardListView;
