import CreateSubscriptionModal from "@/components/CreateSubscriptionModal";
import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import UpcomingSubsCard from "@/components/UpcomingSubsCard";
import { HOME_BALANCE, HOME_USER, UPCOMING_SUBSCRIPTIONS } from "@/constants/data";
import { icons } from "@/constants/icons";
import images from "@/constants/images";
import { useSubscriptions } from "@/context/SubscriptionsContext";
import "@/global.css";
import { formatCurrency } from "@/lib/utils";
import { useUser } from "@clerk/clerk-expo";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNsafeAreaView);


export default function App() {
  const router = useRouter();
  const { user } = useUser();
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { subscriptions, addSubscription } = useSubscriptions();

  const displayName = user
    ? user.firstName || user.emailAddresses[0]?.emailAddress.split("@")[0]
    : HOME_USER.name;

  const handleCreateSubscription = (newSub: Subscription) => {
    addSubscription(newSub);
  };

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image
                  source={user?.imageUrl ? { uri: user.imageUrl } : images.avatar}
                  className="home-avatar"
                />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Pressable
                onPress={() => setModalVisible(true)}
                accessibilityRole="button"
                accessibilityLabel="Add Subscription"
              >
                <Image source={icons.add} className="home-add-icon" accessible={false} />
              </Pressable>
            </View>

            <View className="home-balance-card">
              <Text className="home-balance-label">Balance</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format('DD/MM')}
                </Text>
              </View>
            </View>

            <View className="mb-5" >
              <ListHeading title="Upcoming" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (<UpcomingSubsCard {...item} />)}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<Text className="home-empty-state">No upcoming subscriptions</Text>}
              />
            </View>

            <ListHeading title="All Subscriptions" onViewAll={() => router.push("/(tabs)/subscriptions")} />
          </>
        )}
        data={subscriptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() => setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text className="home-empty-state">No subscriptions yet.</Text>}
        contentContainerClassName="pb-20"
      />

      <CreateSubscriptionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onCreate={handleCreateSubscription}
      />
    </SafeAreaView>
  );
}