import React, { useEffect, useState  } from 'react';
import { View, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import { getDecision } from '../../services/logServices';

import GradientButton from '../../components/Utils/GradientButton';
import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';

import corona from '../../../assets/previa.png';  


const Decision = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, setVerificacion, logout, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.Decision

  const [decision, setDecision] = useState(false);
  const [verificado, setVerificado] = useState(0);

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);


  const handleDecision = async () => {
    try {
        const res = await getDecision(logout); // Esperar la respuesta de la API
        
        setDecision(res.decision);
        setVerificado(res.verificado);
        setVerificacion(res.verificado);

        return res; // Devolver la respuesta
    } catch (error) {
        //console.error(error);
        setError(true);
        setErrorMessage(error.message);
        return null; // Devolver `null` en caso de error
    }
  };


  const handleNavigation = async () => {
    try {
        const result = await handleDecision();
        if (!result) return; // Si `result` es null, salir de la función

        if (result.decision && result.verificado === 2) {
          setVerificacion(3)
          navigate.navigate('DecisionPositiva');
        } else if (!result.decision && result.verificado === 2) {
          navigate.navigate('DecisionNegativa', {reason: result.reason});
        } else if (result.verificado === 1) {
          navigate.navigate('EsperarDecision');
        }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };


  return (
    <View style={styles.container}>

      <Top left={true} leftType={'Back'} typeCenter={'Photo'}/>
      <ScrollView 
        contentContainerStyle={styles.content}
      > 
        <View style={{flex: 1, width: '92%'}}>
          <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
          <Text style={styles.textTelefono}>{screenTexts.Subtitle}</Text>

          <View style={styles.decision}>
            <Image source={corona} style={styles.decisionTexto}/>
          </View>
        </View>
        


        <View style={styles.buttonContainer}>
          <GradientButton 
            text={screenTexts.CheckDecision}
            color='Blue' 
            onPress={handleNavigation} 
          />
        </View>
      </ScrollView>

      {error &&

      <Error message={errorMessage} func={setError} />

      }
        
        
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:'white',
  },
  content:{
    width:'100%',
    height: '100%',
        
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal:16,
  },
  textContrasenia:{
    fontSize: 27,
    
    fontWeight: 'bold',

    alignSelf: 'flex-start',
    marginHorizontal: 8,
    marginTop:50,
  },
  textTelefono:{
    fontSize: 13,
    
    color: '#71717A',

    alignSelf: 'flex-start',
    marginBottom:30,
    marginTop: 10,
    marginLeft: 8,
  },
  decision:{
    justifyContent: 'center',
    alignItems: 'center',
  },
  decisionTexto:{
    width: 300,  
    height: 300,

    marginTop: 30
  },
  buttonContainer:{
    width:'100%',

    justifyContent: 'flex-end',
    marginTop:50
  },

});

export default Decision;