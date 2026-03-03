import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

// --- 1. MOCK DATA & HELPER FUNCTIONS ---
interface BoxItem {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  badge?: string;
  type: "popular" | "recommended";
}

// Chuyển MOCK_DATA thành hàm nhận t() để dịch
const getMockData = (t: any): BoxItem[] => [
  {
    id: "horizon-1",
    title: "The Horizon Retreat",
    location: `${t("district_1")}, ${t("hcmc")}`,
    price: 20,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    type: "popular",
  },
  {
    id: "opal-grove-1",
    title: "Opal Grove",
    location: `${t("district_7")}, ${t("hcmc")}`,
    price: 25,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
    type: "popular",
  },
  {
    id: "serenity-sands-1",
    title: "Serenity Sands",
    location: `${t("thu_duc_city")}, ${t("hcmc")}`,
    price: 15,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
    type: "recommended",
  },
  {
    id: "urban-oasis-1",
    title: "Urban Oasis",
    location: `${t("binh_thanh_dist")}, ${t("hcmc")}`,
    price: 18,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400",
    type: "popular",
  },
  {
    id: "skyline-nook-1",
    title: "Skyline Nook",
    location: `${t("district_3")}, ${t("hcmc")}`,
    price: 22,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400",
    type: "recommended",
  },
  {
    id: "green-haven-1",
    title: "Green Haven",
    location: `${t("thu_duc_city")}, ${t("hcmc")}`,
    price: 30,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    type: "recommended",
  },
];

// Chuyển SUGGESTED_LOCATIONS thành hàm nhận t()
const getSuggestedLocations = (t: any) => [
  t("thu_duc_city"),
  t("district_1"),
  t("district_3"),
  t("district_4"),
  t("district_5"),
  t("district_6"),
  t("district_7"),
  t("district_8"),
  t("district_10"),
  t("district_11"),
  t("district_12"),
  t("phu_nhuan_dist"),
  t("binh_thanh_dist"),
  t("go_vap_dist"),
  t("tan_binh_dist"),
  t("binh_tan_dist"),
  t("tan_phu_dist"),
];

// --- 2. REUSABLE COMPONENTS ---

