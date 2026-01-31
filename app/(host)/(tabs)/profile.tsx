import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { authService } from "../../../services/authService";
import {
  useFonts,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";

export default function HostProfile() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <Image
            source={{ uri: "https://i.pravatar.cc/300?img=48" }}
            style={styles.avatar}
          />
          <Text style={styles.userName}>Tien Host</Text>
          <Text style={styles.memberSince}>Host since 2024</Text>
        </View>

        {/* Email */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>EMAIL</Text>
          <Text style={styles.value}>tienhost@boxhub.com</Text>
        </View>

        {/* Phone */}
        <View style={styles.infoCard}>
          <Text style={styles.label}>PHONE</Text>
          <Text style={styles.value}>0987 654 321</Text>
        </View>

        {/* Gender and City */}
        <View style={styles.rowContainer}>
          <View style={[styles.infoCard, styles.halfCard]}>
            <Text style={styles.label}>GENDER</Text>
            <Text style={styles.valueItalic}>Male</Text>
          </View>
          <View style={[styles.infoCard, styles.halfCard]}>
            <Text style={styles.label}>CITY</Text>
            <Text style={styles.valueItalic}>HCMC</Text>
          </View>
        </View>

        {/* Language */}
        <TouchableOpacity style={styles.settingCard}>
          <Text style={styles.settingLabel}>Language</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingText}>English (US)</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </View>
        </TouchableOpacity>

        {/* Appearance */}
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Appearance</Text>
          <View style={styles.settingValue}>
            <Text style={styles.settingTextGray}>Light Mode</Text>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: "#E5E5E5", true: "#8D613A" }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E5E5E5"
            />
          </View>
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Log out</Text>
        </TouchableOpacity>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    textAlign: "center",
    paddingVertical: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 32,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_700Bold",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    fontStyle: "italic",
  },
  infoCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    color: "#999999",
    fontFamily: "PlusJakartaSans_500Medium",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_600SemiBold",
  },
  valueItalic: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_600SemiBold",
    fontStyle: "italic",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  halfCard: {
    width: "48%",
    marginHorizontal: 0,
  },
  settingCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    color: "#1A1A1A",
    fontFamily: "PlusJakartaSans_500Medium",
    fontStyle: "italic",
  },
  settingValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 15,
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_400Regular",
    marginRight: 4,
  },
  settingTextGray: {
    fontSize: 15,
    color: "#999999",
    fontFamily: "PlusJakartaSans_400Regular",
    marginRight: 12,
  },
  arrowIcon: {
    fontSize: 24,
    color: "#8D613A",
    fontWeight: "300",
  },
  editButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#8D613A",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8D613A",
    fontFamily: "PlusJakartaSans_700Bold",
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#EA9459",
    backgroundColor: "#FFF6F2",
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#EA9459",
    fontFamily: "PlusJakartaSans_700Bold",
  },
});
