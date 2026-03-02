import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Modal, 
  KeyboardAvoidingView, Platform, Image, Alert
} from 'react-native';
import { useUser } from "../../../../context/useUser";
import { createTrick } from '../../../../services/communityServices'
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../../Utils/GradientButton';
import CategoryInput from '../../../Utils/CategoryInput';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import LoadingOverlay from '../../../Utils/LoadingOverlay';
import x from '../../../../../assets/x.png';

function AddTrickModal({ isOpen, onClose, pais, ciudad, loading, setLoading, setWinKylets }) {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Blocks.Community.Modals.AddTrickModal;
  const [step, setStep] = useState(1);
  const [categoryInfo, setCategoryInfo] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

const handleImage = async () => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert(screenTexts.PermissionError);
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    quality: 1,
    videoMaxDuration: 60,
    selectionLimit: 10,
    orderedSelection: true
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    if (selectedMedia.length < 10) {
      setSelectedMedia(prev => [...prev, { uri: asset.uri, type: asset.type }]);
    } else {
      Alert.alert(screenTexts.LimitError1, screenTexts.LimitError2);
    }
  }
};

const handleRemoveMedia = (index) => {
  setSelectedMedia(prev => prev.filter((_, i) => i !== index));
};

function handleCreateTrick({ title, description, category, pais, ciudad, selectedMedia, logout, onSuccess, onError }) {
  if(!loading){
    setLoading(true)
    const formValues = {
      titulo: title,
      descripcion: description,
      categoria: category,
      pais,
      ciudad,
    };

    createTrick(formValues, selectedMedia, logout)
      .then((response) => {
        if (onSuccess) onSuccess(response);
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error al crear truco:", err.message);
        if (onError) onError(err.message);
        setLoading(false)
      });
  }
  
}


const handleSubmit = () => {
  if (!title.trim()) {
    Alert.alert(screenTexts.TitleErrorMessages);
    return;
  }
  if (!description.trim()) {
    Alert.alert(screenTexts.DescriptionErrorMessages);
    return;
  }
  if (!categoryInfo._id) {
    Alert.alert(screenTexts.CategoryErrorMessages);
    return;
  }

  handleCreateTrick({
    title,
    description,
    category: categoryInfo._id,
    pais,
    ciudad,
    selectedMedia,
    logout,
    onSuccess: (response) => {
      // Limpiar estado y cerrar modal
      setStep(1);
      setTitle('');
      setDescription('');
      setCategoryInfo({});
      setSelectedMedia([]);
      setWinKylets(response.kylets)
      onClose();
    },
    onError: (msg) => {
      Alert.alert("Error", msg || "Algo salió mal");
    }
  });
};


const renderStep1 = () => (
  <View style={styles.stepContainer}>
    <View style={styles.headerContainer}>
      <Text style={styles.title}>{screenTexts.TitleRender1}</Text>
      <Text style={styles.subtitle}>{screenTexts.SubtitleRender1}</Text>
    </View>

    {/* Botón de subir */}
    <TouchableOpacity 
      style={styles.uploadButton} 
      onPress={handleImage}
      disabled={selectedMedia.length >= 10}
    >
      <Text style={styles.uploadText}>
        {selectedMedia.length >= 10 ? screenTexts.UploadButton2Render1 : screenTexts.UploadButton1Render1}
      </Text>
    </TouchableOpacity>

    {/* Galería de medios */}
    <View style={styles.mediaGallery}>
      {selectedMedia.map((media, index) => (
        <View key={index} style={styles.mediaItem}>
          {media.type.startsWith('video') ? (
            <Video
              source={{ uri: media.uri }}
              style={styles.mediaThumbnail}
              resizeMode="cover"
              isMuted
              shouldPlay={false}
            />
          ) : (
            <Image
              source={{ uri: media.uri }}
              style={styles.mediaThumbnail}
              resizeMode="cover"
            />
          )}

          {/* Botón de eliminar */}
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveMedia(index)}
          >
            <Text style={styles.removeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.TitleRender2}</Text>
        <Text style={styles.subtitle}>{screenTexts.SubtitleRender2}</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.Text1Render2}</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={screenTexts.TitlePlaceHolderRender2}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.Text2Render2}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={screenTexts.DescriptionPlaceHolderRender2}
            multiline
          />
        </View>

        <CategoryInput 
          title={true}
          setUserInfo={setCategoryInfo} 
          userInfo={categoryInfo} 
          setError={setError} 
          setErrorMessage={setErrorMessage} 
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
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
                <Image source={x} style={styles.x}/>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${(step / 2) * 100}%` }
                ]} 
              >
                <LinearGradient
                  colors={['#004999', '#1D7CE4']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradient}
                />
              </View>  
            </View>

            {/* Steps Indicator */}
            <View style={styles.stepsIndicator}>
              <Text style={[styles.stepText, step === 1 && styles.activeStep]}>
                {screenTexts.Step1}
              </Text>
              <Text style={[styles.stepText, step === 2 && styles.activeStep]}>
                {screenTexts.Step2}
              </Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
              {step === 1 ? renderStep1() : renderStep2()}
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                onPress={() => step > 1 && setStep(step - 1)}
                style={styles.backButton}
              >
                <Text style={styles.backButtonText}>
                  {step > 1 ? screenTexts.BackButton : ""}
                </Text>
              </TouchableOpacity>

              <View style={styles.nextButton}>
                <GradientButton 
                  color="Blue" 
                  text={step === 2 ? screenTexts.GradientButton2 : screenTexts.GradientButton1}  
                  onPress={() => {
                    if (step === 1) setStep(2);
                    else handleSubmit();
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {loading && (
        <LoadingOverlay/>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: '100%',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
  },
  progressBar: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2,
  },
  gradient: {
    flex: 1,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 48,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
  stepText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold',
  },
  activeStep: {
    color: '#3B82F6',
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  stepContainer: {
    padding: 24,
    flex: 1,
    width: '100%',
  },
  headerContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  formContainer: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
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
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '500',
  },
  nextButton: {
    width: '50%',
  },
  uploadButton: {
  backgroundColor: '#eee',
  padding: 12,
  borderRadius: 8,
  alignItems: 'center',
  marginBottom: 16,
},
uploadText: {
  color: '#333',
  fontWeight: 'bold',
},
mediaGallery: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},
mediaItem: {
  width: '30%',
  aspectRatio: 1,
  position: 'relative',
  borderRadius: 8,
  overflow: 'hidden',
},
mediaThumbnail: {
  width: '100%',
  height: '100%',
},
removeButton: {
  position: 'absolute',
  top: 4,
  right: 4,
  backgroundColor: 'rgba(0,0,0,0.7)',
  borderRadius: 12,
  width: 24,
  height: 24,
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1,
},
removeButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  lineHeight: 20,
},
  x: {
    width: 15,
    height: 15,
  },
});

export default AddTrickModal;
