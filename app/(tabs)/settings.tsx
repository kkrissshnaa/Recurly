import ManageSubscriptionsModal from "@/components/ManageSubscriptionsModal";
import PrivacyPolicyModal from "@/components/PrivacyPolicyModal";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { useClerk, useUser } from "@clerk/clerk-expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { styled } from "nativewind";
import React, { useState } from "react";
import { ActivityIndicator, Alert, Image, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";
import { useCurrency } from "@/context/CurrencyContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SafeAreaView = styled(RNsafeAreaView);

export default function Settings() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { currency, setCurrency } = useCurrency();
  const [loading, setLoading] = useState(false);
  const [isManageModalVisible, setManageModalVisible] = useState(false);
  const [isPrivacyModalVisible, setPrivacyModalVisible] = useState(false);
  const [isCurrencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [localImageURI, setLocalImageURI] = useState<string | null>(null);

  React.useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const storedImage = await AsyncStorage.getItem("profileImage");
        if (storedImage) {
          setLocalImageURI(storedImage);
        }
      } catch (error) {
        console.error("Failed to load profile image", error);
      }
    };
    loadProfileImage();
  }, []);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setLocalImageURI(uri);
        await AsyncStorage.setItem("profileImage", uri);
      }
    } catch (error) {
      console.error("Failed to pick image", error);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err: any) {
      console.error("Sign out error:", err);
      Alert.alert(
        "Sign Out Failed",
        err?.message || "An error occurred while signing out. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const displayName = user
    ? user.fullName || user.emailAddresses[0]?.emailAddress.split("@")[0]
    : "Recurly User";

  const emailAddress = user?.emailAddresses[0]?.emailAddress || "";

  return (
    <SafeAreaView className="flex-1 bg-background mb-5">
      <ScrollView className="flex-1 px-5 pt-8" contentContainerClassName="pb-32">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-sans-bold text-primary">Settings</Text>
        </View>

        {/* Profile Card */}
        <View className="rounded-3xl border border-border bg-card p-5 mb-8 flex-row items-center gap-4">
          <Pressable onPress={handlePickImage} className="relative active:opacity-80">
            <Image
              source={localImageURI ? { uri: localImageURI } : (user?.imageUrl ? { uri: user.imageUrl } : images.avatar)}
              className="size-16 rounded-full"
            />
            <View className="absolute bottom-0 right-0 bg-primary rounded-full p-1 border-2 border-card">
              <MaterialCommunityIcons name="pencil" size={12} color="#ffffff" />
            </View>
          </Pressable>
          <View className="flex-1">
            <Text className="text-xl font-sans-bold text-primary">{displayName}</Text>
            {emailAddress ? (
              <Text className="text-sm font-sans-medium text-muted-foreground mt-0.5">
                {emailAddress}
              </Text>
            ) : null}
          </View>
        </View>

        {/* General Settings */}
        <View className="mb-8">
          <Text className="text-sm font-sans-bold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
            General
          </Text>
          <View className="rounded-3xl border border-border bg-card overflow-hidden">
            <Pressable className="flex-row items-center justify-between px-5 py-4 border-b border-border active:opacity-60">
              <View className="flex-row items-center gap-3">
                <Image
                  source={icons.activity}
                  className="size-5"
                  style={{ tintColor: "#081126" }}
                />
                <Text className="text-base font-sans-semibold text-primary">
                  Notification Preferences
                </Text>
              </View>
              <Image
                source={icons.back}
                className="size-4"
                style={{ tintColor: "#081126", transform: [{ rotate: "180deg" }], opacity: 0.4 }}
              />
            </Pressable>

            <Pressable 
              onPress={() => setCurrencyModalVisible(true)}
              className="flex-row items-center justify-between px-5 py-4 border-b border-border active:opacity-60"
            >
              <View className="flex-row items-center gap-3">
                <Image source={icons.wallet} className="size-5" style={{ tintColor: "#081126" }} />
                <Text className="text-base font-sans-semibold text-primary">Default Currency</Text>
              </View>
              <Text className="text-sm font-sans-bold text-accent">
                {currency === "INR" ? "INR (₹)" : "USD ($)"}
              </Text>
            </Pressable>

            <Pressable className="flex-row items-center justify-between px-5 py-4 active:opacity-60">
              <View className="flex-row items-center gap-3">
                <Image
                  source={icons.setting}
                  className="size-5"
                  style={{ tintColor: "#081126" }}
                />
                <Text className="text-base font-sans-semibold text-primary">App Theme</Text>
              </View>
              <Text className="text-sm font-sans-bold text-accent">Cream Light</Text>
            </Pressable>
          </View>
        </View>

        {/* Account Settings */}
        <View className="mb-8">
          <Text className="text-sm font-sans-bold text-muted-foreground uppercase tracking-wider mb-3 pl-1">
            Account Security
          </Text>
          <View className="rounded-3xl border border-border bg-card overflow-hidden">
            <Pressable
              onPress={() => setManageModalVisible(true)}
              className="flex-row items-center justify-between px-5 py-4 border-b border-border active:opacity-60"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-base font-sans-semibold text-primary">Manage Subscriptions</Text>
              </View>
              <Image
                source={icons.back}
                className="size-4"
                style={{ tintColor: "#081126", transform: [{ rotate: "180deg" }], opacity: 0.4 }}
              />
            </Pressable>

            <Pressable
              onPress={() => setPrivacyModalVisible(true)}
              className="flex-row items-center justify-between px-5 py-4 active:opacity-60"
            >
              <View className="flex-row items-center gap-3">
                <Text className="text-base font-sans-semibold text-primary">Privacy Policy</Text>
              </View>
              <Image
                source={icons.back}
                className="size-4"
                style={{ tintColor: "#081126", transform: [{ rotate: "180deg" }], opacity: 0.4 }}
              />
            </Pressable>
          </View>
        </View>

        {/* Log Out Button */}
        <Pressable
          className="items-center rounded-2xl bg-destructive py-4 active:opacity-80"
          onPress={handleSignOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-sans-bold text-white">Sign Out</Text>
          )}
        </Pressable>
      </ScrollView>

      <ManageSubscriptionsModal
        visible={isManageModalVisible}
        onClose={() => setManageModalVisible(false)}
      />
      <PrivacyPolicyModal
        visible={isPrivacyModalVisible}
        onClose={() => setPrivacyModalVisible(false)}
      />
      
      {/* Currency Selection Modal */}
      <Modal
        visible={isCurrencyModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-background rounded-t-3xl p-5 pb-10">
            <View className="flex-row items-center justify-between mb-6">
              <Text className="text-xl font-sans-bold text-primary">Select Currency</Text>
              <Pressable onPress={() => setCurrencyModalVisible(false)} className="p-2">
                <Text className="text-2xl text-muted-foreground leading-none">×</Text>
              </Pressable>
            </View>
            
            <Pressable 
              onPress={() => {
                setCurrency("INR");
                setCurrencyModalVisible(false);
              }}
              className="flex-row items-center justify-between p-4 mb-3 rounded-2xl border border-border bg-card"
            >
              <Text className="text-base font-sans-semibold text-primary">Rupee (INR)</Text>
              {currency === "INR" && (
                <View className="size-5 rounded-full bg-accent items-center justify-center">
                  <Text className="text-white text-xs font-sans-bold">✓</Text>
                </View>
              )}
            </Pressable>
            
            <Pressable 
              onPress={() => {
                setCurrency("USD");
                setCurrencyModalVisible(false);
              }}
              className="flex-row items-center justify-between p-4 rounded-2xl border border-border bg-card"
            >
              <Text className="text-base font-sans-semibold text-primary">Dollar (USD)</Text>
              {currency === "USD" && (
                <View className="size-5 rounded-full bg-accent items-center justify-center">
                  <Text className="text-white text-xs font-sans-bold">✓</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}