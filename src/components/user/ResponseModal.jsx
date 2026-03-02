import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, StyleSheet, Modal,
  KeyboardAvoidingView, Platform, Alert, Dimensions
} from 'react-native';
import { useUser } from "../../context/useUser";
import { SafeAreaView } from 'react-native-safe-area-context';
import { todayData, responseQuestion } from '../../services/questionsServices';
import GradientButton from '../../components/Utils/GradientButton';
import Loader from '../Utils/Loader';
import Error from '../Utils/Error';
import { LinearGradient } from 'expo-linear-gradient';
import x from '../../../assets/x.png';

import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as Location from 'expo-location';

// Import icons
import cameraIcon from '../../../assets/cameraButton.png';
import galleryIcon from '../../../assets/galleryButton.png';
import audioIcon from '../../../assets/Phone.png';
import locationIcon from '../../../assets/pinMenu.png';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function ResponseModal({ isOpen, onClose, setWinKylets, func }) {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.user.ResponseModal;

  const [respuesta, setRespuesta] = useState('');
  const [pregunta, setPregunta] = useState(null);
  const [preguntaId, setPreguntaId] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  // NUEVO: tipo de respuesta (solo uno)
  const [selectedType, setSelectedType] = useState('text'); // 'text' | 'image' | 'video' | 'audio' | 'location'
  const [media, setMedia] = useState(null); // { uri: string, type: 'image' | 'video' | 'audio' }
  const [selectedLocation, setSelectedLocation] = useState(null); // { latitude: number, longitude: number, address: string }

  const handleGetQuestion = useCallback(async () => {
    try {
      todayData(logout)
        .then((response) => {
          setPregunta({ title: response.title, subtitle: response.subtitle });
          setPreguntaId(response._id);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  }, [logout]);

  useEffect(() => {
    if (isOpen) {
      handleGetQuestion();
      // Reset form when modal opens
      setRespuesta('');
      setSelectedType('text');
      setMedia(null);
      setSelectedLocation(null);
      setError(false);
    }
  }, [isOpen, handleGetQuestion]);

  // Cambiar de tipo: limpia los otros campos para garantizar exclusividad
  const handleSelectType = (type) => {
    setSelectedType(type);
    if (type === 'text') {
      setMedia(null);
      setSelectedLocation(null);
    } else {
      setRespuesta('');
      setMedia(null);
      setSelectedLocation(null);
    }
  };

  const pickFromLibrary = async (expect) => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería');
        return;
      }

      // expect: 'image' | 'video'
      const mediaTypes =
        expect === 'image'
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes,
        allowsEditing: true,
        quality: 0.8,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setMedia({ uri: asset.uri, type: expect });
        setSelectedType(expect); // Actualizar el tipo seleccionado
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'No se pudo seleccionar el archivo');
    }
  };

  const handleAudioRecord = async () => {
    try {
      // Para audio, simularemos la grabación
      Alert.alert(
        'Grabación de audio',
        'Funcionalidad de audio en desarrollo. ¿Deseas continuar con texto?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Continuar', 
            onPress: () => {
              setSelectedType('text');
              setMedia(null);
              setSelectedLocation(null);
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo acceder al micrófono');
    }
  };

  const handleLocationSelect = async () => {
    try {
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permisos', 'Se necesitan permisos de ubicación para esta función');
        return;
      }

      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      // Obtener dirección
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const address = reverseGeocode[0] 
        ? `${reverseGeocode[0].street || ''} ${reverseGeocode[0].city || ''} ${reverseGeocode[0].region || ''}`.trim()
        : 'Ubicación actual';

      setSelectedLocation({
        latitude,
        longitude,
        address
      });

      setSelectedType('location'); // Actualizar el tipo seleccionado
      setMedia(null); // Limpiar media
      setRespuesta(''); // Limpiar texto

      Alert.alert(
        'Ubicación seleccionada',
        `Se ha adjuntado la ubicación: ${address}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener la ubicación');
    }
  };

  const validate = () => {
    if (selectedType === 'text') {
      if (respuesta.trim() === '') {
        Alert.alert('Falta texto', 'Escribe tu respuesta.');
        return false;
      }
      return true;
    }
    
    if (selectedType === 'location') {
      if (!selectedLocation) {
        Alert.alert('Ubicación faltante', 'Selecciona una ubicación.');
        return false;
      }
      return true;
    }
    
    if (selectedType === 'audio') {
      // Para audio, por ahora permitimos continuar sin archivo
      return true;
    }
    
    // imagen o video
    if (!media?.uri || media?.type !== selectedType) {
      Alert.alert(
        'Archivo faltante',
        `Selecciona un ${selectedType === 'image' ? 'imagen' : 'video'} válido.`
      );
      return false;
    }
    return true;
  };

  const handleResponse = async () => {
    try {
      // Payload: exclusivo
      const payload = { _id: preguntaId };
      if (selectedType === 'text') {
        payload.response = respuesta; // compatibilidad con tu API actual
      } else if (selectedType === 'location') {
        payload.location = selectedLocation; // ubicación
      } else if (selectedType === 'audio') {
        payload.audio = 'audio_placeholder'; // placeholder para audio
      } else {
        payload.media = { uri: media.uri, type: selectedType }; // imagen o video
        // Nota: si tu backend requiere upload multipart, aquí tendrías que
        // sustituir esto por subida a S3/servidor y enviar la URL final.
      }

      responseQuestion(payload, logout)
        .then((res) => {
          onClose();
          setWinKylets(res.kylets);
          func()
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting response:', {
      selectedType,
      respuesta,
      media,
      selectedLocation,
      preguntaId
    });
    
    if (!validate()) return;
    handleResponse();
  };

  const renderForm = () => {
    if (!pregunta) return <Loader />;

    return (
      <View style={styles.modalBody}>
        {/* Header Options - Guided/Templates */}
        <View style={styles.headerOptions}>
          <TouchableOpacity style={styles.guidedButton}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.guidedGradient}
            >
              <Text style={styles.trophyIcon}>🏆</Text>
              <Text style={styles.guidedText}>Guided</Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.templatesButton}>
            <Text style={styles.templatesText}>Templates</Text>
          </TouchableOpacity>
        </View>

        {/* Question Display */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{pregunta.title}</Text>
          <Text style={styles.questionSubtext}>{pregunta.subtitle}</Text>
        </View>

        {/* Main Text Input */}
        <View style={styles.mainInputContainer}>
          <TextInput
            value={respuesta}
            onChangeText={setRespuesta}
            style={styles.mainInput}
            placeholder="Add your thoughts..."
            placeholderTextColor="#8E8E93"
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Media Addition Section */}
        <View style={styles.mediaSection}>
          <Text style={styles.addMediaText}>Add media</Text>
          
          {/* Current Selection Indicator */}
          <View style={styles.selectionIndicator}>
            <Text style={styles.selectionText}>
              Tipo actual: {
                selectedType === 'text' ? 'Texto' :
                selectedType === 'image' ? 'Imagen' :
                selectedType === 'video' ? 'Video' :
                selectedType === 'audio' ? 'Audio' :
                selectedType === 'location' ? 'Ubicación' : 'Texto'
              }
            </Text>
            {selectedType !== 'text' && (
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => handleSelectType('text')}
              >
                <Text style={styles.resetButtonText}>Volver a texto</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {/* Media Options */}
          <View style={styles.mediaOptionsContainer}>
            <TouchableOpacity 
              style={styles.mediaOption}
              onPress={() => pickFromLibrary('image')}
            >
              <View style={styles.mediaOptionShape}>
                <Image source={galleryIcon} style={styles.mediaOptionIconImage} />
              </View>
              <Text style={styles.mediaOptionText}>Photos + videos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mediaOption}
              onPress={handleAudioRecord}
            >
              <View style={styles.mediaOptionShape}>
                <Image source={audioIcon} style={styles.mediaOptionIconImage} />
              </View>
              <Text style={styles.mediaOptionText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.mediaOption}
              onPress={handleLocationSelect}
            >
              <View style={styles.mediaOptionShape}>
                <Image source={locationIcon} style={styles.mediaOptionIconImage} />
              </View>
              <Text style={styles.mediaOptionText}>Location</Text>
            </TouchableOpacity>
          </View>

          {/* Selected Media Preview */}
          {media && (
            <View style={styles.mediaPreviewContainer}>
              <Text style={styles.mediaPreviewTitle}>Archivo seleccionado:</Text>
              <View style={styles.mediaPreview}>
                {media.type === 'image' ? (
                  <Image source={{ uri: media.uri }} style={styles.mediaPreviewImage} />
                ) : (
                  <View style={styles.mediaPreviewPlaceholder}>
                    <Text style={styles.mediaPreviewPlaceholderText}>🎥 Video</Text>
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.removeMediaButton}
                  onPress={() => setMedia(null)}
                >
                  <Text style={styles.removeMediaButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Selected Location Preview */}
          {selectedLocation && (
            <View style={styles.locationPreviewContainer}>
              <Text style={styles.locationPreviewTitle}>Ubicación seleccionada:</Text>
              <View style={styles.locationPreview}>
                <Image source={locationIcon} style={styles.locationPreviewIcon} />
                <Text style={styles.locationPreviewText}>{selectedLocation.address}</Text>
                <TouchableOpacity 
                  style={styles.removeLocationButton}
                  onPress={() => setSelectedLocation(null)}
                >
                  <Text style={styles.removeLocationButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContainer}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image source={x} style={styles.closeIcon} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Nueva respuesta</Text>
              <View style={styles.headerSpacer} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
              {renderForm()}
            </ScrollView>

            {/* Bottom Action Button */}
            <View style={styles.bottomActionContainer}>
              <TouchableOpacity style={styles.publishButton} onPress={handleSubmit}>
                <LinearGradient
                  colors={['#007AFF', '#5AC8FA']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.publishGradient}
                >
                  <Text style={styles.publishText}>Publicar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {error && <Error message={errorMessage} func={setError} />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  // Modal Container
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },

  // Modal Header
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  closeButton: {
    padding: 8,
  },
  closeIcon: {
    width: 20,
    height: 20,
    tintColor: '#8E8E93',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  headerSpacer: {
    width: 36,
  },

  // Content
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  modalBody: {
    paddingTop: 24,
  },

  // Header Options
  headerOptions: {
    flexDirection: 'row',
    marginBottom: 32,
    gap: 12,
  },
  guidedButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  guidedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  trophyIcon: {
    fontSize: 16,
  },
  guidedText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  templatesButton: {
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderStyle: 'dashed',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  templatesText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Question Display
  questionContainer: {
    marginBottom: 32,
  },
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
    lineHeight: 32,
  },
  questionSubtext: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 22,
  },

  // Main Input
  mainInputContainer: {
    marginBottom: 40,
  },
  mainInput: {
    fontSize: 18,
    color: '#1A1A1A',
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
    fontWeight: '400',
  },

  // Media Section
  mediaSection: {
    marginBottom: 40,
  },
  addMediaText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },

  // Selection Indicator
  selectionIndicator: {
    backgroundColor: '#F0F8FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 20,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  selectionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    alignSelf: 'center',
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#007AFF',
  },

  // Media Options
  mediaOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mediaOption: {
    alignItems: 'center',
    flex: 1,
  },
  mediaOptionShape: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mediaOptionIcon: {
    fontSize: 24,
  },
  mediaOptionIconImage: {
    width: 24,
    height: 24,
    tintColor: '#007AFF',
  },
  mediaOptionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },

  // Media Preview
  mediaPreviewContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  mediaPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  mediaPreview: {
    position: 'relative',
    alignItems: 'center',
  },
  mediaPreviewImage: {
    width: 120,
    height: 120,
    borderRadius: 12,
  },
  mediaPreviewPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaPreviewPlaceholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  removeMediaButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeMediaButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },

  // Location Preview
  locationPreviewContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  locationPreviewTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 12,
  },
  locationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  locationPreviewIcon: {
    width: 20,
    height: 20,
    tintColor: '#007AFF',
    marginRight: 12,
  },
  locationPreviewText: {
    flex: 1,
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  removeLocationButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeLocationButtonText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },

  // Bottom Action
  bottomActionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  publishButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  publishGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  publishText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
});

export default ResponseModal;
