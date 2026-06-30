import ListHeading from "@/components/ListHeading";
import SubscriptionCard from "@/components/SubscriptionCard";
import { icons } from "@/constants/icons";
import { clsx } from "clsx";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useMemo } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNsafeAreaView);

const rawChartData = [
  { day: 'Mon', value: 2905 },
  { day: 'Tue', value: 2490 },
  { day: 'Wed', value: 1660 },
  { day: 'Thr', value: 3320 },
  { day: 'Fri', value: 2905 },
  { day: 'Sat', value: 1494 },
  { day: 'Sun', value: 1826 },
];

const Insights = () => {
  const router = useRouter();

  // Make chart functional by deriving state dynamically
  const { chartData, yLabels, yMax } = useMemo(() => {
    const maxVal = Math.max(...rawChartData.map((d) => d.value));

    // Calculate Y-axis top value (rounded up to nearest 1000 with a minimum of 1000)
    const topY = Math.max(1000, Math.ceil(maxVal / 1000) * 1000);

    // Create 5 Y-axis labels
    const labels = [topY, topY * 0.75, topY * 0.5, topY * 0.25, 0].map(v => Math.round(v));

    // Mark the maximum value as highlighted
    const data = rawChartData.map((d) => ({
      ...d,
      highlight: d.value === maxVal,
    }));

    return { chartData: data, yLabels: labels, yMax: topY };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background px-5 pt-5 pb-20">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-24">

        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <Pressable
            onPress={() => router.back()}
            className="size-12 rounded-full border border-black/10 items-center justify-center bg-transparent"
          >
            <Image source={icons.back} className="size-5" resizeMode="contain" />
          </Pressable>
          <Text className="text-2xl font-sans-bold text-primary">Monthly insights</Text>
          <Pressable className="size-12 rounded-full border border-black/10 items-center justify-center bg-transparent">
            <View className="flex-row gap-[3px]">
              <View className="size-1 bg-primary rounded-full" />
              <View className="size-1 bg-primary rounded-full" />
              <View className="size-1 bg-primary rounded-full" />
            </View>
          </Pressable>
        </View>

        {/* Chart Section */}
        <ListHeading title="Upcoming" onViewAll={() => { }} />
        <View className="bg-[#F6EEDA] rounded-3xl p-6 mt-4">
          <View className="relative h-[220px] w-full pt-4">

            {/* Background Layer: Y-axis Labels and Dashed Lines */}
            <View className="absolute inset-0 pt-4 pb-8 flex-row">
              {/* Y-axis Labels */}
              <View className="justify-between h-full w-8 mr-2 items-end">
                {yLabels.map((val, i) => (
                  <Text key={i} className="text-xs font-sans-medium text-muted-foreground leading-none">
                    {val}
                  </Text>
                ))}
              </View>
              {/* Dashed Lines */}
              <View className="flex-1 justify-between h-full py-1">
                {yLabels.map((_, i) => (
                  <View key={`line-${i}`} className="border-b border-black/10 border-dashed w-full h-0" />
                ))}
              </View>
            </View>

            {/* Foreground Layer: Bars and X-axis Labels */}
            <View className="absolute inset-0 pt-4 pb-0 flex-row">
              {/* Spacer matching Y-axis width */}
              <View className="w-8 mr-2" />

              {/* Bars Container */}
              <View className="flex-1 flex-row justify-between">
                {chartData.map((item, index) => (
                  <View key={index} className="items-center h-full flex-1">
                    {/* Bar Wrapper */}
                    <View className="flex-1 justify-end items-center pb-2 w-full">
                      {item.highlight && (
                        <View className="bg-white rounded-[10px] px-2.5 py-[3px] absolute -top-8 z-20 items-center justify-center">
                          <Text className="text-accent font-sans-bold text-[11px]">₹{item.value}</Text>
                          <View className="absolute -bottom-1 w-2 h-2 bg-white rotate-45" />
                        </View>
                      )}
                      <View
                        className={clsx("w-4 rounded-full", item.highlight ? "bg-accent" : "bg-primary")}
                        style={{ height: `${(item.value / yMax) * 100}%` }}
                      />
                    </View>
                    {/* X-axis Label */}
                    <Text className="text-[11px] font-sans-medium text-muted-foreground h-4 text-center leading-none">
                      {item.day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

          </View>
        </View>

        {/* Expenses Card */}
        <View className="rounded-[20px] border border-black/5 bg-[#FBF6EA] p-5 my-6 flex-row justify-between items-center">
          <View>
            <Text className="text-xl font-sans-bold text-primary">Expenses</Text>
            <Text className="text-[13px] font-sans-medium text-muted-foreground mt-1">March 2026</Text>
          </View>
          <View className="items-end">
            <Text className="text-xl font-sans-bold text-primary">-₹35,244.29</Text>
            <Text className="text-[13px] font-sans-medium text-muted-foreground mt-1">+12%</Text>
          </View>
        </View>

        {/* History Section */}
        <ListHeading title="History" onViewAll={() => { }} />
        <View className="mt-4 gap-4 pb-8 px-4">
          <SubscriptionCard
            name="Claude"
            price={816.72}
            currency="₹"
            icon={icons.claude}
            billing="per month"
            color="#F5D154"
            category="June 25, 12:00"
            expanded={false}
            onPress={() => { }}
          />
          <SubscriptionCard
            name="Canva"
            price={3642.87}
            currency="₹"
            icon={icons.canva}
            billing="per month"
            color="#9DCDBB"
            category="June 30, 16:00"
            expanded={false}
            onPress={() => { }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Insights;