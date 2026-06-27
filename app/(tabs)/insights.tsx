import { Link } from "expo-router";
import { styled } from "nativewind";
import React from 'react';
import { Text, } from 'react-native';
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNsafeAreaView);

const insights = () => {
  return (
   <SafeAreaView className="flex-1 bg-background p-5">
    <Text>Insights</Text>
    <Link href={"/"}>Go Back</Link>
   </SafeAreaView>
  )
}

export default insights