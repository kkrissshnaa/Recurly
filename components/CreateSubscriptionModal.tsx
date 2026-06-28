import { usePostHog } from "posthog-react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import clsx from "clsx";
import dayjs from "dayjs";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (subscription: Subscription) => void;
}

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#f5c542",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#b8e8d0",
  Productivity: "#f5c542",
  Cloud: "#e8def8",
  Music: "#b8d4e3",
  Other: "#cccccc",
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onCreate,
}: CreateSubscriptionModalProps) {
  const posthog = usePostHog();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState("Other");

  const isValid = name.trim().length > 0 && Number(price) > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const startDate = dayjs().toISOString();
    const renewalDate = dayjs()
      .add(1, frequency === "Monthly" ? "month" : "year")
      .toISOString();

    const cleanName = name.toLowerCase().replace(/\s+/g, '');
    const hasIcon = cleanName in MaterialCommunityIcons.glyphMap;
    const iconName = hasIcon ? cleanName : "image-off-outline";

    const newSubscription: Subscription = {
      id: Math.random().toString(36).substring(2, 9),
      name: name.trim(),
      price: Number(price),
      billing: frequency,
      category,
      status: "active",
      startDate,
      renewalDate,
      icon: iconName,
      currency: "INR",
      color: CATEGORY_COLORS[category] || "#cccccc",
    };

    onCreate(newSubscription);

    if (posthog) {
      posthog.capture('Subscription Created', {
        name: newSubscription.name,
        category: newSubscription.category || "Unknown",
        price: newSubscription.price,
        billing: newSubscription.billing,
      });
    }

    reset();
    onClose();
  };

  const reset = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Other");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="modal-overlay">
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable onPress={handleClose} className="modal-close">
                <Text className="modal-close-text">×</Text>
              </Pressable>
            </View>

            <ScrollView className="modal-body" contentContainerClassName="gap-5 pb-10">
              <View className="auth-field">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Spotify"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  className="auth-input"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  placeholder="0.00"
                  placeholderTextColor="rgba(0,0,0,0.4)"
                  keyboardType="decimal-pad"
                  className="auth-input"
                />
              </View>

              <View className="auth-field">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    onPress={() => setFrequency("Monthly")}
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active"
                    )}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active"
                      )}
                    >
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFrequency("Yearly")}
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active"
                    )}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active"
                      )}
                    >
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((cat) => (
                    <Pressable
                      key={cat}
                      onPress={() => setCategory(cat)}
                      className={clsx(
                        "category-chip",
                        category === cat && "category-chip-active"
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === cat && "category-chip-text-active"
                        )}
                      >
                        {cat}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={!isValid}
                className={clsx(
                  "auth-button",
                  !isValid && "auth-button-disabled"
                )}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
