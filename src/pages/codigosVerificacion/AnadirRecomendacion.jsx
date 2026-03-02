import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useUser } from "../../context/useUser";

import {savePlaces} from '../../services/logServices';

import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import MapContainer from '../../components/Maps/MapContainer';
import Top from '../../components/Utils/Top';
import AnadirLugar from '../../components/AnardirLugar';
import Error from '../../components/Utils/Error';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';


const AnadirRecomendacion = () => {
  const navigate= useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.AnadirRecomendacion

  const [loading, setLoading] = useState(false);
  const [lugar1, setLugar1] = useState(
    {
      name: screenTexts.RegularName,
      categoria:'',
      experiencia: '',
      amigo: [],
      recomendacion: '',
      nota: 0,
      location: {
        latitude: 0,
        longitude: 0,
      },
    momento: false
  });
  const [photos1, setPhotos1] = useState([]);
  const [urls1, setUrls1] = useState([]);
  const [lugar2, setLugar2] = useState({
    name: screenTexts.RegularName,
    categoria:'',
    experiencia: '',
    amigo: [],
    recomendacion: '',
    nota: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
    momento: false
  });
  const [photos2, setPhotos2] = useState([]);
  const [urls2, setUrls2] = useState([]);
  const [lugar3, setLugar3] = useState({
    name: screenTexts.RegularName,
    categoria:'',
    experiencia: '',
    amigo: [],
    recomendacion: '',
    nota: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
    momento: false
  });
  const [photos3, setPhotos3] = useState([]);
  const [urls3, setUrls3] = useState([]);
  const [lugar4, setLugar4] = useState({
    name: screenTexts.RegularName,
    categoria:'',
    experiencia: '',
    amigo: [],
    recomendacion: '',
    nota: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
    momento: false
  });
  const [photos4, setPhotos4] = useState([]);
  const [urls4, setUrls4] = useState([]);
  const [lugar5, setLugar5] = useState({
    name: screenTexts.RegularName,
    categoria:'',
    experiencia: '',
    amigo: [],
    recomendacion: '',
    nota: 0,
    location: {
      latitude: 0,
      longitude: 0,
    },
    momento: false
  });
  const [photos5, setPhotos5] = useState([]);
  const [urls5, setUrls5] = useState([]);
  
  const [loadedFromStorage, setLoadedFromStorage] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const locations = [lugar1, lugar2, lugar3, lugar4, lugar5]
  .filter((lugar) => lugar.location.latitude !== 0 && lugar.location.longitude !== 0)
  .map((lugar) => lugar.location);

  const lugaresRef = useRef({ lugar1, lugar2, lugar3, lugar4, lugar5 })   
  const photosRef = useRef({ photos1, photos2, photos3, photos4, photos5 }) 
  
  useEffect(() => {
    if (!loadedFromStorage) return;
    
    const saveToAsyncStorage = async () => {
      setLoading(true)
      try {
        const lugaresData = {
          lugar1,
          lugar2,
          lugar3,
          lugar4,
          lugar5,
          photos1,
          photos2,
          photos3,
          photos4,
          photos5,
        };
        await AsyncStorage.setItem('lugaresGuardados', JSON.stringify(lugaresData));
        setLoading(false)
      } catch (error) {
        console.error('Error al guardar lugares en AsyncStorage:', error);
      }
    };
    
    saveToAsyncStorage();
    

  }, [lugar1, lugar2, lugar3, lugar4, lugar5, photos1, photos2, photos3, photos4, photos5, loadedFromStorage]);

  useEffect(() => {
    const loadFromAsyncStorage = async () => {
      setLoading(true)
      try {
        const json = await AsyncStorage.getItem('lugaresGuardados');
        if (json !== null) {
          const data = JSON.parse(json);

          if (data.lugar1) setLugar1(data.lugar1);
          if (data.lugar2) setLugar2(data.lugar2);
          if (data.lugar3) setLugar3(data.lugar3);
          if (data.lugar4) setLugar4(data.lugar4);
          if (data.lugar5) setLugar5(data.lugar5);

          if (data.photos1) setPhotos1(data.photos1);
          if (data.photos2) setPhotos2(data.photos2);
          if (data.photos3) setPhotos3(data.photos3);
          if (data.photos4) setPhotos4(data.photos4);
          if (data.photos5) setPhotos5(data.photos5);
        }
        setLoading(false)
      } catch (error) {
        console.error('Error al cargar lugares desde AsyncStorage:', error);
      }finally {
        setLoadedFromStorage(true); // ✅ indica que ya se cargó
      }
    };
    
    loadFromAsyncStorage();
    
    
  }, []);


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    lugaresRef.current = { lugar1, lugar2, lugar3, lugar4, lugar5 };
  }, [lugar1, lugar2, lugar3, lugar4, lugar5]);

  useEffect(() => {
    photosRef.current = { photos1, photos2, photos3, photos4, photos5 };
  }, [photos1, photos2, photos3, photos4, photos5]);


  const handleSendUbis = async () => { 
    if (!loading) {
      setLoading(true);
      const { lugar1, lugar2, lugar3, lugar4, lugar5 } = lugaresRef.current;
      const lugares = [lugar1, lugar2, lugar3, lugar4, lugar5];
      const { photos1, photos2, photos3, photos4, photos5 } = photosRef.current;
      const allPhotos = [photos1, photos2, photos3, photos4, photos5];

      const lugaresValidos = lugares.every((lugar, index) => {
        const fotosLugar = allPhotos[index];
        return (
          lugar.name !== screenTexts.RegularName &&
          lugar.name.trim() !== '' &&
          lugar.categoria.trim() !== '' &&
          lugar.nota > 0 &&
          lugar.nota <= 7 &&
          lugar.location.longitude >= -180 &&
          lugar.location.longitude <= 180 &&
          lugar.location.latitude >= -90 &&
          lugar.location.latitude <= 90 &&
          fotosLugar.length > 0
        );
      });

      if (lugaresValidos) {
        try {
          const lugaresParaEnviar = lugares.map(lugar => ({
            name: lugar.name,
            categoria: lugar.categoria,
            experiencia: lugar.experiencia,
            amigo: lugar.amigo,
            recomendacion: lugar.recomendacion,
            nota: lugar.nota,
            location: lugar.location,
            urls: [] // Aquí urls ya no se usa, ya que se mandan todas como imágenes
          }));

          const res = await savePlaces({
            places: lugaresParaEnviar,
            newPhotosByPlace: allPhotos
          }, logout);

          setLoading(false);
          navigate.navigate('Decision');
        } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false);
        }
      } else {
        let errorDetails = [];

        lugares.forEach((lugar, index) => {
          const fotosLugar = allPhotos[index];

          if (lugar.name === screenTexts.RegularName || lugar.name.trim() === '') {
            errorDetails.push(screenTexts.NameError.replace('{{place}}', (index + 1)));
          }
          if (lugar.nota <= 0 || lugar.nota > 7) {
            errorDetails.push(screenTexts.ValorationError.replace('{{place}}', (index + 1)));
          }
          if (lugar.location.longitude < -180 || lugar.location.longitude > 180 || 
              lugar.location.latitude < -90 || lugar.location.latitude > 90) {
            errorDetails.push(screenTexts.LocationError.replace('{{place}}', (index + 1)));
          }
          if (fotosLugar.length === 0) {
            errorDetails.push(screenTexts.PhotosError.replace('{{place}}', (index + 1)));
          }
        });

        if (errorDetails.length > 0) {
          setErrorMessage(`${errorDetails.slice(0, 3).join('\n')}`);
        } else {
          setErrorMessage(screenTexts.LocationsError);
        }

        setError(true);
        setLoading(false);
      }
    }
  }


  return (
    <View style={styles.container}>

      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter={screenTexts.Top}
      />

      <ScrollView styles={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
        <Text style={styles.textTelefono}>{screenTexts.Subtitle}</Text>
        
        <MapContainer origin={{latitude:40.248198, longitude:-3.725757}} type={'View'} ciudad={'Madrid'} locations={locations} setError={setError} setErrorMessage={setErrorMessage} />
            
        
        <Text style={styles.texto}>{screenTexts.SelectedLocations}</Text>
        
        <AnadirLugar name2={screenTexts.RegularName} photos={photos1} setPhotos={setPhotos1} setUrls={setUrls1} lugar={lugar1} numero='1' setLugar={setLugar1} />
        <AnadirLugar name2={screenTexts.RegularName} photos={photos2} setPhotos={setPhotos2} setUrls={setUrls2} lugar={lugar2} numero='2' setLugar={setLugar2}/>
        <AnadirLugar name2={screenTexts.RegularName} photos={photos3} setPhotos={setPhotos3} setUrls={setUrls3} lugar={lugar3} numero='3' setLugar={setLugar3}/>
        <AnadirLugar name2={screenTexts.RegularName} photos={photos4} setPhotos={setPhotos4} setUrls={setUrls4} lugar={lugar4} numero='4' setLugar={setLugar4}/>
        <AnadirLugar name2={screenTexts.RegularName} photos={photos5} setPhotos={setPhotos5} setUrls={setUrls5} lugar={lugar5} numero='5' setLugar={setLugar5}/>

        <View style={styles.slideContainer}>
          <HorizontalSlider text={screenTexts.HorizontalSlider} color='Blue' onPress={handleSendUbis}/>
        </View>
      </ScrollView>

      

      {error &&

      <Error message={errorMessage} func={setError} />

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

    backgroundColor:'white',
    paddingHorizontal:16,
  },
  content:{
    width:'100%',
    
    alignSelf: 'center',
  },
  textContrasenia:{
    fontSize: 27,
    
    fontWeight: 'bold',

    alignSelf: 'flex-start',
    marginHorizontal: 8,
    marginTop:20,
  },
  textTelefono:{
    fontSize: 13,
    
    color: '#71717A',

    alignSelf: 'flex-start',
    marginBottom:30,
    marginTop: 10,
    marginLeft: 8,
  },
  texto:{
    fontSize: 16,

    fontWeight: 'bold',

    marginVertical:15
  },
  slideContainer:{
    width: '100%',

    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
});

export default AnadirRecomendacion;