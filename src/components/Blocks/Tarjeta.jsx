import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useUser } from "../../context/useUser";
import FlipCard from 'react-native-flip-card';
import firmaLeonardo from '../../../assets/firmaLeonardo.png'


const Tarjeta = (props) => {
  const { texts }=useUser()
  const screenTexts = texts.components.Blocks.Tarjeta

  return (
    <FlipCard
        flipHorizontal={false}
        flipVertical={true}
        style={styles.flipCard}
    >
        <View style={styles.tarjeta}>
            <Text style={styles.categoriaText}>#{props.numero + 1}</Text>
            <Text style={styles.titularTarjeta}>{screenTexts.QuestionText}</Text>

        </View>

        <View style={styles.tarjetaDetras}>

            <Text style={styles.respuesta}>{screenTexts.AnswerText}</Text>
            <Image style={styles.firmaLeonardoTarjeta} source={firmaLeonardo}/>
            

        </View>
        </FlipCard>
    


  );
};

const styles = StyleSheet.create({
    tarjeta:{
        width:'95%',
        height:250,
        alignSelf:'center',
        marginBottom:10,
        borderRadius:16,
        marginHorizontal: 10,
        borderColor: '#9d9d9d',
        borderWidth: 0.5,
        backgroundColor: 'white',
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 4, // Radio de la sombra
        elevation: 5, // Sombra en Android
      }
      ,
      categoria:{
        width:100,
        height:25,
        marginTop:25,
        alignSelf:'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'white',
        paddingbottom:10,
        marginbottom:10,
        justifyContent:'center',
        alignItems:'center',

      },
      categoriaText:{
        fontSize:15,
        color:'black',
        alignSelf: 'flex-end'
      },
      tarjetaDetras:{
        width:'95%',
        height:250,
        alignSelf:'center',
        marginBottom:10,
        borderRadius:16,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent:'center',
        borderColor: '#9d9d9d',
        borderWidth: 0.5,
        backgroundColor: 'white',
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 4, // Radio de la sombra
        elevation: 5, // Sombra en Android
      },
      peg: {
        width:40,
        height:30,
        position:'absolute',
        top:65,
        left:30,
      },
      titularTarjeta:{
        fontSize:40,
        paddingTop:80,
        marginHorizontal:9,
        
        
        textAlign: 'center',
        alignSelf: 'center',

      },
      barraTarjeta:{
        marginTop:20,
        width:'100%',
        backgroundColor:'black',
        height:40,
      },
      firmaLeonardoTarjeta:{
        width:100,
        height:30,
        position:'absolute',
        left:20,
        bottom:20,
      },
      logoKylot:{
        width:150,
        height:40,
        position:'absolute',
        top:60,
        left:80,
      },
      huecoSingapur:{
        backgroundColor:'white',
        width:230,
        height:30,
        marginLeft:13,
        marginTop:10,
        borderRadius:10,
        
      },
      numeroTarjeta:{
        fontSize:14,
        marginLeft:20,
        marginTop:10,
        fontWeight:'700'
      },
      
      respuesta:{
        fontSize:20,
        color:'white',
        //marginTop:120,
        alignSelf:'center',
        textAlign:'center',
        marginHorizontal:9,
        justifyContent: 'center',
       

      }
  

});

export default Tarjeta;