import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import GradientButton from '../Utils/GradientButton';

const { height: screenHeight } = Dimensions.get('window');

const SaveProductModal = ({ visible, onClose, onSaveToCollection, onCreateCollection }) => {
  const [loading, setLoading] = useState(false);
  const [savingToCollection, setSavingToCollection] = useState(false);
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          delay: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleSaveToCollection = async () => {
    setSavingToCollection(true);
    setLoading(true);
    
    // Start spinning animation
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      onSaveToCollection();
      onClose();
    } catch (error) {
      console.error('Error saving to collection:', error);
    } finally {
      setLoading(false);
      setSavingToCollection(false);
      spinAnim.setValue(0);
    }
  };

  const handleCreateCollection = () => {
    onClose();
    onCreateCollection();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent onRequestClose={handleClose} animationType="none">
      <StatusBar backgroundColor="rgba(0, 0, 0, 0.5)" barStyle="light-content" />
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={[
          styles.modalContainer,
          { 
            transform: [
              { translateY },
              { scale: scaleAnim }
            ]
          }
        ]}>
          <SafeAreaView style={styles.safeArea}>
            {/* Premium Handle Bar */}
            <View style={styles.handleContainer}>
              <View style={styles.handleBar} />
            </View>

            {/* Elegant Header */}
            <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
              <View style={styles.headerContent}>
                <View style={styles.iconContainer}>
                  <LinearGradient
                    colors={['#007AFF', '#5AC8FA']}
                    style={styles.iconGradient}
                  >
                    <Ionicons name="bookmark" size={24} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.titleContainer}>
                  <Text style={styles.title}>Guardar producto</Text>
                  <Text style={styles.subtitle}>Organiza tus productos favoritos</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Ionicons name="close" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </Animated.View>

            {/* Scrollable Content */}
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}
              keyboardShouldPersistTaps="handled"
              bounces={true}
            >
                {/* Premium Content */}
                <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
                  <Text style={styles.questionText}>
                    ¿Dónde quieres guardar este producto?
                  </Text>

                  {/* Premium Options */}
                  <View style={styles.optionsContainer}>
                    
                    {/* Mi Colección - Premium Design */}
                    <TouchableOpacity 
                      style={[
                        styles.optionButton,
                        savingToCollection && styles.optionButtonLoading
                      ]}
                      onPress={handleSaveToCollection}
                      disabled={loading}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={savingToCollection ? ['#F8F9FA', '#E9ECEF'] : ['#FFFFFF', '#F8F9FA']}
                        style={styles.optionGradient}
                      >
                        <View style={styles.optionContent}>
                          <View style={styles.optionIconContainer}>
                            <LinearGradient
                              colors={['#007AFF', '#5AC8FA']}
                              style={styles.optionIconGradient}
                            >
                              <Ionicons 
                                name={savingToCollection ? "hourglass-outline" : "bookmark"} 
                                size={22} 
                                color="#FFFFFF" 
                              />
                            </LinearGradient>
                          </View>
                          <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Mi Colección</Text>
                            <Text style={styles.optionSubtitle}>
                              {savingToCollection ? 'Guardando...' : 'Guardar en tu colección personal'}
                            </Text>
                          </View>
                          {!savingToCollection && (
                            <View style={styles.chevronContainer}>
                              <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                            </View>
                          )}
                          {savingToCollection && (
                            <View style={styles.loadingContainer}>
                              <Animated.View style={[
                                styles.loadingSpinner,
                                {
                                  transform: [{
                                    rotate: spinAnim.interpolate({
                                      inputRange: [0, 1],
                                      outputRange: ['0deg', '360deg'],
                                    })
                                  }]
                                }
                              ]}>
                                <Ionicons name="refresh" size={16} color="#007AFF" />
                              </Animated.View>
                            </View>
                          )}
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    {/* Nueva Colección - Premium Design */}
                    <TouchableOpacity 
                      style={styles.optionButton}
                      onPress={handleCreateCollection}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#FFFFFF', '#F8F9FA']}
                        style={styles.optionGradient}
                      >
                        <View style={styles.optionContent}>
                          <View style={styles.optionIconContainer}>
                            <LinearGradient
                              colors={['#34C759', '#30D158']}
                              style={styles.optionIconGradient}
                            >
                              <Ionicons name="add-circle" size={22} color="#FFFFFF" />
                            </LinearGradient>
                          </View>
                          <View style={styles.optionTextContainer}>
                            <Text style={styles.optionTitle}>Nueva Colección</Text>
                            <Text style={styles.optionSubtitle}>Crear una nueva colección personalizada</Text>
                          </View>
                          <View style={styles.chevronContainer}>
                            <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                  </View>
                </Animated.View>
            </ScrollView>

            {/* Elegant Footer */}
            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={handleClose}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Overlay & Backdrop
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  
  // Modal Container
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: screenHeight * 0.5,
    minHeight: 350,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 24,
  },
  safeArea: {
    flex: 1,
  },
  
  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
    minHeight: 200,
  },
  
  // Premium Handle Bar
  handleContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Elegant Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.1,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  
  // Premium Content
  content: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  questionText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  
  // Premium Options
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  optionButtonLoading: {
    opacity: 0.7,
  },
  optionGradient: {
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIconContainer: {
    marginRight: 16,
  },
  optionIconGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  optionSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.1,
    lineHeight: 20,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  loadingContainer: {
    marginLeft: 8,
  },
  loadingSpinner: {
    // Transform is handled in the component
  },
  
  // Elegant Footer
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    backgroundColor: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cancelButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#8E8E93',
    letterSpacing: -0.2,
  },
});

export default SaveProductModal;
