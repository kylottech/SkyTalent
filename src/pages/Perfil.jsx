import React, { useEffect, useState, useRef, useCallback  } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, RefreshControl, Modal, TouchableWithoutFeedback, Dimensions, Animated } from 'react-native';
import GradientButton from '../components/Utils/GradientButton';
import PremiumImageViewer from '../components/Utils/PremiumImageViewer';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { myInfo, removeHistory, getContactPrivacity } from '../services/profileService';
import { getMinInfo, city } from '../services/mapsService';
import { Linking } from 'react-native';
import { formatString } from '../utils/formatString'
import LocationInfo from '../components/Maps/LocationInfo';
import Top from '../components/Utils/Top';
import MapContainer from '../components/Maps/MapContainer';
import Publicacion from '../components/Utils/PublicacionesFotos';
import TextLine from '../components/Utils/TextLine';
import Loader from '../components/Utils/Loader';
import Error from '../components/Utils/Error';
import ExperienceBar from '../components/Utils/ExperienceBar';
import TrickDetail from '../components/Blocks/Community/TrickDetail';
import AdviceDetail from '../components/Blocks/Community/AdviceDetail';
import { CommentsModal } from '../components/wallet/Experiences/Modals/Comments';
import verificado from '../../assets/verificado.png'
import tickBlanco from '../../assets/tickBlanco.png'
import preguntasIcono from '../../assets/preguntasIcono.png'
import instagramIcon from '../../assets/instagram.png';
import tiktokIcon from '../../assets/tiktok.png';
import whatsappIcon from '../../assets/whatsapp.png';

const { width: screenWidth } = Dimensions.get('window');


