import React from 'react';
import { Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import warning from '../../../assets/warning.png'


const Error = ({ message, func }) => {

  return (
    <TouchableOpacity style={styles.error} onPress={()=> func(false)}>
        <Image source={warning} style={styles.image}/>
        <Text style={styles.errorTexto}>{message}</Text>
        <Text style={styles.x}>X</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  
    error:{
        position: 'absolute',
        width:'98%',
        backgroundColor:'rgba(255, 0, 0, 0.8)',
        marginTop:40,
        height:40,
        borderRadius:10,
        justifyContent: 'center',
        alignSelf: 'center',
        flexDirection: 'row',

    },
    image:{
        width: 20,
        height:20,
        alignSelf: 'center',
        marginRight: 10
    },
    errorTexto:{
        color:'white',
        alignSelf: 'center',
        fontWeight:'600',
    },
    x:{
        position: 'absolute',
        top: 5,
        right: 10,
        color: 'white'
    }
});

export default Error;
