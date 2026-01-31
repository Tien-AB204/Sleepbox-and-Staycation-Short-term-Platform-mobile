import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

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
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [activeTab, setActiveTab] = useState<"incoming" | "history">("incoming");

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
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
    },
    {
      id: "4",
      bookingId: "#BH-10850",
      title: "The Horizon Box",
      boxNumber: "#201",
      date: "Dec 16, 2025",
      time: "14:00 - 17:00",
      status: "CANCELLED",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200",
    },
  ];

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#8D613A" />
        </View>
      </SafeAreaView>
    );
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "UNCONFIRMED":
      case "CONFIRMED":
        return { backgroundColor: "#FFF3CD", color: "#8D613A" };
      case "COMPLETED":
        return { backgroundColor: "#E5E5E5", color: "#666666" };
      case "CANCELLED":
        return { backgroundColor: "#FFE5E5", color: "#DC2626" };
      default:
        return { backgroundColor: "#E5E5E5", color: "#666666" };
    }
  };

  const renderIncomingCard = (booking: Booking) => {
    const statusStyle = getStatusStyle(booking.status);

    return (
      <View key={booking.id} style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {booking.status}
            </Text>
          </View>
          <Text style={styles.bookingId}>{booking.bookingId}</Text>
        </View>

        <Text style={styles.bookingTitle}>
          {booking.title}{" "}
          <Text style={styles.boxNumber}>Box {booking.boxNumber}</Text>
        </Text>
        <Text style={styles.bookingDateTime}>
          {booking.date} • {booking.time}
        </Text>

        {booking.status === "UNCONFIRMED" && (
          <>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>Reschedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancel booking</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.reportText}>⚠️ Report Issue & Refund</Text>
          </>
        )}

        {booking.status === "CONFIRMED" && (
          <>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>View Detail</Text>
            </TouchableOpacity>
            <Text style={styles.reportText}>⚠️ Report Issue & Refund</Text>
          </>
        )}
      </View>
    );
  };

  const renderHistoryCard = (booking: Booking) => {
    const statusStyle = getStatusStyle(booking.status);

    return (
      <View key={booking.id} style={styles.bookingCard}>
        <View style={styles.cardHeader}>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {booking.status}
            </Text>
          </View>
          <Text style={styles.bookingId}>{booking.bookingId}</Text>
        </View>

        <View style={styles.historyContent}>
          {booking.image && (
            <Image source={{ uri: booking.image }} style={styles.bookingImage} />
          )}
          <View style={styles.historyInfo}>
            <Text style={styles.bookingTitle}>
              {booking.title}{" "}
              <Text style={styles.boxNumber}>{booking.boxNumber}</Text>
            </Text>
            <Text style={styles.bookingDateTime}>
              {booking.date} • {booking.time}
            </Text>
          </View>
        </View>

        {booking.status === "COMPLETED" && (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Rating</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rebookButton}>
              <Text style={styles.rebookButtonText}>Re-book</Text>
            </TouchableOpacity>
          </View>
        )}

        {booking.status === "CANCELLED" && (
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Re-book</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("incoming")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "incoming" && styles.tabTextActive,
            ]}
          >
            Incoming
          </Text>
          {activeTab === "incoming" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.tabTextActive,
            ]}
          >
            History
          </Text>
          {activeTab === "history" && <View style={styles.tabIndicator} />}
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
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 12,
    marginRight: 32,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    color: "#999999",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  tabTextActive: {
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  tabIndicator: {
    position: "absolute",
    bottom: -1,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#8D613A",
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  bookingCard: {
    backgroundColor: "#FFFFFF",
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 0.5,
  },
  bookingId: {
    fontSize: 12,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  bookingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
    marginBottom: 8,
  },
  boxNumber: {
    color: "#8D613A",
  },
  bookingDateTime: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#8D613A",
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
    backgroundColor: "#8D613A",
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
    backgroundColor: "#8D613A",
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
  historyContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  bookingImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
    justifyContent: "center",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.5,
  },
  navIconActive: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  navTextActive: {
    fontSize: 12,
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_500Medium",
  },
});
