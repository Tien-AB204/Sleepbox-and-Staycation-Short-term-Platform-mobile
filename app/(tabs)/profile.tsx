import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { authService } from "../../services/authService"; // Import service

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // State rỗng ban đầu, chờ fetch data
  const [userInfo, setUserInfo] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    isEmailVerified: false,
    phone: "",
    gender: "",
    dob: "",
    avatar: "https://i.pravatar.cc/300",
  });

  const [isEditVisible, setEditVisible] = useState(false);
  const [isLangVisible, setLangVisible] = useState(false);
  const [tempUserInfo, setTempUserInfo] = useState(userInfo);

  // --- LẤY DỮ LIỆU TỪ MOCK DATABASE ---
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    const data = await authService.getProfile();
    if (data) {
      setUserInfo(data);
    }
    setIsLoadingProfile(false);
  };

  // --- HÀM XỬ LÝ ---
  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
  };

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
    setLangVisible(false);
  };

  const handleSaveProfile = async () => {
    // Gọi hàm updateProfile giả lập
    await authService.updateProfile(tempUserInfo);
    setUserInfo(tempUserInfo);
    setEditVisible(false);
  };

  if (!fontsLoaded || isLoadingProfile) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const themeStyles = {
    container: { backgroundColor: colors.background },
    text: { color: colors.text },
    subText: { color: colors.subText },
    card: { backgroundColor: colors.card },
    input: {
      backgroundColor: isDarkMode ? "#333333" : "#FFFFFF",
      color: colors.text,
      borderColor: colors.border,
    },
    disabledInput: {
      backgroundColor: isDarkMode ? "#1A1A1A" : "#F5F5F5",
      color: colors.subText,
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeStyles.container]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <Image source={{ uri: userInfo.avatar }} style={styles.avatar} />
          <Text style={[styles.userName, themeStyles.text]}>
            {userInfo.firstName} {userInfo.lastName}
          </Text>
          <Text style={[styles.memberSince, themeStyles.subText]}>
            {t("member_since", { year: 2025 })}
          </Text>
        </View>

        {/* Username */}
        <View style={[styles.infoCard, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.subText]}>Username</Text>
          <Text style={[styles.value, themeStyles.text]}>@{userInfo.username}</Text>
        </View>

        {/* Email & Verify Icon */}
        <View style={[styles.infoCard, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.subText]}>{t("email")}</Text>
          <View style={styles.emailRow}>
            <Text style={[styles.value, themeStyles.text]}>{userInfo.email}</Text>
            {userInfo.isEmailVerified && (
              <Ionicons name="checkmark-circle" size={20} color="#10B981" style={{ marginLeft: 8 }} />
            )}
          </View>
        </View>

        {/* First Name & Last Name */}
        <View style={styles.rowContainer}>
          <View style={[styles.infoCard, styles.halfCard, themeStyles.card]}>
            <Text style={[styles.label, themeStyles.subText]}>First Name</Text>
            <Text style={[styles.value, themeStyles.text]}>{userInfo.firstName}</Text>
          </View>
          <View style={[styles.infoCard, styles.halfCard, themeStyles.card]}>
            <Text style={[styles.label, themeStyles.subText]}>Last Name</Text>
            <Text style={[styles.value, themeStyles.text]}>{userInfo.lastName}</Text>
          </View>
        </View>

        {/* Phone */}
        <View style={[styles.infoCard, themeStyles.card]}>
          <Text style={[styles.label, themeStyles.subText]}>{t("phone")}</Text>
          <Text style={[styles.value, themeStyles.text]}>{userInfo.phone}</Text>
        </View>

        {/* Gender & DOB */}
        <View style={styles.rowContainer}>
          <View style={[styles.infoCard, styles.halfCard, themeStyles.card]}>
            <Text style={[styles.label, themeStyles.subText]}>{t("gender")}</Text>
            <Text style={[styles.value, themeStyles.text]}>{userInfo.gender}</Text>
          </View>
          <View style={[styles.infoCard, styles.halfCard, themeStyles.card]}>
            <Text style={[styles.label, themeStyles.subText]}>Date of Birth</Text>
            <Text style={[styles.value, themeStyles.text]}>{userInfo.dob}</Text>
          </View>
        </View>

        {/* --- CÀI ĐẶT --- */}
        <TouchableOpacity style={[styles.settingCard, themeStyles.card]} onPress={() => setLangVisible(true)}>
          <Text style={[styles.settingLabel, themeStyles.text]}>{t("language")}</Text>
          <View style={styles.settingValue}>
            <Text style={[styles.settingText, { color: colors.primary }]}>
              {i18n.language === "vi" ? "Tiếng Việt" : "English (US)"}
            </Text>
            <Text style={[styles.arrowIcon, { color: colors.primary }]}>›</Text>
          </View>
        </TouchableOpacity>

        <View style={[styles.settingCard, themeStyles.card]}>
          <Text style={[styles.settingLabel, themeStyles.text]}>{t("appearance")}</Text>
          <View style={styles.settingValue}>
            <Text style={[styles.settingTextGray, themeStyles.subText]}>
              {isDarkMode ? t("dark") : t("light")}
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: "#E5E5E5", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.editButton, { borderColor: colors.primary }]}
          onPress={() => {
            setTempUserInfo(userInfo);
            setEditVisible(true);
          }}
        >
          <Text style={[styles.editButtonText, { color: colors.primary }]}>{t("edit_profile")}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.logoutButton, { borderColor: colors.primary }]} onPress={handleLogout}>
          <Text style={[styles.logoutButtonText, { color: colors.primary }]}>{t("logout")}</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- MODAL 1: CHỈNH SỬA HỒ SƠ --- */}
      <Modal visible={isEditVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, themeStyles.card]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>{t("edit_profile")}</Text>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={[styles.input, themeStyles.input]}
                value={tempUserInfo.username}
                onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, username: text })}
                placeholder="Username"
                placeholderTextColor={colors.subText}
              />

              <View style={styles.editRow}>
                <TextInput
                  style={[styles.input, themeStyles.input, styles.halfInput]}
                  value={tempUserInfo.firstName}
                  onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, firstName: text })}
                  placeholder="First Name"
                  placeholderTextColor={colors.subText}
                />
                <TextInput
                  style={[styles.input, themeStyles.input, styles.halfInput]}
                  value={tempUserInfo.lastName}
                  onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, lastName: text })}
                  placeholder="Last Name"
                  placeholderTextColor={colors.subText}
                />
              </View>

              <View style={styles.disabledInputContainer}>
                <TextInput
                  style={[styles.input, themeStyles.disabledInput, { flex: 1, marginBottom: 0 }]}
                  value={tempUserInfo.email}
                  editable={false}
                />
                <Ionicons name="lock-closed" size={20} color={colors.subText} style={styles.lockIcon} />
              </View>

              <TextInput
                style={[styles.input, themeStyles.input, { marginTop: 16 }]}
                value={tempUserInfo.phone}
                onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, phone: text })}
                placeholder="Phone"
                keyboardType="phone-pad"
                placeholderTextColor={colors.subText}
              />

              <View style={styles.editRow}>
                 <TextInput
                  style={[styles.input, themeStyles.input, styles.halfInput]}
                  value={tempUserInfo.gender}
                  onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, gender: text })}
                  placeholder="Gender"
                  placeholderTextColor={colors.subText}
                />
                 <TextInput
                  style={[styles.input, themeStyles.input, styles.halfInput]}
                  value={tempUserInfo.dob}
                  onChangeText={(text) => setTempUserInfo({ ...tempUserInfo, dob: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.subText}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setEditVisible(false)} style={styles.modalButtonCancel}>
                  <Text style={styles.textCancel}>{t("cancel")}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveProfile} style={[styles.modalButtonSave, { backgroundColor: colors.primary }]}>
                  <Text style={styles.textSave}>{t("save")}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: CHỌN NGÔN NGỮ --- */}
      <Modal visible={isLangVisible} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setLangVisible(false)}>
          <View style={[styles.langModalContent, themeStyles.card]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>{t("language")}</Text>

            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage("en")}>
              <Text style={[styles.langText, themeStyles.text]}>English (US)</Text>
              {i18n.language === "en" && <Text style={{ color: colors.primary }}>✓</Text>}
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: colors.border }} />

            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage("vi")}>
              <Text style={[styles.langText, themeStyles.text]}>Tiếng Việt</Text>
              {i18n.language === "vi" && <Text style={{ color: colors.primary }}>✓</Text>}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { flex: 1 },

  avatarSection: { alignItems: "center", marginTop: 20, marginBottom: 32 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
  userName: { fontSize: 24, fontFamily: "PlusJakartaSans_700Bold", marginBottom: 4 },
  memberSince: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },

  infoCard: { borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 16 },
  label: { fontSize: 11, fontFamily: "PlusJakartaSans_500Medium", letterSpacing: 0.5, marginBottom: 8, textTransform: "uppercase" },
  value: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold" },
  emailRow: { flexDirection: "row", alignItems: "center" },

  rowContainer: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 },
  halfCard: { width: "48%", marginHorizontal: 0 },

  settingCard: { borderRadius: 16, padding: 20, marginHorizontal: 20, marginBottom: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  settingLabel: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },
  settingValue: { flexDirection: "row", alignItems: "center" },
  settingText: { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", marginRight: 4 },
  settingTextGray: { fontSize: 15, fontFamily: "PlusJakartaSans_400Regular", marginRight: 12 },
  arrowIcon: { fontSize: 24, fontWeight: "300" },

  editButton: { marginHorizontal: 20, marginTop: 16, paddingVertical: 18, borderRadius: 28, borderWidth: 2, alignItems: "center", backgroundColor: "transparent" },
  editButtonText: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" },
  logoutButton: { marginHorizontal: 20, marginTop: 16, paddingVertical: 18, borderRadius: 28, borderWidth: 2, alignItems: "center", backgroundColor: "transparent" },
  logoutButtonText: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold" },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", maxHeight: "80%", borderRadius: 20, padding: 24, elevation: 5 },
  modalTitle: { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 16, fontFamily: "PlusJakartaSans_400Regular", fontSize: 15 },
  editRow: { flexDirection: "row", justifyContent: "space-between" },
  halfInput: { width: "48%" },
  disabledInputContainer: { position: "relative", justifyContent: "center" },
  lockIcon: { position: "absolute", right: 16 },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, gap: 10 },
  modalButtonCancel: { padding: 15, flex: 1, alignItems: "center", justifyContent: "center" },
  modalButtonSave: { padding: 15, flex: 1, alignItems: "center", justifyContent: "center", borderRadius: 12 },
  textCancel: { color: "#999", fontFamily: "PlusJakartaSans_600SemiBold", fontSize: 16 },
  textSave: { color: "#FFF", fontFamily: "PlusJakartaSans_700Bold", fontSize: 16 },

  langModalContent: { width: "80%", borderRadius: 16, padding: 20 },
  langOption: { paddingVertical: 15, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  langText: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },
});