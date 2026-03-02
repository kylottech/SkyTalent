import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/useUser';

const { width: screenWidth } = Dimensions.get('window');

const PremiumBankingBanner = ({ onPress }) => {
  const { texts } = useUser();
  const bannerTexts = texts?.pages?.MarketPlace?.MarketplaceBanner || {
    BenefitText: 'MARKETPLACE KYLOT',
    Title: 'Descubre productos increíbles',
    Subtitle: 'Explora ofertas especiales y productos recomendados'
  };
  
  // Animaciones sutiles y profesionales
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  // Estado para efectos
  const [isPressed, setIsPressed] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    if (!isMounted) return;

    // Animación de entrada elegante
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Efecto shimmer sutil
    const shimmerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerAnimation.start();

    return () => {
      setIsMounted(false);
      shimmerAnimation.stop();
    };
  }, [isMounted]);

  const handlePress = () => {
    if (!isMounted) return;
    
    // Feedback táctil profesional
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.99,
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

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.3],
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
        activeOpacity={0.95}
      >
        {/* Fondo principal con gradiente profesional */}
        <LinearGradient
          colors={['#1a1a2e', '#16213e', '#0f3460']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientBackground}
        >
          {/* Overlay sutil */}
          <View style={styles.overlay} />
          
          {/* Efecto shimmer profesional */}
          <Animated.View 
            style={[
              styles.shimmerEffect,
              { opacity: shimmerOpacity }
            ]}
          />
          
          {/* Contenido principal */}
          <View style={styles.content}>
            <View style={styles.leftContent}>
              {/* Header con estilo bancario */}
              <View style={styles.headerSection}>
                <View style={styles.brandContainer}>
                  <View style={styles.brandIcon}>
                    <Text style={styles.brandIconText}>K</Text>
                  </View>
                  <View style={styles.brandTextContainer}>
                    <Text style={styles.brandText}>{bannerTexts?.BenefitText || 'MARKETPLACE KYLOT'}</Text>
                    <View style={styles.brandAccent} />
                  </View>
                </View>
              </View>
              
              {/* Título principal con tipografía premium */}
              <View style={styles.titleSection}>
                <Text style={styles.mainTitle}>{bannerTexts?.Title || 'Descubre productos increíbles'}</Text>
                <Text style={styles.mainSubtitle}>{bannerTexts?.Subtitle || 'Explora ofertas especiales y productos recomendados'}</Text>
              </View>

              {/* Call to Action con estilo bancario */}
              <TouchableOpacity 
                style={[styles.ctaContainer, isPressed && styles.ctaPressed]}
                onPress={handlePress}
                activeOpacity={0.9}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  <Text style={styles.ctaText}>Explorar Ahora</Text>
                  <View style={styles.ctaIcon}>
                    <Text style={styles.ctaArrow}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Elemento gráfico premium */}
            <View style={styles.rightContent}>
              <View style={styles.graphicContainer}>
                <View style={styles.graphicBackground}>
                  <View style={styles.graphicInner}>
                    <Text style={styles.graphicIcon}>◉</Text>
                  </View>
                </View>
                <View style={styles.graphicAccent} />
              </View>
            </View>
          </View>
          
          {/* Elementos decorativos sutiles */}
          <View style={styles.decorativeElements}>
            <View style={[styles.decorativeDot, styles.dot1]} />
            <View style={[styles.decorativeDot, styles.dot2]} />
            <View style={[styles.decorativeDot, styles.dot3]} />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
    elevation: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  bannerTouchable: {
    borderRadius: 24,
    overflow: 'hidden',
  },
  gradientBackground: {
    height: 160,
    justifyContent: 'center',
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  shimmerEffect: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 24,
    zIndex: 2,
  },
  leftContent: {
    flex: 1,
  },
  headerSection: {
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  brandIconText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  brandTextContainer: {
    flex: 1,
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
    opacity: 0.9,
  },
  brandAccent: {
    width: 24,
    height: 2,
    backgroundColor: '#FFD700',
    borderRadius: 1,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 28,
    marginBottom: 6,
  },
  mainSubtitle: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  ctaContainer: {
    alignSelf: 'flex-start',
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#FFD700',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  ctaPressed: {
    transform: [{ scale: 0.98 }],
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  ctaText: {
    color: '#1a1a2e',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: -0.3,
    marginRight: 8,
  },
  ctaIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(26, 26, 46, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaArrow: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: '800',
  },
  rightContent: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 20,
  },
  graphicContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  graphicInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphicIcon: {
    fontSize: 32,
    color: '#FFD700',
  },
  graphicAccent: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    zIndex: -1,
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  decorativeDot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 215, 0, 0.4)',
  },
  dot1: {
    top: '25%',
    right: '20%',
  },
  dot2: {
    top: '60%',
    right: '15%',
  },
  dot3: {
    bottom: '30%',
    right: '25%',
  },
});

export default PremiumBankingBanner;
