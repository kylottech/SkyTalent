import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/useUser';

const MarketplaceBanner = ({ onPress }) => {
  const { texts } = useUser();
  const bannerTexts = texts.pages.MarketPlace.MarketplaceBanner;
  
  // Animaciones sutiles estilo Apple
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Animación de entrada elegante
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

    // Pulso sutil continuo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
          colors={['#004481', '#0066CC', '#0078D4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {/* Capa de brillo sutil estilo Apple */}
          <View style={styles.glassEffect} />
          
          <View style={styles.content}>
            <View style={styles.textContainer}>
              {/* Tag minimalista */}
              <View style={styles.tagContainer}>
                <View style={styles.tagDot} />
                <Text style={styles.tag}>{bannerTexts.BenefitText}</Text>
              </View>
              
              {/* Título principal - Tipografía Apple */}
              <Text style={styles.title} numberOfLines={2}>
                {bannerTexts.Title}
              </Text>
              
              {/* Subtítulo limpio */}
              <Text style={styles.subtitle} numberOfLines={2}>
                {bannerTexts.Subtitle}
              </Text>

              {/* Indicador visual minimalista */}
              <View style={styles.actionIndicator}>
                <View style={styles.arrowContainer}>
                  <Text style={styles.arrow}>→</Text>
                </View>
              </View>
            </View>

            {/* Elemento decorativo geométrico en lugar de icono */}
            <Animated.View 
              style={[
                styles.decorativeElement,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={['#58D5C9', '#00E5BF', '#00C9B7']}
                style={styles.circle}
              >
                <View style={styles.innerCircle} />
              </LinearGradient>
            </Animated.View>
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
    // Sombra sutil estilo Apple
    ...Platform.select({
      ios: {
        shadowColor: '#004481',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
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
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#58D5C9',
    marginRight: 8,
  },
  tag: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: 8,
    lineHeight: 28,
    // Tipografía estilo San Francisco (Apple)
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
  },
  actionIndicator: {
    marginTop: 12,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  decorativeElement: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    // Sombra del elemento decorativo
    ...Platform.select({
      ios: {
        shadowColor: '#00E5BF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
});

export default MarketplaceBanner;
