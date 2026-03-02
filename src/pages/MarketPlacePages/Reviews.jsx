import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, FlatList, StatusBar, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import ReviewCard from '../../components/MarketPlace/ReviewCard';
import WriteReview from '../../components/MarketPlace/WriteReview';

const Reviews = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.MarketPlacePages.Details.Reviews;

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Datos de ejemplo para reseñas
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'Carlos Madrid',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
      rating: 5,
      text: 'Una experiencia increíble. El tour del Bernabéu es impresionante, especialmente la visita al vestuario y al campo. Muy recomendable para cualquier fan del Real Madrid.',
      date: '2024-01-15',
      likes: 12,
      photos: [
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=200&auto=format&fit=crop'
      ]
    },
    {
      id: '2',
      userName: 'Ana Bernabéu',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=100&auto=format&fit=crop',
      rating: 4,
      text: 'Muy buena experiencia, aunque esperaba más tiempo en el campo. El museo es espectacular con todos los trofeos. El guía fue muy amable y conocedor.',
      date: '2024-01-12',
      likes: 8,
      photos: [
        'https://images.unsplash.com/photo-1553778263-73a83bab9b0c?q=80&w=200&auto=format&fit=crop'
      ]
    },
    {
      id: '3',
      userName: 'David RM',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
      rating: 5,
      text: 'Perfecto para una cita romántica. Mi novia es fan del Madrid y le encantó. La tienda tiene muy buenos precios con el descuento.',
      date: '2024-01-10',
      likes: 15,
      photos: []
    },
    {
      id: '4',
      userName: 'Laura Tour',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
      rating: 3,
      text: 'La experiencia está bien pero es un poco cara para lo que ofrece. El tour es interesante pero se hace corto. Recomendable si eres muy fan.',
      date: '2024-01-08',
      likes: 3,
      photos: []
    },
    {
      id: '5',
      userName: 'Miguel Estadio',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
      rating: 5,
      text: 'Increíble experiencia. Poder pisar el césped del Bernabéu es un sueño hecho realidad. El museo tiene una colección impresionante de trofeos.',
      date: '2024-01-05',
      likes: 20,
      photos: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?q=80&w=200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=200&auto=format&fit=crop'
      ]
    }
  ]);

  useEffect(() => {
    if (!isLoading && !isLogged) navigate.navigate('Login');
    
    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isLogged, isLoading, navigate, fadeAnim, slideAnim]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleSubmitReview = (reviewData) => {
    const newReview = {
      id: Date.now().toString(),
      userName: 'Usuario',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
      rating: reviewData.rating,
      text: reviewData.reviewText,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      photos: []
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const filteredReviews = reviews.filter(review => {
    switch (selectedFilter) {
      case 'recent':
        return new Date(review.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      case 'high':
        return review.rating >= 4;
      case 'low':
        return review.rating <= 3;
      default:
        return true;
    }
  });

  const renderReview = ({ item }) => <ReviewCard review={item} />;


  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header personalizado estilo Apple */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate.goBack()}>
          <Image source={require('../../../assets/arrow_left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
          <Text style={styles.headerSubtitle}>{filteredReviews.length} reseñas</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.writeButton} 
          onPress={() => setShowWriteReview(true)}
          activeOpacity={0.7}
        >
          <Image source={require('../../../assets/pluma.png')} style={styles.writeIcon} />
        </TouchableOpacity>
      </View>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Filtros mejorados */}
        <View style={styles.filtersSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.filtersScroll}
          >
            {[
              { key: 'all', label: screenTexts.FilterAll, icon: require('../../../assets/category.png') },
              { key: 'recent', label: screenTexts.FilterRecent, icon: require('../../../assets/ranking.png') },
              { key: 'high', label: screenTexts.FilterHigh, icon: require('../../../assets/full_star.png') },
              { key: 'low', label: screenTexts.FilterLow, icon: require('../../../assets/empty_star.png') }
            ].map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.filterButtonSelected
                ]}
                onPress={() => setSelectedFilter(filter.key)}
                activeOpacity={0.8}
              >
                <Image 
                  source={filter.icon} 
                  style={[
                    styles.filterIcon,
                    selectedFilter === filter.key && styles.filterIconSelected
                  ]} 
                />
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === filter.key && styles.filterTextSelected
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {filteredReviews.length > 0 ? (
          <FlatList
            data={filteredReviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="#1D7CE4"
                colors={['#1D7CE4']}
              />
            }
            contentContainerStyle={styles.reviewsList}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image 
              source={require('../../../assets/mensaje.png')} 
              style={styles.emptyIcon}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>{screenTexts.NoReviews}</Text>
            <Text style={styles.emptySubtitle}>{screenTexts.BeFirst}</Text>
            <TouchableOpacity 
              style={styles.writeFirstButton}
              onPress={() => setShowWriteReview(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.writeFirstButtonText}>{screenTexts.WriteReview}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>

      <WriteReview
        visible={showWriteReview}
        onClose={() => setShowWriteReview(false)}
        onSubmit={handleSubmitReview}
      />

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  
  // Header estilo Apple
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#374151',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  writeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeIcon: {
    width: 18,
    height: 18,
    tintColor: '#FFFFFF',
  },
  
  // Contenido principal
  content: { 
    flex: 1,
    paddingHorizontal: 20, 
    paddingTop: 24,
  },
  
  // Filtros mejorados
  filtersSection: {
    marginBottom: 24,
  },
  filtersScroll: {
    paddingRight: 20,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButtonSelected: {
    backgroundColor: '#1D7CE4',
    borderColor: '#1D7CE4',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#6B7280',
  },
  filterIconSelected: {
    tintColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  
  // Lista de reseñas
  reviewsList: {
    paddingBottom: 100,
  },
  separator: {
    height: 16,
  },
  
  // Estado vacío
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    marginBottom: 24,
    tintColor: '#9CA3AF',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '400',
  },
  writeFirstButton: {
    backgroundColor: '#1D7CE4',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
    shadowColor: '#1D7CE4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  writeFirstButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default Reviews;
