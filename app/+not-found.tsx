import { View, Text, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View className="flex-1 items-center justify-center px-6 bg-white">
        <Text className="text-6xl font-bold text-gray-900 mb-4">404</Text>
        <Text className="text-2xl font-semibold text-gray-900 mb-2">Page not found</Text>
        <Text className="text-gray-600 mb-8 text-center">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity className="bg-blue-600 rounded-lg px-6 py-3">
            <Text className="text-white font-semibold text-base">Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}
