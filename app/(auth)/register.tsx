import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";
import GoogleIcon from "../../components/GoogleIcon";
import { authService } from "../../services/authService";

export default function RegisterScreen() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"guest" | "host">("guest");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!fontsLoaded) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" color="#8D613A" /></View>;

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) return Alert.alert("Error", "Please fill all fields!");
    if (password !== confirmPassword) return Alert.alert("Error", "Passwords don't match!");
    setIsLoading(true);
    try {
      const response = await authService.signup({ email, password, confirmPassword });
      if (response.success) {
        Alert.alert("Success", "Account created successfully!");
        router.replace("/(tabs)/home"); 
      } else Alert.alert("Error", response.message);
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
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join BoxHub today</Text>
            </View>

            <View style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Sign up as</Text>
                <View style={styles.roleContainer}>
                  <TouchableOpacity style={[styles.roleButton, role === "guest" && styles.roleButtonActive]} onPress={() => setRole("guest")}>
                    <Text style={[styles.roleText, role === "guest" && styles.roleTextActive]}>Guest</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.roleButton, role === "host" && styles.roleButtonActive]} onPress={() => setRole("host")}>
                    <Text style={[styles.roleText, role === "host" && styles.roleTextActive]}>Host</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={styles.input} placeholder="hello@gmail.com" placeholderTextColor="#999" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputContainer}>
                  <TextInput style={[styles.input, styles.passwordInput]} placeholder="••••••••••••" placeholderTextColor="#999" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} autoCapitalize="none" />
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#B69069" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} onPress={handleSignUp} disabled={isLoading}>
                {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.signUpButtonText}>Sign Up</Text>}
              </TouchableOpacity>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => router.back()}><Text style={styles.loginLink}>Login</Text></TouchableOpacity>
              </View>
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 40 },
  header: { marginBottom: 30, alignItems: "center" },
  title: { fontSize: 36, color: "#613F24", fontFamily: "Poppins_700Bold" },
  subtitle: { fontSize: 15, color: "#888", fontFamily: "Poppins_400Regular" },
  formCard: { backgroundColor: "#FFF", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 13, color: "#888", marginBottom: 6, fontFamily: "Poppins_500Medium" },
  inputContainer: { position: "relative" }, // <--- ĐÃ SỬA LỖI Ở ĐÂY
  input: { backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, color: "#262626", fontFamily: "Poppins_400Regular" },
  passwordInput: { paddingRight: 50 },
  eyeIcon: { position: "absolute", right: 16, top: "50%", transform: [{ translateY: -10 }] },
  roleContainer: { flexDirection: "row", gap: 12 },
  roleButton: { flex: 1, backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 12, paddingVertical: 12, alignItems: "center" },
  roleButtonActive: { backgroundColor: "#8D613A", borderColor: "#8D613A" },
  roleText: { fontSize: 14, color: "#888", fontFamily: "Poppins_600SemiBold" },
  roleTextActive: { color: "#FFFFFF" },
  signUpButton: { backgroundColor: "#8D613A", borderRadius: 16, paddingVertical: 16, alignItems: "center", marginTop: 10, marginBottom: 20 },
  signUpButtonDisabled: { opacity: 0.7 },
  signUpButtonText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Poppins_700Bold" },
  loginContainer: { flexDirection: "row", justifyContent: "center" },
  loginText: { fontSize: 14, color: "#888", fontFamily: "Poppins_400Regular" },
  loginLink: { fontSize: 14, color: "#EA9459", fontFamily: "Poppins_700Bold" },
});