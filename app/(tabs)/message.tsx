import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

// --- TYPES ---
interface Message {
  id: string;
  text: string;
  sender: "user" | "other";
  time: string;
  timestamp: number;
}

interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  isPinned?: boolean;
  messages: Message[];
  unreadCount: number;
}

// --- MOCK DATA ---
const INITIAL_CHATS: ChatItem[] = [
  {
    id: "support",
    name: "BoxHub Support",
    avatar:
      "https://ui-avatars.com/api/?name=BoxHub+Support&background=8D613A&color=fff",
    isOnline: true,
    isPinned: true,
    unreadCount: 0,
    messages: [
      {
        id: "m1",
        text: "Hello! How can we help you today?",
        sender: "other",
        time: "10:00 AM",
        timestamp: Date.now(),
      },
    ],
  },
  {
    id: "user1",
    name: "Le Monde Steak",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Monde&background=ff4444&color=fff",
    isOnline: false,
    unreadCount: 2,
    messages: [
      {
        id: "m2",
        text: "FLAVOR OF LOVE – HẸN HÒ VALENTINE",
        sender: "other",
        time: "2 days ago",
        timestamp: Date.now() - 100000,
      },
    ],
  },
  {
    id: "user3",
    name: "Gr. N2 - SE Capstone",
    avatar: "https://ui-avatars.com/api/?name=Gr+N2&background=random",
    isOnline: true,
    unreadCount: 5,
    messages: [
      {
        id: "m5",
        text: "@Minh Đức deadline tối nay nhé",
        sender: "other",
        time: "12:00 PM",
        timestamp: Date.now() - 50000,
      },
    ],
  },
];

