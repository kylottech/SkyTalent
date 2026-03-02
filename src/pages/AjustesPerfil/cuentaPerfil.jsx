import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import { updateEmail, updatePassword } from '../../services/profileService';

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import GradientButton from '../../components/Utils/GradientButton';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';


const CuentaPerfil = () => {
  const navigate= useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.cuentaPerfil

  const [email, setEmail]=useState('')
  const [antiguaContraseña, setAntiguaContraseña]=useState('')
  const [nuevaContraseña, setNuevaContraseña]=useState('')
  const [confirmacionContraseña, setConfirmacionContraseña]=useState('')

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);


  const guardarCambios = ()=>{
    if(!loading){
      setLoading(true)
      if(email!=''){
        updateEmail({email}, logout)
        .then(() => {
          setConfirmacionMensaje(screenTexts.MessageConfirmation)
          setConfirmacion(true)
          setLoading(false)
        })
        .catch((error) => {
          setError(true)
          setErrorMessage(error.message)
          setLoading(false)
        });
      }

      if(antiguaContraseña!='' && nuevaContraseña!='' && confirmacionContraseña!=''){
        if(passwordCheck()){
          if(nuevaContraseña==confirmacionContraseña){
            updatePassword({antiguaContraseña,nuevaContraseña}, logout)
            .then(() => {
              setConfirmacionMensaje(screenTexts.MessageConfirmation)
              setConfirmacion(true)
              setLoading(false)
              
            })
            .catch((error) => {
              setError(true)
              setErrorMessage(error.message)
              setLoading(false)
            });

          }
          else{
            setError(true)
            setErrorMessage(screenTexts.PasswordError)
            setLoading(false)
          }
        }
        
      }
      setLoading(false)
    }
    
         
  }

  const passwordCheck = () => {
    if (nuevaContraseña === '') {
      setErrorMessage('');
      setError(false);
      return false;
    } 
    else if (nuevaContraseña.includes(' ')) {
      setErrorMessage(screenTexts.PasswordSpaceError);
      setError(true);
      return false
    } 
    else if (nuevaContraseña.length < 8) {
      setErrorMessage(screenTexts.PasswordLengthError);
      setError(true);
      return false
    } 
    else if (!/[A-Z]/.test(nuevaContraseña)) {
      setErrorMessage(screenTexts.PasswordMajorError);
      setError(true);
      return false
    } 
    else if (!/[a-z]/.test(nuevaContraseña)) {
      setErrorMessage(screenTexts.PasswordLowerError);
      setError(true);
      return false
    } 
    else if (!/[0-9]/.test(nuevaContraseña)) {
      setErrorMessage(screenTexts.PasswordNumberError);
      setError(true);
      return false
    } 
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(nuevaContraseña)) {
      setErrorMessage(screenTexts.PasswordSpecialError);
      setError(true);
      return false
    } 
    else {
      setError(false);
      return true
    }
  }


  return (
    <View style={styles.container}>


        <Top 
          left={true} leftType={'Back'} 
          typeCenter={'Text'} textCenter={screenTexts.Top}
        />

        <ScrollView 
          contentContainerStyle={styles.content}
        >

            <Text style={styles.label}>{screenTexts.Email}</Text>
            <TextInput
                style={styles.input}
                placeholder={screenTexts.EmailPlaceHolder}
                value={email}
                onChangeText={(text) => setEmail(text)}
            />
            <Text style={styles.label}>{screenTexts.Password}</Text>
            <TextInput
                style={styles.input}
                placeholder={screenTexts.PasswordPlaceHolder}
                secureTextEntry
                value={antiguaContraseña}
                onChangeText={(text) => setAntiguaContraseña(text)}
            />
            <TextInput
                style={styles.input}
                placeholder={screenTexts.NewPasswordPlaceHolder1}
                secureTextEntry
                value={nuevaContraseña}
                onChangeText={(text) => setNuevaContraseña(text)}
            />
            <TextInput
                style={styles.input}
                placeholder={screenTexts.NewPasswordPlaceHolder2}
                secureTextEntry
                value={confirmacionContraseña}
                onChangeText={(text) => setConfirmacionContraseña(text)}
            />
            
            <GradientButton color='Blue' text={screenTexts.GradientButton}  onPress={guardarCambios}/>

        </ScrollView>
        
        {error &&

          <Error message={errorMessage} func={setError} />

        }

        {confirmacion &&

          <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

        }
        {loading && (
          <LoadingOverlay/>
        )}
      

    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:'white',
  },
  content:{
    flex:1,
    width:'100%',
    alignSelf: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  input: {
    width:'98%',
    height: 56,
    fontSize:16,
    backgroundColor: '#F8F9FA',
    borderColor: '#E5E5EA',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'center',
  },
  label:{
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 8,
  },
});

export default CuentaPerfil;