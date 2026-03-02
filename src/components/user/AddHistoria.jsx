import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useUser } from '../../context/useUser';
import * as ImagePicker from 'expo-image-picker';
import add from '../../../assets/GradientPlus.png';

const AddHistoria = ({ option, setImages, setPhotos }) => {
  const { texts } = useUser();
  const screenTexts = texts.components.user.AddHistoria;

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(screenTexts.CameraPermissionError);
      return;
    }

    let pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
      orderedSelection: true,
    });

    if (!pickerResult.canceled) {
      const uri = pickerResult.assets[0].uri;

      if (setPhotos) {
        const newImage = {
          url: uri,
          perfil: true,
        };
        setImages(prev => [...prev, newImage]);
        setPhotos(prev => [...prev, newImage]);
      } else {
        setImages(prev => [...prev, { uri }]);
      }
    }
  };

  const handleAddImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert(screenTexts.GalleryPermissionError);
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      allowsMultipleSelection: true,
      quality: 1,
      selectionLimit: 10,
      orderedSelection: true,
    });

    if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
      if (setPhotos) {
        setImages(prevImages => {
          const newImages = pickerResult.assets.map((asset, index) => {
            const isPerfil = prevImages.length === 0 && index === 0;
            return {
              url: asset.uri,
              perfil: isPerfil,
            };
          });
          setPhotos(prev => [...prev, ...newImages]);
          return [...prevImages, ...newImages];
        });
      } else {
        const newFormatted = pickerResult.assets.map(asset => ({ uri: asset.uri }));
        setImages(prev => [...prev, ...newFormatted]);
      }
    }
  };

  const handleOption = () => {
    if (option === 'camera') {
      openCamera();
    } else if (option === 'gallery') {
      handleAddImage();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleOption}>
        <Image source={add} style={styles.icon} />
        <Text style={styles.text}>
          {option === 'camera' && screenTexts.CameraText}
          {option === 'gallery' && screenTexts.GalleryText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    borderRadius: 15,
  },
  button: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  icon: {
    width: 30,
    height: 30,
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddHistoria;
