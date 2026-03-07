import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";
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

const QUICK_FILTERS = [
  "Có bữa sáng",
  "4-5 sao giá tốt",
  "Vị trí thuận tiện",
  "Được yêu thích nhất",
  "5 sao",
  "4 sao",
  "Thanh toán tại chỗ",
];

const FILTER_DATA = {
  popular: [
    "Có bữa sáng",
    "4-5 sao giá tốt",
    "Vị trí thuận tiện",
    "Được yêu thích nhất",
    "5 sao",
    "4 sao",
    "Thanh toán tại chỗ",
  ],
  areas: [
    "Thành phố Thủ Đức",
    "Quận 1",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Quận Phú Nhuận",
    "Quận Bình Thạnh",
    "Quận Gò Vấp",
    "Quận Tân Bình",
    "Quận Bình Tân",
    "Quận Tân Phú",
  ],
  amenities: [
    "Khu vực ăn uống",
    "Quầy lễ tân",
    "Bãi gửi xe",
    "Dịch vụ giặt ủi",
    "Khu vực hút thuốc",
    "Dịch vụ lưu trữ",
    "Thang máy",
    "Dịch vụ dọn phòng",
    "Đội ngũ nhân viên đa ngôn ngữ",
    "Cho phép vật nuôi",
    "Tiện nghi cho trẻ",
    "Không khói thuốc",
    "Tủ khoá",
    "Dịch vụ trả phòng muộn",
  ],
  unique: [
    "Khu vực cafe/ đọc sách/ thư viện",
    "Quầy tự phục vụ nước uống",
    "Trải nghiệm ẩm thực",
    "Gần Công viên chủ đề",
  ],
  roomAmenities: [
    "Máy lạnh",
    "Dụng cụ vệ sinh cá nhân",
    "Phòng hút thuốc",
    "Tủ lạnh chung",
    "Khu vực vệ sinh chung",
  ],
};

const SORT_OPTIONS = [
  { id: "recommend", label: "Đề xuất cho bạn" },
  { id: "price_asc", label: "Giá thấp nhất trước" },
  { id: "price_desc", label: "Giá cao nhất trước" },
  { id: "rating", label: "Đánh giá cao nhất" },
  { id: "distance", label: "Khoảng cách (Gần nhất)" },
];

