import { Redirect, Stack } from "expo-router"

import { useAuthStore } from "@/store/useAuthStore"

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.authToken))

  if (!isAuthenticated) {
    return <Redirect href="/LoginScreen" />
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(non-tabs)/MakeTeamsScreen"
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
    </Stack>
  )
}
