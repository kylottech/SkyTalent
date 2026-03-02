import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ImageBackground, TouchableOpacity, Modal, Animated } from 'react-native';
import { useUser } from "../../context/useUser";
import * as ImagePicker from 'expo-image-picker';
import { history, seen, uploadPhoto } from '../../services/communityServices';

const StoriesScroll = ({ data, subir, mine, setImages, setPhotos, llamada, setError, setErrorMessage, setConfirmacion, setConfirmacionMensaje }) => {
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Utils.Stories
  const [histories, setHistories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const progress = useRef(new Animated.Value(0)).current;
  const startTime = useRef(0);
  const lastTime = useRef(0);
  const totalDuration = 5000;

  const handleAddPhoto = (url) => {
    setImages(prevImages => {
      const isPerfil = prevImages.length === 0

      setPhotos(prevImages => [
        ...prevImages,
        { url: url, perfil: isPerfil }
      ])

      return [
      ...prevImages,
      { url: url, perfil: isPerfil }
      ]
    })
  }
  
  useEffect(() => {
    if (modalVisible) {
      startProgress();
    }
  }, [selectedImageIndex, modalVisible]);

  useEffect(() => {
    if (modalVisible && histories.length > 0) {
      const currentImage = histories[selectedImageIndex];
      if (currentImage) {
        handleSeen(currentImage._id);  // Llamada a handleSeen con el _id de la imagen
      }
    }
  }, [selectedImageIndex, modalVisible, histories]);

  const startProgress = () => {
    startTime.current = Date.now();
    lastTime.current = 0; // Reseteamos el tiempo de pausa
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: totalDuration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });
  };

  const stopProgress = () => {
    const elapsedTime = Date.now() - startTime.current; 
    lastTime.current = elapsedTime;
    progress.stopAnimation(); 
  };

  const continueProgress = () => {
    // Continúa la animación desde donde se detuvo
    const remainingTime = totalDuration - lastTime.current;
    startTime.current = Date.now(); // Reiniciamos el tiempo de inicio
    Animated.timing(progress, {
      toValue: 1,
      duration: remainingTime,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        handleNext();
      }
    });
  };

  const openModal = (initialImage, histories, userIndex) => {
    let combined
    let initialImageIndex
    if(initialImage.visto){
      combined = [initialImage, ...histories.vistas]
      initialImageIndex = 0
    }
    else{
      combined = [...histories.vistas, initialImage, ...histories.noVistas]
      initialImageIndex = combined.indexOf(initialImage)
    }
    
    setHistories(combined)
    setSelectedImageIndex(initialImageIndex)
    setCurrentUserIndex(userIndex);
    setModalVisible(true);
  };

  const closeModal = () => {
    llamada()
    setModalVisible(false);
    setHistories([]);
  };

  const handleHistories = async (_id) => {
    try {
      const res = await history(_id, logout);
      return res
    } catch (error) {
      //console.error(error);
      return [];
    }
  };

  const handleSeen = async (_id) => {
    try {
      await seen(_id, logout);

    } catch (error) {
      //console.error(error);
    }
  };

  const handleOpen = async (index, _id, image) => {
    const historiesData = await handleHistories(_id);
    openModal(image, historiesData, index)
  };

  const handleNext = async () => {
    if (selectedImageIndex < histories.length - 1) {
      setSelectedImageIndex(prev => prev + 1);
    } 
    else {
      if (currentUserIndex < data.length - 1) {
        const nextUser = data[currentUserIndex + 1];
        const newHistories = await handleHistories(nextUser._id);
        if (newHistories.noVistas.length > 0 || newHistories.vistas.length > 0 || nextUser.lastHistory) {
          openModal(nextUser.lastHistory, newHistories, currentUserIndex + 1);
        } else {
          closeModal();
        }
      } else {
        closeModal();
      }
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(prev => prev - 1);
    }
  };

  const handleSelectPhoto = async () => {
    // Solicitar permisos para acceder a la galería
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      setError(true)
      setErrorMessage(screenTexts.PermissionError);
      return;
    }

    // Abre el selector de imágenes
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
      orderedSelection: true
    });

    // Si el usuario selecciona una imagen
    if (!pickerResult.canceled) {
      handleUploadPhotos(pickerResult.assets[0].uri)
    }
  };

  const handleUploadPhotos = async (selectedImage) => {
    
    try {
       
      uploadPhoto(selectedImage, logout)
        .then(() => {
          setConfirmacion(true)
          setConfirmacionMensaje(screenTexts.UploadedPostConfirmation)
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

  return (
    <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
      {subir && (
        <TouchableOpacity style={styles.addButton} onPress={handleSelectPhoto}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      )}

      {mine ? (
        data.histories.map((item, index) => (
          <TouchableOpacity key={index} style={styles.storyContainer} onPress={() => handleAddPhoto(item.url)}>
            <ImageBackground
              source={{ uri: item.url }}
              style={styles.storyImage}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.profileImageContainer}>
                <Image
                  source={{ uri: data.creator.photo }}
                  style={styles.profileImage}
                />
              </View>
            </ImageBackground>
          </TouchableOpacity>
        ))
      ) : (
        <View style={{ flexDirection: 'row' }}>
          {data.map((item, index) => (
            <TouchableOpacity key={index} onPress={() => handleOpen(index, item._id, item.lastHistory)}>
              <View style={[styles.storyContainer, item.visto ? styles.storyContainerVisto : styles.storyContainerNoVisto]}>
                <ImageBackground source={{ uri: item.lastHistory.url }} style={styles.storyImage} imageStyle={{ borderRadius: 15 }}>
                  <View style={styles.profileImageContainer}>
                    <Image source={{ uri: item.avatar.url }} style={styles.profileImage} />
                  </View>
                </ImageBackground>
              </View>
            </TouchableOpacity>
          ))}

          <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
            <TouchableOpacity 
              style={styles.modalContainer} 
              activeOpacity={1}
              onPressIn={stopProgress}
              onPressOut={continueProgress}
            >
              {histories.length > 0 && (
                <>

                  <Image source={{ uri: histories[selectedImageIndex].url }} style={styles.modalImage} resizeMode="contain" />
                  <View style={styles.progressBarContainer}>
                    {histories.map((_, index) => (
                      <View key={index} style={styles.progressBarBackground}>
                        <Animated.View
                          style={[
                            styles.progressBarFill,
                            {
                              width: selectedImageIndex === index ? progress.interpolate({
                                inputRange: [0, 1],
                                outputRange: ['0%', '100%'],
                              }) : selectedImageIndex > index ? '100%' : '0%',
                            },
                          ]}
                        />
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.modalNavigationLeft} onPress={handlePrevious} />
                  <TouchableOpacity style={styles.modalNavigationRight} onPress={handleNext} />
                </>
              )}
            </TouchableOpacity>
          </Modal>
        </View>
      )}
    </ScrollView>
  );
};



const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row', 
    paddingVertical: 10,
  },
  addButton: {
    width: 100,
    height: 138,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15, 
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: 'black',
  },
  addText: {
    fontSize: 40, 
    fontWeight: '300',
    color: 'black',
  },
  storyContainer: {
    width: 100,
    height: 138,
    marginHorizontal: 10,
    borderWidth: 1,
    borderRadius: 15,
    marginBottom: 5,
    borderColor: '#9e9e9e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Sombra Android
    elevation: 4,
  },
  storyContainerVisto:{
    borderColor: 'black',
  },
  storyContainerNoVisto:{
    borderColor: 'gold',
  },
  storyImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileImageContainer: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    transform: [{ translateX: -20 }],
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#9d9d9d',
    borderRadius: 50,
    width: 37,
    height: 37,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalNavigationLeft:{
    //backgroundColor:'red',
    position: 'absolute',
    left: 0,
    top:0,
    width: '30%',
    height: '100%',
  },
  modalNavigationRight:{
    //backgroundColor:'red',
    position: 'absolute',
    right: 0,
    top: 0,
    width: '30%',
    height: '100%',
  },
  progressBarContainer: { 
    position: 'absolute', 
    top: 30, 
    width: '90%', 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  progressBarBackground: { 
    flex: 1, 
    height: 3, 
    backgroundColor: '#555', 
    marginHorizontal: 2, 
    borderRadius: 5 
  },
  progressBarFill: { 
    height: 3, 
    backgroundColor: '#fff', 
    borderRadius: 5 
  },
});

export default StoriesScroll;
