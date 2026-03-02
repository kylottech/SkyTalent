import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, Image, TouchableOpacity, Dimensions, Animated, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import BeneficioCard from '../../components/MarketPlace/BeneficioCard';
import ProductCard from '../../components/MarketPlace/ProductCard';

const { width: screenWidth } = Dimensions.get('window');

const CompanyDetails = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  
  // Obtener parámetros de navegación
  const { company } = route.params || {};

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    benefits: true,
    products: true,
    locations: true,
  });

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (!isLoading && !isLogged) navigate.navigate('Login');
  }, [isLogged, isLoading]);

  // Animación de entrada
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    setConfirmacionMensaje(isFollowing ? 'Dejaste de seguir a la empresa' : 'Ahora sigues a esta empresa');
    setConfirmacion(true);
  };

  const handleShare = () => {
    setConfirmacionMensaje('Compartiendo empresa...');
    setConfirmacion(true);
  };

  // Datos de ejemplo - estos deberían venir del backend
  const companyBenefits = [
    {
      id: 'benefit-1',
      imageUri: 'https://picsum.photos/800/800?random=1',
      title: 'Descuento\n20% OFF',
      username: `@${company?.name?.toLowerCase() || 'empresa'}`,
      headerTitle: 'BENEFICIO KYLOT',
      status: 'UNLOCKED',
      metaText: '+156 personas ya usaron este beneficio',
      avatarUri: 'https://i.pravatar.cc/40?img=5',
      iconSource: require('../../../assets/verificado.png'),
      value: '€25',
      expiryDate: '31/12/2024',
      usageCount: '156',
    },
    {
      id: 'benefit-2',
      imageUri: 'https://picsum.photos/800/800?random=2',
      title: 'Regalo\nGratis',
      username: `@${company?.name?.toLowerCase() || 'empresa'}`,
      headerTitle: 'BENEFICIO KYLOT',
      status: 'UNLOCKED',
      metaText: '+89 personas ya usaron este beneficio',
      avatarUri: 'https://i.pravatar.cc/40?img=6',
      iconSource: require('../../../assets/RegaloAzul.png'),
      value: '€15',
      expiryDate: '30/06/2024',
      usageCount: '89',
    },
  ];

  const companyProducts = [
    {
      id: 'product-1',
      title: 'Producto Premium',
      subtitle: 'Producto de alta calidad con descuento exclusivo',
      price: '€45',
      originalPrice: '€65',
      discount: '31',
      category: 'Premium',
      rating: '4.8',
      reviews: 234,
      isService: false,
      iconSource: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
      inStock: true,
      deliveryTime: '24-48h',
      verified: true,
      usedByFriends: 12,
    },
    {
      id: 'product-2',
      title: 'Servicio Exclusivo',
      subtitle: 'Acceso a servicio VIP de la empresa',
      price: '€89',
      originalPrice: '€129',
      discount: '31',
      category: 'Servicio',
      rating: '4.9',
      reviews: 156,
      isService: true,
      iconSource: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=800&fit=crop',
      inStock: true,
      deliveryTime: 'Inmediato',
      verified: true,
      usedByFriends: 8,
    },
  ];

  const renderSectionHeader = (title, subtitle, isExpanded, onToggle) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={onToggle} activeOpacity={0.6}>
      <View style={styles.sectionHeaderContent}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
        </View>
        <View style={styles.chevronContainer}>
          <Text style={styles.chevron}>{isExpanded ? "−" : "+"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Top title={company?.name || 'Empresa'} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header de la empresa */}
        <Animated.View 
          style={[
            styles.headerContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.companyBanner}>
            <LinearGradient
              colors={['#58D5C9', '#00E5BF', '#00C9B7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.bannerGradient}
            >
              <Image 
                source={company?.iconSource || require('../../../assets/category.png')} 
                style={styles.companyIcon}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>

          <View style={styles.companyInfo}>
            <View style={styles.companyTitleRow}>
              <View style={styles.companyTitleContainer}>
                <Text style={styles.companyName}>{company?.name || 'Empresa'}</Text>
                {company?.isVerified && (
                  <Image 
                    source={require('../../../assets/verificado.png')} 
                    style={styles.verifiedBadge}
                  />
                )}
              </View>
              <TouchableOpacity 
                style={[styles.followButton, isFollowing && styles.followButtonActive]}
                onPress={handleFollow}
                activeOpacity={0.8}
              >
                <Text style={[styles.followButtonText, isFollowing && styles.followButtonTextActive]}>
                  {isFollowing ? 'Siguiendo' : 'Seguir'}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.companyCategory}>{company?.category || 'Categoría'}</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>234</Text>
                <Text style={styles.statLabel}>Productos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>56</Text>
                <Text style={styles.statLabel}>Beneficios</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>12K</Text>
                <Text style={styles.statLabel}>Seguidores</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Acerca de */}
        {renderSectionHeader(
          'Acerca de',
          'Información de la empresa',
          expandedSections.about,
          () => setExpandedSections(prev => ({ ...prev, about: !prev.about }))
        )}
        
        {expandedSections.about && (
          <View style={styles.aboutSection}>
            <Text style={styles.aboutText}>
              {company?.name || 'Esta empresa'} ofrece productos y servicios de alta calidad con beneficios exclusivos para usuarios de Kylot. Descubre sus ofertas especiales y aprovecha los descuentos.
            </Text>
          </View>
        )}

        {/* Beneficios */}
        {renderSectionHeader(
          'Beneficios disponibles',
          `${companyBenefits.length} beneficios activos`,
          expandedSections.benefits,
          () => setExpandedSections(prev => ({ ...prev, benefits: !prev.benefits }))
        )}

        {expandedSections.benefits && (
          <FlatList
            data={companyBenefits}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BeneficioCard
                imageUri={item.imageUri}
                title={item.title}
                username={item.username}
                headerTitle={item.headerTitle}
                status={item.status}
                metaText={item.metaText}
                avatarUri={item.avatarUri}
                iconSource={item.iconSource}
                value={item.value}
                expiryDate={item.expiryDate}
                usageCount={item.usageCount}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        )}

        {/* Productos */}
        {renderSectionHeader(
          'Productos y servicios',
          `${companyProducts.length} disponibles`,
          expandedSections.products,
          () => setExpandedSections(prev => ({ ...prev, products: !prev.products }))
        )}

        {expandedSections.products && (
          <FlatList
            data={companyProducts}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ProductCard
                title={item.title}
                subtitle={item.subtitle}
                price={item.price}
                originalPrice={item.originalPrice}
                discount={item.discount}
                category={item.category}
                rating={item.rating}
                reviews={item.reviews}
                iconSource={item.iconSource}
                isService={item.isService}
                inStock={item.inStock}
                deliveryTime={item.deliveryTime}
                verified={item.verified}
                usedByFriends={item.usedByFriends}
              />
            )}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
          />
        )}

        {/* Botón de compartir */}
        <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.8}>
          <LinearGradient
            colors={['#58D5C9', '#00E5BF', '#00C9B7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shareGradient}
          >
            <Text style={styles.shareButtonText}>Compartir empresa</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerContainer: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 24,
  },
  companyBanner: {
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F7',
  },
  bannerGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyIcon: {
    width: 80,
    height: 80,
    tintColor: '#FFFFFF',
  },
  companyInfo: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  companyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  companyName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.5,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    marginLeft: 8,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#007AFF',
  },
  followButtonActive: {
    backgroundColor: '#F5F5F7',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  followButtonTextActive: {
    color: '#8E8E93',
  },
  companyCategory: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 16,
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#8E8E93',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E5E5E5',
  },
  sectionHeader: {
    marginHorizontal: 24,
    marginVertical: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  chevronContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chevron: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '200',
  },
  aboutSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 15,
    color: '#1D1D1F',
    lineHeight: 22,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  shareButton: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  shareGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CompanyDetails;

