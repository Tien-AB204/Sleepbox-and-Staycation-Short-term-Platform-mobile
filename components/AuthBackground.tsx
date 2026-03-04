import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function AuthBackground({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.container}>
      {/* Màu nâu nhạt ở trên, màu trắng ở dưới */}
      <LinearGradient
        colors={["#E6D5C3", "#FFFFFF", "#FFFFFF"]} 
        locations={[0, 0.4, 1]}
        style={styles.gradient}
      />
      {/* Vòng tròn trang trí mờ phía sau */}
      <View style={styles.circleTopLeft} />
      <View style={styles.circleBottomRight} />
      
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { ...StyleSheet.absoluteFillObject },
  circleTopLeft: {
    position: "absolute",
    top: -100,
    left: -50,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  circleBottomRight: {
    position: "absolute",
    bottom: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
});