import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView, RefreshControl, Dimensions, Animated } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import PremiumImageViewer from '../../components/Utils/PremiumImageViewer';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { otherInfo, moreFollow, lessFollow } from '../../services/profileService';
import { getMinInfo, city } from '../../services/mapsService';
import { formatString } from '../../utils/formatString'
import { Linking } from 'react-native';
import LocationInfo from '../../components/Maps/LocationInfo';
import Top from '../../components/Utils/Top';
import MapContainer from '../../components/Maps/MapContainer';
import Publicacion from '../../components/Utils/PublicacionesFotos';
import TextLine from '../../components/Utils/TextLine';
import Loader from '../../components/Utils/Loader';
import Error from '../../components/Utils/Error';
import TrickDetail from '../../components/Blocks/Community/TrickDetail';
import AdviceDetail from '../../components/Blocks/Community/AdviceDetail';
import { CommentsModal } from '../../components/wallet/Experiences/Modals/Comments';
import verificado from '../../../assets/verificado.png'
import preguntasIcono from '../../../assets/preguntasIcono.png'
import instagramIcon from '../../../assets/instagram.png';
import tiktokIcon from '../../../assets/tiktok.png';
import whatsappIcon from '../../../assets/whatsapp.png';

const { width: screenWidth } = Dimensions.get('window');

