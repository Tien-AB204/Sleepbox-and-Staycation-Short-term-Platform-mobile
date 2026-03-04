import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";
import GoogleIcon from "../../components/GoogleIcon";
import { authService } from "../../services/authService";

export default function LoginScreen() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!fontsLoaded) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" color="#8D613A" /></View>;

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter both email and password");
    setIsLoading(true);
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.user) {
        if (response.user.role === "host") Alert.alert("Access Denied", "App is for Guests only.");
        else router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthBackground>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Login to access your account</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="guest@gmail.com" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={[styles.input, styles.passwordInput]} placeholder="••••••••••••" placeholderTextColor="#999" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} autoCapitalize="none" />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#B69069" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Sửa lại đường dẫn (thêm 'as any' để bỏ qua cảnh báo nếu Expo Router chưa cập nhật) */}
              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push("/(auth)/forgotpassword" as any)}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.loginButton, isLoading ? styles.loginButtonDisabled : {}]} onPress={handleLogin} disabled={isLoading}>
                {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Login</Text>}
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/(auth)/register" as any)}><Text style={styles.signUpLink}>Sign Up</Text></TouchableOpacity>
              </View>

              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} /><Text style={styles.dividerText}>Or Sign In With</Text><View style={styles.dividerLine} />
              </View>

              <TouchableOpacity style={styles.googleButton} onPress={() => console.log("Google sign in")}>
                <View style={styles.googleIconContainer}><GoogleIcon size={24} /></View>
                <Text style={styles.googleButtonText}>Google</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 40, alignItems: "center" },
  title: { fontSize: 36, color: "#613F24", fontFamily: "Poppins_700Bold" },
  subtitle: { fontSize: 15, color: "#888", fontFamily: "Poppins_400Regular" },
  formCard: { backgroundColor: "#FFF", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: "#888", marginBottom: 6, fontFamily: "Poppins_500Medium" },
  inputContainer: { position: "relative" }, // <--- Lỗi 'relative: "position"' đã được sửa
  input: { backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, color: "#262626", fontFamily: "Poppins_400Regular" },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: "absolute", right: 16, top: "50%", transform: [{ translateY: -10 }] },
  forgotPasswordContainer: { alignItems: "flex-end", marginBottom: 30 },
  forgotPasswordText: { fontSize: 13, color: "#EA9459", fontFamily: "Poppins_600SemiBold" },
  loginButton: { backgroundColor: "#8D613A", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginBottom: 20 },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Poppins_700Bold" },
  signUpContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 24 },
  signUpText: { fontSize: 14, color: "#888", fontFamily: "Poppins_400Regular" },
  signUpLink: { fontSize: 14, color: "#EA9459", fontFamily: "Poppins_700Bold" },
  dividerContainer: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#EAEAEA" },
  dividerText: { marginHorizontal: 16, fontSize: 13, color: "#888", fontFamily: "Poppins_400Regular" },
  googleButton: { backgroundColor: "#FFF", borderWidth: 1, borderColor: "#EAEAEA", borderRadius: 16, paddingVertical: 14, flexDirection: "row", alignItems: "center", justifyContent: "center" },
  googleIconContainer: { marginRight: 12 },
  googleButtonText: { fontSize: 15, color: "#262626", fontFamily: "Poppins_600SemiBold" },
});