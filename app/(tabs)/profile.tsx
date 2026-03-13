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
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../context/ThemeContext";
import { authService } from "../../services/authService";
import GoogleIcon from "../../components/GoogleIcon";

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

  // Dữ liệu User
  const [userInfo, setUserInfo] = useState({
    username: "tien_ab204",
    firstName: "Trần",
    lastName: "Tiến",
    email: "guest@gmail.com",
    isEmailVerified: true,
    phone: "0912 345 678",
    gender: "Nam",
    dob: "15/08/1999",
    avatar: "https://i.pravatar.cc/300",
  });
  const [tempUserInfo, setTempUserInfo] = useState(userInfo);

  // Quản lý các Modal Screen
  const [activeScreen, setActiveScreen] = useState<"main" | "accountInfo" | "security" | "notifications">("main");
  const [isLangVisible, setLangVisible] = useState(false);

  // Quản lý trạng thái Edit Inline trong "Thông tin tài khoản"
  // "none" = đang xem | "personal" = sửa tên/giới tính/năm sinh | "email" = sửa email | "phone" = sửa sđt
  const [editSection, setEditSection] = useState<"none" | "personal" | "email" | "phone">("none");
  const [isEditUsernameVisible, setIsEditUsernameVisible] = useState(false);

  // Quản lý Modal Xóa tài khoản
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [deleteReason, setDeleteReason] = useState<string>("");
  const [isReasonSelectorVisible, setIsReasonSelectorVisible] = useState(false);

  // Quản lý Settings Thông báo
  const [notiBooking, setNotiBooking] = useState(true);
  const [notiSystem, setNotiSystem] = useState(true);
  const [notiCheckin, setNotiCheckin] = useState(false);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    // Giả lập load
    setTimeout(() => {
      setTempUserInfo(userInfo);
      setIsLoadingProfile(false);
    }, 500);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.replace("/(auth)/login");
  };

  const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
    setLangVisible(false);
  };

  const handleSaveSection = () => {
    setUserInfo(tempUserInfo);
    setEditSection("none");
  };

  const handleCancelSection = () => {
    setTempUserInfo(userInfo); // Reset lại data cũ
    setEditSection("none");
  };

  // THEME
  const themeStyles = {
    screenBg: { backgroundColor: isDarkMode ? "#121212" : "#F5F6F8" },
    card: { backgroundColor: isDarkMode ? "#1E1E1E" : "#FFFFFF" },
    text: { color: colors.text },
    subText: { color: colors.subText },
    border: { borderBottomColor: isDarkMode ? "#333" : "#EFEFEF" },
    inputBg: { backgroundColor: isDarkMode ? "#2C2C2C" : "#F9F9F9", borderColor: isDarkMode ? "#444" : "#EFEFEF" },
  };

  if (!fontsLoaded || isLoadingProfile) {
    return (
      <View style={[styles.loadingContainer, themeStyles.screenBg]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // =======================================================
  // CÁC HÀM RENDER UI DÙNG CHUNG
  // =======================================================
  const renderSettingRow = (icon: string, label: string, value?: string, onPress?: () => void, isLast = false, valueColor?: string) => (
    <TouchableOpacity style={[styles.row, !isLast && styles.rowBorder, !isLast && themeStyles.border]} onPress={onPress} disabled={!onPress}>
      <View style={styles.rowLeft}>
        <Ionicons name={icon as any} size={22} color={colors.subText} style={styles.rowIcon} />
        <Text style={[styles.rowLabel, themeStyles.text]}>{label}</Text>
      </View>
      <View style={styles.rowRight}>
        {value && <Text style={[styles.rowValue, themeStyles.subText, valueColor ? { color: valueColor } : {}]}>{value}</Text>}
        {onPress && <Ionicons name="chevron-forward" size={20} color={colors.subText} />}
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string) => (
    <Text style={[styles.sectionHeaderLabel, themeStyles.subText]}>{title}</Text>
  );

  // =======================================================
  // MÀN HÌNH 2: THÔNG TIN TÀI KHOẢN (SUB-SCREEN MODAL)
  // =======================================================
  const renderAccountInfoScreen = () => (
    <Modal visible={activeScreen === "accountInfo"} animationType="slide">
      <SafeAreaView style={[styles.container, themeStyles.screenBg]}>
        <View style={[styles.subHeader, themeStyles.card]}>
          <TouchableOpacity onPress={() => { setActiveScreen("main"); setEditSection("none"); }} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, themeStyles.text]}>{t("account_info")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            
            {/* AVATAR & USERNAME */}
            <View style={styles.accountTopSection}>
              <View style={styles.avatarWrapper}>
                <Image source={{ uri: userInfo.avatar }} style={styles.avatarLarge} />
                <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: colors.primary }]}>
                  <Ionicons name="pencil" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
              <View style={styles.usernameWrapper}>
                <Text style={[styles.accountUsername, themeStyles.text]}>{userInfo.username}</Text>
                <TouchableOpacity onPress={() => setIsEditUsernameVisible(true)}>
                  <Ionicons name="pencil" size={18} color={colors.subText} style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            </View>

            {/* BLOCK 1: DỮ LIỆU CÁ NHÂN */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTopHeader}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>{t("personal_data")}</Text>
                <TouchableOpacity onPress={() => editSection === "personal" ? handleCancelSection() : setEditSection("personal")}>
                  <Text style={[styles.editSectionText, { color: editSection === "personal" ? "#EF4444" : colors.primary }]}>
                    {editSection === "personal" ? t("cancel") : t("change")}
                  </Text>
                </TouchableOpacity>
              </View>

              {editSection === "personal" ? (
                // Đang Edit
                <View style={[themeStyles.card, styles.editCard]}>
                  <Text style={[styles.inputLabel, themeStyles.subText]}>{t("first_name")}</Text>
                  <TextInput style={[styles.inputBox, themeStyles.inputBg, themeStyles.text]} value={tempUserInfo.firstName} onChangeText={t => setTempUserInfo({...tempUserInfo, firstName: t})} />
                  
                  <Text style={[styles.inputLabel, themeStyles.subText]}>{t("last_name")}</Text>
                  <TextInput style={[styles.inputBox, themeStyles.inputBg, themeStyles.text]} value={tempUserInfo.lastName} onChangeText={t => setTempUserInfo({...tempUserInfo, lastName: t})} />

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, themeStyles.subText]}>{t("dob", "Ngày sinh")}</Text>
                      <View style={styles.inputWithIcon}>
                        <TextInput style={[styles.inputBox, themeStyles.inputBg, themeStyles.text, { paddingRight: 40 }]} value={tempUserInfo.dob} onChangeText={t => setTempUserInfo({...tempUserInfo, dob: t})} placeholder="DD/MM/YYYY" placeholderTextColor={colors.subText} />
                        <Ionicons name="calendar-outline" size={20} color={colors.subText} style={styles.inputIconRight} />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, themeStyles.subText]}>{t("gender", "Giới tính")}</Text>
                      <View style={styles.inputWithIcon}>
                        <TextInput style={[styles.inputBox, themeStyles.inputBg, themeStyles.text, { paddingRight: 40 }]} value={tempUserInfo.gender} onChangeText={t => setTempUserInfo({...tempUserInfo, gender: t})} />
                        <Ionicons name="chevron-down" size={20} color={colors.subText} style={styles.inputIconRight} />
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={[styles.saveBtnInline, { backgroundColor: colors.primary }]} onPress={handleSaveSection}>
                    <Text style={styles.saveBtnText}>{t("save", "Lưu")}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // View Chỉ Đọc
                <TouchableOpacity style={[themeStyles.card, styles.readOnlyCard]} onPress={() => setEditSection("personal")} activeOpacity={0.8}>
                  <Text style={[styles.inputLabel, themeStyles.subText]}>{t("full_name", "Tên đầy đủ")}</Text>
                  <Text style={[styles.readOnlyValue, themeStyles.text]}>{userInfo.firstName} {userInfo.lastName}</Text>
                  <View style={{ flexDirection: 'row', marginTop: 16 }}>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, themeStyles.subText]}>{t("dob", "Ngày sinh")}</Text>
                      <Text style={[styles.readOnlyValue, themeStyles.text]}>{userInfo.dob}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.inputLabel, themeStyles.subText]}>{t("gender", "Giới tính")}</Text>
                      <Text style={[styles.readOnlyValue, themeStyles.text]}>{userInfo.gender}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>

            {/* BLOCK 2: EMAIL */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTopHeader}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>Email</Text>
                <TouchableOpacity onPress={() => editSection === "email" ? handleCancelSection() : setEditSection("email")}>
                  <Text style={[styles.editSectionText, { color: editSection === "email" ? "#EF4444" : colors.primary }]}>
                    {editSection === "email" ? t("cancel") : t("change")}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.sectionDesc, themeStyles.subText]}>Email sẽ được sử dụng để đăng nhập và nhận thông báo.</Text>

              {editSection === "email" ? (
                <View style={[themeStyles.card, styles.editCard]}>
                  <TextInput style={[styles.inputBox, themeStyles.inputBg, themeStyles.text]} value={tempUserInfo.email} onChangeText={t => setTempUserInfo({...tempUserInfo, email: t})} keyboardType="email-address" />
                  <TouchableOpacity style={[styles.saveBtnInline, { backgroundColor: colors.primary }]} onPress={handleSaveSection}>
                    <Text style={styles.saveBtnText}>{t("save", "Lưu")}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[themeStyles.card, styles.readOnlyCard]} onPress={() => setEditSection("email")} activeOpacity={0.8}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[styles.readOnlyValue, themeStyles.text]}>{userInfo.email}</Text>
                  </View>
                  {userInfo.isEmailVerified && <Text style={styles.verifiedText}>Đã xác minh</Text>}
                </TouchableOpacity>
              )}
            </View>

            {/* BLOCK 3: SỐ DI ĐỘNG */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTopHeader}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>{t("phone", "Số di động")}</Text>
                <TouchableOpacity onPress={() => editSection === "phone" ? handleCancelSection() : setEditSection("phone")}>
                  <Text style={[styles.editSectionText, { color: editSection === "phone" ? "#EF4444" : colors.primary }]}>
                    {editSection === "phone" ? t("cancel") : t("change")}
                  </Text>
                </TouchableOpacity>
              </View>
              <Text style={[styles.sectionDesc, themeStyles.subText]}>Số điện thoại di động sẽ được sử dụng để đăng nhập và nhận thông báo.</Text>

              {editSection === "phone" ? (
                <View style={[themeStyles.card, styles.editCard]}>
                  <TextInput style={[styles.inputBox, themeStyles.inputBg, themeStyles.text]} value={tempUserInfo.phone} onChangeText={t => setTempUserInfo({...tempUserInfo, phone: t})} keyboardType="phone-pad" />
                  <TouchableOpacity style={[styles.saveBtnInline, { backgroundColor: colors.primary }]} onPress={handleSaveSection}>
                    <Text style={styles.saveBtnText}>{t("save", "Lưu")}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[themeStyles.card, styles.readOnlyCard]} onPress={() => setEditSection("phone")} activeOpacity={0.8}>
                  <Text style={[styles.readOnlyValue, themeStyles.text]}>{userInfo.phone}</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* BLOCK 4: TÀI KHOẢN LIÊN KẾT */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionTopHeader}>
                <Text style={[styles.sectionTitle, themeStyles.text]}>{t("linked_accounts")}</Text>
              </View>
              <View style={[themeStyles.card, styles.readOnlyCard]}>
                <View style={styles.linkedRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <GoogleIcon size={24} />
                    <Text style={[styles.linkedText, themeStyles.text, { marginLeft: 12 }]}>Google</Text>
                  </View>
                  {/* Trạng thái đã liên kết, giả lập nút Liên kết */}
                  <TouchableOpacity style={[styles.linkBtn, { backgroundColor: colors.primary }]}>
                    <Text style={styles.linkBtnText}>{t("link_btn", "Liên kết")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Modal Con: Sửa Username */}
        <Modal visible={isEditUsernameVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlayDark}>
            <View style={[styles.bottomSheetModal, themeStyles.card]}>
              <View style={styles.dragIndicator} />
              <Text style={[styles.bottomSheetTitle, themeStyles.text]}>{t("edit_username")}</Text>
              <Text style={[styles.inputLabel, themeStyles.subText]}>{t("your_preferred_username")}</Text>
              <View style={styles.inputWithIcon}>
                <Text style={[styles.prefixAt, themeStyles.text]}>@</Text>
                <TextInput 
                  style={[styles.inputBox, themeStyles.inputBg, themeStyles.text, { paddingLeft: 40, marginTop: 8 }]} 
                  value={tempUserInfo.username} 
                  onChangeText={t => setTempUserInfo({...tempUserInfo, username: t})} 
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity 
                style={[styles.fullWidthBtn, { backgroundColor: colors.primary, marginTop: 24 }]} 
                onPress={() => { setUserInfo(tempUserInfo); setIsEditUsernameVisible(false); }}
              >
                <Text style={styles.fullWidthBtnText}>{t("save", "Lưu")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </Modal>
  );

  // =======================================================
  // MÀN HÌNH 3: MẬT KHẨU & BẢO MẬT (SUB-SCREEN MODAL)
  // =======================================================
  const renderSecurityScreen = () => (
    <Modal visible={activeScreen === "security"} animationType="slide">
      <SafeAreaView style={[styles.container, themeStyles.screenBg]}>
        <View style={[styles.subHeader, themeStyles.card]}>
          <TouchableOpacity onPress={() => setActiveScreen("main")} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, themeStyles.text]}>{t("password_security")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.cardGroup, themeStyles.card, { marginTop: 16 }]}>
            {renderSettingRow("lock-closed-outline", t("change_password"), "", () => {})}
            {/* Nút Xóa Tài Khoản */}
            <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={() => setIsDeleteModalVisible(true)}>
              <View style={styles.rowLeft}>
                <Ionicons name="person-remove-outline" size={22} color="#EF4444" style={styles.rowIcon} />
                <View>
                  <Text style={[styles.rowLabel, { color: "#EF4444" }]}>{t("delete_account")}</Text>
                  <Text style={[styles.rowDesc, themeStyles.subText]}>
                    Sau khi tài khoản của bạn bị xóa, bạn sẽ không thể truy xuất dữ liệu của mình. Hành động này không thể hoàn tác.
                  </Text>
                </View>
              </View>
              <Text style={[styles.rowValue, { color: "#EF4444", fontFamily: 'PlusJakartaSans_600SemiBold' }]}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal Con: Xóa Tài Khoản */}
        <Modal visible={isDeleteModalVisible} animationType="slide" transparent={false}>
          <SafeAreaView style={[styles.container, themeStyles.screenBg]}>
            <View style={[styles.subHeader, themeStyles.card]}>
              <TouchableOpacity onPress={() => setIsDeleteModalVisible(false)} style={{ padding: 8 }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.subHeaderTitle, themeStyles.text]}>{t("delete_account")}</Text>
              <View style={{ width: 40 }} />
            </View>

            <View style={{ flex: 1, padding: 24, alignItems: 'center' }}>
              <Text style={[styles.deleteTopText, themeStyles.text]}>{t("you_are_about_to_delete")}</Text>
              
              <View style={[styles.deleteTargetCard, themeStyles.card, themeStyles.border]}>
                <View style={[styles.deleteAvatarDummy, { backgroundColor: colors.primary + '20' }]}>
                  <Text style={{ color: colors.primary, fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20 }}>
                    {userInfo.firstName[0]}{userInfo.lastName[0]}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.deleteName, themeStyles.text]}>{userInfo.firstName} {userInfo.lastName}</Text>
                  <Text style={[styles.deleteId, themeStyles.subText]}>{userInfo.email}</Text>
                </View>
              </View>

              <Text style={[styles.deleteReasonLabel, themeStyles.subText]}>{t("why_delete")}</Text>
              
              <TouchableOpacity style={[styles.reasonSelectorBtn, themeStyles.card, themeStyles.border]} onPress={() => setIsReasonSelectorVisible(true)}>
                <Text style={[styles.reasonSelectorText, themeStyles.text]}>{deleteReason || t("select_reason")}</Text>
                <Ionicons name="chevron-down" size={20} color={colors.subText} />
              </TouchableOpacity>

              <View style={{ flex: 1 }} />

              <TouchableOpacity style={[styles.fullWidthBtn, { backgroundColor: deleteReason ? "#EF4444" : "#E5E5E5" }]} disabled={!deleteReason}>
                <Text style={[styles.fullWidthBtnText, { color: deleteReason ? "#FFF" : "#999" }]}>{t("continue")}</Text>
              </TouchableOpacity>
            </View>
            
            {/* Modal Chọn lý do */}
            <Modal visible={isReasonSelectorVisible} transparent={true} animationType="fade">
              <View style={styles.modalOverlayDark}>
                <View style={[styles.bottomSheetModal, themeStyles.card]}>
                  <View style={styles.sheetHeaderRow}>
                     <Text style={[styles.bottomSheetTitle, themeStyles.text]}>Lý do xóa tài khoản</Text>
                     <TouchableOpacity onPress={() => setIsReasonSelectorVisible(false)}>
                        <Ionicons name="close" size={24} color={colors.text} />
                     </TouchableOpacity>
                  </View>
                  
                  {[
                    t("reason_email"), t("reason_complaint"), t("reason_other_account"), t("reason_privacy"), t("reason_other")
                  ].map((reason, index) => (
                    <TouchableOpacity key={index} style={[styles.reasonItem, themeStyles.border]} onPress={() => setDeleteReason(reason)}>
                      <Ionicons name={deleteReason === reason ? "radio-button-on" : "radio-button-off"} size={22} color={deleteReason === reason ? colors.primary : colors.subText} />
                      <Text style={[styles.reasonText, themeStyles.text]}>{reason}</Text>
                    </TouchableOpacity>
                  ))}
                  
                  <TouchableOpacity style={[styles.fullWidthBtn, { backgroundColor: colors.primary, marginTop: 24 }]} onPress={() => setIsReasonSelectorVisible(false)}>
                    <Text style={styles.fullWidthBtnText}>{t("choose")}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    </Modal>
  );

  // =======================================================
  // MÀN HÌNH 4: CÀI ĐẶT THÔNG BÁO (SUB-SCREEN MODAL)
  // =======================================================
  const renderNotificationsScreen = () => (
    <Modal visible={activeScreen === "notifications"} animationType="slide">
      <SafeAreaView style={[styles.container, themeStyles.screenBg]}>
        <View style={[styles.subHeader, themeStyles.card]}>
          <TouchableOpacity onPress={() => setActiveScreen("main")} style={{ padding: 8 }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.subHeaderTitle, themeStyles.text]}>{t("notification_settings")}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView style={styles.content}>
          <View style={[styles.cardGroup, themeStyles.card, { marginTop: 16 }]}>
            
            <View style={[styles.row, styles.rowBorder, themeStyles.border]}>
              <View style={styles.rowLeftNoIcon}>
                <Text style={[styles.rowLabel, themeStyles.text]}>{t("noti_booking")}</Text>
                <Text style={[styles.rowDesc, themeStyles.subText]}>{t("noti_booking_desc")}</Text>
              </View>
              <Switch value={notiBooking} onValueChange={setNotiBooking} trackColor={{ false: "#E5E5E5", true: colors.primary }} thumbColor="#FFFFFF" />
            </View>

            <View style={[styles.row, styles.rowBorder, themeStyles.border]}>
              <View style={styles.rowLeftNoIcon}>
                <Text style={[styles.rowLabel, themeStyles.text]}>{t("noti_system")}</Text>
                <Text style={[styles.rowDesc, themeStyles.subText]}>{t("noti_system_desc")}</Text>
              </View>
              <Switch value={notiSystem} onValueChange={setNotiSystem} trackColor={{ false: "#E5E5E5", true: colors.primary }} thumbColor="#FFFFFF" />
            </View>

            <View style={[styles.row, { borderBottomWidth: 0 }]}>
              <View style={styles.rowLeftNoIcon}>
                <Text style={[styles.rowLabel, themeStyles.text]}>{t("noti_checkin")}</Text>
                <Text style={[styles.rowDesc, themeStyles.subText]}>{t("noti_checkin_desc")}</Text>
              </View>
              <Switch value={notiCheckin} onValueChange={setNotiCheckin} trackColor={{ false: "#E5E5E5", true: colors.primary }} thumbColor="#FFFFFF" />
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  // =======================================================
  // UI CHÍNH (MAIN SCREEN)
  // =======================================================
  return (
    <SafeAreaView style={[styles.container, themeStyles.screenBg]}>
      {/* Header gọn gàng giống mẫu */}
      <View style={[styles.mainHeader, themeStyles.card]}>
         <Text style={[styles.mainHeaderTitle, themeStyles.text]}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Nhóm 1: Tài khoản & Bảo mật */}
        {renderSectionHeader(t("account_security"))}
        <View style={[styles.cardGroup, themeStyles.card]}>
          {renderSettingRow("person-outline", t("account_info"), "", () => setActiveScreen("accountInfo"))}
          {renderSettingRow("shield-checkmark-outline", t("password_security"), "", () => setActiveScreen("security"), true)}
        </View>

        {/* Nhóm 2: Cài đặt */}
        {renderSectionHeader(t("settings"))}
        <View style={[styles.cardGroup, themeStyles.card]}>
          {renderSettingRow("cash-outline", t("currency"), t("vnd"), () => {})}
          {renderSettingRow("globe-outline", t("language"), i18n.language === "vi" ? "Tiếng Việt" : "English (US)", () => setLangVisible(true))}
          
          {/* Row Theme Toggle đặc biệt */}
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <View style={styles.rowLeft}>
              <Ionicons name={isDarkMode ? "moon-outline" : "sunny-outline"} size={22} color={colors.subText} style={styles.rowIcon} />
              <Text style={[styles.rowLabel, themeStyles.text]}>{t("appearance")}</Text>
            </View>
            <View style={styles.rowRight}>
               <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: "#E5E5E5", true: colors.primary }} thumbColor="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Nhóm 3: Khác */}
        <View style={[styles.cardGroup, themeStyles.card]}>
           {renderSettingRow("notifications-outline", t("notification_settings"), "", () => setActiveScreen("notifications"), true)}
        </View>

        {/* Nhóm 4: Hệ thống */}
        <View style={[styles.cardGroup, themeStyles.card]}>
          {renderSettingRow("information-circle-outline", t("app_version"), "5.39.0", undefined)}
          {renderSettingRow("document-text-outline", t("terms_conditions"), "", () => {})}
          {renderSettingRow("lock-closed-outline", t("privacy_policy"), "", () => {})}
          {renderSettingRow("business-outline", t("about_us"), "", () => {}, true)}
        </View>

        {/* Đăng xuất */}
        <View style={[styles.cardGroup, themeStyles.card, { marginBottom: 40 }]}>
           <TouchableOpacity style={[styles.row, { borderBottomWidth: 0 }]} onPress={handleLogout}>
             <View style={styles.rowLeft}>
               <Ionicons name="power-outline" size={22} color="#EF4444" style={styles.rowIcon} />
               <Text style={[styles.rowLabel, { color: "#EF4444", fontFamily: 'PlusJakartaSans_700Bold' }]}>{t("logout")}</Text>
             </View>
           </TouchableOpacity>
        </View>

      </ScrollView>

      {/* Modal Chọn Ngôn Ngữ */}
      <Modal visible={isLangVisible} animationType="fade" transparent={true}>
        <TouchableOpacity style={styles.modalOverlayDark} activeOpacity={1} onPress={() => setLangVisible(false)}>
          <View style={[styles.langModalContent, themeStyles.card]}>
            <Text style={[styles.modalTitle, themeStyles.text]}>{t("language")}</Text>
            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage("en")}>
              <Text style={[styles.langText, themeStyles.text]}>English (US)</Text>
              {i18n.language === "en" && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: themeStyles.border.borderBottomColor }} />
            <TouchableOpacity style={styles.langOption} onPress={() => changeLanguage("vi")}>
              <Text style={[styles.langText, themeStyles.text]}>Tiếng Việt</Text>
              {i18n.language === "vi" && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Gọi render các sub-screens */}
      {renderAccountInfoScreen()}
      {renderSecurityScreen()}
      {renderNotificationsScreen()}

    </SafeAreaView>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { flex: 1 },

  // Main Header
  mainHeader: { paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' },
  mainHeaderTitle: { fontSize: 24, fontFamily: "PlusJakartaSans_700Bold" },

  // Sub Header (Modals)
  subHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width: 0, height: 2}, shadowRadius: 4 },
  subHeaderTitle: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold" },

  // Menu List UI
  sectionHeaderLabel: { fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold", textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8, letterSpacing: 0.5 },
  cardGroup: { marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16 },
  rowBorder: { borderBottomWidth: 1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  rowLeftNoIcon: { flex: 1, paddingRight: 16 },
  rowIcon: { marginRight: 12 },
  rowLabel: { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium" },
  rowDesc: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", marginTop: 4, lineHeight: 18 },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", marginRight: 8 },

  // Account Info - Top
  accountTopSection: { alignItems: 'center', paddingVertical: 30 },
  avatarWrapper: { position: 'relative', marginBottom: 16 },
  avatarLarge: { width: 100, height: 100, borderRadius: 50 },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  usernameWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  accountUsername: { fontSize: 22, fontFamily: "PlusJakartaSans_700Bold" },
  accountSubtitle: { fontSize: 14, fontFamily: "PlusJakartaSans_400Regular" },

  // Account Info - Sections
  sectionContainer: { marginBottom: 20 },
  sectionTopHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold" },
  sectionDesc: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular", paddingHorizontal: 20, marginBottom: 12 },
  editSectionText: { fontSize: 15, fontFamily: "PlusJakartaSans_600SemiBold" },
  
  readOnlyCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  editCard: { marginHorizontal: 16, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  
  inputLabel: { fontSize: 13, fontFamily: "PlusJakartaSans_500Medium", marginBottom: 6 },
  readOnlyValue: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold", marginBottom: 4 },
  verifiedText: { fontSize: 12, color: '#10B981', fontFamily: "PlusJakartaSans_600SemiBold", marginTop: 4 },
  
  inputBox: { borderWidth: 1, borderRadius: 12, padding: 14, fontSize: 15, fontFamily: "PlusJakartaSans_500Medium", marginBottom: 16 },
  inputWithIcon: { position: 'relative' },
  inputIconRight: { position: 'absolute', right: 12, top: 14 },
  prefixAt: { position: 'absolute', left: 16, top: 15, fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold", zIndex: 1 },

  saveBtnInline: { paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#FFF', fontSize: 15, fontFamily: "PlusJakartaSans_700Bold" },

  // Linked Accounts
  linkedRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  linkedText: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold" },
  linkBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  linkBtnText: { color: '#FFF', fontSize: 13, fontFamily: "PlusJakartaSans_600SemiBold" },

  // Bottom Sheets (Edit Username, Delete Reason)
  modalOverlayDark: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  bottomSheetModal: { width: "90%", borderRadius: 24, padding: 24, elevation: 5 },
  dragIndicator: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  bottomSheetTitle: { fontSize: 18, fontFamily: "PlusJakartaSans_700Bold", textAlign: 'center', marginBottom: 20 },
  sheetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },

  // Language Modal
  langModalContent: { width: "80%", borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 20, fontFamily: "PlusJakartaSans_700Bold", marginBottom: 20, textAlign: "center" },
  langOption: { paddingVertical: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  langText: { fontSize: 16, fontFamily: "PlusJakartaSans_500Medium" },

  // Delete Modal Full Screen
  deleteTopText: { fontSize: 16, fontFamily: "PlusJakartaSans_600SemiBold", marginBottom: 16 },
  deleteTargetCard: { flexDirection: 'row', alignItems: 'center', width: '100%', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 32 },
  deleteAvatarDummy: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  deleteName: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", marginBottom: 4 },
  deleteId: { fontSize: 13, fontFamily: "PlusJakartaSans_400Regular" },
  deleteReasonLabel: { fontSize: 14, fontFamily: "PlusJakartaSans_500Medium", marginBottom: 12, alignSelf: 'flex-start' },
  reasonSelectorBtn: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: 16, borderRadius: 12, borderWidth: 1 },
  reasonSelectorText: { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium" },
  
  reasonItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  reasonText: { fontSize: 15, fontFamily: "PlusJakartaSans_500Medium", marginLeft: 12 },

  fullWidthBtn: { width: '100%', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  fullWidthBtnText: { fontSize: 16, fontFamily: "PlusJakartaSans_700Bold", color: '#FFF' },
});