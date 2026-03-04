import { Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, useFonts } from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AuthBackground from "../../components/AuthBackground";

export default function ForgotPasswordScreen() {
  const [fontsLoaded] = useFonts({ Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold });
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  if (!fontsLoaded) return <View style={{ flex: 1, justifyContent: "center" }}><ActivityIndicator size="large" color="#8D613A" /></View>;

  const handleSendLink = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true); 
    }, 1500);
  };

  return (
    <AuthBackground>
      <SafeAreaView style={styles.container}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
           <Ionicons name="arrow-back" size={24} color="#613F24" />
        </TouchableOpacity>

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            
            <View style={styles.header}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                {isSent ? "We have sent a reset link to your email." : "Enter your email to receive a password reset link."}
              </Text>
            </View>

            {!isSent ? (
              <View style={styles.formCard}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.input} 
                      placeholder="Enter your email" 
                      placeholderTextColor="#999" 
                      value={email} 
                      onChangeText={setEmail} 
                      keyboardType="email-address" 
                      autoCapitalize="none" 
                    />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[styles.primaryButton, isLoading && styles.buttonDisabled]} 
                  onPress={handleSendLink} 
                  disabled={isLoading || !email}
                >
                  {isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Text style={styles.primaryButtonText}>Submit</Text>}
                </TouchableOpacity>
              </View>

            ) : (
              
              <View style={styles.formCard}>
                <View style={styles.iconCircle}>
                   <Ionicons name="mail-outline" size={40} color="#8D613A" />
                </View>
                <Text style={styles.successTitle}>Check your email</Text>
                <Text style={styles.successDesc}>
                  Please check your inbox at <Text style={{fontFamily: 'Poppins_600SemiBold', color: '#613F24'}}>{email}</Text> and follow the link to securely reset your password.
                </Text>
                
                {/* Đã sửa đường dẫn thành /login */}
                <TouchableOpacity style={styles.primaryButton} onPress={() => router.replace("/(auth)/login")}>
                  <Text style={styles.primaryButtonText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            )}

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </AuthBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  backButton: { padding: 20, position: 'absolute', top: 10, left: 0, zIndex: 10 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 100, paddingBottom: 40 },
  header: { marginBottom: 40, alignItems: "center" },
  title: { fontSize: 30, color: "#613F24", fontFamily: "Poppins_700Bold", textAlign: 'center' },
  subtitle: { fontSize: 14, color: "#888", fontFamily: "Poppins_400Regular", textAlign: 'center', marginTop: 8, paddingHorizontal: 20 },
  
  formCard: { backgroundColor: "#FFF", borderRadius: 24, padding: 24, shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 4, alignItems: 'center' },
  inputGroup: { marginBottom: 24, width: '100%' },
  label: { fontSize: 13, color: "#888", marginBottom: 6, fontFamily: "Poppins_500Medium" },
  inputContainer: { width: '100%' },
  input: { backgroundColor: "#F9F9F9", borderWidth: 1, borderColor: "#EFEFEF", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 16, fontSize: 15, color: "#262626", fontFamily: "Poppins_400Regular" },
  
  primaryButton: { backgroundColor: "#8D613A", borderRadius: 16, paddingVertical: 16, alignItems: "center", width: '100%' },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, fontFamily: "Poppins_700Bold" },

  iconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#F5ECE5", justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 22, color: "#613F24", fontFamily: "Poppins_700Bold", marginBottom: 12 },
  successDesc: { fontSize: 14, color: "#888", fontFamily: "Poppins_400Regular", textAlign: 'center', marginBottom: 30, lineHeight: 22 },
});