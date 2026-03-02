import React, { useEffect, useState, useRef } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity,Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { useUser } from "../../context/useUser";

import { update, uploadImage, uploadbanner } from '../../services/profileService';

import Top from '../../components/Utils/Top';
import GradientButton from '../../components/Utils/GradientButton';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

import CambiarFoto from '../../../assets/CambiarFoto.png'

const EditarPerfil = ({route}) => {
  const navigate= useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.editarPerfil

  const [nombre, setNombre]=useState(route.params.nombre)
  const [surname, setSurname]=useState(route.params.surname)
  const [kylotId, setKylotId]=useState(route.params.kylotId)
  const [urlImagen, setUrlImagen]=useState(route.params.imagen)
  const [banner, setBanner] = useState(route.params.banner);
  const [cargo, setCargo]=useState(route.params.cargo)
  const [instagram, setInstagram]=useState(route.params.instagram)
  const [tikTok, setTikTok]=useState(route.params.tikTok)
  const [whatsapp, setWhatsapp]=useState(route.params.whatsapp)
  const [frase, setFrase]=useState(route.params.frase)
  const [selectedImage, setSelectedImage] = useState(null)

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');

  const selectedImageRef = useRef(null);


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    selectedImageRef.current = selectedImage;
  }, [selectedImage]);


  const guardarCambios = async ()=>{
    if(!loading){
      setLoading(true)
      try {
        await update(
          { 
            name: nombre, 
            surname: surname, 
            kylotId: kylotId, 
            cargo: cargo, 
            frase: frase, 
            whatsapp: whatsapp,
            tikTok: tikTok,
            instagram: instagram
          }, 
          logout
        )
          .then(() => {
            route.params.setName(nombre)
            route.params.setSurname(surname)
            route.params.setKylotId(kylotId)
            route.params.setCargo(cargo)
            route.params.setInstagram(instagram)
            route.params.setTikTok(tikTok)
            route.params.setWhatsapp(whatsapp)
            setConfirmacion(true)
            setConfirmacionMensaje(screenTexts.MessageConfirmation)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  }

  const uploadPhoto = async ({selectedImage})=>{
    if(!loading){
      setLoading(true)
      try {
        await uploadImage(selectedImage, setErrorMessage, setSelectedImage, logout)
          .then((res) => {
            setUrlImagen(res.url)
            route.params.setPhoto(res.url)
            setConfirmacion(true)
            setConfirmacionMensaje(screenTexts.MessageConfirmation)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  }

  const uploadBannerPhoto = async ({selectedImage})=>{
    if(!loading){
      setLoading(true)
      try {
        await uploadbanner(selectedImage, setErrorMessage, setSelectedImage, logout)
          .then((res) => {
            setBanner(res.url)
            route.params.setBanner(res.url)
            setConfirmacion(true)
            setConfirmacionMensaje(screenTexts.MessageConfirmation)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  }


  const handleImage = async () => { 
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setError(true)
      setErrorMessage(screenTexts.PermitsError);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      selectionLimit: 1,
      orderedSelection: true
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      uploadPhoto({selectedImage: result.assets[0]})
    } 
  }

  const handleBanner = async () => { 
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      setError(true)
      setErrorMessage(screenTexts.PermitsError);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      selectionLimit: 1,
      orderedSelection: true
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
      uploadBannerPhoto({selectedImage: result.assets[0]})
    } 
  }


  return (
    <View style={styles.container}>

        <Top 
          left={true} leftType={'Back'} 
          typeCenter={'Text'} textCenter={screenTexts.Top}
        />

        <ScrollView contentContainerStyle={styles.content}>

          <View style={styles.containerImagen}>

            <Image source={{uri: banner}} style={styles.baner}/>
            <View style={styles.perfilcontainer2}>
              <TouchableOpacity style={styles.circulo} onPress={handleBanner}>
                <Image source={CambiarFoto} style={styles.cambiarFoto}/>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleImage}>
                <Image source={{ uri: urlImagen }} style={styles.imagePerfil} />
                <Text style={styles.textoImagen}>{screenTexts.ProfilePicture}</Text>
            </TouchableOpacity>
            
                  

              
          </View>

          <View style={styles.containerOpciones}>
          <TextInput
                  style={styles.input}
                  placeholder={screenTexts.NamePlaceHolder}
                  value={nombre}
                  onChangeText={(text) => setNombre(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.SurnamePlaceHolder}
                  value={surname}
                  onChangeText={(text) => setSurname(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.KylotIdPlaceHolder}
                  value={kylotId}
                  onChangeText={(text) => setKylotId(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.TitlePlaceHolder}
                  value={cargo}
                  onChangeText={(text) => setCargo(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.SentencePlaceHolder}
                  value={frase}
                  onChangeText={(text) => setFrase(text)}
              />
              
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.InstagramPlaceHolder}
                  value={instagram}
                  onChangeText={(text) => setInstagram(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.TikTokPlaceHolder}
                  value={tikTok}
                  onChangeText={(text) => setTikTok(text)}
              />
              <TextInput
                  style={styles.input}
                  placeholder={screenTexts.WhatsappPlaceHolder}
                  value={whatsapp}
                  onChangeText={(text) => setWhatsapp(text)}
              />


              <GradientButton color='Blue' text={screenTexts.GradientButton}  onPress={guardarCambios}/>
          </View>
        
      
        </ScrollView>

        {error &&

        <Error message={errorMessage} func={setError} />

        }

        {confirmacion &&

        <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

        }
        {loading && (
          <LoadingOverlay/>
        )}

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
  containerImagen: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  imagePerfil:{
    width:120,
    height:120,

    borderRadius:60,

    marginTop: 27,
    alignSelf: 'center'
  },
  textoImagen: {
    fontSize:15,

    color:'#004999',

    marginTop:10,
    marginBottom:30,
    alignSelf: 'center',
  },
  containerOpciones:{
    flex:1,
    width:'100%',
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    width:'100%',
    height: 56,
    fontSize:16,
    backgroundColor: '#F8F9FA',
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius:12,
    marginBottom: 16,
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  baner:{
    width: '100%',
    height: 110,
    alignSelf: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  perfilcontainer2:{
    flex: 1,

    flexDirection: 'row',
    marginTop: -107,
    alignSelf: 'flex-end',
  },
  circulo:{
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cambiarFoto:{
    width: 18,
    height: 16,
  },
});

export default EditarPerfil;