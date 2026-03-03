import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 1. Import i18n và Theme
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext"; // Sửa đường dẫn nếu cần thiết (lùi 2 cấp nếu file ở app/(guest)/(screens)/)

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  iconBg: string;
}

export default function NotificationsScreen() {
  // 2. Khởi tạo Hooks
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // 3. Dữ liệu động (để dịch được nội dung)
  const notifications: Notification[] = [
    {
      id: "1",
      icon: "🎉",
      title: t("booking_successful", "Booking Successful!"),
      message: t(
        "booking_confirmed_msg",
        "Your stay at Studio Quiet Room (Box #104) is confirmed.",
      ),
      time: t("time_ago", { count: 2, unit: "hours" }) || "2 hours ago", // Ví dụ dùng i18n params
      iconBg: "#DBEAFE",
    },
    {
      id: "2",
      icon: "🎁",
      title: t("promotion", "Promotion"),
      message: t(
        "discount_msg",
        "20% discount for your next booking in Thu Duc District.",
      ),
      time: t("time_ago", { count: 5, unit: "hours" }) || "5 hours ago",
      iconBg: "#FFEDD5",
    },
  ];

  // 4. Styles động theo Theme
  const themeStyles = {
    container: { backgroundColor: colors.background },
    header: { borderBottomColor: colors.border },
    text: { color: colors.text },
    subText: { color: colors.subText },
    border: { borderBottomColor: isDarkMode ? "#333" : "#F5F5F5" },
    iconColor: { color: colors.text },
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingContainer, themeStyles.container]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <View style={[styles.header, themeStyles.header]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={[styles.backIcon, themeStyles.iconColor]}>←</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text]}>
          {t("notifications", "Notifications")}
        </Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={[styles.menuIcon, themeStyles.subText]}>⋮</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Today Section */}
        <Text style={[styles.sectionTitle, themeStyles.text]}>
          {t("today", "Today")}
        </Text>

        {/* Notification Items */}
        {notifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[styles.notificationItem, themeStyles.border]}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: notification.iconBg },
              ]}
            >
              <Text style={styles.notificationIcon}>{notification.icon}</Text>
            </View>
            <View style={styles.notificationContent}>
              <Text style={[styles.notificationTitle, themeStyles.text]}>
                {notification.title}
              </Text>
              <Text style={[styles.notificationMessage, themeStyles.subText]}>
                {notification.message}
              </Text>
              <Text style={[styles.notificationTime, themeStyles.subText]}>
                {notification.time}
              </Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#FFFFFF", // Đã xóa để dùng themeStyles
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    // borderBottomColor: "#F0F0F0", // Đã xóa
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    // color: "#1A1A1A", // Đã xóa
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    // color: "#1A1A1A", // Đã xóa
    fontFamily: "PlusJakartaSans_700Bold",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  menuIcon: {
    fontSize: 24,
    // color: "#999999", // Đã xóa
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    // color: "#1A1A1A", // Đã xóa
    fontFamily: "PlusJakartaSans_700Bold",
    marginTop: 24,
    marginBottom: 20,
  },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    // borderBottomColor: "#F5F5F5", // Đã xóa
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  notificationIcon: {
    fontSize: 28,
  },
  notificationContent: {
    flex: 1,
    justifyContent: "center",
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "700",
    // color: "#1A1A1A", // Đã xóa
    fontFamily: "PlusJakartaSans_700Bold",
    // fontStyle: "italic", // Đã xóa chữ nghiêng cho đẹp hơn (tùy chọn)
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    // color: "#666666", // Đã xóa
    fontFamily: "PlusJakartaSans_400Regular",
    // fontStyle: "italic",
    lineHeight: 20,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    // color: "#999999", // Đã xóa
    fontFamily: "PlusJakartaSans_400Regular",
    // fontStyle: "italic",
  },
});
