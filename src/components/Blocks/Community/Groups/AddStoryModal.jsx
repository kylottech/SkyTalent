import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useUser } from "../../../../context/useUser";
import GradientButton from '../../../Utils/GradientButton';
import { createGroupStory } from '../../../../services/groupSocialServices';

const { height: screenHeight } = Dimensions.get('window');

const AddStoryModal = ({ visible, onClose, groupId, loading, setLoading, setWinKylets }) => {
  const { logout, texts } = useUser();
  const screenTexts = texts?.components?.Blocks?.Community?.Groups?.AddStoryModal || {
    Title: 'Crear Historia',
    DescriptionTitle: 'Descripción',
    DescriptionPlaceHolder: 'Comparte tu momento...',
    SelectImage: 'Seleccionar imagen',
    GradientButton: 'Crear Historia'
  };

  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Animation values
  const translateY = useRef(new Animated.Value(screenHeight)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  // Animation effects
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos requeridos', 'Se necesitan permisos para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [9, 16], // Aspecto vertical para historias
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleCreateStory = async () => {
    if (!loading && selectedImage && description.trim()) {
      setLoading(true);
      try {
        const result = await createGroupStory({ 
          groupId, 
          description: description.trim(), 
          image: selectedImage
        }, logout);
        
        // Reset form
        setDescription('');
        setSelectedImage(null);
        setError(false);
        setErrorMessage('');
        
        // Show success and close
        setWinKylets(result.kylets || 0);
        onClose();
        
      } catch (error) {
        setError(true);
        setErrorMessage(error.message || 'Error al crear la historia');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Modal 
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Animated.View style={[styles.overlay, { opacity: backdropOpacity }]}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={[
          styles.modalContainer,
          { transform: [{ translateY }] }
        ]}>
          <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.keyboardView}
            >
              {/* Handle Bar */}
              <View style={styles.handleContainer}>
                <View style={styles.handleBar} />
              </View>

              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>{screenTexts.Title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={24} color="#8E8E93" />
                </TouchableOpacity>
              </View>

              {/* Scrollable Content */}
              <ScrollView 
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              >
                {/* Content */}
                <View style={styles.content}>
                  {/* Image Section */}
                  <View style={styles.imageSection}>
                    <Text style={styles.sectionTitle}>Imagen</Text>
                    <TouchableOpacity style={styles.imagePicker} onPress={handleImagePicker}>
                      {selectedImage ? (
                        <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
                      ) : (
                        <View style={styles.imagePlaceholder}>
                          <Ionicons name="camera-outline" size={48} color="#C7C7CC" />
                          <Text style={styles.imagePlaceholderText}>{screenTexts.SelectImage}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>

                  {/* Description Section */}
                  <View style={styles.inputSection}>
                    <View style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{screenTexts.DescriptionTitle}</Text>
                      <TextInput
                        placeholder={screenTexts.DescriptionPlaceHolder}
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                        placeholderTextColor="#8E8E93"
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>

              {/* Footer */}
              <View style={styles.footer}>
                <GradientButton
                  text={screenTexts.GradientButton}
                  onPress={handleCreateStory}
                  loading={loading}
                  disabled={!selectedImage || !description.trim()}
                />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
    minHeight: screenHeight * 0.5,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 8,
  },
  handleBar: {
    width: 36,
    height: 4,
    backgroundColor: '#C7C7CC',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.4,
  },
  closeButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageSection: {
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
  },
  imagePicker: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E5E7',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 12,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E7',
  },
});

export default AddStoryModal;
