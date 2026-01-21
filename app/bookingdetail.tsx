import React from "react";
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

export default function BookingDetailScreen() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#8D613A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/booking")} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Detail</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket Container */}
        <View style={styles.ticketContainer}>
          {/* Box Information */}
          <View style={styles.boxSection}>
            <View style={styles.imagePlaceholder} />
            <View style={styles.boxInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.boxTitle}>Studio Quiet Room</Text>
                <Text style={styles.boxNumber}>Box #104</Text>
              </View>
              <Text style={styles.boxLocation}>District 1, HCMC</Text>
              <Text style={styles.boxPrice}>$20<Text style={styles.priceUnit}>/night</Text></Text>
            </View>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Text style={styles.locationLabel}>Location</Text>
            <TouchableOpacity>
              <Text style={styles.openMapText}>Open Map</Text>
            </TouchableOpacity>
          </View>

          {/* Booking Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Check-in:</Text>
              <Text style={styles.detailValue}>9:00 Nov 12, 2024</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Check-out:</Text>
              <Text style={styles.detailValue}>16:00 Nov 13, 2024</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>👥 Total price:</Text>
              <Text style={styles.detailValue}>$20</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={styles.qrCode}>
              <Image
                source={{ uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=06158310-5427-471d" }}
                style={styles.qrImage}
              />
            </View>
          </View>

          {/* Barcode */}
          <View style={styles.barcodeContainer}>
            <Image
              source={{ uri: "https://barcode.tec-it.com/barcode.ashx?data=06158310-5427-471d&code=Code128&translate-esc=on" }}
              style={styles.barcodeImage}
              resizeMode="contain"
            />
            <Text style={styles.barcodeText}>06158310-5427-471d</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/home")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/booking")}>
          <Text style={styles.navIconActive}>📅</Text>
          <Text style={styles.navTextActive}>My Booking</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/message")}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/profile")}>
          <Text style={styles.navIcon}>👤</Text>
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 24,
    color: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  ticketContainer: {
    marginHorizontal: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3B82F6",
    borderRadius: 16,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  boxSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginRight: 16,
  },
  boxInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    flex: 1,
  },
  boxNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  boxLocation: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
    marginBottom: 8,
  },
  boxPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceUnit: {
    fontSize: 14,
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  locationLabel: {
    fontSize: 15,
    color: "#666666",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  openMapText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  detailsSection: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  qrContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  qrImage: {
    width: 180,
    height: 180,
  },
  barcodeContainer: {
    alignItems: "center",
  },
  barcodeImage: {
    width: "100%",
    height: 80,
    marginBottom: 8,
  },
  barcodeText: {
    fontSize: 13,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    letterSpacing: 1,
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
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_500Medium",
  },
});