const BoxCard = ({
  item,
  isFavorited,
  onToggleFavorite,
}: {
  item: BoxItem;
  isFavorited: boolean;
  onToggleFavorite: () => void;
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      activeOpacity={0.8}
      onPress={() => router.push("/detail")}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={onToggleFavorite}
      >
        <Ionicons
          name={isFavorited ? "heart" : "heart-outline"}
          size={24}
          color={isFavorited ? "#FF4444" : "#FFFFFF"}
        />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardLocation}>{item.location}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>
            ${item.price}
            <Text style={styles.priceUnit}>/hour</Text>
          </Text>
          <View style={styles.cardRating}>
            <Ionicons
              name="star"
              size={12}
              color="#FFD700"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.cardRatingText}>{item.rating}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// --- 3. MAIN SCREEN ---

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  // Khởi tạo data động
  const mockData = getMockData(t);
  const suggestedLocations = getSuggestedLocations(t);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem("favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  };

  const toggleFavorite = async (itemId: string) => {
    try {
      let updated = [...favorites];
      if (updated.includes(itemId)) {
        updated = updated.filter((id) => id !== itemId);
      } else {
        updated = [...updated, itemId];
      }
      setFavorites(updated);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const isFavorited = (itemId: string) => favorites.includes(itemId);

  const handleLocationSelect = (location: string) => {
    setSearchModalVisible(false);
    console.log("Selected:", location);
    if (location === "Near Me") {
      router.push("/map");
    } else {
      router.push({ pathname: "/filter", params: { location } });
    }
  };

  // --- Theme Styles ---
  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    searchBar: { backgroundColor: isDarkMode ? "#1F1F1F" : "#F5F5F5" },
    icon: { color: colors.text },
    modalHeader: { borderBottomColor: colors.border },
    locationItem: { borderBottomColor: isDarkMode ? "#333" : "#F9F9F9" },
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
      {/* --- SEARCH MODAL (POPUP) --- */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isSearchModalVisible}
        onRequestClose={() => setSearchModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, themeStyles.container]}>
          {/* Modal Header */}
          <View style={[styles.modalHeader, themeStyles.modalHeader]}>
            <TouchableOpacity onPress={() => setSearchModalVisible(false)}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={[styles.modalSearchBar, themeStyles.searchBar]}>
              <Ionicons
                name="search"
                size={20}
                color={colors.subText}
                style={{ marginRight: 8 }}
              />
              <TextInput
                style={[styles.modalInput, { color: colors.text }]}
                placeholder={t("where_stay", "Where do you want to stay?")}
                placeholderTextColor={colors.subText}
                value={searchText}
                onChangeText={setSearchText}
                autoFocus={true}
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")}>
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={colors.subText}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Modal Content */}
          <ScrollView
            style={styles.modalContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Near Me Option */}
            <TouchableOpacity
              style={[styles.locationItem, themeStyles.locationItem]}
              onPress={() => handleLocationSelect("Near Me")}
            >
              <View style={[styles.locationIconContainer, styles.nearMeIcon]}>
                <Ionicons name="navigate" size={20} color="#FFFFFF" />
              </View>
              <View>
                <Text style={[styles.locationTitle, themeStyles.text]}>
                  {t("near_me", "Near me")}
                </Text>
                <Text style={[styles.locationSubtitle, themeStyles.subText]}>
                  {t(
                    "find_sleepboxes_around",
                    "Find boxes around your location",
                  )}
                </Text>
              </View>
            </TouchableOpacity>

            <Text style={[styles.suggestionTitle, themeStyles.text]}>
              {t("popular_destinations", "Popular Destinations")}
            </Text>

            {/* List Suggestions */}
            {suggestedLocations.map((loc, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.locationItem, themeStyles.locationItem]}
                onPress={() => handleLocationSelect(loc)}
              >
                <View
                  style={[styles.locationIconContainer, themeStyles.searchBar]}
                >
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.subText}
                  />
                </View>
                {/* Đã xóa chữ cứng Ho Chi Minh City, dùng t("hcmc") */}
                <Text style={[styles.locationText, themeStyles.text]}>
                  {loc}, {t("hcmc")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* --- HOME SCREEN HEADER --- */}
      <View style={[styles.header, themeStyles.container]}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />

        <TouchableOpacity
          style={[styles.headerSearchBar, themeStyles.searchBar]}
          onPress={() => setSearchModalVisible(true)}
          activeOpacity={0.9}
        >
          <Ionicons
            name="search"
            size={20}
            color={colors.subText}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.headerSearchText, themeStyles.subText]}>
            {t("find_sleepbox", "Find sleepbox...")}
          </Text>
        </TouchableOpacity>

        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/message")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/notifications")}
          >
            <View style={styles.notificationDot} />
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: 10 }} />

        {/* Most Popular Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>
              {t("most_popular", "Most Popular")}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                {t("see_all", "See All")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {/* Dùng mockData động thay vì MOCK_DATA tĩnh */}
            {mockData
              .filter((item) => item.type === "popular")
              .map((item) => (
                <BoxCard
                  key={item.id}
                  item={item}
                  isFavorited={isFavorited(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              ))}
          </ScrollView>
        </View>

        {/* Recommended Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>
              {t("recommended", "Recommended")}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                {t("see_all", "See All")}
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {/* Dùng mockData động */}
            {mockData
              .filter((item) => item.type === "recommended")
              .map((item) => (
                <BoxCard
                  key={item.id}
                  item={item}
                  isFavorited={isFavorited(item.id)}
                  onToggleFavorite={() => toggleFavorite(item.id)}
                />
              ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  // --- Header Styles ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },
  headerSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  headerSearchText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    backgroundColor: "#FF4444",
    borderRadius: 4,
    zIndex: 1,
  },
  // --- Modal Styles ---
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    gap: 12,
  },
  modalSearchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
  },
  modalInput: {
    flex: 1,
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  modalContent: {
    padding: 20,
  },
  suggestionTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  locationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  nearMeIcon: {
    backgroundColor: "#4285F4",
  },
  locationTitle: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
  },
  locationSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
  },
  locationText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
  },
  // --- Section Styles ---
  section: {
    marginBottom: 24,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
  },
  horizontalScroll: {
    paddingLeft: 20,
  },
  // --- Card Styles ---
  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F5F5F5",
    position: "relative",
    height: 200,
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  cardRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  cardRatingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "Poppins_700Bold",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    fontFamily: "Poppins_700Bold",
  },
  cardLocation: {
    fontSize: 12,
    color: "#EEEEEE",
    marginBottom: 4,
    fontFamily: "Poppins_400Regular",
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "Poppins_700Bold",
  },
  priceUnit: {
    fontSize: 14,
    fontWeight: "400",
  },
});
