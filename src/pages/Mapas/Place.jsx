import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { unblockCity, unblockPlace, getMinInfo } from '../../services/mapsService';
import CityBlock from '../../components/Maps/CityBlock';
import PlaceBlock from '../../components/Maps/PlaceBlock';
import PlaceInfo from '../../components/Maps/PlaceInfo';
import Error from '../../components/Utils/Error';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

const Place = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout } = useUser();

  // --- lee params de navegación (pueden venir de flujo normal o de notificación)
  const locationInfoParam = route?.params?.locationInfo || null;
  const incomingId = route?.params?._id || route?.params?.placeId || locationInfoParam?._id || null;
  const setLocationBlockedParam = route?.params?.setLocationBlocked;

  // --- fuente de la verdad local
  const [locationInfo, setLocationInfo] = useState(locationInfoParam);
  const [cityVisible, setCityVisible] = useState(locationInfoParam?.cityBlocked ?? true);
  const [placeVisible, setPlaceVisible] = useState(locationInfoParam?.locationBlocked ?? false);
  const [loading, setLoading] = useState(!locationInfoParam); // si no hay info, empezamos cargando
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Error');

  const placeId = useMemo(() => locationInfo?._id || incomingId, [locationInfo, incomingId]);

  // --- si cambia placeVisible y nos pasaron el setter por params, mantén compatibilidad
  useEffect(() => {
    if (placeVisible && typeof setLocationBlockedParam === 'function') {
      setLocationBlockedParam(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeVisible]);

  // --- redirige a login si no está logueado
  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading, navigate]);

  // --- NUEVO: si solo llegó un id, trae la info mínima y NO navegues
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!locationInfo && incomingId) {
        try {
          setLoading(true);
          const res = await getMinInfo(incomingId, logout); // <-- debe devolver { _id, city, country, cityPhoto, avatar, name, cityBlocked, locationBlocked, ... }
          if (!mounted) return;
          if (res) {
            setLocationInfo(res);
            setCityVisible(res?.cityBlocked ?? true);
            setPlaceVisible(res?.locationBlocked ?? false);
          }
          setLoading(false);
        } catch (e) {
          if (!mounted) return;
          setLoading(false);
          setError(true);
          setErrorMessage(e?.message || 'Error al cargar el lugar');
        }
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingId]);

  const handleUnblockCity = async () => {
    if (loading || !locationInfo) return false;
    setLoading(true);
    try {
      const ok = await unblockCity(
        { city: locationInfo.city, country: locationInfo.country },
        logout
      )
        .then(() => true)
        .catch((err) => {
          setError(true);
          setErrorMessage(err?.message || 'Error al desbloquear ciudad');
          return false;
        });
      setLoading(false);
      if (ok) setCityVisible(true);
      return ok;
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage(err?.message || 'Error al desbloquear ciudad');
      return false;
    }
  };

  const handleUnblockPlace = async () => {
    if (loading || !placeId) return false;
    setLoading(true);
    try {
      const ok = await unblockPlace({ _id: placeId }, logout)
        .then(() => true)
        .catch((err) => {
          setError(true);
          setErrorMessage(err?.message || 'Error al desbloquear lugar');
          return false;
        });
      setLoading(false);
      if (ok) setPlaceVisible(true);
      return ok;
    } catch (err) {
      setLoading(false);
      setError(true);
      setErrorMessage(err?.message || 'Error al desbloquear lugar');
      return false;
    }
  };

  return (
    <View style={styles.container}>
      {loading && <LoadingOverlay />}

      {!loading && locationInfo && !cityVisible && !placeVisible && (
        <CityBlock
          city={locationInfo.city}
          cityPhoto={locationInfo?.cityPhoto?.url}
          onPress={handleUnblockCity}
          pass={() => setCityVisible(true)}
        />
      )}

      {!loading && locationInfo && cityVisible && !placeVisible && (
        <PlaceBlock
          name={locationInfo.name}
          placePhoto={locationInfo?.avatar?.url}
          onPress={handleUnblockPlace}
          pass={() => setPlaceVisible(true)}
        />
      )}

      {!loading && placeVisible && placeId && (
        <PlaceInfo _id={placeId} infoPre={locationInfo} />
      )}

      {error && <Error message={errorMessage} func={setError} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', height: '100%', backgroundColor: 'white' },
  scrollContainer: { paddingBottom: 10 },
  fondo: { width: '100%', height: 175, marginBottom: 25 },
  containerProfile: { flexDirection: 'row', marginHorizontal: 20, justifyContent: 'space-between', marginBottom: 10 },
  containerDireccion: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20 },
  iconoMapa: { width: 15, height: 15, resizeMode: 'contain', marginRight: 5 },
  direccionTexto: { fontSize: 12, color: 'black' },
  imagesContainer: { flexDirection: 'row', alignItems: 'flex-end', width: '100%', marginHorizontal: 20, marginTop: 6 },
  friendsContainer: { flexDirection: 'row', marginTop: 7, marginLeft: 10 },
  friendImage: { width: 23, height: 23, borderRadius: 15, marginLeft: -10 },
  friendsText: { fontSize: 11, color: 'black', marginBottom: 5, marginLeft: 4 },
  nombre: { fontSize: 17, fontWeight: 'bold' },
  arroba: { fontSize: 14 },
  rating: { justifyContent: 'space-between', alignItems: 'center', marginVertical: 10, flexDirection: 'column' },
  textRating: { fontSize: 13, marginBottom: 20, color: 'gray' },
  slidersContainer: { flexDirection: 'row', marginBottom: 30, width: '100%', paddingHorizontal: 10 },
  sitiosParecidosContainer: { width: '48%', marginBottom: 20 },
  dubai: { flex: 1, width: '100%', height: '100%' },
  city: { fontSize: 35, color: 'white', alignSelf: 'center', marginTop: 55, fontWeight: 'bold' },
  kylets: { backgroundColor: 'white', position: 'absolute', top: 65, right: 20, width: 60, height: 30, borderRadius: 30, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
  corona: { width: 25, height: 25 },
  blur: { flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' },
  candado: { position: 'absolute', top: 250, right: 132 },
});

export default Place;
