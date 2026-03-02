import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';

import invitacion from '../../../assets/envelope_White.png';
import invitacionEspecial from '../../../assets/envelope_Black.png';
import recomienda from '../../../assets/pinMenu.png';


const Seleccion = () => {
  const navigate= useNavigation()
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.Seleccion
  

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

                <TouchableOpacity style={styles.opcion} onPress={()=> navigate.navigate('Invitacion')} >
                    <Image source={invitacion} style={styles.imagenOpcion2} resizeMode="contain"/>
                    <View style={styles.lineaVertical1}/>
                    <Text style={styles.textoOpcion}>{screenTexts.AccessMember}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.opcion} onPress={()=> navigate.navigate('InvitacionEspecial')} >
                    <Image source={invitacionEspecial} style={styles.imagenOpcion2} resizeMode="contain"/>
                    <View style={styles.lineaVertical2}/>
                    <Text style={styles.textoOpcion}>{screenTexts.AccessKylot}</Text>
                </TouchableOpacity>

                {/*<TouchableOpacity style={styles.opcion} onPress={()=> navigate.navigate('Recomendacion')} >
                    <Image source={recomienda} style={styles.imagenOpcion3}/>
                    <View style={styles.lineaVertical3}/>
                    <Text style={styles.textoOpcion}>{screenTexts.AccessLocations}</Text>
                </TouchableOpacity>*/}

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
        
        alignSelf: 'center',
        paddingHorizontal:16,
    },
    textContrasenia:{
        fontSize: 35,

        fontWeight: 'bold',

        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop:60,
    },
    textTelefono:{
        fontSize: 13,
        
        color: '#71717A',

        marginBottom:40,
        marginLeft: 10,
        marginTop: 10,
    },
    opcion: {
        width: '92%',
        height: 60,
        
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: 'white',
        borderColor: '#d9d9d9',
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 4, // Radio de la sombra
        elevation: 5, // Sombra en Android

        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 30,
    },
    lineaVertical1:{
        height: 25,

        borderColor: '#D9D9D9',
        borderWidth: 1,

        marginRight: 7,
        marginLeft: 8,
        marginVertical: 16,
    },
    lineaVertical2:{
        height: 25,
        
        borderColor: '#D9D9D9',
        borderWidth: 1,

        marginRight: 7,
        marginLeft: 4,
        marginVertical: 16,
    },
    lineaVertical3:{
        height: 25,

        borderColor: '#D9D9D9',
        borderWidth: 1,

        marginRight: 7,
        marginLeft: 3,
        marginVertical: 16,
    },
    imagenOpcion2:{
        height: 40,
        width: 47,

        marginHorizontal: 9,
    },
    imagenOpcion3:{
        height: 45,
        width: 30,

        marginHorizontal: 17.5,
    },
    textoOpcion: {
        fontSize: 10,

        fontWeight: 'bold',
         
        marginLeft:4,
    },

});

export default Seleccion;