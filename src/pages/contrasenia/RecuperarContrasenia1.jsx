import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import {enviarCodigoEmail} from '../../services/logServices';
import { LinearGradient } from 'expo-linear-gradient';
import Error from '../../components/Utils/Error';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import arrow_left from '../../../assets/arrow_left.png';


const RecuperarContrasenia1 = (props) => {
  const [username, setUsername] = useState('');
  const navigation=useNavigation()
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.contrasenia.RecuperarContrasenia1

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');


  const handleSubmit =()=>{
    if(!loading){
      setLoading(true)
      enviarCodigoEmail({username}, logout)
      .then((res)=>{
          setLoading(false)
          navigation.navigate('CodigoVerificacionContrasenia', {email:username})
      }
      ).catch(
        (error)=>{
          setError(true)
          setErrorMessage(error.message)
          setLoading(false)
        }
      )
    }
    
  }


  


  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={arrow_left} style={styles.backIcon} />
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.contentCard}>
            <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
            <Text style={styles.subtitle}>
              No te preocupes, te enviaremos un código de verificación a tu email para restablecer tu contraseña.
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Ingresa tu email"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={setUsername}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity 
              style={[styles.sendButton, !username && styles.sendButtonDisabled]}
              onPress={handleSubmit}
              disabled={!username || loading}
            >
              <LinearGradient
                colors={(!username || loading) ? ['#E5E7EB', '#9CA3AF'] : ['#004999', '#1D7CE4']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.sendButtonText}>
                  {loading ? 'Enviando...' : 'Enviar código'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.backToLogin}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && <Error message={errorMessage} func={setError} />}
        {loading && <LoadingOverlay />}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#374151',
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: -70,
  },
  contentCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '400',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sendButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#004999',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  sendButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonGradient: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  backToLogin: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  backToLoginText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#004999',
    textAlign: 'center',
  },
});

export default RecuperarContrasenia1;