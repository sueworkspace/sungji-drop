import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';

type RouteP = RouteProp<RootStackParamList, 'ChatRoom'>;

type MessageRole = 'user' | 'dealer';

interface Message {
  id: string;
  role: MessageRole;
  text: string;
  time: string;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: 'm1',
    role: 'dealer',
    text: '안녕하세요! 견적 문의 주셔서 감사합니다. 어떻게 도와드릴까요?',
    time: '오후 2:30',
  },
  {
    id: 'm2',
    role: 'user',
    text: '갤럭시 S25 Ultra 256GB SKT로 견적 요청했는데요, 자세한 내용 알고 싶습니다.',
    time: '오후 2:31',
  },
  {
    id: 'm3',
    role: 'dealer',
    text: '네, 확인했습니다! 현재 공시지원금 15만원 적용 가능하고요, 기기값 89만원에 드릴 수 있어요. SKT 5G 무제한 요금제 기준입니다.',
    time: '오후 2:32',
  },
  {
    id: 'm4',
    role: 'dealer',
    text: '추가로 보상판매 있으시면 더 할인 가능합니다. 기존 폰 있으세요?',
    time: '오후 2:32',
  },
  {
    id: 'm5',
    role: 'user',
    text: '갤럭시 S24 있는데요, 상태는 상급이에요.',
    time: '오후 2:35',
  },
];

export default function ChatRoomScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteP>();
  const { dealerName } = route.params;

  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const listRef = useRef<FlatList>(null);

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        role: 'user',
        text,
        time: timeStr,
      },
    ]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.messageRow, isUser ? styles.messageRowUser : styles.messageRowDealer]}>
        {!isUser && (
          <View style={styles.dealerAvatar}>
            <Text style={styles.dealerAvatarText}>🏪</Text>
          </View>
        )}
        <View style={styles.messageBubbleWrapper}>
          <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleDealer]}>
            <Text style={[styles.bubbleText, isUser ? styles.bubbleTextUser : styles.bubbleTextDealer]}>
              {item.text}
            </Text>
          </View>
          <Text style={[styles.messageTime, isUser && { textAlign: 'right' }]}>{item.time}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <PixelText size="label" color={Colors.textSecondary}>←</PixelText>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <PixelText size="label" color={Colors.dropGreen}>{dealerName}</PixelText>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messageList}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="메시지를 입력하세요..."
            placeholderTextColor={Colors.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <PixelText size="badge" color={inputText.trim() ? Colors.textInverse : Colors.textMuted}>
              전송
            </PixelText>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  headerCenter: { flex: 1, alignItems: 'center' },

  messageList: { padding: Spacing.base, gap: Spacing.md },

  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  messageRowUser: { justifyContent: 'flex-end' },
  messageRowDealer: { justifyContent: 'flex-start' },

  dealerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginBottom: 16,
  },
  dealerAvatarText: { fontSize: 16 },

  messageBubbleWrapper: { maxWidth: '75%' },
  bubble: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 2,
  },
  bubbleUser: {
    backgroundColor: Colors.dropGreen,
    borderBottomRightRadius: 0,
  },
  bubbleDealer: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderBottomLeftRadius: 0,
  },
  bubbleText: { fontSize: 14, lineHeight: 20 },
  bubbleTextUser: { fontFamily: 'NotoSansKR-Bold', color: Colors.textInverse },
  bubbleTextDealer: { fontFamily: 'NotoSansKR', color: Colors.textPrimary },
  messageTime: {
    fontFamily: 'NotoSansKR',
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 3,
  },

  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#1a1a2e',
    backgroundColor: Colors.bg,
  },
  textInput: {
    flex: 1,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontFamily: 'NotoSansKR',
    fontSize: 14,
    maxHeight: 100,
  },
  sendButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.dropGreen,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
