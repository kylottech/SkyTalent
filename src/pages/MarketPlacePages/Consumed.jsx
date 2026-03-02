import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, Image, Dimensions, StatusBar, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import BeneficioCard from '../../components/MarketPlace/BeneficioCard';

const { width } = Dimensions.get('window');

const Consumed = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.MarketPlacePages.Details.Consumed;

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  // Datos de ejemplo para beneficios consumidos organizados por días
  const [consumedBenefitsByDay, setConsumedBenefitsByDay] = useState([
    {
      date: '15 de enero, 2024',
      dayName: 'Lunes',
      benefits: [
        {
          id: '1',
          imageUri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=300&auto=format&fit=crop',
          title: 'Tickets Real Madrid',
          username: '@realmadrid',
          headerTitle: 'BENEFICIO KYLOT',
          status: 'EXPIRED',
          metaText: 'Beneficio consumido el 15 de enero, 2024',
          avatarUri: 'https://i.pravatar.cc/40?img=1',
          iconSource: require('../../../assets/aceptado.png'),
          value: '€35',
          expiryDate: '31/12/2024',
          usageCount: '127',
          kyletsPrice: 25,
          userKylets: 0,
          consumedDate: '15 de enero, 2024',
          brandLogo: 'https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png',
          brandName: 'Real Madrid',
          isPremium: true,
          category: 'Deportes'
        },
        {
          id: '4',
          imageUri: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=300&auto=format&fit=crop',
          title: 'Entrada Cine Premium',
          username: '@cinepremium',
          headerTitle: 'BENEFICIO KYLOT',
          status: 'EXPIRED',
          metaText: 'Beneficio consumido el 15 de enero, 2024',
          avatarUri: 'https://i.pravatar.cc/40?img=4',
          iconSource: require('../../../assets/aceptado.png'),
          value: '€18',
          expiryDate: '30/04/2024',
          usageCount: '156',
          kyletsPrice: 12,
          userKylets: 0,
          consumedDate: '15 de enero, 2024',
          brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Cinemark-Logo.png',
          brandName: 'Cinemark',
          isPremium: false,
          category: 'Entretenimiento'
        }
      ]
    },
    {
      date: '12 de enero, 2024',
      dayName: 'Viernes',
      benefits: [
        {
          id: '2',
          imageUri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=300&auto=format&fit=crop',
          title: 'Cena para 2',
          username: '@elbotin',
          headerTitle: 'BENEFICIO KYLOT',
          status: 'EXPIRED',
          metaText: 'Beneficio consumido el 12 de enero, 2024',
          avatarUri: 'https://i.pravatar.cc/40?img=2',
          iconSource: require('../../../assets/aceptado.png'),
          value: '€65',
          expiryDate: '28/02/2024',
          usageCount: '89',
          kyletsPrice: 15,
          userKylets: 0,
          consumedDate: '12 de enero, 2024',
          brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Restaurant-Logo.png',
          brandName: 'El Botín',
          isPremium: true,
          category: 'Gastronomía'
        }
      ]
    },
    {
      date: '8 de enero, 2024',
      dayName: 'Lunes',
      benefits: [
        {
          id: '3',
          imageUri: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=300&auto=format&fit=crop',
          title: 'Spa & Relax',
          username: '@spapremium',
          headerTitle: 'BENEFICIO KYLOT',
          status: 'EXPIRED',
          metaText: 'Beneficio consumido el 8 de enero, 2024',
          avatarUri: 'https://i.pravatar.cc/40?img=3',
          iconSource: require('../../../assets/aceptado.png'),
          value: '€120',
          expiryDate: '15/03/2024',
          usageCount: '203',
          kyletsPrice: 40,
          userKylets: 0,
          consumedDate: '8 de enero, 2024',
          brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Spa-Logo.png',
          brandName: 'Spa Premium',
          isPremium: true,
          category: 'Bienestar'
        },
        {
          id: '5',
          imageUri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300&auto=format&fit=crop',
          title: 'Gym Premium',
          username: '@gympremium',
          headerTitle: 'BENEFICIO KYLOT',
          status: 'EXPIRED',
          metaText: 'Beneficio consumido el 8 de enero, 2024',
          avatarUri: 'https://i.pravatar.cc/40?img=5',
          iconSource: require('../../../assets/aceptado.png'),
          value: '€50',
          expiryDate: '28/02/2024',
          usageCount: '78',
          kyletsPrice: 35,
          userKylets: 0,
          consumedDate: '8 de enero, 2024',
          brandLogo: 'https://logos-world.net/wp-content/uploads/2020/09/Gym-Logo.png',
          brandName: 'Gym Premium',
          isPremium: false,
          category: 'Fitness'
        }
      ]
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
      type: 'benefit',
      benefitData: item,
      fromConsumed: true 
    });
  };

  const renderBenefitItem = (item) => (
    <View style={styles.benefitItem} key={item.id}>
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
    </View>
  );

  const renderDaySection = (dayData) => (
    <View style={styles.daySection} key={dayData.date}>
      {/* Header del día */}
      <View style={styles.dayHeader}>
        <View style={styles.dayInfo}>
          <Text style={styles.dayName}>{dayData.dayName}</Text>
          <Text style={styles.dayDate}>{dayData.date}</Text>
        </View>
        <View style={styles.dayStats}>
          <Text style={styles.dayCount}>{dayData.benefits.length} beneficios</Text>
        </View>
      </View>
      
      {/* Scroll horizontal de beneficios */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScroll}
      >
        {dayData.benefits.map(renderBenefitItem)}
      </ScrollView>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No hay beneficios consumidos</Text>
      <Text style={styles.emptySubtitle}>
        Los beneficios que uses aparecerán aquí para que puedas revisarlos cuando quieras.
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
        {consumedBenefitsByDay.length > 0 ? (
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
                  <Text style={styles.statNumber}>
                    {consumedBenefitsByDay.reduce((sum, day) => sum + day.benefits.length, 0)}
                  </Text>
                  <Text style={styles.statLabel}>Total consumidos</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statNumber}>
                    {consumedBenefitsByDay.reduce((sum, day) => 
                      sum + day.benefits.reduce((daySum, item) => daySum + item.kyletsPrice, 0), 0
                    )}
                  </Text>
                  <Text style={styles.statLabel}>Kylets gastados</Text>
                </View>
              </View>
            </View>

            {/* Benefits List */}
            <View style={styles.benefitsList}>
              {consumedBenefitsByDay.map(renderDaySection)}
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
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D7CE4',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  benefitsList: {
    paddingHorizontal: 20,
  },
  daySection: {
    marginBottom: 32,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  dayDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dayStats: {
    alignItems: 'flex-end',
  },
  dayCount: {
    fontSize: 12,
    color: '#1D7CE4',
    fontWeight: '600',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  horizontalScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  benefitItem: {
    marginRight: 16,
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

export default Consumed;
