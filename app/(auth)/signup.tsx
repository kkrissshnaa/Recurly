import { styled } from "nativewind";
import React from 'react';
import { Text } from 'react-native';
import { SafeAreaView as RNsafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNsafeAreaView);

const signup = () => {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
    <Text>Sign up</Text>
   </SafeAreaView>
  )
}


export default signup