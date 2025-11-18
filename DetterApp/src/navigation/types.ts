/**
 * Navigation types
 */
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';

// Bottom Tab Navigator参数列表
export type BottomTabParamList = {
  Task: undefined;
  Reflection: undefined;
  Profile: undefined;
};

// Stack Navigator参数列表（用于详情页等）
export type RootStackParamList = {
  MainTabs: undefined;
  TaskEdit: { taskId: string };
  ReflectionDetail: { taskId: string };
};

// 屏幕Props类型
export type TaskScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Task'>,
  StackScreenProps<RootStackParamList>
>;

export type ReflectionScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Reflection'>,
  StackScreenProps<RootStackParamList>
>;

export type ProfileScreenProps = CompositeScreenProps<
  BottomTabScreenProps<BottomTabParamList, 'Profile'>,
  StackScreenProps<RootStackParamList>
>;

export type TaskEditScreenProps = StackScreenProps<RootStackParamList, 'TaskEdit'>;
export type ReflectionDetailScreenProps = StackScreenProps<RootStackParamList, 'ReflectionDetail'>;
