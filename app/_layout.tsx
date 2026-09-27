import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { config } from '../gluestack-ui.config';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { NetworkStatus } from '../src/components/NetworkStatus';
import "../global.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GluestackUIProvider config={config}>
        <StatusBar style="auto" />
        <NetworkStatus />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GluestackUIProvider>
    </ErrorBoundary>
  );
}
