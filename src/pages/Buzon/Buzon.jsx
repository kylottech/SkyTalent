import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Animated, Dimensions, Modal, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import { send } from '../../services/buzonServices';

import Error from '../../components/Utils/Error';
import GradientButton from '../../components/Utils/GradientButton';
import Top from '../../components/Utils/Top';
import InfoModal from '../../components/Utils/InfoModal';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';


export default function MailboxScreen() {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Buzon.Buzon

  const [newSituation, setNewSituation] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  

  useEffect(() => { 
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading])
  
  
  const handleSend = () => {
    if(!loading){
      setLoading(true)
      try {
        send(newSituation, logout)
          .then(() => {
            showConfirmationModal()
            setNewSituation('')
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
    
  }


  const showConfirmationModal = () => {
    setShowConfirmation(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideConfirmationModal = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowConfirmation(false);
      navigate.goBack();
    });
  };

  const handleFocus = () => {
    setIsFocused(true);
    Animated.spring(rotateAnim, {
      toValue: 1.5,
      useNativeDriver: true,
      tension: 20,
      friction: 7,
    }).start();
  };

  const handleBlur = () => {
    if (!newSituation.trim()) {
      setIsFocused(false);
      Animated.spring(rotateAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 20,
        friction: 7,
      }).start();
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-80deg'],
  });

  return (
    <View style={styles.container}>

      <Top 
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
      />
      <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.textTitulo}>{screenTexts.Title}</Text>
                  
      <Text style={styles.subTextTitulo}>
      {screenTexts.Subtitle}
      </Text>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Premium Card */}
        <TouchableOpacity 
          activeOpacity={1}
          style={styles.premiumCard}
          onPress={() => {
            if (!isFocused) {
              handleFocus();
            }
          }}>
          
          {/* Card Header */}
          <View style={styles.cardHeader}>
            <View style={styles.headerIconContainer}>
              <LinearGradient
                colors={['#007AFF', '#5AC8FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              >
                <Text style={styles.headerIcon}>💭</Text>
              </LinearGradient>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.cardTitle}>{screenTexts.BookTitle}</Text>
              <Text style={styles.cardSubtitle}>Cuéntanos lo que piensas</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.premiumInput}
              placeholder={screenTexts.BookPlaceHolder}
              placeholderTextColor="#8E8E93"
              multiline
              value={newSituation}
              onChangeText={setNewSituation}
              onFocus={handleFocus}
              onBlur={handleBlur}
              textAlignVertical="top"
            />
          </View>

          {/* Character Counter */}
          <View style={styles.footer}>
            <Text style={styles.characterCount}>{newSituation.length} caracteres</Text>
            {newSituation.trim() && (
              <View style={styles.readyIndicator}>
                <Text style={styles.readyText}>✓ Listo para enviar</Text>
              </View>
            )}
          </View>

        </TouchableOpacity>
        
        {/* Send Button */}
        <GradientButton 
          color="Blue" 
          text={screenTexts.GradientButton} 
          onPress={() => {
            if (newSituation.trim()) {
              setError(false)
              handleSend();
            }
            else{
              setError(true)
              setErrorMessage(screenTexts.SendError)
            }
          }}
          disabled={!newSituation.trim()} 
        />

      </View>

      <InfoModal 
        isOpen={showConfirmation}
        onClose={ () => setShowConfirmation(false)} 
        Title={screenTexts.TitleConfimation} 
        Subtitle= {screenTexts.SubtitleConfirmation} 
        Button={screenTexts.ButtonConfirmation}
      />
      </ScrollView>
      {error &&

      <Error message={errorMessage} func={setError} />

      }

      {loading && (
        <LoadingOverlay/>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
  },
  content:{
    width:'100%',
    alignSelf: 'center',
    paddingHorizontal:16,
  },
  mainContent: {
    marginTop: 8,
  },
  // Premium Card Styles
  premiumCard: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  headerIconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  headerIcon: {
    fontSize: 28,
  },
  headerTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  inputContainer: {
    padding: 20,
    minHeight: 280,
  },
  premiumInput: {
    flex: 1,
    fontSize: 17,
    color: '#1A1A1A',
    lineHeight: 26,
    fontWeight: '400',
    textAlignVertical: 'top',
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FAFAFA',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  characterCount: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  readyIndicator: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  readyText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textTitulo:{
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginTop:20,
    marginBottom:8,
  },
  subTextTitulo:{
    fontSize: 14,
    color: '#6B7280',
    alignSelf: 'flex-start',
    marginHorizontal: 16,
    marginBottom:24,
  },
});