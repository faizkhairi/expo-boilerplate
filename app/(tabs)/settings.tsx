import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/stores/auth';

export default function SettingsScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-6">Settings</Text>

        <View className="space-y-4">
          <View className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <Text className="text-base font-semibold text-gray-900 mb-3">App Information</Text>
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Version</Text>
                <Text className="text-gray-900 font-medium">1.0.0</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-700">Build</Text>
                <Text className="text-gray-900 font-medium">1</Text>
              </View>
            </View>
          </View>

          <View className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <Text className="text-base font-semibold text-gray-900 mb-3">Tech Stack</Text>
            <View className="space-y-1">
              <Text className="text-gray-700">• Expo SDK 54</Text>
              <Text className="text-gray-700">• React Native 0.81</Text>
              <Text className="text-gray-700">• Expo Router v6</Text>
              <Text className="text-gray-700">• NativeWind (Tailwind)</Text>
              <Text className="text-gray-700">• Zustand + expo-secure-store</Text>
            </View>
          </View>

          <TouchableOpacity
            className="bg-red-600 rounded-lg py-3 items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-semibold text-base">Sign out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
