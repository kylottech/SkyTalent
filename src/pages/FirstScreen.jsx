import React, { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, StyleSheet, Image, Text, TouchableOpacity, StatusBar, Animated, Dimensions, Easing } from 'react-native';
import { useUser } from "../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import logoKylot from '../../assets/logoKylot_blanco.png';
import iconPerson from '../../assets/iconPerson.png';
import candadoDorado from '../../assets/candadoDorado.png';

const { width: screenWidth } = Dimensions.get('window');

const FirstScreen = () => {
  const navigation = useNavigation();
  const { texts } = useUser();
  const screenTexts = texts.pages.FirstScreen;
  const scrollX = useRef(new Animated.Value(0)).current;
  
  // Animation values for smooth Apple-style animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const heroSlideAnim = useRef(new Animated.Value(30)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Banner scroll animation
  useEffect(() => {
    const animateInfinite = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: -screenWidth,
        duration: 15000,
        useNativeDriver: true,
      }).start(() => {
        animateInfinite();
      });
    };
    animateInfinite();
  }, []);

  // Apple-style entrance animations
  useEffect(() => {
    const startAnimations = () => {
      // Hero section entrance
      Animated.parallel([
        Animated.timing(heroSlideAnim, {
          toValue: 0,
          duration: 1200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          delay: 200,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();

      // Action section entrance
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 800,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.back(1.1)),
            useNativeDriver: true,
          }),
        ]).start();

        // Button entrance
        setTimeout(() => {
          Animated.spring(buttonAnim, {
            toValue: 1,
            tension: 50,
            friction: 8,
            useNativeDriver: true,
          }).start();

          // Pulse animation for main button
          const createPulse = () => {
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.05,
                duration: 1000,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.inOut(Easing.quad),
                useNativeDriver: true,
              }),
            ]).start(() => createPulse());
          };
          createPulse();
        }, 300);
      }, 400);
    };

    const timer = setTimeout(startAnimations, 100);
    return () => {
      clearTimeout(timer);
      // Cleanup animations
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
      scaleAnim.stopAnimation();
      heroSlideAnim.stopAnimation();
      buttonAnim.stopAnimation();
      pulseAnim.stopAnimation();
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Banner with Infinite Scroll */}
      <View style={styles.topBanner}>
        <LinearGradient
          colors={['#004999', '#1D7CE4']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.bannerGradient}
        >
          <View style={styles.scrollContainer}>
            <Animated.View
              style={[
                styles.scrollContent,
                {
                  transform: [{ translateX: scrollX }],
                },
              ]}
            >
              <Text style={styles.bannerText}>PRIVATE BUT NOT SECRET  •  PRIVATE BUT NOT SECRET  •  PRIVATE BUT NOT SECRET  •  </Text>
              <Text style={styles.bannerText}>PRIVATE BUT NOT SECRET  •  PRIVATE BUT NOT SECRET  •  PRIVATE BUT NOT SECRET  •  </Text>
            </Animated.View>
          </View>
        </LinearGradient>
      </View>
      
      {/* Hero Section with Background */}
      <View style={styles.heroSection}>
        <Image 
          source={require('../../assets/welcome1.jpg')} 
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        

        {/* Main Content */}
        <Animated.View 
          style={[
            styles.mainContent,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: heroSlideAnim,
                },
              ],
            },
          ]}
        >
          <Animated.Text 
            style={[
              styles.mainTitle,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: heroSlideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 20],
                    }),
                  },
                ],
              },
            ]}
          >
            WELCOME TO THE WORLDWIDE WIN WIN COMMUNITY
          </Animated.Text>
          <Animated.Text 
            style={[
              styles.subtitle,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: heroSlideAnim.interpolate({
                      inputRange: [0, 30],
                      outputRange: [0, 15],
                    }),
                  },
                ],
              },
            ]}
          >
            La plataforma que reconoce tu valor y lo multiplica al cuadrado
          </Animated.Text>
        </Animated.View>
      </View>

      {/* Action Section */}
      <Animated.View 
        style={[
          styles.actionSection,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: slideAnim,
              },
              {
                scale: scaleAnim,
              },
            ],
          },
        ]}
      >
        {/* Login Option */}
        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [
              {
                translateX: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-50, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Iniciar sesión</Text>
            </View>
            <View style={styles.chevronContainer}>
              <View style={styles.chevronLine1} />
              <View style={styles.chevronLine2} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Register Option */}
        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [
              {
                translateX: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
        >
          <TouchableOpacity 
            style={styles.actionItem}
            onPress={() => navigation.navigate('Registro')}
            activeOpacity={0.7}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Crear cuenta</Text>
            </View>
            <View style={styles.chevronContainer}>
              <View style={styles.chevronLine1} />
              <View style={styles.chevronLine2} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Main CTA Button */}
        <Animated.View
          style={{
            opacity: buttonAnim,
            transform: [
              {
                scale: pulseAnim,
              },
            ],
          }}
        >
          <TouchableOpacity 
            style={styles.mainButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#004999', '#1D7CE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.mainButtonText}>ÚNETE AHORA</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: 'hidden',
  },
  bannerGradient: {
    paddingVertical: 12,
    overflow: 'hidden',
  },
  scrollContainer: {
    overflow: 'hidden',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth * 2,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroSection: {
    flex: 1,
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.95,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -0.2,
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 50,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 32,
    height: 32,
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  chevronContainer: {
    width: 12,
    height: 12,
    position: 'relative',
  },
  chevronLine1: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    backgroundColor: '#9CA3AF',
    transform: [{ rotate: '45deg' }],
    top: 5,
    left: 1,
  },
  chevronLine2: {
    position: 'absolute',
    width: 8,
    height: 1.5,
    backgroundColor: '#9CA3AF',
    transform: [{ rotate: '-45deg' }],
    top: 5,
    left: 5,
  },
  mainButton: {
    marginTop: 32,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 40,
  },
  mainButtonText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});

export default FirstScreen;
