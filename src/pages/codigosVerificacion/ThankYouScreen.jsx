import React from 'react';
import { View, Text, StyleSheet, Platform, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";

import GradientButton from '../../components/Utils/GradientButton';

const ThankYouScreen = () => {
  const navigate = useNavigation();
  const { texts } = useUser();
  const screenTexts = texts?.pages?.codigosVerificacion?.ThankYouScreen || {
    title: "Thanks",
    subtitle: "for being",
    highlight: "an **early**",
    endline: "adopter",
    description: "Phase one, starts with a preconfigured % integration. We'll add more over time.",
    invitationsLabel: "invitations",
    continueButton: "Continue"
  };

  // Placeholder para el número de invitaciones - luego conectaremos con el servicio real
  const invitationsCount = 10800;

  const formatInvitationsCount = (count) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1).replace('.0', '') + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return count.toString();
  };

  const handleContinue = () => {
    // Navegar a la siguiente pantalla según el flujo actual
    navigate.navigate('Seleccion');
  };

  return (
    <LinearGradient
      colors={['#001a4d', '#004999', '#1D7CE4', '#4A90E2']} // Gradiente azul muy intenso e inspirado en Apple/Duolingo
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#004999" />
      
      <View style={styles.content}>
        {/* Texto principal */}
        <View style={styles.mainTextContainer}>
          <Text style={styles.mainTitle}>{screenTexts.title}</Text>
          <Text style={styles.mainTitle}>{screenTexts.subtitle}</Text>
          <Text style={styles.mainTitleHighlight}>
            {screenTexts.highlight.replace('**', '')}
          </Text>
          <Text style={styles.mainTitle}>{screenTexts.endline}</Text>
        </View>

        {/* Descripción */}
        <Text style={styles.description}>
          {screenTexts.description}
        </Text>

        {/* Card con número de invitaciones */}
        <View style={styles.invitationsCard}>
          <Text style={styles.invitationsNumber}>
            {formatInvitationsCount(invitationsCount)}
          </Text>
          <Text style={styles.invitationsLabel}>
            {screenTexts.invitationsLabel}
          </Text>
          {/* Logo pequeño en la esquina superior derecha */}
          <View style={styles.logoContainer}>
            <Text style={styles.appLogo}>K</Text>
          </View>
        </View>

        {/* Botón Continue */}
        <View style={styles.buttonContainer}>
          <GradientButton 
            text={screenTexts.continueButton}
            color='Blue' 
            onPress={handleContinue} 
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  mainTextContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: 56,
    marginBottom: 4,
  },
  mainTitleHighlight: {
    fontSize: 48,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -1.2,
    lineHeight: 56,
    marginBottom: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
    marginHorizontal: 20,
    marginTop: 20,
  },
  invitationsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 32,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    position: 'relative',
    marginVertical: 40,
  },
  invitationsNumber: {
    fontSize: 42,
    fontWeight: '800',
    color: '#004999',
    textAlign: 'center',
    letterSpacing: -0.8,
    marginBottom: 8,
    lineHeight: 50,
  },
  invitationsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004999',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  logoContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    backgroundColor: '#004999',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appLogo: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 20 : 40,
  },
});

export default ThankYouScreen;
