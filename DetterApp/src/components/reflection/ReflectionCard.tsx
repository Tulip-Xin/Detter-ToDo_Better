/**
 * ReflectionCard - 复盘卡片组件
 * 单个卡片项，支持动态缩放效果
 */
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  SharedValue,
} from 'react-native-reanimated';
import { TaskWithReflection } from '../../models/types';
import { COLORS, FONT_SIZES, SIZES, CARD_LIST } from '../../utils/constants';
import { useTheme } from '../../contexts/ThemeContext';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ReflectionCardProps {
  task: TaskWithReflection;
  index: number;
  scrollY: SharedValue<number>;
  onPress: () => void;
}

const ReflectionCard: React.FC<ReflectionCardProps> = ({
  task,
  index,
  scrollY,
  onPress,
}) => {
  const { theme } = useTheme();

  // 计算卡片的动态缩放
  const animatedStyle = useAnimatedStyle(() => {
    // 计算卡片中心点位置
    const cardCenter = CARD_LIST.CARD_HEIGHT * index + CARD_LIST.CARD_HEIGHT / 2;
    // 计算屏幕中心点
    const screenCenter = SCREEN_HEIGHT / 2 + scrollY.value;
    // 计算距离
    const distance = Math.abs(cardCenter - screenCenter);
    
    // 映射到缩放值 (1.0 到 0.8)
    const scale = interpolate(
      distance,
      [0, SCREEN_HEIGHT / 2],
      [CARD_LIST.MAX_SCALE, CARD_LIST.MIN_SCALE],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ scale }],
    };
  });

  // 使用 useMemo 缓存计算结果
  const hasReflection = useMemo(() => !!task.reflection, [task.reflection]);
  const completedDate = useMemo(
    () => task.completedAt
      ? format(task.completedAt, 'yyyy年MM月dd日', { locale: zhCN })
      : '',
    [task.completedAt]
  );

  return (
    <Animated.View style={[styles.cardWrapper, animatedStyle]}>
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: theme.card },
          hasReflection && styles.cardWithReflection,
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {/* 卡片内容 */}
        <View style={styles.cardContent}>
          {/* 标题 */}
          <Text
            style={[styles.title, { color: theme.text }]}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* 描述 */}
          {task.description && (
            <Text
              style={[styles.description, { color: theme.text }]}
              numberOfLines={3}
            >
              {task.description}
            </Text>
          )}

          {/* 完成日期 */}
          <Text style={[styles.date, { color: theme.text }]}>
            完成于 {completedDate}
          </Text>

          {/* 标签 */}
          {task.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {task.tags.slice(0, 3).map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
              {task.tags.length > 3 && (
                <Text style={[styles.moreTagsText, { color: theme.text }]}>
                  +{task.tags.length - 3}
                </Text>
              )}
            </View>
          )}

          {/* 复盘预览 */}
          {hasReflection && task.reflection && (
            <View style={styles.reflectionPreview}>
              <Text style={styles.reflectionLabel}>复盘：</Text>
              <Text
                style={[styles.reflectionContent, { color: theme.text }]}
                numberOfLines={2}
              >
                {task.reflection.content}
              </Text>
            </View>
          )}

          {/* 复盘状态指示 */}
          {hasReflection && (
            <View style={styles.reflectionBadge}>
              <Text style={styles.reflectionBadgeText}>已思</Text>
            </View>
          )}
          {!hasReflection && (
            <View style={[styles.reflectionBadge, styles.noReflectionBadge]}>
              <Text style={styles.noReflectionBadgeText}>待思</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    height: CARD_LIST.CARD_HEIGHT,
    paddingHorizontal: SIZES.PADDING,
    justifyContent: 'center',
  },
  card: {
    height: CARD_LIST.CARD_HEIGHT - 20,
    borderRadius: SIZES.BORDER_RADIUS_LARGE,
    padding: SIZES.PADDING_LARGE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardWithReflection: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  cardContent: {
    flex: 1,
    position: 'relative',
  },
  title: {
    fontSize: FONT_SIZES.XXLARGE,
    fontWeight: '700',
    marginBottom: 8,
    paddingRight: 60,
  },
  description: {
    fontSize: FONT_SIZES.MEDIUM,
    opacity: 0.7,
    marginBottom: 12,
    lineHeight: 20,
  },
  date: {
    fontSize: FONT_SIZES.SMALL,
    opacity: 0.5,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.TEXT_SECONDARY,
  },
  moreTagsText: {
    fontSize: FONT_SIZES.SMALL,
    opacity: 0.6,
    alignSelf: 'center',
  },
  reflectionPreview: {
    marginTop: 'auto',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
  },
  reflectionLabel: {
    fontSize: FONT_SIZES.SMALL,
    color: COLORS.PRIMARY,
    fontWeight: '600',
    marginBottom: 4,
  },
  reflectionContent: {
    fontSize: FONT_SIZES.SMALL,
    opacity: 0.7,
    lineHeight: 18,
  },
  reflectionBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  reflectionBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
  },
  noReflectionBadge: {
    backgroundColor: COLORS.TEXT_PLACEHOLDER,
  },
  noReflectionBadgeText: {
    color: COLORS.WHITE,
    fontSize: FONT_SIZES.SMALL,
    fontWeight: '600',
  },
});

export default React.memo(ReflectionCard);
