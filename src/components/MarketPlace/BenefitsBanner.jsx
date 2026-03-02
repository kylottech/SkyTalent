import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/useUser';

const BenefitsBanner = ({ onPress }) => {
  const { texts } = useUser();
  const bannerTexts = texts.pages.MarketPlace.BenefitsBanner;
  
  // Animaciones sutiles estilo Apple
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Efecto shimmer sutil
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 300],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <TouchableOpacity 
        activeOpacity={0.95}
        onPress={onPress}
        style={styles.touchable}
      >
        <LinearGradient
          colors={['#6C63FF', '#5A52E0', '#4840C4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Efecto shimmer estilo Duolingo */}
          <Animated.View 
            style={[
              styles.shimmer,
              {
                transform: [{ translateX: shimmerTranslate }]
              }
            ]}
          />
          
          {/* Efecto glass estilo Apple */}
          <View style={styles.glassEffect} />
          
          <View style={styles.content}>
            <View style={styles.textContainer}>
              {/* Badge estilo */}
              <View style={styles.badge}>
                <View style={styles.badgeGlow} />
                <Text style={styles.badgeText}>{bannerTexts.BenefitText}</Text>
              </View>
              
              {/* Título principal */}
              <Text style={styles.title} numberOfLines={2}>
                {bannerTexts.Title}
              </Text>
              
              {/* Subtítulo */}
              <Text style={styles.subtitle} numberOfLines={2}>
                {bannerTexts.Subtitle}
              </Text>

              {/* CTA minimalista */}
              <View style={styles.ctaContainer}>
                <Text style={styles.ctaText}>Explorar</Text>
                <View style={styles.ctaArrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View>
            </View>

            {/* Elemento decorativo geométrico */}
            <View style={styles.decorativeContainer}>
              <View style={styles.geometricShape}>
                <LinearGradient
                  colors={['#FFD166', '#FFA94D', '#FF8C42']}
                  style={styles.shapeGradient}
                >
                  <View style={styles.innerShape} />
                </LinearGradient>
              </View>
              <View style={styles.accentDot} />
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 24,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6C63FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  touchable: {
    borderRadius: 20,
  },
  gradient: {
    minHeight: 140,
    paddingVertical: 24,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
  glassEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    paddingRight: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 28,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.2,
    marginBottom: 12,
  },
  ctaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
  },
  ctaArrow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  decorativeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  geometricShape: {
    width: 64,
    height: 64,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD166',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  shapeGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerShape: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  accentDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#58D5C9',
    borderWidth: 2,
    borderColor: '#6C63FF',
  },
});

export default BenefitsBanner;
