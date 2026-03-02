import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, StyleSheet, Modal,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useUser } from "../../../../context/useUser";
import * as ImagePicker from 'expo-image-picker';
import { createPost, uploadImagePost, updatePost } from '../../../../services/experienceServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../../Utils/GradientButton';
import LoadingOverlay from '../../../Utils/LoadingOverlay';
import PartCard from '../PartCard';
import { LinearGradient } from 'expo-linear-gradient';
import subir from '../../../../../assets/addImage.png';
import x from '../../../../../assets/x.png';

function AddPostModal({
  isOpen,
  onClose,
  setPosts,
  _id,
  type,
  info,
  llamada,
  loading,
  setLoading,
  setWinKylets,
  parts
}) {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Wallet.Experiences.Modals.AddPostModal;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    date: new Date().toISOString().split('T')[0],
    part: '' 
  });
  const [selectedImage, setSelectedImage] = useState(subir);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const resetForm = () => {
    setFormData({
      name: '',
      date: new Date().toISOString().split('T')[0],
      part: '', // limpiar selección de parte
    });
    setSelectedImage(subir);
    setStep(1);
  };

  useEffect(() => {
    if (isOpen) {
      if (type === 'edit' && info) {
        const parsedDate = new Date(info.date);
        const isValidDate = !isNaN(parsedDate.getTime());

        // Acepta tanto string como objeto { _id }
        const normalizedPartId =
          typeof info.partId === 'string'
            ? info.partId
            : info?.partId?._id ?? '';

        setFormData({
          name: info.name,
          date: isValidDate ? parsedDate.toISOString().split('T')[0] : '',
          part: normalizedPartId,
        });
        setSelectedImage(info.avatar?.url ? { uri: info.avatar.url } : subir);
      } else {
        resetForm();
      }
    }
  }, [info, type, isOpen]);

  const handleClose = () => {
    if (type !== 'edit') resetForm();
    onClose();
  };

  const handleImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setErrorMessage(screenTexts.PermissionError);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      selectionLimit: 1,
      orderedSelection: true,
    });
    if (!result.canceled) {
      setSelectedImage({ uri: result.assets[0].uri });
    }
  };

  const uploadPhoto = ({ selectedImage, _id }) => {
    try {
      if (selectedImage && selectedImage.uri) {
        uploadImagePost({ selectedImage, _id }, logout)
          .then((res) => {
            if (type !== 'edit') {
              setPosts((prev) => [res, ...prev]);
            } else {
              llamada && llamada();
            }
            onClose();
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
          });
      } else {
        onClose();
      }
    } catch (error) {
      setError(true);
      // @ts-ignore
      setErrorMessage(error.message);
    }
  };

  const handleCreateExperience = () => {
    if (!loading) {
      setLoading(true);
      if (formData.name !== '') {
        createPost(
          {
            name: formData.name,
            dayId: _id,
            ...(formData.part ? { partId: formData.part } : {}), // << enviar partId si hay selección
          },
          logout
        )
          .then((res) => {
            uploadPhoto({ selectedImage, _id: res.info._id });
            resetForm();
            setLoading(false);
            setWinKylets && setWinKylets(res.kylets);
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false);
          });
      } else {
        setError(true);
        setErrorMessage(screenTexts.FieldsErrorMessages);
        setLoading(false);
      }
    }
  };

  const handleUpdatePost = () => {
    if (!loading) {
      setLoading(true);
      if (formData.name !== '') {
        updatePost(
          {
            _id: info._id,
            name: formData.name,
            dayId: _id,
            ...(formData.part ? { partId: formData.part } : {}), // << enviar partId si hay selección
          },
          logout
        )
          .then((res) => {
            uploadPhoto({ selectedImage, _id: res._id || info._id });
            setLoading(false);
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false);
          });
      } else {
        setError(true);
        setErrorMessage(screenTexts.FieldsErrorMessages);
        setLoading(false);
      }
    }
  };

  const handleSubmit = () => {
    if (type === 'edit') {
      handleUpdatePost();
    } else {
      handleCreateExperience();
    }
    setStep(1);
    onClose();
  };

  // === STEP 1 (foto) ===
  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.uploadContainer} onPress={handleImage}>
          <Image
            source={selectedImage}
            style={[
              typeof selectedImage === 'object' && selectedImage.uri
                ? styles.subirFotoLocal
                : styles.subirFotoUri,
            ]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  // === STEP 2 (Título) ===
  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title2}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle2}</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.TitleInput}</Text>
          <TextInput
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            style={styles.input}
            placeholder={screenTexts.TitlePlaceHolder}
          />
        </View>
      </View>
    </View>
  );

  // === STEP 3 (Partes) ===
  const renderStep3 = () => {
    const selectedPart = parts?.find((p) => p._id === formData.part);

    return (
      <View style={styles.stepContainer}>
        {/* Chip arriba con el nombre y una X para limpiar */}
        {selectedPart && (
          <View style={styles.selectedBox}>
            <Text style={styles.selectedText}>{selectedPart.name}</Text>
            <TouchableOpacity
              onPress={() => setFormData((prev) => ({ ...prev, part: '' }))}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Quitar parte seleccionada"
            >
              <Text style={styles.closeIcon}>×</Text>
            </TouchableOpacity>
          </View>
        )}

        {parts?.map((part, index) => (
          <TouchableOpacity
            key={part._id}
            onPress={() =>
              setFormData((prev) => ({
                ...prev,
                // Si tocas la misma, la deselecciona
                part: prev.part === part._id ? '' : part._id,
              }))
            }
            accessibilityRole="button"
            accessibilityLabel={`Seleccionar ${part.name}`}
          >
            <PartCard
              info={part}
              mine={false}
              index={index}
              // Opcional: marcar visualmente la seleccionada
              isSelected={formData.part === part._id}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={handleClose}>
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{screenTexts.Top}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Image source={x} style={styles.x} />
              </TouchableOpacity>
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${(step / 3) * 100}%` }]}>
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradient}
                />
              </View>
            </View>

            {/* Steps */}
            <View style={styles.stepsIndicator}>
              <Text style={[styles.stepText, step === 1 && styles.activeStep]}>{screenTexts.Step1}</Text>
              <Text style={[styles.stepText, step === 2 && styles.activeStep]}>{screenTexts.Step2}</Text>
              <Text style={[styles.stepText, step === 3 && styles.activeStep]}>{screenTexts.Step3}</Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              {step > 1 ? (
                <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.backButton}>
                  <Text style={styles.backButtonText}>{screenTexts.Back}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.backButton} />
              )}
              <View style={styles.nextButton}>
                <GradientButton
                  color="Blue"
                  text={step === 3 ? screenTexts.GradientButton1 : screenTexts.GradientButton2}
                  onPress={() => {
                    if (step === 3) {
                      handleSubmit();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {loading && <LoadingOverlay />}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  keyboardAvoidingView: {
    flex: 1
  },
  subirFotoUri: {
    height: 100,
    width: 103,
  },
  subirFotoLocal: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(249, 250, 251, 0.5)'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937'
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6'
  },
  progressBar: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
  gradient: {
    flex: 1
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%'
  },
  stepText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold'
  },
  activeStep: {
    color: '#3B82F6'
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: "white",
  },
  stepContainer: {
    padding: 24,
    flex: 1,
    width: '100%'
  },
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D0D7DE',
    backgroundColor: '#F2F4F7',
    marginBottom: 25,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: '600',
  },
  closeIcon: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 18,
  },
  headerContainer: {
    marginBottom: 24
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280'
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 40,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden'
  },
  previewImage: {
    width: '100%',
    height: '100%'
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20
  },
  uploadContainer: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  uploadText: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  },
  buttonText: {
    color: '#3B82F6',
    fontWeight: '500'
  },
  formContainer: {
    gap: 20
  },
  inputGroup: {
    gap: 8
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151'
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    gap: 20
  },
  flex1: {
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white'
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '500'
  },
  nextButton: {
    width: '50%'
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    marginTop: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  contactsList: {
    marginTop: 24
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  contactRole: {
    fontSize: 14,
    color: '#6B7280'
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    padding: 8
  },
  editContainer: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: 12,
    padding: 24,
    gap: 16,
    marginTop: 24,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '500'
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  x: {
    width: 15,
    height: 15,
  },
});

export default AddPostModal;
