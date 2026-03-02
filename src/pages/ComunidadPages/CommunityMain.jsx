import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { searcher, searcherUser } from '../../services/communityServices';
import BuscadorComponente from '../../components/Utils/Buscador';
import Error from '../../components/Utils/Error';
import FilterModal from '../../components/Blocks/Community/FilterModal';
import UtilsCard from '../../components/Blocks/Community/UtilsCard';
import createButton from '../../../assets/createButton.png';
import addImage from '../../../assets/addImage.png';

const CommunityMain = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.CommunityMain;

  const [search, setSearch] = useState('');
  const [info, setInfo] = useState([]);
  const [showFilterModal, setFilterModal] = useState(false);
  const [trucos, setTrucos] = useState(true);
  const [consejos, setConsejos] = useState(true);
  const [contactos, setContactos] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('explore');

  const handleSearcher = async ({ search }) => {
    setLoading(true)
    try {
      setInfo([])
      let search2 = search === '' ? 'all' : search;
      
      // Usar el servicio correcto según la pestaña seleccionada
      const searchFunction = selectedTab === 'user' ? searcherUser : searcher;
      
      await searchFunction({ search: search2, trick: trucos, advice: consejos, contact: contactos }, logout)
        .then((res) => {
          setInfo(res);
          setLoading(false)
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
    handleSearcher({ search });
  }, [search, trucos, consejos, contactos, selectedTab]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearch('')
    await Promise.all(
      handleSearcher({ search: '' })
    );
    setRefreshing(false);
  }, []);

  return (
    <>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{screenTexts.Title}</Text>
            <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
          </View>
        </View>

        <View style={styles.searchContainer}>
            <BuscadorComponente 
                placeholder={screenTexts.SearcherPlaceHolder} 
                search={search} 
                func={setSearch}
                showFilter={true}
                filterActive={!trucos || !consejos || !contactos}
                onFilterPress={() => setFilterModal(true)}
            />
        </View>

        {/* Submenu */}
        <View style={styles.submenuContainer}>
          <TouchableOpacity 
            style={[styles.submenuButton, selectedTab === 'explore' && styles.submenuButtonActive]}
            onPress={() => setSelectedTab('explore')}
          >
            <Text style={[styles.submenuText, selectedTab === 'explore' && styles.submenuTextActive]}>
              {screenTexts.Submenu.Explore}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.submenuButton, selectedTab === 'user' && styles.submenuButtonActive]}
            onPress={() => setSelectedTab('user')}
          >
            <Text style={[styles.submenuText, selectedTab === 'user' && styles.submenuTextActive]}>
              {screenTexts.Submenu.User}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 8, marginTop: 25, marginBottom: 90 }}>
          {info.length === 0 ? (
              loading ? (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color="#1D7CE4" />
                </View>
              ) : selectedTab === 'user' ? (
                // Estado vacío específico para usuario
                <View style={styles.emptyUserState}>
                  <Image source={addImage} style={styles.emptyImage} />
                  <Text style={styles.emptyUserTitle}>{screenTexts.UserEmptyState.Title}</Text>
                  <Text style={styles.emptyUserSubtitle}>{screenTexts.UserEmptyState.Subtitle}</Text>
                  <TouchableOpacity 
                    style={styles.createContentButton}
                    onPress={() => navigate.navigate('Create')}
                  >
                    <Text style={styles.createContentButtonText}>{screenTexts.UserEmptyState.ButtonText}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Estado vacío para explorar
                <Text style={styles.noFriendsText}>{screenTexts.NoItemsTexts}</Text>
              )
              
            ) : (
              info.map((item, index) => (
              <UtilsCard
                  key={index}
                  type={item.type}
                  ciudad={item.ciudad}
                  pais={item.pais}
                  ciudadId={item.ciudadId}
                  paisId={item.paisId}
                  total={item.total}
                  avatar={item.avatar}
              />
              ))
            )
        }
        </View>

        <FilterModal
            isOpen={showFilterModal}
            onClose={() => setFilterModal(false)}
            val1={trucos}
            val2={consejos}
            val3={contactos}
            func1={setTrucos}
            func2={setConsejos}
            func3={setContactos}
        />

        {error && <Error message={errorMessage} func={setError} />}
        </ScrollView>

        <LinearGradient
        colors={['#004999', '#1D7CE4']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.buttonAdd}
        >
        <TouchableOpacity onPress={() => navigate.navigate('Create')}>
            <Image source={createButton} style={styles.imageCreate} />
        </TouchableOpacity>
        </LinearGradient>
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
  searchContainer: {
    paddingLeft: 0,
    paddingRight: 16,
    marginTop: 8,
    paddingBottom: 10,
  },
  submenuContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
  },
  submenuButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  submenuButtonActive: {
    borderBottomColor: '#1D7CE4',
  },
  submenuText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
  submenuTextActive: {
    color: '#1D7CE4',
    fontWeight: '600',
  },
  scrollContainer: {
    //top: 15
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    paddingVertical: 4,
    flex: 1,
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightButton: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selectedButton: {
    borderBottomWidth: 3,
    borderColor: '#1D7CE4'
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
  },
  selectedButtonText:{
    fontWeight: 'bold',
  },
  buttonAdd: {
    backgroundColor: '#1D7CE4',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 120,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCreate: {
    width: 35,
    height: 35,
  },
  noFriendsText:{
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 30,
    color: 'gray'
  },
  emptyUserState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.8,
  },
  emptyUserTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  emptyUserSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  createContentButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createContentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

export default CommunityMain;