export default function SearchResultsScreen() {
  const { t } = useTranslation();
  const { colors, isDarkMode } = useTheme();
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  // --- STATES ---
  // Modal State tổng
  const [activeModal, setActiveModal] = useState<
    "filter" | "area" | "sort" | "searchAdjustment" | null
  >(null);

  // Filter States (Bottom Sheet)
  const [priceRange, setPriceRange] = useState<number>(24000000);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedSort, setSelectedSort] = useState("recommend");

  const [expandedSections, setExpandedSections] = useState<
    Record<keyof typeof FILTER_DATA, boolean>
  >({
    popular: false,
    areas: false,
    amenities: false,
    unique: false,
    roomAmenities: false,
  });

  // --- STATES CHO TÍNH NĂNG TÌM KIẾM (ĐIỀU CHỈNH SEARCH) ---
  const [selectedLocation, setSelectedLocation] =
    useState<string>("Thành phố Vũng Tàu");
  const [boxType, setBoxType] = useState("Single");
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [hasSelectedDate, setHasSelectedDate] = useState(true);
  const [isOvernight, setIsOvernight] = useState(false);

  const [fromTime, setFromTime] = useState<Date>(
    new Date(new Date().setHours(10, 0, 0, 0)),
  );
  const [toTime, setToTime] = useState<Date>(
    new Date(new Date().setHours(11, 30, 0, 0)),
  );
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerMode, setTimePickerMode] = useState<"from" | "to">("from");

  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showBoxTypeModal, setShowBoxTypeModal] = useState(false);

  const boxTypeOptions = [
    { id: "Single", label: "Single" },
    { id: "Double", label: "Double" },
  ];

  // Helper toggle item (Cho Bộ lọc)
  const toggleItem = (item: string) => {
    setSelectedFilters((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  const toggleExpand = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
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

  const formatFullDate = (date: Date | null) => {
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

  const getFullDisplayDateRange = () => {
    if (!selectedDate) return "";
    let display = formatFullDate(selectedDate);
    if (isOvernight) {
      const nextDate = new Date(selectedDate);
      nextDate.setDate(nextDate.getDate() + 1);
      display += ` - ${formatFullDate(nextDate)}`;
    }
    return display;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

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

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") setShowTimePicker(false);
    if (selectedTime) {
      if (timePickerMode === "from") setFromTime(selectedTime);
      else setToTime(selectedTime);
    }
  };

  const openTimePicker = (mode: "from" | "to") => {
    setTimePickerMode(mode);
    setShowTimePicker(true);
  };

  // --- THEME STYLES ---
  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card },
    border: { borderColor: isDarkMode ? "#333" : "#EAEAEA" },
    chipBg: { backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF" },
    chipBorder: { borderColor: isDarkMode ? "#444" : "#DDDDDD" },
    modalBg: { backgroundColor: colors.card },
    dropdownBg: {
      backgroundColor: isDarkMode ? "#2C2C2C" : "#FFFFFF",
      borderColor: isDarkMode ? "#444" : "#EAEAEA",
    },
  };

  if (!fontsLoaded) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary}
        style={{ flex: 1, backgroundColor: colors.background }}
      />
    );
  }

  // --- COMPONENT RENDER TỪNG MỤC LỌC CHUNG ---
  const renderFilterSection = (
    title: string,
    dataKey: keyof typeof FILTER_DATA,
    items: string[],
    limit: number = 6,
  ) => {
    const isExpanded = expandedSections[dataKey];
    const displayItems = isExpanded ? items : items.slice(0, limit);
    const hasMore = items.length > limit;

    // Kiểm tra xem trong section này có mục nào đang được chọn không (để hiện dấu tích trên tiêu đề)
    const hasSelectedItems = items.some((item) =>
      selectedFilters.includes(item),
    );

    return (
      <View style={[styles.filterSection, themeStyles.border]}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, themeStyles.text]}>{title}</Text>
          {/* HIỂN THỊ DẤU TÍCH XANH CẠNH TIÊU ĐỀ NẾU CÓ MỤC BÊN TRONG ĐƯỢC CHỌN */}
          {hasSelectedItems && (
            <View style={styles.greenCheckBadge}>
              <Ionicons name="checkmark" size={12} color="#FFF" />
            </View>
          )}
        </View>

        <View style={styles.chipWrapper}>
          {displayItems.map((item) => {
            const isSelected = selectedFilters.includes(item);
            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterChip,
                  themeStyles.chipBg,
                  themeStyles.chipBorder,
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: isDarkMode ? "#4A3B22" : "#F0F5FF",
                  },
                ]}
                onPress={() => toggleItem(item)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    themeStyles.text,
                    isSelected && {
                      color: colors.primary,
                      fontFamily: "PlusJakartaSans_600SemiBold",
                    },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {hasMore && (
          <TouchableOpacity
            onPress={() => toggleExpand(dataKey)}
            style={{ alignSelf: "flex-end", marginTop: 8 }}
          >
            <Text style={[styles.expandText, { color: colors.primary }]}>
              {isExpanded ? "Ẩn bớt" : "Xem Tất cả"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      {/* HEADER (BẤM VÀO ĐỂ HIỆN BẢNG ĐIỀU CHỈNH SEARCH) */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{selectedLocation} (1114)</Text>

          <TouchableOpacity
            style={styles.headerSubtitleRow}
            onPress={() => setActiveModal("searchAdjustment")}
          >
            <Text style={styles.headerSubtitle}>
              {getDisplayDateRange()} • {isOvernight ? "1 đêm • " : ""}
              {boxType}
            </Text>
            <Ionicons
              name="chevron-down"
              size={14}
              color="#FFF"
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* TOP ACTION BAR (BỘ LỌC | KHU VỰC | SẮP XẾP) */}
      <View style={[styles.actionBar, themeStyles.border]}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setActiveModal("filter")}
        >
          <Ionicons name="options-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionBtnText, themeStyles.text]}>Bộ lọc</Text>
        </TouchableOpacity>
        <View style={[styles.verticalDivider, themeStyles.border]} />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setActiveModal("area")}
        >
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <Text style={[styles.actionBtnText, themeStyles.text]}>Khu vực</Text>
        </TouchableOpacity>
        <View style={[styles.verticalDivider, themeStyles.border]} />
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => setActiveModal("sort")}
        >
          <Ionicons
            name="swap-vertical-outline"
            size={18}
            color={colors.primary}
          />
          <Text style={[styles.actionBtnText, themeStyles.text]}>Sắp xếp</Text>
        </TouchableOpacity>
      </View>

      {/* HORIZONTAL QUICK FILTERS */}
      <View style={[styles.quickFilterContainer, themeStyles.border]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {QUICK_FILTERS.map((item, index) => {
            const isSelected = selectedFilters.includes(item);
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.quickChip,
                  themeStyles.chipBg,
                  themeStyles.chipBorder,
                  isSelected && {
                    borderColor: colors.primary,
                    backgroundColor: isDarkMode ? "#4A3B22" : "#F0F5FF",
                  },
                ]}
                onPress={() => toggleItem(item)}
              >
                <Text
                  style={[
                    styles.quickChipText,
                    themeStyles.text,
                    isSelected && { color: colors.primary },
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* DANH SÁCH KẾT QUẢ TÌM KIẾM */}
      <ScrollView
        style={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {[1, 2, 3, 4].map((item) => (
          <View
            key={item}
            style={[styles.resultCard, themeStyles.card, themeStyles.border]}
          >
            <Image
              source={{
                uri: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400",
              }}
              style={styles.cardImage}
            />
            <TouchableOpacity style={styles.heartBtn}>
              <Ionicons name="heart-outline" size={24} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.cardInfo}>
              <Text style={[styles.cardTitle, themeStyles.text]}>
                Urban Oasis BoxHub
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <View
                  style={[
                    styles.ratingBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={styles.ratingText}>8.9</Text>
                </View>
                <Text style={[styles.reviewText, themeStyles.subText]}>
                  {" "}
                  Tuyệt vời (1.1k đánh giá)
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="location" size={14} color={colors.subText} />
                <Text style={[styles.cardLocation, themeStyles.subText]}>
                  {" "}
                  Quận 1, Thành phố Hồ Chí Minh
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  marginBottom: 12,
                }}
              >
                <View
                  style={[
                    styles.smallTag,
                    themeStyles.chipBg,
                    themeStyles.chipBorder,
                  ]}
                >
                  <Text style={[styles.smallTagText, themeStyles.subText]}>
                    Máy lạnh
                  </Text>
                </View>
                <View
                  style={[
                    styles.smallTag,
                    themeStyles.chipBg,
                    themeStyles.chipBorder,
                  ]}
                >
                  <Text style={[styles.smallTagText, themeStyles.subText]}>
                    Wifi miễn phí
                  </Text>
                </View>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text style={[styles.oldPrice, themeStyles.subText]}>
                  VND 939.913
                </Text>
                <Text style={[styles.newPrice, { color: "#E11D48" }]}>
                  VND 590.575
                </Text>
                <Text style={[styles.priceUnit, themeStyles.subText]}>
                  /phòng/đêm
                </Text>
              </View>
            </View>
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ========================================== */}
      {/* MODAL 1: ĐIỀU CHỈNH TÌM KIẾM (SEARCH ADJUSTMENT) */}
      {/* ========================================== */}
      <Modal
        visible={activeModal === "searchAdjustment"}
        animationType="slide"
        transparent={true}
      >
        <SafeAreaView style={[styles.container, themeStyles.container]}>
          <View style={[styles.header, { backgroundColor: colors.primary }]}>
            <TouchableOpacity
              onPress={() => setActiveModal(null)}
              style={styles.backBtn}
            >
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text
              style={[
                styles.headerTitle,
                { flex: 1, textAlign: "center", marginRight: 40 },
              ]}
            >
              Điều chỉnh
            </Text>
          </View>

          <ScrollView
            style={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={[
                styles.searchCardContainer,
                themeStyles.card,
                themeStyles.border,
              ]}
            >
              {/* Điểm đến */}
              <TouchableOpacity
                style={styles.searchCardRow}
                onPress={() => setShowLocationDropdown(!showLocationDropdown)}
                activeOpacity={0.7}
              >
                <Text style={styles.searchCardLabel}>Điểm đến</Text>
                <View style={styles.searchCardValueRow}>
                  <Ionicons
                    name="location-outline"
                    size={20}
                    color={colors.primary}
                    style={{ marginRight: 8 }}
                  />
                  <Text style={[styles.searchCardValue, themeStyles.text]}>
                    {selectedLocation}
                  </Text>
                  <Ionicons
                    name={showLocationDropdown ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.subText}
                  />
                </View>
              </TouchableOpacity>

              {/* Dropdown Tỉnh/Thành */}
              {showLocationDropdown && (
                <View
                  style={[styles.dropdownContainer, themeStyles.dropdownBg]}
                >
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
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
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
                        Gần tôi
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <ScrollView
                    style={{ maxHeight: 200 }}
                    nestedScrollEnabled={true}
                  >
                    {FILTER_DATA.areas.map((loc) => (
                      <TouchableOpacity
                        key={loc}
                        style={[
                          styles.listOption,
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
                          {loc}
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

              {/* Dòng 2: Time Range & Box Type */}
              <View style={styles.searchCardSplitRow}>
                <TouchableOpacity
                  style={styles.searchCardHalf}
                  onPress={() => setShowCalendar(true)}
                >
                  <Text style={styles.searchCardLabel}>Ngày nhận phòng</Text>
                  <Text style={[styles.searchCardValueSplit, themeStyles.text]}>
                    {getDisplayDateRange()}
                  </Text>
                  {isOvernight && (
                    <Text style={[styles.searchCardLabel, { marginTop: 4 }]}>
                      1 đêm
                    </Text>
                  )}
                </TouchableOpacity>

                <View style={[styles.verticalLine, themeStyles.border]} />

                <TouchableOpacity
                  style={styles.searchCardHalf}
                  onPress={() => {
                    setShowLocationDropdown(false);
                    setShowBoxTypeModal(true);
                  }}
                >
                  <Text style={styles.searchCardLabel}>Loại phòng</Text>
                  <Text style={[styles.searchCardValueSplit, themeStyles.text]}>
                    {boxType}
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.searchButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.searchButtonText}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Modal Nhỏ: Lịch (Bên trong Adjustment) */}
          <Modal
            visible={showCalendar}
            animationType="slide"
            transparent={true}
          >
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
                    Chọn thời gian
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
                    <Text
                      key={day}
                      style={[styles.weekDay, themeStyles.subText]}
                    >
                      {t(`day_${day.toLowerCase()}`, day)}
                    </Text>
                  ))}
                </View>

                <View style={styles.calendarGrid}>
                  {(() => {
                    const { firstDay, daysInMonth } =
                      getDaysInMonth(currentMonth);
                    const days = [];
                    for (let i = 0; i < firstDay; i++) {
                      days.push(
                        <View key={`empty-${i}`} style={styles.dayCell} />,
                      );
                    }
                    for (let day = 1; day <= daysInMonth; day++) {
                      const currentDate = new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth(),
                        day,
                      );

                      let isSelected = false;
                      let isNextDaySelected = false;

                      if (selectedDate) {
                        isSelected =
                          currentDate.getDate() === selectedDate.getDate() &&
                          currentDate.getMonth() === selectedDate.getMonth() &&
                          currentDate.getFullYear() ===
                            selectedDate.getFullYear();

                        if (isOvernight) {
                          const nextDate = new Date(selectedDate);
                          nextDate.setDate(nextDate.getDate() + 1);
                          isNextDaySelected =
                            currentDate.getDate() === nextDate.getDate() &&
                            currentDate.getMonth() === nextDate.getMonth() &&
                            currentDate.getFullYear() ===
                              nextDate.getFullYear();
                        }
                      }

                      const isHighlighted = isSelected || isNextDaySelected;

                      days.push(
                        <TouchableOpacity
                          key={day}
                          style={[
                            styles.dayCell,
                            isHighlighted && styles.selectedDay,
                            isHighlighted && {
                              backgroundColor: colors.primary,
                            },
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
                        Ở qua đêm
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
                      <Text
                        style={[styles.timeLabel, { color: colors.primary }]}
                      >
                        TỪ
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
                      <Text
                        style={[styles.timeLabel, { color: colors.primary }]}
                      >
                        ĐẾN
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
                    Xác nhận Ngày & Giờ
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

          {/* Modal Nhỏ: Loại Phòng */}
          <Modal
            visible={showBoxTypeModal}
            animationType="fade"
            transparent={true}
          >
            <TouchableOpacity
              style={styles.modalBgWrapper}
              activeOpacity={1}
              onPress={() => setShowBoxTypeModal(false)}
            >
              <View style={[styles.miniModal, themeStyles.card]}>
                <Text style={[styles.miniModalTitle, themeStyles.text]}>
                  Chọn Loại Phòng
                </Text>
                {boxTypeOptions.map((option, index) => {
                  const isLast = index === boxTypeOptions.length - 1;
                  return (
                    <TouchableOpacity
                      key={option.id}
                      style={[
                        styles.sortOptionRow,
                        !isLast && { borderBottomWidth: 1 },
                        themeStyles.border,
                      ]}
                      onPress={() => {
                        setBoxType(option.label);
                        setShowBoxTypeModal(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.sortOptionText,
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
        </SafeAreaView>
      </Modal>

      {/* ========================================== */}
      {/* MODAL BỘ LỌC TỔNG HỢP CỠ LỚN */}
      {/* ========================================== */}
      <Modal
        visible={activeModal === "filter"}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalBgWrapper}>
          <View style={[styles.bottomSheet, themeStyles.card]}>
            <View style={[styles.sheetHeader, themeStyles.border]}>
              <TouchableOpacity onPress={() => setActiveModal(null)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.sheetTitle, themeStyles.text]}>Bộ lọc</Text>
              <TouchableOpacity
                onPress={() => {
                  setPriceRange(24000000);
                  setSelectedFilters([]);
                }}
              >
                <Text style={[styles.clearText, themeStyles.text]}>Xóa</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20 }}
            >
              {/* Khoảng giá */}
              <View style={[styles.filterSection, themeStyles.border]}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={[styles.sectionTitle, themeStyles.text]}>
                    Khoảng giá
                  </Text>
                  <TouchableOpacity onPress={() => setPriceRange(24000000)}>
                    <Text
                      style={{
                        color: colors.primary,
                        fontFamily: "PlusJakartaSans_500Medium",
                      }}
                    >
                      Đặt lại
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={[styles.subTitle, themeStyles.subText]}>
                  Mỗi phòng, mỗi đêm
                </Text>

                <Slider
                  style={{ width: "100%", height: 40, marginTop: 10 }}
                  minimumValue={0}
                  maximumValue={24000000}
                  step={100000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  minimumTrackTintColor={colors.primary}
                  maximumTrackTintColor={isDarkMode ? "#555" : "#E5E5E5"}
                  thumbTintColor={colors.primary}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 10,
                  }}
                >
                  <View
                    style={[
                      styles.priceBox,
                      themeStyles.chipBg,
                      themeStyles.chipBorder,
                    ]}
                  >
                    <Text style={[styles.priceText, themeStyles.subText]}>
                      VND{" "}
                      <Text
                        style={[
                          themeStyles.text,
                          { fontFamily: "PlusJakartaSans_600SemiBold" },
                        ]}
                      >
                        0
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.priceBox,
                      themeStyles.chipBg,
                      themeStyles.chipBorder,
                    ]}
                  >
                    <Text style={[styles.priceText, themeStyles.subText]}>
                      VND{" "}
                      <Text
                        style={[
                          themeStyles.text,
                          { fontFamily: "PlusJakartaSans_600SemiBold" },
                        ]}
                      >
                        {formatPrice(priceRange)}
                      </Text>
                    </Text>
                  </View>
                </View>
              </View>

              {/* Bộ lọc Đánh giá sao */}
              <View style={[styles.filterSection, themeStyles.border]}>
                <View style={styles.sectionTitleRow}>
                  <Text style={[styles.sectionTitle, themeStyles.text]}>
                    Đánh giá sao
                  </Text>
                  {/* Icon Checkmark nếu có chọn sao */}
                  {[1, 2, 3, 4, 5].some((s) =>
                    selectedFilters.includes(`${s} sao`),
                  ) && (
                    <View style={styles.greenCheckBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  )}
                </View>
                <View style={styles.chipWrapper}>
                  {[1, 2, 3, 4, 5].map((star) => {
                    const starKey = `${star} sao`;
                    const isSelected = selectedFilters.includes(starKey);
                    return (
                      <TouchableOpacity
                        key={starKey}
                        style={[
                          styles.filterChip,
                          themeStyles.chipBg,
                          themeStyles.chipBorder,
                          isSelected && {
                            borderColor: colors.primary,
                            backgroundColor: isDarkMode ? "#4A3B22" : "#F0F5FF",
                          },
                        ]}
                        onPress={() => toggleItem(starKey)}
                      >
                        <Text
                          style={[
                            styles.filterChipText,
                            themeStyles.text,
                            isSelected && {
                              color: colors.primary,
                              fontFamily: "PlusJakartaSans_600SemiBold",
                            },
                          ]}
                        >
                          {star}
                        </Text>
                        <Ionicons
                          name="star"
                          size={14}
                          color="#FFD700"
                          style={{ marginLeft: 4 }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Linh hoạt hơn */}
              <View style={[styles.filterSection, themeStyles.border]}>
                <View style={styles.sectionTitleRow}>
                  <Text style={[styles.sectionTitle, themeStyles.text]}>
                    Linh hoạt hơn
                  </Text>
                  {(selectedFilters.includes("Miễn phí hủy phòng") ||
                    selectedFilters.includes("Thanh toán tại khách sạn")) && (
                    <View style={styles.greenCheckBadge}>
                      <Ionicons name="checkmark" size={12} color="#FFF" />
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.flexItem, themeStyles.border]}
                  onPress={() => toggleItem("Miễn phí hủy phòng")}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={24}
                    color={colors.text}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.flexTitle, themeStyles.text]}>
                      Miễn phí hủy phòng
                    </Text>
                    <Text style={[styles.flexDesc, themeStyles.subText]}>
                      Không có nguy cơ! Không tốn phí hủy nếu bạn hủy trước một
                      ngày xác định.
                    </Text>
                  </View>
                  <Ionicons
                    name={
                      selectedFilters.includes("Miễn phí hủy phòng")
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color={
                      selectedFilters.includes("Miễn phí hủy phòng")
                        ? colors.primary
                        : colors.subText
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.flexItem, { borderBottomWidth: 0 }]}
                  onPress={() => toggleItem("Thanh toán tại khách sạn")}
                >
                  <Ionicons
                    name="cash-outline"
                    size={24}
                    color={colors.text}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.flexTitle, themeStyles.text]}>
                      Thanh toán tại khách sạn
                    </Text>
                    <Text style={[styles.flexDesc, themeStyles.subText]}>
                      Không cần thanh toán ngay! Thanh toán khi bạn làm thủ tục
                      nhận phòng tại nơi lưu trú.
                    </Text>
                  </View>
                  <Ionicons
                    name={
                      selectedFilters.includes("Thanh toán tại khách sạn")
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={24}
                    color={
                      selectedFilters.includes("Thanh toán tại khách sạn")
                        ? colors.primary
                        : colors.subText
                    }
                  />
                </TouchableOpacity>
              </View>

              {/* Gọi hàm Render các mục còn lại */}
              {renderFilterSection(
                "Bộ lọc phổ biến",
                "popular",
                FILTER_DATA.popular,
              )}
              {renderFilterSection("Khu vực", "areas", FILTER_DATA.areas, 4)}
              {renderFilterSection(
                "Tiện nghi phổ biến",
                "amenities",
                FILTER_DATA.amenities,
                8,
              )}
              {renderFilterSection(
                "Tiện nghi độc đáo",
                "unique",
                FILTER_DATA.unique,
                6,
              )}
              {renderFilterSection(
                "Tiện nghi phòng",
                "roomAmenities",
                FILTER_DATA.roomAmenities,
              )}

              <View style={{ height: 50 }} />
            </ScrollView>

            <View
              style={[
                styles.sheetFooter,
                themeStyles.card,
                {
                  borderTopWidth: 1,
                  borderColor: themeStyles.border.borderColor,
                },
              ]}
            >
              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.submitBtnText}>Xem kết quả</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ========================================== */}
      {/* MODAL SẮP XẾP */}
      {/* ========================================== */}
      <Modal
        visible={activeModal === "sort"}
        animationType="fade"
        transparent={true}
      >
        <TouchableOpacity
          style={styles.modalBgWrapper}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View style={[styles.miniModal, themeStyles.card]}>
            <Text style={[styles.miniModalTitle, themeStyles.text]}>
              Sắp xếp
            </Text>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                style={styles.sortOptionRow}
                onPress={() => {
                  setSelectedSort(opt.id);
                  setActiveModal(null);
                }}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    themeStyles.text,
                    selectedSort === opt.id && {
                      color: colors.primary,
                      fontFamily: "PlusJakartaSans_600SemiBold",
                    },
                  ]}
                >
                  {opt.label}
                </Text>
                <Ionicons
                  name={
                    selectedSort === opt.id
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color={
                    selectedSort === opt.id ? colors.primary : colors.subText
                  }
                />
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL KHU VỰC CHI TIẾT DƯỚI DẠNG DANH SÁCH LIST */}
      <Modal
        visible={activeModal === "area"}
        animationType="fade"
        transparent={true}
      >
        <TouchableOpacity
          style={styles.modalBgWrapper}
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
        >
          <View
            style={[styles.miniModal, themeStyles.card, { maxHeight: "70%" }]}
          >
            <Text style={[styles.miniModalTitle, themeStyles.text]}>
              Chọn Khu Vực
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {FILTER_DATA.areas.map((area) => {
                const isSelected = selectedFilters.includes(area);
                return (
                  <TouchableOpacity
                    key={area}
                    style={styles.sortOptionRow}
                    onPress={() => {
                      toggleItem(area);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        themeStyles.text,
                        isSelected && {
                          color: colors.primary,
                          fontFamily: "PlusJakartaSans_600SemiBold",
                        },
                      ]}
                    >
                      {area}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={22}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 40,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { marginRight: 16 },
  headerTitleContainer: { flex: 1 },
  headerTitle: {
    color: "#FFF",
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 16,
    marginBottom: 2,
  },
  headerSubtitleRow: { flexDirection: "row", alignItems: "center" },
  headerSubtitle: {
    color: "#FFF",
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    opacity: 0.9,
  },

  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  actionBtnText: { fontFamily: "PlusJakartaSans_500Medium", fontSize: 14 },
  verticalDivider: { width: 1, height: 20, borderLeftWidth: 1 },

  quickFilterContainer: { paddingVertical: 12, borderBottomWidth: 1 },
  quickChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  quickChipText: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 13 },

  listContainer: { flex: 1, padding: 16 },
  resultCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
  },
  cardImage: { width: "100%", height: 200 },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: 6,
    borderRadius: 20,
  },
  cardInfo: { padding: 16 },
  cardTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    marginBottom: 8,
  },
  ratingBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8,
  },
  ratingText: {
    color: "#FFF",
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 12,
  },
  reviewText: { fontFamily: "PlusJakartaSans_500Medium", fontSize: 13 },
  cardLocation: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 13 },
  smallTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
  },
  smallTagText: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 11 },
  oldPrice: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    textDecorationLine: "line-through",
    marginBottom: 2,
  },
  newPrice: { fontFamily: "PlusJakartaSans_700Bold", fontSize: 18 },
  priceUnit: {
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 12,
    color: "#E11D48",
    marginTop: 4,
  },

  modalBgWrapper: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    height: "92%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
  },
  sheetTitle: { fontFamily: "PlusJakartaSans_700Bold", fontSize: 18 },
  clearText: { fontFamily: "PlusJakartaSans_500Medium", fontSize: 15 },

  filterSection: { paddingVertical: 20, borderBottomWidth: 1 },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontFamily: "PlusJakartaSans_700Bold", fontSize: 16 },
  greenCheckBadge: {
    backgroundColor: "#22C55E",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  subTitle: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 12 },
  priceBox: {
    width: "45%",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  priceText: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 13 },

  chipWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: { fontFamily: "PlusJakartaSans_400Regular", fontSize: 13 },
  expandText: { fontFamily: "PlusJakartaSans_600SemiBold", fontSize: 14 },

  flexItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  flexTitle: {
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontSize: 14,
    marginBottom: 4,
  },
  flexDesc: {
    fontFamily: "PlusJakartaSans_400Regular",
    fontSize: 12,
    lineHeight: 18,
  },

  sheetFooter: { padding: 16, paddingBottom: 30 },
  submitBtn: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  submitBtnText: {
    color: "#FFF",
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 16,
  },

  miniModal: {
    margin: 20,
    borderRadius: 16,
    padding: 20,
    paddingBottom: 10,
  },
  miniModalTitle: {
    fontFamily: "PlusJakartaSans_700Bold",
    fontSize: 18,
    marginBottom: 16,
  },
  sortOptionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  sortOptionText: { fontFamily: "PlusJakartaSans_500Medium", fontSize: 15 },

  // Search Card bên trong modal Điều chỉnh
  searchCardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "visible",
    zIndex: 10,
  },
  searchCardRow: { padding: 16, paddingBottom: 12 },
  searchCardLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans_500Medium",
    color: "#888",
    marginBottom: 6,
  },
  searchCardValueRow: { flexDirection: "row", alignItems: "center" },
  searchCardValue: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_700Bold",
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
    fontSize: 14,
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

  listOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  listText: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },

  // Lịch Styles
  calendarModal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: "100%",
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
  dayText: {
    fontSize: 16,
    fontFamily: "PlusJakartaSans_400Regular",
  },
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
