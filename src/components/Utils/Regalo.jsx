import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import RegaloAzul from '../../../assets/RegaloAzul.png';
import corona from '../../../assets/CORONA_DORADA.png';

const Regalo = ({ numero }) => {
    return (
      <View style={styles.container}>

        <Image source={RegaloAzul} style={styles.imagenFondo}/>
        <Image source={corona} style={styles.imagenInterna} />
        <Text style={styles.numero}>{numero}</Text>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      width: 160,
      height: 175,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative', 
    },
    imagenFondo: {
      width: 160,
      height: 175,
      resizeMode: 'contain',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imagenInterna: {
      width: 50,
      height: 50,
      resizeMode: 'contain',
      position: 'absolute', 
      top:'55%',
      left:'17%',
    },
    numero: {
      position: 'absolute',
      fontSize: 45,
      fontWeight: 'bold',
      color: '#004999',
      padding: 5,
      borderRadius: 5,
      top:'50%',
      left:'46%',
    },
  });
  

export default Regalo;
