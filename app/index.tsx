import { Redirect } from "expo-router";

export default function Index() {
  // Mock: always redirect to guest home
  // In real app, check auth state
  return <Redirect href="/(guest)/(tabs)/home" />;
}
