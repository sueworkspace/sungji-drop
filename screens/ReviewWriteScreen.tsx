import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { RootStackParamList } from '../navigation/RootNavigator';

type Route = RouteProp<RootStackParamList, 'ReviewWrite'>;

const TAGS = ['친절함', '가격 정확', '재고 많음', '빠른 개통', '주차 편함', '청결함'];

export default function ReviewWriteScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { storeName } = route.params;

  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← 뒤로</Text>
        </TouchableOpacity>
        <Text style={styles.title}>리뷰 작성</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.storeName}>{storeName}</Text>

        {/* Rating */}
        <View style={styles.section}>
          <Text style={styles.label}>별점</Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={[styles.star, star <= rating && styles.starActive]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.label}>태그 선택</Text>
          <View style={styles.tagsList}>
            {TAGS.map(tag => (
              <TouchableOpacity
                key={tag}
                onPress={() => toggleTag(tag)}
                style={[styles.tag, selectedTags.includes(tag) && styles.tagActive]}
              >
                <Text style={[
                  styles.tagText,
                  { color: selectedTags.includes(tag) ? Colors.dropGreen : Colors.textMuted },
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Text */}
        <View style={styles.section}>
          <Text style={styles.label}>리뷰 내용</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="매장에서의 경험을 솔직하게 공유해주세요..."
            placeholderTextColor={Colors.textDim}
            multiline
            numberOfLines={5}
            style={styles.input}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.submitBtn, !text.trim() && styles.submitBtnDisabled]}
        onPress={() => navigation.goBack()}
        disabled={!text.trim()}
      >
        <Text style={styles.submitBtnText}>리뷰 등록 →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: '#1a1a2e',
  },
  backBtn: { fontFamily: 'PressStart2P', fontSize: 8, color: Colors.dropGreen },
  title: { fontFamily: 'PressStart2P', fontSize: 9, color: '#fff' },
  content: { padding: Spacing.base, paddingBottom: 20, gap: 20 },
  storeName: { fontSize: 18, fontWeight: '700', color: Colors.dropGreen, marginBottom: 4 },
  section: { gap: 10 },
  label: { fontFamily: 'PressStart2P', fontSize: 8, color: Colors.dropGreen },
  stars: { flexDirection: 'row', gap: 8 },
  star: { fontSize: 32, color: Colors.textDim },
  starActive: { color: Colors.dealGold },
  tagsList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: {
    paddingHorizontal: 12, paddingVertical: 7,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  tagActive: { borderColor: Colors.dropGreen, backgroundColor: Colors.greenOverlay },
  tagText: { fontFamily: 'PressStart2P', fontSize: 6 },
  input: {
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
    color: Colors.textPrimary, fontSize: 14, padding: 14,
    textAlignVertical: 'top', minHeight: 130,
  },
  submitBtn: {
    margin: Spacing.base, backgroundColor: Colors.dropGreen,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: Colors.dropGreen, shadowOpacity: 0.3, shadowRadius: 8,
  },
  submitBtnDisabled: { opacity: 0.4 },
  submitBtnText: { fontFamily: 'PressStart2P', fontSize: 10, color: Colors.bg },
});
