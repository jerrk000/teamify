import { Platform } from "react-native"
import { Tabs } from "expo-router"

import { HapticTab } from "@/components/HapticTab"
import { IconSymbol } from "@/components/ui/IconSymbol"
import TabBarBackground from "@/components/ui/TabBarBackground"
import TabModal from "@/components/ui/tabmodal"
import useModalStore from "@/store/useModalStore"
// import { Colors } from '@/constants/Colors'; //TODO delete
import { useAppTheme } from "@/theme/context"
// import { useColorScheme } from '@/hooks/useColorScheme'; //TODO delete

export default function TabLayout() {
  //const colorScheme = useColorScheme(); //TODO delete
  const { theme } = useAppTheme()
  const { openModal } = useModalStore()

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: theme.colors.tint,
          tabBarInactiveTintColor: theme.colors.tintInactive,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            android: {
              backgroundColor: theme.colors.background,
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Game",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="sportscourt" color={color} iconSet="material" />
            ),
          }}
        />
        <Tabs.Screen
          name="FriendsListScreen"
          options={{
            title: "Friends",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.3.fill" color={color} iconSet="fontawesome" />
            ),
          }}
        />
        <Tabs.Screen
          name="PlayerStatsScreen"
          options={{
            title: "Player",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chart.bar.fill" color={color} iconSet="fontawesome" />
            ),
          }}
        />
        <Tabs.Screen
          name="tabmodalScreen"
          options={{
            title: "Menu",
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="line.horizontal.3" color={color} iconSet="material" />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault() // Prevent default navigation
              openModal() // Open the modal
            },
          }}
        />
      </Tabs>

      <TabModal />
    </>
  )
}
