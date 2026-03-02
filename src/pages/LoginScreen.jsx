import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Animated,
  Dimensions
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { login } from '../services/logServices';
import Error from '../components/Utils/Error';
import LoadingOverlay from '../components/Utils/LoadingOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import logoKylot from '../../assets/logoKylot.png';

const { width: screenWidth } = Dimensions.get('window');

const LoginScreen = () => {
  const navigation = useNavigation();
  const { isLogged, texts } = useUser();
  const screenTexts = texts.pages.LoginScreen;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLogged) {
      navigation.navigate('LoaderScreen');
    }
  }, [isLogged]);

  // Entrance animations
  useEffect(() => {
    const startAnimations = () => {
      Animated.parallel([
        Animated.timing(logoAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          delay: 100,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 800,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    const timer = setTimeout(startAnimations, 100);
    return () => {
      clearTimeout(timer);
      // Cleanup animations
      logoAnim.stopAnimation();
      fadeAnim.stopAnimation();
      slideAnim.stopAnimation();
      scaleAnim.stopAnimation();
    };
  }, []);

  const handleLogin = () => {
    if (!loading) {
      if (phone !== '' && password !== '') {
        setLoading(true);
        login({ username: phone, password: password })
        .then((res) => {
          setLoading(false);
          navigation.navigate('CodigoVerificacion', { email: res });
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          setErrorMessage(error.message || 'Error al iniciar sesión');
        });
      } else {
        setError(true);
        setErrorMessage('Por favor completa todos los campos');
        setLoading(false);
      }
    }
  };

  const handleAppleLogin = () => {
    // Handle Apple login
    console.log('Apple login');
  };

  const handleGoogleLogin = () => {
    // Handle Google login
    console.log('Google login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
        {/* Header */}
        <Animated.View 
          style={[
            styles.header,
            {
              opacity: logoAnim,
              transform: [
                {
                  translateY: logoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.headerLeft} />
          <View style={styles.headerCenter}>
            <Image source={logoKylot} style={styles.logo} />
          </View>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => navigation.navigate('FirstScreen')}
            activeOpacity={0.7}
          >
            <View style={styles.closeIconContainer}>
              <View style={styles.closeLine1} />
              <View style={styles.closeLine2} />
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Welcome Title */}
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          <Text style={styles.welcomeTitle}>WELCOME BACK!</Text>
        </Animated.View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* New User Link */}
          <Animated.View 
            style={[
              styles.newUserContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.newUserText}>¿Nuevo usuario? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate("Registro")}
              activeOpacity={0.7}
            >
              <Text style={styles.createAccountLink}>Crear cuenta →</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Input Fields */}
          <Animated.View 
            style={[
              styles.inputsContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Teléfono"
                placeholderTextColor="#9CA3AF"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity 
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                activeOpacity={0.7}
              >
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('RecuperarContrasenia1')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>He olvidado mi contraseña</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Social Login Buttons */}
          <Animated.View 
            style={[
              styles.socialContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={handleAppleLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>🍎</Text>
              <Text style={styles.socialText}>Entrar con Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={handleGoogleLogin}
              activeOpacity={0.7}
            >
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Entrar con Google</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Legal Disclaimer */}
          <Animated.View 
            style={[
              styles.legalContainer,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: slideAnim,
                  },
                ],
              },
            ]}
          >
            <Text style={styles.legalText}>
              Al pulsar Continuar/Registrarse, aceptas nuestros{' '}
              <Text style={styles.legalLink} onPress={() => navigation.navigate('TerminosCondiciones')}>Términos y Condiciones</Text>
              {' '}y nuestra{' '}
              <Text style={styles.legalLink} onPress={() => navigation.navigate('PoliticaPrivacidad')}>Política de Privacidad</Text>
            </Text>
          </Animated.View>
        </ScrollView>

        {/* Main Login Button */}
        <Animated.View 
          style={[
            styles.bottomContainer,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: slideAnim,
                },
              ],
            },
          ]}
        >
          <TouchableOpacity 
            style={[styles.loginButton, (!phone || !password) && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={!phone || !password}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={(!phone || !password) ? ['#E5E7EB', '#9CA3AF'] : ['#004999', '#1D7CE4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.loginButtonText}>Entrar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {error && errorMessage && <Error message={errorMessage} func={setError} />}
        {loading && <LoadingOverlay />}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerLeft: {
    width: 32,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: 0.5,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIconContainer: {
    width: 16,
    height: 16,
    position: 'relative',
  },
  closeLine1: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#000000',
    transform: [{ rotate: '45deg' }],
    top: 7,
    left: -2,
  },
  closeLine2: {
    position: 'absolute',
    width: 20,
    height: 2,
    backgroundColor: '#000000',
    transform: [{ rotate: '-45deg' }],
    top: 7,
    left: -2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  newUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 48,
    paddingLeft: 4,
    justifyContent: 'center',
  },
  newUserText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  createAccountLink: {
    fontSize: 16,
    color: '#004999',
    fontWeight: '700',
  },
  inputsContainer: {
    marginBottom: 40,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '400',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  eyeButton: {
    position: 'absolute',
    right: 20,
    top: 18,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  forgotPasswordText: {
    fontSize: 15,
    color: '#004999',
    fontWeight: '500',
  },
  socialContainer: {
    marginBottom: 40,
    gap: 16,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  socialIcon: {
    fontSize: 20,
    marginRight: 12,
    fontWeight: '700',
  },
  socialText: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  legalContainer: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  legalText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 20,
    textAlign: 'center',
  },
  legalLink: {
    color: '#004999',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    paddingTop: 24,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default LoginScreen;
