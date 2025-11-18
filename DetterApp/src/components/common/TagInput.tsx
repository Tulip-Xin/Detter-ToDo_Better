/**
 * TagInput 组件
 * 标签输入组件，支持标签建议和胶囊样式显示
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { COLORS } from '../../utils/constants';
import TaskService from '../../services/TaskService';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  onInsertHash?: () => void;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onChange, onInsertHash }) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // 从数据库加载已有标签
  useEffect(() => {
    loadExistingTags();
  }, []);

  // 监听输入变化，显示标签建议
  useEffect(() => {
    if (inputValue.includes('#')) {
      const hashIndex = inputValue.lastIndexOf('#');
      const searchText = inputValue.substring(hashIndex + 1).toLowerCase();
      
      if (searchText.length > 0) {
        const filtered = suggestions.filter((tag) =>
          tag.toLowerCase().includes(searchText)
        );
        setSuggestions(filtered);
        setShowSuggestions(filtered.length > 0);
      } else {
        setShowSuggestions(suggestions.length > 0);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue]);

  const loadExistingTags = async () => {
    try {
      const existingTags = await TaskService.getAllTags();
      setSuggestions(existingTags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  // 从输入中提取标签
  const extractTags = (text: string): string[] => {
    const tagRegex = /#(\w+)/g;
    const matches = text.match(tagRegex);
    if (!matches) return [];
    
    return matches.map((match) => match.substring(1)); // 移除 # 符号
  };

  // 处理输入变化
  const handleInputChange = (text: string) => {
    setInputValue(text);
    
    // 实时提取标签
    const extractedTags = extractTags(text);
    if (extractedTags.length > 0) {
      // 合并新标签和已有标签，去重
      const uniqueTags = Array.from(new Set([...tags, ...extractedTags]));
      onChange(uniqueTags);
    }
  };

  // 选择建议的标签
  const handleSelectSuggestion = (tag: string) => {
    // 在输入框中插入标签
    const hashIndex = inputValue.lastIndexOf('#');
    const newText = inputValue.substring(0, hashIndex) + '#' + tag + ' ';
    setInputValue(newText);
    
    // 添加到标签列表
    if (!tags.includes(tag)) {
      onChange([...tags, tag]);
    }
    
    setShowSuggestions(false);
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    onChange(updatedTags);
    
    // 从输入框中移除标签
    const newText = inputValue.replace(new RegExp(`#${tagToRemove}\\s*`, 'g'), '');
    setInputValue(newText);
  };

  // 插入 # 符号
  const handleInsertHash = () => {
    setInputValue(inputValue + '#');
    if (onInsertHash) {
      onInsertHash();
    }
  };

  // 渲染标签胶囊
  const renderTag = (tag: string) => (
    <View key={tag} style={styles.tag}>
      <Text style={styles.tagText}>#{tag}</Text>
      <TouchableOpacity
        style={styles.tagRemoveButton}
        onPress={() => handleRemoveTag(tag)}>
        <Text style={styles.tagRemoveText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染建议项
  const renderSuggestionItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSelectSuggestion(item)}>
      <Text style={styles.suggestionText}>#{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 标签显示区域 */}
      {tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {tags.map((tag) => renderTag(tag))}
        </View>
      )}

      {/* 输入框 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="输入 # 添加标签"
          placeholderTextColor={COLORS.TEXT_PLACEHOLDER}
          value={inputValue}
          onChangeText={handleInputChange}
          multiline
          maxLength={200}
        />
        <TouchableOpacity
          style={styles.hashButton}
          onPress={handleInsertHash}>
          <Text style={styles.hashButtonText}>#</Text>
        </TouchableOpacity>
      </View>

      {/* 标签建议列表 */}
      {showSuggestions && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={suggestions}
            renderItem={renderSuggestionItem}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            style={styles.suggestionsList}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.DATE_SELECTOR_BG,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: COLORS.PRIMARY,
    fontWeight: '500',
  },
  tagRemoveButton: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagRemoveText: {
    fontSize: 18,
    color: COLORS.TEXT_SECONDARY,
    fontWeight: '300',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
    minHeight: 40,
    textAlignVertical: 'top',
  },
  hashButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hashButtonText: {
    fontSize: 18,
    color: COLORS.WHITE,
    fontWeight: '600',
  },
  suggestionsContainer: {
    marginTop: 8,
    backgroundColor: COLORS.WHITE,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.BORDER,
    maxHeight: 200,
  },
  suggestionsList: {
    padding: 4,
  },
  suggestionItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  suggestionText: {
    fontSize: 16,
    color: COLORS.TEXT_PRIMARY,
  },
});

export default TagInput;
