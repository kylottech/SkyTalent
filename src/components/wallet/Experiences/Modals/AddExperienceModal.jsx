import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, StyleSheet, Modal, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { useUser } from "../../../../context/useUser";
import * as ImagePicker from 'expo-image-picker';
import * as Localization from 'expo-localization';
import {createExperience, uploadImageExperience, updateExperience } from '../../../../services/experienceServices'
import { SafeAreaView } from 'react-native-safe-area-context';
import LocationAutocomplete from '../../../Utils/LocationAutocomplete';
import LoadingOverlay from '../../../Utils/LoadingOverlay';
import GradientButton from '../../../Utils/GradientButton';
import { LinearGradient } from 'expo-linear-gradient';
import Error from '../../../Utils/Error';
import subir from '../../../../../assets/addImage.png';
import x from '../../../../../assets/x.png'

function AddExperienceModal({ isOpen, onClose, setMyExperiences, _id, type, info, llamada, loading, setLoading, setWinKylets }) {
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Wallet.Experiences.Modals.AddExperienceModal
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    countrie: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
  });
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('');
  const [selectedImage, setSelectedImage] = useState(subir)
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const userLang = Localization.locale || 'en'; 

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      city: '',
      countrie: '',
      date: new Date().toISOString().split('T')[0],
      time: '12:00',
    });
    setLocation('');
    setCountry('');
    setSelectedImage(subir);
    setStep(1);
  };

  const getPlaceTranslation = async (placeName, language) => {
    try {
      const apiKey = 'AIzaSyCVq0nosHYjM755NaT-ZfndLS8WVX6GTno'; 
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(placeName)}&language=${language}&key=${apiKey}`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.status === 'OK' && data.results.length > 0) {
        // Retornamos el nombre traducido del primer resultado
        return data.results[0].name;
      } else {
        console.warn('Google Places API error or no results:', data.status);
        return placeName; // Si no hay traducción, devolvemos el nombre original
      }
    } catch (error) {
      console.error('Error fetching place translation:', error);
      return placeName; // En caso de error, devolvemos el nombre original
    }
  }

  useEffect(() => {
    const fetchTranslations = async () => {
      if (type === 'edit' && info) {
        
        const parsedDate = new Date(info.date);
        const isValidDate = !isNaN(parsedDate.getTime());

        let translatedCity = '';
        let translatedCountry = '';

        if (info.ciudad) {
          translatedCity = await getPlaceTranslation(info.ciudad.nombre, userLang);
        }

        if (info.pais) {
          translatedCountry = await getPlaceTranslation(info.pais.nombre, userLang);
        }

        setFormData({
          title: info.name,
          date: isValidDate ? parsedDate.toISOString().split('T')[0] : '',
          city: info.ciudad?.nombre || '',
          countrie: info.pais?.nombre || '',
          description: info.description,
          time: info.time,
        });

        setLocation(translatedCity || info.ciudad?.nombre || '');
        setCountry(translatedCountry || info.pais?.nombre || '');
        setSelectedImage({ uri: info.avatar?.url });
      } else {
        resetForm();
      }
    };

    if (isOpen) {
      fetchTranslations();
    }
  }, [info, type, isOpen]);

  // Actualizar la función onClose para resetear cuando se cierre el modal
  const handleClose = () => {
    if (type !== 'edit') {
      resetForm();
    }
    onClose();
  };

  const handleLocationSelect = (place, placeLanguage) => {
    const cityComponent = place.address_components.find((c) =>
      c.types.includes('locality')
    );
    const countryComponent = place.address_components.find((c) =>
      c.types.includes('country')
    );
  
    if (cityComponent) {
      setLocation(placeLanguage.main_text);
      setFormData((prev) => ({ ...prev, city: cityComponent.short_name })); // Guardamos en inglés
    }
  
    if (countryComponent) {
      setCountry(placeLanguage.secondary_text);
      setFormData((prev) => ({ ...prev, countrie: countryComponent.long_name })); // Guardamos en inglés
    }
  };
  
  const handleCountrySelect = (place, placeLanguage) => {
    const countryComponent = place.address_components.find((c) =>
      c.types.includes('country')
    );
  
    if (countryComponent) {
      setCountry(placeLanguage.main_text);
      setFormData((prev) => ({ ...prev, countrie: countryComponent.long_name })); // Guardamos en inglés
    }
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
        aspect: [1, 1],
        quality: 1,
        selectionLimit: 1,
        orderedSelection: true
      });
  
      if (!result.canceled) {
        setSelectedImage({uri: result.assets[0].uri});
      }
  };

  const uploadPhoto = ({selectedImage, _id})=>{
    try {
      
      if(selectedImage){
        uploadImageExperience({selectedImage, _id}, logout)
          .then((res) => {
            if(type !== 'edit'){
              setMyExperiences(prevItems => [res, ...prevItems])
            }
            else{
              llamada()
            }
            onClose()
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
          });
      }
      else{
        onClose()
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  }
  
  const handleCreateExperience = async () => {
    if(!loading){
      setLoading(true)
      if (formData.title !== '' && formData.description !== '') {
        try {
          const dateTimeString = `${formData.date}T${formData.time}:00`; // Agregamos los segundos ":00"
          const dateObject = new Date(dateTimeString);
          
          const data = {
            title: formData.title,
            description: formData.description,
            date:dateObject,
            city: formData.city,
            countrie: formData.countrie
          }
          
          createExperience(data, logout)
            .then((res) => {
              
              uploadPhoto({
                selectedImage: selectedImage,
                _id: res.info._id, // Usas el ID generado en la respuesta
              });

              setFormData({
                title: '',
                description: '',
                city: '',
                countrie: '',
                date: new Date().toISOString().split('T')[0],
                time: '12:00',
              });
              setCountry('')
              setLocation('')
              setSelectedImage(subir)
              setLoading(false)
              setWinKylets(res.kylets)
            })
            .catch((error) => {
              setError(true);
              setErrorMessage(error.message);
              setLoading(false)
            });
        } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false)
        }
      }
      else{
        setError(true);
        setErrorMessage(screenTexts.FieldsErrorMessages);
        setLoading(false)
      }
    }
    
  };

  const handleUpdateExperience = async () => {
    if(!loading){
      setLoading(true)
      if (formData.title !== '' && formData.description !== '') {
        try {
          const dateTimeString = `${formData.date}T${formData.time}:00`; // Agregamos los segundos ":00"
          const dateObject = new Date(dateTimeString);
          
          const data = {
            _id: _id,
            title: formData.title,
            description: formData.description,
            date:dateObject,
            city: formData.city,
            countrie: formData.countrie
          }
          
          updateExperience(data, logout)
            .then((res) => {
              uploadPhoto({
                selectedImage: selectedImage,
                _id: res._id, // Usas el ID generado en la respuesta
              });
              setLoading(false)
            })
            .catch((error) => {
              setError(true);
              setErrorMessage(error.message);
              setLoading(false)
            });
        } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false)
        }
      }
      else{
        setError(true);
        setErrorMessage(screenTexts.FieldsErrorMessages);
        setLoading(false)
      }
    }

  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      Alert.alert(screenTexts.TitleErrorMessages);
      return;
    }
    if (!formData.description.trim()) {
      Alert.alert(screenTexts.DescriptionErrorMessages);
      return;
    }
    
    // En modo edición, si ya hay un país en formData.countrie, considerarlo válido
    if (type === 'edit') {
      // En modo edición, validar solo si el campo está completamente vacío
      if (!formData.countrie || formData.countrie.trim() === '') {
        Alert.alert(screenTexts.CountryErrorMessages);
        return;
      }
    } else {
      // En modo creación, validar normalmente
      if (!formData.countrie.trim()) {
        Alert.alert(screenTexts.CountryErrorMessages);
        return;
      }
    }
    
    if(type === 'edit'){
      handleUpdateExperience()
    } else {
      handleCreateExperience()
    }
    setStep(1);
    onClose();
  };

  const renderStep1 = () => {
    return (
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
                ? styles.subirFotoLocal // Si es una imagen con URI, aplica este estilo
                : styles.subirFotoUri, // Si es una imagen local, aplica este estilo
            ]}
    
          />
        </TouchableOpacity>
      </View>
    </View>
  )};

  const renderStep2 = () => {
    return (
      <View style={styles.stepContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{screenTexts.Title2}</Text>
          <Text style={styles.subtitle}>{screenTexts.Subtitle2}</Text>
        </View>
        
        <View style={[styles.formContainer, { zIndex: 9999 }]}>
          <View style={[styles.inputGroup, { zIndex: 9999 }]}>
            <Text style={styles.label}>{screenTexts.CityInput}</Text>
            <View style={{ height: 50, zIndex: 9999 }}>
              <LocationAutocomplete
                keey={`city-${type}-${_id || 'new'}`} // Key único para forzar re-render cuando sea necesario
                placeholder={screenTexts.CityPlaceHolder}
                type="(cities)"
                onSelect={handleLocationSelect}
                value={location}
              />
            </View>
          </View>

          <View style={[styles.inputGroup, { zIndex: 7000 }]}>
            <Text style={styles.label}>{screenTexts.CountrieInput}</Text>
            <View style={{ height: 50, zIndex: 7000 }}>
              <LocationAutocomplete
                keey={`country-${type}-${_id || 'new'}`} // Key único para forzar re-render cuando sea necesario
                placeholder={screenTexts.CountriePlaceHolder}
                type="(regions)"
                onSelect={handleCountrySelect}
                value={country}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderStep3 = () => {
    return (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title3}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle3}</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.TitleInput}</Text>
          <TextInput
            value={formData.title}
            onChangeText={(text) => setFormData({ ...formData, title: text })}
            style={styles.input}
            placeholder={screenTexts.TitlePlaceHolder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.DescriptionInput}</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder={screenTexts.DescriptionPlaceHolder}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.flex1]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{screenTexts.DateInput}</Text>
            </View>
            <TextInput
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
              style={styles.input}
              placeholder={screenTexts.DatePlaceHolder}
            />
          </View>

          <View style={[styles.inputGroup, styles.flex1]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{screenTexts.HourInput}</Text>
            </View>
            <TextInput
              value={formData.time}
              onChangeText={(text) => setFormData({ ...formData, time: text })}
              style={styles.input}
              placeholder={screenTexts.HourPlaceHolder}
            />
          </View>
        </View>
      </View>
    </View>
  )};

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
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
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
              >
                <Image source={x} style={styles.x}/>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${(step / 3) * 100}%` }
                ]} 
              >
                <LinearGradient
                  colors={[ '#004999', '#1D7CE4']}
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
              <Text style={[styles.stepText, step === 3 && styles.activeStep]}>
              {screenTexts.Step3}
              </Text>
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
                <TouchableOpacity
                  onPress={() => setStep(step - 1)}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>{screenTexts.Back}</Text>
                </TouchableOpacity>
              ):(
                <View style={styles.backButton}/>
              )}
              <View style={styles.nextButton}>
                <GradientButton 
                  color='Blue' 
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
      {error &&

        <Error message={errorMessage} func={setError} />

      }
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
    paddingTop: 16,
    zIndex: 1,
  },
  keyboardAvoidingView:{
    flex: 1,
    zIndex: 1,
  },
  subirFotoUri: { 
    height:100,
    width:103,
  },
  subirFotoLocal:{
    width: '99%',
    height: '99%',
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
    elevation: 5,
    zIndex: 1,
  },
  modalHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937'
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6',
    zIndex: 1,
  },
  progressBar: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
  gradient:{
    flex: 1
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
    zIndex: 1,
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
    zIndex: 2,
  },
  stepContainer: {
    padding: 24,
    flex: 1,
    width: '100%',
    zIndex: 5,
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
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 40,
    width: '100%',
    height: 150,
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
    gap: 20,
    zIndex: 5000,
  },
  inputGroup: {
    gap: 8,
    zIndex: 5000,
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
    backgroundColor: 'white',
    zIndex: 800,
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

export default AddExperienceModal;