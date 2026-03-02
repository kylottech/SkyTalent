import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/useUser';

const { width: screenWidth } = Dimensions.get('window');

const EnhancedMarketplaceBanner = ({ onPress }) => {
  const { texts } = useUser();
  const bannerTexts = texts?.pages?.MarketPlace?.MarketplaceBanner || {
    BenefitText: 'MARKETPLACE KYLOT',
    Title: 'Descubre productos increíbles',
    Subtitle: 'Explora ofertas especiales y productos recomendados'
  };
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const gradientAnim = useRef(new Animated.Value(0)).current;
  const particleAnim = useRef(new Animated.Value(0)).current;
  const intervalRef = useRef(null);
  
  // Estado para efectos
  const [isPressed, setIsPressed] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isMounted) return;

    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación continua del gradiente
    const gradientAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: false,
        }),
        Animated.timing(gradientAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: false,
        }),
      ])
    );
    gradientAnimation.start();

    // Animación de partículas
    const particleAnimation = Animated.loop(
      Animated.timing(particleAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    particleAnimation.start();

    return () => {
      setIsMounted(false);
      gradientAnimation.stop();
      particleAnimation.stop();
    };
  }, [isMounted]);

  const handlePress = () => {
    if (!isMounted) return;
    
    // Animación de feedback al tocar
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress?.();
  };

  const gradientColors = gradientAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      ['#1a1a2e', '#16213e', '#0f3460'],
      ['#16213e', '#0f3460', '#1a1a2e'],
      ['#0f3460', '#1a1a2e', '#16213e'],
    ],
  });

  const particleTranslateY = particleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const particleOpacity = particleAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 0.8, 0.3],
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { translateY: slideAnim },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.bannerTouchable}
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.9}
      >
        <Animated.View style={styles.gradientContainer}>
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Efecto de partículas */}
            <Animated.View 
              style={[
                styles.particles,
                {
                  opacity: particleOpacity,
                  transform: [{ translateY: particleTranslateY }]
                }
              ]}
            >
              <View style={[styles.particle, styles.particle1]} />
              <View style={[styles.particle, styles.particle2]} />
              <View style={[styles.particle, styles.particle3]} />
              <View style={[styles.particle, styles.particle4]} />
            </Animated.View>

            {/* Overlay sutil */}
            <View style={styles.overlay} />
            
            <View style={styles.content}>
              <View style={styles.leftContent}>
                {/* Texto principal con iconos */}
                <View style={styles.brandContainer}>
                  <Text style={styles.brandText}>{bannerTexts?.BenefitText || 'MARKETPLACE KYLOT'}</Text>
                  <View style={styles.brandAccent} />
                </View>
                
                <View style={styles.titleContainer}>
                  <Text style={styles.titleIcon}>★</Text>
                  <Text style={styles.title}>{bannerTexts?.Title || 'Descubre productos increíbles'}</Text>
                </View>
                
                <View style={styles.subtitleContainer}>
                  <Text style={styles.subtitleIcon}>•</Text>
                  <Text style={styles.subtitle}>{bannerTexts?.Subtitle || 'Explora ofertas especiales y productos recomendados'}</Text>
                </View>

                {/* Call to Action Button */}
                <TouchableOpacity 
                  style={[styles.ctaButton, isPressed && styles.ctaButtonPressed]}
                  onPress={handlePress}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFD700', '#FFA500']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.ctaGradient}
                  >
                    <Text style={styles.ctaText}>Explorar Ahora</Text>
                    <Text style={styles.ctaArrow}>→</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              
              <View style={styles.rightContent}>
                <Animated.View 
                  style={[
                    styles.graphicContainer,
                    {
                      transform: [
                        { 
                          rotate: particleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '5deg']
                          })
                        }
                      ]
                    }
                  ]}
                >
                  <Image 
                    source={require('../../../assets/CORONA_DORADA.png')} 
                    style={styles.coronaIcon}
                    resizeMode="contain"
                  />
                  {/* Efectos de brillo alrededor del icono */}
                  <View style={styles.glowEffect} />
                </Animated.View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
  },
  bannerTouchable: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradientContainer: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  gradient: {
    height: 140,
    justifyContent: 'center',
    position: 'relative',
  },
  particles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.6)',
  },
  particle1: {
    top: '20%',
    left: '15%',
  },
  particle2: {
    top: '60%',
    right: '20%',
  },
  particle3: {
    top: '40%',
    left: '80%',
  },
  particle4: {
    bottom: '30%',
    left: '30%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    zIndex: 2,
  },
  leftContent: {
    flex: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginRight: 8,
  },
  brandAccent: {
    width: 20,
    height: 2,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
    flex: 1,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtitleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    lineHeight: 18,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  ctaText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  ctaArrow: {
    color: '#1a1a2e',
    fontSize: 16,
    fontWeight: '800',
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 16,
  },
  graphicContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coronaIcon: {
    width: 50,
    height: 50,
    zIndex: 2,
  },
  glowEffect: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    zIndex: 1,
  },
});

export default EnhancedMarketplaceBanner;
