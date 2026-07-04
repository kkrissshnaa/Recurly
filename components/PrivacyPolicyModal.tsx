import React from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function PrivacyPolicyModal({
  visible,
  onClose,
}: PrivacyPolicyModalProps) {
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
            <Text className="modal-title">Privacy Policy</Text>
            <Pressable onPress={onClose} className="modal-close">
              <Text className="modal-close-text">×</Text>
            </Pressable>
          </View>

          <ScrollView className="p-5 pb-10">
            <Text className="text-base font-sans-medium text-primary mb-4">
              Last Updated: July 2026
            </Text>
            <Text className="text-sm font-sans-regular text-muted-foreground mb-4 leading-6">
              Welcome to Recurly. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our mobile application.
              Please read this privacy policy carefully. If you do not agree with the terms
              of this privacy policy, please do not access the application.
            </Text>
            <Text className="text-base font-sans-bold text-primary mb-2 mt-4">
              1. Information We Collect
            </Text>
            <Text className="text-sm font-sans-regular text-muted-foreground mb-4 leading-6">
              We may collect information about you in a variety of ways. The information we may
              collect via the Application depends on the content and materials you use, and includes:
              Personal Data, Derivative Data, and Financial Data.
            </Text>
            <Text className="text-base font-sans-bold text-primary mb-2 mt-4">
              2. Use of Your Information
            </Text>
            <Text className="text-sm font-sans-regular text-muted-foreground mb-4 leading-6">
              Having accurate information about you permits us to provide you with a smooth,
              efficient, and customized experience. Specifically, we may use information collected
              about you via the Application to: Create and manage your account, process transactions,
              and resolve disputes.
            </Text>
            <Text className="text-base font-sans-bold text-primary mb-2 mt-4">
              3. Disclosure of Your Information
            </Text>
            <Text className="text-sm font-sans-regular text-muted-foreground mb-4 leading-6">
              We may share information we have collected about you in certain situations. Your
              information may be disclosed as follows: By Law or to Protect Rights, Third-Party
              Service Providers, and Business Transfers.
            </Text>
            <Text className="text-base font-sans-bold text-primary mb-2 mt-4">
              4. Contact Us
            </Text>
            <Text className="text-sm font-sans-regular text-muted-foreground mb-10 leading-6">
              If you have questions or comments about this Privacy Policy, please contact us at:
              privacy@recurly.app.
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
