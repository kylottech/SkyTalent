import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUser } from "../../context/useUser";

import {userCode} from '../../services/logServices';

import GradientButton from '../../components/Utils/GradientButton';
import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';

import invitacion from '../../../assets/Invitacion.png';


const Invitacion = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.Invitacion
  
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [codigo, setCodigo] = useState('');

  
  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);


  const handleSendCode = async () => {
    if (codigo !== '' ) {
      try {
        const id = await AsyncStorage.getItem('id');
        userCode({ id, codigo: codigo }, logout)
          .then(() => {
            navigate.navigate('Decision');
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
  };
  

  return (
    <View style={styles.container}>

      <Top left={true} leftType={'Back'} typeCenter={'Photo'}/>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={{flex: 1, width: '100%', alignItems: 'center'}}>
          <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
          <Text style={styles.textTelefono}>{screenTexts.SubTitle}</Text>


          <View style={styles.opcion} >
            <Image source={invitacion} style={styles.imagenOpcion}/>
            <View style={styles.lineaVertical}/>
            <TextInput
              placeholder={screenTexts.CodePlaceHolder}
              value={codigo}
              onChangeText={(text) => setCodigo(text)}
            />
          </View>

            <View style={styles.Enviar}>
              <Text style={styles.TextoEnviar}>{screenTexts.NoFunctionalCode}</Text>
              <TouchableOpacity>
                  <Text style={styles.botonTextoEnviar}>{screenTexts.SendCodeAgain}</Text>
              </TouchableOpacity>
            </View>

            
        </View>
        
        <View style={styles.buttonContainer}>
          <GradientButton 
            text={screenTexts.GradientButton}
            color='Blue' 
            onPress={handleSendCode} 
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
    marginTop:60,
  },
  textTelefono:{
    fontSize: 13,
    
    color: '#71717A',

    marginBottom:40,
    marginTop: 10,
    marginLeft: 0,
  },
  Enviar: {
    flexDirection: 'row',
    alignSelf:'flex-start',
    alignSelf: 'center'
  },
  TextoEnviar: {
    fontSize: 13,

    color: '#71717A'
  },
  botonTextoEnviar: {
    fontSize: 13,

    fontWeight:'700',
    color: '#71717A',
    textDecorationLine: 'underline',
  },
  buttonContainer:{
    width:'100%',

    marginBottom: 20,
    justifyContent: 'flex-end'
  },
  opcion: {
    width: '100%',
    height: 60,
    
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#D9D9D9',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Sombra en Android

    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  lineaVertical:{
    height: 25,

    borderColor: '#D9D9D9',
    borderWidth: 1,

    marginRight: 7,
    marginLeft: 8,
    marginVertical: 16,
  },
  imagenOpcion:{
    height: 40,
    width: 47,

    marginHorizontal: 9,
  },
});

export default Invitacion;