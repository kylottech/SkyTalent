import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, StyleSheet, Modal, 
  KeyboardAvoidingView, Platform 
} from 'react-native';
import { useUser } from "../../../../context/useUser";
import { createPart, updatePart, getLocations } from '../../../../services/experienceServices'
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../../Utils/GradientButton';
import MapContainer from '../../../Maps/MapContainer';
import Loader from '../../../Utils/Loader';
import LoadingOverlay from '../../../Utils/LoadingOverlay';
import { LinearGradient } from 'expo-linear-gradient';
import x from '../../../../../assets/x.png'

function AddPartModal({ isOpen, onClose, setParts, _id, type, info, llamada, loading, setLoading, setWinKylets }) {
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Wallet.Experiences.Modals.AddPartModal
  const [step, setStep] = useState(1);
  const [locations, setLocations] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grupo: '',
    _idPlace: '',
    time: '12:00',
  });
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [selectedPlaceName, setSelectedPlaceName] = useState('');

  const handleSelectPlace = (_id) => {
    const selectedPlace = locations.find(loc => loc._id === _id);
    if (selectedPlace) {
      setFormData(prev => ({ ...prev, _idPlace: _id }));
      setSelectedPlaceName(selectedPlace.name);
    }
  };

  const handleClearPlace = () => {
    setFormData(prev => ({ ...prev, _idPlace: '' }));
    setSelectedPlaceName('');
  };

  useEffect(() => {
    if (type === 'edit') {
      if(info){ 
        setFormData({
          name: info.name,
          grupo: info.grupo,
          time: info.time,
          _idPlace: info._idPlace,
        });
        setSelectedPlaceName(info.place)
      }
    }
    else{
      setFormData({
        name: '',
        grupo: '',
        time: '12:00',
        _idPlace: '',
      });
    }
  }, [info, type]);

  useEffect(() => {
    handleGetLocations()
  }, []);

  const transformLocation = (data) => {
    return data.map(item => {
      // Si la propiedad `coordinates` existe, transformarla
      if (item.location && item.location.coordinates && item.location.coordinates.length === 2) {
        return {
          _id: item._id,
          name: item.name,
          location: {
            latitude: item.location.coordinates[1], // Asumimos que el primer valor de `coordinates` es el `longitude`
            longitude: item.location.coordinates[0] // Y el segundo es el `latitude`
          }
        };
      }
      return item; // Si no hay coordenadas, devolver el objeto tal como está
    });
  };

  const handleCreateExperience = async () => { 
    if(!loading){
      setLoading(true)
      if (formData.name !== '' && formData.grupo !== '' && formData.time !== '' && formData._idPlace!== '' ) {
        try {
          
          createPart(formData, _id, logout)
            .then((res) => {
              llamada()
              onClose()
              setFormData({
                name: '',
                grupo: '',
                time: '12:00',
                _idPlace: '',
              });
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

  const handleGetLocations = async () => { 
    try {
        
      getLocations(logout)
        .then((res) => {
          setLocations(transformLocation(res))
          setCargando(true)
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

  const handleUpdateExperience = async () => {
    if(!loading){
      setLoading(true)
      if (formData.name !== '' && formData._idPlace !== '' && formData.grupo !== '' && formData.time !== '' ) {
        try {
          
          updatePart({data: formData, _idDay: _id, _id: info._id}, logout)
            .then(() => {
              llamada()
              onClose()
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
    if (!formData.name.trim()) {
      Alert.alert(screenTexts.NameErrorMessages);
      return;
    }
    if (!formData._idPlace.trim()) {
      Alert.alert(screenTexts.PlaceErrorMessages);
      return;
    }
    if (!formData.grupo.trim()) {
      Alert.alert(screenTexts.GroupErrorMessages);
      return;
    }
    if (!formData.time.trim()) {
      Alert.alert(screenTexts.TimeErrorMessages);
      return;
    }
    
    if(type === 'edit'){
      handleUpdateExperience()
    }
    else{
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

        <View style={styles.row}>
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

          <View style={[styles.inputGroup, styles.flex1]}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{screenTexts.GroupInput}</Text>
            </View>
            <TextInput
              value={formData.grupo}
              onChangeText={(text) => setFormData({
                ...formData,
                grupo: text
              })}
              style={styles.input}
              placeholder={screenTexts.GroupPlaceHolder}
            />
          </View>

        </View>
         
        
      </View>
    </View>
  )};

  const renderStep2 = () => {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>{screenTexts.Title2}</Text>
        <Text style={{ fontSize: 14, color: 'gray', marginBottom: 12 }}>
          {screenTexts.Subtitle2}
        </Text>

        {selectedPlaceName !== '' && (
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 12,
            backgroundColor: '#F3F4F6',
            padding: 10,
            borderRadius: 8
          }}>
            <Text style={{ fontSize: 16, color: '#1F2937', flex: 1 }}>
              {selectedPlaceName}
            </Text>
            <TouchableOpacity onPress={handleClearPlace}>
              <Image source={x} style={{ width: 16, height: 16 }} />
            </TouchableOpacity>
          </View>
        )}

        <MapContainer
          type={'View'}
          locations={locations}
          onPress={handleSelectPlace}
          setError={setError}
          setErrorMessage={setErrorMessage}
        />
      </View>
    );
};

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
                  { width: `${(step / 2) * 100}%` }
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
              <Text style={[styles.stepText, step === 1 && styles.activeStep]}>
              {screenTexts.Step2}
              </Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.content}>
              {step === 1 && renderStep1()}
              {step === 2 && (
                cargando ? (
                  renderStep2()
                ) : (
                  <Loader/>
                )
              )}
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
                  text={step === 2 ? screenTexts.GradientButton1 : screenTexts.GradientButton2}  
                  onPress={() => {
                    if (step === 2) {
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
  keyboardAvoidingView:{
    flex: 1,
    width: '100%'
  },
  subirFotoUri: { 
    height:100,
    width:103,
  },
  subirFotoLocal:{
    width: '100%',
    height: '100%',
    borderRadius: 9, 
  },
  modalContent: {
    flex: 1,
    width:'100%',
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
  gradient:{
    flex: 1
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
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

export default AddPartModal;