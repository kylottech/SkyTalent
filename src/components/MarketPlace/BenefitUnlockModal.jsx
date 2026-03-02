import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Animated, Platform, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const BenefitUnlockModal = ({ visible, onClose, onConfirm, benefitData, userKylets = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const coinAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);

  const kyletsRequired = benefitData?.kyletsPrice || 100;
  const hasEnoughKylets = userKylets >= kyletsRequired;

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

      // Animación de monedas
      Animated.loop(
        Animated.sequence([
          Animated.timing(coinAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(coinAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
      setLoading(false);
    }
  }, [visible]);

  const coinTranslateY = coinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  const coinOpacity = coinAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6],
  });

  const handleConfirm = async () => {
    if (!hasEnoughKylets) return;
    
    setLoading(true);
    // Simular transacción
    setTimeout(() => {
      setLoading(false);
      onConfirm();
    }, 1500);
  };

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
          onPress={!loading ? onClose : null}
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
            colors={['#6C63FF', '#5A52E0', '#4840C4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradient}
          >
            {/* Efecto glass */}
            <View style={styles.glassEffect} />
            
            {/* Botón cerrar */}
            {!loading && (
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeIcon}>×</Text>
              </TouchableOpacity>
            )}

            {/* Icono de moneda animado */}
            <Animated.View 
              style={[
                styles.coinContainer,
                {
                  transform: [{ translateY: coinTranslateY }],
                  opacity: coinOpacity,
                }
              ]}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                style={styles.coinCircle}
              >
                <Text style={styles.coinK}>K</Text>
              </LinearGradient>
            </Animated.View>

            {/* Contenido */}
            <View style={styles.content}>
              <Text style={styles.title}>Desbloquear Beneficio</Text>
              <Text style={styles.subtitle}>
                Usa tus Kylets para acceder a este beneficio exclusivo
              </Text>

              {/* Información del precio */}
              <View style={styles.priceCard}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Precio:</Text>
                  <View style={styles.priceValue}>
                    <Text style={styles.priceAmount}>{kyletsRequired}</Text>
                    <Text style={styles.priceUnit}>Kylets</Text>
                  </View>
                </View>
                
                <View style={styles.divider} />
                
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Tu saldo:</Text>
                  <View style={styles.priceValue}>
                    <Text style={[
                      styles.priceAmount,
                      !hasEnoughKylets && styles.insufficientAmount
                    ]}>
                      {userKylets}
                    </Text>
                    <Text style={styles.priceUnit}>Kylets</Text>
                  </View>
                </View>
                
                {hasEnoughKylets && (
                  <>
                    <View style={styles.divider} />
                    
                    <View style={styles.priceRow}>
                      <Text style={styles.priceLabel}>Saldo restante:</Text>
                      <View style={styles.priceValue}>
                        <Text style={styles.priceAmount}>{userKylets - kyletsRequired}</Text>
                        <Text style={styles.priceUnit}>Kylets</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>

              {/* Mensaje de advertencia si no tiene suficientes kylets */}
              {!hasEnoughKylets && (
                <View style={styles.warningCard}>
                  <Text style={styles.warningText}>
                    ⚠️ No tienes suficientes Kylets
                  </Text>
                  <Text style={styles.warningSubtext}>
                    Necesitas {kyletsRequired - userKylets} Kylets más
                  </Text>
                </View>
              )}

              {/* Beneficios incluidos */}
              <View style={styles.benefitsCard}>
                <Text style={styles.benefitsTitle}>Lo que obtendrás:</Text>
                <View style={styles.benefitItem}>
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                  <Text style={styles.benefitText}>{benefitData?.title || 'Beneficio Premium'}</Text>
                </View>
                {benefitData?.value && (
                  <View style={styles.benefitItem}>
                    <View style={styles.checkIcon}>
                      <Text style={styles.checkMark}>✓</Text>
                    </View>
                    <Text style={styles.benefitText}>Valor de {benefitData.value}</Text>
                  </View>
                )}
                <View style={styles.benefitItem}>
                  <View style={styles.checkIcon}>
                    <Text style={styles.checkMark}>✓</Text>
                  </View>
                  <Text style={styles.benefitText}>Acceso inmediato</Text>
                </View>
              </View>

              {/* Botones de acción */}
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#FFD700" />
                  <Text style={styles.loadingText}>Procesando...</Text>
                </View>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[
                      styles.confirmButton,
                      !hasEnoughKylets && styles.confirmButtonDisabled
                    ]}
                    onPress={handleConfirm}
                    activeOpacity={0.8}
                    disabled={!hasEnoughKylets}
                  >
                    <LinearGradient
                      colors={hasEnoughKylets ? ['#FFD700', '#FFA500', '#FF8C00'] : ['#666', '#666', '#666']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.confirmGradient}
                    >
                      <Text style={styles.confirmText}>
                        {hasEnoughKylets ? 'Confirmar Desbloqueo' : 'Kylets Insuficientes'}
                      </Text>
                      {hasEnoughKylets && (
                        <View style={styles.confirmIcon}>
                          <Text style={styles.confirmArrow}>→</Text>
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>

                  {!hasEnoughKylets && (
                    <TouchableOpacity 
                      style={styles.getKyletsButton}
                      onPress={() => {
                        onClose();
                        // Aquí se podría navegar a la pantalla de obtener kylets
                      }}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.getKyletsText}>Obtener más Kylets</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={onClose}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              )}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    width: '90%',
    maxWidth: 420,
    maxHeight: '90%',
    borderRadius: 28,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 40,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  gradient: {
    padding: 28,
    position: 'relative',
  },
  glassEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
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
  coinContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coinCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  coinK: {
    fontSize: 36,
    fontWeight: '800',
    color: '#6C63FF',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
    letterSpacing: -0.5,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
    }),
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  priceCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  priceLabel: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
  },
  priceValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFD700',
    marginRight: 6,
  },
  insufficientAmount: {
    color: '#FF6B6B',
  },
  priceUnit: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 12,
  },
  warningCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
  },
  warningText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  warningSubtext: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
  benefitsCard: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '600',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(88, 213, 201, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkMark: {
    fontSize: 12,
    color: '#58D5C9',
    fontWeight: '700',
  },
  benefitText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.85)',
    marginTop: 12,
  },
  confirmButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  confirmButtonDisabled: {
    opacity: 0.6,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  confirmText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  confirmIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmArrow: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
  },
  getKyletsButton: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  getKyletsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFD700',
    textAlign: 'center',
  },
  cancelButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default BenefitUnlockModal;

