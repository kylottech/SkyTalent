import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { getListInfo } from '../../../services/walletServices';
import { getMinInfo } from '../../../services/mapsService';
import MapContainer from '../../../components/Maps/MapContainer';
import List from '../../../components/Blocks/Experiences/List';
import LocationInfo from '../../../components/Maps/LocationInfo';
import Loader from '../../../components/Utils/Loader';
import Error from '../../../components/Utils/Error';
import Confirmacion from '../../../components/Utils/Confirmacion';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';



const OtherExperience = ({route}) => {
  const navigate=useNavigation();
  const { isLogged, isLoading, logout } = useUser();
  const mapRef = useRef(null);
  const [mapVisible, setMapVisible] = useState(false);
  const [locationBlocked, setLocationBlocked] = useState(false)
  const [mapUbis, setMapUbis] = useState([])
  const [info, setInfo] = useState({})
  const [infoVisible, setInfoVisible] = useState(false)
  const [locationInfo, setLocationInfo]= useState({})
  const [locationInfoVisible, setLocationInfoVisible]= useState(false)
  const [origin, setOrigin] = useState({
    latitude: 41.248198,
    longitude:-4.725757
  });
  const [first, setFirst] = useState({
    latitude: 41.248198,
    longitude:-4.725757
  });
  const [control, setControl] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');

  useEffect(() => {
    if (mapVisible && control) {
      const interval = setInterval(() => {
        if (mapRef.current) {
          handlePress(first.latitude, first.longitude);
          setControl(false);
          setLoading(false);
          clearInterval(interval);
        }
      }, 100); 

      return () => clearInterval(interval);
    }
  }, [mapVisible, control]);


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const handlePress = (latitude, longitude) => { 
    if(mapVisible && mapRef.current){
      const region = { 
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.050, 
        longitudeDelta: 0.050 
      };
      mapRef.current.animateToRegion(region, 500);
    }
    else if(!mapVisible){
      setMapVisible(true)
      setLoading(true)
      setControl(true)
      setFirst({ 
        latitude: latitude,
        longitude: longitude})
    }
  };
  
  const handleInfoLists = async () => {
    try {
      getListInfo({_id: route.params._id}, logout)
        .then((response) => {
          if (response) {
            setMapUbis(transformLocationMap(response.list.places))
            response.list.places = transformLocationList(response.list.places)
            setInfo(response)
            setInfoVisible(true)
          }
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true)
      setErrorMessage(error.message)
    }
  };
 
  const transformLocationMap = (data) => {
    return data.map(item => {
      if (item.location && item.location.coordinates && item.location.coordinates.length === 2 && !item.blocked) {
        return {
          _id: item._id,
          location: {
            latitude: item.location.coordinates[1],
            longitude: item.location.coordinates[0]
          }
        };
      }
      return null; // También puedes devolver null explícitamente en lugar de dejar undefined
    }).filter(Boolean); // Filtra los valores null/undefined
  };
  

  const transformLocationList = (data) => {
    return data.map(item => {
      // Si la propiedad `coordinates` existe, transformarla
      if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
        if(item.blocked){
          return {
            blocked: true
          };
        }
        else{
          return {
            _id: item._id,
            name: item.name,
            blocked: item.blocked,
            location: {
              latitude: item.location.coordinates[1], // Asumimos que el primer valor de `coordinates` es el `longitude`
              longitude: item.location.coordinates[0] // Y el segundo es el `latitude`
            }
          };
        }
        
      }
    });
  };

  const handleGetMinInfo = async (_id) => {
    if(!loading){
      try {
        setLoading(true)
        getMinInfo(_id, logout)
          .then((response) => {
            if (response) {
              setLocationInfo(response)
              setLocationBlocked(response.locationBlocked)
              setLocationInfoVisible(true)
              setLoading(false)
            }
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true)
        setErrorMessage(error.message)
        setLoading(false)
      }
    }
    
  };

  useEffect(() => {
    
    handleInfoLists()
    
  },[])


  return (
    <View style={styles.container}>
        {infoVisible ? (
          <>
            <List 
              info={info} 
              loading= {loading}
              setLoading={setLoading}
              onPress={handlePress} 
              setError={setError} 
              setErrorMessage={setErrorMessage} 
              setConfirmacion={setConfirmacion} 
              setConfirmacionMensaje={setConfirmacionMensaje}
            />

            {mapVisible &&
              <View style={styles.mapContainer}>
                <MapContainer 
                  ref={mapRef} 
                  origin={origin} 
                  type={'View'} 
                  ciudad={'Madrid'}
                  locations={mapUbis}
                  onPress={handleGetMinInfo}
                  setError={setError} 
                  setErrorMessage={setErrorMessage}
                  setLoading={setLoading}
                />
              </View>
            }

            {locationInfoVisible &&
              <View style={styles.infoContainer}>
                <LocationInfo 
                  close={() => setLocationInfoVisible(false)} 
                  expand={() => navigate.navigate('Place', {locationInfo: locationInfo, setLocationBlocked: setLocationBlocked})}
                  info={locationInfo}
                  locationBlocked={locationBlocked} 
                />
              </View>
            }
          </>
        )
        :
        (<Loader/>)}

        {error &&

          <Error message={errorMessage} func={setError} />

        }

        {confirmacion &&

          <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

        }

        {loading && (
          <LoadingOverlay/>
        )}
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  infoContainer: {
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
  },
  error: {
    position: 'absolute',
    width: '98%',
    backgroundColor: '#FF3B30',
    marginTop: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  errorTexto: {
    color: '#FFFFFF',
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  confirmacion: {
    position: 'absolute',
    width: '98%',
    backgroundColor: '#34C759',
    marginTop: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  confirmacionTexto: {
    color: '#FFFFFF',
    alignSelf: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default OtherExperience;
