import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth-gateway" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="matching" />
        <Stack.Screen name="quote" />
        <Stack.Screen name="tracking" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
