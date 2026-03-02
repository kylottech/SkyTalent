import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import icono from '../../../assets/confirmacion.png'



const Confirmacion = ({ message, func }) => {

  return (
    <TouchableOpacity style={styles.confirmacion} onPress={()=> func(false)}>
        <LinearGradient
            colors={[ '#52c234', '#0f9b0c']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradient}
        >
            
            <Image source={icono} style={styles.image}/>
            <Text style={styles.confirmacionTexto}>{message}</Text>
            
        </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  
    
    gradient:{
        flex: 1,
        borderRadius: 10,
        height:40,
        justifyContent: 'center',
        flexDirection: 'row'
    },
        
  confirmacion:{
    position: 'absolute',
    width:'98%',
    marginTop:40,
    height:40,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  image:{
      width: 20,
      height:20,
      alignSelf: 'center',
      marginRight: 10
  },
  confirmacionTexto:{
    color:'white',
    alignSelf: 'center',
    fontWeight:'600',
  },
});

export default Confirmacion;
