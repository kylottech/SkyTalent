import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BenefitLockedModal = ({ visible, onClose, onUnlock, benefitData }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const lockRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Animación sutil del candado
      Animated.loop(
        Animated.sequence([
          Animated.timing(lockRotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(lockRotateAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible]);

  const lockRotate = lockRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <TouchableOpacity 
          style={styles.overlayTouchable} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={['#1a1a2e', '#16213e', '#0f3460']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Efecto glass estilo Apple */}
            <View style={styles.glassEffect} />
            
            {/* Botón cerrar minimalista */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>

            {/* Icono de candado animado */}
            <Animated.View 
              style={[
                styles.lockContainer,
                { transform: [{ rotate: lockRotate }] }
              ]}
            >
              <LinearGradient
                colors={['#FFD166', '#FFA94D', '#FF8C42']}
                style={styles.lockCircle}
              >
                <Image 
                  source={require('../../../assets/candadoBloqueado.png')} 
                  style={styles.lockIcon}
                />
              </LinearGradient>
            </Animated.View>

            {/* Contenido minimalista */}
            <View style={styles.content}>
              <Text style={styles.title}>Beneficio Bloqueado</Text>
              <Text style={styles.subtitle}>
                Este beneficio exclusivo aún no está disponible para ti
              </Text>

              {/* Info del beneficio */}
              <View style={styles.benefitInfo}>
                <View style={styles.infoRow}>
                  <View style={styles.infoDot} />
                  <Text style={styles.infoText}>{benefitData?.title || 'Beneficio Premium'}</Text>
                </View>
                {benefitData?.value && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoDot} />
                    <Text style={styles.infoText}>Valor: {benefitData.value}</Text>
                  </View>
                )}
                {benefitData?.expiryDate && (
                  <View style={styles.infoRow}>
                    <View style={styles.infoDot} />
                    <Text style={styles.infoText}>Válido hasta {benefitData.expiryDate}</Text>
                  </View>
                )}
              </View>

              {/* Botones de acción estilo Apple */}
              <TouchableOpacity 
                style={styles.unlockButton}
                onPress={onUnlock}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#58D5C9', '#00E5BF', '#00C9B7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.unlockGradient}
                >
                  <Text style={styles.unlockText}>Desbloquear Beneficio</Text>
                  <View style={styles.unlockIcon}>
                    <Text style={styles.unlockArrow}>→</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelText}>Ahora no</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  gradient: {
    padding: 32,
    position: 'relative',
  },
  glassEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeIcon: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '300',
    marginTop: -2,
  },
  lockContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  lockCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD166',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  lockIcon: {
    width: 40,
    height: 40,
    tintColor: '#1a1a2e',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: -0.5,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  benefitInfo: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#58D5C9',
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  unlockButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#58D5C9',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  unlockGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  unlockText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a2e',
    marginRight: 8,
  },
  unlockIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 26, 46, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockArrow: {
    fontSize: 14,
    color: '#1a1a2e',
    fontWeight: '600',
  },
  cancelButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

export default BenefitLockedModal;

