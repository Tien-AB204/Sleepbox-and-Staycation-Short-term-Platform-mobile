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

export default function PaymentScreen() {
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
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Box Information */}
        <View style={styles.boxInfoCard}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400" }}
            style={styles.boxImage}
          />
          <View style={styles.boxInfo}>
            <Text style={styles.boxTitle}>The Aston Vill Box</Text>
            <Text style={styles.boxLocation}>📍 Thu Duc, HCMC</Text>
            <Text style={styles.boxRating}>⭐ 4.7</Text>
            <Text style={styles.boxPrice}>$120<Text style={styles.priceUnit}>/night</Text></Text>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>YOUR BOOKING DETAILS</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Check-in</Text>
            <Text style={styles.detailValue}>9:00 Nov 12, 2024</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Check-out</Text>
            <Text style={styles.detailValue}>16:00 Nov 13, 2024</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>👥 Guest</Text>
            <Text style={styles.detailValue}>1 Adult</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📦 Box type</Text>
            <Text style={styles.detailValueBlue}>Single Box</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📞 Phone</Text>
            <Text style={styles.detailValue}>0214345646</Text>
          </View>
        </View>

        {/* Price Details */}
        <View style={styles.priceCard}>
          <Text style={styles.sectionTitle}>PRICE DETAILS</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Price</Text>
            <Text style={styles.priceValue}>$139.00</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Service fee</Text>
            <Text style={styles.priceValue}>$2.50</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total price</Text>
            <Text style={styles.totalValue}>$141.50</Text>
          </View>
        </View>

        {/* Promo Code */}
        <TouchableOpacity style={styles.promoButton}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoIcon}>🎟️</Text>
            <Text style={styles.promoText}>Select Promo Code</Text>
          </View>
          <Text style={styles.promoArrow}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.paymentButton} onPress={() => router.push("/paymentmethod")}>
          <Text style={styles.paymentButtonText}>Select Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
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
  boxInfoCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  boxImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 16,
  },
  boxInfo: {
    flex: 1,
    justifyContent: "center",
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
    marginBottom: 4,
  },
  boxLocation: {
    fontSize: 13,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    marginBottom: 4,
  },
  boxRating: {
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_500Medium",
    marginBottom: 6,
  },
  boxPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceUnit: {
    fontSize: 14,
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  detailsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priceCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: "#AAAAAA",
    fontFamily: "PlusJakartaSans_600SemiBold",
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
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
  detailValueBlue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  priceValue: {
    fontSize: 15,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  promoButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  promoLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  promoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  promoArrow: {
    fontSize: 28,
    color: "#999999",
  },
  bottomContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  paymentButton: {
    backgroundColor: "#8D613A",
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  paymentButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_700Bold",
  },
});