export default function MessageScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [inputText, setInputText] = useState("");

  const currentChat = chats.find((c) => c.id === selectedChatId);

  const sortedChats = [...chats].sort((a, b) => {
    if (a.isPinned) return -1;
    if (b.isPinned) return 1;
    const lastMsgA = a.messages[a.messages.length - 1]?.timestamp || 0;
    const lastMsgB = b.messages[b.messages.length - 1]?.timestamp || 0;
    return lastMsgB - lastMsgA;
  });

  const handleSendMessage = () => {
    if (!inputText.trim() && !selectedChatId) return;
    const textToSend = inputText.trim() || "👍";

    const newMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      timestamp: Date.now(),
    };

    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === selectedChatId) {
          return { ...chat, messages: [...chat.messages, newMessage] };
        }
        return chat;
      }),
    );
    setInputText("");
  };

  const themeStyles = {
    container: { backgroundColor: colors.background },
    header: { backgroundColor: colors.card, borderBottomColor: colors.border },
    text: { color: colors.text },
    subText: { color: colors.subText },
    inputBar: { backgroundColor: colors.card, borderTopColor: colors.border },
    inputField: {
      backgroundColor: isDarkMode ? "#333" : "#F5F5F5",
      color: colors.text,
    },
    otherBubble: { backgroundColor: isDarkMode ? "#333" : "#FFFFFF" },
    sendBtn: { color: colors.primary },
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.centerContainer, themeStyles.container]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- RENDER: CHAT LIST VIEW ---
  if (!selectedChatId) {
    return (
      <SafeAreaView style={[styles.container, themeStyles.container]}>
        {/* Header List: Có nút Back về Home */}
        <View style={[styles.listHeader, themeStyles.header]}>
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, themeStyles.text]}>
            {t("messages", "Messages")}
          </Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{ padding: 16 }}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: isDarkMode ? "#333" : "#F0F0F0" },
            ]}
          >
            <Ionicons name="search" size={20} color={colors.subText} />
            <TextInput
              placeholder={t("search_messages", "Search messages")}
              placeholderTextColor={colors.subText}
              style={[styles.searchInput, themeStyles.text]}
            />
          </View>
        </View>

        <FlatList
          data={sortedChats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const lastMsg = item.messages[item.messages.length - 1];
            return (
              <TouchableOpacity
                style={[
                  styles.chatItem,
                  { borderBottomColor: isDarkMode ? "#333" : "#F0F0F0" },
                ]}
                onPress={() => setSelectedChatId(item.id)}
              >
                <View>
                  <Image source={{ uri: item.avatar }} style={styles.avatar} />
                  {item.isOnline && <View style={styles.onlineDot} />}
                </View>
                <View style={styles.chatInfo}>
                  <View style={styles.chatHeaderRow}>
                    <Text
                      style={[styles.chatName, themeStyles.text]}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text style={[styles.chatTime, themeStyles.subText]}>
                      {lastMsg?.time}
                    </Text>
                  </View>
                  <View style={styles.chatFooterRow}>
                    <Text
                      style={[
                        styles.lastMessage,
                        themeStyles.subText,
                        item.unreadCount > 0 && styles.unreadText,
                      ]}
                      numberOfLines={1}
                    >
                      {lastMsg?.sender === "user" ? `${t("you", "You")}: ` : ""}
                      {lastMsg?.text}
                    </Text>
                    {item.unreadCount > 0 && (
                      <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>
                          {item.unreadCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </SafeAreaView>
    );
  }

  // --- RENDER: CHAT DETAIL VIEW ---
  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Chat Detail Header */}
        <View style={[styles.header, themeStyles.header]}>
          <TouchableOpacity
            onPress={() => setSelectedChatId(null)}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerProfile}>
            <Image
              source={{ uri: currentChat?.avatar }}
              style={styles.headerAvatar}
            />
            <View>
              <Text style={[styles.headerName, themeStyles.text]}>
                {currentChat?.name}
              </Text>
              <Text style={styles.headerStatus}>
                {currentChat?.isOnline
                  ? t("online", "Online")
                  : t("offline", "Offline")}
              </Text>
            </View>
          </View>

          <TouchableOpacity>
            <Ionicons name="search" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Messages List */}
        <FlatList
          data={currentChat?.messages}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === "user"
                  ? styles.userBubble
                  : themeStyles.otherBubble,
                item.sender === "user"
                  ? { backgroundColor: colors.primary }
                  : null,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === "user" ? styles.userText : themeStyles.text,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.messageTime,
                  item.sender === "user"
                    ? { color: "rgba(255,255,255,0.7)" }
                    : themeStyles.subText,
                ]}
              >
                {item.time}
              </Text>
            </View>
          )}
        />

        {/* Input Bar */}
        <View style={[styles.inputContainer, themeStyles.inputBar]}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="attach" size={26} color={colors.subText} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="image-outline" size={26} color={colors.subText} />
          </TouchableOpacity>

          <TextInput
            style={[styles.textInput, themeStyles.inputField]}
            placeholder={t("type_message", "Message...")}
            placeholderTextColor={colors.subText}
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="happy-outline" size={26} color={colors.subText} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSendMessage}
            style={styles.sendButton}
          >
            {inputText.trim() ? (
              <Ionicons name="send" size={24} color={colors.primary} />
            ) : (
              <Ionicons name="thumbs-up" size={24} color={colors.primary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontFamily: "PlusJakartaSans_700Bold" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 22,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  chatItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  onlineDot: {
    width: 14,
    height: 14,
    backgroundColor: "#10B981",
    borderRadius: 7,
    position: "absolute",
    bottom: 2,
    right: 2,
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: { flex: 1, marginLeft: 16 },
  chatHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  chatName: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold" },
  chatTime: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular" },
  chatFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    marginRight: 8,
  },
  unreadText: { fontFamily: "PlusJakartaSans_700Bold" },
  unreadBadge: {
    backgroundColor: "#FF4444",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  unreadCount: { color: "#fff", fontSize: 10, fontWeight: "bold" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  backButton: { marginRight: 12 },
  headerProfile: { flexDirection: "row", alignItems: "center", flex: 1 },
  headerAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  headerName: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" },
  headerStatus: {
    fontSize: 12,
    color: "#10B981",
    fontFamily: "PlusJakartaSans_500Medium",
  },

  messagesList: { flex: 1 },
  messageBubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 18,
    marginBottom: 8,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    lineHeight: 22,
  },
  userText: { color: "#FFFFFF" },
  messageTime: { fontSize: 10, marginTop: 4, alignSelf: "flex-end" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: "PlusJakartaSans_400Regular",
    marginHorizontal: 8,
    maxHeight: 100,
  },
  iconButton: { padding: 8 },
  sendButton: { padding: 8 },
});
