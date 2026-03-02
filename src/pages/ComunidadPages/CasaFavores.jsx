import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, RefreshControl, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import BuscadorComponente from '../../components/Utils/Buscador';
import Error from '../../components/Utils/Error';
import createButton from '../../../assets/createButton.png';

const CasaFavores = (props) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.CasaFavores;

  const [search, setSearch] = useState('');
  const [myRequests, setMyRequests] = useState([]);
  const [availableFavors, setAvailableFavors] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'request' or 'offer'

  // Datos de ejemplo mejorados
  const sampleMyRequests = [
    {
      id: 1,
      title: "Ayuda para mudanza",
      description: "Necesito ayuda para cargar cajas el próximo sábado por la mañana",
      category: "Transporte",
      categoryIcon: "🚚",
      location: "Madrid Centro",
      reward: "50 Kylets",
      status: "Pendiente",
      createdAt: "Hace 2 días",
      urgency: "Media",
      estimatedTime: "2 horas"
    },
    {
      id: 2,
      title: "Clases de cocina",
      description: "Quiero aprender a hacer paella tradicional valenciana",
      category: "Educación",
      categoryIcon: "👨‍🍳",
      location: "Valencia",
      reward: "100 Kylets",
      status: "En progreso",
      createdAt: "Hace 1 semana",
      urgency: "Baja",
      estimatedTime: "3 horas"
    }
  ];

  const sampleAvailableFavors = [
    {
      id: 3,
      title: "Reparación de bicicleta",
      description: "Puedo ayudar a reparar bicicletas básicas y ajustar frenos",
      category: "Reparaciones",
      categoryIcon: "🔧",
      location: "Barcelona",
      reward: "30 Kylets",
      helper: "Carlos López",
      helperAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      createdAt: "Hace 3 horas",
      rating: 4.8,
      completedFavors: 23,
      estimatedTime: "1 hora"
    },
    {
      id: 4,
      title: "Traducción inglés-español",
      description: "Ofrezco servicios de traducción rápida para documentos",
      category: "Servicios",
      categoryIcon: "📝",
      location: "Madrid",
      reward: "25 Kylets",
      helper: "María García",
      helperAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop",
      createdAt: "Hace 1 día",
      rating: 4.9,
      completedFavors: 45,
      estimatedTime: "30 min"
    },
    {
      id: 5,
      title: "Cuidado de mascotas",
      description: "Puedo cuidar tu perro mientras estás de viaje de fin de semana",
      category: "Cuidados",
      categoryIcon: "🐕",
      location: "Sevilla",
      reward: "40 Kylets",
      helper: "Ana Martínez",
      helperAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      createdAt: "Hace 2 días",
      rating: 4.7,
      completedFavors: 12,
      estimatedTime: "2 días"
    }
  ];

  useEffect(() => {
    setMyRequests(sampleMyRequests);
    setAvailableFavors(sampleAvailableFavors);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearch('');
    setTimeout(() => {
      setMyRequests(sampleMyRequests);
      setAvailableFavors(sampleAvailableFavors);
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleRequestFavor = () => {
    setModalType('request');
    setShowCreateModal(true);
  };

  const handleOfferHelp = () => {
    setModalType('offer');
    setShowCreateModal(true);
  };

  const handleAcceptFavor = (favorId) => {
    Alert.alert(
      "Aceptar favor",
      "¿Quieres aceptar este favor?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Aceptar", onPress: () => {
          Alert.alert("¡Éxito!", "Has aceptado el favor");
        }}
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendiente': return '#FF9500';
      case 'En progreso': return '#007AFF';
      case 'Completado': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Alta': return '#FF3B30';
      case 'Media': return '#FF9500';
      case 'Baja': return '#34C759';
      default: return '#8E8E93';
    }
  };

  const renderMyRequestCard = (request) => (
    <View key={request.id} style={styles.requestCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.categoryIcon}>{request.categoryIcon}</Text>
          <View style={styles.titleTextContainer}>
            <Text style={styles.requestTitle}>{request.title}</Text>
            <Text style={styles.requestCategory}>{request.category}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(request.status) }]}>
          <Text style={styles.statusText}>{request.status}</Text>
        </View>
      </View>
      
      <Text style={styles.requestDescription}>{request.description}</Text>
      
      <View style={styles.requestDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📍</Text>
            <Text style={styles.detailValue}>{request.location}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⏱️</Text>
            <Text style={styles.detailValue}>{request.estimatedTime}</Text>
          </View>
        </View>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>💰</Text>
            <Text style={styles.detailValue}>{request.reward}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>⚡</Text>
            <Text style={[styles.detailValue, { color: getUrgencyColor(request.urgency) }]}>{request.urgency}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.cardFooter}>
        <Text style={styles.createdAt}>{request.createdAt}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAvailableFavorCard = (favor) => (
    <View key={favor.id} style={styles.favorCard}>
      <View style={styles.cardHeader}>
        <View style={styles.titleContainer}>
          <Text style={styles.categoryIcon}>{favor.categoryIcon}</Text>
          <View style={styles.titleTextContainer}>
            <Text style={styles.favorTitle}>{favor.title}</Text>
            <Text style={styles.favorCategory}>{favor.category}</Text>
          </View>
        </View>
        <View style={styles.rewardContainer}>
          <Text style={styles.favorReward}>{favor.reward}</Text>
        </View>
      </View>
      
      <Text style={styles.favorDescription}>{favor.description}</Text>
      
      <View style={styles.helperSection}>
        <View style={styles.helperInfo}>
          <Image source={{ uri: favor.helperAvatar }} style={styles.helperAvatar} />
          <View style={styles.helperDetails}>
            <Text style={styles.helperName}>{favor.helper}</Text>
            <View style={styles.helperStats}>
              <Text style={styles.helperRating}>⭐ {favor.rating}</Text>
              <Text style={styles.helperCompleted}>{favor.completedFavors} favores</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => handleAcceptFavor(favor.id)}
        >
          <LinearGradient
            colors={['#007AFF', '#0051D5']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.acceptGradient}
          >
            <Text style={styles.acceptText}>Aceptar</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      <View style={styles.favorFooter}>
        <View style={styles.favorDetails}>
          <Text style={styles.favorLocation}>📍 {favor.location}</Text>
          <Text style={styles.favorTime}>⏱️ {favor.estimatedTime}</Text>
        </View>
        <Text style={styles.createdAt}>{favor.createdAt}</Text>
      </View>
    </View>
  );

  const renderCreateModal = () => (
    <Modal
      visible={showCreateModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowCreateModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {modalType === 'request' ? 'Solicitar Favor' : 'Ofrecer Ayuda'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Título</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.inputPlaceholder}>
                  {modalType === 'request' ? '¿Qué necesitas?' : '¿Qué puedes ofrecer?'}
                </Text>
              </View>
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.formLabel}>Descripción</Text>
              <View style={styles.textAreaContainer}>
                <Text style={styles.inputPlaceholder}>
                  Describe con detalle tu solicitud o servicio...
                </Text>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formSectionHalf}>
                <Text style={styles.formLabel}>Categoría</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPlaceholder}>Seleccionar</Text>
                </View>
              </View>
              <View style={styles.formSectionHalf}>
                <Text style={styles.formLabel}>Ubicación</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPlaceholder}>Madrid</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formRow}>
              <View style={styles.formSectionHalf}>
                <Text style={styles.formLabel}>Recompensa</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPlaceholder}>50 Kylets</Text>
                </View>
              </View>
              <View style={styles.formSectionHalf}>
                <Text style={styles.formLabel}>Tiempo estimado</Text>
                <View style={styles.inputContainer}>
                  <Text style={styles.inputPlaceholder}>2 horas</Text>
                </View>
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowCreateModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.submitButton}>
              <LinearGradient
                colors={['#007AFF', '#0051D5']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.submitGradient}
              >
                <Text style={styles.submitButtonText}>
                  {modalType === 'request' ? 'Solicitar' : 'Ofrecer'}
                </Text>
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
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleRequestFavor}
          >
            <LinearGradient
              colors={['#FF6B6B', '#FF5252']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🙋‍♂️</Text>
              <Text style={styles.quickActionText}>Solicitar Favor</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={handleOfferHelp}
          >
            <LinearGradient
              colors={['#4ECDC4', '#26A69A']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.quickActionGradient}
            >
              <Text style={styles.quickActionIcon}>🤝</Text>
              <Text style={styles.quickActionText}>Ofrecer Ayuda</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* My Requests Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{screenTexts.MyRequestsTitle}</Text>
          <View style={styles.requestsContainer}>
            {myRequests.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>📝</Text>
                <Text style={styles.emptyStateTitle}>No tienes solicitudes</Text>
                <Text style={styles.emptyStateSubtitle}>Crea tu primera solicitud de favor</Text>
              </View>
            ) : (
              myRequests.map(renderMyRequestCard)
            )}
          </View>
        </View>

        {/* Available Favors Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{screenTexts.AvailableFavorsTitle}</Text>
          <View style={styles.favorsContainer}>
            {availableFavors.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateIcon}>🔍</Text>
                <Text style={styles.emptyStateTitle}>No hay favores disponibles</Text>
                <Text style={styles.emptyStateSubtitle}>Intenta más tarde o crea una solicitud</Text>
              </View>
            ) : (
              availableFavors.map(renderAvailableFavorCard)
            )}
          </View>
        </View>

        {error && <Error message={errorMessage} func={setError} />}
      </ScrollView>

      {renderCreateModal()}
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
  scrollContainer: {
    paddingBottom: 100,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    letterSpacing: -0.4,
  },
  requestsContainer: {
    gap: 12,
  },
  favorsContainer: {
    gap: 12,
  },
  requestCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  favorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  titleTextContainer: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  favorTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  requestCategory: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  favorCategory: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  rewardContainer: {
    alignItems: 'flex-end',
  },
  favorReward: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  requestDescription: {
    fontSize: 15,
    color: '#3A3A3C',
    marginBottom: 16,
    lineHeight: 22,
  },
  favorDescription: {
    fontSize: 15,
    color: '#3A3A3C',
    marginBottom: 16,
    lineHeight: 22,
  },
  requestDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  detailIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  detailValue: {
    fontSize: 13,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  helperSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  helperInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  helperAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  helperDetails: {
    flex: 1,
  },
  helperName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  helperStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  helperRating: {
    fontSize: 12,
    color: '#FF9500',
    marginRight: 8,
  },
  helperCompleted: {
    fontSize: 12,
    color: '#8E8E93',
  },
  acceptButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  acceptGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  acceptText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  favorDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favorLocation: {
    fontSize: 12,
    color: '#8E8E93',
    marginRight: 12,
  },
  favorTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  createdAt: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
  editButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  editButtonText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
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
    maxHeight: '80%',
    minHeight: '60%',
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
  formSection: {
    marginBottom: 20,
  },
  formSectionHalf: {
    flex: 1,
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  inputContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textAreaContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 80,
  },
  inputPlaceholder: {
    fontSize: 16,
    color: '#8E8E93',
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitGradient: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CasaFavores;
