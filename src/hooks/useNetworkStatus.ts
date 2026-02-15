import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

/**
 * Hook to monitor network connectivity status
 *
 * @returns {Object} Network status
 * @returns {boolean} isConnected - Whether device is connected to network
 * @returns {boolean} isInternetReachable - Whether internet is reachable
 * @returns {string|null} type - Connection type (wifi, cellular, etc.)
 */
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true);
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
      setType(state.type);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  return { isConnected, isInternetReachable, type };
}
