import "@/global.css";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ClerkProvider, ClerkLoaded, ClerkLoading, useAuth } from "@clerk/clerk-expo";
import { tokenCache } from "@/lib/tokenCache";
import { View, ActivityIndicator } from "react-native";
import { PostHogProvider } from "posthog-react-native";
import { SubscriptionsProvider } from "@/context/SubscriptionsContext";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

SplashScreen.preventAutoHideAsync();

function InitialLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (isSignedIn && inAuthGroup) {
      // Redirect signed-in user to home/tabs
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      // Redirect signed-out user to signin
      router.replace("/(auth)/signin");
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff9e3" }}>
        <ActivityIndicator size="large" color="#ea7a53" />
      </View>
    );
  }

  return (
    <SubscriptionsProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SubscriptionsProvider>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "sans-regular": require("../assets/fonts/PlusJakartaSans-Regular.ttf"),
    "sans-bold": require("../assets/fonts/PlusJakartaSans-Bold.ttf"),
    "sans-medium": require("../assets/fonts/PlusJakartaSans-Medium.ttf"),
    "sans-semibold": require("../assets/fonts/PlusJakartaSans-SemiBold.ttf"),
    "sans-extrabold": require("../assets/fonts/PlusJakartaSans-ExtraBold.ttf"),
    "sans-light": require("../assets/fonts/PlusJakartaSans-Light.ttf")
  });

  if (!fontsLoaded) return null;

  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_KEY!}
      options={{ host: process.env.EXPO_PUBLIC_POSTHOG_HOST }}
    >
      <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
        <ClerkLoading>
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff9e3" }}>
            <ActivityIndicator size="large" color="#ea7a53" />
          </View>
        </ClerkLoading>
        <ClerkLoaded>
          <InitialLayout />
        </ClerkLoaded>
      </ClerkProvider>
    </PostHogProvider>
  );
}