const OtroPerfil = ({route}) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts, translateTag } = useUser();
  const screenTexts = texts.pages.usuarios.OtroPerfil;
  const dataRef = useRef({});
  const [cargando, setCargando] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [opcion, setOpcion] = useState(1);
  const [_id, set_id] = useState('');
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
  const [community, setCommunity] = useState([]);
  const [locationInfo, setLocationInfo] = useState({});
  const [locationBlocked, setLocationBlocked] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [earlyKylers, setEarlyKylers]=useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [comentsModal, setComentsModal] = useState(false);
  const [idComments, setIdComments] = useState('');
  const [seguido, setSeguido] = useState(false);
  const [tag1, setTag1] = useState('');
  const [tag2, setTag2] = useState('');
  const [instagram, setInstagram]=useState('')
  const [tikTok, setTikTok]=useState('')
  const [whatsapp, setWhatsapp]=useState('')
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalInteractions, setTotalInteractions] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [showFriendshipNotification, setShowFriendshipNotification] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const notificationOpacity = useRef(new Animated.Value(0)).current;
  const notificationScale = useRef(new Animated.Value(0.8)).current;
  const notificationTranslateY = useRef(new Animated.Value(-50)).current;

  useFocusEffect(
    useCallback(() => {
      handleInfo();
      // Opcionalmente puedes resetear estados si hace falta
    }, [route.params.userId])
  );
  
  const handleGetMinInfo = async (_id) => {
    try {
      getMinInfo(_id, logout)
        .then((response) => {
          if (response) {
            setLocationInfo(response);
            setLocationBlocked(response.locationBlocked)
            setInfoVisible(true);
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

  const openModal = (index) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const transformHistories = (data) => {
    return data.map(item => ({ uri: item.url }));
  };

  const transformLocation = (data) => {
    return data.map(item => {
      if (item.location?.coordinates?.length === 2) {
        return {
          _id: item._id,
          location: {
            latitude: item.location.coordinates[1],
            longitude: item.location.coordinates[0],
          }
        };
      }
      return item;
    });
  };

  const handleInfo = async () => {
    try {
      setCargando(false);
      otherInfo({_id: route.params.userId}, logout)
        .then((response) => {
          set_id(response._id);
          setPhoto(response.avatar.url);
          setCargo(response.cargo);
          setFrase(response.frase);
          setHistories(transformHistories(response.histories));
          setKylotId(response.kylotId);
          setLocations(transformLocation(response.myPlaces));
          setName(response.name);
          setSurname(response.surname);
          setNumFollowed(response.numFollowed);
          setNumFollowers(response.numFollowers);
          setCommunity(response.community);
          // Calcular interacciones totales (likes de todas las publicaciones)
          const totalLikes = response.community?.reduce((total, item) => total + (item.likes || 0), 0) || 0;
          setTotalInteractions(totalLikes);
          setBanner(response.banner.url);
          setEarlyKylers(response.earlyKylers);
          setSeguido(response.follow);
          setTag1(translateTag(response.tags[0] || {category: ''}))
          setTag2(translateTag(response.tags[1] || {category: ''}))
          setWhatsapp(response.whatsapp)
          setTikTok(response.tiktok)
          setInstagram(response.instagram)
          setCargando(true);
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

    const handleMoreFollow = async ({userId}) => {
    try {
      moreFollow(userId, logout)
        .then(() => {
          setNumFollowers(numFollowers + 1)
          setConfirmacionMensaje(screenTexts.FollowConfirmation)
          setConfirmacion(true)
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

  const handleLessFollow = async ({userId}) => {
    try {
      
      lessFollow(userId, logout)
        .then(() => {
          setNumFollowers(numFollowers - 1)
          setConfirmacionMensaje(screenTexts.UnfollowConfirmation)
          setConfirmacion(true)
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

  const animateButton = () => {
    // Animación de "bounce" al presionar el botón
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  };

  const showFriendshipAnimation = () => {
    setShowFriendshipNotification(true);
    
    // Resetear valores iniciales
    notificationOpacity.setValue(0);
    notificationScale.setValue(0.8);
    notificationTranslateY.setValue(-50);

    // Animación de entrada
    Animated.parallel([
      Animated.timing(notificationOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(notificationScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(notificationTranslateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(notificationOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(notificationTranslateY, {
          toValue: -50,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start(() => {
        setShowFriendshipNotification(false);
      });
    }, 3000);
  };

  const handleFollow = () => {
    animateButton();
    
    if(!seguido){
      handleMoreFollow({userId: _id});
      // Mostrar notificación de amistad solo cuando se sigue
      setTimeout(() => {
        showFriendshipAnimation();
      }, 200);
    }
    else{
      handleLessFollow({userId: _id});
    }
    setSeguido(!seguido);
  };

  useEffect(() => {
    handleInfo();
  }, []);

  useEffect(() => {
    dataRef.current = { name, surname, kylotId, cargo, frase };
  }, [name, surname, kylotId, cargo, frase]);

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
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
      />

        {!cargando &&
          <View style={{ width: '100%', height: '90%', marginBottom:65 }}>
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
                colors={['#004999', '#1D7CE4', '#004999']}
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
          </View>

          {/* Follow/Unfollow Button with Animation */}
          {!seguido ? (
            <Animated.View style={[styles.followButton, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity onPress={handleFollow} activeOpacity={0.8}>
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.followButtonGradient}
                >
                  <Text style={styles.followButtonText}>{screenTexts.FollowTouchable}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View style={[styles.followingButton, { transform: [{ scale: buttonScale }] }]}>
              <TouchableOpacity onPress={handleFollow} activeOpacity={0.8}>
                <Text style={styles.followingButtonText}>{screenTexts.FollowingTouchable2}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Minimalist Metrics Section */}
          <View style={styles.minimalistMetricsSection}>
            <View style={styles.metricsContainer}>
              <TouchableOpacity style={styles.metricColumn} onPress={()=> navigate.navigate('ListaSeguidores', {_id: _id})}>
                <Text style={styles.metricNumber}>{numFollowers}</Text>
                <Text style={styles.metricLabel}>Seguidores</Text>
            </TouchableOpacity>
              
              <View style={styles.metricsDivider} />
              
              <TouchableOpacity style={styles.metricColumn} onPress={()=> navigate.navigate('ListaSiguiendo', {_id: _id})}>
                <Text style={styles.metricNumber}>{numFollowed}</Text>
                <Text style={styles.metricLabel}>Siguiendo</Text>
            </TouchableOpacity>
            
              <View style={styles.metricsDivider} />
              
              <View style={styles.metricColumn}>
                <Text style={styles.metricNumber}>{totalInteractions}</Text>
                <Text style={styles.metricLabel}>Interacciones</Text>
          </View>
            </View>
          </View>
          
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
          

          {/* Content Navigation Tabs */}
          <View style={styles.contentTabs}>
            <TouchableOpacity 
              style={[styles.tab, opcion === 1 && styles.activeTab]}
              onPress={() => setOpcion(1)}
              >
              <Text style={[styles.tabText, opcion === 1 && styles.activeTabText]}>
                {formatString(screenTexts.PostsMenu, { variable1: community.length })}
              </Text>
              {opcion === 1 && (
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, opcion === 2 && styles.activeTab]}
              onPress={() => setOpcion(2)}
              >
              <Text style={[styles.tabText, opcion === 2 && styles.activeTabText]}>
                {formatString(screenTexts.PhotosMenu, { variable1: histories.length })}
              </Text>
              {opcion === 2 && (
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, opcion === 3 && styles.activeTab]}
            onPress={() => setOpcion(3)}
            >
              <Text style={[styles.tabText, opcion === 3 && styles.activeTabText]}>
                {formatString(screenTexts.LocationsMenu, { variable1: locations.length })}
              </Text>
              {opcion === 3 && (
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>
          </View>

          { opcion === 1 && (
            <View>
              {community.length === 0 ? (
                <View style={styles.emptyStateContainer}>
                  <Text style={styles.emptyStateText}>
                {screenTexts.PublicationsText}
              </Text>
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
                  <Text style={styles.modernEmptyTitle}>Sin fotos aún</Text>
                  <Text style={styles.modernEmptySubtitle}>
                    {screenTexts.PhotosText}
                </Text>
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
                    {screenTexts.LocationsText || 'No tiene lugares guardados'}
                  </Text>
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
            {locations.length > 0 && (
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
            )}
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

      {/* Friendship Notification */}
      {showFriendshipNotification && (
        <Animated.View
          style={[
            styles.friendshipNotificationContainer,
            {
              opacity: notificationOpacity,
              transform: [
                { scale: notificationScale },
                { translateY: notificationTranslateY }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['#004999', '#1D7CE4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.friendshipNotificationGradient}
          >
            <View style={styles.friendshipNotificationContent}>
              {/* Success Icon */}
              <View style={styles.friendshipIconContainer}>
                <View style={styles.friendshipIconCircle}>
                  <Text style={styles.friendshipIconText}>✓</Text>
                </View>
              </View>
              
              {/* Text Content */}
              <View style={styles.friendshipTextContainer}>
                <Text style={styles.friendshipNotificationTitle}>
                  ¡Ya sois amigos! 🎉
                </Text>
                <Text style={styles.friendshipNotificationSubtitle}>
                  {name} {surname} y tú ya sois amigos
                </Text>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
      )}

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

  // User Info Section
  userInfoSection: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
    marginBottom: 16,
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

  // Follow Buttons
  followButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  followButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  followButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  followingButton: {
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  followingButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
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

  // Tags Section
  tagsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 8,
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

  // Content Tabs
  contentTabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    position: 'relative',
  },
  activeTab: {
    backgroundColor: '#1D7CE4',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  activeTabText: {
    color: 'white',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    marginLeft: -20,
    width: 40,
    height: 3,
    borderRadius: 2,
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

  // Modern Empty State
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

  // Content Sections
  photosContainer: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 24,
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

  // Friendship Notification Styles
  friendshipNotificationContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    zIndex: 1000,
    elevation: 10,
  },
  friendshipNotificationGradient: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#004999',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  friendshipNotificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendshipIconContainer: {
    marginRight: 16,
  },
  friendshipIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  friendshipIconText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  friendshipTextContainer: {
    flex: 1,
  },
  friendshipNotificationTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  friendshipNotificationSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 18,
  },
});

export default OtroPerfil;
