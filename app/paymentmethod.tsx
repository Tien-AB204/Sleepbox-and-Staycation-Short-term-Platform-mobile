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

type PaymentMethod = "vnpay" | "momo";

export default function PaymentMethodScreen() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("vnpay");

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#8D613A" />
        </View>
      </SafeAreaView>
    );
  }

  const handleConfirm = () => {
    console.log("Selected payment method:", selectedMethod);
    // Navigate to booking detail screen
    router.push("/bookingdetail");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.headerTitle}>Payment Method</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>CHOOSE YOUR WALLET</Text>

        {/* VNPay Option */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === "vnpay" && styles.paymentCardSelected,
          ]}
          onPress={() => setSelectedMethod("vnpay")}
          activeOpacity={0.7}
        >
          <View style={styles.paymentInfo}>
            <View style={styles.logoContainer}>
              <Image
                source={{ uri: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-VNPAY-QR-1.png" }}
                style={styles.vnpayLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.paymentName}>VNPay</Text>
          </View>
          <View
            style={[
              styles.radioButton,
              selectedMethod === "vnpay" && styles.radioButtonSelected,
            ]}
          >
            {selectedMethod === "vnpay" && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>

        {/* MoMo Option */}
        <TouchableOpacity
          style={[
            styles.paymentCard,
            selectedMethod === "momo" && styles.paymentCardSelected,
          ]}
          onPress={() => setSelectedMethod("momo")}
          activeOpacity={0.7}
        >
          <View style={styles.paymentInfo}>
            <View style={[styles.logoContainer, styles.momoLogoContainer]}>
              <Image
                source={{ uri: "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png" }}
                style={styles.momoLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.paymentName}>MoMo</Text>
          </View>
          <View
            style={[
              styles.radioButton,
              selectedMethod === "momo" && styles.radioButtonSelected,
            ]}
          >
            {selectedMethod === "momo" && <View style={styles.radioButtonInner} />}
          </View>
        </TouchableOpacity>

        <View style={{ height: 400 }} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
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
  content: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  subtitle: {
    fontSize: 12,
    color: "#AAAAAA",
    fontFamily: "PlusJakartaSans_500Medium",
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  paymentCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  paymentCardSelected: {
    borderColor: "#3B82F6",
    backgroundColor: "#F0F7FF",
  },
  paymentInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  logoContainer: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  momoLogoContainer: {
    backgroundColor: "#A50064",
  },
  vnpayLogo: {
    width: 45,
    height: 45,
  },
  momoLogo: {
    width: 40,
    height: 40,
  },
  paymentName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "#3B82F6",
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#3B82F6",
  },
  bottomContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  confirmButton: {
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
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_700Bold",
  },
});
