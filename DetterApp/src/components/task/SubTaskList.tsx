/**
 * SubTaskList 组件
 * 子任务列表，支持添加、删除和完成子任务
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SubTask } from '../../models/types';
import { COLORS } from '../../utils/constants';

interface SubTaskListProps {
  subtasks: SubTask[];
  onChange: (subtasks: SubTask[]) => void;
  editable?: boolean;
}

const SubTaskList: React.FC<SubTaskListProps> = ({
  subtasks,
  onChange,
  editable = true,
}) => {
  const [inputValue, setInputValue] = useState('');

  // 添加子任务
  const handleAddSubTask = () => {
    if (!inputValue.trim()) {
      return;
    }

    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: inputValue.trim(),
      completed: false,
    };

    onChange([...subtasks, newSubTask]);
    setInputValue('');
  };

  // 切换子任务完成状态
  const handleToggleSubTask = (id: string) => {
    const updatedSubTasks = subtasks.map((st) =>
      st.id === id ? { ...st, completed: !st.completed } : st
    );
    onChange(updatedSubTasks);
  };

  // 删除子任务
  const handleDeleteSubTask = (id: string) => {
    const updatedSubTasks = subtasks.filter((st) => st.id !== id);
    onChange(updatedSubTasks);
  };

  // 渲染子任务项
  const renderSubTaskItem = ({ item }: { item: SubTask }) => (
    <View style={styles.subtaskItem}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => handleToggleSubTask(item.id)}
        disabled={!editable}>
        <View
          style={[
            styles.checkboxInner,
            item.completed && styles.checkboxInnerChecked,
          ]}>
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <Text
        style={[
          styles.subtaskTitle,
          item.completed && styles.subtaskTitleCompleted,
        ]}>
        {item.title}
      </Text>

      {editable && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteSubTask(item.id)}>
          <Text style={styles.deleteButtonText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 子任务输入框 */}
      {editable && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="添加子任务"
            placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
            value={inputValue}
            onChangeText={setInputValue}
            onSubmitEditing={handleAddSubTask}
            returnKeyType="done"
            maxLength={100}
          />
          <TouchableOpacity
            style={[
              styles.addButton,
              !inputValue.trim() && styles.addButtonDisabled,
            ]}
            onPress={handleAddSubTask}
            disabled={!inputValue.trim()}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 子任务列表 */}
      {subtasks.length > 0 && (
        <FlatList
          data={subtasks}
          renderItem={renderSubTaskItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.BACKGROUND_LIGHT,
    borderRadius: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
    padding: 0,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.BORDER,
  },
  addButtonText: {
    fontSize: 20,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  list: {
    marginTop: 8,
  },
  subtaskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.BORDER,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInnerChecked: {
    backgroundColor: COLORS.PRIMARY,
    borderColor: COLORS.PRIMARY,
  },
  checkmark: {
    fontSize: 14,
    color: COLORS.WHITE,
    fontWeight: 'bold',
  },
  subtaskTitle: {
    flex: 1,
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
  subtaskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: COLORS.TEXT_SECONDARY,
    opacity: 0.6,
  },
  deleteButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 24,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
});

export default SubTaskList;
