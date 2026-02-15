import { View, Text, ScrollView } from 'react-native';
import { useAuthStore } from '../../src/stores/auth';

export default function ProfileScreen() {
  const user = useAuthStore((state) => state.user);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        <Text className="text-3xl font-bold text-gray-900 mb-6">Profile</Text>

        <View className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-6">
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
            <Text className="text-base text-gray-900">{user?.name || 'Not set'}</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
            <Text className="text-base text-gray-900">{user?.email}</Text>
          </View>

          <View>
            <Text className="text-sm font-medium text-gray-700 mb-1">User ID</Text>
            <Text className="text-base text-gray-900">{user?.id}</Text>
          </View>
        </View>

        <View className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <Text className="text-sm text-blue-800">
            💡 Your profile information is securely stored and can be updated through the app's settings or API.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
