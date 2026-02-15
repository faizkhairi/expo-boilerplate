import React from 'react';
import { View, Text } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * NetworkStatus component
 *
 * Displays a banner when the device is offline.
 * Automatically hides when connection is restored.
 */
export function NetworkStatus() {
  const { isConnected, isInternetReachable } = useNetworkStatus();

  if (isConnected && isInternetReachable !== false) {
    return null;
  }

  return (
    <View className="bg-yellow-500 dark:bg-yellow-600 py-2 px-4">
      <Text className="text-center text-sm font-medium text-gray-900 dark:text-gray-50">
        {!isConnected
          ? 'No internet connection'
          : 'Limited connectivity - some features may be unavailable'}
      </Text>
    </View>
  );
}
