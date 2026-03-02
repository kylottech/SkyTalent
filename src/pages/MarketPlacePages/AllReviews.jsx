import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, FlatList, StatusBar, Animated, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import WriteReview from '../../components/MarketPlace/WriteReview';

const AllReviews = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const { productId } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent'); // recent, rating, helpful
  const [showFilters, setShowFilters] = useState(false);
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Datos de ejemplo para reseñas de productos
  const [reviews, setReviews] = useState([
    {
      id: '1',
      userName: 'María García',
      userHandle: '@maria_tech',
      avatar: require('../../../assets/adri.jpeg'),
      rating: 7,
      text: 'Increíble teléfono. La cámara es espectacular y la batería dura todo el día. La compra perfecta para mi trabajo.',
      date: '2025-01-15',
      likes: 24,
      helpful: 18,
      verified: true,
      photos: [
        require('../../../assets/OnBoarding2.jpg'),
        require('../../../assets/OnBoarding3.png')
      ],
      productVariant: 'Titanio Natural 256GB'
    },
    {
      id: '2',
      userName: 'Carlos Dev',
      userHandle: '@carlos_dev',
      avatar: require('../../../assets/OnBoarding2.jpg'),
      rating: 6,
      text: 'Excelente rendimiento, aunque el precio es elevado. La calidad de construcción es impresionante. Recomendable si el presupuesto lo permite.',
      date: '2025-01-12',
      likes: 15,
      helpful: 12,
      verified: true,
      photos: [],
      productVariant: 'Titanio Azul 512GB'
    },
    {
      id: '3',
      userName: 'Ana López',
      userHandle: '@ana_lopez',
      avatar: require('../../../assets/OnBoarding3.png'),
      rating: 7,
      text: 'Perfecto para fotografía profesional. La cámara ProRAW es increíble y el zoom óptico 5x funciona muy bien.',
      date: '2025-01-10',
      likes: 32,
      helpful: 28,
      verified: false,
      photos: [
        require('../../../assets/OnBoarding4.png'),
        require('../../../assets/OnBoarding6.jpg'),
        require('../../../assets/OnBoarding7.png')
      ],
      productVariant: 'Titanio Blanco 1TB'
    },
    {
      id: '4',
      userName: 'David Ruiz',
      userHandle: '@david_ruiz',
      avatar: require('../../../assets/OnBoarding4.png'),
      rating: 5,
      text: 'Buen teléfono pero esperaba más por el precio. La batería se agota rápido con uso intensivo.',
      date: '2025-01-08',
      likes: 8,
      helpful: 6,
      verified: true,
      photos: [],
      productVariant: 'Titanio Natural 128GB'
    },
    {
      id: '5',
      userName: 'Laura Martín',
      userHandle: '@laura_martin',
      avatar: require('../../../assets/OnBoarding6.jpg'),
      rating: 7,
      text: 'El mejor iPhone que he tenido. La pantalla es increíble y el rendimiento es perfecto para gaming.',
      date: '2025-01-05',
      likes: 45,
      helpful: 39,
      verified: true,
      photos: [
        require('../../../assets/OnBoarding8.png')
      ],
      productVariant: 'Titanio Negro 256GB'
    },
    {
      id: '6',
      userName: 'Miguel Torres',
      userHandle: '@miguel_torres',
      avatar: require('../../../assets/OnBoarding7.png'),
      rating: 4,
      text: 'Funciona bien pero la cámara no es tan impresionante como esperaba. El precio es muy alto.',
      date: '2025-01-03',
      likes: 12,
      helpful: 9,
      verified: false,
      photos: [],
      productVariant: 'Titanio Azul 256GB'
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
      userHandle: '@usuario',
      avatar: require('../../../assets/adri.jpeg'),
      rating: reviewData.rating,
      text: reviewData.reviewText,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      helpful: 0,
      verified: false,
      photos: [],
      productVariant: 'Titanio Natural 256GB'
    };
    setReviews(prev => [newReview, ...prev]);
  };

  const filteredAndSortedReviews = reviews
    .filter(review => {
      // Filtro por texto de búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          review.text.toLowerCase().includes(query) ||
          review.userName.toLowerCase().includes(query) ||
          review.productVariant.toLowerCase().includes(query)
        );
      }

      // Filtro por rating
      switch (selectedFilter) {
        case 'high':
          return review.rating >= 6;
        case 'medium':
          return review.rating >= 4 && review.rating <= 5;
        case 'low':
          return review.rating <= 3;
        case 'verified':
          return review.verified;
        case 'withPhotos':
          return review.photos.length > 0;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'helpful':
          return b.helpful - a.helpful;
        case 'recent':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  const renderStars = (rating) => {
    return Array.from({ length: 7 }, (_, index) => (
      <Image
        key={index}
        source={require('../../../assets/full_star.png')}
        style={[
          styles.starIcon,
          { opacity: index < rating ? 1 : 0.3 }
        ]}
      />
    ));
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      {/* Header del review */}
      <View style={styles.reviewHeader}>
        <View style={styles.userInfo}>
          <Image source={item.avatar} style={styles.userAvatar} />
          <View style={styles.userDetails}>
            <View style={styles.userNameRow}>
              <Text style={styles.userName}>{item.userName}</Text>
              {item.verified && (
                <Image source={require('../../../assets/verificado.png')} style={styles.verifiedIcon} />
              )}
            </View>
            <Text style={styles.userHandle}>{item.userHandle}</Text>
            <Text style={styles.productVariant}>{item.productVariant}</Text>
          </View>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.starsRow}>
            {renderStars(item.rating)}
          </View>
          <Text style={styles.ratingText}>{item.rating}/7</Text>
        </View>
      </View>

      {/* Contenido del review */}
      <Text style={styles.reviewText}>{item.text}</Text>

      {/* Fotos del review */}
      {item.photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
          {item.photos.map((photo, index) => (
            <Image key={index} source={photo} style={styles.reviewPhoto} />
          ))}
        </ScrollView>
      )}

      {/* Footer del review */}
      <View style={styles.reviewFooter}>
        <Text style={styles.reviewDate}>{item.date}</Text>
        <View style={styles.reviewActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets/corazon.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Image source={require('../../../assets/tickBlanco.png')} style={styles.actionIcon} />
            <Text style={styles.actionText}>Útil ({item.helpful})</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const FilterButton = ({ filter, label, icon }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonSelected
      ]}
      onPress={() => setSelectedFilter(filter)}
      activeOpacity={0.8}
    >
      <Image 
        source={icon} 
        style={[
          styles.filterIcon,
          selectedFilter === filter && styles.filterIconSelected
        ]} 
      />
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter && styles.filterTextSelected
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header personalizado estilo Apple */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate.goBack()}>
          <Image source={require('../../../assets/arrow_left.png')} style={styles.backIcon} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Todas las reseñas</Text>
          <Text style={styles.headerSubtitle}>{filteredAndSortedReviews.length} reseñas</Text>
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
        {/* Barra de búsqueda */}
        <View style={styles.searchContainer}>
          <Image source={require('../../../assets/lupa.png')} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar en reseñas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Image source={require('../../../assets/icon_x.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filtros y ordenamiento */}
        <View style={styles.filtersSection}>
          <View style={styles.filtersHeader}>
            <Text style={styles.filtersTitle}>Filtros</Text>
            <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
              <Text style={styles.toggleFiltersText}>
                {showFilters ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {showFilters && (
            <View style={styles.filtersContainer}>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.filtersScroll}
              >
                <FilterButton 
                  filter="all" 
                  label="Todas" 
                  icon={require('../../../assets/category.png')} 
                />
                <FilterButton 
                  filter="high" 
                  label="Altas (6-7)" 
                  icon={require('../../../assets/full_star.png')} 
                />
                <FilterButton 
                  filter="medium" 
                  label="Medias (4-5)" 
                  icon={require('../../../assets/empty_star.png')} 
                />
                <FilterButton 
                  filter="low" 
                  label="Bajas (1-3)" 
                  icon={require('../../../assets/empty_star.png')} 
                />
                <FilterButton 
                  filter="verified" 
                  label="Verificadas" 
                  icon={require('../../../assets/verificado.png')} 
                />
                <FilterButton 
                  filter="withPhotos" 
                  label="Con fotos" 
                  icon={require('../../../assets/images.png')} 
                />
              </ScrollView>
              
              {/* Selector de ordenamiento */}
              <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Ordenar por:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {[
                    { key: 'recent', label: 'Más recientes' },
                    { key: 'rating', label: 'Mejor valoradas' },
                    { key: 'helpful', label: 'Más útiles' }
                  ].map((sort) => (
                    <TouchableOpacity
                      key={sort.key}
                      style={[
                        styles.sortButton,
                        sortBy === sort.key && styles.sortButtonSelected
                      ]}
                      onPress={() => setSortBy(sort.key)}
                    >
                      <Text
                        style={[
                          styles.sortText,
                          sortBy === sort.key && styles.sortTextSelected
                        ]}
                      >
                        {sort.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          )}
        </View>
        
        {filteredAndSortedReviews.length > 0 ? (
          <FlatList
            data={filteredAndSortedReviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl 
                refreshing={refreshing} 
                onRefresh={onRefresh}
                tintColor="#007AFF"
                colors={['#007AFF']}
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
            <Text style={styles.emptyTitle}>No hay reseñas</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'No se encontraron reseñas con tu búsqueda' : 'Sé el primero en escribir una reseña'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.writeFirstButton}
                onPress={() => setShowWriteReview(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.writeFirstButtonText}>Escribir reseña</Text>
              </TouchableOpacity>
            )}
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
    backgroundColor: '#FFFFFF' 
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
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#007AFF',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
    fontWeight: '500',
  },
  writeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
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
  
  // Barra de búsqueda
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  searchIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    tintColor: '#8E8E93',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    fontWeight: '400',
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#8E8E93',
  },
  
  // Filtros
  filtersSection: {
    marginBottom: 24,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  filtersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  toggleFiltersText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    padding: 16,
  },
  filtersScroll: {
    paddingRight: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterIcon: {
    width: 16,
    height: 16,
    marginRight: 8,
    tintColor: '#8E8E93',
  },
  filterIconSelected: {
    tintColor: '#FFFFFF',
  },
  filterText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  
  // Ordenamiento
  sortContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sortLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 12,
  },
  sortButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sortButtonSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  sortTextSelected: {
    color: '#FFFFFF',
  },
  
  // Lista de reseñas
  reviewsList: {
    paddingBottom: 100,
  },
  separator: {
    height: 20,
  },
  
  // Tarjeta de reseña
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 6,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
  },
  userHandle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  productVariant: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 2,
    fontWeight: '500',
  },
  ratingContainer: {
    alignItems: 'flex-end',
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  starIcon: {
    width: 12,
    height: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  reviewText: {
    fontSize: 15,
    color: '#000000',
    lineHeight: 22,
    marginBottom: 12,
  },
  photosContainer: {
    marginBottom: 12,
  },
  reviewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 8,
    resizeMode: 'cover',
  },
  reviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  reviewActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  actionIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
    tintColor: '#8E8E93',
  },
  actionText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
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
    tintColor: '#8E8E93',
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    fontWeight: '400',
  },
  writeFirstButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  writeFirstButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
});

export default AllReviews;
