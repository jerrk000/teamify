import { Redirect, Stack } from "expo-router"
import { useAppTheme } from '@/theme/context';
import { useAuthStore } from "@/store/useAuthStore"

export default function AppLayout() {
  const isAuthenticated = useAuthStore((state) => Boolean(state.authToken))

  if (!isAuthenticated) {
    return <Redirect href="/LoginScreen" />
  }

  const {
    themed, theme, themeContext,
  } = useAppTheme()

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