const Perfil = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts, translateTag } = useUser();
  const screenTexts = texts.pages.Perfil
  const dataRef = useRef({ name, surname, kylotId, cargo, frase })   
  const [cargando, setCargando] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false)
  const [opcion, setOpcion] = useState(1);
  const [_id, set_id] = useState('');
  const [idComments, setIdComments] = useState('');
  const [photo, setPhoto] = useState('');
  const [banner, setBanner] = useState('');
  const [cargo, setCargo] = useState('');
  const [frase, setFrase] = useState('');
  const [histories, setHistories] = useState([]);
  const [kylotId, setKylotId] = useState('');
  const [locations, setLocations] = useState([]);
  const [ciudad, setCiudad] = useState('');
  const [pais, setPais] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [numFollowed, setNumFollowed] = useState(0);
  const [numFollowers, setNumFollowers] = useState(0);
  const [numEventos, setNumEventos] = useState(0);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [experiencia, setExperiencia] = useState(0);
  const [community, setCommunity] = useState([]);
  const [topCities, setTopCities] = useState([]);
  const [topCountries, setTopCountries] = useState([]);
  const [topContacts, setTopContacts] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [reputation, setReputation] = useState({ score: 0, level: 0 });
  const [statistics, setStatistics] = useState({});
  const [badges, setBadges] = useState([]);
  const [badgeFilter, setBadgeFilter] = useState('all');
  const [locationInfo, setLocationInfo] = useState({});
  const [locationBlocked, setLocationBlocked] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [photoOptionsVisible, setPhotoOptionsVisible] = useState(false);
  const [photoOptionsIndex, setPhotoOptionsIndex] = useState(null);
  const [instagram, setInstagram]=useState('')
  const [tikTok, setTikTok]=useState('')
  const [whatsapp, setWhatsapp]=useState('')
  const [earlyKylers, setEarlyKylers]=useState(false)
  const [isPrivate, setIsPrivate] = useState(false)
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [comentsModal, setComentsModal] = useState(false);
  const [tag1, setTag1] = useState({});
  const [tag2, setTag2] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleCity = async (current) => {
  
      try {
          city(current, logout)
          .then((res) => {
              setCiudad(res.city)
              setPais(res.country)
          })
          .catch((error) => {
              setError(true);
              setErrorMessage(error.message);
          });
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
      }

  }

  async function getLocationPermission(){
      let {status} = await Location.requestForegroundPermissionsAsync()

      if(status !== 'granted'){
          setError(true);
          setErrorMessage(screenTexts.PermissionError);
          return
      }
      else{
          let location = await Location.getCurrentPositionAsync({})
          const current = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
          }
          handleCity(current)
      }
  }

  useEffect(() => {
    getLocationPermission()
  
  },[])

  // Continuous scroll animation - never stops
  useEffect(() => {
    const startContinuousAnimation = () => {
      // Start from right side
      scrollX.setValue(screenWidth);
      
      // Move completely off screen to the left
      const endPosition = -screenWidth - 200;
      
      Animated.loop(
        Animated.timing(scrollX, {
          toValue: endPosition,
          duration: 6000, // Slower, more readable movement
          useNativeDriver: true,
        }),
        { resetBeforeIteration: true }
      ).start();
    };

    if (frase && frase.trim() !== '') {
      startContinuousAnimation();
    }
  }, [frase]);

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  
  const handleGetMinInfo = async (_id) => {
    try {
      getMinInfo(_id, logout)
        .then((response) => {
          if (response) {
            setLocationInfo(response)
            setLocationBlocked(response.locationBlocked)
            setInfoVisible(true)
          }
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleDeleteHistory = async () => {
    if (loading) return;
    setLoading(true);
    try {
      // photoOptionsIndex es el índice de la foto en la UI (el que almacenaste en el long press)
      await removeHistory(photoOptionsIndex, logout, setErrorMessage);
      setPhotoOptionsVisible(false);
      // Recarga info desde backend
      handleInfo();
    } catch (e) {
      setError(true);
      setErrorMessage(e?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInfo = async () => {
    try {
      myInfo(logout)
        .then((response) => {
          set_id(response._id)
          setPhoto(response.avatar.url)
          setCargo(response.cargo)
          setFrase(response.frase)
          setHistories(transformHistories(response.histories))
          setKylotId(response.kylotId)
          setLocations(transformLocation(response.myPlaces))
          setName (response.name)
          setSurname(response.surname)
          setNumFollowed(response.numFollowed)
          setNumFollowers(response.numFollowers)
          // setNumEventos(response.numEventos || 0) // TODO: Backend - Descomentar cuando el backend proporcione numEventos
          setCommunity(response.community)
          // Calcular interacciones totales (likes de todas las publicaciones)
          const totalLikes = response.community?.reduce((total, item) => total + (item.likes || 0), 0) || 0
          setTotalInteractions(totalLikes)
          // setNivel(response.nivel || 1) // TODO: Backend - Descomentar cuando el backend proporcione nivel
          // setExperiencia(response.experiencia || 0) // TODO: Backend - Descomentar cuando el backend proporcione experiencia
          // setTopCities(response.topCities || []) // TODO: Backend - Descomentar cuando el backend proporcione topCities
          // setTopCountries(response.topCountries || []) // TODO: Backend - Descomentar cuando el backend proporcione topCountries
          // setTopContacts(response.topContacts || []) // TODO: Backend - Descomentar cuando el backend proporcione topContacts
          // setAchievements(response.achievements || []) // TODO: Backend - Descomentar cuando el backend proporcione achievements
          // setReputation(response.reputation || { score: 0, level: 0 }) // TODO: Backend - Descomentar cuando el backend proporcione reputation
          // setStatistics(response.statistics || {}) // TODO: Backend - Descomentar cuando el backend proporcione statistics
          // setBadges(response.badges || []) // TODO: Backend - Descomentar cuando el backend proporcione badges
          setBanner(response.banner.url)
          setEarlyKylers(response.earlyKylers)
          setTag1(translateTag(response.tags[0] || {category: ''}))
          setTag2(translateTag(response.tags[1] || {category: ''}))
          setWhatsapp(response.whatsapp)
          setTikTok(response.tiktok)
          setInstagram(response.instagram)
          setCargando(true)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message)
    }
  
  };

  const handlePrivacyInfo = async () => {
    try {
      getContactPrivacity(logout)
        .then((response) => {
          setIsPrivate(response)
        })
        .catch((error) => {
          console.log('Error getting privacy info:', error);
        });
    } catch (error) {
      console.log('Error getting privacy info:', error);
    }
  };

  const transformHistories = (data) => {
    return data.map(item => ({
      uri: item.url, // Asumiendo que cada historia tiene una propiedad `url`
    }));
  };
  
  const transformLocation = (data) => {
    return data.map(item => {
      // Si la propiedad `coordinates` existe, transformarla
      if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
        return {
          _id: item._id,
          location: {
            latitude: item.location.coordinates[1], // Asumimos que el primer valor de `coordinates` es el `longitude`
            longitude: item.location.coordinates[0] // Y el segundo es el `latitude`
          }
        };
      }
      return item; // Si no hay coordenadas, devolver el objeto tal como está
    });
  };

  useEffect(() => {
    
    handleInfo()
    handlePrivacyInfo()
    
  },[])

  useEffect(() => {
    dataRef.current = { name, surname, kylotId, cargo, frase };
  }, [name, surname, kylotId, cargo, frase])

  const onRefresh = useCallback(async () => {
      setRefreshing(true);
      setInfoVisible(false)
      setModalVisible(false)
      setOpcion(1)
      setSelectedImageIndex(0)
      setError(false)
      setComentsModal(false)
      await Promise.all(
        handleInfo()
      );
      setRefreshing(false);
    }, []);

  return (
    <View style={styles.container}>

      <Top 
        left={true}
        leftType={'Buzon'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
        right={true}
        rightType={'Profile'}
        name= {name}
        surname = {surname}
        kylotId = {kylotId}
        photo = {photo}
        cargo = {cargo}
        frase = {frase}
        instagram = {instagram}
        tikTok = {tikTok}
        whatsapp={whatsapp}
        banner={banner}
        cargando={cargando}
        setName = {setName}
        setSurname = {setSurname}
        setKylotId = {setKylotId}
        setPhoto = {setPhoto}
        setCargo = {setCargo}
        setFrase = {setFrase}
        setInstagram = {setInstagram}
        setTikTok = {setTikTok}
        setWhatsapp = {setWhatsapp}
        setBanner={setBanner}
      />

        {!cargando &&
          <View style={styles.loaderContainer}>
            <Loader/>
          </View>
          
        }

      <ScrollView
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
        scrollEventThrottle={16}
      >

        

        { cargando &&
          <>
          {/* Continuous Scroll Banner Section */}
          {frase && frase.trim() !== '' && (
            <View style={styles.scrollBannerContainer}>
              <LinearGradient
                colors={['#7C3AED', '#A855F7', '#7C3AED']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBanner}
              >
                <Animated.Text 
                  style={[
                    styles.scrollBannerText,
                    {
                      transform: [{ translateX: scrollX }]
                    }
                  ]}
                >
                  {frase}
                </Animated.Text>
              </LinearGradient>
            </View>
          )}

          {/* Main Banner Section */}
          <View style={styles.bannerContainer}>
            <Image source={ {uri: banner} } style={styles.bannerImage}/>
            <View style={styles.bannerOverlay} />
            <View style={styles.profilePictureContainer}>
              <Image source={{ uri: photo }} style={styles.profilePicture}/>
              {earlyKylers && (
                <View style={styles.verifiedBadge}>
                  <Image source={verificado} style={styles.verifiedIcon}/>
                </View>
              )}
            </View>
          </View>

          {/* User Info Section */}
          <View style={styles.userInfoSection}>
            <Text style={styles.userName}>{name + ' ' + surname}</Text>
            <Text style={styles.userHandle}>@{kylotId}</Text>
            <Text style={styles.userLocation}>{ciudad}, {pais}</Text>
            
            {/* Privacy Indicator */}
            <View style={styles.privacyIndicator}>
              <View style={[styles.privacyDot, isPrivate && styles.privateDot]} />
              <Text style={styles.privacyText}>
                {isPrivate ? 'Perfil privado' : 'Perfil público'}
              </Text>
            </View>
          </View>

          {/* Minimalist Metrics Section */}
          <View style={styles.minimalistMetricsSection}>
            <View style={styles.metricsContainer}>
              <View style={styles.metricColumn}>
                <Text style={styles.metricNumber}>{numEventos}</Text>
                <Text style={styles.metricLabel}>{screenTexts.EventsText}</Text>
              </View>
              
              <View style={styles.metricsDivider} />
              
              <TouchableOpacity style={styles.metricColumn} onPress={()=> navigate.navigate('ListaSeguidores', {_id: _id})}>
                <Text style={styles.metricNumber}>{numFollowers}</Text>
                <Text style={styles.metricLabel}>{formatString(screenTexts.FollowersText, { variable1: numFollowers }).replace(`${numFollowers} `, '')}</Text>
            </TouchableOpacity>
              
              <View style={styles.metricsDivider} />
              
              <TouchableOpacity style={styles.metricColumn} onPress={()=> navigate.navigate('ListaSiguiendo', {_id: _id})}>
                <Text style={styles.metricNumber}>{numFollowed}</Text>
                <Text style={styles.metricLabel}>{formatString(screenTexts.FollowingText, { variable1: numFollowed }).replace(`${numFollowed} `, '')}</Text>
            </TouchableOpacity>
            
              <View style={styles.metricsDivider} />
              
              <View style={styles.metricColumn}>
                <Text style={styles.metricNumber}>{totalInteractions}</Text>
                <Text style={styles.metricLabel}>{screenTexts.InteractionsText}</Text>
          </View>
            </View>
          </View>

          {/* Experience Bar Section */}
          <ExperienceBar nivel={nivel} experiencia={experiencia} />
          
          {/* Community Section */}
          {community && community.length > 0 && (
            <View style={styles.communitySection}>
              <Text style={styles.communityTitle}>Comunidad</Text>
              <View style={styles.communityContainer}>
                <View style={styles.communityAvatars}>
                  {community.slice(0, 3).map((user, index) => (
                    <Image
                      key={user._id}
                      source={{ uri: user.photo || user.avatar?.url }}
                      style={[styles.communityAvatar, { zIndex: 3 - index }]}
                    />
                  ))}
          </View>
                <Text style={styles.communityText}>
                  {community[0]?.name || 'usuario'} y {community.length - 1} más
                </Text>
          </View>
            </View>
          )}

          {/* Social Media Links */}
          <View style={styles.socialMediaSection}>
            {whatsapp !== '' && (
              <TouchableOpacity onPress={() => Linking.openURL(whatsapp)} style={styles.socialButton}>
                <Image source={whatsappIcon} style={styles.socialIcon} />
              </TouchableOpacity>
            )}
            {instagram !== '' && (
              <TouchableOpacity onPress={() => Linking.openURL(instagram)} style={styles.socialButton}>
                <Image source={instagramIcon} style={styles.socialIcon} />
              </TouchableOpacity>
            )}
            {tikTok !== '' && (
              <TouchableOpacity onPress={() => Linking.openURL(tikTok)} style={styles.socialButton}>
                <Image source={tiktokIcon} style={styles.socialIcon} />
              </TouchableOpacity>
            )}
          </View>

          {/* Simple Description Header */}
          <View style={styles.simpleDescriptionSection}>
            <View style={styles.descriptionHeader}>
              <View style={styles.descriptionTitleContainer}>
                <Text style={styles.descriptionTitle}>Sobre mí</Text>
                <Text style={styles.descriptionSubtitle}>Mi estilo de vida</Text>
              </View>
              <TouchableOpacity 
                style={styles.editDescriptionButton}
                onPress={() => navigate.navigate('Preguntas', {userInfo: {name: name + ' ' + surname, kylotId: kylotId, avatar: photo, _id: _id}})}
              >
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.editButtonGradient}
                >
                  <Image source={preguntasIcono} style={styles.editButtonIcon} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
            
            {/* Questions Horizontal Scroll */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.questionsScrollContainer}
              contentContainerStyle={styles.questionsScrollContent}
            >
              {[
                { id: 1, question: "¿Cuál es tu lugar favorito?", answer: "Madrid" },
                { id: 2, question: "¿Qué te gusta hacer?", answer: "Salir con amigos" },
                { id: 3, question: "¿Tu comida favorita?", answer: "Paella" },
                { id: 4, question: "¿Afición principal?", answer: "Fútbol" },
                { id: 5, question: "¿Música preferida?", answer: "Indie" },
                { id: 6, question: "¿Deporte favorito?", answer: "Fútbol" }
              ].map((item) => (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.questionCardHorizontal}
                  onPress={() => {
                    // Navigate to question detail or edit
                    console.log('Question pressed:', item.id);
                  }}
                >
                  <View style={styles.questionContent}>
                    <Text style={styles.questionText}>{item.question}</Text>
                    <Text style={styles.answerText}>{item.answer}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Tags Section */}
          <View style={styles.tagsSection}>
            {cargo && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{cargo}</Text>
              </View>
            )}
            {tag1.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{tag1.category}</Text>
              </View>
            )}
            {tag2.category && (
              <View style={styles.tag}>
                <Text style={styles.tagText}>{tag2.category}</Text>
              </View>
            )}
          </View>

          {/* Most Visited Cities Section */}
          {(topCities && topCities.length > 0) && (
            <View style={styles.locationTagsSection}>
              <Text style={styles.locationSectionTitle}>{screenTexts.MostVisitedCities}</Text>
              <View style={styles.tagsContainer}>
                {topCities.map((city, index) => (
                  <View key={index} style={styles.locationTag}>
                    <Text style={styles.locationTagText}>
                      {city.name}
                      {city.visitCount && ` (${formatString(screenTexts.VisitCount, { variable1: city.visitCount })})`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Most Visited Countries Section */}
          {(topCountries && topCountries.length > 0) && (
            <View style={styles.locationTagsSection}>
              <Text style={styles.locationSectionTitle}>{screenTexts.MostVisitedCountries}</Text>
              <View style={styles.tagsContainer}>
                {topCountries.map((country, index) => (
                  <View key={index} style={styles.locationTag}>
                    <Text style={styles.locationTagText}>
                      {country.name}
                      {country.visitCount && ` (${formatString(screenTexts.VisitCount, { variable1: country.visitCount })})`}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Content Navigation Tabs */}
          <View style={styles.contentTabsContainer}>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.contentTabsScrollContent}
            >
              <View style={styles.contentTabs}>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(1)}
              >
              {opcion === 1 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {formatString(screenTexts.PostMenu, { variable1: community.length })}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {formatString(screenTexts.PostMenu, { variable1: community.length })}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(2)}
              >
              {opcion === 2 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {formatString(screenTexts.PhotosMenu, { variable1: histories.length })}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {formatString(screenTexts.PhotosMenu, { variable1: histories.length })}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
            onPress={() => setOpcion(3)}
            >
              {opcion === 3 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {formatString(screenTexts.LocationsMenu, { variable1: locations.length })}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {formatString(screenTexts.LocationsMenu, { variable1: locations.length })}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(4)}
            >
              {opcion === 4 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {screenTexts.AchievementsMenu}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {screenTexts.AchievementsMenu}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(5)}
            >
              {opcion === 5 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {screenTexts.ReputationMenu}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {screenTexts.ReputationMenu}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(6)}
            >
              {opcion === 6 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {screenTexts.StatisticsMenu}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {screenTexts.StatisticsMenu}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(7)}
            >
              {opcion === 7 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {screenTexts.TopContactsMenu}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {screenTexts.TopContactsMenu}
                </Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.tab}
              onPress={() => setOpcion(8)}
            >
              {opcion === 8 ? (
                <LinearGradient
                  colors={['#7C3AED', '#A855F7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabGradient}
                >
                  <Text style={styles.activeTabText}>
                    {screenTexts.TabBadges}
                  </Text>
                  <View style={styles.tabIndicator} />
                </LinearGradient>
              ) : (
                <Text style={styles.tabText}>
                  {screenTexts.TabBadges}
                </Text>
              )}
            </TouchableOpacity>
              </View>
            </ScrollView>
          </View>

          { opcion === 1 && (
            <View>
              {community.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                {screenTexts.EmptyPosts}
              </Text>
                  <TouchableOpacity 
                    style={styles.createButton} 
                    onPress={() => navigate.navigate('Create')}
                  >
                    <LinearGradient
                      colors={['#004999', '#1D7CE4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.createButtonGradient}
                    >
                      <Text style={styles.createButtonText}>Crear publicación</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.photosContainer}>
                {community.map((item) => {
                  switch (item.type) {
                    case 'Tricks':
                      return (
                        <TrickDetail 
                          key={item._id} 
                          _id={item._id}
                          creatorInfo={item.creatorInfo} 
                          descripcion={item.descripcion} 
                          liked={item.liked} 
                          likes={item.likes} 
                          titulo={item.titulo} 
                          multimedia={item.multimedia}
                          setComentsModal={() => setComentsModal(true)}
                          setId={() => setIdComments(item._id)}
                        />
                      );

                    case 'Advice':
                      return (
                        <AdviceDetail 
                          key={item._id} 
                          _id={item._id}
                          creatorInfo={item.creatorInfo} 
                          descripcion={item.descripcion} 
                          liked={item.liked} 
                          likes={item.likes} 
                          titulo={item.titulo} 
                          multimedia={item.multimedia}
                          setComentsModal={() => setComentsModal(true)}
                          setId={() => setIdComments(item._id)}
                        />
                      );

                    default:
                      return null;
                  }
                })}

                </View>
              )}
            </View>
          )}
          {opcion === 2 && (
            <View style={styles.simplePhotosContainer}>
              {histories.length === 0 ? (
                <View style={styles.modernEmptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Text style={styles.emptyIcon}>📸</Text>
                  </View>
                  <Text style={styles.modernEmptyTitle}>Comparte tu mundo</Text>
                  <Text style={styles.modernEmptySubtitle}>
                    Captura momentos únicos y compártelos con tu comunidad
                </Text>
                  <TouchableOpacity 
                    style={styles.modernCreateButton} 
                    onPress={() => navigate.navigate('Camera')}
                  >
                    <LinearGradient
                      colors={['#004999', '#1D7CE4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.modernCreateButtonGradient}
                    >
                      <Text style={styles.modernCreateButtonText}>Crear contenido</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.simpleGalleryContainer}>
                  {histories.map((imageSource, index) => (
                    <TouchableOpacity 
                      key={index}
                      style={styles.simpleImageCard}
                      onPress={() => openModal(index)}
                    >
                      <Image source={imageSource} style={styles.simpleImage} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          )}

          { opcion === 3 && (
            <View>
              {locations.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                    {screenTexts.EmptyLocations || 'No tienes lugares guardados'}
                  </Text>
                  <TouchableOpacity 
                    style={styles.createButton} 
                    onPress={() => navigate.navigate('GlobeScreen')}
                  >
                    <LinearGradient
                      colors={['#004999', '#1D7CE4']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.createButtonGradient}
                    >
                      <Text style={styles.createButtonText}>Explorar mundo</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
            <View style={styles.mapaContainer}>
              <MapContainer 
                origin={{latitude:40.248198, longitude:-3.725757}} 
                type={'View'} 
                ciudad={'Madrid'}
                locations= {locations}
                onPress={handleGetMinInfo}
                setError={setError} 
                setErrorMessage={setErrorMessage}
              />

              { infoVisible &&
                <View style={styles.infoContainer}>
                <LocationInfo 
                  close={() => setInfoVisible(false)} 
                  expand={() => navigate.navigate('Place', {locationInfo: locationInfo, setLocationBlocked: setLocationBlocked})}
                  info = {locationInfo}
                  locationBlocked = {locationBlocked} 
                />
                </View>
              }
            </View>
              )}

            {/* Location Metrics */}
            <View style={styles.locationMetricsSection}>
              <View style={styles.locationMetricsContainer}>
                <View style={styles.locationMetricColumn}>
                  <Text style={styles.locationMetricNumber}>{locations.length}</Text>
                  <Text style={styles.locationMetricLabel}>Lugares guardados</Text>
                </View>
                
                <View style={styles.locationMetricsDivider} />
                
                <View style={styles.locationMetricColumn}>
                  <Text style={styles.locationMetricNumber}>{locations.filter(loc => loc.visited).length}</Text>
                  <Text style={styles.locationMetricLabel}>Visitados</Text>
                </View>
              </View>
            </View>
            </View>
          )}

          {opcion === 4 && (
            <View style={styles.achievementsTabContainer}>
              <View style={styles.achievementsSection}>
                <Text style={styles.achievementsTitle}>{screenTexts.AchievementsTitle}</Text>
                {achievements && achievements.length > 0 ? (
                  <View style={styles.achievementsListContainer}>
                    {achievements.map((achievement, index) => {
                      const currentProgress = achievement.currentProgress || 0;
                      const targetProgress = achievement.targetProgress || 1;
                      const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
                      const isUnlocked = achievement.unlocked || progressPercentage >= 100;
                      
                      return (
                        <TouchableOpacity
                          key={achievement.id || index}
                          style={[styles.achievementCard, !isUnlocked && styles.achievementCardLocked]}
                          activeOpacity={0.9}
                        >
                          <LinearGradient
                            colors={isUnlocked ? ['#7C3AED', '#A855F7'] : ['#2D1B4E', '#3D2B5E']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.achievementCardGradient}
                          >
                            <View style={styles.achievementCardContent}>
                              <View style={styles.achievementHeader}>
                                <Text style={styles.achievementCardTitle}>
                                  {achievement.name || 'Logro'}
                                </Text>
                                {isUnlocked && (
                                  <View style={styles.achievementUnlockedBadge}>
                                    <Text style={styles.achievementUnlockedText}>✓</Text>
                                  </View>
                                )}
                              </View>
                              
                              <Text style={styles.achievementDescription}>
                                {achievement.description || 'Descripción del logro'}
                              </Text>
                              
                              <View style={styles.achievementProgressContainer}>
                                <View style={styles.achievementProgressHeader}>
                                  <Text style={styles.achievementProgressLabel}>
                                    {screenTexts.AchievementProgress}
                                  </Text>
                                  <Text style={styles.achievementProgressValue}>
                                    {currentProgress} / {targetProgress}
                                  </Text>
                                </View>
                                
                                <View style={styles.achievementProgressBarBackground}>
                                  <LinearGradient
                                    colors={isUnlocked ? ['#A855F7', '#7C3AED'] : ['#4A3A6E', '#3D2B5E']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={[styles.achievementProgressBarFill, { width: `${progressPercentage}%` }]}
                                  />
                                </View>
                              </View>
                              
                              <View style={styles.achievementFooter}>
                                <View style={styles.achievementXPBadge}>
                                  <Text style={styles.achievementXPText}>
                                    {formatString(screenTexts.AchievementXP, { variable1: achievement.xpReward || 0 })}
                                  </Text>
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ) : (
                  <View style={styles.emptyAchievementsContainer}>
                    <Text style={styles.emptyAchievementsText}>{screenTexts.AchievementsEmpty}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {opcion === 5 && (
            <View style={styles.reputationTabContainer}>
              <View style={styles.reputationSection}>
                <View style={styles.reputationHeader}>
                  <Text style={styles.reputationTitle}>{screenTexts.ReputationTitle}</Text>
                  <View style={styles.reputationBadge}>
                    <Text style={styles.reputationBadgeText}>
                      {formatString(screenTexts.ReputationLevel, { variable1: reputation.level || 0 })}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reputationDescription}>{screenTexts.ReputationDescription}</Text>
                <View style={styles.reputationScoreContainer}>
                  <View style={styles.reputationScoreItem}>
                    <Text style={styles.reputationScoreLabel}>{screenTexts.ReputationScore}</Text>
                    <Text style={styles.reputationScoreValue}>{reputation.score || 0}</Text>
                  </View>
                  <View style={styles.reputationScoreDivider} />
                  <View style={styles.reputationScoreItem}>
                    <Text style={styles.reputationScoreLabel}>{screenTexts.ReputationLevel}</Text>
                    <Text style={styles.reputationScoreValue}>{reputation.level || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {opcion === 6 && (
            <View style={styles.statisticsTabContainer}>
              <View style={styles.statisticsSection}>
                <Text style={styles.statisticsTitle}>{screenTexts.StatisticsTitle}</Text>
                {statistics && Object.keys(statistics).length > 0 ? (
                  <View style={styles.statisticsGrid}>
                    {statistics.totalPosts !== undefined && (
                      <View style={styles.statisticCard}>
                        <Text style={styles.statisticValue}>{statistics.totalPosts || 0}</Text>
                        <Text style={styles.statisticLabel}>{screenTexts.TotalPosts}</Text>
                      </View>
                    )}
                    {statistics.totalLikes !== undefined && (
                      <View style={styles.statisticCard}>
                        <Text style={styles.statisticValue}>{statistics.totalLikes || 0}</Text>
                        <Text style={styles.statisticLabel}>{screenTexts.TotalLikes}</Text>
                      </View>
                    )}
                    {statistics.totalComments !== undefined && (
                      <View style={styles.statisticCard}>
                        <Text style={styles.statisticValue}>{statistics.totalComments || 0}</Text>
                        <Text style={styles.statisticLabel}>{screenTexts.TotalComments}</Text>
                      </View>
                    )}
                    {statistics.totalShares !== undefined && (
                      <View style={styles.statisticCard}>
                        <Text style={styles.statisticValue}>{statistics.totalShares || 0}</Text>
                        <Text style={styles.statisticLabel}>{screenTexts.TotalShares}</Text>
                      </View>
                    )}
                    {statistics.averageRating !== undefined && (
                      <View style={styles.statisticCard}>
                        <Text style={styles.statisticValue}>{statistics.averageRating?.toFixed(1) || '0.0'}</Text>
                        <Text style={styles.statisticLabel}>{screenTexts.AverageRating}</Text>
                      </View>
                    )}
                    {statistics.completionRate !== undefined && (
                      <View style={styles.statisticCard}>
                        <Text style={styles.statisticValue}>{statistics.completionRate || 0}%</Text>
                        <Text style={styles.statisticLabel}>{screenTexts.CompletionRate}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View style={styles.emptyStatisticsContainer}>
                    <Text style={styles.emptyStatisticsText}>{screenTexts.StatisticsEmpty}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {opcion === 7 && (
            <View style={styles.topContactsTabContainer}>
              <View style={styles.topContactsSection}>
                <Text style={styles.topContactsTitle}>{screenTexts.TopContacts}</Text>
                {topContacts && topContacts.length > 0 ? (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.topContactsScrollContent}
                  >
                    {topContacts.map((contact, index) => (
                      <TouchableOpacity
                        key={contact._id || index}
                        style={styles.topContactCard}
                        onPress={() => {
                          // TODO: Navigate to contact profile
                          // navigate.navigate('OtroPerfil', { _id: contact._id })
                        }}
                        activeOpacity={0.7}
                      >
                        <Image 
                          source={{ uri: contact.photo || contact.avatar?.url }} 
                          style={styles.topContactAvatar}
                        />
                        <Text style={styles.topContactName} numberOfLines={1}>
                          {contact.name || 'Usuario'}
                        </Text>
                        {contact.kylotId && (
                          <Text style={styles.topContactHandle} numberOfLines={1}>
                            @{contact.kylotId}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyContactsContainer}>
                    <Text style={styles.emptyContactsText}>{screenTexts.TopContactsEmpty}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {opcion === 8 && (
            <View style={styles.badgesTabContainer}>
              <View style={styles.badgesSection}>
                <Text style={styles.badgesTitle}>{screenTexts.BadgesTitle}</Text>
                
                {/* Statistics Cards */}
                <View style={styles.badgesStatsContainer}>
                  <View style={styles.badgeStatCard}>
                    <Text style={styles.badgeStatNumber}>
                      {badges.filter(b => b.unlocked).length}
                    </Text>
                    <Text style={styles.badgeStatLabel}>{screenTexts.BadgesEarned}</Text>
                  </View>
                  <View style={styles.badgeStatCard}>
                    <Text style={styles.badgeStatNumber}>{badges.length || 10}</Text>
                    <Text style={styles.badgeStatLabel}>{screenTexts.BadgesTotalAvailable}</Text>
                  </View>
                  <View style={styles.badgeStatCard}>
                    <Text style={styles.badgeStatNumber}>
                      {badges.length > 0 ? Math.round((badges.filter(b => b.unlocked).length / badges.length) * 100) : 0}%
                    </Text>
                    <Text style={styles.badgeStatLabel}>{screenTexts.BadgesCompleted}</Text>
                  </View>
                </View>

                {/* Internal Tabs for Badges */}
                <View style={styles.badgesInternalTabs}>
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.badgesInternalTabsContent}
                  >
                    <TouchableOpacity 
                      style={[styles.badgeInternalTab, badgeFilter === 'all' && styles.badgeInternalTabActive]}
                      onPress={() => setBadgeFilter('all')}
                    >
                      <Text style={[styles.badgeInternalTabText, badgeFilter === 'all' && styles.badgeInternalTabTextActive]}>
                        {screenTexts.BadgesTabAll}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.badgeInternalTab, badgeFilter === 'events' && styles.badgeInternalTabActive]}
                      onPress={() => setBadgeFilter('events')}
                    >
                      <Text style={[styles.badgeInternalTabText, badgeFilter === 'events' && styles.badgeInternalTabTextActive]}>
                        {screenTexts.BadgesTabEvents}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.badgeInternalTab, badgeFilter === 'social' && styles.badgeInternalTabActive]}
                      onPress={() => setBadgeFilter('social')}
                    >
                      <Text style={[styles.badgeInternalTabText, badgeFilter === 'social' && styles.badgeInternalTabTextActive]}>
                        {screenTexts.BadgesTabSocial}
                      </Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>

                {/* Badges List */}
                {badges && badges.length > 0 ? (
                  <View style={styles.badgesListContainer}>
                    {badges
                      .filter(badge => {
                        if (badgeFilter === 'all') return true;
                        if (badgeFilter === 'events') return badge.category === 'events';
                        if (badgeFilter === 'social') return badge.category === 'social';
                        return true;
                      })
                      .map((badge, index) => {
                        const currentProgress = badge.currentProgress || 0;
                        const targetProgress = badge.targetProgress || 1;
                        const progressPercentage = Math.min((currentProgress / targetProgress) * 100, 100);
                        const isUnlocked = badge.unlocked || progressPercentage >= 100;
                        
                        return (
                          <TouchableOpacity
                            key={badge.id || index}
                            style={styles.badgeCard}
                            activeOpacity={0.9}
                          >
                            <LinearGradient
                              colors={isUnlocked ? ['#7C3AED', '#A855F7'] : ['#2D1B4E', '#3D2B5E']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.badgeCardGradient}
                            >
                              {isUnlocked && (
                                <View style={styles.badgeCompletedStar}>
                                  <Text style={styles.badgeStarIcon}>⭐</Text>
                                </View>
                              )}
                              <View style={styles.badgeCardContent}>
                                <View style={styles.badgeIconContainer}>
                                  <Text style={styles.badgeIcon}>{badge.icon || '🏆'}</Text>
                                </View>
                                <Text style={styles.badgeCardTitle}>
                                  {badge.name || 'Badge'}
                                </Text>
                                <Text style={styles.badgeCardDescription}>
                                  {badge.description || 'Descripción del badge'}
                                </Text>
                                
                                {!isUnlocked && (
                                  <View style={styles.badgeProgressContainer}>
                                    <Text style={styles.badgeProgressLabel}>
                                      {screenTexts.AchievementProgress} {currentProgress}/{targetProgress}
                                    </Text>
                                    <View style={styles.badgeProgressBarBackground}>
                                      <LinearGradient
                                        colors={['#4A3A6E', '#3D2B5E']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.badgeProgressBarFill, { width: `${progressPercentage}%` }]}
                                      />
                                    </View>
                                  </View>
                                )}
                                
                                <View style={styles.badgeXPContainer}>
                                  <Text style={styles.badgeXPText}>
                                    {formatString(screenTexts.AchievementXP, { variable1: badge.xpReward || 0 })}
                                  </Text>
                                </View>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        );
                      })}
                  </View>
                ) : (
                  <View style={styles.emptyBadgesContainer}>
                    <Text style={styles.emptyBadgesText}>{screenTexts.BadgesEmpty}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          <PremiumImageViewer
            images={histories}
            visible={modalVisible}
            initialIndex={selectedImageIndex}
            onClose={closeModal}
            onIndexChange={(index) => setSelectedImageIndex(index)}
            showUserInfo={true}
            userInfo={{
              name: name && surname ? `${name} ${surname}` : 'Usuario',
              avatar: photo || '',
              location: 'Ubicación',
              caption: histories[selectedImageIndex]?.caption || ''
            }}
          />
        </>

        }
      </ScrollView>

      <Modal
        transparent
        visible={photoOptionsVisible}
        animationType="fade"
        onRequestClose={() => setPhotoOptionsVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPhotoOptionsVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.optionBox}>
                <GradientButton
                  text={screenTexts.GradientButtonModal}
                  color="Blue"
                  onPress={handleDeleteHistory}
                />
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setPhotoOptionsVisible(false)}
                >
                  <Text style={styles.modalOptionText}>{screenTexts.CancelButtonModal}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CommentsModal 
        idComments={idComments} 
        isOpen={comentsModal} 
        onClose={() => setComentsModal(false)} 
        loading={loading}
        setLoading={setLoading}
      />
      {error &&

      <Error message={errorMessage} func={setError} />

      }

      
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingBottom: 250, // Espacio extra generoso para scroll completo
    minHeight: '100%', // Asegura que el contenido ocupe al menos toda la pantalla
  },
  loaderContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999,
    backgroundColor: 'white',
  },
  
  // Continuous Scroll Banner Section
  scrollBannerContainer: {
    height: 35,
    overflow: 'hidden',
    marginTop: 0,
    marginBottom: 0,
    borderRadius: 0,
  },
  gradientBanner: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollBannerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    whiteSpace: 'nowrap',
    includeFontPadding: false,
  },
  
  // Main Banner Section
  bannerContainer: {
    position: 'relative',
    height: 150,
    backgroundColor: '#F0F0F0',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  profilePictureContainer: {
    position: 'absolute',
    bottom: -50,
    left: screenWidth / 2 - 60,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white',
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  profilePicture: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
  },
  verifiedIconSmall: {
    width: 16,
    height: 16,
    marginLeft: 6,
  },

  // User Info Section
  userInfoSection: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  privacyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  privacyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  privateDot: {
    backgroundColor: '#FF3B30',
  },
  privacyText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  userHandle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  userLocation: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },

  // Clean Metrics Grid - Inspired by Right Image
  metricsSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
    minWidth: 80,
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  metricLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
    textAlign: 'center',
  },

  // Community Section
  communitySection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  communityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  communityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  communityAvatars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  communityAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    marginLeft: -8,
  },
  communityText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
    flex: 1,
  },

  // Social Media Section
  socialMediaSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },

  // Empty State Styles
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  createButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  createButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Gen Z Description Section
  genZDescriptionSection: {
    backgroundColor: 'transparent',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  genZDescriptionHeader: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  genZTitleContainer: {
    flex: 1,
  },
  genZTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  genZSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  genZQuestionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  genZQuestionIcon: {
    width: 18,
    height: 18,
    tintColor: '#1D7CE4',
  },
  genZDescriptionContent: {
    minHeight: 60,
  },
  genZTextContainer: {
    position: 'relative',
  },
  genZDescriptionText: {
    fontSize: 16,
    color: '#1A1A1A',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 16,
  },
  genZDecorativeLine: {
    height: 3,
    backgroundColor: 'linear-gradient(90deg, #004999 0%, #1D7CE4 100%)',
    borderRadius: 2,
    width: '60%',
    alignSelf: 'center',
  },
  genZEmptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  genZEmptyText: {
    fontSize: 15,
    color: '#8E8E93',
    marginBottom: 16,
    fontWeight: '500',
  },
  genZAddButton: {
    borderWidth: 2,
    borderColor: '#1D7CE4',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  genZAddButtonText: {
    color: '#1D7CE4',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  // Modern Photos Section - Instagram/TikTok Style
  modernPhotosContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modernEmptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  emptyIcon: {
    fontSize: 32,
  },
  modernEmptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modernEmptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  modernCreateButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modernCreateButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modernCreateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Modern Stories Section
  modernStoriesSection: {
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 8,
  },
  storiesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  storiesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  addStoryButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addStoryIcon: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  storiesScroll: {
    paddingLeft: 16,
  },
  storiesContent: {
    paddingRight: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#E5E5EA',
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },

  // Modern Grid Section
  modernGridSection: {
    backgroundColor: 'white',
    paddingTop: 16,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  gridTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  gridFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filterText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginRight: 4,
  },
  filterArrow: {
    fontSize: 12,
    color: '#8E8E93',
  },
  modernGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  modernGridItem: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.66%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  modernGridItemLarge: {
    width: '60%',
  },
  modernGridImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: 8,
    opacity: 0,
    transition: 'opacity 0.2s',
  },
  imageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  imageActionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageActionIcon: {
    fontSize: 14,
  },

  // Minimalist Metrics Section
  minimalistMetricsSection: {
    backgroundColor: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  metricColumn: {
    flex: 1,
    alignItems: 'center',
  },
  metricsDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 6,
  },
  metricNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 1,
  },
  metricLabel: {
    fontSize: 10,
    color: '#000000',
    fontWeight: '400',
  },


  // Gallery Section - Horizontal Collage
  gallerySection: {
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  galleryHeader: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  galleryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  galleryScroll: {
    paddingLeft: 16,
  },
  galleryContent: {
    paddingRight: 16,
  },
  collageContainer: {
    marginRight: 16,
  },
  collageImages: {
    flexDirection: 'row',
    width: 200,
    height: 100,
    borderRadius: 12,
    overflow: 'hidden',
  },
  collageImageContainer: {
    flex: 1,
    height: '100%',
  },
  collageImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyCollageImage: {
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },

  // Location Metrics Section
  locationMetricsSection: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  locationMetricsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  locationMetricColumn: {
    flex: 1,
    alignItems: 'center',
  },
  locationMetricsDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
  },
  locationMetricNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  locationMetricLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },

  // Description Section
  descriptionSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  questionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionIcon: {
    width: 18,
    height: 18,
    tintColor: 'white',
  },
  descriptionText: {
    fontSize: 15,
    color: '#3A3A3C',
    lineHeight: 22,
    fontWeight: '400',
  },

  // Tags Section
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E3F2FD',
  },
  tagText: {
    fontSize: 13,
    color: '#1D7CE4',
    fontWeight: '600',
  },

  // Most Visited Locations Section
  locationTagsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  locationSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  locationTag: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  locationTagText: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '500',
  },

  // Top Contacts Section
  topContactsTabContainer: {
    paddingTop: 16,
  },
  topContactsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  topContactsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  topContactsScrollContent: {
    paddingRight: 16,
  },
  topContactCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 90,
  },
  topContactAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F0F0F0',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  topContactName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 2,
  },
  topContactHandle: {
    fontSize: 11,
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyContactsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyContactsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },

  // Achievements Section
  achievementsTabContainer: {
    paddingTop: 16,
  },
  achievementsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    letterSpacing: -0.4,
  },
  achievementsListContainer: {
    gap: 16,
  },
  achievementCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  achievementCardLocked: {
    opacity: 0.7,
  },
  achievementCardGradient: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  achievementCardContent: {
    padding: 20,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  achievementCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    flex: 1,
    letterSpacing: -0.3,
  },
  achievementUnlockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  achievementUnlockedText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  achievementDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  achievementProgressContainer: {
    marginBottom: 12,
  },
  achievementProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  achievementProgressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  achievementProgressValue: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  achievementProgressBarBackground: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  achievementProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  achievementFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  achievementXPBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  achievementXPText: {
    fontSize: 13,
    fontWeight: '700',
    color: 'white',
  },
  emptyAchievementsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyAchievementsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },

  // Reputation Section
  reputationTabContainer: {
    paddingTop: 16,
  },
  reputationSection: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 24,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  reputationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reputationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  reputationBadge: {
    backgroundColor: '#7C3AED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reputationBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  reputationDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  reputationScoreContainer: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  reputationScoreItem: {
    flex: 1,
    alignItems: 'center',
  },
  reputationScoreDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
  },
  reputationScoreLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 4,
  },
  reputationScoreValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },

  // Statistics Section
  statisticsTabContainer: {
    paddingTop: 16,
  },
  statisticsSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  statisticsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  statisticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  statisticCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: '1%',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
  },
  statisticValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 6,
  },
  statisticLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  emptyStatisticsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyStatisticsText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },

  // Badges Section
  badgesTabContainer: {
    paddingTop: 16,
  },
  badgesSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  badgesTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  badgesStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginHorizontal: -4,
  },
  badgeStatCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7C3AED',
    marginBottom: 4,
  },
  badgeStatLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
  },
  badgesInternalTabs: {
    marginBottom: 20,
  },
  badgesInternalTabsContent: {
    paddingHorizontal: 4,
  },
  badgeInternalTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
  },
  badgeInternalTabActive: {
    backgroundColor: '#7C3AED',
  },
  badgeInternalTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  badgeInternalTabTextActive: {
    color: '#FFFFFF',
  },
  badgesListContainer: {
    gap: 16,
  },
  badgeCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  badgeCardGradient: {
    padding: 20,
    position: 'relative',
  },
  badgeCompletedStar: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 1,
  },
  badgeStarIcon: {
    fontSize: 24,
  },
  badgeCardContent: {
    alignItems: 'center',
  },
  badgeIconContainer: {
    marginBottom: 12,
  },
  badgeIcon: {
    fontSize: 48,
  },
  badgeCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  badgeCardDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  badgeProgressContainer: {
    width: '100%',
    marginBottom: 12,
  },
  badgeProgressLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    textAlign: 'center',
  },
  badgeProgressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  badgeProgressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  badgeXPContainer: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  badgeXPText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyBadgesContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  emptyBadgesText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },

  // Content Tabs
  contentTabsContainer: {
    marginBottom: 16,
  },
  contentTabsScrollContent: {
    paddingHorizontal: 16,
  },
  contentTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    minWidth: 90,
    alignItems: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 12,
    position: 'relative',
    marginRight: 4,
    overflow: 'hidden',
  },
  tabGradient: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  activeTabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  // Content Sections
  linea: {
    borderWidth: 0.5,
    borderColor: '#F2F2F7',
    marginVertical: 16,
  },
  textoPublicaciones: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 40,
    marginBottom: 24,
    color: '#8E8E93',
    lineHeight: 24,
  },
  photosContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },

  // Timeline Section
  timelineSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  timelineMore: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  timelineMoreText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  timelineScroll: {
    flexDirection: 'row',
  },
  timelineDays: {
    flexDirection: 'row',
    gap: 12,
  },
  timelineDay: {
    alignItems: 'center',
    minWidth: 60,
  },
  timelinePhotoContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  emptyTimelinePhoto: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
  },
  timelinePhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emptyDay: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  timelineDayLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Grid Section
  gridSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  gridSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  imageRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  imageItemContainer: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 1,
  },
  emptySpace: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: 'transparent',
  },
  mapaContainer: {
    marginBottom: 24,
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  infoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  closeButton: { 
    position: 'absolute', 
    top: 40, 
    right: 20, 
    zIndex: 1, 
    backgroundColor: 'rgba(0,0,0,0.6)', 
    padding: 10, 
    borderRadius: 20 
  },
  closeButtonText: { 
    color: 'white', 
    fontSize: 20, 
    fontWeight: 'bold' 
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center'
  },
  modalOption: {
    paddingVertical: 12,
    width: '100%',
    marginTop: 8
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: 'center',
  },

  // Simple Description Header Styles
  simpleDescriptionSection: {
    backgroundColor: 'white',
    marginHorizontal: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  descriptionTitleContainer: {
    flex: 1,
  },
  descriptionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  descriptionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  editDescriptionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
  },
  editButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },

  // Questions Horizontal Scroll Styles
  questionsScrollContainer: {
    marginTop: 16,
  },
  questionsScrollContent: {
    paddingRight: 16,
  },
  questionCardHorizontal: {
    width: 160,
    height: 220,
    marginRight: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 12,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  questionContent: {
    flex: 1,
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 16,
  },
  answerText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
    lineHeight: 18,
  },

  // Simple Gallery Format Styles
  simplePhotosContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  simpleGalleryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  simpleImageCard: {
    width: '48%',
    aspectRatio: 0.8,
    marginBottom: 16,
  },
  simpleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
});

export default Perfil;