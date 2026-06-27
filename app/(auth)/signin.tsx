import { styled } from "nativewind";
import React, { useState } from "react";
import {
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";
import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const SafeAreaView = styled(RNsafeAreaView);

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!isLoaded) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await signIn.create({
        identifier: normalizedEmail,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
      } else {
        console.warn("Sign in status not complete:", result.status);
        setError("Sign in requires additional verification steps.");
      }
    } catch (err: any) {
      const errorCode = err.errors?.[0]?.code || err.code || "unknown_error";
      console.error("Sign in failed:", errorCode);
      const message =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "Invalid email or password. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Logo and Title stay static at the top */}
      <View className="items-center pt-8 pb-4">
        {/* Logo block */}
        <View className="flex-row items-center justify-center gap-3.5 mb-6">
          <View className="w-14 h-14 bg-accent rounded-[18px] items-center justify-center">
            <Text className="text-white text-3xl font-sans-extrabold font-bold">R</Text>
          </View>
          <View>
            <Text className="text-3xl font-sans-extrabold text-primary leading-tight font-bold">Recurly</Text>
            <Text className="text-[10px] font-sans-bold tracking-[1.5px] text-primary/60 uppercase">
              Smart Billing
            </Text>
          </View>
        </View>

        {/* Title Block */}
        <View className="items-center">
          <Text className="text-3xl font-sans-bold text-primary font-bold">Welcome back</Text>
          <Text className="text-sm font-sans-medium text-muted-foreground text-center mt-2 max-w-[280px]">
            Sign in to continue managing your subscriptions
          </Text>
        </View>
      </View>

      {/* Only the card area handles keyboard avoidance and scrolling */}
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 20}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow justify-start px-6 pb-8"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Auth Card */}
          <View className="rounded-[28px] border border-border bg-card p-6 shadow-sm mt-2">
            <View className="gap-4">
              {/* Email Address */}
              <View>
                <Text className="text-sm font-sans-bold text-primary mb-2 pl-0.5 font-semibold">Email</Text>
                <TextInput
                  className={`rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary ${
                    error && !email ? "border-destructive" : ""
                  }`}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(8,17,38,0.3)"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Password */}
              <View className="mb-2">
                <Text className="text-sm font-sans-bold text-primary mb-2 pl-0.5 font-semibold">Password</Text>
                <TextInput
                  className={`rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary ${
                    error && !password ? "border-destructive" : ""
                  }`}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(8,17,38,0.3)"
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Error Display */}
              {error && (
                <Text className="text-xs font-sans-semibold text-destructive text-center mt-1">
                  {error}
                </Text>
              )}

              {/* Submit Button */}
              <Pressable
                className={`bg-accent py-4 rounded-2xl items-center mt-2 active:opacity-90 ${
                  loading || !email || !password ? "opacity-60" : ""
                }`}
                disabled={loading || !email || !password}
                onPress={handleSignIn}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-white text-base font-sans-bold font-bold">Sign in</Text>
                )}
              </Pressable>

              {/* Redirect Link inside the card */}
              <View className="flex-row justify-center items-center mt-2 gap-1.5">
                <Text className="text-sm font-sans-medium text-muted-foreground">
                  New to Recurly?
                </Text>
                <Pressable
                  onPress={() => router.push("/(auth)/signup")}
                  className="active:opacity-60"
                >
                  <Text className="text-sm font-sans-bold text-accent font-semibold">Create an account</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}