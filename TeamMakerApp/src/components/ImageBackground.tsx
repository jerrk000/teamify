import React from 'react';
import {
  ImageBackground,
  ImageResizeMode,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';


interface BackgroundProps {
  children: React.ReactNode;
  source?: ImageSourcePropType;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
  horizontalPosition?: 'left' | 'center' | 'right';
  resizeMode?: ImageResizeMode;
  contentFullWidth?: boolean;
}

const horizontalPositionMap: Record<
  NonNullable<BackgroundProps['horizontalPosition']>,
  ViewStyle['alignSelf']
> = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const BackgroundPicture: React.FC<BackgroundProps> = ({
  children,
  source = require('../../assets/images/volleyball_court.png'),
  width = '100%',
  height = '100%',
  horizontalPosition = 'center',
  resizeMode = 'cover',
  contentFullWidth = false,
}) => {
  const backgroundStyle = [
    styles.image,
    {
      width,
      height,
      alignSelf: horizontalPositionMap[horizontalPosition],
    },
  ] as const;

  if (contentFullWidth) {
    return (
      <View style={styles.container}>
        <ImageBackground
          pointerEvents="none"
          resizeMode={resizeMode}
          style={[backgroundStyle, styles.absoluteBackground]}
          source={source}
        />
        <View style={styles.content}>{children}</View>
      </View>
    );
  }

  return (
    <ImageBackground
      resizeMode={resizeMode}
      style={backgroundStyle}
      source={source}
    >
      {children}
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  content: {
    flex: 1,
    width: '100%',
  },
  image: {
    justifyContent: 'center',
  },
  absoluteBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});

export default BackgroundPicture;
