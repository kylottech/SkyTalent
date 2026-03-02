import React, { useRef, useEffect } from 'react';
import { View, Dimensions, Animated } from 'react-native';
import { Path, Svg, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');
const LETTER_SIZE = width * 0.15; // Responsive size based on screen width

const AnimatedPath = Animated.createAnimatedComponent(Path);

function Letter({ d, delay, isRotating, isK }) {
  const dashOffset = useRef(new Animated.Value(385)).current;
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dashOffset, {
          toValue: 5,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(dashOffset, {
          toValue: 385,
          duration: 0,
          useNativeDriver: false,
        })
      ])
    ).start();

    if (isRotating) {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      ).start();
    }
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '1080deg']
  });

  return (
    <Animated.View style={isRotating ? { transform: [{ rotate: spin }] } : {}}>
      <Svg width={LETTER_SIZE} height={LETTER_SIZE} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#0575e6" />
            <Stop offset="100%" stopColor="#021b79" />
          </LinearGradient>
          {/* Degradado especial para la letra "K" */}
          {isK && (
            <LinearGradient id="kGradient" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0%" stopColor="#d2ae79" />
              <Stop offset="100%" stopColor="#b38e5e" />
            </LinearGradient>
          )}
        </Defs>
        <AnimatedPath
          d={d}
          stroke={isK ? "url(#kGradient)" : "url(#gradient)"} // Se aplica el gradiente especial a la "K"
          strokeWidth={8}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={360}
          strokeDashoffset={dashOffset}
        />
      </Svg>
    </Animated.View>
  );
}

const letters = [
  { d: 'M 20,20 L 20,80 L 20,50 L 60,20 M 20,50 L 60,80', isK: true },  // k
  { d: 'M 20,20 L 50,50 L 80,20 M 50,50 L 50,80' },  // y
  { d: 'M 20,20 L 20,80 L 80,80' },  // l
  { d: 'M 50,15 A 35,35 0 0 1 85,50 A 35,35 0 0 1 50,85 A 35,35 0 0 1 15,50 A 35,35 0 0 1 50,15', isRotating: true },  // O
  { d: 'M 20,20 L 20,80 M 10,20 L 80,20' },  // t
];

const Loader = () => {
  return (
    <View style={{
      flex: 1,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 65
    }}>
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16
      }}>
        {letters.map((letter, index) => (
          <Letter
            key={index}
            d={letter.d}
            delay={index * 200}
            isRotating={letter.isRotating || false}
            isK={letter.isK || false}  // Indicamos si la letra es "K" para usar el gradiente especial
          />
        ))}
      </View>
    </View>
  );
}

export default Loader;
