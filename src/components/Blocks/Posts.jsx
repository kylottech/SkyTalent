import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, FlatList, Text } from 'react-native';
import { useUser } from "../../context/useUser";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { publicar, uploadImage } from '../../services/communityServices';
import IconImage from '../../../assets/images.png'; 
import adri from '../../../assets/adri.jpeg'

const NewPost = ({_id, setNumPublicaciones, setPosts, setError, setErrorMessage, setConfirmacion, setConfirmacionMensaje}) => {
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Blocks.Posts
  const [text, setText] = useState('');
  const [images, setImages] = useState([]);

  const uploadPhoto = async ({selectedImage, setErrorMessage, _id})=>{
    try {
      
      if(selectedImage){
        return await uploadImage(selectedImage, setErrorMessage, _id, logout)
          .then((res) => {
            return res
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
          });
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  }
  
  const handlePublicar = async ({_id, text}) => {
    try {
      publicar({community:_id, text: text}, logout)
        .then(async (res) => {
          let info = res
          setText('')
          
          if(images.length > 0){
            
            for(var i = 0; i < images.length; i++){
              info = await uploadPhoto({
                selectedImage: images[i], 
                setErrorMessage: setErrorMessage, 
                _id: res._id})
            }
            
            setNumPublicaciones(prevNum => prevNum + 1)
            setPosts(prevPublicaciones => [info, ...prevPublicaciones])
            setImages([])
            
            
          }
          else{
            setNumPublicaciones(prevNum => prevNum + 1)
            setPosts(prevPublicaciones => [res, ...prevPublicaciones])
          }
          setConfirmacionMensaje(screenTexts.UploadedPostConfirmation)
          setConfirmacion(true)
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
  
  // Función para agregar una nueva imagen 
  const handleAddImage = async () => {
    // Solicitar permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setError(true);
      setErrorMessage(screenTexts.PermissionError);
      return;
    }

    // Abre el selector de imágenes
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo imágenes
      allowsEditing: true, 
      quality: 1, // Calidad máxima de la imagen
    });

    // Si el usuario selecciona una imagen
    if (!pickerResult.canceled) {
      
      setImages([...images, pickerResult.assets[0].uri]); // Agregar la imagen seleccionada al estado
    }
  }

  // Función para eliminar una imagen
  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    //cambiar icono de eliminar imagen
  }

  const handlePost = () => {
    handlePublicar({_id: _id, text: text})
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          placeholder={screenTexts.PostPlaceHolder}
          placeholderTextColor="#A9A9A9"
          multiline
          value={text}
          onChangeText={setText}
        />
        
      </View>

      {/* Lista de imágenes añadidas */}
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        contentContainerStyle={styles.imagesContainer}
        renderItem={({ item, index }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity style={styles.removeButton} onPress={() => handleRemoveImage(index)}>
              {/* Imagen para quitar */}
              {/*<Image source={IconImage} style={styles.removeImage} />*/}
            </TouchableOpacity>
          </View>
        )}
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddImage}>
          <Image source={IconImage} style={styles.addImage} />
        </TouchableOpacity>

        
      </View>
      <View style={styles.buttons2}>
        <View style={{flexDirection: 'row'}}>
          <Image source={adri} style={styles.imagePublish} />
          <View style={{flexDirection: 'column'}}>
            <Text style={{fontSize: 10, color: '#9d9d9d'}}>{screenTexts.PublishText}</Text>
            <Text style={{fontSize: 12}}>Pablo Izquierdo</Text>{/*coger nombre de bbdd */}
          </View>
        </View>
        <TouchableOpacity style={styles.addButton2} onPress={handlePost}>
          <LinearGradient
            colors={[ '#004999', '#1D7CE4']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.addButton2}
          >
            <Text style={{fontSize: 12, color: 'white'}}>{screenTexts.Post}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 10,
    padding: 10,
    margin: 15,
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Sombra en Android
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    padding: 8,
  },
  buttons: {
    flexDirection: 'row',
  },
  buttons2: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  imagePublish:{
    width: 35,
    height:35,
    borderRadius: 20, 
    marginRight: 10
  },
  addButton: {
    alignSelf: 'flex-start',
    borderRadius: 40,
    borderColor: '#9e9e9e',
    borderWidth: 1,
    width: 40,
    height: 40,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  addButton2: {
    justifyContent: 'space-between',
    backgroundColor: '#1D7CE4',
    width: 70,
    height:30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  addImage: {
    width: 25, 
    height: 25,
  },
  imagesContainer: {
    marginTop: 10,
    marginBottom: 15
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 5,
  },
  removeButton: {
    position: 'absolute',
    top: 1,
    right: 2,
    backgroundColor: 'black',
    borderRadius: 30,
    width: 20, 
    height: 20,
  },
  removeImage: {
    width: 20, 
    height: 20,
  },
});

export default NewPost;