import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import corona from '../../../assets/CORONA_DORADA.png'; // Asegúrate que la ruta es correcta

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Componente individual animado (pieza de confeti)
const ConfettiPiece = ({ animatedValue, startX }) => {
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenHeight],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [startX, startX + (Math.random() - 0.5) * 200],
  });

  const rotate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const opacity = animatedValue.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.Image
      source={corona}
      style={[
        styles.confettiPiece,
        {
          transform: [{ translateX }, { translateY }, { rotate }],
          opacity,
        },
      ]}
      resizeMode="contain"
      shouldRasterizeIOS={true} // mejora en iOS
    />
  );
};

export const GoldenConfettiWrapper = ({ visible }) => {
  const animatedValues = useRef(
    Array.from({ length: 40 }, () => new Animated.Value(0)) // 30 piezas para mejor rendimiento
  ).current;

  useEffect(() => {
    if (visible) {
      animatedValues.forEach(v => v.setValue(0));

      const animations = animatedValues.map(v =>
        Animated.timing(v, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          delay: Math.random() * 500,
          useNativeDriver: true, // mejora crucial para fluidez
        })
      );

      Animated.parallel(animations).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.overlay]} pointerEvents="none">
      {animatedValues.map((value, index) => (
        <ConfettiPiece
          key={index}
          animatedValue={value}
          startX={Math.random() * screenWidth}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    zIndex: 9999,         // Muy por encima de otros elementos
    elevation: 9999,      // Para Android
  },
  confettiPiece: {
    position: 'absolute',
    width: 24,
    height: 24,
    top: -20,
  },
});
