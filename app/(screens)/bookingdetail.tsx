import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Ionicons } from "@expo/vector-icons"; // Thêm Ionicons
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next"; // Thêm i18n
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
import { useTheme } from "../../context/ThemeContext"; // Thêm Theme

export default function BookingDetailScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // Styles động theo Theme
  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card },
    border: { borderColor: isDarkMode ? "#444" : "#F0F0F0" },
    bottomNav: {
      backgroundColor: isDarkMode ? "#121212" : "#FFFFFF",
      borderTopColor: colors.border,
    },
    qrBg: { backgroundColor: isDarkMode ? "#FFFFFF" : "#F8F8F8" }, // Ép nền trắng cho QR để dễ quét
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={[styles.container, themeStyles.container]}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push("/booking")}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text]}>
          {t("booking_detail", "Booking Detail")}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ticket Container */}
        <View
          style={[styles.ticketContainer, { backgroundColor: colors.card }]}
        >
          {/* Box Information */}
          <View style={styles.boxSection}>
            <View style={[styles.imagePlaceholder, themeStyles.border]} />
            <View style={styles.boxInfo}>
              <View style={styles.titleRow}>
                <Text style={[styles.boxTitle, themeStyles.text]}>
                  Studio Quiet Room
                </Text>
                <Text style={[styles.boxNumber, { color: colors.primary }]}>
                  {t("box")} #104
                </Text>
              </View>
              {/* Dịch district */}
              <Text style={[styles.boxLocation, themeStyles.subText]}>
                {t("district_1")}, {t("hcmc")}
              </Text>
              <Text style={styles.boxPrice}>
                $20<Text style={styles.priceUnit}>/{t("night", "night")}</Text>
              </Text>
            </View>
          </View>

          {/* Location */}
          <View
            style={[styles.locationRow, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.locationLabel, themeStyles.subText]}>
              {t("location", "Location")}
            </Text>
            <TouchableOpacity>
              <Text style={styles.openMapText}>
                {t("open_map", "Open Map")}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Booking Details */}
          <View style={styles.detailsSection}>
            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, themeStyles.subText]}>
                📅 {t("check_in", "Check-in")}:
              </Text>
              <Text style={[styles.detailValue, themeStyles.text]}>
                9:00 Nov 12, 2024
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, themeStyles.subText]}>
                📅 {t("check_out", "Check-out")}:
              </Text>
              <Text style={[styles.detailValue, themeStyles.text]}>
                16:00 Nov 13, 2024
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={[styles.detailLabel, themeStyles.subText]}>
                👥 {t("total_price", "Total price")}:
              </Text>
              <Text style={[styles.detailValue, themeStyles.text]}>$20</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <View style={[styles.qrCode, themeStyles.qrBg]}>
              <Image
                source={{
                  uri: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=06158310-5427-471d",
                }}
                style={styles.qrImage}
              />
            </View>
          </View>

          {/* Barcode */}
          <View style={styles.barcodeContainer}>
            {/* Nếu đang dark mode, bạn có thể cần chỉnh URL barcode để ra barcode trắng đen, nhưng mặc định màu trắng cũng ok */}
            <View
              style={{
                backgroundColor: "#FFFFFF",
                padding: 8,
                borderRadius: 8,
              }}
            >
              <Image
                source={{
                  uri: "https://barcode.tec-it.com/barcode.ashx?data=06158310-5427-471d&code=Code128&translate-esc=on",
                }}
                style={styles.barcodeImage}
                resizeMode="contain"
              />
            </View>
            <Text
              style={[
                styles.barcodeText,
                themeStyles.subText,
                { marginTop: 8 },
              ]}
            >
              06158310-5427-471d
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation (Cứng bằng code) */}
      <View style={[styles.bottomNav, themeStyles.bottomNav]}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home-outline" size={24} color={colors.subText} />
          <Text style={[styles.navText, themeStyles.subText]}>
            {t("home", "Home")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/booking")}
        >
          <Ionicons name="calendar" size={24} color={colors.primary} />
          <Text style={[styles.navTextActive, { color: colors.primary }]}>
            {t("booking", "Booking")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/message")}
        >
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={colors.subText}
          />
          <Text style={[styles.navText, themeStyles.subText]}>
            {t("message", "Message")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person-outline" size={24} color={colors.subText} />
          <Text style={[styles.navText, themeStyles.subText]}>
            {t("profile", "Profile")}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  placeholder: { width: 40 },

  content: { flex: 1, paddingTop: 20 },
  ticketContainer: {
    marginHorizontal: 20,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#3B82F6",
    borderRadius: 16,
    padding: 20,
  },

  boxSection: { flexDirection: "row", marginBottom: 20 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  boxInfo: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    flex: 1,
  },
  boxNumber: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  boxLocation: {
    fontSize: 14,
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
  priceUnit: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },

  locationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  locationLabel: { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium" },
  openMapText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },

  detailsSection: { marginBottom: 30 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular" },
  detailValue: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
  },

  qrContainer: { alignItems: "center", marginBottom: 20 },
  qrCode: {
    width: 200,
    height: 200,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  qrImage: { width: 180, height: 180 },

  barcodeContainer: { alignItems: "center" },
  barcodeImage: { width: 250, height: 80 },
  barcodeText: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_400Regular",
    letterSpacing: 1,
  },

  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingTop: 12,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { fontSize: 12, fontFamily: "PlusJakartaSans_400Regular" },
  navTextActive: { fontSize: 12, fontFamily: "PlusJakartaSans_500Medium" },
});
