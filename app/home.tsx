import React from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import { router } from "expo-router";

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
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
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.userInfo}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.userName}>Trung Kien</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/filter")}>
              <Text style={styles.iconText}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.push("/notifications")}>
              <View style={styles.notificationDot} />
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Box */}
        <TouchableOpacity style={styles.searchBox} onPress={() => router.push("/map")}>
          <Text style={styles.searchIcon}>📍</Text>
          <Text style={styles.searchText}>Find a box near you...</Text>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>

        {/* Most Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Popular</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push("/detail")}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400" }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>The Horizon Retreat</Text>
                <Text style={styles.cardLocation}>District 1, HCMC</Text>
                <Text style={styles.cardPrice}>$20<Text style={styles.priceUnit}>/hour</Text></Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => router.push("/detail")}>
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400" }}
                style={styles.cardImage}
              />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>Opal Grove</Text>
                <Text style={styles.cardLocation}>District 7, HCMC</Text>
                <Text style={styles.cardPrice}>$25<Text style={styles.priceUnit}>/hour</Text></Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.recommendedCard} activeOpacity={0.8} onPress={() => router.push("/detail")}>
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200" }}
              style={styles.recommendedImage}
            />
            <View style={styles.recommendedContent}>
              <Text style={styles.badgeText}>SINGLE BOX</Text>
              <Text style={styles.recommendedTitle}>Serenity Sands</Text>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>Thu Duc City</Text>
              </View>
              <Text style={styles.recommendedPrice}>$15<Text style={styles.priceUnit}>/hr</Text></Text>
            </View>
            <View style={styles.ratingBadge}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.ratingText}>4.0</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIconActive}>🏠</Text>
          <Text style={styles.navTextActive}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("/booking")}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={styles.navText}>My Booking</Text>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "Poppins_400Regular",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "Poppins_700Bold",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  iconText: {
    fontSize: 22,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    backgroundColor: "#FF4444",
    borderRadius: 4,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F4FF",
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  searchText: {
    flex: 1,
    fontSize: 15,
    color: "#262626",
    fontFamily: "Poppins_400Regular",
  },
  arrowIcon: {
    fontSize: 28,
    color: "#4285F4",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "Poppins_700Bold",
  },
  seeAllText: {
    fontSize: 15,
    color: "#4285F4",
    fontFamily: "Poppins_600SemiBold",
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
  },
  cardImage: {
    width: "100%",
    height: 320,
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    fontFamily: "Poppins_700Bold",
  },
  cardLocation: {
    fontSize: 14,
    color: "#EEEEEE",
    marginBottom: 8,
    fontFamily: "Poppins_400Regular",
  },
  cardPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
  },
  priceUnit: {
    fontSize: 16,
    fontWeight: "400",
  },
  recommendedCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  recommendedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginRight: 16,
  },
  recommendedContent: {
    flex: 1,
  },
  badgeText: {
    fontSize: 11,
    color: "#F97316",
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "Poppins_700Bold",
  },
  recommendedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 4,
    fontFamily: "Poppins_700Bold",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  locationText: {
    fontSize: 13,
    color: "#888888",
    fontFamily: "Poppins_400Regular",
  },
  recommendedPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4285F4",
    fontFamily: "Poppins_700Bold",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    position: "absolute",
    top: 16,
    right: 16,
  },
  starIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#F97316",
    fontFamily: "Poppins_700Bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  navItem: {
    alignItems: "center",
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
    fontFamily: "Poppins_400Regular",
  },
  navTextActive: {
    fontSize: 12,
    color: "#4285F4",
    fontFamily: "Poppins_600SemiBold",
  },
});
