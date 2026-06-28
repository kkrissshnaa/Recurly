import { useSubscriptions } from "@/context/SubscriptionsContext";
import SubscriptionCard from "@/components/SubscriptionCard";
import { icons } from "@/constants/icons";
import clsx from "clsx";
import { styled } from "nativewind";
import { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, TextInput, View, Image } from "react-native";
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNsafeAreaView);

const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "cancelled", label: "Cancelled" },
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number]["value"];

function matchesSearch(subscription: Subscription, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return true;

  const haystack = [
    subscription.name,
    subscription.plan,
    subscription.category,
    subscription.billing,
    subscription.status,
    subscription.paymentMethod,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function matchesFilters(
  subscription: Subscription,
  statusFilter: StatusFilter,
  categoryFilter: string
): boolean {
  if (statusFilter !== "all" && subscription.status !== statusFilter) return false;
  if (categoryFilter !== "all" && subscription.category !== categoryFilter) return false;
  return true;
}

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<string | null>(null);

  const { subscriptions } = useSubscriptions();

  const categories = useMemo(
    () =>
      [...new Set(subscriptions.map((subscription) => subscription.category).filter(Boolean))].sort(),
    [subscriptions]
  );

  const filteredSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          matchesSearch(subscription, searchQuery) &&
          matchesFilters(subscription, statusFilter, categoryFilter)
      ),
    [subscriptions, searchQuery, statusFilter, categoryFilter]
  );

  const hasActiveFilters =
    searchQuery.trim().length > 0 || statusFilter !== "all" || categoryFilter !== "all";

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        data={filteredSubscriptions}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-20"
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListHeaderComponent={
          <View className="mb-5">
            <Text className="mb-5 text-3xl font-sans-bold text-primary">Subscriptions</Text>
            <View className="mb-5 flex-row gap-3">
              <TextInput
                className="flex-1 rounded-2xl border border-border bg-card px-4 py-3.5 text-base font-sans-medium text-primary"
                placeholder="Search subscriptions"
                placeholderTextColor="rgba(8,17,38,0.3)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <Pressable
                onPress={() => setIsFilterVisible(!isFilterVisible)}
                accessibilityRole="button"
                accessibilityLabel="Toggle filters"
                accessibilityState={{ expanded: isFilterVisible }}
                className={clsx(
                  "size-[52px] items-center justify-center rounded-2xl border border-border bg-card",
                  isFilterVisible && "border-accent bg-accent/10"
                )}
              >
                <Image 
                  source={icons.setting} 
                  className="size-6" 
                  style={{ tintColor: isFilterVisible ? "#ea7a53" : "#081126" }} 
                />
              </Pressable>
            </View>

            {isFilterVisible && (
              <View className="mb-5">
                <Text className="mb-2 pl-0.5 text-sm font-sans-bold uppercase tracking-wider text-muted-foreground">
                  Status
                </Text>
                <View className="picker-row mb-5">
                  {STATUS_FILTERS.map(({ value, label }) => (
                    <Pressable
                      key={value}
                      className={clsx("picker-option", statusFilter === value && "picker-option-active")}
                      onPress={() => setStatusFilter(value)}
                    >
                      <Text
                        className={clsx(
                          "picker-option-text",
                          statusFilter === value && "picker-option-text-active"
                        )}
                      >
                        {label}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Text className="mb-2 pl-0.5 text-sm font-sans-bold uppercase tracking-wider text-muted-foreground">
                  Category
                </Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerClassName="gap-2"
                >
                  <Pressable
                    className={clsx("category-chip", categoryFilter === "all" && "category-chip-active")}
                    onPress={() => setCategoryFilter("all")}
                  >
                    <Text
                      className={clsx(
                        "category-chip-text",
                        categoryFilter === "all" && "category-chip-text-active"
                      )}
                    >
                      All
                    </Text>
                  </Pressable>
                  {categories.map((category) => (
                    <Pressable
                      key={category}
                      className={clsx(
                        "category-chip",
                        categoryFilter === category && "category-chip-active"
                      )}
                      onPress={() => setCategoryFilter(category!)}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          categoryFilter === category && "category-chip-text-active"
                        )}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) => (currentId === item.id ? null : item.id))
            }
          />
        )}
        ListEmptyComponent={
          <Text className="home-empty-state">
            {hasActiveFilters
              ? "No subscriptions match your search or filters."
              : "No subscriptions yet."}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
