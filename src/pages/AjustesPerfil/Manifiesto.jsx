import React, { useEffect, useState } from "react";
import { View, ScrollView, Text, StyleSheet, Animated, Dimensions, TouchableOpacity, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";

import Top from "../../components/Utils/Top";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');


const Manifiesto = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.Manifiesto

  const [selectedStep, setSelectedStep] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [steps] = useState([
    {
      id: 1,
      title: screenTexts.StepsTitle1,
      description: screenTexts.StepsDescription1,
      completed: false
    },
    {
      id: 2,
      title: screenTexts.StepsTitle2,
      description: screenTexts.StepsDescription2,
      completed: false
    },
    {
      id: 3,
      title: screenTexts.StepsTitle3,
      description: screenTexts.StepsDescription3,
      completed: false
    },
    {
      id: 4,
      title: screenTexts.StepsTitle4,
      description: screenTexts.StepsDescription4,
      completed: false
    },
    {
      id: 5,
      title: screenTexts.StepsTitle5,
      description: screenTexts.StepsDescription5,
      completed: false
    },
    {
      id: 6,
      title: screenTexts.StepsTitle6,
      description: screenTexts.StepsDescription6,
      completed: false
    },
    {
      id: 7,
      title: screenTexts.StepsTitle7,
      description: screenTexts.StepsDescription7,
      completed: false
    },
    {
      id: 8,
      title: screenTexts.StepsTitle8,
      description: screenTexts.StepsDescription8,
      completed: false
    },
    {
      id: 9,
      title: screenTexts.StepsTitle9,
      description: screenTexts.StepsDescription9,
      completed: false
    },
    {
      id: 10,
      title: screenTexts.StepsTitle10,
      description: screenTexts.StepsDescription10,
      completed: false
    },
    {
      id: 11,
      title: screenTexts.StepsTitle11,
      description: screenTexts.StepsDescription11,
      completed: false
    }
  ]);


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const handleStepPress = (step) => {
    setSelectedStep(step);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setTimeout(() => setSelectedStep(null), 300);
  };


  return (
    <View style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
      
      {/* Hero Section */}
      <LinearGradient
        colors={['#004999', '#1D7CE4', '#004999']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          <Text style={styles.heroTitle}>{screenTexts?.Title || 'Manifiesto Kylot'}</Text>
          <Text style={styles.heroSubtitle}>{screenTexts?.Subtitle || 'Descubre los principios que nos guían'}</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={styles.progressOverview}>
          <View style={styles.progressCard}>
            <Text style={styles.progressTitle}>Tu Progreso</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressFill}
                />
              </View>
              <Text style={styles.progressText}>0 de {steps.length} completados</Text>
            </View>
          </View>
        </View>

        {/* Steps Grid */}
        <View style={styles.stepsContainer}>
          <Text style={styles.sectionTitle}>Los 11 Principios de Kylot</Text>
          
          <View style={styles.stepsGrid}>
            {steps.map((step, index) => (
              <TouchableOpacity 
                key={step.id}
                style={styles.stepCard}
                activeOpacity={0.8}
                onPress={() => handleStepPress(step)}
              >
                <LinearGradient
                  colors={['#FFFFFF', '#F8F9FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.stepCardGradient}
                >
                  {/* Step Number Badge */}
                  <View style={styles.stepNumberBadge}>
                    <LinearGradient
                      colors={['#004999', '#1D7CE4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.stepNumberGradient}
                    >
                      <Text style={styles.stepNumberText}>
                        {String(step.id).padStart(2, '0')}
                      </Text>
                    </LinearGradient>
                  </View>

                  {/* Step Content */}
                  <View style={styles.stepCardContent}>
                    <Text style={styles.stepCardTitle}>{step.title || `Principio ${step.id}`}</Text>
                    <Text style={styles.stepCardDescription} numberOfLines={3}>
                      {step.description || `Descripción del principio ${step.id}`}
                    </Text>
                  </View>

                  {/* Status Indicator */}
                  <View style={styles.statusIndicator}>
                    <View style={[styles.statusDot, { backgroundColor: '#E5E5EA' }]} />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Call to Action */}
        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#004999', '#1D7CE4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>¿Listo para comenzar?</Text>
            <Text style={styles.ctaSubtitle}>
              Únete a la revolución de la experiencia social
            </Text>
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <Text style={styles.ctaButtonText}>Comenzar ahora</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>{screenTexts?.Footer || '¡Únete a la revolución social!'}</Text>
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity 
              style={styles.modalClose}
              onPress={closeModal}
              activeOpacity={0.8}
            >
              <View style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </View>
            </TouchableOpacity>

            <ScrollView 
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {selectedStep && (
                <>
                  {/* Modal Header */}
                  <View style={styles.modalHeader}>
                    <LinearGradient
                      colors={['#004999', '#1D7CE4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.modalBadge}
                    >
                      <Text style={styles.modalBadgeText}>
                        {String(selectedStep.id).padStart(2, '0')}
                      </Text>
                    </LinearGradient>
                    <Text style={styles.modalTitle}>{selectedStep.title}</Text>
                  </View>

                  {/* Modal Body */}
                  <View style={styles.modalBody}>
                    <Text style={styles.modalDescription}>
                      {selectedStep.description}
                    </Text>
                  </View>

                  {/* Modal Footer */}
                  <View style={styles.modalFooter}>
                    <TouchableOpacity 
                      style={styles.modalButton}
                      onPress={closeModal}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={['#004999', '#1D7CE4']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.modalButtonGradient}
                      >
                        <Text style={styles.modalButtonText}>Entendido</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  heroSection: {
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
    paddingHorizontal: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 24,
    backgroundColor: 'white',
  },
  progressOverview: {
    marginBottom: 32,
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    textAlign: 'center',
  },
  progressBarContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    width: '0%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  stepsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  stepCard: {
    width: (screenWidth - 56) / 2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  stepCardGradient: {
    padding: 20,
    minHeight: 160,
    position: 'relative',
  },
  stepNumberBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  stepNumberGradient: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: 'white',
  },
  stepCardContent: {
    flex: 1,
    paddingTop: 8,
  },
  stepCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  stepCardDescription: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
    fontWeight: '400',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 12,
    left: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  ctaSection: {
    marginBottom: 32,
  },
  ctaCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontWeight: '400',
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D7CE4',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: screenHeight * 0.85,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 32,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  modalBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  modalBadgeText: {
    fontSize: 24,
    fontWeight: '800',
    color: 'white',
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: -0.5,
    paddingHorizontal: 20,
  },
  modalBody: {
    marginBottom: 32,
  },
  modalDescription: {
    fontSize: 17,
    color: '#3A3A3C',
    lineHeight: 26,
    fontWeight: '400',
    textAlign: 'left',
    letterSpacing: -0.2,
  },
  modalFooter: {
    paddingTop: 16,
  },
  modalButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  modalButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    letterSpacing: 0.5,
  },
});


export default Manifiesto;
