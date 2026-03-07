import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface BoxItem {
  id: string;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  type: "popular" | "recommended";
}

// MOCK DATA CHO PHẦN KHÁM PHÁ
interface ExploreItem {
  id: string;
  title: string;
  image: string;
  places: number;
}
const EXPLORE_DATA: ExploreItem[] = [
  {
    id: "e1",
    title: "Cắm trại Glamping",
    places: 124,
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400",
  },
  {
    id: "e2",
    title: "Staycation Cuối tuần",
    places: 86,
    image: "https://images.unsplash.com/photo-1542314831-c6a4d27ce006?w=400",
  },
  {
    id: "e3",
    title: "Gần biển Vũng Tàu",
    places: 42,
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400",
  },
];

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
];

const locationOptions = [
  "thu_duc_city",
  "district_1",
  "district_3",
  "district_4",
  "district_5",
  "district_6",
  "district_7",
];
const boxTypeOptions = [
  { id: "single", label: "Single" },
  { id: "double", label: "Double" },
];

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

export default function HomeScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();
  const mockData = getMockData(t);
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showBoxTypeModal, setShowBoxTypeModal] = useState(false);
  const [boxType, setBoxType] = useState<string | null>(null);

  // --- CALENDAR & TIME STATES ---
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [hasSelectedDate, setHasSelectedDate] = useState(false);
  const [isOvernight, setIsOvernight] = useState(false);

  const [fromTime, setFromTime] = useState<Date>(
    new Date(new Date().setHours(10, 0, 0, 0)),
  );
  const [toTime, setToTime] = useState<Date>(
    new Date(new Date().setHours(11, 30, 0, 0)),
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"from" | "to">("from");

  useFocusEffect(
    React.useCallback(() => {
      loadFavorites();
    }, []),
  );

  const loadFavorites = async () => {
    try {
      const saved = await AsyncStorage.getItem("favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch (error) {}
  };

  const toggleFavorite = async (itemId: string) => {
    try {
      let updated = [...favorites];
      if (updated.includes(itemId))
        updated = updated.filter((id) => id !== itemId);
      else updated = [...updated, itemId];
      setFavorites(updated);
      await AsyncStorage.setItem("favorites", JSON.stringify(updated));
    } catch (error) {}
  };

  const isFavorited = (itemId: string) => favorites.includes(itemId);
  const handleSearch = () => {
    setShowLocationDropdown(false);
    router.push("/searchresults");
  };

  // ==========================================
  // CÁC HÀM XỬ LÝ LỊCH VÀ GIỜ ĐƯỢC THÊM LẠI
  // ==========================================
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return {
      firstDay: new Date(year, month, 1).getDay(),
      daysInMonth: new Date(year, month + 1, 0).getDate(),
    };
  };

  const formatShortDate = (date: Date) => {
    const months = [
      t("jan"),
      t("feb"),
      t("mar"),
      t("apr"),
      t("may"),
      t("jun"),
      t("jul"),
      t("aug"),
      t("sep"),
      t("oct"),
      t("nov"),
      t("dec"),
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const getDisplayDateRange = () => {
    if (!selectedDate) return t("select_date", "Select Date");
    let display = formatShortDate(selectedDate);
    if (isOvernight) {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      display += ` - ${formatShortDate(nextDate)}`;
    }
    return display;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setSelectedDate(newDate);
    setHasSelectedDate(true);
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta),
    );
  };

  const openTimePicker = (mode: "from" | "to") => {
    setTimePickerMode(mode);
    setShowTimePicker(true);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selectedTime) {
      if (timePickerMode === "from") setFromTime(selectedTime);
      else setToTime(selectedTime);
    }
  };
  // ==========================================

  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card },
    searchCard: {
      backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
      borderColor: isDarkMode ? "#333" : "#EAEAEA",
    },
    dropdownBg: {
      backgroundColor: isDarkMode ? "#2C2C2C" : "#FFFFFF",
      borderColor: isDarkMode ? "#444" : "#EAEAEA",
    },
    border: { borderBottomColor: isDarkMode ? "#333" : "#F0F0F0" },
    modalBg: { backgroundColor: colors.card },
  };

  if (!fontsLoaded)
    return (
      <SafeAreaView style={[styles.container, themeStyles.container]}>
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* NỀN MỜ Ở PHẦN HEADER */}
      <View
        style={{ position: "absolute", top: 0, left: 0, right: 0, height: 350 }}
      >
        <LinearGradient
          colors={[
            isDarkMode ? "#332211" : "#F3E5D8",
            themeStyles.container.backgroundColor,
          ]}
          style={{ flex: 1 }}
        />
      </View>

      <View style={styles.header}>
        <Image
          source={{ uri: "https://i.pravatar.cc/150?img=12" }}
          style={styles.avatar}
        />
        <View style={styles.logoContainer}>
          <Text
            style={[
              styles.logoText,
              { color: isDarkMode ? "#FFFFFF" : "#613F24" },
            ]}
          >
            BOXHUB
          </Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.push("/message")}
          >
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={isDarkMode ? "#FFF" : "#613F24"}
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
              color={isDarkMode ? "#FFF" : "#613F24"}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* SEARCH CARD */}
        <View style={{ zIndex: 10, elevation: 10 }}>
          <View style={[styles.searchCardContainer, themeStyles.searchCard]}>
            <TouchableOpacity
              style={styles.searchCardRow}
              onPress={() => setShowLocationDropdown(!showLocationDropdown)}
              activeOpacity={0.7}
            >
              <Text style={styles.searchCardLabel}>
                {t("destination", "Điểm đến")}
              </Text>
              <View style={styles.searchCardValueRow}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={colors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={[
                    styles.searchCardValue,
                    themeStyles.text,
                    !selectedLocation && { color: colors.subText },
                  ]}
                >
                  {selectedLocation
                    ? t(selectedLocation)
                    : t("where_to_go", "Bạn muốn ở đâu?")}
                </Text>
                <Ionicons
                  name={showLocationDropdown ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.subText}
                />
              </View>
            </TouchableOpacity>

            {showLocationDropdown && (
              <View style={[styles.dropdownContainer, themeStyles.dropdownBg]}>
                <TouchableOpacity
                  style={[
                    styles.listOption,
                    themeStyles.border,
                    { paddingHorizontal: 16 },
                  ]}
                  onPress={() => {
                    setShowLocationDropdown(false);
                    router.push("/map");
                  }}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Ionicons
                      name="navigate-circle"
                      size={24}
                      color="#4285F4"
                      style={{ marginRight: 8 }}
                    />
                    <Text
                      style={[
                        styles.listText,
                        themeStyles.text,
                        { fontFamily: "PlusJakartaSans_600SemiBold" },
                      ]}
                    >
                      {t("near_me", "Gần tôi")}
                    </Text>
                  </View>
                </TouchableOpacity>
                <ScrollView
                  style={{ maxHeight: 200 }}
                  nestedScrollEnabled={true}
                >
                  {locationOptions.map((loc, index) => (
                    <TouchableOpacity
                      key={loc}
                      style={[
                        styles.listOption,
                        index !== locationOptions.length - 1 &&
                          themeStyles.border,
                        { paddingHorizontal: 16 },
                      ]}
                      onPress={() => {
                        setSelectedLocation(loc);
                        setShowLocationDropdown(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.listText,
                          themeStyles.text,
                          selectedLocation === loc && {
                            color: colors.primary,
                            fontFamily: "PlusJakartaSans_600SemiBold",
                          },
                        ]}
                      >
                        {t(loc)}
                      </Text>
                      {selectedLocation === loc && (
                        <Ionicons
                          name="checkmark-circle"
                          size={24}
                          color={colors.primary}
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.horizontalLine, themeStyles.border]} />

            <View style={styles.searchCardSplitRow}>
              <TouchableOpacity
                style={styles.searchCardHalf}
                onPress={() => {
                  setShowLocationDropdown(false);
                  setShowCalendar(true);
                }}
              >
                <Text style={styles.searchCardLabel}>
                  {t("time_range", "Thời gian")}
                </Text>
                <Text
                  style={[
                    styles.searchCardValueSplit,
                    themeStyles.text,
                    !selectedDate && { color: colors.subText },
                  ]}
                >
                  {getDisplayDateRange()}
                </Text>
              </TouchableOpacity>
              <View style={[styles.verticalLine, themeStyles.border]} />
              <TouchableOpacity
                style={styles.searchCardHalf}
                onPress={() => {
                  setShowLocationDropdown(false);
                  setShowBoxTypeModal(true);
                }}
              >
                <Text style={styles.searchCardLabel}>
                  {t("box_type", "Loại phòng")}
                </Text>
                <Text
                  style={[
                    styles.searchCardValueSplit,
                    themeStyles.text,
                    !boxType && { color: colors.subText },
                  ]}
                >
                  {boxType ? t(boxType) : t("select_box_type", "Chọn phòng")}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.searchButton, { backgroundColor: colors.primary }]}
              onPress={handleSearch}
            >
              <Text style={styles.searchButtonText}>
                {t("search", "Tìm kiếm")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* MOST POPULAR SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>
              {t("most_popular", "Nổi bật nhất")}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                {t("see_all", "Xem tất cả")}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
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

        {/* RECOMMENDED SECTION */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>
              {t("recommended", "Đề xuất cho bạn")}
            </Text>
            <TouchableOpacity>
              <Text style={[styles.seeAllText, { color: colors.primary }]}>
                {t("see_all", "Xem tất cả")}
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
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

        {/* PHẦN MỚI THÊM: KHÁM PHÁ (EXPLORE) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, themeStyles.text]}>
              {t("explore", "Khám phá thế giới")}
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.horizontalScroll}
          >
            {EXPLORE_DATA.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.exploreCard, themeStyles.card]}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.exploreImage}
                />
                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.exploreGradient}
                >
                  <Text style={styles.exploreTitle}>{item.title}</Text>
                  <Text style={styles.exploreSubtitle}>
                    {item.places} địa điểm
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- MODALS --- */}
      {/* Box Type Modal */}
      <Modal
        visible={showBoxTypeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBoxTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalBgWrapper}
          activeOpacity={1}
          onPress={() => setShowBoxTypeModal(false)}
        >
          <View style={[styles.miniModal, themeStyles.card]}>
            <Text style={[styles.miniModalTitle, themeStyles.text]}>
              {t("select_box_type", "Loại Phòng")}
            </Text>
            {boxTypeOptions.map((option, index) => {
              const isLast = index === boxTypeOptions.length - 1;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.listOption, !isLast && themeStyles.border]}
                  onPress={() => {
                    setBoxType(option.label);
                    setShowBoxTypeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.listText,
                      themeStyles.text,
                      boxType === option.label && {
                        color: colors.primary,
                        fontFamily: "PlusJakartaSans_600SemiBold",
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {boxType === option.label && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Calendar Modal */}
      <Modal visible={showCalendar} animationType="slide" transparent={true}>
        <View style={styles.modalBgWrapper}>
          <View style={[styles.calendarModal, themeStyles.modalBg]}>
            <View style={[styles.modalTopHeader, themeStyles.border]}>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={{ padding: 4 }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTopTitle, themeStyles.text]}>
                {t("select_time", "Chọn thời gian")}
              </Text>
              <View style={{ width: 32 }} />
            </View>

            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
              <Text style={[styles.monthYear, themeStyles.text]}>
                {currentMonth.toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.weekDays, themeStyles.border]}>
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                <Text key={day} style={[styles.weekDay, themeStyles.subText]}>
                  {t(`day_${day.toLowerCase()}`, day)}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {(() => {
                const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
                const days = [];
                for (let i = 0; i < firstDay; i++)
                  days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
                for (let day = 1; day <= daysInMonth; day++) {
                  const currentDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day,
                  );
                  let isSelected = false,
                    isNextDaySelected = false;
                  if (selectedDate) {
                    isSelected =
                      currentDate.getDate() === selectedDate.getDate() &&
                      currentDate.getMonth() === selectedDate.getMonth() &&
                      currentDate.getFullYear() === selectedDate.getFullYear();
                    if (isOvernight) {
                      const nextDate = new Date(selectedDate);
                      nextDate.setDate(nextDate.getDate() + 1);
                      isNextDaySelected =
                        currentDate.getDate() === nextDate.getDate() &&
                        currentDate.getMonth() === nextDate.getMonth() &&
                        currentDate.getFullYear() === nextDate.getFullYear();
                    }
                  }
                  const isHighlighted = isSelected || isNextDaySelected;
                  days.push(
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCell,
                        isHighlighted && styles.selectedDay,
                        isHighlighted && { backgroundColor: colors.primary },
                      ]}
                      onPress={() => handleDateSelect(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          themeStyles.text,
                          isHighlighted && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>,
                  );
                }
                return days;
              })()}
            </View>

            {hasSelectedDate && (
              <View
                style={[
                  styles.timeSection,
                  themeStyles.border,
                  { borderTopWidth: 1, paddingTop: 16 },
                ]}
              >
                <View
                  style={[
                    styles.overnightRow,
                    {
                      marginBottom: 16,
                      paddingBottom: 16,
                      borderBottomWidth: 1,
                    },
                    themeStyles.border,
                  ]}
                >
                  <Text style={[styles.overnightText, themeStyles.text]}>
                    {t("stay_overnight", "Ở qua đêm")}
                  </Text>
                  <Switch
                    value={isOvernight}
                    onValueChange={setIsOvernight}
                    trackColor={{
                      false: isDarkMode ? "#555" : "#E5E5E5",
                      true: colors.primary,
                    }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <View style={styles.timeRow}>
                  <Text style={[styles.timeLabel, { color: colors.primary }]}>
                    {t("from", "TỪ")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.timePickerButton,
                      { borderColor: isDarkMode ? "#333" : "#EAEAEA" },
                    ]}
                    onPress={() => openTimePicker("from")}
                  >
                    <Text style={[styles.timeDisplay, themeStyles.text]}>
                      {formatTime(fromTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.timeRow}>
                  <Text style={[styles.timeLabel, { color: colors.primary }]}>
                    {t("to", "ĐẾN")}
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.timePickerButton,
                      { borderColor: isDarkMode ? "#333" : "#EAEAEA" },
                    ]}
                    onPress={() => openTimePicker("to")}
                  >
                    <Text style={[styles.timeDisplay, themeStyles.text]}>
                      {formatTime(toTime)}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: hasSelectedDate
                    ? colors.primary
                    : colors.subText,
                },
              ]}
              disabled={!hasSelectedDate}
              onPress={() => setShowCalendar(false)}
            >
              <Text style={styles.confirmButtonText}>
                {t("confirm_date_time", "Xác nhận Ngày & Giờ")}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={timePickerMode === "from" ? fromTime : toTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={onTimeChange}
                textColor={colors.text}
              />
            )}
            {showTimePicker && Platform.OS === "ios" && (
              <TouchableOpacity
                style={{
                  alignItems: "flex-end",
                  marginTop: -10,
                  marginBottom: 10,
                }}
                onPress={() => setShowTimePicker(false)}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontFamily: "PlusJakartaSans_600SemiBold",
                  }}
                >
                  Done
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollView: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  logoContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  logoText: {
    fontSize: 26,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    letterSpacing: -0.5,
  },
  headerIcons: { flexDirection: "row", gap: 8 },
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

  searchCardContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 24,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 6,
  },
  searchCardRow: { padding: 16, paddingBottom: 12 },
  searchCardLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#888",
    marginBottom: 6,
  },
  searchCardValueRow: { flexDirection: "row", alignItems: "center" },
  searchCardValue: {
    fontSize: 17,
    fontFamily: "PlusJakartaSans_600SemiBold",
    flex: 1,
  },
  horizontalLine: { height: 1, marginHorizontal: 16, borderBottomWidth: 1 },

  dropdownContainer: {
    position: "absolute",
    top: 74,
    left: 8,
    right: 8,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 20,
    zIndex: 999,
    overflow: "hidden",
  },
  searchCardSplitRow: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    zIndex: 1,
  },
  searchCardHalf: { flex: 1, padding: 16 },
  searchCardValueSplit: {
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  verticalLine: { width: 1, height: "60%", borderLeftWidth: 1 },
  searchButton: {
    margin: 12,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },

  section: { marginBottom: 28, marginTop: 10 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold" },
  seeAllText: { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" },
  horizontalScroll: { paddingLeft: 20 },

  card: {
    width: 280,
    marginRight: 16,
    borderRadius: 20,
    overflow: "hidden",
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
  cardImage: { width: "100%", height: "100%" },
  cardContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
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
    color: "#262626",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  cardTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 2,
    fontFamily: "PlusJakartaSans_700Bold",
  },
  cardLocation: {
    fontSize: 12,
    color: "#EEEEEE",
    marginBottom: 4,
    fontFamily: "PlusJakartaSans_400Regular",
  },
  cardPrice: {
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceUnit: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },

  // Explore Styles
  exploreCard: {
    width: 140,
    height: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  exploreImage: { width: "100%", height: "100%" },
  exploreGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "60%",
    justifyContent: "flex-end",
    padding: 12,
  },
  exploreTitle: {
    color: "#FFF",
    fontSize: 15,
    fontFamily: "PlusJakartaSans_600SemiBold",
    marginBottom: 2,
  },
  exploreSubtitle: {
    color: "#EEE",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_400Regular",
  },

  modalBgWrapper: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  miniModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  miniModalTitle: {
    fontSize: 20,
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
  },
  listText: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },

  calendarModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: "90%",
  },
  modalTopHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    marginBottom: 20,
    borderBottomWidth: 1,
  },
  modalTopTitle: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold" },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  monthYear: { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold" },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
  },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 8 },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  selectedDay: { borderRadius: 50 },
  dayText: { fontSize: 16, fontFamily: "PlusJakartaSans_400Regular" },
  selectedDayText: {
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  timeSection: { marginBottom: 24 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timeLabel: { fontSize: 14, fontFamily: "PlusJakartaSans_600SemiBold" },
  timePickerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  timeDisplay: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold" },
  overnightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  overnightText: { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium" },
  confirmButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
  },
});
