import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';

import corona from '../../../assets/denegado.png';  


const DecisionNegativa  = ({route}) => {
  const navigate=useNavigation()
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.DecisionNegativa
  const { reason } = route.params
  

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  
  return (
    <View style={styles.container}>

      <Top  typeCenter={'Photo'}/>

      <ScrollView 
        contentContainerStyle={styles.content}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Image source={corona} style={styles.icon} />
            </View>
            <Text style={styles.modalTitle}>{screenTexts.Title}</Text>
            <Text style={styles.modalMessage}>
            {screenTexts.Subtitle}
            </Text>
            <TouchableOpacity onPress={() => navigate.navigate('WhyScreen', {reason: reason}) }>
              <Text style={styles.toucheable}>
                {screenTexts.WhyToucheable}
              </Text>
            </TouchableOpacity>
            
            
          </View>
        </View>


        <View style={styles.buttonContainer}>
          <HorizontalSlider 
            text={screenTexts.HorizontalSlider}
            color='Blue'  
            onPress={()=> navigate.navigate('Seleccion')}
          />
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
  },
  buttonContainer:{
    width:'100%',

    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    width:'100%',
    height: '100%',

    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',

    backgroundColor: '#fff',
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,

    paddingTop: 30,
    paddingBottom: 30,
    paddingHorizontal: 30,
  },
  modalIconContainer: {
    width: 200,
    height: 200,

    borderRadius: 100,

    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 28,

    fontWeight: '800',
    color: '#000',
    letterSpacing: -0.5,

    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,

    color: 'rgba(0,0,0,0.6)',
    lineHeight: 24,

    textAlign: 'center',
    marginBottom: 10
  },
  toucheable:{
    fontSize: 16,

    color: '#1D7CE4',
    lineHeight: 24,

    textAlign: 'center',
    marginBottom: 10
  },
  icon: {
    width: '100%',  
    height: '100%', 

    borderRadius: 100
  },

});

export default DecisionNegativa ;