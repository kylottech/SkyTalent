import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { getSteps, deleteStep } from '../../../services/experienceServices'
import { formatString } from '../../../utils/formatString'
import GradientButton from '../../../components/Utils/GradientButton';
import Loader from '../../../components/Utils/Loader';
import OptionsModal from '../../../components/wallet/Experiences/Modals/OpcionsModal';
import AddStepsModal from '../../../components/wallet/Experiences/Modals/AddStepsModal';
import Error from '../../../components/Utils/Error';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';

const { width } = Dimensions.get('window');

export default function StepGuide({ route }) {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Experiencias.StepGuide
  const { _id, llamada } = route.params;
  const [cargado, setCargado] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [info, setInfo] = useState({})
  const [steps, setSteps] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [modalType, setModalType] = useState('edit')
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [loading, setLoading] = useState(false);


  const handleGetSteps = async () => {
    if(!loading){
      setLoading(true)
      try {
        
        getSteps(_id, logout)
          .then((response) => {
            setSteps(response.steps)
            setInfo(response)
            setCargado(true)
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
    
  };

  const handleDeleteSteps = async () => {
    if(!loading){
      setLoading(true)
      try {
        
        deleteStep({_id: info._id, indice: currentStep}, logout)
          .then((response) => {
            
            if(!response){
              llamada()
              navigate.goBack()
              
            }
            else{
              setSteps(response.steps)
              setInfo(response)
            }
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
    
  };

  useEffect(() => {
    handleGetSteps()
  }, []);
  
  const handleEditFunc = () => {
    setModalType('edit'); 
    setShowConfirmation(false); 
    setShowStepModal(true)
  };

  const handleCreateFunc = () => {
    setModalType('Add'); 
    setShowConfirmation(false); 
    setShowStepModal(true)
  }

  const handleDeleteFunc = () => {
    handleDeleteSteps()
    setShowConfirmation(false); 
  }


  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    else {
      navigate.goBack()
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(
      handleGetSteps()
    );
    setRefreshing(false);
  }, []);

  return (
    <>
    {cargado ? (<SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContent}>
          <View style={styles.stepIndicator}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{currentStep + 1}</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
              <Text style={styles.headerSubtitle}>
                {formatString(screenTexts.Subtitle, { variable1: currentStep + 1, variable2: steps.length })}
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.optionsButton} onPress={() => setShowConfirmation(true)}>
            <View style={styles.optionDot}/>
            <View style={styles.optionDot}/>
            <View style={styles.optionDot}/>
          </TouchableOpacity>
        </View>

        {/* Progress Dots */}
        <View style={styles.progressContainer}>
          {steps.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentStep(index)}
              style={[
                styles.progressDot,
                currentStep === index && styles.progressDotActive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: steps[currentStep].avatar.url }}
          style={styles.stepImage}
        />
        <View style={styles.imageOverlay}>
          <TouchableOpacity
            style={[styles.navigationButton, currentStep === 0 && styles.navigationButtonDisabled]}
            onPress={handlePrevStep}
            disabled={currentStep === 0}
          >
            <Feather 
              name="chevron-left" 
              size={22} 
              color="#1D1D1F"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.navigationButton, currentStep === steps.length - 1 && styles.navigationButtonDisabled]}
            onPress={handleNextStep}
            disabled={currentStep === steps.length - 1}
          >
            <Feather 
              name="chevron-right" 
              size={22} 
              color="#1D1D1F"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content Section */}
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentContainer}>
          <Text style={styles.stepTitle}>
            {steps[currentStep].name}
          </Text>

          {/* Sección de información */}
          <View style={styles.infoSection}>
            {/* Descripción */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemContent}>
                <Text style={styles.infoItemTitle}>Descripción</Text>
                <Text style={styles.infoItemText}>
                  {steps[currentStep].description}
                </Text>
              </View>
              <View style={styles.infoDivider} />
            </View>

            {/* Ubicación */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemContent}>
                <Text style={styles.infoItemTitle}>{screenTexts.InfoLabelSubtitle}</Text>
                <Text style={styles.infoItemText}>
                  {steps[currentStep].ubication} 
                </Text>
              </View>
              <View style={styles.infoDivider} />
            </View>

            {/* Duración estimada */}
            <View style={styles.infoItem}>
              <View style={styles.infoItemContent}>
                <Text style={styles.infoItemTitle}>{screenTexts.InfoDurationLabelSubtitle}</Text>
                <Text style={styles.infoItemText}>
                  {steps[currentStep].duracionHoras > 0 && 
                    `${steps[currentStep].duracionHoras} ${steps[currentStep].duracionHoras === 1 ? 'hora' : 'horas'}`
                  }
                  {steps[currentStep].duracionHoras > 0 && steps[currentStep].duracionMinutos > 0 && ' y '}
                  {steps[currentStep].duracionMinutos > 0 && 
                    `${steps[currentStep].duracionMinutos} ${steps[currentStep].duracionMinutos === 1 ? 'minuto' : 'minutos'}`
                  }
                </Text>
              </View>
              <View style={styles.infoDivider} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButtonContainer}>
        <GradientButton 
          text={currentStep === steps.length - 1 ? screenTexts.GradientButton1 : screenTexts.GradientButton2} 
          color={'Blue'} 
          onPress={handleNextStep} 
        />
      </View>

      <OptionsModal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)} 
        options={3} 
        editFunc={handleEditFunc}
        createFunc = {handleCreateFunc}
        deleteFunc = {handleDeleteFunc}
      />

      <AddStepsModal 
        _id={info.partId} 
        isOpen={showStepModal} 
        onClose={() => setShowStepModal(false)} 
        llamada={handleGetSteps} 
        type={modalType}
        info={steps[currentStep]}
        loading={loading}
        setLoading={setLoading}
      />

      {error &&

        <Error message={errorMessage} func={setError} />

      }
      {loading && (
        <LoadingOverlay/>
      )}

      
    </SafeAreaView>):(
      <View style={{flex: 1}}>
        <Loader/>
      </View>
    )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#86868B',
    fontWeight: '400',
  },
  optionsButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  optionDot: {
    width: 4,
    height: 4,
    backgroundColor: '#86868B',
    borderRadius: 2,
    marginVertical: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5E7',
  },
  progressDotActive: {
    backgroundColor: '#1D7CE4',
  },
  imageContainer: {
    width: '100%',
    height: width * 0.7,
    position: 'relative',
    marginHorizontal: 24,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  stepImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  navigationButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  navigationButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    shadowOpacity: 0.1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 12,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  // Estilos para la sección de información
  infoSection: {
    marginTop: 4,
    marginBottom: 8,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoItemContent: {
    paddingVertical: 12,
  },
  infoItemTitle: {
    fontSize: 18,
    fontWeight: '300',
    color: '#000000',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 8,
  },
  infoItemText: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    letterSpacing: -0.2,
    lineHeight: 20,
  },
  infoDivider: {
    height: 0.5,
    backgroundColor: '#E5E5E7',
    marginTop: 4,
  },
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
  },
});