import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import {nuevaContrasenia} from '../../services/logServices';
import GradientButton from '../../components/Utils/GradientButton';
import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';


const RecuperarContrasenia2 = ({route}) => {
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const navigation=useNavigation()
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.contrasenia.RecuperarContrasenia2
  const [loading, setLoading] = useState(false);

  const handleCambiar =()=>{
    if(!loading){
      setLoading(true)
      if(password!='' && password2!=''){
        if(passwordCheck()){
          if(password==password2){
            nuevaContrasenia({ password , email:route.params.email}, logout)
            .then(() => {
              setLoading(false)
              navigation.navigate('Login');
            })
            .catch((error) => {
              setError(true);
              setErrorMessage(error.message);
              setLoading(false)
            });
          }else{
            setError(true);
            setErrorMessage(screenTexts.NotEqualPasswordsError);
            setLoading(false)
          }
        }
      }
    }
    
  }

  const passwordCheck = () => {
    if (password === '') {
      setErrorMessage('');
      setError(false);
      return false;
    } 
    else if (password.includes(' ')) {
      setErrorMessage(screenTexts.PasswordSpaceError);
      setError(true);
      return false
    } 
    else if (password.length < 8) {
      setErrorMessage(screenTexts.PasswordLengthError);
      setError(true);
      return false
    } 
    else if (!/[A-Z]/.test(password)) {
      setErrorMessage(screenTexts.PasswordMajorError);
      setError(true);
      return false
    } 
    else if (!/[a-z]/.test(password)) {
      setErrorMessage(screenTexts.PasswordLowerError);
      setError(true);
      return false
    } 
    else if (!/[0-9]/.test(password)) {
      setErrorMessage(screenTexts.PasswordNumberError);
      setError(true);
      return false
    } 
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
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

        <Top left={true} leftType={'Back'} typeCenter={'Photo'}/>
        <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
      
        <TextInput
            style={styles.input}
            placeholder={screenTexts.NewPasswordPlaceHolder}
            value={password}
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
        />

        <TextInput
            style={styles.input}
            placeholder={screenTexts.RepeatNewPasswordPlaceHolder}
            value={password2}
            secureTextEntry
            onChangeText={(text) => setPassword2(text)}
        />

        
        <GradientButton text={screenTexts.GradientButton} color={'Blue'} onPress={handleCambiar} />
        
        {error &&

        <Error message={errorMessage} func={setError} />

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
    width: '100%',
    paddingHorizontal:16,
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 50,
  /*fontFamily: 'Arial',*/
  },
  textContrasenia:{
    fontSize: 22,
    fontWeight: '600',
    alignSelf: 'center',
    marginBottom:30,
    marginTop:45,
  /*fontFamily: 'Arial',*/

  },
  input: {
    height: 56,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius:10,
    borderColor: '#A7B0C0',
    fontSize:18,
    alignSelf: 'center',
    width:'98%',

  },
  botonInicio: {
    height: 56,
    borderRadius: 10,
    backgroundColor:'#212121',
    justifyContent:'center',
    alignItems:'center',
    marginTop:12,
    alignSelf: 'center',
    width:'98%',
  },
  botonTexto: {
    color: 'white',
    fontSize:18,
    /*fontFamily: 'Arial',*/
    fontWeight:'700',

  },
  botonVolver:{
    height: 56,
    borderRadius: 10,
    borderColor:'#212121',
    borderWidth:1,
    justifyContent:'center',
    alignItems:'center',
    marginTop:12,
    alignSelf: 'center',
    width:'98%',
  },
  botonTextoVolver:{
    fontSize:18,
    /*fontFamily: 'Arial',*/
    fontWeight:'700',

  },
  top:{
    flexDirection: 'row',
    marginTop: 35,
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent :  'center',

  },
  button: {
    width:40,
    height:30,
    position:'absolute',
    left: 0,
    paddingTop: 10,
    marginLeft:10,
  },
  volver:{
    width:30,
    height:20,
  },
  kylot:{
    alignSelf: 'center',
  },

});

export default RecuperarContrasenia2;