import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, Image, Dimensions, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import BeneficioCard from '../../components/MarketPlace/BeneficioCard';

const { width } = Dimensions.get('window');

const SavedBenefits = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.MarketPlacePages.Details.SavedBenefits || {
    Top: 'Mis Beneficios',
    Title: 'Beneficios Guardados',
    Subtitle: 'Tus beneficios favoritos están aquí',
    EmptyTitle: 'No hay beneficios guardados',
    EmptySubtitle: 'Guarda beneficios que te interesen para acceder a ellos fácilmente.',
    DateLabel: 'Guardado el',
    UseButton: 'Usar beneficio',
    RemoveButton: 'Quitar de guardados'
  };

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  // Datos de ejemplo para beneficios guardados
  const [savedBenefits, setSavedBenefits] = useState([
    {
      id: '1',
      imageUri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=300&auto=format&fit=crop',
      title: 'Tour Santiago Bernabéu',
      username: '@realmadrid',
      headerTitle: 'BENEFICIO KYLOT',
      status: 'UNLOCKED',
      metaText: 'Beneficio guardado el 20 de enero, 2024',
      avatarUri: 'https://i.pravatar.cc/40?img=1',
      iconSource: require('../../../assets/aceptado.png'),
      value: '€35',
      expiryDate: '31/12/2024',
      usageCount: '127',
      kyletsPrice: 25,
      userKylets: 0,
      savedDate: '20 de enero, 2024',
      brandLogo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
      brandName: 'Real Madrid',
      isPremium: true,
      category: 'Deportes'
    },
    {
      id: '2',
      imageUri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop',
      title: 'Cena para 2',
      username: '@elbotin',
      headerTitle: 'BENEFICIO KYLOT',
      status: 'UNLOCKED',
      metaText: 'Beneficio guardado el 18 de enero, 2024',
      avatarUri: 'https://i.pravatar.cc/40?img=2',
      iconSource: require('../../../assets/aceptado.png'),
      value: '€65',
      expiryDate: '28/02/2024',
      usageCount: '89',
      kyletsPrice: 15,
      userKylets: 0,
      savedDate: '18 de enero, 2024',
      brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Restaurant-Logo.png',
      brandName: 'El Botín',
      isPremium: true,
      category: 'Gastronomía'
    },
    {
      id: '3',
      imageUri: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300&auto=format&fit=crop',
      title: 'Spa & Relax',
      username: '@spapremium',
      headerTitle: 'BENEFICIO KYLOT',
      status: 'UNLOCKED',
      metaText: 'Beneficio guardado el 15 de enero, 2024',
      avatarUri: 'https://i.pravatar.cc/40?img=3',
      iconSource: require('../../../assets/aceptado.png'),
      value: '€120',
      expiryDate: '15/03/2024',
      usageCount: '203',
      kyletsPrice: 40,
      userKylets: 0,
      savedDate: '15 de enero, 2024',
      brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Spa-Logo.png',
      brandName: 'Spa Premium',
      isPremium: true,
      category: 'Bienestar'
    },
    {
      id: '4',
      imageUri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop',
      title: 'Entrada Cine Premium',
      username: '@cinepremium',
      headerTitle: 'BENEFICIO KYLOT',
      status: 'UNLOCKED',
      metaText: 'Beneficio guardado el 12 de enero, 2024',
      avatarUri: 'https://i.pravatar.cc/40?img=4',
      iconSource: require('../../../assets/aceptado.png'),
      value: '€18',
      expiryDate: '30/04/2024',
      usageCount: '156',
      kyletsPrice: 12,
      userKylets: 0,
      savedDate: '12 de enero, 2024',
      brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Cinemark-Logo.png',
      brandName: 'Cinemark',
      isPremium: false,
      category: 'Entretenimiento'
    }
  ]);

  useEffect(() => {
    if (!isLoading && !isLogged) navigate.navigate('Login');
  }, [isLogged, isLoading, navigate]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simular carga de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleBenefitPress = (item) => {
    navigate.navigate('Details', { 
      benefit: item,
      fromSaved: true 
    });
  };

  const handleUseBenefit = (item) => {
    setConfirmacionMensaje(`¿Usar el beneficio "${item.title}"?`);
    setConfirmacion(true);
  };

  const handleRemoveBenefit = (itemId) => {
    setSavedBenefits(prev => prev.filter(item => item.id !== itemId));
    setConfirmacionMensaje('Beneficio eliminado de guardados');
    setConfirmacion(true);
  };

  const renderSavedItem = (item) => (
    <BeneficioCard
      key={item.id}
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
      kyletsPrice={item.kyletsPrice}
      userKylets={item.userKylets}
      brandLogo={item.brandLogo}
      brandName={item.brandName}
      isPremium={item.isPremium}
      category={item.category}
      onPress={() => handleBenefitPress(item)}
      width={280}
      height={280}
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No hay beneficios guardados</Text>
      <Text style={styles.emptySubtitle}>
        Guarda beneficios que te interesen para acceder a ellos fácilmente desde aquí.
      </Text>
      <TouchableOpacity style={styles.exploreButton}>
        <LinearGradient
          colors={['#1D7CE4', '#004999']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.exploreButtonGradient}
        >
          <Text style={styles.exploreButtonText}>Explorar beneficios</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {savedBenefits.length > 0 ? (
          <>
            {/* Header Section */}
            <View style={styles.headerSection}>
              <View style={styles.titleContainer}>
                <Text style={styles.mainTitle}>{screenTexts.Title}</Text>
                <Text style={styles.mainSubtitle}>{screenTexts.Subtitle}</Text>
              </View>
              
              {/* Stats Cards */}
              <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>{savedBenefits.length}</Text>
                  <Text style={styles.statLabel}>Beneficios guardados</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {savedBenefits.filter(item => item.isPremium).length}
                  </Text>
                  <Text style={styles.statLabel}>Beneficios premium</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {savedBenefits.reduce((sum, item) => sum + item.points, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Kylets totales</Text>
                </View>
              </View>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsList}>
              {savedBenefits.map(renderSavedItem)}
            </View>
          </>
        ) : (
          renderEmptyState()
        )}
      </ScrollView>

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
  content: { 
    paddingBottom: 100
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  titleContainer: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D7CE4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  benefitsList: {
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusAvailable: {
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  premiumText: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pointsText: {
    fontSize: 14,
    color: '#1D7CE4',
    fontWeight: '600',
    marginLeft: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  itemImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  expiringBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expiringText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  itemContent: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  itemDescription: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 16,
  },
  metaContainer: {
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  metaSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '400',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  removeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  useButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  useButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  useButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  exploreButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#1D7CE4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  exploreButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  exploreButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SavedBenefits;
