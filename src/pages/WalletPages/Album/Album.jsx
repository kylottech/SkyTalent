import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, RefreshControl, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import ToggleSwitch from 'toggle-switch-react-native'
import ImageView from 'react-native-image-viewing';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'

import { getMyAlbums, othersAlbums, getFriendsAlbums, getKylotAlbums } from '../../../services/albumServices'

import InfoModal from '../../../components/Utils/InfoModal';
import AddAlbumModal from '../../../components/wallet/Album/AddAlbumModal';
import AlbumCard from '../../../components/wallet/Album/AlbumCard';

import info from '../../../../assets/info.png'; 
import createButton from '../../../../assets/createButton.png'
import fondoExperiencia from '../../../../assets/fondo_experiencia.png';

const Album = ({ setError, setErrorMessage, setConfirmacion, setConfirmacionMensaje}) => {
    const navigate=useNavigation()
    const { isLogged, isLoading, logout, texts } = useUser();
    const [loading, setLoading] = useState(false);
    const [follow, setFollow] = useState(false);
    const [selected, setSelected] = useState(1);
    const [visibleModal, setVisibleModal] = useState(false);
    const [visibleCreateModal, setVisibleCreateModal] = useState(false);
    const screenTexts = texts.pages.WalletPages.Album.Album
    const [refreshing, setRefreshing] = useState(false);
    const [imageVisible, setImageVisible] = useState(false);
    const [imageToView, setImageToView] = useState('');

    const [pageMy, setPageMy] = useState(1);
    const [hasMoreMy, setHasMoreMy] = useState(true);

    const [pageAlbums, setPageAlbums] = useState(1);
    const [hasMoreAlbums, setHasMoreAlbums] = useState(true);

    const [pageFriends, setPageFriends] = useState(1);
    const [hasMoreFriends, setHasMoreFriends] = useState(true);

    const [pageKylot, setPageKylot] = useState(1);
    const [hasMoreKylot, setHasMoreKylot] = useState(true);

    const [myAlbums, setMyAlbums] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [friendsAlbums, setFriendsAlbums] = useState([]);
    const [kylotAlbums, setKylotAlbums] = useState([]);
    const [showKyletsConfirmation, setShowKyletsConfirmation] = useState(false);
    const [winKylets, setWinKylets] = useState(0);
    const [winKyletsText, setWinKyletsText] = useState('');
  
    useEffect(() => {
            
      if(winKylets !== 0){
        setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
        setShowKyletsConfirmation(true)
      }
    },[winKylets])

    const handleImagePress = (uri) => {
      setImageToView(uri);
      setImageVisible(true);
    };

    const handleGetMyAlbums = (reset = false) => {
        if (!hasMoreMy && !reset) return Promise.resolve();

        setLoading(true);
        const currentPage = reset ? 1 : pageMy;

        getMyAlbums({ page: currentPage }, logout)
        .then((res) => {
            if (res && Array.isArray(res.info)) {
                setMyAlbums(prev => reset ? res.info : [...prev, ...res.info]);
                setPageMy(prev => reset ? 2 : prev + 1);
                setHasMoreMy(res.info.length > 0);
            } else {
                setHasMoreMy(false);
            }
            setLoading(false);
        })
        .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setHasMoreMy(false);
            setLoading(false);
        });
    }

    const handleGetAlbums = (reset = false) => {
        if (!hasMoreAlbums && !reset) return Promise.resolve();

        setLoading(true);
        const currentPage = reset ? 1 : pageAlbums;

        othersAlbums({ page: currentPage }, logout)
        .then((res) => {
            if (res && Array.isArray(res.info)) {
                setAlbums(prev => reset ? res.info : [...prev, ...res.info]);
                setPageAlbums(prev => reset ? 2 : prev + 1);
                setHasMoreAlbums(res.info.length > 0);
            } else {
                setHasMoreAlbums(false);
            }
            setLoading(false);
        })
        .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setHasMoreAlbums(false);
            setLoading(false);
        });
    }

    const handleGetFriendsAlbums = (reset = false) => {
        if (!hasMoreFriends && !reset) return Promise.resolve();

        setLoading(true);
        const currentPage = reset ? 1 : pageFriends;

        getFriendsAlbums({ page: currentPage }, logout)
        .then((res) => {
            if (res && Array.isArray(res.info)) {
                setFriendsAlbums(prev => reset ? res.info : [...prev, ...res.info]);
                setPageFriends(prev => reset ? 2 : prev + 1);
                setHasMoreFriends(res.info.length > 0);
            } else {
                setHasMoreFriends(false);
            }
            setLoading(false);
        })
        .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setHasMoreFriends(false);
            setLoading(false);
        });
    }

    const handleGetKylotAlbums = (reset = false) => {
        if (!hasMoreKylot && !reset) return Promise.resolve();

        setLoading(true);
        const currentPage = reset ? 1 : pageKylot;

        getKylotAlbums({ page: currentPage }, logout)
        .then((res) => {
            if (res && Array.isArray(res.info)) {
                setKylotAlbums(prev => reset ? res.info : [...prev, ...res.info]);
                setPageKylot(prev => reset ? 2 : prev + 1);
                setHasMoreKylot(res.info.length > 0);
            } else {
                setHasMoreKylot(false);
            }
            setLoading(false);
        })
        .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setHasMoreKylot(false);
            setLoading(false);
        });
    };

    const handleCalls = async () => {
        if (selected === 1) {
            return await handleGetMyAlbums(true);
        } else if (selected === 2) {
            if (follow) {
            return await handleGetFriendsAlbums(true);
            } else {
            return await handleGetAlbums(true);
            }
        } else if (selected === 3) {
            return await handleGetKylotAlbums(true);
        }
    };

    useEffect(() => {
        const fetchAlbums = async () => {
            await handleCalls();
        };
        fetchAlbums();
    }, [selected, follow])

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await handleCalls(); 
        setRefreshing(false);
    }, [selected, follow]);

    const getCurrentAlbums = () => {
        if (selected === 1) return myAlbums;
        if (selected === 2) return follow ? friendsAlbums : albums;
        if (selected === 3) return kylotAlbums;
        return [];
    };

  return (
    <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>{screenTexts.Title}</Text>
                <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
              </View>
              
              {selected === 2 && 
                <View style={styles.switchContainer}>
                  <ToggleSwitch
                    isOn={follow}
                    onColor="#1D7CE4"
                    offColor="#E5E5E7"
                    size="small"
                    trackOnStyle={{ borderRadius: 12 }}  
                    trackOffStyle={{ borderRadius: 12 }} 
                    onToggle={() => {
                      setFollow(!follow)
                    }}
                  />
                  <TouchableOpacity onPress={() => setVisibleModal(!visibleModal)} style={styles.infoButton}>
                    <Image source={info} style={styles.infoIcon}/>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selected === 1 && styles.activeTab]}
            onPress={() => setSelected(1)}
          >
            <Text style={[styles.tabText, selected === 1 && styles.activeTabText]}>
              {screenTexts.Menu1}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selected === 2 && styles.activeTab]}
            onPress={() => setSelected(2)}
          >
            <Text style={[styles.tabText, selected === 2 && styles.activeTabText]}>
              {screenTexts.Menu2}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selected === 3 && styles.activeTab]}
            onPress={() => setSelected(3)}
          >
            <Text style={[styles.tabText, selected === 3 && styles.activeTabText]}>
              {screenTexts.Menu3}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.albumsContainer}>
            {getCurrentAlbums().map((album, index) => (
              <AlbumCard key={album._id || index} info={album} onImagePress={handleImagePress}/>
            ))}
            
            {(getCurrentAlbums().length === 0 && !loading) && (
              <View style={styles.emptyStateContainer}>
                <Image source={fondoExperiencia} style={styles.emptyStateImage} />
                <Text style={styles.emptyStateTitle}>
                  {selected === 1 ? 'No tienes álbumes' : 
                   selected === 2 ? (follow ? 'No hay álbumes de amigos' : 'No hay álbumes compartidos') : 
                   'No hay álbumes de Kylot'}
                </Text>
                <Text style={styles.emptyStateSubtitle}>
                  {selected === 1 ? 'Crea tu primer álbum para comenzar' : 
                   selected === 2 ? (follow ? 'Cuando tus amigos creen álbumes aparecerán aquí' : 'Cuando recibas álbumes compartidos aparecerán aquí') : 
                   'Los álbumes oficiales de Kylot aparecerán aquí'}
                </Text>
                <TouchableOpacity 
                  style={styles.createGroupButton}
                  onPress={() => setVisibleCreateModal(true)}
                >
                  <Text style={styles.createGroupButtonText}>Crear álbum</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1D7CE4" />
            </View>
          )}
        </ScrollView>

      

      <TouchableOpacity style={styles.addButton2} onPress={() => setVisibleCreateModal(true)}>
            <LinearGradient
            colors={[ '#1D7CE4' , '#004999' ]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.addButton}
            >
                <Image source={createButton} style={styles.imageCreate}/>
            </LinearGradient>
            
        </TouchableOpacity>

        <ImageView
          images={[{ uri: imageToView }]}
          imageIndex={0}
          visible={imageVisible}
          onRequestClose={() => setImageVisible(false)}
        />

      <InfoModal 
        isOpen={visibleModal} 
        onClose={ () => setVisibleModal(false)} 
        Title={screenTexts.InfoModalTitle} 
        Subtitle= {screenTexts.InfoModalSubtitle}
        Button={screenTexts.InfoModalButton}
      />

      <AddAlbumModal 
        isOpen={visibleCreateModal} 
        onClose={ () => setVisibleCreateModal(false)} 
        setConfirmacion={setConfirmacion} 
        setConfirmacionMensaje={setConfirmacionMensaje}
        setWinKylets={setWinKylets}
      />

      <InfoModal 
        celebration={true}
        isOpen={showKyletsConfirmation} 
        onClose={() => {setShowKyletsConfirmation(false), setWinKylets(0)} } 
        Title={winKyletsText} 
        Subtitle={screenTexts.KyletsSubtitle} 
        Button={screenTexts.KyletsButton} 
      />
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    marginBottom: 0,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.5,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#86868B',
    fontWeight: '400',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  infoButton: {
    padding: 4,
  },
  infoIcon: {
    width: 18,  
    height: 18,
    tintColor: '#86868B',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEAEA',
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  activeTab: { 
    borderBottomWidth: 3, 
    borderColor: '#1D7CE4' 
  },
  tabText: { 
    color: '#000', 
    fontSize: 14 
  },
  activeTabText: { 
    fontWeight: 'bold' 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  albumsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#86868B',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  // Empty State Styles - Premium UX/UI Design (matching Solicitudes)
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 60,
    marginTop: 0,
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
    paddingHorizontal: 16,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    letterSpacing: -0.2,
    maxWidth: 240,
    paddingHorizontal: 16,
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
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  addButton2: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    zIndex: 1000,
  },
  imageCreate: {
    width: 32,
    height: 32,
  },
});

export default Album;
