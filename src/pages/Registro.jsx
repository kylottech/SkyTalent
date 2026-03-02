import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import {register} from '../services/logServices';
import HorizontalSlider from '../components/Utils/HorizontalSlider';
import Error from '../components/Utils/Error';
import DatePicker from '../components/Login/Registro/DatePicker';
import GenderPicker from '../components/Login/Registro/GenderPicker';
import LanguagePicker from '../components/Login/Registro/LanguagePicker';
import LoadingOverlay from '../components/Utils/LoadingOverlay';
import volver from '../../assets/arrow_left.png';
import kylot from '../../assets/logoKylot_blanco.png';
import bandera from '../../assets/Espanita.png';
import { TextInput } from 'react-native';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';



const Registro = () => {
    const [activeButton, setActiveButton] = useState(1);
    const [language, setLanguage] = useState('');
    const [username, setUsername] = useState('');
    const [surname, setSurname] = useState('');
    const [kylotID, setKylotID] = useState('');
    const [flag, setFlag] = useState(bandera);
    const [prefix, setPrefix] = useState('+34');
    const [prefixVisible, setPrefixVisible] = useState(false);
    const [tlfnumber, setTlfnumber] = useState(); 
    const [email, setEmail] = useState('');
    const [password, setPasword] = useState('');
    const [password2, setPasword2] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(true);
    const [passwordVisible2, setPasswordVisible2] = useState(true);
    const [emailMensaje, setEmailMensaje] = useState('');
    const [emailError, setEmailError] = useState(true);
    const [tlfMensaje, setTlfMensaje] = useState('');
    const [tlfError, setTlfError] = useState(true);
    const [passwordMensaje, setPasswordMensaje] = useState('');
    const [passwordError, setPasswordError] = useState(true);
    const [passwordMensaje2, setPasswordMensaje2] = useState('');
    const [passwordError2, setPasswordError2] = useState(true);
    const [date, setDate] = useState(null);
    const [gender, setGender] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Errorrr');
    const navigate=useNavigation()
    const { texts }=useUser()
    const screenTexts = texts.pages.Registro
    

  const handleRegister = () => {
    if(!loading){
      setLoading(true)
      if(emptyCheck()){ 
        if(telefoneCheck()){
          if(emailCheck()){
            if(passwordCheck()){
              if(password2Check()){
                register({ username: username,surname: surname,kylotID: kylotID,tlfnumber: tlfnumber,
                  email: email,password: password, date: date, gender: gender})
                .then((res) => {
                  setLoading(false)
                  navigate.navigate('CodigoVerificacion',{email: email});
                })
                .catch((error) => {
                  setError(true)
                  setErrorMessage(error.message)
                  setLoading(false)
                });
              } else {
                setError(true)
                setErrorMessage(passwordMensaje2)
                setLoading(false)
              }
            } else {
              setError(true)
              setErrorMessage(passwordMensaje)
              setLoading(false)
            }
          } else {
            setError(true)
            setErrorMessage(emailMensaje)
            setLoading(false)
          }
        } else {
          setError(true)
          setErrorMessage(tlfMensaje)
          setLoading(false)
        }
      } else {
        setError(true)
        setErrorMessage(screenTexts.FillsEmptyError)
        setLoading(false)
      }
    }
    
    
  };
  
  const toggleActiveButton = () => {
    setActiveButton((prevActiveButton) => {
        if (prevActiveButton < 12) {
            return prevActiveButton + 1; 
        } else {
            handleRegister()
            return prevActiveButton; 
        }
    });
  };

  const handleBack = () => {
      if(activeButton !== 1){
          setActiveButton((activeButton - 1))
      }
      else{
        navigate.goBack()
      }
  }

  handleMenu = () => {
    setMenuVisible(!menuVisible)
  }

  const handleGender = (gender) => {
    setGender(gender)
  }

  const passwordCheck = () => {
    if (password === '') {
      setPasswordMensaje('');
      setPasswordError(false);
      return false;
    } 
    else if (password.includes(' ')) {
      setPasswordMensaje(screenTexts.SpacePasswordError);
      setPasswordError(true);
      return false
    } 
    else if (password.length < 8) {
      setPasswordMensaje(screenTexts.CharactersPasswordError);
      setPasswordError(true);
      return false
    } 
    // Verifica si hay al menos una mayúscula y al menos una minúscula
    else if (!/[A-Z]/.test(password)) {
      setPasswordMensaje(screenTexts.MayuscPasswordError);
      setPasswordError(true);
      return false
    } 
    else if (!/[a-z]/.test(password)) {
      setPasswordMensaje(screenTexts.MinuscPasswordError);
      setPasswordError(true);
      return false
    } 
    else if (!/[0-9]/.test(password)) {
      setPasswordMensaje(screenTexts.NumberPasswordError);
      setPasswordError(true);
      return false
    } 
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordMensaje(screenTexts.SpecialCharactersError);
      setPasswordError(true);
      return false
    } 
    else {
      setPasswordMensaje(screenTexts.ValidPassword);
      setPasswordError(false);
      return true
    }
  }

  const password2Check = () => {
    // Si la contraseña está vacía, se considera sin error
    if (password === '' || password2 === '') {
      setPasswordMensaje2('');
      setPasswordError2(false);
      return false;
    }

    // Comprobamos si las contraseñas coinciden
    if (password !== password2) {
      setPasswordMensaje2(screenTexts.NotSamePasswords);
      setPasswordError2(true);
      return false;
    }
    else {
      setPasswordMensaje2('');
      setPasswordError2(false);
      return true
    }
  }

  const emptyCheck = () => {
    if(username !=="" && 
      surname !=="" && 
      kylotID!=="" && 
      tlfnumber!=="" && 
      email!=="" && 
      password!=="" && 
      password2!=="" && 
      date!=="" && 
      gender!==""){
        return true
    }
    else {
      return false
    }
  }

  const emailCheck = () => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setEmailMensaje(screenTexts.NotValidEmail);
      setEmailError(true);
      return false;
    } else {
      setEmailMensaje('');
      setEmailError(false);
      return true;
    }
  }

  const telefoneCheck = () => {
    const fullNumber = prefix + tlfnumber;

    // Analizar el número de teléfono
    const phoneNumber = parsePhoneNumberFromString(fullNumber);

    // Verificar si el número es válido
    if (!phoneNumber && !isValidPhoneNumber(fullNumber)) {
      setTlfMensaje(screenTexts.PrefixNotValid);
      setTlfError(true);
      return false;
    } else {
      setTlfMensaje('');
      setTlfError(false);
      return true;
    }
  }

  useEffect(() => {
    passwordCheck()
  }, [password]);  

  useEffect(() => {
    password2Check()
  }, [password2]);

  useEffect(() => {
    emailCheck()
  }, [email]);

  useEffect(() => {
    telefoneCheck()
  }, [tlfnumber]);

  return (
    
    <View style={styles.container}>
    <LinearGradient
      colors={['#001529', '#003A8C']}
      start={[0, 0]}
      end={[1, 1]}
      style={styles.gradient}
    >
      <View style={styles.top}>
        <TouchableOpacity style={styles.button} onPress={() => handleBack()}>
          <Image source={volver} style={styles.volver} />
        </TouchableOpacity>
        <Image source={kylot} style={styles.kylot} />
      </View>

      <View style={styles.optionContainer}>
        {/* Pickers fuera del TouchableWithoutFeedback para que funcionen bien */}
        {activeButton === 1 && (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Paso 1 de 12</Text>
              <Text style={styles.stepSubtitle}>Configuración inicial</Text>
            </View>
            <Text style={styles.fieldLabel}>{screenTexts.LanguageButton}</Text>
            <LanguagePicker onLanguageChange={setLanguage} />
          </>
        )}
        {activeButton === 9 && (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Paso 9 de 12</Text>
              <Text style={styles.stepSubtitle}>Información personal</Text>
            </View>
            <Text style={styles.fieldLabel}>{screenTexts.Texto9}</Text>
            <View style={styles.pickerCard}>
              <DatePicker onDateChange={setDate} initialDate={date} />
            </View>
          </>
        )}
        {activeButton === 10 && (
          <>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Paso 10 de 12</Text>
              <Text style={styles.stepSubtitle}>Información personal</Text>
            </View>
            <Text style={styles.fieldLabel}>{screenTexts.Texto10}</Text>
            <View style={styles.pickerCard}>
              <GenderPicker onGenderChange={handleGender} initialGender={gender} />
            </View>
          </>
        )}

        {/* El resto de inputs envueltos en TouchableWithoutFeedback */}
        {(activeButton === 2 ||
          activeButton === 3 ||
          activeButton === 4 ||
          activeButton === 5 ||
          activeButton === 6 ||
          activeButton === 7 ||
          activeButton === 8 ||
          activeButton === 11 ||
          activeButton === 12) && (
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} accessible={false}>
            <View>
              {activeButton === 2 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 2 de 12</Text>
                    <Text style={styles.stepSubtitle}>Información personal</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto1}</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Nombre"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={username}
                      onChangeText={(text) => setUsername(text)}
                      autoCapitalize="words"
                    />
                  </View>
                </>
              )}
              {activeButton === 3 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 3 de 12</Text>
                    <Text style={styles.stepSubtitle}>Información personal</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto2}</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Apellido"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={surname}
                      onChangeText={(text) => setSurname(text)}
                      autoCapitalize="words"
                    />
                  </View>
                </>
              )}
              {activeButton === 4 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 4 de 12</Text>
                    <Text style={styles.stepSubtitle}>Identificación única</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto3}</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Kylot ID"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={kylotID}
                      onChangeText={(text) => setKylotID(text)}
                      autoCapitalize="none"
                    />
                  </View>
                </>
              )}
              {activeButton === 5 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 5 de 12</Text>
                    <Text style={styles.stepSubtitle}>Información de contacto</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto4}</Text>
                  <View style={styles.inputCard}>
                    <View style={styles.phoneContainer}>
                      <TextInput
                        style={styles.prefixInput}
                        placeholder="+34"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={prefix}
                        onChangeText={(text) => setPrefix(text)}
                        keyboardType="numeric"
                        maxLength={9}
                      />
                      <TextInput
                        style={styles.phoneInput}
                        placeholder="Teléfono"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={tlfnumber}
                        onChangeText={(text) => setTlfnumber(text)}
                        keyboardType="numeric"
                        maxLength={9}
                      />
                    </View>
                  </View>
                  <View style={styles.validationMessage}>
                    <Text
                      style={[
                        styles.validationText,
                        tlfError ? { color: '#EF4444' } : { color: '#10B981' },
                      ]}
                    >
                      {tlfMensaje}
                    </Text>
                  </View>
                </>
              )}
              {activeButton === 6 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 6 de 12</Text>
                    <Text style={styles.stepSubtitle}>Información de contacto</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto6}</Text>
                  <View style={styles.inputCard}>
                    <TextInput
                      style={styles.inputField}
                      placeholder="Email"
                      placeholderTextColor="rgba(255, 255, 255, 0.5)"
                      value={email}
                      onChangeText={(text) => setEmail(text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>
                  <View style={styles.validationMessage}>
                    <Text
                      style={[
                        styles.validationText,
                        emailError ? { color: '#EF4444' } : { color: '#10B981' },
                      ]}
                    >
                      {emailMensaje}
                    </Text>
                  </View>
                </>
              )}
              {activeButton === 7 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 7 de 12</Text>
                    <Text style={styles.stepSubtitle}>Seguridad</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto7}</Text>
                  <View style={styles.inputCard}>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Contraseña"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={password}
                        secureTextEntry={passwordVisible}
                        onChangeText={(text) => setPasword(text)}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                      >
                        <Text style={styles.eyeIcon}>{passwordVisible ? '👁️' : '👁️‍🗨️'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.passwordRequirementsCard}>
                    <Text style={styles.requirementsTitle}>Requisitos de contraseña</Text>
                    <View style={styles.requirementsList}>
                      <View style={styles.requirementItem}>
                        <Text style={styles.requirementIcon}>
                          {password.length >= 8 ? '✓' : '○'}
                        </Text>
                        <Text style={[
                          styles.requirementText,
                          password.length >= 8 ? styles.requirementMet : styles.requirementUnmet
                        ]}>
                          Mínimo 8 caracteres
                        </Text>
                      </View>
                      <View style={styles.requirementItem}>
                        <Text style={styles.requirementIcon}>
                          {/[A-Z]/.test(password) ? '✓' : '○'}
                        </Text>
                        <Text style={[
                          styles.requirementText,
                          /[A-Z]/.test(password) ? styles.requirementMet : styles.requirementUnmet
                        ]}>
                          Al menos una mayúscula
                        </Text>
                      </View>
                      <View style={styles.requirementItem}>
                        <Text style={styles.requirementIcon}>
                          {/[a-z]/.test(password) ? '✓' : '○'}
                        </Text>
                        <Text style={[
                          styles.requirementText,
                          /[a-z]/.test(password) ? styles.requirementMet : styles.requirementUnmet
                        ]}>
                          Al menos una minúscula
                        </Text>
                      </View>
                      <View style={styles.requirementItem}>
                        <Text style={styles.requirementIcon}>
                          {/[0-9]/.test(password) ? '✓' : '○'}
                        </Text>
                        <Text style={[
                          styles.requirementText,
                          /[0-9]/.test(password) ? styles.requirementMet : styles.requirementUnmet
                        ]}>
                          Al menos un número
                        </Text>
                      </View>
                      <View style={styles.requirementItem}>
                        <Text style={styles.requirementIcon}>
                          {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? '✓' : '○'}
                        </Text>
                        <Text style={[
                          styles.requirementText,
                          /[!@#$%^&*(),.?":{}|<>]/.test(password) ? styles.requirementMet : styles.requirementUnmet
                        ]}>
                          Al menos un carácter especial
                        </Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
              {activeButton === 8 && (
                <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 8 de 12</Text>
                    <Text style={styles.stepSubtitle}>Seguridad</Text>
                  </View>
                  <Text style={styles.fieldLabel}>{screenTexts.Texto8}</Text>
                  <View style={styles.inputCard}>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={styles.inputField}
                        placeholder="Repetir contraseña"
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        value={password2}
                        secureTextEntry={passwordVisible2}
                        onChangeText={(text) => setPasword2(text)}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity 
                        style={styles.eyeButton}
                        onPress={() => setPasswordVisible2(!passwordVisible2)}
                      >
                        <Text style={styles.eyeIcon}>{passwordVisible2 ? '👁️' : '👁️‍🗨️'}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.validationMessage}>
                    <Text
                      style={[
                        styles.validationText,
                        passwordError2 ? { color: '#EF4444' } : { color: '#10B981' },
                      ]}
                    >
                      {passwordMensaje2}
                    </Text>
                  </View>
                </>
              )}
               {activeButton === 11 &&
                  <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 11 de 12</Text>
                    <Text style={styles.stepSubtitle}>Términos y condiciones</Text>
                  </View>
                  <Text style={styles.languageTitle}>{screenTexts.Texto11}</Text>
                  
                  <View style={styles.legalCard}>
                    <Text style={styles.legalText}>
                    {screenTexts.PPSubtitle1}
                      <TouchableOpacity>
                        <Text style={styles.legalLink}>{screenTexts.PPSubtitleTouchable2}</Text>
                      </TouchableOpacity>
                      {screenTexts.PPSubtitle3}
                      <TouchableOpacity>
                        <Text style={styles.legalLink}>{screenTexts.PPSubtitleTouchable4}</Text>
                      </TouchableOpacity>
                      {screenTexts.PPSubtitle5}
                    </Text>
                  </View>
                  </>
                }
                {activeButton === 12 && 
                  <>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>Paso 12 de 12</Text>
                    <Text style={styles.stepSubtitle}>Finalización</Text>
                  </View>
                  <Text style={styles.languageTitle}>{screenTexts.Texto12}</Text>
                  <View style={styles.welcomeCard}>
                    <Text style={styles.welcomeText}>{screenTexts.UKSubtitle1}</Text>
                  </View>
                  </>
                }
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>

      <View style={styles.componentContainer}>
        {activeButton <= 10 && (
          <View style={{ zIndex: 9999 }}>
            <HorizontalSlider
              text={screenTexts.ContinueHorizontalSlider}
              color="Blue"
              onPress={toggleActiveButton}
              size="Big"
            />
          </View>
        )}
        {activeButton > 10 && (
          <View style={{ zIndex: 9999 }}>
            <HorizontalSlider
              text={
                activeButton === 11
                  ? screenTexts.AcceptHorizontalSlider
                  : activeButton === 12
                  ? screenTexts.AcceptHorizontalSlider2
                  : ''
              }
              color="Gold"
              onPress={toggleActiveButton}
              size="Big"
            />
          </View>
        )}
      </View>

      {error && <Error message={errorMessage} func={setError} />}
      {loading && (
        <LoadingOverlay/>
      )}
    </LinearGradient>
  </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'blue'
  },
  gradient:{
    height: '100%',
    width: '100%',
  },
  componentContainer:{
    height:60,
    width: '100%',
    paddingHorizontal: 24,
    position: 'absolute',
    bottom: 0,
    marginBottom:40,
    paddingTop: 12,
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
    left: 18,
    paddingTop: 10,
    marginLeft:10,
  },
  volver:{
    width:30,
    height:20,
  },
  kylot:{
    alignSelf: 'center',
    width: 120,
    height: 40
  },
  flag:{
    alignSelf: 'center',
    width: 30,
    height: 30
  },
  track:{
    width: 200,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
  },
  flecha1:{
    position:'absolute',
    left: '45%'
  },
  flecha2:{
    position:'absolute',
    left: '40%'
  },
  flecha3:{
    position:'absolute',
    left: '35%'
  },
  sliderContent:{
    width: 40, 
    height: 40,
    backgroundColor: '#0F63BF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50
  },
  optionContainer:{
    flex: 1,
    justifyContent: 'center',
    marginBottom: 200
  },
  Texto:{
    color: 'white',
    marginBottom: 12,
    alignSelf: 'center',
  },
  Texto2:{
    color: 'white',
    marginBottom: 12,
    alignSelf: 'center',
    fontSize: 34,
    fontWeight:'bold'
  },
  input:{
    //width: 250,
    fontSize: 38,
    fontWeight: 'bold',
    color: 'white',
    //marginRight: 5,
    alignSelf: 'center'

  },
  inputEmail:{
    //width: 250,
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    //marginRight: 5,
    alignSelf: 'center'

  },
  prefijo:{
    color: 'white',
    marginRight: 5,
    fontSize: 34
  },
  inputTlf:{
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center'
  },
  lineaV:{
    height: 17,
    borderColor: 'white',
    borderWidth: 0.8,
    marginHorizontal: 20,
    marginVertical: 16,
  },
  lineaH:{
    width: '88%',
    borderColor: 'white',
    borderWidth: 0.8,
  },
  ojo:{
    alignSelf: 'flex-end'
  },
  inputGender:{
    width: '80%',
    color: 'white',
    marginRight: 5,
    fontSize: 15,
    //fontWeight: 'bold'
    borderBottomColor: 'white',
    borderBottomWidth: 1
  },
  flecha:{
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20
  },
  menu:{
    width: '88%',
    //height: 140,
    marginTop: 15,
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10
  },
  menuText:{
    color: 'white',
    fontSize: 15,
    marginVertical: 8,
    //fontWeight: 'bold',
    marginLeft: 10
  },
  passwordMensaje:{
    alignSelf: 'center', 
    marginTop: 20,
    marginHorizontal: 10
  },
  passwordSee:{
    alignSelf: 'center', 
    marginTop: 10,
    marginHorizontal: 10,
    color: '#9d9d9d'
  },
  politica: {
    flexDirection: 'row',  
    flexWrap: 'wrap',     
    marginHorizontal: 20,
    justifyContent: 'center'
  },
  textoPolitica: {
    color: 'white',    
    fontSize: 13,
    textAlign: 'center'
  },
  textoPoliticaTouch: {
    color: 'white',         
    textDecorationLine: 'underline', 
    fontSize: 13,
    marginBottom: -5
  },
  textoBienvenida: {
    color: 'white',
    textAlign: 'center',
    marginHorizontal: 20,
    fontSize: 13

  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stepTitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  stepSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    fontWeight: '400',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  languageTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.8,
    lineHeight: 38,
    marginHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  fieldLabel: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  inputCard: {
    backgroundColor: '#002B5C',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputField: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outline: 'none',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    position: 'absolute',
    right: 0,
    top: 16,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  prefixInput: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 0,
    minWidth: 80,
    textAlign: 'center',
    outline: 'none',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderWidth: 0,
    outline: 'none',
  },
  validationMessage: {
    marginTop: 16,
    marginHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  validationText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  passwordRequirementsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 12,
    marginHorizontal: 24,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  requirementsList: {
    gap: 6,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  requirementIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 12,
    width: 20,
    textAlign: 'center',
  },
  requirementText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  requirementMet: {
    color: '#10B981',
  },
  requirementUnmet: {
    color: 'rgba(255, 255, 255, 0.6)',
  },
  pickerCard: {
    backgroundColor: '#002B5C',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legalCard: {
    backgroundColor: '#002B5C',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  legalText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  legalLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#002B5C',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  boton:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  botonTexto:{
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  }, 
});

export default Registro;


