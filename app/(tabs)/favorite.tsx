import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
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

interface FavoriteItem {
  id: string;
  title: string;
  location: string;
  price: string;
  priceUnit: string;
  rating: string;
  image: string;
  badge?: string;
}

// Chuyển FAVORITE_ITEMS thành hàm nhận t() để dịch
const getFavoriteItems = (t: any): { [key: string]: FavoriteItem } => ({
  "horizon-1": {
    id: "horizon-1",
    title: "The Horizon Retreat",
    location: `${t("district_1")}, ${t("hcmc")}`,
    price: "$20",
    priceUnit: "/hour",
    rating: "4.5",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200",
  },
  "opal-grove-1": {
    id: "opal-grove-1",
    title: "Opal Grove",
    location: `${t("district_7")}, ${t("hcmc")}`,
    price: "$25",
    priceUnit: "/hour",
    rating: "4.3",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200",
  },
  "urban-oasis-1": {
    id: "urban-oasis-1",
    title: "Urban Oasis",
    location: `${t("binh_thanh_dist")}, ${t("hcmc")}`,
    price: "$18",
    priceUnit: "/hour",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200",
  },
  "serenity-sands-1": {
    id: "serenity-sands-1",
    title: "Serenity Sands",
    location: `${t("thu_duc_city")}, ${t("hcmc")}`,
    price: "$15",
    priceUnit: "/hr",
    rating: "4.0",
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=200",
  },
  "skyline-nook-1": {
    id: "skyline-nook-1",
    title: "Skyline Nook",
    location: `${t("thu_duc_city")}, ${t("hcmc")}`,
    price: "$22",
    priceUnit: "/hour",
    rating: "4.6",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200",
  },
  "green-haven-1": {
    id: "green-haven-1",
    title: "Green Haven",
    location: `${t("district_7")}, ${t("hcmc")}`,
    price: "$30",
    priceUnit: "/hour",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=200",
  },
});

export default function FavoriteScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  // Lấy data đã dịch
  const FAVORITE_ITEMS = getFavoriteItems(t);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [favorites, setFavorites] = useState<string[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem("favorites");
      if (saved) {
        setFavorites(JSON.parse(saved));
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const removeFavorite = async (itemId: string) => {
    try {
      const updated = favorites.filter((id) => id !== itemId);
      setFavorites(updated);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  // --- Theme Styles ---
  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card, borderColor: colors.border },
    headerTitle: { color: colors.text },
    filterButton: { backgroundColor: isDarkMode ? "#1F1F1F" : "#F5F5F5" },
    icon: { color: colors.text },
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

  const favoriteItems = favorites
    .map((id) => FAVORITE_ITEMS[id])
    .filter((item) => item !== undefined);

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, themeStyles.headerTitle]}>
          {t("my_favorites", "My Favorites")}
        </Text>
        <TouchableOpacity
          style={[styles.filterButton, themeStyles.filterButton]}
        >
          <Text style={[styles.filterIcon, themeStyles.icon]}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {favoriteItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            {/* Thay emoji tim bằng Ionicons */}
            <Ionicons
              name="heart-circle-outline"
              size={80}
              color={themeStyles.subText.color}
              style={{ marginBottom: 16, opacity: 0.5 }}
            />
            <Text style={[styles.emptyText, themeStyles.text]}>
              {t("no_favorites_yet", "No favorites yet")}
            </Text>
            <Text style={[styles.emptySubtext, themeStyles.subText]}>
              {t(
                "start_adding_favorites",
                "Start adding your favorite boxes to see them here",
              )}
            </Text>
          </View>
        ) : (
          <View style={styles.itemsContainer}>
            {favoriteItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.favoriteCard, themeStyles.card]}
                activeOpacity={0.8}
                onPress={() => router.push("/detail")}
              >
                <Image source={{ uri: item.image }} style={styles.cardImage} />
                <View style={styles.cardContent}>
                  {item.badge && (
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  )}
                  <Text style={[styles.cardTitle, themeStyles.text]}>
                    {item.title}
                  </Text>
                  <View style={styles.locationRow}>
                    <Text style={[styles.locationIcon, themeStyles.subText]}>
                      📍
                    </Text>
                    <Text style={[styles.locationText, themeStyles.subText]}>
                      {item.location}
                    </Text>
                  </View>
                  <View style={styles.cardFooter}>
                    <Text style={styles.price}>
                      {item.price}
                      <Text style={styles.priceUnit}>{item.priceUnit}</Text>
                    </Text>
                    <View style={styles.rating}>
                      {/* Thay emoji sao bằng Ionicons */}
                      <Ionicons
                        name="star"
                        size={14}
                        color="#FFD700"
                        style={{ marginRight: 4 }}
                      />
                      <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFavorite(item.id)}
                >
                  {/* Thay emoji tim xóa bằng Ionicons */}
                  <Ionicons name="heart" size={24} color="#FF4444" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIcon: {
    fontSize: 20,
  },
  scrollView: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "Poppins_700Bold",
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Poppins_400Regular",
  },
  itemsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  favoriteCard: {
    flexDirection: "row",
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    position: "relative",
  },
  cardImage: {
    width: 120,
    height: 120,
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  badgeText: {
    fontSize: 11,
    color: "#F97316",
    fontWeight: "700",
    marginBottom: 4,
    fontFamily: "Poppins_700Bold",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
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
    fontSize: 12,
    fontFamily: "Poppins_400Regular",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
    fontFamily: "Poppins_700Bold",
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: "400",
    color: "#4285F4",
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#F97316",
    fontFamily: "Poppins_700Bold",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
