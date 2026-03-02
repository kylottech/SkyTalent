import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, Animated, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "../../context/useUser";
import createButton from '../../../assets/createButton.png';  
import add from '../../../assets/cameraButton.png';        // icono para botón cámara
import galleryIcon from '../../../assets/galleryButton.png';  // icono para galería, crea o reemplaza según tengas

const FloatingGalleryMenu = ({ setImages, setPhotos }) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Utils.FloatingGalleryMenu;
  const [menu, setMenu] = useState(false);
  const height = useRef(new Animated.Value(0));

  const toggleMenu = () => {
    setMenu(prev => !prev);
  };

  useEffect(() => {
    Animated.spring(height.current, {
      toValue: menu ? 120 : 0, // para 2 botones
      useNativeDriver: false,
    }).start();
  }, [menu]);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert(screenTexts.PermissionError2);
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled) {
      const newUri = pickerResult.assets[0].uri;
      setImages(prev => {
        const updated = [...prev, { uri: newUri }];
        const updatedPhotos = updated.map((img, i) => ({
          url: img.uri,
          perfil: i === 0, // la primera como avatar
        }));
        setPhotos(updatedPhotos);
        return updated;
      });
    }
    setMenu(false);
  }

  const openGallery = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      alert(screenTexts.PermissionError1);
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 10,
    });

    if (!pickerResult.canceled) {
      const newImages = pickerResult.assets.slice(0, 10).map(asset => ({ uri: asset.uri }));
      setImages(prev => {
        const updated = [...prev, ...newImages].slice(0, 10);
        const updatedPhotos = updated.map((img, i) => ({
          url: img.uri,
          perfil: i === 0,
        }));
        setPhotos(updatedPhotos);
        return updated;
      });
    }
    setMenu(false);
  }

  return (
    <>
      <Animated.View style={[styles.dropdown, { height: height.current }]}>
        <LinearGradient
          colors={['#004999', '#1D7CE4']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.dropdownContent}
        >
          {menu && (
            <>
              <TouchableOpacity style={styles.buttonCreate} onPress={openCamera}>
                <Image source={add} style={styles.imageCreate} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonCreate} onPress={openGallery}>
                <Image source={galleryIcon} style={styles.imageCreate} />
              </TouchableOpacity>
            </>
          )}
        </LinearGradient>
      </Animated.View>

      <LinearGradient
        colors={['#1D7CE4', '#004999']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.button}
      >
        <TouchableOpacity onPress={toggleMenu}>
          <Image source={createButton} style={styles.imageCreate} />
        </TouchableOpacity>
      </LinearGradient>
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    bottom: 70,
    right: 30,
    width: 50,
    overflow: 'hidden',
    alignItems: 'center',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  dropdownContent: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  buttonCreate: {
    width: 40,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCreate: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#1D7CE4',
    width: 50,
    height: 50,
    borderRadius: 25,
    position: 'absolute',
    bottom: 50,
    right: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default FloatingGalleryMenu;
