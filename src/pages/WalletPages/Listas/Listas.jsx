import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { lists } from '../../../services/walletServices';
import Experiences from '../../../components/Blocks/Experiences/Experiences';
import fondoExperiencia from '../../../../assets/fondo_experiencia.png';

const Listas = ({ setError, setErrorMessage}) => {
    const navigate=useNavigation()
    const { isLogged, isLoading, logout, texts } = useUser();
    const [loading, setLoading] = useState(true);
    const screenTexts = texts.pages.WalletPages.Listas.Listas
    const [listas, setListas] = useState([])
    const [refreshing, setRefreshing] = useState(false);

  const handleLists = async () => {
    try {
      setLoading(true)
      lists(logout)
        .then((response) => {
          if (response) {
            setListas(response.lists)
            setLoading(false)
          }
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false)
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setLoading(false)
    }
  };

  useEffect(() => {
    
    handleLists()
    
  },[])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setListas([])
    await Promise.all(
      handleLists()
    );
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#1D7CE4"
          />
        }
        showsVerticalScrollIndicator={false}
      >
          {/* Premium Header */}
          <View style={styles.headerContainer}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>{screenTexts.Title}</Text>
              <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />
          {/* Quick Access Section */}
          <View style={styles.quickAccessSection}>
            <Text style={styles.sectionTitle}>Acceso rápido</Text>
            <View style={styles.quickAccessCards}>
              <Experiences 
                name={screenTexts.PredeterminedList} 
                subText={screenTexts.PredeterminedListSubtitle} 
                view={false} 
                onPress={() => navigate.navigate('FriendsLists')}
              />
              <Experiences 
                name={screenTexts.PredeterminedList2} 
                subText={screenTexts.PredeterminedListSubtitle2} 
                view={false} 
                onPress={() => navigate.navigate('SavedLists')}
              />
            </View>
          </View>
          
          {/* My Lists Section */}
          {listas.length > 0 && (
            <View style={styles.myListsSection}>
              <Text style={styles.sectionTitle}>Mis listas</Text>
              <View style={styles.listsGrid}>
                {listas.map((item) => (
                  <Experiences
                      key={item._id}
                      name={item.name} 
                      view={item.visibility}
                      photo={item.avatar.url}
                      save={item.numFollowers}
                      onPress={() => navigate.navigate('OtherExperience', {_id: item._id})}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Shared Lists Section */}
          <View style={styles.sharedListsSection}>
            <Text style={styles.sectionTitle}>Listas compartidas</Text>
            <View style={styles.listsGrid}>
              {/* Ejemplo de listas compartidas - puedes reemplazar con datos reales */}
              <Experiences 
                name="Lugares de Barcelona" 
                subText="Lista compartida por @maria_garcia" 
                view={true} 
                photo="https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=400&h=400&fit=crop"
                save={12}
                onPress={() => navigate.navigate('OtherExperience', {_id: 'shared_1'})}
              />
              <Experiences 
                name="Restaurantes Madrid" 
                subText="Lista compartida por @carlos_lopez" 
                view={true} 
                photo="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=400&fit=crop"
                save={8}
                onPress={() => navigate.navigate('OtherExperience', {_id: 'shared_2'})}
              />
              <Experiences 
                name="Playas de Valencia" 
                subText="Lista compartida por @ana_martinez" 
                view={true} 
                photo="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop"
                save={15}
                onPress={() => navigate.navigate('OtherExperience', {_id: 'shared_3'})}
              />
            </View>
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1D7CE4" />
              <Text style={styles.loadingText}>Cargando tus listas...</Text>
            </View>
          )}

          {/* Empty State */}
          {!loading && listas.length === 0 && (
            <View style={styles.emptyStateContainer}>
              <Image source={fondoExperiencia} style={styles.emptyStateImage} />
              <Text style={styles.emptyStateTitle}>Crea tu primera lista</Text>
              <Text style={styles.emptyStateSubtitle}>
                Organiza tus lugares favoritos en colecciones personalizadas
              </Text>
              <TouchableOpacity 
                style={styles.createGroupButton}
                onPress={() => navigate.navigate('AddList')}
              >
                <Text style={styles.createGroupButtonText}>Crear lista</Text>
              </TouchableOpacity>
            </View>
          )}
          
      </ScrollView>
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    marginBottom: 0,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.8,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 17,
    color: '#6E6E73',
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E7',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 100,
    backgroundColor: '#FFFFFF',
  },
  quickAccessSection: {
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    paddingHorizontal: 24,
    letterSpacing: -0.4,
  },
  quickAccessCards: {
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  myListsSection: {
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  sharedListsSection: {
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  listsGrid: {
    paddingHorizontal: 0,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: '#86868B',
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
    backgroundColor: '#FFFFFF',
  },
  // Empty State Styles - Premium UX/UI Design (matching Solicitudes)
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    letterSpacing: -0.2,
    maxWidth: 280,
  },
  createGroupButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default Listas;
