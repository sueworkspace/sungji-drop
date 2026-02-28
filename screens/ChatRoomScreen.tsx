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
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../constants';
import { PixelText } from '../components';
import { RootStackParamList } from '../navigation/RootNavigator';
import { useMessages } from '../src/hooks/useMessages';
import type { Message } from '../src/lib/supabase-types';

type RouteP = RouteProp<RootStackParamList, 'ChatRoom'>;

function formatTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
}

export default function ChatRoomScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteP>();
  const { roomId, dealerName } = route.params;

  const { messages, isLoading, sendMessage } = useMessages(roomId);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const listRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    setInputText('');
    setIsSending(true);
    try {
      await sendMessage(text);
    } finally {
      setIsSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender_type === 'user';
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
              {item.content}
            </Text>
          </View>
          <Text style={[styles.messageTime, isUser && { textAlign: 'right' }]}>
            {formatTime(item.created_at)}
          </Text>
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
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dropGreen} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          />
        )}

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
            editable={!isSending}
          />
          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isSending}
          >
            <PixelText size="badge" color={inputText.trim() && !isSending ? Colors.textInverse : Colors.textMuted}>
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

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

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
