import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BackIcon,
  ChatIcon,
  FilterFunnelIcon,
  SearchIcon,
} from "../../components/Icons";

interface LocationMarker {
  id: string;
  name: string;
  rating: number;
  image: string;
  distance: string;
  price: number;
  lat: number;
  lng: number;
}

const locations: LocationMarker[] = [
  {
    id: "1",
    name: "Elysian Suites",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=400",
    distance: "0.5km away from you",
    price: 320,
    lat: 10.8,
    lng: 106.7,
  },
  {
    id: "2",
    name: "The Horizon",
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    distance: "1.2km away from you",
    price: 250,
    lat: 10.85,
    lng: 106.65,
  },
  {
    id: "3",
    name: "Opal Grove",
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
    distance: "0.8km away from you",
    price: 280,
    lat: 10.82,
    lng: 106.72,
  },
];

export default function MapScreen() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [selectedLocation, setSelectedLocation] = useState<LocationMarker>(
    locations[0],
  );
  const [activeFilter, setActiveFilter] = useState("All Boxes");

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#8D613A" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Background Placeholder */}
      <View style={styles.mapContainer}>
        <Image
          source={{
            uri: "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/106.7,10.8,12,0/600x800@2x?access_token=pk.example",
          }}
          style={styles.mapBackground}
        />

        {/* Location Markers */}
        {locations.map((location) => (
          <TouchableOpacity
            key={location.id}
            style={[
              styles.marker,
              {
                top: `${30 + Math.random() * 40}%`,
                left: `${20 + Math.random() * 60}%`,
              },
            ]}
            onPress={() => setSelectedLocation(location)}
          >
            <Image
              source={{ uri: location.image }}
              style={styles.markerImage}
            />
            <View style={styles.markerRating}>
              <Text style={styles.starIcon}>⭐</Text>
              <Text style={styles.markerRatingText}>{location.rating}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <BackIcon size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <SearchIcon size={22} color="#999999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search name or adress"
              placeholderTextColor="#B0B0B0"
            />
          </View>
          <TouchableOpacity
            onPress={() => router.push("/filter")}
            style={styles.filterButton}
          >
            <FilterFunnelIcon size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabsContent}
          >
            {["All Boxes", "Popular", "Price: Low"].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterTab,
                  activeFilter === filter && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterTabText,
                    activeFilter === filter && styles.filterTabTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomSheetHandle} />
        <TouchableOpacity
          style={styles.locationCard}
          activeOpacity={0.9}
          onPress={() => router.push("/detail")}
        >
          <Image
            source={{ uri: selectedLocation.image }}
            style={styles.locationImage}
          />
          <View style={styles.locationInfo}>
            <View style={styles.locationHeader}>
              <View>
                <Text style={styles.locationName}>{selectedLocation.name}</Text>
                <View style={styles.distanceRow}>
                  <Text style={styles.pinIcon}>📍</Text>
                  <Text style={styles.distanceText}>
                    {selectedLocation.distance}
                  </Text>
                </View>
              </View>
              <View style={styles.ratingBadge}>
                <Text style={styles.starIcon}>⭐</Text>
                <Text style={styles.ratingText}>{selectedLocation.rating}</Text>
              </View>
            </View>
            <View style={styles.locationFooter}>
              <Text style={styles.price}>
                ${selectedLocation.price}
                <Text style={styles.priceUnit}>/night</Text>
              </Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Booking Now</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatButton}
                onPress={() => router.push("/message")}
              >
                <ChatIcon size={16} color="#1A1A1A" />
              </TouchableOpacity>
            </View>
          </View>
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
  mapContainer: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  mapBackground: {
    width: "100%",
    height: "100%",
    opacity: 0.3,
  },
  marker: {
    position: "absolute",
    alignItems: "center",
  },
  markerImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  markerRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  markerRatingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "PlusJakartaSans_700Bold",
    marginLeft: 2,
  },
  headerContainer: {
    position: "absolute",
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  backButton: {
    width: 56,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  searchBar: {
    flex: 1,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingLeft: 20,
    paddingRight: 20,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_400Regular",
  },
  filterButton: {
    width: 56,
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  filterTabs: {
    paddingBottom: 12,
  },
  filterTabsContent: {
    paddingRight: 16,
  },
  filterTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  filterTabActive: {
    backgroundColor: "#8D613A",
    shadowColor: "#8D613A",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  filterTabText: {
    fontSize: 14,
    color: "#757575",
    fontFamily: "PlusJakartaSans_500Medium",
  },
  filterTabTextActive: {
    color: "#FFFFFF",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  bottomSheet: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomSheetHandle: {
    width: 30,
    height: 3,
    backgroundColor: "#D5D5D5",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 10,
  },
  locationCard: {
    flexDirection: "row",
    gap: 10,
  },
  locationImage: {
    width: 85,
    height: 85,
    borderRadius: 10,
  },
  locationInfo: {
    flex: 1,
  },
  locationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#262626",
    fontFamily: "PlusJakartaSans_700Bold",
    fontStyle: "italic",
    marginBottom: 2,
  },
  distanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  pinIcon: {
    fontSize: 9,
    marginRight: 3,
  },
  distanceText: {
    fontSize: 10,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  starIcon: {
    fontSize: 11,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#F97316",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  locationFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 0,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  priceUnit: {
    fontSize: 11,
    fontWeight: "400",
  },
  bookButton: {
    flex: 1,
    backgroundColor: "#8D613A",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 9,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  chatButton: {
    width: 32,
    height: 32,
    backgroundColor: "#F5F5F5",
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
});
