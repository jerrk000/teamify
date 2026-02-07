import React from 'react';
import { StyleSheet, View, Text, ImageBackground, ImageSourcePropType, Dimensions } from 'react-native';


interface BackgroundProps {
  children: React.ReactNode;
}

const BackgroundPicture: React.FC<BackgroundProps> = ({ children }) => {
  return (
        <ImageBackground
        resizeMode="stretch"
        style={styles.ImageStyle}
        source={require('../../assets/images/volleyball_court.png')}
        >
        {children}
        </ImageBackground>
  );
};


  const styles = StyleSheet.create({
  ImageStyle: {
    justifyContent: 'center',
    resizeMode: 'cover',
    width: '100%',
    height:  '100%',
  }
});

export default BackgroundPicture;