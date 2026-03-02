import React, { useEffect, useState  } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { weeklyData } from '../../services/roulleteService';
import { myInfo } from '../../services/profileService';
import { formatString } from '../../utils/formatString'
import Top from '../../components/Utils/Top';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import Regalo from "../../components/Utils/Regalo";
import tickGris from '../../../assets/tickGris.png';
import tickBlanco from '../../../assets/tickBlanco.png';
import Error from '../../components/Utils/Error';

const Weekly = () => {
    const navigate=useNavigation()
    const { isLogged, isLoading, logout, texts } = useUser();
    const screenTexts = texts.pages.WeeklyProgress.Weekly
    const [photo, setPhoto] = useState('')
    const [cantidad, setCantidad] = useState(0);
    const [kylets, setKylets] = useState(0)
    const [semana, setSemana] = useState([false, false, false, false, false, false, false])
    const [dias, setDias] = useState(['L', 'M', 'X', 'J', 'V', 'S', 'D'])
    const [showCongratulations, setShowCongratulations] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Errorrr');

    const handleMyInfo = async () => {
      try {
        
        myInfo(logout)
          .then((response) => {
            setPhoto(response.avatar.url)
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

    useEffect(() => {
      handleMyInfo()
    }, []);

    const handleWeekly = async () => {
      try {
        
        weeklyData(logout)
          .then((response) => {
            setKylets(response.kylets)
            const data = response.info
            const sorted = data.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Guardamos cogido y day en sus respectivos arrays
            const semanaArray = sorted.map(item => item.cogido);
            const diasArray = sorted.map(item => { 
                // Convertimos el "day" en letras (opcional, si quieres 'L', 'M', etc)
                const dayMap = {
                    monday: screenTexts.Monday,
                    tuesday: screenTexts.Tuesday,
                    wednesday: screenTexts.Wednesday,
                    thursday: screenTexts.Thursday,
                    friday: screenTexts.Friday,
                    saturday: screenTexts.Saturday,
                    sunday: screenTexts.Sunday
                };
                return dayMap[item.day.toLowerCase()];
            });

            semanaArray[semanaArray.length - 1] = true

            
            setSemana(semanaArray)
            setDias(diasArray)
            setCantidad(response.count)
            
            
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

    useEffect(() => {
      handleWeekly()
    }, []);

    if (showCongratulations) {
      // Pantalla de felicitación
      return (
        <View style={styles.container2}>
          <Top
          typeCenter={"Text"}
          textCenter={screenTexts.Top}
        />
          <View style={styles.congratulationsContainer}>
            <Regalo numero= {kylets} />
            <Text style={styles.congratulationsText}>{screenTexts.Title}</Text>
            <Text style={styles.congratulationsSubText}>
              {formatString(screenTexts.Subtitle, { variable1: kylets })}
            </Text>
            
            
          </View>
          <View style={{position: 'absolute', bottom: 20, alignSelf: 'center'}}>
            <HorizontalSlider text={screenTexts.ClaimHorizontalSlider} size='Big' color='blue'  onPress={() => navigate.navigate('Home')} />
          </View>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <Top 
          typeCenter={'Text'} textCenter={screenTexts.Top}
      />

      <View style={styles.content}>
        <View style={styles.info}>
            {/*Imagen*/}
            <Image source={{uri: photo}} style={styles.imagen}/>
            <Text style={styles.texto1}>{formatString(cantidad == 1 ? screenTexts.Day : screenTexts.Days, { variable1: cantidad })}</Text>
            <Text style={styles.texto2}>{screenTexts.Title2}</Text>
            <View style={styles.daysContainer}>
                { 
                    semana.map((item, index) => (
                        <View key={index} style={styles.dayContainer}>
                            <Text style={[styles.day, item ? styles.dayUnselected : styles.daySelected]}>{dias[index]}</Text>
                            { item ? (
                                <LinearGradient
                                    colors={[ '#1D7CE4' , '#004999' ]}
                                    start={[0, 0]}
                                    end={[1, 1]}
                                    style={styles.select}
                                >
                                    <Image source={tickBlanco} style={styles.tick}/>
                                </LinearGradient>
                            ):(
                                <View style={[styles.select, styles.selectFalse]}>
                                    <Image source={tickGris} style={styles.tick}/>
                                </View>
                            )}
                        </View>
                        
                    ))
                }
            </View>
            
            <HorizontalSlider text={screenTexts.ClaimHorizontalSlider} color='Blue' onPress={() => setShowCongratulations(true)} size={'Big'}/>
            <Text style={styles.title}>{screenTexts.Subtitle3}</Text>
            <Text style={styles.subtitle}>{screenTexts.Subtitle4}</Text>

        </View>
        

      </View>

      {error &&

        <Error message={errorMessage} func={setError} />

      }
      
        
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  info:{
    width: 325,
    backgroundColor: "white", 
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 20,

    //SOMBRAS PARA iOS
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 

    //SOMBRAS PARA ANDROID
    elevation: 10, 
  },
  imagen:{
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'blue',
    marginBottom: 25
  },
  texto1:{
    fontSize: 35,
    fontWeight: 'bold',
    color: '#1D7CE4'
  },
  texto2:{
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1D7CE4',
    marginBottom: 20
  },
  daysContainer:{
    width: '98%',
    height: 90,
    backgroundColor: "white", 
    padding: 20,
    borderRadius: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,

    //SOMBRAS PARA iOS
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 10, 

    //SOMBRAS PARA ANDROID
    elevation: 10, 
  },
  dayContainer:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  day:{
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  daySelected:{
    color: '#888'
  },
  dayUnselected:{
    color: '#1D7CE4'
  },
  select:{
    width: 30,
    height: 30,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  selectFalse:{
    backgroundColor: '#E7ECF3'
  },
  tick:{
    width: 15,
    height: 11
  },
  title:{
    fontSize: 12,
    marginTop: 20
  },
  subtitle:{
    color: '#1D7CE4',
    fontWeight: 'bold',
    fontSize: 18,
  },
  container2:{
    flex: 1,
    backgroundColor: 'white'
  },
  congratulationsContainer: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    //marginTop:'30%',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 80
  },
  congratulationsText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#AE9358",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  congratulationsSubText: {
    fontSize: 16,
    color: "#000000",
    textAlign: "center",
    marginBottom: 30,

  }, 
});

export default Weekly