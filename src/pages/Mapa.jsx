import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Location from 'expo-location';
import { View, StyleSheet, Text, TouchableOpacity, Animated, Image, TouchableWithoutFeedback, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from "../context/useUser";
import { formatString } from '../utils/formatString'
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { getPlaces, getMinInfo, createPlace, daily, getMoments, createMoment, searcher, likeMoment } from '../services/mapsService';
import { getActivities } from '../services/activitiesServices';
import { getRoutes } from '../services/routeServices';
import { ruleta } from '../services/roulleteService';
import Top from '../components/Utils/Top';
import ModalRoute from '../components/Utils/ModalRoute';
import Maps from '../components/Maps/Maps';
import TextLine from '../components/Utils/TextLine';
import LocationInfo from '../components/Maps/LocationInfo';
import Loader from '../components/Utils/Loader'
import InfoModal from '../components/Utils/InfoModal';
import Error from '../components/Utils/Error';
import Confirmacion from '../components/Utils/Confirmacion';
import LoadingOverlay from '../components/Utils/LoadingOverlay';
import Buscador from '../components/Utils/Buscador'
import createButton from '../../assets/createButton.png'
import corona from '../../assets/coronaBoton.png'
import metricas from '../../assets/metricas.png'
import ranking from '../../assets/ranking.png'
import info from '../../assets/infoWhite.png'; 
import category from '../../assets/category.png'; 
import mapa from '../../assets/pinMenu.png';
import Route from '../../assets/Route.png'
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import { PanResponder } from 'react-native';
import { Keyboard } from 'react-native'


const Mapa = (props) => {
  const navigation=useNavigation()
  const { isLogged, isLoading, logout, texts, language } = useUser();
  const screenTexts = texts.pages.Mapa
  const mapRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const [heightAnim] = useState(new Animated.Value(0)); 
  const [kylets, setKylets] = useState(0);
  const [edad, setEdad] = useState(0);
  const [coord, setCoord] = useState({})
  const [cargando, setCargando] = useState(false)
  const [visibleComponent, setVisibleComponent] = useState(false)
  const [textLineColor, setTextLineColor] = useState('Blue')
  const [locations, setLocations] = useState([])
  const [moments, setMoments] = useState([])
  const [activities, setActivities] = useState([])
  const [routes, setRoutes] = useState([])
  const [locationInfo, setLocationInfo] = useState({})
  const [locationBlocked, setLocationBlocked] = useState(false)
  const [lugar, setLugar] = useState({
    name: '',
    categoria:{},
    experiencia: '',
    amigo: [],
    recomendacion: '',
    comentario: '',
    nota: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
    momento: false
});
  const [photos, setPhotos] = useState([]);
  const [urls, setUrls] = useState([]);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);  
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [routeVisible, setRouteVisible] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [selectedRoute, setSelectedRoute] = useState({});
  const lugarRef = useRef(lugar) 
  const photosRef = useRef(photos) 
  const urlsRef = useRef(urls) 
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  const [search, setSearch] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const screenHeight = Dimensions.get('window').height;
  const sheetInitialPosition = screenHeight * 0.7;
  const sheetExpandedPosition = 95;
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidHide', () => {
      setShowSearchResults(false);
    });
    return () => sub.remove();
  }, []);

  const focusOnPlace = (item) => {
    const lat = item?.location?.latitude;
    const lng = item?.location?.longitude;

    if (!mapRef.current || typeof lat !== 'number' || typeof lng !== 'number') return;

    Keyboard.dismiss(); // opcional: cierra el teclado
    mapRef.current.animateToRegion(
      {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      500 // duración de la animación en ms (opcional)
    );

    // opcional: si quieres limpiar la lista/entrada
    // setSearchResult([]);
    // setSearch(item.name);
  }

  const polyPress = (data) => {
    setSelectedRouteId(data)
    setSelectedRoute(data.routeData?.place || []);
    setRouteVisible(true)
  };

  const panTranslateY = useRef(new Animated.Value(sheetInitialPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const newPos = Math.max(sheetExpandedPosition, sheetInitialPosition + gestureState.dy);
        panTranslateY.setValue(newPos);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          Animated.spring(panTranslateY, {
            toValue: sheetExpandedPosition,
            useNativeDriver: true,
          }).start(() => setIsExpanded(true));
        } else {
          Animated.spring(panTranslateY, {
            toValue: sheetInitialPosition,
            useNativeDriver: true,
          }).start(() => setIsExpanded(false));
        }
      },
    })
  ).current;

  const handleMomentPress = (data) => {
    setSelectedMoment(data);
    setLiked(data.liked)
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const closeMoment = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSelectedMoment(null));
  };

  const handleMenu = () => {
    setMenu(!menu); // Cambia el estado de visibilidad del desplegable
    if (!menu) {
      Animated.spring(heightAnim, {
        toValue: 400, // La altura máxima del desplegable
        useNativeDriver: false, // Importante para animar propiedades como la altura
      }).start();
    } else {
      Animated.spring(heightAnim, {
        toValue: 0, // Vuelve a la altura 0 (oculto)
        useNativeDriver: false,
      }).start();
    }
  };

  const handleTextLine = async () => {
    try {
      
      daily(logout)
        .then((response) => {
          if(response){
            setTextLineColor('Gold')
          }
          else{
            setTextLineColor('Blue')
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

  const handleSearcher = async () => {
    try {
      searcher({search, language}, logout)
        .then((response) => {
          const raw = Array.isArray(response) ? response : response?.data;
          const parsed = (raw || []).map((item) => {
            const coords = item?.location?.coordinates;
            const ok = Array.isArray(coords) && coords.length === 2 &&
                      typeof coords[0] === "number" && typeof coords[1] === "number";
            return {
              name: item?.name ?? null,
              location: ok ? { latitude: coords[1], longitude: coords[0] } : null,
            };
          });

          setSearchResult(parsed);
          // si el input está enfocado y hay resultados, muéstralos
          setShowSearchResults(isSearchFocused && parsed.length > 0);
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

  useEffect(() => {
    if(search.trim() !== ''){
      handleSearcher()
    }
    
  },[search])

  const handleCreateUbi = async ({ errorBolean, errorMensaje, setLoading2 }) => {
    const lugar = lugarRef.current;
    const photos = photosRef.current; // nuevas fotos (locales)
    const urls = urlsRef.current;     // ya subidas en S3

    try {
      if (photos.length > 10) {
        errorBolean(true);
        errorMensaje(screenTexts.AmountMomentError);
        setLoading2(false);
        return;
      }
      if (
        lugar.name.trim() !== '' &&
        lugar.categoria._id &&
        lugar.nota > 0 && lugar.nota <= 7 &&
        lugar.location.longitude >= -180 && lugar.location.longitude <= 180 &&
        lugar.location.latitude >= -90 && lugar.location.latitude <= 90 &&
        photos.length > 0
      ) {
        const payload = {
          name: lugar.name,
          categoria: lugar.categoria._id,
          experiencia: lugar.experiencia,
          amigo: lugar.amigo.map(u => u._id),
          recomendacion: lugar.recomendacion,
          nota: lugar.nota,
          location: lugar.location,
          urls: urls,
          newPhotos: photos
        };

        await createPlace(payload, logout, errorMensaje)
          .then((res) => {
            // Reiniciar estado
            setLugar({
              name: '',
              categoria: {},
              experiencia: '',
              amigo: [],
              recomendacion: '',
              nota: 0,
              location: { latitude: 0, longitude: 0 },
              momento: false
            });
            setUrls([]);
            setPhotos([]);

            // Confirmación
            setConfirmacion(true);
            setConfirmacionMensaje(screenTexts.LocationConfirmation);
            setLoading2(false);
            navigation.navigate('Home');
            setWinKylets(res.kylets);
          })
          .catch((error) => {
            setLoading2(false);
            errorBolean(true);
            errorMensaje(error.message);
          });

      } else {
        setLoading2(false);
        errorBolean(true);

        // Validaciones personalizadas
        if (lugar.name.trim() === '') {
          errorMensaje(screenTexts.NameError);
        } else if (lugar.nota <= 0 || lugar.nota > 7) {
          errorMensaje(screenTexts.ValorationError);
        } else if (
          lugar.location.longitude < -180 || lugar.location.longitude > 180 ||
          lugar.location.latitude < -90 || lugar.location.latitude > 90
        ) {
          errorMensaje(screenTexts.LocationError);
        } else if (photos.length === 0) {
          errorMensaje(screenTexts.PhotoError);
        } else {
          errorMensaje(screenTexts.FieldsErrorMessages);
        }
      }
    } catch (error) {
      setLoading2(false);
      errorBolean(true);
      errorMensaje(error.message);
    }
  }

  const handleCreateMoment = async ({ errorBolean, errorMensaje, setLoading2 }) => {
    const lugar = lugarRef.current;
    const photos = photosRef.current;
    const urls = urlsRef.current;
    // Debug logs removed for production
    try {
      if (!((photos.length === 1 && urls.length === 0) || (photos.length === 0 && urls.length === 1))) {
        errorBolean(true);
        errorMensaje(screenTexts.MomentPhotoError);
        setLoading2(false);
        return;
      }
      if (
        lugar.name.trim() !== '' &&
        lugar.location.longitude >= -180 && lugar.location.longitude <= 180 &&
        lugar.location.latitude >= -90 && lugar.location.latitude <= 90 
      ) {
        const payload = {
          name: lugar.name,
          location: lugar.location,
          urls: urls,
          newPhotos: photos
        };

        await createMoment(payload, logout, errorMensaje)
          .then((res) => {
            setLugar({
              name: '',
              categoria: {},
              experiencia: '',
              amigo: [],
              recomendacion: '',
              nota: 0,
              location: { latitude: 0, longitude: 0 },
              momento: false
            });
            setUrls([]);
            setPhotos([]);

            // Confirmación
            setConfirmacion(true);
            setConfirmacionMensaje(screenTexts.MomentConfirmation);
            setLoading2(false);
            navigation.navigate('Home');
            setWinKylets(res.kylets);
          })
          .catch((error) => {
            setLoading2(false);
            errorBolean(true);
            errorMensaje(error.message);
          });

      } else {
        setLoading2(false);
        errorBolean(true);

        // Validaciones personalizadas
        if (lugar.name.trim() === '') {
          errorMensaje(screenTexts.NameError);
        } else if (
          lugar.location.longitude < -180 || lugar.location.longitude > 180 ||
          lugar.location.latitude < -90 || lugar.location.latitude > 90
        ) {
          errorMensaje(screenTexts.LocationError);
        } else if (photos.length === 0 && urls.length === 0) {
          errorMensaje(screenTexts.PhotoError);
        } else {
          errorMensaje(screenTexts.FieldsErrorMessages);
        }
      }
    } catch (error) {
      setLoading2(false);
      errorBolean(true);
      errorMensaje(error.message);
    }
  }

  useEffect(() => {
    
    if(winKylets !== 0){
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
      setShowConfirmation(true)
    }
  },[winKylets])

  const handleLikeMoment = async () => {
    try {
      likeMoment({ _id: selectedMoment._id }, logout)
        .then((res) => {
          // aquí asumimos que tu API devuelve { liked: true/false }
          const { liked } = res;

          setMoments((prevMoments) =>
            prevMoments.map((m) =>
              m._id === selectedMoment._id ? { ...m, liked } : m
            )
          );
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

  const handleSendUbis = async (boundaries) => {

    try {
      getPlaces(boundaries.northEast, boundaries.southWest, logout)
        .then((response) => {
          if (response) {
            setLocations(transformLocation(response))
            
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

  const handleSendUbisMoments = async (boundaries) => {

    try {
      getMoments(boundaries.northEast, boundaries.southWest, logout)
        .then((response) => {
          if (response) {
            setMoments(transformMoment(response))
            
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

  const handleSendUbisActivities = async (boundaries) => {

    try {
      getActivities(boundaries.northEast, boundaries.southWest, logout)
        .then((response) => {
          if (response) {
            setActivities(transformActivities(response))
            
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

  const handleGetRoute = async () => {

    try {
      getRoutes(logout)
        .then((response) => {
          if (response) {
            setRoutes(transformRoutes(response.routes))
            
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

  const transformLocation = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => {
      if (!item || !item._id) return null;
      
      // Si la propiedad `coordinates` existe, transformarla
      if (item.location && item.location.coordinates && Array.isArray(item.location.coordinates) && item.location.coordinates.length === 2) {
        const [longitude, latitude] = item.location.coordinates;
        if (typeof latitude === 'number' && typeof longitude === 'number' && 
            latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
          return {
            _id: item._id,
            blocked: item.blocked,
            categoria: item.categoria,
            location: {
              latitude: latitude,
              longitude: longitude
            }
          };
        }
      }
      return item; // Si no hay coordenadas válidas, devolver el objeto tal como está
    }).filter(Boolean);
  };

  const transformMoment = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => {
      if (!item || !item._id) return null;
      
      // Si la propiedad `coordinates` existe, transformarla
      if (item.location && item.location.coordinates && Array.isArray(item.location.coordinates) && item.location.coordinates.length === 2) {
        const [longitude, latitude] = item.location.coordinates;
        if (typeof latitude === 'number' && typeof longitude === 'number' && 
            latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
          return {
            _id: item._id,
            photo: item.photo,
            name: item.name,
            liked: item.liked,
            location: {
              latitude: latitude,
              longitude: longitude
            }
          };
        }
      }
      return item; // Si no hay coordenadas válidas, devolver el objeto tal como está
    }).filter(Boolean);
  };

  const transformActivities = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => {
      if (!item || !item._id) return null;
      
      // Si la propiedad `coordinates` existe, transformarla
      if (item.location && item.location.coordinates && Array.isArray(item.location.coordinates) && item.location.coordinates.length === 2) {
        const [longitude, latitude] = item.location.coordinates;
        if (typeof latitude === 'number' && typeof longitude === 'number' && 
            latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
          return {
            _id: item._id,
            name: item.name,
            location: {
              latitude: latitude,
              longitude: longitude
            }
          };
        }
      }
      return item; // Si no hay coordenadas válidas, devolver el objeto tal como está
    }).filter(Boolean);
  };

  const transformRoutes = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(route => {
      if (!route || !route.routeData) return null;
      
      const transformedPlaces = Array.isArray(route.routeData.place)
        ? route.routeData.place.map(p => {
            if (
              p.location &&
              Array.isArray(p.location.coordinates) &&
              p.location.coordinates.length === 2
            ) {
              const [longitude, latitude] = p.location.coordinates;
              if (typeof latitude === 'number' && typeof longitude === 'number' && 
                  latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180) {
                return {
                  ...p,
                  location: {
                    latitude: latitude,
                    longitude: longitude
                  }
                };
              }
            }
            return p;
          }).filter(Boolean)
        : [];

      return {
        ...route,
        routeData: {
          ...route.routeData,
          place: transformedPlaces
        }
      };
    }).filter(Boolean);
  };



  const getVisibleRegion = async () => {
    if (mapRef.current) {
        try {
            const camera = await mapRef.current.getCamera();
            if (camera && camera.center) {
                const { latitude, longitude, latitudeDelta, longitudeDelta } = camera.center;
                return {
                    northEast: {
                        latitude: latitude + latitudeDelta / 2,
                        longitude: longitude + longitudeDelta / 2
                    },
                    southWest: {
                        latitude: latitude - latitudeDelta / 2,
                        longitude: longitude - longitudeDelta / 2
                    }
                };
            }
        } catch (error) {
            console.error('Error getting map boundaries:', error);
        }
    }
    return null;
  };

  const onRegionChangeComplete = async (region) => {
    if (!region || !region.latitude || !region.longitude) {
        console.warn('Invalid region data received');
        return;
    }
    
    const boundaries = {
        northEast: {
            latitude: region.latitude + region.latitudeDelta / 2,
            longitude: region.longitude + region.longitudeDelta / 2
        },
        southWest: {
            latitude: region.latitude - region.latitudeDelta / 2,
            longitude: region.longitude - region.longitudeDelta / 2
        }
    };
    
    handleSendUbis(boundaries);
    handleSendUbisMoments(boundaries);
    handleSendUbisActivities(boundaries);
    handleTextLine();
  };

  const handleGetMinInfo = async (_id) => {
    if(!loading){
      setLoading(true)
      try {
        getMinInfo(_id, logout)
          .then((response) => {
            if (response) {
              setLocationInfo(response)
              setLocationBlocked(response.locationBlocked)
              setVisibleComponent(true)
            }
            setLoading(false)
          })
          .catch((error) => {
            setLoading(false)
            setError(true);
            setErrorMessage(error.message);
          });
      } catch (error) {
        setLoading(false)
        setError(true);
        setErrorMessage(error.message);
      }
    }
  };

  const handleGetRoullete = async () => {
    try {
      ruleta(logout)
        .then((response) => {
          if (response) {
            if(response){
              navigation.navigate('Ruleta')
            }
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

  async function getLocationPermission(){
    let {status} = await Location.requestForegroundPermissionsAsync()

    if(status !== 'granted'){
      setErrorMessage(screenTexts.PermissionError);
      return
    }
    else{
      let location = await Location.getCurrentPositionAsync({})
      const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      }
      setCoord(current)
      setCargando(true)
    }
  }

  const handleCreate = async () => {
    const handleCreateDispatcher = async ({ errorBolean, errorMensaje, setLoading2 }) => {
      const isMoment = lugarRef.current?.momento === true;

      if (isMoment) {
        handleCreateMoment({ errorBolean, errorMensaje, setLoading2 });
      } else {
        handleCreateUbi({ errorBolean, errorMensaje, setLoading2 });
      }
    };

    navigation.navigate('AddMarket', {
      func: setLugar,
      lugar: lugar,
      pass: handleCreateDispatcher, // <-- función que decide en tiempo de ejecución
      mode: true,
      photos: photos,
      urls: urls,
      setPhotos: setPhotos,
      setUrls: setUrls
    });
  };

  
  

  useEffect(() => {
    const loadPlaces = async () => {
      // Esperar a que el mapa esté cargado antes de obtener boundaries
      if (cargando && coord.latitude && coord.longitude) {
        const boundaries = await getVisibleRegion();
        if (boundaries) {
          handleSendUbis(boundaries); 
          handleSendUbisMoments(boundaries);
          handleSendUbisActivities(boundaries);
        }
      }
    };
  
    loadPlaces();
    handleTextLine();
  
  },[cargando, coord])

  useEffect(() => {
    
    setKylets(props.amount)
    setEdad(props.edad)
  
  },[props.amount, props.edad])

  useEffect(() => {
    lugarRef.current =  lugar ;
  }, [lugar]);

  useEffect(() => {
    photosRef.current =  photos ;
  }, [photos]);

  useEffect(() => {
    urlsRef.current =  urls ;
  }, [urls]);

  useEffect(() => {
    handleGetRoullete()
  
  },[])

  useEffect(() => {
    getLocationPermission()
  
  },[])

  useFocusEffect(
    useCallback(() => {
      handleGetRoute();
    }, [])
  );

  

  return (
    <View style={styles.container}>

      <Top 
        left={true} leftType={'Map'} 
        typeCenter={'Text'} textCenter={screenTexts.Top} 
        right={true} rightType={'Kylets'} amount={kylets}
      />
        <TextLine color={textLineColor} type={'Countdown'}/>

        <View style={styles.searcher}>
          <Buscador
            placeholder={screenTexts.Searcher}
            search={search}
            func={setSearch}
            onFocus={() => {
              setIsSearchFocused(true);
              if (searchResult.length > 0) setShowSearchResults(true);
            }}
            onBlur={() => {
              setIsSearchFocused(false);
            }}
          />
          {showSearchResults && searchResult.length > 0 && (
              <View style={styles.results}>
                <ScrollView 
                  style={styles.scrollResults}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {searchResult.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.resultItem}
                      onPress={() => {
                        focusOnPlace(item);        // mueve el mapa
                        setShowSearchResults(false); // oculta la lista
                        Keyboard.dismiss();          // opcional
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.resultContent}>
                        <Image source={require('../../assets/pinMapa.png')} style={styles.resultIcon} />
                        <View style={styles.resultTextContainer}>
                          <Text style={styles.resultName}>{item.name}</Text>
                          {item.address && (
                            <Text style={styles.resultAddress}>{item.address}</Text>
                          )}
                        </View>
                        <FontAwesome name="chevron-right" size={12} color="#94A3B8" />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
        </View>
        

        {cargando ? (<Maps 
          ref={mapRef} 
          origin={coord}
          type={'View'}
          locations={locations}
          moments = {moments}
          activities = {activities}
          routes = {routes}
          polyPress= {polyPress}
          onPress={handleGetMinInfo} 
          onRegionChangeComplete={onRegionChangeComplete}
          edad={edad}
          onMomentPress={handleMomentPress}
        />): (
          <Loader/>
        )}


        {visibleComponent &&
        <View style={{ position: 'absolute', bottom: 112, width: '100%', alignItems: 'center'}}>
          <LocationInfo 
            close={() => setVisibleComponent(false)} 
            expand={() => navigation.navigate('Place', {locationInfo: locationInfo, setLocationBlocked: setLocationBlocked})}
            info = {locationInfo}
            locationBlocked = {locationBlocked} 
          />
          </View>
        }

        {(!visibleComponent && cargando) &&
          <>
            
            <Animated.View style={[styles.dropdown, { height: heightAnim }]}>
              <LinearGradient
              colors={[ '#004999', '#1D7CE4']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.dropdownContent}
              >
                {menu &&
                <>
                  <TouchableOpacity style={styles.buttonCreate} onPress={() => navigation.navigate('Tutorial')}>
                    <Image source={info} style={styles.imageCreate}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCreate} onPress={() => navigation.navigate('Ranking')}>
                    <Image source={ranking} style={styles.imageCreate}/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCreate} onPress={() => navigation.navigate('Metricas')}>
                    <Image source={metricas} style={styles.imageCreate2} resizeMode="contain"/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCreate} onPress={() => navigation.navigate("ConfigRoute")}>
                    <Image source={Route} style={styles.imageCreate} resizeMode="contain"/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCreate} onPress={() => navigation.navigate('Categorias')}>
                    <Image source={category} style={styles.imageCreate3} resizeMode="contain"/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCreate} onPress={() => navigation.navigate('LocationPending')}>
                    <Image source={mapa} style={styles.imageCreate3} resizeMode="contain"/>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonCreate} onPress={handleCreate}>
                    <Image source={corona} style={styles.imageCreate}/>
                  </TouchableOpacity>
                </>
                }
                
              </LinearGradient>
            </Animated.View>
            
            <LinearGradient
              colors={[ '#1D7CE4', '#004999']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.button}
            >
              <TouchableOpacity onPress={handleMenu}>
                <Image source={createButton} style={styles.imageCreate}/>
              </TouchableOpacity>
            </LinearGradient>
            
          </>
        }

        {error &&

        <Error message={errorMessage} func={setError} />

        }

        {confirmacion &&

        <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

        }

        <InfoModal 
          celebration={true}
          isOpen={showConfirmation} 
          onClose={() => {setShowConfirmation(false), setWinKylets(0)} } 
          Title={winKyletsText} 
          Subtitle={screenTexts.KyletsSubtitle} 
          Button={screenTexts.KyletsButton} 
        />

        {selectedMoment && (
          <TouchableWithoutFeedback onPress={closeMoment}>
            <View style={StyleSheet.absoluteFillObject}>
              <Animated.View style={[styles.polaroidModal, { transform: [{ scale: scaleAnim }] }]}>
                {/* Like button en la esquina superior derecha */}
                <TouchableOpacity
                    style={styles.heartButtonTop}
                    onPress={() => {setLiked(!liked), handleLikeMoment()}}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={liked ? 'heart' : 'heart-outline'}
                      size={20}
                      color={liked ? 'red' : '#666'}
                    />
                  </TouchableOpacity>

                <Image source={{ uri: selectedMoment?.photo?.url || '' }} style={styles.polaroidImage} />

                {/* Contenedor del texto */}
                <View style={styles.textContainer}>
                  <Text style={styles.polaroidText}>{selectedMoment.title}</Text>
                  {selectedMoment.user && (
                    <Text style={styles.userIdText}>@{selectedMoment.user.kylotId || selectedMoment.user._id || 'usuario'}</Text>
                  )}
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        )}

        {routeVisible && <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: screenHeight,
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            transform: [{ translateY: panTranslateY }],
            zIndex: 9999
          }}
        >
          {/* Handle de arrastre */}
          <View {...panResponder.panHandlers} style={{ paddingVertical: 10, alignItems: 'center' }}>
            <View
              style={{
                width: 40,
                height: 5,
                backgroundColor: '#ccc',
                borderRadius: 3,
              }}
            />
          </View>

          <ModalRoute
            selectedRouteId={selectedRouteId?.routeData?._id || ''}
            selectedRoute={selectedRoute}
            isExpanded={isExpanded}
            back={() => setRouteVisible(false)}
          />
        </Animated.View>}



        
        {loading && (
          <LoadingOverlay/>
        )}
        
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  searcher:{
    width: '90%',
    alignItems: 'center',
    justifyContent :  'center',
    zIndex: 100,
    position: 'absolute',
    top: 140
  },
  results:{
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    maxHeight: 300,
    marginTop: 8,
  },
  scrollResults: {
    maxHeight: 300,
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultIcon: {
    width: 16,
    height: 16,
    marginRight: 12,
    resizeMode: 'contain',
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  resultAddress: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '400',
  },
  icono1:{
    position: 'absolute',
    left: 20,
  },
  icono2:{
    position: 'absolute',
    right: 60,
    width: 23,
    height:23
  },
  icono3:{
    position: 'absolute',
    right: 20,
  },
  mapa:{
    flex: 1,
    //backgroundColor: 'green',
    width: '100%',
    height: '100%',
    marginBottom:60
  },
  button:{
    backgroundColor: '#1D7CE4',
    width:50,
    height:50,
    borderRadius:25,
    position: 'absolute',
    bottom:120,
    right:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  dropdown: {
    width: 50,
    overflow: 'hidden', // Asegura que no se vea fuera de los límites del contenedor
    marginTop: 10,
    //paddingHorizontal: 10,
    //paddingVertical: 5,
    borderRadius: 30,
    borderTopStartRadius: 30,
    position: 'absolute',
    bottom:120,
    right:20

  },
  dropdownContent: {
    //paddingHorizontal: 10,
    //paddingVertical: 5,
    flex:1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingBottom: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 10
  },
  buttonCreate:{
    width: 35,
    height: 35,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCreate:{
    width: 35,
    height: 35
  },
  imageCreate2:{
    width: 35,
    height: 40
  },
  imageCreate3:{
    width: 40,
    height: 40
  },
  polaroidModal: {
    position: 'absolute',
    top: height / 2 - 125,
    left: width / 2 - 125,
    width: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center',
    padding: 15,
    elevation: 5,
  },
  polaroidImage: {
    width: 220,
    height: 220,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  polaroidText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '400',
  },
  heartButtonTop: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'white',
    zIndex: 10,
  }

});

export default Mapa;