import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import TabModal from '@/components/ui/tabmodal'
import useModalStore from '@/store/useModalStore';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { toggleModal } = useModalStore();

  return (
    <> 
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="sportscourt" color={color} iconSet="material" />,
        }}
      />
      <Tabs.Screen
        name="FriendsListScreen"
        options={{
          title: 'Friends',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.3.fill" color={color} iconSet="fontawesome" />,
        }}
      />
      <Tabs.Screen
        name="PlayerStatsScreen"
        options={{
          title: 'Player',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="chart.bar.fill" color={color} iconSet="fontawesome" />,
        }}
      />
      <Tabs.Screen
        name="tabmodalScreen"
        options={{
          title: 'Menu', 
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="line.horizontal.3" color={color} iconSet="material" />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault(); // Prevent default navigation
            toggleModal(); // Open the modal
          },
        }}
      />
    </Tabs>

    <TabModal />
    </>
  );
}
