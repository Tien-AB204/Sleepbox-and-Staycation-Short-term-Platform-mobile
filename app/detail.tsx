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
import { ChatIcon } from "../components/Icons";

export default function DetailScreen() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [isFavorite, setIsFavorite] = useState(false);

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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800" }}
            style={styles.headerImage}
            resizeMode="cover"
          />
          
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Text style={styles.favoriteIcon}>{isFavorite ? "⭐" : "☆"}</Text>
          </TouchableOpacity>

          {/* Search Bar Overlay */}
          <View style={styles.searchBarOverlay} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title and Status */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>Studio Quiet Room</Text>
            <Text style={styles.status}>Available</Text>
          </View>

          {/* Location */}
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>123 Le Loi, District 1, HCMC</Text>
          </View>

          {/* Rating and Price Row */}
          <View style={styles.ratingPriceRow}>
            <View style={styles.ratingContainer}>
              <Text style={styles.stars}>⭐⭐⭐⭐⭐</Text>
              <Text style={styles.ratingScore}>4.8</Text>
              <Text style={styles.reviewCount}>(128 Reviews)</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>$20</Text>
              <Text style={styles.priceUnit}>/hour</Text>
            </View>
          </View>

          {/* House Rules */}
          <Text style={styles.sectionTitle}>House Rules</Text>
          <View style={styles.rulesContainer}>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleIcon}>🚭</Text>
              <Text style={styles.ruleText}>No smoking inside the box</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleIcon}>🔇</Text>
              <Text style={styles.ruleText}>Keep noise at a moderate level</Text>
            </View>
            <View style={styles.ruleRow}>
              <Text style={styles.ruleIcon}>🧼</Text>
              <Text style={styles.ruleText}>Clean up before checking out</Text>
            </View>
          </View>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesContainer}>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIcon}>
                <Text style={styles.amenityEmoji}>📶</Text>
              </View>
              <Text style={styles.amenityLabel}>Wifi</Text>
            </View>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIcon}>
                <Text style={styles.amenityEmoji}>❄️</Text>
              </View>
              <Text style={styles.amenityLabel}>Air Con</Text>
            </View>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIcon}>
                <Text style={styles.amenityEmoji}>💧</Text>
              </View>
              <Text style={styles.amenityLabel}>Water</Text>
            </View>
            <View style={styles.amenityItem}>
              <View style={styles.amenityIcon}>
                <Text style={styles.amenityEmoji}>🔌</Text>
              </View>
              <Text style={styles.amenityLabel}>Charging</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            A private, quiet workspace fully equipped with modern furniture and high-speed internet. Ideal for focus sessions.
          </Text>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.chatButton} onPress={() => router.push("/message")}>
          <Text style={styles.chatButtonText}>💬</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectButton} onPress={() => router.push("/selectbox")}>
          <Text style={styles.selectButtonText}>SELECT BOX</Text>
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
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    height: 280,
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 24,
    color: "#1A1A1A",
  },
  favoriteButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  searchBarOverlay: {
    position: "absolute",
    bottom: 40,
    left: "15%",
    right: "15%",
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
    flex: 1,
  },
  status: {
    fontSize: 16,
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontStyle: "italic",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  locationText: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  ratingPriceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    fontSize: 14,
    marginRight: 6,
  },
  ratingScore: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    marginRight: 6,
  },
  reviewCount: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 28,
    fontWeight: "700",
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceUnit: {
    fontSize: 16,
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 16,
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
  },
  rulesContainer: {
    marginBottom: 32,
  },
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  ruleIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  ruleText: {
    fontSize: 15,
    color: "#666666",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  amenitiesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  amenityItem: {
    alignItems: "center",
    width: "22%",
  },
  amenityIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#F5F5F5",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  amenityEmoji: {
    fontSize: 28,
  },
  amenityLabel: {
    fontSize: 13,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_500Medium",
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 15,
    color: "#666666",
    lineHeight: 24,
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  bottomActions: {
    flexDirection: "row",
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  chatButton: {
    width: 56,
    height: 56,
    backgroundColor: "#F5F5F5",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  chatButtonText: {
    fontSize: 24,
  },
  selectButton: {
    flex: 1,
    height: 56,
    backgroundColor: "#8D613A",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_700Bold",
    letterSpacing: 1,
  },
});
