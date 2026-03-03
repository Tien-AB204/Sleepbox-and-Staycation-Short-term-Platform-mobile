import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

// --- IMPORT CÁC FILE CẤU HÌNH TỪ THƯ MỤC GỐC ---
// Dùng dấu .. để thoát ra khỏi thư mục app
import { ThemeProvider, useTheme } from "../context/ThemeContext"; 
import "../config/i18n"; // Import file cấu hình để nó chạy
import { loadLanguage } from "../config/i18n"; 

// Tạo component con để lấy được dữ liệu từ ThemeContext
function AppContent() {
  // Lấy màu sắc và chế độ sáng tối từ Context
  const { colors, isDarkMode } = useTheme();

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        // Đổi màu nền vùng an toàn (tai thỏ/đáy) theo chế độ
        { backgroundColor: isDarkMode ? "#000000" : "#ffffff" } 
      ]} 
      edges={["top", "bottom"]}
    >
      
      {/* Nội dung App: Đổi màu nền theo theme (Trắng hoặc Đen dịu) */}
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          {/* SỬA Ở ĐÂY: Thay (guest) và (host) thành (tabs) và (screens) */}
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(screens)" />
        </Stack>
      </View>

      {/* StatusBar: 
          - style: Chữ trắng (light) hoặc đen (dark) 
          - backgroundColor: Màu nền của thanh status
      */}
      <StatusBar 
        style={isDarkMode ? "light" : "dark"} 
        backgroundColor={isDarkMode ? "#000000" : "#ffffff"} 
      />
      
    </SafeAreaView>
  );
}

// Component chính
export default function RootLayout() {
  
  // Load ngôn ngữ đã lưu khi mở App
  useEffect(() => {
    loadLanguage(); 
  }, []);

  return (
    // Bọc ThemeProvider ở ngoài cùng để toàn bộ App nhận được Context
    <ThemeProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});