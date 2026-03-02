import React, { useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, ScrollView, Image,
  RefreshControl, ActivityIndicator,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Platform } from 'react-native';
import { useUser } from "../../context/useUser";
import { getActivity, getUsers, request, aceptInvitation, rejectInvitation } from '../../services/activitiesServices'
import { formatString } from '../../utils/formatString'
import Top from '../../components/Utils/Top';
import User from '../../components/Blocks/Community/User';
import GradientButton from '../../components/Utils/GradientButton';
import createButton from '../../../assets/createButton.png'
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import InfoModal from '../../components/Utils/InfoModal';

import Gomap from '../../../assets/Gomap.png';
import pinActivity from '../../../assets/pinActivity.png';

const ActivityDetail = ({ route }) => {
  const navigate = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.ActivityDetail;

  const { _id, name } = route.params;

  const [selected, setSelected] = useState(1);
  const [description, setDescription] = useState('');
  const [isInvited, setIsInvited] = useState(false);
  const [isReject, setIsReject] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [automaticAprove, setAutomaticAprove] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(true);
  const [banner, setBanner] = useState({});
  const [numRequest, setNumRequest] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [start, setStart] = useState({});
  const [end, setEnd] = useState({});
  const [users, setUsers] = useState([]);
  const [location, setLocation] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  const [showKyletsConfirmation, setShowKyletsConfirmation] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [isInfoExpanded, setIsInfoExpanded] = useState(true);
  const [creator, setCreator] = useState('');

  useEffect(() => {
        
      if(winKylets !== 0){
        setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
        setShowKyletsConfirmation(true)
      }
    },[winKylets])
  
  const handleAcept = async () => {
      setLoading(true);
      try {
          aceptInvitation({ _id }, logout)
              .then((res) => {
                  setConfirmacion(true)
                  setConfirmacionMensaje(screenTexts.AceptConfirmation)
                  setIsInvited(false)
                  setIsMember(true)
                  setLoading(false)
                  setWinKylets(res.kylets)
              })
              .catch((error) => {
                  setError(true);
                  setErrorMessage(error.message);
                  setLoading(false)
              })
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          setLoadingInvitations(false);
          setLoading(false)
      }
  }

  const handleReject = async () => {
      setLoading(true);
      try {
          rejectInvitation({ _id }, logout)
              .then(() => {
                  setConfirmacion(true)
                  setConfirmacionMensaje(screenTexts.RejectConfirmation)
                  setIsInvited(false)
                  setLoading(false)
              })
              .catch((error) => {
                  setError(true);
                  setErrorMessage(error.message);
                  setLoading(false)
              })
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
      }
  }

  const handleRequest = async () => {
      setLoading(true);
      try {
          request({ _id }, logout)
              .then(() => {
                  if(isPublic){
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.RequestPublicConfirmation)
                    setIsMember(true)
                  }
                  else {
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.RequestConfirmation)
                    setIsRequest(true)
                  }
                  setLoading(false)
                  
              })
              .catch((error) => {
                  setError(true);
                  setErrorMessage(error.message);
                  setLoading(false)
              })
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          () => setLoading(false)
      }
  }

  const handleInfo = () => {
    if(!loadingBlocked){
      setLoadingBlocked(true);

      getActivity({ _id }, logout)
        .then((res) => {
          setDescription(res.description)
          setIsPublic(res.public)
          setIsReject(res.isReject)
          setIsInvited(res.isInvited)
          setIsAdmin(res.isAdmin)
          setIsMember(res.isMember)
          setBanner(res.avatar)
          setCity(res.city)
          setCountry(res.country)
          setLocation(res.location)
          setAutomaticAprove(res.automaticAprove)
          setStart(formatDateTime(res.timetable.start))
          setEnd(formatDateTime(res.timetable.end))
          setNumRequest(res.requestCount)
          setIsRequest(res.isRequest)
          setCreator(res.creator || res.creatorName || 'Usuario')
          setLoadingBlocked(false);
        })
        .catch((error) => {
          console.log(error)
          setLoadingBlocked(false);
        })
    }
    
  }

  const handleUsers = (reset = false) => {
    if (!hasMore && !reset) return;

    setLoading(true);
    const currentPage = reset ? 1 : page;

    getUsers({ _id, page: currentPage }, logout)
      .then((res) => {
        if (res && Array.isArray(res.users)) {
          setUsers(prev => reset ? res.users : [...prev, ...res.users]);
          setPage(prev => reset ? 2 : prev + 1);
          setHasMore(res.users.length > 0);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        setHasMore(false);
        setLoading(false);
      })
  }

  const formatDateTime = (input) => {
        const date = new Date(input);

        // Fecha
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses empiezan en 0
        const year = date.getFullYear();

        // Hora
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return {
            fecha: `${day}/${month}/${year}`,
            hora: `${hours}:${minutes}`
        };
    };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleInfo()
    if (selected === 1) {
      handleUsers(true);
    } else {
      // Aquí iría la lógica de refresco para 'Listas'
    }
    setRefreshing(false);
  }, [selected]);

  useEffect(() => {
    if (selected === 1) {
      handleUsers(true);
    } else {
      // Aquí puedes disparar la lógica para 'Listas'
    }
  }, [selected]);

  useEffect(() => {
    handleInfo()
  }, []);

    const handleOpenMap = () => {
        const [longitude, latitude] = [location.coordinates[0], location.coordinates[1]]
        const lat = parseFloat(latitude);
        const lon = parseFloat(longitude);
        const url = Platform.select({
            ios: `http://maps.apple.com/?ll=${lat},${lon}`,
            android: `geo:${lat},${lon}?q=${lat},${lon}`,
        });
        Linking.openURL(url)
    };

  const handleScroll = ({ nativeEvent }) => {
    if (selected !== 1) return;

    const paddingToBottom = 20;
    const isCloseToBottom =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loading && hasMore) {
      handleUsers();
    }
  };

  return (
    <View style={styles.container}>
      <Top
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={name}
        right={false}
      />
        
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        <ImageBackground source={{uri: banner.url}} style={styles.imagenBanner}>
          {isPublic &&
            <View style={styles.publicContainer}>
              <Text style={styles.publicTitle}>{screenTexts.Public}</Text>
            </View>
          }
          <TouchableOpacity style={styles.bannerMapButton} onPress={handleOpenMap}>
            <Image source={Gomap} style={styles.bannerGoMap} />
          </TouchableOpacity>
          
          {/* Activity Title and Description inside image */}
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>{name}</Text>
            <Text style={styles.bannerDescription}>{description}</Text>
          </View>
        </ImageBackground>

        {/* Location and Time Section */}
        {isMember && (
          <View style={styles.infoSection}>
            {/* Título principal de información */}
            <TouchableOpacity 
              style={styles.infoHeader} 
              onPress={() => setIsInfoExpanded(!isInfoExpanded)}
              activeOpacity={0.6}
            >
              <Text style={styles.infoMainTitle}>Información</Text>
              <View style={styles.minimalChevron}>
                <Text style={styles.chevronMinimal}>{isInfoExpanded ? "−" : "+"}</Text>
              </View>
            </TouchableOpacity>


            {/* Contenido expandible */}
            {isInfoExpanded && (
              <>
                {/* Creador */}
                <View style={styles.infoItem}>
                  <View style={styles.infoItemContent}>
                    <Text style={styles.infoItemTitle}>Creador</Text>
                    <Text style={styles.infoItemText}>@{creator || 'Usuario'}</Text>
                  </View>
                  <View style={styles.infoDivider} />
                </View>

                {/* Ubicación */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemContent}>
                <Text style={styles.infoItemTitle}>Ubicación</Text>
                <View style={styles.locationContent}>
                  <Text style={styles.infoItemText}>{city} - {country}</Text>
                  <TouchableOpacity style={styles.locationIcon} onPress={handleOpenMap}>
                    <Image source={pinActivity} style={styles.iconoMapa} />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.infoDivider} />
            </View>

            {/* Comienzo */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemContent}>
                <Text style={styles.infoItemTitle}>{screenTexts.StartTitle}</Text>
                <Text style={styles.infoItemText}>{start.fecha} - {start.hora}</Text>
              </View>
              <View style={styles.infoDivider} />
            </View>

            {/* Final */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemContent}>
                <Text style={styles.infoItemTitle}>{screenTexts.EndTitle}</Text>
                <Text style={styles.infoItemText}>{end.fecha} - {end.hora}</Text>
              </View>
              <View style={styles.infoDivider} />
            </View>
              </>
            )}
          </View>
        )}
        { !isReject &&
            <>
            {(!isMember && !isInvited && !isRequest) &&
            <View>
                <Text style={styles.noMembersText}>{screenTexts.NotMemberTitle}</Text>
                <GradientButton 
                    color="Blue" 
                    text={screenTexts.NotMemberButton}  
                    onPress={() => handleRequest()}
                />
            </View>
            }

            {(!isMember && !isInvited && isRequest) &&
            <View>
                <Text style={styles.noMembersText}>{screenTexts.RequestTitle}</Text>
            </View>
            }

            {(!isMember && isInvited && !isRequest) &&
            <View style={{width: '100%'}}>
                <Text style={styles.noMembersText}>{screenTexts.InvitationTitle}  </Text>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{width: '45%'}}>
                    <GradientButton 
                    color="Blue" 
                    text={screenTexts.InvitationButton1}  
                    onPress={() => handleAcept()}
                    />
                </View>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject()}>
                    <Text>{screenTexts.InvitationButton2}</Text>
                </TouchableOpacity>
                </View>
            </View>
            }
            </>
        }
        {/* Menú */}
        <View style={styles.containerButtons}>
          <TouchableOpacity
            style={[styles.button, styles.rightButton, selected === 1 && styles.selectedButton]}
            onPress={() => setSelected(1)}
          >
            <Text style={[styles.buttonText, selected === 1 && styles.selectedButtonText]}>
              {screenTexts.Menu}
            </Text>
          </TouchableOpacity>
        </View>

        

        {selected === 1 && 
          <View style={{ paddingTop: 20 }}>
            {(isAdmin && !automaticAprove) &&
              <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => navigate.navigate("ActivityRequest", {_id})}>
                <Text style={{ fontSize: 16, color: numRequest > 0 ? '#1D7CE4' : 'Black' }}>
                  {formatString(screenTexts.Request, { variable1: numRequest })}
                  </Text>
              </TouchableOpacity>
            }
            
            {/* Título de usuarios */}
            <View style={styles.usersSectionTitle}>
              <Text style={styles.usersTitle}>Usuarios unidos</Text>
              <Text style={styles.usersCount}>{users.length} participantes</Text>
            </View>
            
            {users.map((item, index) => (
              <User
                key={`user-${index}`}
                profileImage={item.avatar?.url}
                fullName={`${item.name} ${item.surname}`}
                username={item.kylotId}
                _id={item._id}
              />
            ))}

            {/* Indicador de carga final solo en Experiencias */}
            {loading && hasMore && (
              <ActivityIndicator
                style={{ marginVertical: 20 }}
                size="small"
                color="#1D7CE4"
              />
            )}
          </View>
        }
      </ScrollView>

      {(isAdmin && false) &&
        <LinearGradient
          colors={[ '#1D7CE4', '#004999']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.buttonGradient}
        >
          <TouchableOpacity /*onPress={() => setShowModal(true)}*/>
            <Image source={createButton} style={styles.imageCreate}/>
          </TouchableOpacity>
        </LinearGradient>
      }

      {error &&

      <Error message={errorMessage} func={setError} />

      }

      {confirmacion &&

      <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

      }

      <InfoModal 
        celebration={true}
        isOpen={showKyletsConfirmation} 
        onClose={() => {setShowKyletsConfirmation(false), setWinKylets(0)} } 
        Title={winKyletsText} 
        Subtitle={screenTexts.KyletsSubtitle} 
        Button={screenTexts.KyletsButton} 
      />

      {loadingBlocked && (
          <LoadingOverlay/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
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
    borderColor: '#1D7CE4',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
  },
  selectedButtonText: {
    fontWeight: 'bold',
  },
  imagenBanner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  titleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
  },
  activityTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D1D1F',
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: 12,
  },
  userCard: {
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
  },
  buttonGradient:{
    backgroundColor: '#1D7CE4',
    width:50,
    height:50,
    borderRadius:25,
    position: 'absolute',
    bottom:60,
    right:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCreate:{
    width: 35,
    height: 35
  },
  descriptionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  descriptionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  descriptionText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    letterSpacing: 0.1,
  },
  // Estilos minimalistas para la sección de información (igual que PlaceInfo)
  infoSection: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoItemContent: {
    paddingVertical: 12,
  },
  infoItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.3,
    lineHeight: 22,
  },
  infoItemText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  infoDivider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 4,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  locationIcon: {
    padding: 4,
    marginLeft: 8,
  },
  iconoMapa: {
    width: 16,
    height: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoMainTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: -0.6,
    lineHeight: 26,
    textAlign: 'left',
  },
  minimalChevron: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  chevronMinimal: {
    fontSize: 16,
    color: '#999999',
    fontWeight: '200',
    letterSpacing: 0,
    lineHeight: 16,
  },
  closedDivider: {
    height: 0.5,
    backgroundColor: '#F0F0F0',
    marginTop: 12,
    marginBottom: 8,
  },
  usersSectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    marginTop: 16,
    marginBottom: 8,
  },
  usersTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  usersCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  noMembersText:{
    alignSelf: 'center',
    fontWeight: 'bold',
    color: 'red',
    fontSize: 24,
    textAlign: 'center'
  },
  publicContainer: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 50,
    marginTop: 16,
    marginRight: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  publicTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  bannerMapButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  bannerGoMap: {
    width: 24,
    height: 24,
  },
  bannerContent: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: -0.5,
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bannerDescription: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 20,
    letterSpacing: 0.1,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rejectButton:{
    height: 47,
    marginTop:15,
    //paddingVertical: 10,
    //paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  goMap:{
    height: 35,
    width: 35
  },
});

export default ActivityDetail;
