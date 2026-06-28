import { icons } from "@/constants/icons";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import { formatCurrency } from "@/lib/utils";
import React from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ManageSubscriptionsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ManageSubscriptionsModal({
  visible,
  onClose,
}: ManageSubscriptionsModalProps) {
  const { subscriptions, deleteSubscription } = useSubscriptions();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="modal-overlay">
        <View className="modal-container" style={{ maxHeight: "90%" }}>
          <View className="modal-header">
            <Text className="modal-title">Manage Subscriptions</Text>
            <Pressable onPress={onClose} className="modal-close">
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          <FlatList
            data={subscriptions}
            keyExtractor={(item) => item.id}
            contentContainerClassName="p-5 pb-10"
            ItemSeparatorComponent={() => <View className="h-4" />}
            ListEmptyComponent={
              <Text className="text-center text-sm font-sans-medium text-muted-foreground mt-10">
                No subscriptions to manage.
              </Text>
            }
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between rounded-2xl border border-border bg-card p-4">
                <View className="flex-row items-center flex-1 gap-3">
                  {typeof item.icon === 'string' ? (
                    <View className='size-10 items-center justify-center bg-white rounded-lg' style={{ width: 40, height: 40 }}>
                      <MaterialCommunityIcons name={item.icon as any} size={24} color="#081126" />
                    </View>
                  ) : (
                    <Image
                      source={item.icon}
                      className="size-10 rounded-lg"
                      style={{ width: 40, height: 40 }}
                    />
                  )}
                  <View className="flex-1 mr-2">
                    <Text className="text-base font-sans-bold text-primary" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
                      {formatCurrency(item.price, item.currency)} • {item.billing}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={() => deleteSubscription(item.id)}
                  className="items-center justify-center p-2 rounded-xl bg-destructive/10"
                >
                  <Text className="text-sm font-sans-bold text-destructive">Delete</Text>
                </Pressable>
              </View>
            )}
          />
        </View>
      </View>
    </Modal>
  );
}
