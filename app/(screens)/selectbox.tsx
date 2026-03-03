import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
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

interface Box {
  id: string;
  number: string;
  status: "READY" | "BOOKED";
}

export default function SelectBoxScreen() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const boxes: Box[] = [
    { id: "1", number: "100", status: "READY" },
    { id: "2", number: "101", status: "READY" },
    { id: "3", number: "102", status: "BOOKED" },
    { id: "4", number: "103", status: "READY" },
    { id: "5", number: "104", status: "READY" },
    { id: "6", number: "105", status: "READY" },
    { id: "7", number: "106", status: "READY" },
    { id: "8", number: "107", status: "BOOKED" },
    { id: "9", number: "108", status: "READY" },
    { id: "10", number: "109", status: "BOOKED" },
    { id: "11", number: "110", status: "READY" },
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

  const handleBoxSelect = (box: Box) => {
    if (box.status === "READY") {
      router.push("/payment");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Your Box</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>AVAILABLE BOXES FOR YOUR TIME</Text>

        {/* Boxes Grid */}
        <View style={styles.grid}>
          {boxes.map((box, index) => {
            const isReady = box.status === "READY";
            const isLeftColumn = index % 2 === 0;

            return (
              <TouchableOpacity
                key={box.id}
                style={[
                  styles.boxCard,
                  isReady ? styles.boxCardReady : styles.boxCardBooked,
                  isLeftColumn ? styles.boxCardLeft : styles.boxCardRight,
                ]}
                onPress={() => handleBoxSelect(box)}
                activeOpacity={isReady ? 0.7 : 1}
                disabled={!isReady}
              >
                <Text style={[styles.boxNumber, !isReady && styles.boxNumberBooked]}>
                  #Box {box.number}
                </Text>
                <View
                  style={[
                    styles.statusBadge,
                    isReady ? styles.statusBadgeReady : styles.statusBadgeBooked,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isReady ? styles.statusTextReady : styles.statusTextBooked,
                    ]}
                  >
                    {box.status}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: 50 }} />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
    fontStyle: "italic",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 12,
    color: "#AAAAAA",
    fontFamily: "PlusJakartaSans_500Medium",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 20,
    fontStyle: "italic",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  boxCard: {
    width: "48%",
    aspectRatio: 1.6,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    justifyContent: "space-between",
  },
  boxCardReady: {
    backgroundColor: "#FFF9ED",
    borderWidth: 2,
    borderColor: "#8D613A",
  },
  boxCardBooked: {
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    opacity: 0.6,
  },
  boxCardLeft: {
    marginRight: "2%",
  },
  boxCardRight: {
    marginLeft: "2%",
  },
  boxNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  boxNumberBooked: {
    color: "#999999",
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadgeReady: {
    backgroundColor: "#10B981",
  },
  statusBadgeBooked: {
    backgroundColor: "#E5E5E5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 0.3,
  },
  statusTextReady: {
    color: "#FFFFFF",
  },
  statusTextBooked: {
    color: "#999999",
  },
});
