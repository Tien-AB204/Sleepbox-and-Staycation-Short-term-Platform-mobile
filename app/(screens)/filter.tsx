import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";

export default function FilterScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [priceRange, setPriceRange] = useState([10, 100]);
  const [selectedAmenities, setSelectedAmenities] = useState([
    "High-speed wifi",
  ]);

  // --- States for Calendar ---
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8)); // September 2026

  // 3. Chỉnh lại chỉ chọn 1 ngày
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // 3. Ẩn hiện Time Range: State để kiểm tra xem đã chọn ngày chưa
  const [hasSelectedDate, setHasSelectedDate] = useState(false);

  const [fromTime, setFromTime] = useState("10:00 AM");
  const [toTime, setToTime] = useState("11:30 AM");

  // 3. Thêm state cho nút Ở qua đêm
  const [isOvernight, setIsOvernight] = useState(false);

  // --- States for Box Type ---
  const [showBoxTypeModal, setShowBoxTypeModal] = useState(false);
  const [boxType, setBoxType] = useState<string | null>(null); // Null để hiện placeholder ban đầu

  // 1. Chỉ giữ lại Single và Double
  const boxTypeOptions = [
    { id: "single", label: "Single" },
    { id: "double", label: "Double" },
  ];

  // --- States for Destination (Location) ---
  // 2. Thêm modal chọn quận
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Danh sách các quận (giống trang Home)
  const locationOptions = [
    "district_1",
    "district_3",
    "district_4",
    "district_5",
    "district_6",
    "district_7",
    "district_8",
    "district_10",
    "district_11",
    "district_12",
    "thu_duc_city",
    "phu_nhuan_dist",
    "binh_thanh_dist",
    "go_vap_dist",
    "tan_binh_dist",
    "binh_tan_dist",
    "tan_phu_dist",
  ];

  const amenitiesList = [
    "High-speed wifi",
    "Drink bar",
    "Camera 24/7",
    "Auto check-in",
  ];

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleReset = () => {
    setPriceRange([10, 100]);
    setSelectedAmenities(["High-speed wifi"]);
    setBoxType(null);
    setSelectedLocation(null);
    setSelectedDate(null);
    setHasSelectedDate(false);
    setIsOvernight(false);
  };

  const handleSearch = () => {
    console.log("Searching with filters:", {
      location: selectedLocation,
      date: selectedDate,
      time: { from: fromTime, to: toTime, isOvernight },
      boxType,
      priceRange,
      amenities: selectedAmenities,
    });
    router.back();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    const days = [
      t("sun"),
      t("mon"),
      t("tue"),
      t("wed"),
      t("thu"),
      t("fri"),
      t("sat"),
    ];
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
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]}`;
  };

  // 3. Logic chọn 1 ngày
  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day,
    );
    setSelectedDate(newDate);
    setHasSelectedDate(true); // Đánh dấu đã chọn ngày để hiện phần Time Range
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta),
    );
  };

  const confirmDateTime = () => {
    setShowCalendar(false);
  };

  // Mở modal lịch và reset state hasSelectedDate nếu chưa có ngày nào được chọn
  const openCalendar = () => {
    if (!selectedDate) {
      setHasSelectedDate(false);
    } else {
      setHasSelectedDate(true);
    }
    setShowCalendar(true);
  };

  // Styles động theo Theme
  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card },
    border: { borderBottomColor: colors.border },
    header: { borderBottomColor: colors.border },
    iconBg: { backgroundColor: isDarkMode ? "#333" : "#FFFFFF" },
    footer: {
      backgroundColor: colors.background,
      borderTopColor: colors.border,
    },
    modalBg: { backgroundColor: colors.card },
    chipBorder: { borderColor: isDarkMode ? "#444" : "#E5E5E5" },
    chipBg: { backgroundColor: isDarkMode ? "#1A1A1A" : "#FAFAFA" },
    chipText: { color: isDarkMode ? "#999" : "#AAAAAA" },
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
      <View style={[styles.header, themeStyles.header]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.closeButton}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, themeStyles.text]}>
          {t("filter", "Filter")}
        </Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={[styles.resetText, { color: colors.primary }]}>
            {t("reset", "Reset")}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Destination - 2. Bấm vào hiện modal chọn quận */}
        <TouchableOpacity
          style={[styles.filterCard, themeStyles.card]}
          onPress={() => setShowLocationModal(true)}
        >
          <View style={[styles.iconContainer, themeStyles.iconBg]}>
            <Ionicons name="location" size={24} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, themeStyles.subText]}>
              {t("destination", "DESTINATION")}
            </Text>
            <Text
              style={[
                styles.cardValue,
                themeStyles.text,
                !selectedLocation && { color: colors.subText },
              ]}
            >
              {selectedLocation
                ? t(selectedLocation)
                : t("select_destination", "Select Destination")}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Time Range - Mở modal lịch */}
        <TouchableOpacity
          style={[styles.filterCard, themeStyles.card]}
          onPress={openCalendar}
        >
          <View style={[styles.iconContainer, themeStyles.iconBg]}>
            <Ionicons name="calendar" size={24} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, themeStyles.subText]}>
              {t("time_range", "TIME RANGE")}
            </Text>
            <Text
              style={[
                styles.cardValue,
                themeStyles.text,
                !selectedDate && { color: colors.subText },
              ]}
            >
              {/* Chỉ hiển thị ngày đã chọn trên thẻ */}
              {selectedDate
                ? formatDate(selectedDate).split(",")[0]
                : t("select_date", "Select Date")}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Box Type - Mở Modal chọn phòng */}
        <TouchableOpacity
          style={[styles.filterCard, themeStyles.card]}
          onPress={() => setShowBoxTypeModal(true)}
        >
          <View style={[styles.iconContainer, themeStyles.iconBg]}>
            <Ionicons name="cube" size={24} color={colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={[styles.cardLabel, themeStyles.subText]}>
              {t("box_type", "BOX TYPE")}
            </Text>
            <Text
              style={[
                styles.cardValue,
                themeStyles.text,
                !boxType && { color: colors.subText },
              ]}
            >
              {boxType
                ? t(
                    boxType,
                    boxTypeOptions.find((opt) => opt.id === boxType)?.label ||
                      "",
                  )
                : t("select_box_type", "Select Box Type")}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Price Range */}
        <View style={styles.priceSection}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>
            {t("price_range", "Price Range (per hour)")}
          </Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
              step={5}
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([priceRange[0], value])}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={isDarkMode ? "#555" : "#E5E5E5"}
              thumbTintColor={colors.primary}
            />
          </View>
          <View style={styles.priceLabels}>
            <Text style={[styles.priceLabel, themeStyles.text]}>
              ${priceRange[0]}
            </Text>
            <Text style={[styles.priceLabel, themeStyles.text]}>
              ${priceRange[1]}
            </Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesSection}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>
            {t("amenities", "Amenities")}
          </Text>
          <View style={styles.amenitiesGrid}>
            {amenitiesList.map((amenity, index) => {
              const isSelected = selectedAmenities.includes(amenity);
              return (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.amenityChip,
                    themeStyles.chipBorder,
                    themeStyles.chipBg,
                    isSelected && [
                      styles.amenityChipSelected,
                      {
                        borderColor: colors.primary,
                        backgroundColor: isDarkMode ? "#332211" : "#FFF5E6",
                      },
                    ],
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={colors.primary}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.amenityText,
                      themeStyles.chipText,
                      isSelected && [
                        styles.amenityTextSelected,
                        { color: colors.primary },
                      ],
                    ]}
                  >
                    {t(amenity.toLowerCase().replace(/[\s-]/g, "_"), amenity)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Search Button */}
      <View style={[styles.footer, themeStyles.footer]}>
        <TouchableOpacity
          style={[styles.searchButton, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>
            {t("search_available", "SEARCH AVAILABLE FACILITIES")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* --- 2. MODAL CHỌN ĐỊA ĐIỂM (QUẬN) --- */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLocationModal(false)}
        >
          <View style={[styles.listModal, themeStyles.modalBg]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>
              {t("select_destination", "Select Destination")}
            </Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 400 }}
            >
              {locationOptions.map((loc, index) => {
                const isLast = index === locationOptions.length - 1;
                return (
                  <TouchableOpacity
                    key={loc}
                    style={[styles.listOption, !isLast && themeStyles.border]}
                    onPress={() => {
                      setSelectedLocation(loc);
                      setShowLocationModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.listText,
                        themeStyles.text,
                        selectedLocation === loc && {
                          color: colors.primary,
                          fontFamily: "Poppins_600SemiBold",
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
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* --- 1. MODAL CHỌN BOX TYPE --- */}
      <Modal
        visible={showBoxTypeModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowBoxTypeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBoxTypeModal(false)}
        >
          <View style={[styles.listModal, themeStyles.modalBg]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>
              {t("select_box_type", "Select Box Type")}
            </Text>

            {boxTypeOptions.map((option, index) => {
              const isLast = index === boxTypeOptions.length - 1;
              return (
                <TouchableOpacity
                  key={option.id}
                  style={[styles.listOption, !isLast && themeStyles.border]}
                  onPress={() => {
                    setBoxType(option.id);
                    setShowBoxTypeModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.listText,
                      themeStyles.text,
                      boxType === option.id && {
                        color: colors.primary,
                        fontFamily: "Poppins_600SemiBold",
                      },
                    ]}
                  >
                    {t(option.id, option.label)}
                  </Text>
                  {boxType === option.id && (
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

      {/* --- 3. CALENDAR MODAL CHỈNH SỬA --- */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.calendarModal, themeStyles.modalBg]}>
            {/* Calendar Header */}
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

            {/* Days of Week */}
            <View style={[styles.weekDays, themeStyles.border]}>
              {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((day) => (
                <Text key={day} style={[styles.weekDay, themeStyles.subText]}>
                  {t(`day_${day.toLowerCase()}`, day)}
                </Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {(() => {
                const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);
                const days = [];

                // Empty cells before first day
                for (let i = 0; i < firstDay; i++) {
                  days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
                }

                // Days of the month
                for (let day = 1; day <= daysInMonth; day++) {
                  const currentDate = new Date(
                    currentMonth.getFullYear(),
                    currentMonth.getMonth(),
                    day,
                  );

                  // Chỉ cần check 1 ngày (selectedDate)
                  const isSelected =
                    selectedDate &&
                    currentDate.getDate() === selectedDate.getDate() &&
                    currentDate.getMonth() === selectedDate.getMonth() &&
                    currentDate.getFullYear() === selectedDate.getFullYear();

                  let bgStyle = {};
                  if (isSelected) {
                    bgStyle = { backgroundColor: colors.primary };
                  }

                  days.push(
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCell,
                        isSelected && styles.selectedDay,
                        bgStyle,
                      ]}
                      onPress={() => handleDateSelect(day)}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          themeStyles.text,
                          isSelected && styles.selectedDayText,
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

            {/* 3. Time Selection & Overnight - CHỈ HIỆN KHI ĐÃ CHỌN NGÀY */}
            {hasSelectedDate && (
              <View
                style={[
                  styles.timeSection,
                  themeStyles.border,
                  { borderTopWidth: 1, paddingTop: 16 },
                ]}
              >
                <Text
                  style={[
                    styles.timeValue,
                    themeStyles.text,
                    { textAlign: "center", marginBottom: 16 },
                  ]}
                >
                  {formatDate(selectedDate)}
                </Text>

                <View style={styles.timeRow}>
                  <Text style={[styles.timeLabel, { color: colors.primary }]}>
                    {t("from", "FROM")}
                  </Text>
                  <Text style={[styles.timeDisplay, themeStyles.text]}>
                    {fromTime}
                  </Text>
                </View>

                <View style={styles.timeRow}>
                  <Text style={[styles.timeLabel, { color: colors.primary }]}>
                    {t("to", "TO")}
                  </Text>
                  <Text style={[styles.timeDisplay, themeStyles.text]}>
                    {toTime}
                  </Text>
                </View>

                {/* Nút Ở qua đêm */}
                <View style={styles.overnightRow}>
                  <Text style={[styles.overnightText, themeStyles.text]}>
                    {t("stay_overnight", "Stay overnight")}
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
              </View>
            )}

            {/* Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmButton,
                {
                  backgroundColor: hasSelectedDate
                    ? colors.primary
                    : colors.subText,
                }, // Đổi màu nếu chưa chọn ngày
              ]}
              disabled={!hasSelectedDate} // Vô hiệu hóa nếu chưa chọn ngày
              onPress={confirmDateTime}
            >
              <Text style={styles.confirmButtonText}>
                {t("confirm_date_time", "Confirm Date & Time")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
    fontStyle: "italic",
  },
  resetText: { fontSize: 16, fontFamily: "Poppins_500Medium" },

  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  filterCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardContent: { flex: 1 },
  cardLabel: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
    fontStyle: "italic",
  },

  priceSection: { marginTop: 16, marginBottom: 32 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: "Poppins_700Bold",
    fontStyle: "italic",
  },
  sliderContainer: { paddingHorizontal: 10 },
  slider: { width: "100%", height: 40 },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },

  amenitiesSection: { marginBottom: 32 },
  amenitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  amenityChip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 1.5,
  },
  amenityChipSelected: {},
  amenityText: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    fontStyle: "italic",
  },
  amenityTextSelected: { fontFamily: "Poppins_600SemiBold" },

  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    borderTopWidth: 1,
  },
  searchButton: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
    fontFamily: "Poppins_700Bold",
  },

  // Modals Styles (Dùng chung cho Overlay)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  // List Modal Styles (Cho Box Type và Destination)
  listModal: { borderRadius: 20, padding: 24, width: "90%", maxWidth: 350 },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Poppins_700Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listText: { fontSize: 16, fontFamily: "Poppins_500Medium" },

  // Calendar Modal Styles
  calendarModal: {
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  monthYear: { fontSize: 20, fontWeight: "700", fontFamily: "Poppins_700Bold" },
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
    fontFamily: "Poppins_500Medium",
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
  dayText: {
    fontSize: 16,
    fontFamily: "Poppins_400Regular",
    fontStyle: "italic",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },

  timeSection: { marginBottom: 24 },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  timeLabel: { fontSize: 14, fontFamily: "Poppins_600SemiBold" },
  timeValue: { fontSize: 18, fontFamily: "Poppins_600SemiBold" },
  timeDisplay: { fontSize: 16, fontFamily: "Poppins_600SemiBold" },

  overnightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  overnightText: { fontSize: 15, fontFamily: "Poppins_500Medium" },

  confirmButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
  },
});
