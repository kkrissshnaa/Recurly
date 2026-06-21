import "@/global.css";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { Text } from "react-native";
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNsafeAreaView);

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-x1 font-bold text-success">Welcome to the New World</Text>
      <Link href="/Onboarding" className="mt-4 rounded bg-primary text-white p-4">Go to Onboarding</Link>

      <Link href="/subscriptions/spotify">Go to Spotify</Link>
    </SafeAreaView>
  );
}