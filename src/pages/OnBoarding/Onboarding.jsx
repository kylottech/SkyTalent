import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useUser } from "../../context/useUser";
import { AntDesign, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadImage } from '../../services/profileService';
import ProgressBar from './ProgressBar';
import Top from '../../components/Utils/Top'
import HorizontalSlider from '../../components/Utils/HorizontalSlider'
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';


function Onboarding({ screen, title, description, showImageUpload, onNext, onBack, progress, photo }) {
  const { texts, logout } = useUser()
  const screenTexts = texts.pages.OnBoarding.Onboarding
  const [previewImage, setPreviewImage] = useState('');
  const previewImageRef = useRef(''); // Ref para mantener el valor actual
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');

  const handleFileChange = async () => {
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
      const uri = result.assets[0].uri
      setPreviewImage(uri);
      previewImageRef.current = uri;
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage('');
    previewImageRef.current = ''; // Limpiar ref también
  };

  const handleNext = async () => {
    const currentUri = previewImageRef.current;
    
    if(currentUri !== ''){
      try {
        const selectedImage = {uri: currentUri} 
        const setSelectedImage = setPreviewImage
        await uploadImage(selectedImage, setErrorMessage, setSelectedImage, logout)
          .then((res) => {
            setConfirmacion(true);
            setConfirmacionMensaje(screenTexts.ConfirmationMensaje);
            setPreviewImage('');
            previewImageRef.current = '';
            onNext()
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
    else {
      onNext()
    }
    
  };

  return (
    <View style={styles.container}>
      <ProgressBar progress={progress} />

      <Top 
        left={true} leftType={'Back'} back={onBack}
        typeCenter={'Text'} textCenter={screenTexts.Top} 
        right={false}
      />

      <View style={styles.info}>
        <View style={styles.infoContainer}>
          <Text style={styles.heading}>{title}</Text>
        </View>

        {showImageUpload ? (
          <View style={styles.imageUploadContainer}>
            <TouchableOpacity onPress={handleFileChange} style={styles.imageUploadButton}>
              {previewImage !== '' ? (
                <View style={styles.previewImageContainer}>
                  <Image
                    source={{ uri: previewImage }}
                    style={styles.previewImage}
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage()}
                    style={styles.removeImageButton}
                  >
                    <Ionicons name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons name="cloud-upload-outline" size={32} color="#9ca3af" />
                  <Text style={styles.uploadText}>{screenTexts.UploadPlaceHolder}</Text>
                </View>
              )}
            </TouchableOpacity>

          </View>
        ) : (
          <>
            <View style={styles.infographicContainer}>
              <Image style={[screen === 'secrets' ? styles.infographic2 : styles.infographic]} source={photo}/>
            </View>
          </>
        )}

        

      </View>
      <View style={styles.footer}>
        <HorizontalSlider color={'Blue'} text={screenTexts.ContinueHorizontalSlider} onPress={handleNext} />
      </View>

      {error &&

      <Error message={errorMessage} func={setError} />

      }

      {confirmacion &&

      <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  info:{
    paddingHorizontal: 24,
    flexDirection: 'column',
    flex: 1,
  },
  infoContainer: {

  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 30
  },
  descriptionContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 12,
    color: '#9d9d9d',
    textAlign: 'center',
    maxWidth: 300,
  },
  imageUploadContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  imageUploadButton: {
    alignItems: 'center',
  },
  previewImageContainer: {
    width: 120,
    height: 120,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 20,
    padding: 4,
  },
  uploadPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  uploadText: {
    marginTop: 8,
    color: '#6b7280',
    fontSize: 14,
    textAlign: 'center'
  },
  continueButtonContainer: {
    paddingBottom: 0,
  },
  infographicContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infographic: {
    width: '110%',
    height: 350,
    borderRadius: 12,
  },
  infographic2: {
    width: 200,
    height: 300,
    borderRadius: 12,
  },
  footer: {
    alignSelf: 'center',
    marginBottom: 20
  },
});

export default Onboarding;