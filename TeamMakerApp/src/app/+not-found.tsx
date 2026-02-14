import { Link, Stack } from 'expo-router';
import { View, type ViewStyle, type TextStyle, StyleSheet } from 'react-native';
import { useAppTheme } from '@/theme/context';
import { ThemedStyle } from '@/theme/types';
import { Text } from '@/components/Text'; // Assuming you have a ThemedText component for consistent theming


export default function NotFoundScreen() {
  const {
    themed, theme, themeContext,
  } = useAppTheme()

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={themed($container)}>
        <Text preset="heading" text="This screen doesn't exist." />
        <Link href="/" style={themed($link)}>
          <Text text="Go to home screen!"/>
        </Link>
      </View>
    </>
  );
}

const $container: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
});

const $link: ThemedStyle<TextStyle> = (theme) => ({
   marginTop: 15,
   paddingVertical: 15,
});
