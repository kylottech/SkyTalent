import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";

export default function Camara({ setActiveButton }) {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState(null);

    useEffect(() => {
      openCamera()
    }, []);

    const openCamera = async () => {
      // Solicitar permisos para la cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert(screenTexts.CameraPermissionError);
        navigation.goBack()
        return;
      }
  
      // Abrir la cámara
      let pickerResult = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true, // Permitir recortar la imagen
        aspect: [12, 25], // Mantener proporción
        quality: 1, // Calidad máxima
      });
  
      // Verificar si el usuario tomó una foto
      if (!pickerResult.canceled) {
        setImageUri(pickerResult.assets[0].uri)
        navigation.goBack()
      }
    }
    return (
      <View></View>
    );

  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  placeholder: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 20,
  },
});
