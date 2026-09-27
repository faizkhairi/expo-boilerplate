import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '../../src/stores/auth';

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </Text>
        <Text className="text-gray-600 mb-8">
          You&apos;re successfully logged in to your account.
        </Text>

        <View className="space-y-4">
          <View className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <Text className="text-lg font-semibold text-gray-900 mb-2">🔐 Expo Boilerplate</Text>
            <Text className="text-gray-700 leading-6">
              Production-ready mobile app template with Expo Router, NativeWind, and JWT auth.
            </Text>
          </View>

          <View className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            <Text className="text-base font-semibold text-gray-900 mb-3">Features:</Text>
            <View className="space-y-2">
              <Text className="text-gray-700">• Expo Router for file-based navigation</Text>
              <Text className="text-gray-700">• NativeWind (Tailwind CSS for React Native)</Text>
              <Text className="text-gray-700">• Zustand for state management</Text>
              <Text className="text-gray-700">• expo-secure-store for token storage</Text>
              <Text className="text-gray-700">• React Hook Form + Zod validation</Text>
              <Text className="text-gray-700">• Axios with JWT interceptor</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
