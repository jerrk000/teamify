import { Redirect, Stack } from "expo-router"

import { useAuthStore } from "@/store/useAuthStore"
import { useAppTheme } from "@/theme/context"

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.authToken))
  const { theme } = useAppTheme()

  if (!isAuthenticated) {
    return <Redirect href="/LoginScreen" />
  }

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.palette.neutral200 },
        headerTintColor: theme.colors.tint,
        headerTitleStyle: { color: theme.colors.tint },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(non-tabs)/MakeTeamsScreen"
        options={{
          title: "Add Players",
          headerStyle: {
            backgroundColor: theme.colors.palette.neutral200,
          },
          headerTitleStyle: {
            color: theme.colors.tint,
            fontSize: 24,
            fontWeight: "700",
          },
        }}
      />
      <Stack.Screen
        name="(non-tabs)/GameScreen"
        options={{
          title: "Teams",
        }}
      />
      <Stack.Screen
        name="(non-tabs)/PreviewScreen"
        options={{
          title: "Player Card Preview",
        }}
      />
      <Stack.Screen
        name="(non-tabs)/QRCodeScannerScreen"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(non-tabs)/FriendLinkScreen"
        options={{
          title: "Friend Link",
        }}
      />
      <Stack.Screen
        name="(non-tabs)/AddFriendScreen"
        options={{
          title: "Add Friends",
        }}
      />
    </Stack>
  )
}
