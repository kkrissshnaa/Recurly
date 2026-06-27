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
  Alert,
} from "react-native";
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

const SafeAreaView = styled(RNsafeAreaView);

export default function SignUp() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");

  const [pendingVerification, setPendingVerification] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isValidEmail = (emailStr: string) => {
    return /\S+@\S+\.\S+/.test(emailStr);
  };

  const handleSignUp = async () => {
    if (!isLoaded) return;

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(normalizedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signUp.create({
        emailAddress: normalizedEmail,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setPendingVerification(true);
    } catch (err: any) {
      const errorCode = err.errors?.[0]?.code || err.code || "unknown_error";
      console.error("Sign up failed:", errorCode);
      const message =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "An error occurred during registration.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;
    if (!code) {
      setError("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
      } else {
        console.warn("Sign up status not complete:", completeSignUp.status);
        setError("Account verification failed. Please try again.");
      }
    } catch (err: any) {
      const errorCode = err.errors?.[0]?.code || err.code || "unknown_error";
      console.error("Verification failed:", errorCode);
      const message =
        err.errors?.[0]?.longMessage ||
        err.message ||
        "Incorrect code. Please check and try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded || resending) return;
    setResending(true);
    setError(null);
    try {
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      Alert.alert("Code Sent", "Verification code has been resent to your email.");
    } catch (err: any) {
      const errorCode = err.errors?.[0]?.code || err.code || "unknown_error";
      console.error("Resend code failed:", errorCode);
      setError(err.errors?.[0]?.longMessage || err.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Logo and Title stay static at the top */}
      <View className="items-center pt-8 pb-3">
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
          <Text className="text-3xl font-sans-bold text-primary font-bold">
            {pendingVerification ? "Verify your email" : "Create account"}
          </Text>
          <Text className="text-sm font-sans-medium text-muted-foreground text-center mt-2 max-w-[280px]">
            {pendingVerification
              ? `Enter the code sent to ${email}`
              : "Sign up to start managing your subscriptions"}
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
            {!pendingVerification ? (
              // Step 1: Sign up inputs
              <View className="gap-4">
                {/* Email */}
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
                <View>
                  <Text className="text-sm font-sans-bold text-primary mb-2 pl-0.5 font-semibold">Password</Text>
                  <TextInput
                    className={`rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary ${
                      error && !password ? "border-destructive" : ""
                    }`}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="off"
                    placeholder="Enter your password"
                    placeholderTextColor="rgba(8,17,38,0.3)"
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                {/* Confirm Password */}
                <View className="mb-2">
                  <Text className="text-sm font-sans-bold text-primary mb-2 pl-0.5 font-semibold">Confirm Password</Text>
                  <TextInput
                    className={`rounded-2xl border border-border bg-background px-4 py-4 text-base font-sans-medium text-primary ${
                      error && !confirmPassword ? "border-destructive" : ""
                    }`}
                    secureTextEntry
                    autoCapitalize="none"
                    autoComplete="off"
                    placeholder="Re-enter password"
                    placeholderTextColor="rgba(8,17,38,0.3)"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
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
                    loading || !email || !password || !confirmPassword ? "opacity-60" : ""
                  }`}
                  disabled={loading || !email || !password || !confirmPassword}
                  onPress={handleSignUp}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white text-base font-sans-bold font-bold">Sign up</Text>
                  )}
                </Pressable>

                {/* Redirect Link inside the card */}
                <View className="flex-row justify-center items-center mt-2 gap-1.5">
                  <Text className="text-sm font-sans-medium text-muted-foreground">
                    Already have an account?
                  </Text>
                  <Pressable
                    onPress={() => router.push("/(auth)/signin")}
                    className="active:opacity-60"
                  >
                    <Text className="text-sm font-sans-bold text-accent font-semibold">Sign in</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              // Step 2: Verification code form
              <View className="gap-4">
                <View>
                  <Text className="text-sm font-sans-bold text-primary mb-2 pl-0.5 font-semibold">Verification Code</Text>
                  <TextInput
                    style={{
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: error && !code ? "#dc2626" : "rgba(8, 17, 38, 0.08)",
                      backgroundColor: "#fffdf9",
                      paddingHorizontal: 16,
                      paddingVertical: 16,
                      textAlign: "center",
                      fontFamily: "PlusJakartaSans-Medium",
                      fontSize: 16,
                      color: "#081126",
                      letterSpacing: 10,
                    }}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="123456"
                    placeholderTextColor="rgba(8,17,38,0.2)"
                    value={code}
                    onChangeText={setCode}
                  />
                  <Text className="text-xs font-sans-medium text-muted-foreground text-center mt-2">
                    Enter the 6-digit verification code sent to your email.
                  </Text>
                </View>

                {/* Error Display */}
                {error && (
                  <Text className="text-xs font-sans-semibold text-destructive text-center mt-1">
                    {error}
                  </Text>
                )}

                {/* Verify Button */}
                <Pressable
                  className={`bg-accent py-4 rounded-2xl items-center mt-2 active:opacity-90 ${
                    loading || !code ? "opacity-60" : ""
                  }`}
                  disabled={loading || !code}
                  onPress={handleVerify}
                >
                  {loading ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white text-base font-sans-bold font-bold">Verify Account</Text>
                  )}
                </Pressable>

                {/* Code resend and email correction links */}
                <View className="flex-row justify-between items-center mt-2 px-1">
                  <Pressable
                    onPress={handleResendCode}
                    className={`active:opacity-60 ${resending ? "opacity-50" : ""}`}
                    disabled={resending}
                  >
                    {resending ? (
                      <Text className="text-sm font-sans-semibold text-accent font-semibold">Resending...</Text>
                    ) : (
                      <Text className="text-sm font-sans-semibold text-accent font-semibold">Resend code</Text>
                    )}
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setPendingVerification(false);
                      setCode("");
                      setError(null);
                    }}
                    className="active:opacity-60"
                  >
                    <Text className="text-sm font-sans-semibold text-muted-foreground font-semibold">
                      Change email
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}