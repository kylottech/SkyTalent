import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../context/useUser';
import { formatString } from '../../utils/formatString';

const ExperienceBar = ({ nivel, experiencia }) => {
  const { texts } = useUser();
  const screenTexts = texts.pages.Perfil;

  // Calcular XP necesario para el nivel actual y el siguiente
  const xpPorNivel = 1000; // XP necesario para subir de nivel
  const xpNivelActual = (nivel - 1) * xpPorNivel;
  const xpSiguienteNivel = nivel * xpPorNivel;
  const xpEnNivelActual = experiencia - xpNivelActual;
  const xpNecesarioParaSiguiente = xpPorNivel;
  const progress = Math.min((xpEnNivelActual / xpNecesarioParaSiguiente) * 100, 100);

  return (
    <View style={styles.experienceSection}>
      <View style={styles.experienceHeader}>
        <Text style={styles.experienceLabel}>{screenTexts.ExperienceLabel}</Text>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>
            {formatString(screenTexts.LevelText, { variable1: nivel })}
          </Text>
        </View>
      </View>
      
      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={['#7C3AED', '#A855F7', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>
        <View style={styles.experienceInfo}>
          <Text style={styles.experienceText}>
            {formatString(screenTexts.ExperienceText, { 
              variable1: experiencia, 
              variable2: xpSiguienteNivel 
            })}
          </Text>
          <View style={styles.levelIndicators}>
            <Text style={styles.levelIndicatorText}>
              {formatString(screenTexts.LevelIndicator, { variable1: nivel })}
            </Text>
            <Text style={[styles.levelIndicatorText, styles.levelIndicatorTextLast]}>
              {formatString(screenTexts.LevelIndicator, { variable1: nivel + 1 })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  experienceSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  experienceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  levelBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  experienceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  experienceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  levelIndicators: {
    flexDirection: 'row',
  },
  levelIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginRight: 16,
  },
  levelIndicatorTextLast: {
    marginRight: 0,
  },
});

export default ExperienceBar;

