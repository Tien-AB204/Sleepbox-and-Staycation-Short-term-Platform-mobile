import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { router } from "expo-router";
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from "@expo-google-fonts/poppins";
import Slider from "@react-native-community/slider";

export default function FilterScreen() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const [priceRange, setPriceRange] = useState([10, 100]);
  const [selectedAmenities, setSelectedAmenities] = useState(["High-speed wifi"]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 8)); // September 2026
  const [selectedFromDate, setSelectedFromDate] = useState(new Date(2026, 8, 12)); // 12 Sept 2026
  const [selectedToDate, setSelectedToDate] = useState(new Date(2026, 8, 28)); // 28 Sept 2026
  const [fromTime, setFromTime] = useState("10:00 AM");
  const [toTime, setToTime] = useState("11:30 AM");

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
  };

  const handleSearch = () => {
    console.log("Searching with filters:", {
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

  const formatDate = (date: Date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}, ${days[date.getDay()]}`;
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!selectedFromDate || (selectedFromDate && selectedToDate)) {
      setSelectedFromDate(newDate);
      setSelectedToDate(null);
    } else {
      if (newDate > selectedFromDate) {
        setSelectedToDate(newDate);
      } else {
        setSelectedToDate(selectedFromDate);
        setSelectedFromDate(newDate);
      }
    }
  };

  const changeMonth = (delta: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + delta));
  };

  const confirmDateTime = () => {
    setShowCalendar(false);
  };

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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Destination */}
        <TouchableOpacity style={styles.filterCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>📍</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>DESTINATION</Text>
            <Text style={styles.cardValue}>Ho Chi Minh City, Vietnam</Text>
          </View>
        </TouchableOpacity>

        {/* Time Range */}
        <TouchableOpacity style={styles.filterCard} onPress={() => setShowCalendar(true)}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>📅</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>TIME RANGE</Text>
            <Text style={styles.cardValue}>
              {selectedFromDate && selectedToDate 
                ? `${formatDate(selectedFromDate).split(',')[0]} - ${formatDate(selectedToDate).split(',')[0]}`
                : 'Sun 16 Dec - Mon 17 Dec'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Box Type */}
        <TouchableOpacity style={styles.filterCard}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconEmoji}>📦</Text>
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardLabel}>BOX TYPE</Text>
            <Text style={styles.cardValue}>Single or double</Text>
          </View>
        </TouchableOpacity>

        {/* Price Range */}
        <View style={styles.priceSection}>
          <Text style={styles.sectionTitle}>Price Range (per hour)</Text>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={10}
              maximumValue={100}
              step={5}
              value={priceRange[1]}
              onValueChange={(value) => setPriceRange([priceRange[0], value])}
              minimumTrackTintColor="#8D613A"
              maximumTrackTintColor="#E5E5E5"
              thumbTintColor="#8D613A"
            />
          </View>
          <View style={styles.priceLabels}>
            <Text style={styles.priceLabel}>${priceRange[0]}</Text>
            <Text style={styles.priceLabel}>${priceRange[1]}</Text>
          </View>
        </View>

        {/* Amenities */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {amenitiesList.map((amenity, index) => (
              <TouchableOpacity
                key={amenity}
                style={[
                  styles.amenityChip,
                  selectedAmenities.includes(amenity) && styles.amenityChipSelected,
                ]}
                onPress={() => toggleAmenity(amenity)}
              >
                {selectedAmenities.includes(amenity) && (
                  <Text style={styles.checkIcon}>✓ </Text>
                )}
                <Text
                  style={[
                    styles.amenityText,
                    selectedAmenities.includes(amenity) && styles.amenityTextSelected,
                  ]}
                >
                  {amenity}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Search Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>SEARCH AVAILABLE FACILITIES</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={showCalendar}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarModal}>
            {/* Calendar Header */}
            <View style={styles.calendarHeader}>
              <TouchableOpacity onPress={() => changeMonth(-1)}>
                <Text style={styles.navArrow}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.monthYear}>
                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </Text>
              <TouchableOpacity onPress={() => changeMonth(1)}>
                <Text style={styles.navArrow}>▶</Text>
              </TouchableOpacity>
            </View>

            {/* Days of Week */}
            <View style={styles.weekDays}>
              {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
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
                  const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const isFromDate = selectedFromDate && 
                    currentDate.getDate() === selectedFromDate.getDate() &&
                    currentDate.getMonth() === selectedFromDate.getMonth() &&
                    currentDate.getFullYear() === selectedFromDate.getFullYear();
                  const isToDate = selectedToDate &&
                    currentDate.getDate() === selectedToDate.getDate() &&
                    currentDate.getMonth() === selectedToDate.getMonth() &&
                    currentDate.getFullYear() === selectedToDate.getFullYear();
                  
                  days.push(
                    <TouchableOpacity
                      key={day}
                      style={[
                        styles.dayCell,
                        (isFromDate || isToDate) && styles.selectedDay,
                        isFromDate && styles.fromDay,
                        isToDate && styles.toDay,
                      ]}
                      onPress={() => handleDateSelect(day)}
                    >
                      <Text style={[
                        styles.dayText,
                        (isFromDate || isToDate) && styles.selectedDayText,
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                
                return days;
              })()}
            </View>

            {/* Time Selection */}
            <View style={styles.timeSection}>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabel}>FROM</Text>
                <Text style={styles.timeValue}>{selectedFromDate ? formatDate(selectedFromDate) : ''}</Text>
                <Text style={styles.timeDisplay}>{fromTime}</Text>
              </View>
              <View style={styles.timeRow}>
                <Text style={styles.timeLabelTo}>TO</Text>
                <Text style={styles.timeValue}>{selectedToDate ? formatDate(selectedToDate) : ''}</Text>
                <Text style={styles.timeDisplay}>{toTime}</Text>
              </View>
            </View>

            {/* Confirm Button */}
            <TouchableOpacity style={styles.confirmButton} onPress={confirmDateTime}>
              <Text style={styles.confirmButtonText}>Confirm Date & Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIcon: {
    fontSize: 24,
    color: "#262626",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "Poppins_700Bold",
    fontStyle: "italic",
  },
  resetText: {
    fontSize: 16,
    color: "#8D613A",
    fontFamily: "Poppins_500Medium",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconEmoji: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 11,
    color: "#999999",
    fontFamily: "Poppins_500Medium",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "Poppins_700Bold",
    fontStyle: "italic",
  },
  priceSection: {
    marginTop: 16,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#262626",
    marginBottom: 20,
    fontFamily: "Poppins_700Bold",
    fontStyle: "italic",
  },
  sliderContainer: {
    paddingHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#262626",
    fontFamily: "Poppins_600SemiBold",
  },
  amenitiesSection: {
    marginBottom: 32,
  },
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
    borderColor: "#E5E5E5",
    backgroundColor: "#FAFAFA",
  },
  amenityChipSelected: {
    borderColor: "#8D613A",
    backgroundColor: "#FFF5E6",
  },
  checkIcon: {
    fontSize: 15,
    color: "#8D613A",
    fontWeight: "bold",
    marginRight: 4,
  },
  amenityText: {
    fontSize: 14,
    color: "#AAAAAA",
    fontFamily: "Poppins_400Regular",
    fontStyle: "italic",
  },
  amenityTextSelected: {
    color: "#8D613A",
    fontFamily: "Poppins_600SemiBold",
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  searchButton: {
    backgroundColor: "#8D613A",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
  // Calendar Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  calendarModal: {
    backgroundColor: "#FFFFFF",
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
  navArrow: {
    fontSize: 24,
    color: "#9333EA",
    fontWeight: "bold",
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "Poppins_700Bold",
  },
  weekDays: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  weekDay: {
    width: 40,
    textAlign: "center",
    fontSize: 12,
    color: "#999999",
    fontFamily: "Poppins_500Medium",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  selectedDay: {
    backgroundColor: "#9333EA",
    borderRadius: 50,
  },
  fromDay: {
    backgroundColor: "#9333EA",
  },
  toDay: {
    backgroundColor: "#C084FC",
  },
  dayText: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "Poppins_400Regular",
    fontStyle: "italic",
  },
  selectedDayText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontFamily: "Poppins_600SemiBold",
  },
  timeSection: {
    marginBottom: 24,
  },
  timeRow: {
    marginBottom: 20,
  },
  timeLabel: {
    fontSize: 14,
    color: "#9333EA",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
  },
  timeLabelTo: {
    fontSize: 14,
    color: "#C084FC",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 6,
  },
  timeValue: {
    fontSize: 18,
    color: "#1A1A1A",
    fontFamily: "Poppins_600SemiBold",
    marginBottom: 8,
  },
  timeDisplay: {
    fontSize: 16,
    color: "#999999",
    fontFamily: "Poppins_400Regular",
  },
  confirmButton: {
    backgroundColor: "#8D613A",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "Poppins_700Bold",
  },
});
