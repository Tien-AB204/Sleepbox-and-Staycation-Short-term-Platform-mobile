import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function HostBookings() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Host Bookings</Text>
      <Text>Coming Soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
