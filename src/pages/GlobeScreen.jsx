import React, { useEffect, useState, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { formatString } from '../utils/formatString'
import { View, StyleSheet, TouchableOpacity, Image, Text } from 'react-native';
import { bola } from '../services/mapsService';
import { createPlace, createMoment } from '../services/mapsService';
import { weeklyOpen } from '../services/roulleteService';
import Globe from '../components/Maps/Globe';
import Loader from '../components/Utils/Loader';
import InfoModal from '../components/Utils/InfoModal';
import Error from '../components/Utils/Error';
import Confirmacion from '../components/Utils/Confirmacion';
import Top from '../components/Utils/Top';
import corona from '../../assets/CORONA_DORADA.png';

const GlobeScreen = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.GlobeScreen;

  const lugarRef = useRef();
  const photosRef = useRef();
  const urlsRef = useRef();

  const [cargando, setCargando] = useState(true);
  const [locations, setLocations] = useState([]);
  const [lugar, setLugar] = useState({
    name: '',
    categoria: {},
    experiencia: '',
    amigo: [],
    recomendacion: '',
    nota: 0,
    location: { latitude: 0, longitude: 0 },
    momento: false
  });
  const [photos, setPhotos] = useState([]);
  const [urls, setUrls] = useState([]);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  const transformLocation = (data) => {
    return data.map(item => {
      if (!item.type) {
        item.type = 'location';
      }
      if (item.location?.coordinates && Array.isArray(item.location.coordinates) && item.location.coordinates.length === 2) {
        return {
          _id: item._id,
          type: item.type,
          location: {
            latitude: item.location.coordinates[1],
            longitude: item.location.coordinates[0],
          }
        };
      }
      return item;
    });
  };

  const handleGetPlaces = async () => {
    try {
      const response = await bola(logout);
      const transformed = transformLocation(response.locations);
      setLocations(transformed);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    } finally {
      setCargando(false);
    }
  };

  const handleCreateUbi = async ({ errorBolean, errorMensaje, setLoading2 }) => {
    const lugar = lugarRef.current;
    const photos = photosRef.current;
    const urls = urlsRef.current;

    try {
      if (photos.length > 10) {
        errorBolean(true);
        errorMensaje(screenTexts.PhotoAumontError);
        setLoading2(false);
        return;
      }
      if (
        lugar.name.trim() &&
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
          urls,
          newPhotos: photos
        };

        const res = await createPlace(payload, logout, errorMensaje);
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
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.LocationConfirmation);
        setLoading2(false);
        // Stay on current screen
        setWinKylets(res.kylets);
      } else {
        if (lugar.name === '') {
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
        errorBolean(true);
        setLoading2(false);
      }
    } catch (error) {
      errorBolean(true);
      errorMensaje(error.message);
      setLoading2(false);
    }
  };

  const handleCreateMoment = async ({ errorBolean, errorMensaje, setLoading2 }) => {
    const lugar = lugarRef.current;
    const photos = photosRef.current;
    const urls = urlsRef.current;

    try {
      if (!((photos.length === 1 && urls.length === 0) || (photos.length === 0 && urls.length === 1))) {
        errorBolean(true);
        errorMensaje(screenTexts.AmountMomentError);
        setLoading2(false);
        return;
      }
      if (
        lugar.name.trim() &&
        lugar.location.longitude >= -180 && lugar.location.longitude <= 180 &&
        lugar.location.latitude >= -90 && lugar.location.latitude <= 90
      ) {
        const payload = {
          name: lugar.name,
          location: lugar.location,
          urls,
          newPhotos: photos
        };

        const res = await createMoment(payload, logout, errorMensaje);
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
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.MomentConfirmation);
        setLoading2(false);
        // Stay on current screen
        setWinKylets(res.kylets);
      } else {
        if (!lugar.name.trim()) {
          errorMensaje(screenTexts.NameError);
        } else if (
          lugar.location.longitude < -180 || lugar.location.longitude > 180 ||
          lugar.location.latitude < -90 || lugar.location.latitude > 90
        ) {
          errorMensaje(screenTexts.LocationError);
        } else {
          errorMensaje(screenTexts.FieldsErrorMessages);
        }
        errorBolean(true);
        setLoading2(false);
      }
    } catch (error) {
      errorBolean(true);
      errorMensaje(error.message);
      setLoading2(false);
    }
  };

  const handleCreate = () => {
    const handleCreateDispatcher = async ({ errorBolean, errorMensaje, setLoading2 }) => {
      const isMoment = lugarRef.current?.momento === true;
      if (isMoment) {
        await handleCreateMoment({ errorBolean, errorMensaje, setLoading2 });
      } else {
        await handleCreateUbi({ errorBolean, errorMensaje, setLoading2 });
      }
    };

    navigate.navigate('AddMarket', {
      func: setLugar,
      lugar,
      pass: handleCreateDispatcher,
      mode: true,
      setPhotos,
      setUrls
    });
  };

  const handlePress = () => {
    handleGetPlaces();
  };

  const handleWeekly = async () => {
    try {
      const result = await weeklyOpen(logout);
      if (!result) {
        navigate.navigate("Weekly");
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    if (winKylets !== 0) {
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }));
      setShowConfirmation(true);
    }
  }, [winKylets]);

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
    handleGetPlaces();
  }, []);

  useEffect(() => {
    if (isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    handleWeekly();
  }, []);

  return (
    <View style={styles.container}>
      {cargando ? (
        <Loader />
      ) : (
        <>
          <View style={styles.topDark}>
            <Text style={styles.textWhite}>{screenTexts.Top}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigate.navigate('Home')}
            style={{
              height: 30,
              width: 100,
              borderRadius: 50,
              borderColor: '#1D7CE4',
              borderWidth: 2,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'center'
            }}
          >
            <Text style={{ color: 'white' }}>{screenTexts.HomeTouchable}</Text>
          </TouchableOpacity>

          {/* Globe se muestra incluso si locations está vacío */}
          <Globe locations={locations} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleCreate}>
              <View style={styles.circulo}>
                <Image source={corona} style={styles.corona} />
              </View>
            </TouchableOpacity>
            <Text style={styles.text}>{screenTexts.AddLocationTouchable}</Text>
          </View>

          <InfoModal
            celebration={true}
            isOpen={showConfirmation}
            onClose={() => { setShowConfirmation(false); setWinKylets(0); }}
            Title={winKyletsText}
            Subtitle={screenTexts.KyletsSubtitle}
            Button={screenTexts.KyletsButton}
          />
        </>
      )}

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: '4%',
    width: '100%',
    alignItems: 'center'
  },
  button: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#B5A363',
  },
  circulo: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 47,
    height: 47,
    borderRadius: 30,
    backgroundColor: '#E3D9C4'
  },
  corona: {
    width: 30,
    height: 30,
  },
  text: {
    color: 'white',
    marginTop: 10,
    fontWeight: 'bold'
  },
  topDark: {
    flexDirection: 'row',
    marginTop: 35,
    height: 64,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'black',
  },
  textWhite: {
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    letterSpacing: -0.3,
  }
});

export default GlobeScreen;
