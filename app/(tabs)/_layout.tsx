import { Stack } from 'expo-router'
import React from 'react'

import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="explore"
        options={{
          title: 'Explore',
        }}
      />
      <Stack.Screen
        name="sticker-modal"
        options={{
          title: 'Stickers',
          presentation: 'formSheet',
          sheetAllowedDetents: [0.2, 0.8, 1],
          sheetInitialDetentIndex: 1,
          sheetGrabberVisible: true,
          sheetElevation: 10,
          sheetExpandsWhenScrolledToEdge: true,
          contentStyle: {
            // backgroundColor: 'black',
          },
        }}
      />
    </Stack>
  )
}
