import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";

import Top from '../../components/Utils/Top';

import arrow from '../../../assets/arrow_right.png'


const AjustesPerfil = ({route}) => {
  const navigate= useNavigation()
  const {isLogged, isLoading, logout, texts}=useUser()
  const screenTexts = texts.pages.AjustesPerfil.ajustesPerfil

  const { name, surname, photo, kylotId, cargo, frase, instagram,
    tikTok, whatsapp, banner, setName, setSurname, setKylotId, 
    setPhoto, setCargo, setFrase, setInstagram, setTikTok, 
    setWhatsapp, setBanner
  } = route.params;
  
  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading]);

  const handleDeleteToken = () => {
    logout()
    navigate.navigate('Login')
  }

  const editarPerfil =()=>{
    navigate.navigate('EditarPerfil', {
      nombre: name,
      surname: surname,
      imagen: photo,
      kylotId: kylotId, 
      cargo: cargo, 
      frase: frase,
      instagram: instagram,
      tikTok: tikTok,
      whatsapp: whatsapp,
      banner: banner,
      setName: setName,
      setSurname: setSurname,
      setKylotId: setKylotId,
      setPhoto: setPhoto,
      setCargo: setCargo,
      setFrase: setFrase,
      setInstagram: setInstagram,
      setTikTok: setTikTok,
      setWhatsapp: setWhatsapp,
      setBanner: setBanner,
    })
  }


  return (
    <View style={styles.container}>

        <Top 
          left={true} leftType={'Back'} 
          typeCenter={'Text'} textCenter={screenTexts.Top}
        />

        <ScrollView contentContainerStyle={styles.content}>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('LanguageSelector')}>
              <Text style={styles.textoOpciones}>{screenTexts.Language}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={editarPerfil}>
              <Text style={styles.textoOpciones}>{screenTexts.EditProfile}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('CompletarPerfil')}>
              <Text style={styles.textoOpciones}>Completar perfil</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('NotificacionesPerfil')}>
              <Text style={styles.textoOpciones}>{screenTexts.Notifications}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('CuentaPerfil')}>
              <Text style={styles.textoOpciones}>{screenTexts.Account}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('Privacidad')}>
              <Text style={styles.textoOpciones}>{screenTexts.Privacity}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('CodigoEmbajador')}>
              <Text style={styles.textoOpciones}>{screenTexts.Ambassador}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('Buzon')}>
              <Text style={styles.textoOpciones}>{screenTexts.Mailbox}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={() => navigate.navigate('Manifiesto')}>
              <Text style={styles.textoOpciones}>{screenTexts.Manifiesto}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} /*onPress={() => navigate.navigate('CuentaPerfil')}*/>
              <Text style={styles.textoOpciones}>{screenTexts.Card}</Text>
              <Image style={styles.iconoArrow} source={arrow}/>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botonOpciones} onPress={handleDeleteToken}>
              <Text style={styles.cerrarSesion}>{screenTexts.LogOut}</Text>
          </TouchableOpacity>
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
    flex:1,
    width: '100%',

    alignSelf: 'center',
    paddingHorizontal:23,
  },
  botonOpciones:{
    borderBottomColor: '#E7ECF3',
    borderBottomWidth: 1,

    paddingVertical:16,

    flexDirection:'row',
  },
  textoOpciones:{
    fontSize:20,
  },
  iconoArrow:{
    width:30,
    height:30,

    marginLeft:'auto',
    marginRight:-5,
  },
  cerrarSesion:{
    fontSize:20,

    color:'red',
  }
});

export default AjustesPerfil;