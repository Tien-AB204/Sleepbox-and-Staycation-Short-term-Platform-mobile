import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface Booking {
  id: string;
  bookingId: string;
  title: string;
  boxNumber: string;
  date: string;
  time: string;
  status: "UNCONFIRMED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  image?: string;
}

export default function BookingScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [activeTab, setActiveTab] = useState<"incoming" | "history">(
    "incoming",
  );

  const incomingBookings: Booking[] = [
    {
      id: "1",
      bookingId: "#BH-12345",
      title: "Studio Quiet Room",
      boxNumber: "#104",
      date: "Jan 3rd",
      time: "08:00 - 09:00",
      status: "UNCONFIRMED",
    },
    {
      id: "2",
      bookingId: "#BH-12345",
      title: "Studio Quiet Room",
      boxNumber: "#105",
      date: "Jan 3rd",
      time: "08:00 - 09:00",
      status: "CONFIRMED",
    },
  ];

  const historyBookings: Booking[] = [
    {
      id: "3",
      bookingId: "#BH-10922",
      title: "Studio Quiet Room",
      boxNumber: "#104",
      date: "Dec 29, 2025",
      time: "10:00 - 12:00",
      status: "COMPLETED",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
    },
    {
      id: "4",
      bookingId: "#BH-10850",
      title: "The Horizon Box",
      boxNumber: "#201",
      date: "Dec 16, 2025",
      time: "14:00 - 17:00",
      status: "CANCELLED",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200",
    },
  ];

  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card },
    border: { borderBottomColor: colors.border },
    secondaryBtn: {
      backgroundColor: colors.background,
      borderColor: colors.border,
    },
  };

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingContainer, themeStyles.container]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "UNCONFIRMED":
      case "CONFIRMED":
        return {
          backgroundColor: isDarkMode ? "#4A3B22" : "#FFF3CD",
          color: isDarkMode ? "#F0C879" : "#8D613A",
        };
      case "COMPLETED":
        return {
          backgroundColor: isDarkMode ? "#333333" : "#E5E5E5",
          color: isDarkMode ? "#CCCCCC" : "#666666",
        };
      case "CANCELLED":
        return {
          backgroundColor: isDarkMode ? "#4A1C1C" : "#FFE5E5",
          color: isDarkMode ? "#FF6B6B" : "#DC2626",
        };
      default:
        return {
          backgroundColor: isDarkMode ? "#333333" : "#E5E5E5",
          color: isDarkMode ? "#CCCCCC" : "#666666",
        };
    }
  };

  const getTranslatedStatus = (status: string) => {
    switch (status) {
      case "UNCONFIRMED":
        return t("unconfirmed", "UNCONFIRMED");
      case "CONFIRMED":
        return t("confirmed", "CONFIRMED");
      case "COMPLETED":
        return t("completed", "COMPLETED");
      case "CANCELLED":
        return t("cancelled", "CANCELLED");
      default:
        return status;
    }
  };

  const renderIncomingCard = (booking: Booking) => {
    const statusStyle = getStatusStyle(booking.status);

    return (
      <View key={booking.id} style={[styles.bookingCard, themeStyles.card]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {getTranslatedStatus(booking.status)}
            </Text>
          </View>
          <Text style={[styles.bookingId, themeStyles.subText]}>
            {booking.bookingId}
          </Text>
        </View>

        <Text style={[styles.bookingTitle, themeStyles.text]}>
          {booking.title}{" "}
          <Text style={[styles.boxNumber, { color: colors.primary }]}>
            {t("box")} {booking.boxNumber}
          </Text>
        </Text>
        <Text style={[styles.bookingDateTime, themeStyles.subText]}>
          {booking.date} • {booking.time}
        </Text>

        {booking.status === "UNCONFIRMED" && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.secondaryButton, themeStyles.secondaryBtn]}
              >
                <Text style={[styles.secondaryButtonText, themeStyles.text]}>
                  {t("reschedule", "Reschedule")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.cancelButtonText}>
                  {t("cancel_booking", "Cancel booking")}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.reportText}>
              ⚠️ {t("report_issue", "Report Issue & Refund")}
            </Text>
          </>
        )}

        {booking.status === "CONFIRMED" && (
          <>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => router.push("/bookingdetail")}
            >
              <Text style={styles.primaryButtonText}>
                {t("view_detail", "View Detail")}
              </Text>
            </TouchableOpacity>
            <Text style={styles.reportText}>
              ⚠️ {t("report_issue", "Report Issue & Refund")}
            </Text>
          </>
        )}
      </View>
    );
  };

  const renderHistoryCard = (booking: Booking) => {
    const statusStyle = getStatusStyle(booking.status);

    return (
      <View key={booking.id} style={[styles.bookingCard, themeStyles.card]}>
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusStyle.backgroundColor },
            ]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {getTranslatedStatus(booking.status)}
            </Text>
          </View>
          <Text style={[styles.bookingId, themeStyles.subText]}>
            {booking.bookingId}
          </Text>
        </View>

        <View style={styles.historyContent}>
          {booking.image && (
            <Image
              source={{ uri: booking.image }}
              style={styles.bookingImage}
            />
          )}
          <View style={styles.historyInfo}>
            <Text style={[styles.bookingTitle, themeStyles.text]}>
              {booking.title}{" "}
              <Text style={[styles.boxNumber, { color: colors.primary }]}>
                {booking.boxNumber}
              </Text>
            </Text>
            <Text style={[styles.bookingDateTime, themeStyles.subText]}>
              {booking.date} • {booking.time}
            </Text>
          </View>
        </View>

        {booking.status === "COMPLETED" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.secondaryButton, themeStyles.secondaryBtn]}
            >
              <Text style={[styles.secondaryButtonText, themeStyles.text]}>
                {t("rating", "Rating")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.rebookButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.rebookButtonText}>
                {t("rebook", "Re-book")}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === "CANCELLED" && (
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.primaryButtonText}>
              {t("rebook", "Re-book")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, themeStyles.text]}>
          {t("my_booking", "My Booking")}
        </Text>
      </View>

      {/* Tabs */}
      <View style={[styles.tabContainer, themeStyles.border]}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("incoming")}
        >
          <Text
            style={[
              styles.tabText,
              themeStyles.subText,
              activeTab === "incoming" && [
                styles.tabTextActive,
                { color: colors.primary },
              ],
            ]}
          >
            {t("incoming", "Incoming")}
          </Text>
          {activeTab === "incoming" && (
            <View
              style={[styles.tabIndicator, { backgroundColor: colors.primary }]}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              themeStyles.subText,
              activeTab === "history" && [
                styles.tabTextActive,
                { color: colors.primary },
              ],
            ]}
          >
            {t("history", "History")}
          </Text>
          {activeTab === "history" && (
            <View
              style={[styles.tabIndicator, { backgroundColor: colors.primary }]}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "incoming" &&
          incomingBookings.map((booking) => renderIncomingCard(booking))}
        {activeTab === "history" &&
          historyBookings.map((booking) => renderHistoryCard(booking))}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { paddingHorizontal: 20, paddingTop: 40, paddingBottom: 16 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },

  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingHorizontal: 20,
  },
  tab: { paddingVertical: 12, marginRight: 32, position: "relative" },
  tabText: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },
  tabTextActive: { fontFamily: "PlusJakartaSans_600SemiBold" },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    borderRadius: 2,
  },

  content: { flex: 1, paddingTop: 20 },
  bookingCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 0.5,
  },
  bookingId: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular" },

  bookingTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
    marginBottom: 8,
  },
  boxNumber: { fontStyle: "italic" },
  bookingDateTime: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
    marginBottom: 16,
  },

  buttonRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  rebookButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  rebookButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  reportText: {
    fontSize: 13,
    color: "#F97316",
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "center",
  },

  historyContent: { flexDirection: "row", marginBottom: 16 },
  bookingImage: { width: 60, height: 60, borderRadius: 12, marginRight: 12 },
  historyInfo: { flex: 1, justifyContent: "center" },
});
