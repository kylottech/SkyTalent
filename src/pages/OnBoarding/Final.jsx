import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import ProgressBar from './ProgressBar';
import Top from '../../components/Utils/Top'
import HorizontalSlider from '../../components/Utils/HorizontalSlider'
import Error from '../../components/Utils/Error';
import {addTags} from '../../services/logServices';
import logo from '../../../assets/logoKylot.png';


const Final = ({ answers, onBack, progress }) => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.OnBoarding.Final
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const handleSendTags = async () => {
    
      
    try {
      addTags({tags: answers}, logout)
        .then(() => {
          navigate.navigate('Bienvenida')
          // Realiza cualquier otra acción tras el envío exitoso
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

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />
      
      <Top 
        left={true} leftType={'Back'} back={onBack}
        typeCenter={'Photo'} 
        right={false}
      />

      <View style={styles.info}>
        <View style={styles.content}>
        <Text style={styles.heading}>{screenTexts.Title}</Text>
        <Text style={styles.subheading}>
        {screenTexts.Subtitle}
        </Text>
      </View>

        <View style={styles.infographicContainer}>
          <Image style={styles.infographic} source={logo}/>
        </View>

      </View>
      

      <View style={styles.footer}>
          <HorizontalSlider color={'Blue'} text={screenTexts.StartingHorizontalSlider} onPress={handleSendTags} />
      </View>

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
    width: '100%',
  },
  info:{
    paddingHorizontal: 24,
    flexDirection: 'column',
    flex: 1,
    marginBottom: 80
  },
  content: {
    marginTop: 20,
    //marginBottom: 60
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 10,
  },
  subheading:{
    color: '#9d9d9d'
  },
  infographicContainer: {
    width: '100%',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  infographic: {
    width: 250,
    height: 80,
    borderRadius: 12,
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 12,
    color: '#9d9d9d',
    textAlign: 'center',
    maxWidth: 300,
  },
  footer: {
    paddingBottom: 0,
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center'
    //right: 16,
    //left: 16
  },
});

export default Final;
