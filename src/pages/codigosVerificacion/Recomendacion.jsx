import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import Top from '../../components/Utils/Top';

import recomienda from '../../../assets/pinMenu.png';


const Recomendacion = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.Recomendacion
  

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);
  

  return (
    <View style={styles.container}>

      <Top left={true} leftType={'Back'} typeCenter={'Photo'}/>
      <ScrollView 
        contentContainerStyle={styles.content}
      > 
        <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
        <Text style={styles.textTelefono}>{screenTexts.SubTitle}</Text>

        <View style={styles.opcion}>
            <Image source={recomienda} style={styles.imagenOpcion}/>
            <Text style={styles.textoOpcion}>{screenTexts.FavoritePlaces}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <HorizontalSlider text={screenTexts.HorizontalSlider} color='Blue' onPress={() => navigate.navigate("AnadirRecomendacion")}/>
        </View>

      </ScrollView>
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
    marginTop:70,
  },
  textTelefono:{
    fontSize: 13,
    
    color: '#71717A',

    marginBottom:30,
    marginTop: 20,
    marginLeft: 5,
  },
  opcion: {
    width: '92%',
    height: 60,

    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#A7B0C0',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Sombra en Android
    
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  imagenOpcion:{
    height: 45,
    width: 30,

    marginHorizontal: 17.5,
  },
  textoOpcion: {
    fontSize: 12,
    
    fontWeight: 'bold',

    marginLeft:4,
  },
  buttonContainer:{
    flex: 1,
    width:'100%',

    justifyContent: 'flex-end',
    marginBottom: 20
  },
  
});

export default Recomendacion;