import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, RefreshControl, Alert, Modal, Dimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import BuscadorComponente from '../../components/Utils/Buscador';
import Error from '../../components/Utils/Error';
import createButton from '../../../assets/createButton.png';

const { width, height } = Dimensions.get('window');

const Match = (props) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.Match;

  const [search, setSearch] = useState('');
  const [matches, setMatches] = useState([]);
  const [userInterests, setUserInterests] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardAnimation] = useState(new Animated.Value(0));
  
  // Modales Apple-style
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Datos de ejemplo premium
  const sampleMatches = [
    {
      id: 1,
      name: "María García",
      username: "@maria_garcia",
      age: 28,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      bio: "Fotógrafa apasionada por los viajes y la gastronomía. Siempre buscando nuevas aventuras y experiencias únicas.",
      location: "Madrid, España",
      distance: "2 km",
      commonInterests: ["Viajes", "Fotografía", "Cocina", "Música", "Arte"],
      matchPercentage: 95,
      photos: [
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop"
      ],
      isVerified: true,
      lastActive: "Activo ahora",
      occupation: "Fotógrafa",
      education: "Universidad Complutense",
      height: "1.65m",
      languages: ["Español", "Inglés", "Francés"]
    },
    {
      id: 2,
      name: "Carlos López",
      username: "@carlos_lopez",
      age: 32,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      bio: "Desarrollador que ama la música y los deportes. Apasionado por la tecnología y siempre aprendiendo algo nuevo.",
      location: "Barcelona, España",
      distance: "5 km",
      commonInterests: ["Música", "Deportes", "Tecnología", "Cine", "Gaming"],
      matchPercentage: 87,
      photos: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop"
      ],
      isVerified: false,
      lastActive: "Hace 2 horas",
      occupation: "Desarrollador",
      education: "Universidad Politécnica",
      height: "1.78m",
      languages: ["Español", "Inglés"]
    },
    {
      id: 3,
      name: "Ana Martínez",
      username: "@ana_martinez",
      age: 26,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      bio: "Artista y escritora, siempre buscando nuevas experiencias. Amante de la literatura y el arte contemporáneo.",
      location: "Valencia, España",
      distance: "8 km",
      commonInterests: ["Arte", "Literatura", "Cine", "Viajes", "Música"],
      matchPercentage: 78,
      photos: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop"
      ],
      isVerified: true,
      lastActive: "Hace 1 día",
      occupation: "Artista",
      education: "Escuela de Arte",
      height: "1.62m",
      languages: ["Español", "Inglés", "Italiano"]
    }
  ];

  const sampleUserInterests = ["Viajes", "Fotografía", "Cocina", "Música", "Deportes", "Tecnología", "Arte", "Literatura"];

  useEffect(() => {
    setUserInterests(sampleUserInterests.slice(0, 6));
    setMatches(sampleMatches);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearch('');
    setTimeout(() => {
      setMatches(sampleMatches);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleLike = (matchId) => {
    Animated.spring(cardAnimation, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      Alert.alert("💕 ¡Me gusta!", "Has dado like a este perfil");
      cardAnimation.setValue(0);
    });
  };

  const handlePass = (matchId) => {
    Animated.spring(cardAnimation, {
      toValue: -1,
      useNativeDriver: true,
    }).start(() => {
      Alert.alert("👋 Pasado", "Has pasado este perfil");
      cardAnimation.setValue(0);
    });
  };

  const handleSuperLike = (matchId) => {
    Alert.alert("⭐ ¡Super Like!", "Has dado super like a este perfil");
  };

  const handleConnect = (profile) => {
    setSelectedProfile(profile);
    setShowConnectModal(true);
  };

  const handleShareExperience = (profile) => {
    setSelectedProfile(profile);
    setShowShareModal(true);
  };

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowViewModal(true);
  };

  const handleSendConnection = () => {
    Alert.alert("✅ ¡Conexión enviada!", "Tu solicitud de conexión ha sido enviada");
    setShowConnectModal(false);
    setConnectionMessage('');
  };

  const handleShareExperienceAction = () => {
    Alert.alert("🌟 ¡Experiencia compartida!", "Has compartido tu experiencia con esta persona");
    setShowShareModal(false);
  };

  const renderTabButton = (tab, title, icon) => (
    <TouchableOpacity
      key={tab}
      style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={styles.tabIcon}>{icon}</Text>
      <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderExperienceCard = (match, index) => {
    const isActive = index === currentCardIndex;
    
    return (
      <Animated.View 
        key={match.id} 
        style={[
          styles.experienceMatchCard,
          isActive && {
            transform: [{
              translateX: cardAnimation.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: [-width, 0, width],
              })
            }]
          }
        ]}
      >
        {/* Header de Experiencia Compartida */}
        <View style={styles.experienceCardHeader}>
          <View style={styles.experienceBadge}>
            <Text style={styles.experienceBadgeIcon}>🌟</Text>
            <Text style={styles.experienceBadgeText}>Experiencia Compartida</Text>
          </View>
          <View style={styles.compatibilityBadge}>
            <Text style={styles.compatibilityText}>{match.matchPercentage}% Compatible</Text>
          </View>
        </View>

        {/* Información del Usuario */}
        <View style={styles.userInfoSection}>
          <Image source={{ uri: match.avatar }} style={styles.userAvatar} />
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{match.name}, {match.age}</Text>
              {match.isVerified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedIcon}>✓</Text>
                </View>
              )}
            </View>
            <Text style={styles.userOccupation}>{match.occupation}</Text>
            <Text style={styles.userLocation}>📍 {match.distance}</Text>
          </View>
        </View>

        {/* Experiencias Compartidas */}
        <View style={styles.sharedExperiencesSection}>
          <Text style={styles.sharedExperiencesTitle}>Experiencias Compartidas</Text>
          <View style={styles.experiencesList}>
            <View style={styles.experienceItem}>
              <Text style={styles.experienceEmoji}>✈️</Text>
              <View style={styles.experienceDetails}>
                <Text style={styles.experienceName}>Viaje a París</Text>
                <Text style={styles.experienceDate}>Ambos en 2023</Text>
              </View>
              <View style={styles.experienceMatch}>
                <Text style={styles.experienceMatchText}>100%</Text>
              </View>
            </View>
            <View style={styles.experienceItem}>
              <Text style={styles.experienceEmoji}>🎵</Text>
              <View style={styles.experienceDetails}>
                <Text style={styles.experienceName}>Concierto de Coldplay</Text>
                <Text style={styles.experienceDate}>Ambos asistieron</Text>
              </View>
              <View style={styles.experienceMatch}>
                <Text style={styles.experienceMatchText}>95%</Text>
              </View>
            </View>
            <View style={styles.experienceItem}>
              <Text style={styles.experienceEmoji}>🍽️</Text>
              <View style={styles.experienceDetails}>
                <Text style={styles.experienceName}>Restaurante El Celler</Text>
                <Text style={styles.experienceDate}>Misma experiencia</Text>
              </View>
              <View style={styles.experienceMatch}>
                <Text style={styles.experienceMatchText}>90%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bio y Intereses */}
        <View style={styles.bioSection}>
          <Text style={styles.bioText}>{match.bio}</Text>
          <View style={styles.interestsRow}>
            {match.commonInterests.slice(0, 3).map((interest, idx) => (
              <View key={idx} style={styles.interestChip}>
                <Text style={styles.interestChipText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Acciones Novedosas */}
        <View style={styles.novelActions}>
          <TouchableOpacity 
            style={styles.shareExperienceButton}
            onPress={() => handleShareExperience(match)}
          >
            <Text style={styles.shareExperienceIcon}>🤝</Text>
            <Text style={styles.shareExperienceText}>Compartir</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.connectButton}
            onPress={() => handleConnect(match)}
          >
            <LinearGradient
              colors={['#007AFF', '#0051D5']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.connectGradient}
            >
              <Text style={styles.connectIcon}>💫</Text>
              <Text style={styles.connectText}>Conectar</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.viewProfileButton}
            onPress={() => handleViewProfile(match)}
          >
            <Text style={styles.viewProfileIcon}>👁</Text>
            <Text style={styles.viewProfileText}>Ver</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  // Modal Apple-style para Conectar
  const renderConnectModal = () => (
    <Modal
      visible={showConnectModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowConnectModal(false)}
    >
      <View style={styles.appleModalOverlay}>
        <View style={styles.appleModalContainer}>
          <View style={styles.appleModalHeader}>
            <View style={styles.appleModalHandle} />
            <Text style={styles.appleModalTitle}>Conectar con {selectedProfile?.name}</Text>
            <TouchableOpacity 
              style={styles.appleCloseButton}
              onPress={() => setShowConnectModal(false)}
            >
              <Text style={styles.appleCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.appleModalContent} showsVerticalScrollIndicator={false}>
            {/* Información de compatibilidad */}
            <View style={styles.compatibilitySection}>
              <View style={styles.compatibilityHeader}>
                <Text style={styles.compatibilityTitle}>Compatibilidad</Text>
                <View style={styles.compatibilityBadge}>
                  <Text style={styles.compatibilityPercentage}>{selectedProfile?.matchPercentage}%</Text>
                </View>
              </View>
              <Text style={styles.compatibilityDescription}>
                Tienes {selectedProfile?.commonInterests.length} intereses en común y experiencias compartidas
              </Text>
            </View>

            {/* Experiencias compartidas destacadas */}
            <View style={styles.sharedExperiencesPreview}>
              <Text style={styles.sectionLabel}>Experiencias Compartidas</Text>
              <View style={styles.experiencePreviewItem}>
                <Text style={styles.experiencePreviewEmoji}>✈️</Text>
                <View style={styles.experiencePreviewDetails}>
                  <Text style={styles.experiencePreviewName}>Viaje a París</Text>
                  <Text style={styles.experiencePreviewMatch}>100% Compatible</Text>
                </View>
              </View>
              <View style={styles.experiencePreviewItem}>
                <Text style={styles.experiencePreviewEmoji}>🎵</Text>
                <View style={styles.experiencePreviewDetails}>
                  <Text style={styles.experiencePreviewName}>Concierto de Coldplay</Text>
                  <Text style={styles.experiencePreviewMatch}>95% Compatible</Text>
                </View>
              </View>
            </View>

            {/* Mensaje personalizado */}
            <View style={styles.messageSection}>
              <Text style={styles.sectionLabel}>Mensaje de conexión</Text>
              <View style={styles.messageInputContainer}>
                <Text style={styles.messagePlaceholder}>
                  Hola {selectedProfile?.name}! Vi que también fuiste a París en 2023. ¿Te gustaría conectar y compartir experiencias?
                </Text>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.appleModalFooter}>
            <TouchableOpacity 
              style={styles.appleCancelButton}
              onPress={() => setShowConnectModal(false)}
            >
              <Text style={styles.appleCancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.appleActionButton}
              onPress={handleSendConnection}
            >
              <LinearGradient
                colors={['#007AFF', '#0051D5']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.appleActionGradient}
              >
                <Text style={styles.appleActionText}>Enviar Conexión</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal Apple-style para Compartir Experiencia
  const renderShareModal = () => (
    <Modal
      visible={showShareModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowShareModal(false)}
    >
      <View style={styles.appleModalOverlay}>
        <View style={styles.appleModalContainer}>
          <View style={styles.appleModalHeader}>
            <View style={styles.appleModalHandle} />
            <Text style={styles.appleModalTitle}>Compartir Experiencia</Text>
            <TouchableOpacity 
              style={styles.appleCloseButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.appleCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.appleModalContent} showsVerticalScrollIndicator={false}>
            {/* Selección de experiencia */}
            <View style={styles.experienceSelectionSection}>
              <Text style={styles.sectionLabel}>Selecciona una experiencia</Text>
              <View style={styles.experienceOptions}>
                <TouchableOpacity style={styles.experienceOption}>
                  <Text style={styles.experienceOptionEmoji}>✈️</Text>
                  <View style={styles.experienceOptionDetails}>
                    <Text style={styles.experienceOptionName}>Viaje a París</Text>
                    <Text style={styles.experienceOptionDate}>2023</Text>
                  </View>
                  <View style={styles.experienceOptionCheck}>
                    <Text style={styles.experienceOptionCheckIcon}>✓</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.experienceOption}>
                  <Text style={styles.experienceOptionEmoji}>🎵</Text>
                  <View style={styles.experienceOptionDetails}>
                    <Text style={styles.experienceOptionName}>Concierto de Coldplay</Text>
                    <Text style={styles.experienceOptionDate}>2023</Text>
                  </View>
                  <View style={styles.experienceOptionCheck}>
                    <Text style={styles.experienceOptionCheckIcon}>✓</Text>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.experienceOption}>
                  <Text style={styles.experienceOptionEmoji}>🍽️</Text>
                  <View style={styles.experienceOptionDetails}>
                    <Text style={styles.experienceOptionName}>Restaurante El Celler</Text>
                    <Text style={styles.experienceOptionDate}>2023</Text>
                  </View>
                  <View style={styles.experienceOptionCheck}>
                    <Text style={styles.experienceOptionCheckIcon}>✓</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Mensaje personalizado */}
            <View style={styles.messageSection}>
              <Text style={styles.sectionLabel}>Mensaje</Text>
              <View style={styles.messageInputContainer}>
                <Text style={styles.messagePlaceholder}>
                  ¡Hola! Vi que también fuiste a París. ¿Te gustaría compartir nuestras experiencias y fotos de ese viaje?
                </Text>
              </View>
            </View>

            {/* Opciones de compartir */}
            <View style={styles.shareOptionsSection}>
              <Text style={styles.sectionLabel}>Compartir</Text>
              <View style={styles.shareOptions}>
                <TouchableOpacity style={styles.shareOption}>
                  <Text style={styles.shareOptionIcon}>📸</Text>
                  <Text style={styles.shareOptionText}>Fotos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <Text style={styles.shareOptionIcon}>📍</Text>
                  <Text style={styles.shareOptionText}>Ubicaciones</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareOption}>
                  <Text style={styles.shareOptionIcon}>💭</Text>
                  <Text style={styles.shareOptionText}>Recuerdos</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.appleModalFooter}>
            <TouchableOpacity 
              style={styles.appleCancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.appleCancelText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.appleActionButton}
              onPress={handleShareExperienceAction}
            >
              <LinearGradient
                colors={['#FF9500', '#FF6B00']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.appleActionGradient}
              >
                <Text style={styles.appleActionText}>Compartir Experiencia</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Modal Apple-style para Ver Perfil
  const renderViewModal = () => (
    <Modal
      visible={showViewModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowViewModal(false)}
    >
      <View style={styles.appleModalOverlay}>
        <View style={styles.appleModalContainer}>
          <View style={styles.appleModalHeader}>
            <View style={styles.appleModalHandle} />
            <Text style={styles.appleModalTitle}>Perfil de {selectedProfile?.name}</Text>
            <TouchableOpacity 
              style={styles.appleCloseButton}
              onPress={() => setShowViewModal(false)}
            >
              <Text style={styles.appleCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.appleModalContent} showsVerticalScrollIndicator={false}>
            {/* Header del perfil */}
            <View style={styles.profileHeaderSection}>
              <Image source={{ uri: selectedProfile?.avatar }} style={styles.profileHeaderImage} />
              <View style={styles.profileHeaderInfo}>
                <View style={styles.profileHeaderNameRow}>
                  <Text style={styles.profileHeaderName}>{selectedProfile?.name}, {selectedProfile?.age}</Text>
                  {selectedProfile?.isVerified && (
                    <View style={styles.profileVerifiedBadge}>
                      <Text style={styles.profileVerifiedIcon}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.profileHeaderUsername}>{selectedProfile?.username}</Text>
                <Text style={styles.profileHeaderLocation}>📍 {selectedProfile?.location}</Text>
                <View style={styles.profileHeaderStats}>
                  <View style={styles.profileStatItem}>
                    <Text style={styles.profileStatNumber}>{selectedProfile?.matchPercentage}%</Text>
                    <Text style={styles.profileStatLabel}>Compatibilidad</Text>
                  </View>
                  <View style={styles.profileStatItem}>
                    <Text style={styles.profileStatNumber}>{selectedProfile?.commonInterests.length}</Text>
                    <Text style={styles.profileStatLabel}>Intereses</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Bio */}
            <View style={styles.profileBioSection}>
              <Text style={styles.sectionLabel}>Sobre mí</Text>
              <Text style={styles.profileBioText}>{selectedProfile?.bio}</Text>
            </View>

            {/* Experiencias compartidas */}
            <View style={styles.profileExperiencesSection}>
              <Text style={styles.sectionLabel}>Experiencias Compartidas</Text>
              <View style={styles.profileExperiencesList}>
                <View style={styles.profileExperienceItem}>
                  <Text style={styles.profileExperienceEmoji}>✈️</Text>
                  <View style={styles.profileExperienceDetails}>
                    <Text style={styles.profileExperienceName}>Viaje a París</Text>
                    <Text style={styles.profileExperienceDate}>Ambos en 2023</Text>
                  </View>
                  <View style={styles.profileExperienceMatch}>
                    <Text style={styles.profileExperienceMatchText}>100%</Text>
                  </View>
                </View>
                <View style={styles.profileExperienceItem}>
                  <Text style={styles.profileExperienceEmoji}>🎵</Text>
                  <View style={styles.profileExperienceDetails}>
                    <Text style={styles.profileExperienceName}>Concierto de Coldplay</Text>
                    <Text style={styles.profileExperienceDate}>Ambos asistieron</Text>
                  </View>
                  <View style={styles.profileExperienceMatch}>
                    <Text style={styles.profileExperienceMatchText}>95%</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Intereses */}
            <View style={styles.profileInterestsSection}>
              <Text style={styles.sectionLabel}>Intereses</Text>
              <View style={styles.profileInterestsList}>
                {selectedProfile?.commonInterests.map((interest, index) => (
                  <View key={index} style={styles.profileInterestTag}>
                    <Text style={styles.profileInterestText}>{interest}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.appleModalFooter}>
            <TouchableOpacity 
              style={styles.appleCancelButton}
              onPress={() => setShowViewModal(false)}
            >
              <Text style={styles.appleCancelText}>Cerrar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.appleActionButton}
              onPress={() => {
                setShowViewModal(false);
                handleConnect(selectedProfile);
              }}
            >
              <LinearGradient
                colors={['#007AFF', '#0051D5']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.appleActionGradient}
              >
                <Text style={styles.appleActionText}>Conectar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderProfileModal = () => (
    <Modal
      visible={showProfileModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowProfileModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Perfil</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {selectedProfile && (
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.profileImageContainer}>
                <Image source={{ uri: selectedProfile.avatar }} style={styles.profileImage} />
                <View style={styles.profileInfo}>
                  <View style={styles.profileNameContainer}>
                    <Text style={styles.profileName}>{selectedProfile.name}, {selectedProfile.age}</Text>
                    {selectedProfile.isVerified && (
                      <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedIcon}>✓</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.profileUsername}>{selectedProfile.username}</Text>
                  <Text style={styles.profileLocation}>📍 {selectedProfile.location}</Text>
                </View>
              </View>
              
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Sobre mí</Text>
                <Text style={styles.profileBio}>{selectedProfile.bio}</Text>
              </View>
              
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Información</Text>
                <View style={styles.infoGrid}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Profesión</Text>
                    <Text style={styles.infoValue}>{selectedProfile.occupation}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Educación</Text>
                    <Text style={styles.infoValue}>{selectedProfile.education}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Altura</Text>
                    <Text style={styles.infoValue}>{selectedProfile.height}</Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Idiomas</Text>
                    <Text style={styles.infoValue}>{selectedProfile.languages.join(', ')}</Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Intereses</Text>
                <View style={styles.allInterestsList}>
                  {selectedProfile.commonInterests.map((interest, index) => (
                    <View key={index} style={styles.interestTag}>
                      <Text style={styles.interestText}>{interest}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View style={styles.profileSection}>
                <Text style={styles.sectionTitle}>Fotos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.photosContainer}>
                    {selectedProfile.photos.map((photo, index) => (
                      <Image key={index} source={{ uri: photo }} style={styles.photoThumbnail} />
                    ))}
                  </View>
                </ScrollView>
              </View>
            </ScrollView>
          )}
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.modalPassButton}
              onPress={() => setShowProfileModal(false)}
            >
              <Text style={styles.modalPassText}>Pasar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalConnectButton}
              onPress={() => handleConnect(selectedProfile?.id)}
            >
              <LinearGradient
                colors={['#007AFF', '#0051D5']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.modalConnectGradient}
              >
                <Text style={styles.modalConnectText}>Conectar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
        </View>
      </View>

      {/* Menu como el resto de la app */}
      <View style={styles.menuContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuScrollContent}>
          {renderTabButton('discover', 'Descubrir', '🔍')}
          {renderTabButton('likes', 'Me gusta', '♥')}
          {renderTabButton('matches', 'Matches', '💕')}
        </ScrollView>
      </View>

      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end', paddingHorizontal: 16, marginTop: 8, paddingBottom: 15 }}>
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingRight: 10 }}>
          <BuscadorComponente placeholder={screenTexts.SearcherPlaceHolder} search={search} func={setSearch} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* User Interests Section - Diseño mejorado como el resto de la app */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{screenTexts.InterestsTitle}</Text>
            <TouchableOpacity style={styles.editInterestsButton}>
              <Text style={styles.editInterestsText}>Editar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.userInterestsContainer}>
            {userInterests.map((interest, index) => (
              <View key={index} style={styles.userInterestTag}>
                <Text style={styles.userInterestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Experiencias Compartidas Section - CONCEPTO NOVEDOSO */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'discover' ? 'Experiencias Compartidas' : 
             activeTab === 'likes' ? 'Tus Conexiones' : 'Conexiones Activas'}
          </Text>
          
          {/* Sistema de Conexión por Experiencias - NOVEDOSO */}
          <View style={styles.experienceConnectionContainer}>
            <View style={styles.experienceCard}>
              <View style={styles.experienceHeader}>
                <Text style={styles.experienceIcon}>🎯</Text>
                <Text style={styles.experienceTitle}>Conexión por Experiencias</Text>
              </View>
              <Text style={styles.experienceDescription}>
                Conecta con personas que han vivido experiencias similares a las tuyas. 
                No es solo sobre gustos, es sobre vivencias compartidas.
              </Text>
              <View style={styles.experienceStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>12</Text>
                  <Text style={styles.statLabel}>Experiencias</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>8</Text>
                  <Text style={styles.statLabel}>Conexiones</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>95%</Text>
                  <Text style={styles.statLabel}>Compatibilidad</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Sistema de Cards de Experiencias Compartidas */}
          <View style={styles.matchesContainer}>
            {matches.length === 0 ? (
              loading ? (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color="#007AFF" />
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>🌟</Text>
                  <Text style={styles.emptyStateTitle}>No hay experiencias compartidas</Text>
                  <Text style={styles.emptyStateSubtitle}>Comparte tus experiencias para conectar con personas afines</Text>
                </View>
              )
            ) : (
              matches.map((match, index) => renderExperienceCard(match, index))
            )}
          </View>
        </View>

        {error && <Error message={errorMessage} func={setError} />}
      </ScrollView>

      {renderProfileModal()}
      {renderConnectModal()}
      {renderShareModal()}
      {renderViewModal()}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingHorizontal: 0,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    marginBottom: 0,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  // Menu como el resto de la app
  menuContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  menuScrollContent: {
    paddingRight: 16,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    minWidth: 100,
  },
  activeTabButton: {
    backgroundColor: '#1D7CE4',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.4,
  },
  editInterestsButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  editInterestsText: {
    fontSize: 12,
    color: '#1D7CE4',
    fontWeight: '500',
  },
  userInterestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  userInterestTag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  userInterestText: {
    fontSize: 14,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  matchesContainer: {
    gap: 16,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  cardImageContainer: {
    position: 'relative',
    height: 300,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  matchName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  verifiedBadge: {
    backgroundColor: '#007AFF',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  matchPercentageBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  matchPercentageText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  matchLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  locationContainer: {
    flex: 1,
  },
  matchLocation: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  matchOccupation: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  matchStatus: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardContent: {
    padding: 16,
  },
  matchBio: {
    fontSize: 15,
    color: '#3A3A3C',
    marginBottom: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  interestsContainer: {
    marginBottom: 16,
  },
  interestsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestText: {
    fontSize: 12,
    color: '#666666',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  passButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  passIcon: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  superLikeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF9500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  superLikeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  likeButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#34C759',
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    marginRight: 8,
  },
  profileUsername: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 4,
  },
  profileLocation: {
    fontSize: 14,
    color: '#8E8E93',
  },
  profileSection: {
    marginBottom: 24,
  },
  profileBio: {
    fontSize: 15,
    color: '#3A3A3C',
    lineHeight: 22,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1D1D1F',
    fontWeight: '600',
  },
  allInterestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 12,
  },
  modalPassButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalPassText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  modalConnectButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalConnectGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalConnectText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Estilos para el CONCEPTO NOVEDOSO de Experiencias Compartidas
  experienceConnectionContainer: {
    marginBottom: 20,
  },
  experienceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  experienceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  experienceTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  experienceDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  experienceStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D7CE4',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  // Estilos para las Cards de Experiencias Compartidas
  experienceMatchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  experienceCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  experienceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1D7CE4',
  },
  experienceBadgeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  experienceBadgeText: {
    fontSize: 12,
    color: '#1D7CE4',
    fontWeight: '600',
  },
  compatibilityBadge: {
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  compatibilityText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginRight: 8,
  },
  userOccupation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  userLocation: {
    fontSize: 12,
    color: '#8E8E93',
  },
  sharedExperiencesSection: {
    marginBottom: 20,
  },
  sharedExperiencesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  experiencesList: {
    gap: 12,
  },
  experienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  experienceEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  experienceDetails: {
    flex: 1,
  },
  experienceName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  experienceDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  experienceMatch: {
    backgroundColor: '#F0FFF0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  experienceMatchText: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  bioSection: {
    marginBottom: 20,
  },
  bioText: {
    fontSize: 14,
    color: '#3A3A3C',
    lineHeight: 20,
    marginBottom: 12,
  },
  interestsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestChip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  interestChipText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  novelActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  shareExperienceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF9500',
    shadowColor: '#FF9500',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  shareExperienceIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  shareExperienceText: {
    fontSize: 12,
    color: '#FF9500',
    fontWeight: '600',
  },
  connectButton: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#1D7CE4',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  connectGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  connectIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  connectText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  viewProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#8E8E93',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  viewProfileIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  viewProfileText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
  },
  // Estilos Apple-style para Modales
  appleModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  appleModalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    minHeight: '60%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  appleModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  appleModalHandle: {
    width: 36,
    height: 5,
    backgroundColor: '#D1D1D6',
    borderRadius: 3,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -18,
  },
  appleModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 40,
  },
  appleCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleCloseIcon: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  appleModalContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  appleModalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 12,
  },
  appleCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  appleCancelText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  appleActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  appleActionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  appleActionText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Estilos para Modal de Conectar
  compatibilitySection: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  compatibilityTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
  },
  compatibilityBadge: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  compatibilityPercentage: {
    fontSize: 16,
    fontWeight: '700',
    color: '#34C759',
  },
  compatibilityDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  sharedExperiencesPreview: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  experiencePreviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 8,
  },
  experiencePreviewEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  experiencePreviewDetails: {
    flex: 1,
  },
  experiencePreviewName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  experiencePreviewMatch: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
  },
  messageSection: {
    marginBottom: 24,
  },
  messageInputContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    minHeight: 80,
  },
  messagePlaceholder: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  // Estilos para Modal de Compartir
  experienceSelectionSection: {
    marginBottom: 24,
  },
  experienceOptions: {
    gap: 8,
  },
  experienceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  experienceOptionEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  experienceOptionDetails: {
    flex: 1,
  },
  experienceOptionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  experienceOptionDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  experienceOptionCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  experienceOptionCheckIcon: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  shareOptionsSection: {
    marginBottom: 24,
  },
  shareOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  shareOption: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  shareOptionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  shareOptionText: {
    fontSize: 12,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  // Estilos para Modal de Ver Perfil
  profileHeaderSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  profileHeaderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileHeaderInfo: {
    flex: 1,
  },
  profileHeaderNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileHeaderName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginRight: 8,
  },
  profileVerifiedBadge: {
    backgroundColor: '#007AFF',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileVerifiedIcon: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  profileHeaderUsername: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  profileHeaderLocation: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 12,
  },
  profileHeaderStats: {
    flexDirection: 'row',
    gap: 16,
  },
  profileStatItem: {
    alignItems: 'center',
  },
  profileStatNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  profileStatLabel: {
    fontSize: 10,
    color: '#8E8E93',
    marginTop: 2,
  },
  profileBioSection: {
    marginBottom: 24,
  },
  profileBioText: {
    fontSize: 14,
    color: '#3A3A3C',
    lineHeight: 20,
  },
  profileExperiencesSection: {
    marginBottom: 24,
  },
  profileExperiencesList: {
    gap: 8,
  },
  profileExperienceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  profileExperienceEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  profileExperienceDetails: {
    flex: 1,
  },
  profileExperienceName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  profileExperienceDate: {
    fontSize: 11,
    color: '#8E8E93',
  },
  profileExperienceMatch: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#34C759',
  },
  profileExperienceMatchText: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: '600',
  },
  profileInterestsSection: {
    marginBottom: 24,
  },
  profileInterestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  profileInterestTag: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  profileInterestText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
});

export default Match;
