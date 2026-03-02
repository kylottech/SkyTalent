import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Image
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import { pending, createPlace } from '../../services/mapsService';
import Top from "../../components/Utils/Top";
import InfoModal from '../../components/Utils/InfoModal';
import ErrorModal from '../../components/Maps/ErrorModal';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';

const LocationPending = () => {
  const navigation = useNavigation();
  const { isLogged, isLoading, texts, logout, translateTag } = useUser();
  const screenTexts = texts.pages.Mapas.LocationPending;

  const [lugar, setLugar] = useState({
    name: '',
    categoria: {},
    experiencia: '',
    amigo: [],
    recomendacion: '',
    nota: 0,
    location: {
      latitude: 0,
      longitude: 0,
    }
  });
  const [photos, setPhotos] = useState([]);
  const [urls, setUrls] = useState([]);
  const lugarRef = useRef(lugar);
  const photosRef = useRef(photos);
  const urlsRef = useRef(urls);

  const [data, setData] = useState({ pendings: [], approved: [], denied: [] });
  const [selected, setSelected] = useState("approved");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmation2, setShowConfirmation2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [locationBlocked, setLocationBlocked] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("Errorrr");
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState("Errorrr");

  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState("");

  useFocusEffect(
    useCallback(() => {
      setLugar({
        name: '',
        categoria: {},
        experiencia: '',
        amigo: [],
        recomendacion: '',
        nota: 0,
        location: {
          latitude: 0,
          longitude: 0,
        }
      });
      setShowConfirmation(false);
      setShowConfirmation2(false);
      setSelectedPlace(null);
      setConfirmacion(false);
      setError(false);
      handleGetLocations();
    }, [])
  );

  const handleGetLocations = async () => {
    setLoading(true);
    try {
      const res = await pending(logout);
      setData(res || { pendings: [], approved: [], denied: [] });
      setError(false);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message || "Error");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateUbi = async ({ errorBolean, errorMensaje, setLoading2 }) => {
    const lugar = lugarRef.current;
    const photos = photosRef.current;
    const urls = urlsRef.current;

    try {
      if (
        lugar.name?.trim() !== '' &&
        lugar.categoria?._id &&
        lugar.nota > 0 && lugar.nota <= 7 &&
        lugar.location.longitude >= -180 && lugar.location.longitude <= 180 &&
        lugar.location.latitude >= -90 && lugar.location.latitude <= 90
      ) {
        if (photos.length > 10) {
          setLoading2(false);
          errorBolean(true);
          errorMensaje(screenTexts.PhotosAumontError);
          return;
        }

        const res = await createPlace({
          name: lugar.name,
          categoria: lugar.categoria._id,
          experiencia: lugar.experiencia,
          amigo: lugar.amigo,
          recomendacion: lugar.recomendacion,
          nota: lugar.nota,
          location: lugar.location,
          urls: urls,
          newPhotos: photos
        }, logout, errorMensaje);

        setLugar({
          name: '',
          categoria: {},
          experiencia: '',
          amigo: [],
          recomendacion: '',
          nota: 0,
          location: {
            latitude: 0,
            longitude: 0,
          }
        });

        setUrls([]);
        setPhotos([]);
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.LocationConfirmation);
        setWinKylets(res.kylets);
        setSelected('pendings');
        setLoading2(false);
        handleGetLocations();
        navigation.navigate('LocationPending');

      } else {
        setLoading2(false);
        errorBolean(true);
        errorMensaje(screenTexts.FieldsErrorMessages);
      }
    } catch (error) {
      setLoading2(false);
      errorBolean(true);
      errorMensaje(error.message);
    }
  };

  useEffect(() => {
    lugarRef.current = lugar;
  }, [lugar]);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    urlsRef.current = urls;
  }, [urls]);

  useEffect(() => {
    handleGetLocations();
  }, []);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigation.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    if (winKylets !== 0) {
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }));
      setShowConfirmation(true);
    }
  }, [winKylets]);

  const handleLocations = (place) => {
    setLugar({
      name: place.name,
      categoria: translateTag(place.categoria),
      experiencia: place.experiencia,
      amigo: place.amigo,
      recomendacion: place.recomendacion,
      nota: place.puntuacion?.[0]?.number || 0,
      location: {
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0],
      }
    });
    setPhotos(Array.isArray(place.photos) ? place.photos.map(photo => photo.url) : []);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetLocations();
  }, []);

  const handlePressPlace = (place) => {
    if (place.verificado === 1) {
      navigation.navigate('Place', {
        locationInfo: {
          cityBlocked: true,
          locationBlocked: true,
          _id: place._id
        },
        setLocationBlocked: setLocationBlocked
      });
    } else if (place.verificado === 2) {
      setSelectedPlace(place);
      setShowConfirmation2(true);
      handleLocations(place);
    }
  };

  const formatDate = (dateString, prefix) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${prefix} ${day}/${month}/${year}`;
  };

  const renderTabButton = (key, label) => (
    <TouchableOpacity
      key={key}
      style={[
        styles.tabButton,
        {
          borderBottomWidth: selected === key ? 3 : 1,
          borderBottomColor: selected === key ? "#1D7CE4" : "#ccc",
        },
      ]}
      onPress={() => setSelected(key)}
    >
      <Text style={{ 
        color: selected === key ? "#1D7CE4" : "#000", 
        fontSize: 14,
        fontWeight: selected === key ? 'bold' : 'normal' 
      }}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const tabs = [
    { key: "approved", label: screenTexts.ApprovedMenu },
    { key: "pendings", label: screenTexts.PendingsMenu },
    { key: "denied", label: screenTexts.DeniedMenu },
  ];

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />

      <View style={styles.menuContainer}>
        {tabs.map(tab => renderTabButton(tab.key, tab.label))}
      </View>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          data[selected]?.map((item, index) => (
            <TouchableOpacity key={item._id || index} onPress={() => handlePressPlace(item)}>
              <View style={styles.card}>
                <Image style={styles.imagen} source={{ uri: item?.avatar?.url || '' }} />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={styles.cardText} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                  <Text style={styles.dateText}>{formatDate(item.create, screenTexts.UploadDate)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <InfoModal
        celebration={true}
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false);
          setWinKylets(0);
        }}
        Title={winKyletsText}
        Subtitle={screenTexts.KyletsSubtitle}
        Button={screenTexts.KyletsButton}
      />

      <ErrorModal
        isOpen={showConfirmation2}
        onClose={() => setShowConfirmation2(false)}
        Pass={() => navigation.navigate('AddMarket', {
          func: setLugar,
          lugar: lugar,
          pass: handleCreateUbi,
          Onboarding: true,
          mode: true,
          setPhotos: setPhotos,
          setUrls: setUrls,
          photos: photos
        })}
        Subtitle={selectedPlace?.reason || []}
      />

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEAEA',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 5 },
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagen: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25
  },
  cardText: {
    fontSize: 20,
    color: "#333",
    fontWeight: 'bold',
    maxWidth: '90%'
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
});

export default LocationPending;
