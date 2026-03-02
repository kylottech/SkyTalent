import React, { useEffect, useRef, useState } from 'react';
import {View, TextInput, StyleSheet, Text, TouchableOpacity, Keyboard,
  TouchableWithoutFeedback, ScrollView, ActivityIndicator, Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'

import { codVeriRegister } from '../../services/logServices';

import GradientButton from '../../components/Utils/GradientButton';
import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';


const CodigoVerificacion = ({ route }) => {
  const navigate = useNavigation();
  const { setToken, setVerificacion, texts } = useUser();
  const screenTexts = texts.pages.codigosVerificacion.CodigoVerificacion;

  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [numero3, setNumero3] = useState('');
  const [numero4, setNumero4] = useState('');
  const [numero5, setNumero5] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];
  
  useEffect(() => {
    setEmail(ocultarEmail(route.params.email));
  }, []);


  const handleSendCode = async () => {
    if(!loading){
      if (numero1 && numero2 && numero3 && numero4 && numero5) {
        const codigoNumber = parseInt(numero1 + numero2 + numero3 + numero4 + numero5);
        setCodigo(codigoNumber);
        try {
          const id = await AsyncStorage.getItem('_id');
          await codVeriRegister({ _id: id, codigo: codigoNumber })
            .then(async (res) => {
              await AsyncStorage.setItem('_id', res._id);
              await AsyncStorage.setItem('token', res.token);
              await AsyncStorage.setItem('verificacion', JSON.stringify(res.verificacion));

              setToken(res.token);
              setVerificacion(res.verificacion);
              setLoading(false)

              if (res.verificacion === 0) {
                navigate.navigate('ThankYouScreen');
              } else if (res.verificacion === 1 || res.verificacion === 2) {
                navigate.navigate('Decision');
              } else if (res.verificacion === 3) {
                navigate.navigate('GlobeScreen');
              }
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
    
  };

  const volverEnviar = () => {
    // Función placeholder
  };


  const ocultarEmail = (email) => {
    const [nombreUsuario, dominio] = email.split("@");
    const nombreOculto = nombreUsuario.charAt(0) + "*".repeat(nombreUsuario.length - 2) + nombreUsuario.charAt(nombreUsuario.length - 1);
    return `${nombreOculto}@${dominio}`;
  };
  
  const handleTextChange = (text, index) => {
    // Si el texto tiene más de 1 carácter, probablemente es un paste de código completo
    if (text.length > 1) {
      const digits = text.replace(/\D/g, '').substring(0, 5); // Solo números, máximo 5
      const numbers = digits.split('');
      
      // Llenar todos los campos disponibles
      if (numbers.length >= 1) setNumero1(numbers[0] || '');
      if (numbers.length >= 2) setNumero2(numbers[1] || '');
      if (numbers.length >= 3) setNumero3(numbers[2] || '');
      if (numbers.length >= 4) setNumero4(numbers[3] || '');
      if (numbers.length >= 5) setNumero5(numbers[4] || '');
      
      // Enfocar el último campo llenado o el primero vacío con transición rápida
      const lastFilledIndex = Math.min(numbers.length - 1, 4);
      setTimeout(() => {
        if (lastFilledIndex < 4) {
          inputRefs[lastFilledIndex + 1].current.focus();
          setFocusedIndex(lastFilledIndex + 1);
        } else {
          inputRefs[4].current.focus();
          setFocusedIndex(4);
        }
      }, 10);
      return;
    }

    // Comportamiento normal para un solo carácter con transición rápida
    if (text.length > 0 && index < inputRefs.length - 1) {
      setTimeout(() => {
        inputRefs[index + 1].current.focus();
        setFocusedIndex(index + 1);
      }, 20);
    }
    
    switch (index) {
      case 0:
        setNumero1(text.substring(0, 1));
        break;
      case 1:
        setNumero2(text.substring(0, 1));
        break;
      case 2:
        setNumero3(text.substring(0, 1));
        break;
      case 3:
        setNumero4(text.substring(0, 1));
        break;
      case 4:
        setNumero5(text.substring(0, 1));
        break;
      default:
        break;
    }
  };

  const handleKeyPress = (event, index) => {
    if (event.nativeEvent.key === 'Backspace') {
      // Si el campo actual está vacío, ir al anterior y borrarlo con transición suave
      const currentValue = [numero1, numero2, numero3, numero4, numero5][index];
      if (currentValue === '' && index > 0) {
        setTimeout(() => {
          inputRefs[index - 1].current.focus();
          setFocusedIndex(index - 1);
        }, 10);
        
        // Borrar el campo anterior
        switch (index - 1) {
          case 0:
            setNumero1('');
            break;
          case 1:
            setNumero2('');
            break;
          case 2:
            setNumero3('');
            break;
          case 3:
            setNumero4('');
            break;
          case 4:
            setNumero5('');
            break;
        }
      }
    }
  };

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };

  const handleBlur = (index) => {
    // Mantener el índice enfocado para transiciones suaves
  };

  
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Top left={true} leftType={'Back'} typeCenter={'Photo'} />

        <ScrollView 
          contentContainerStyle={styles.content}
        >
          <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
          <Text style={styles.textTelefono}>
            {formatString(screenTexts.Subtitle, { variable1: email })}
          </Text>

          <View style={styles.inputs}>
            {inputRefs.map((ref, i) => {
              const isFocused = focusedIndex === i;
              const hasValue = [numero1, numero2, numero3, numero4, numero5][i] !== '';
              const inputStyle = [
                styles.input,
                isFocused && styles.inputFocused,
                hasValue && styles.inputFilled
              ];
              
              return (
                <TextInput
                  key={i}
                  ref={ref}
                  style={inputStyle}
                  value={[numero1, numero2, numero3, numero4, numero5][i]}
                  onChangeText={(text) => handleTextChange(text, i)}
                  onKeyPress={(event) => handleKeyPress(event, i)}
                  onFocus={() => handleFocus(i)}
                  onBlur={() => handleBlur(i)}
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus={true}
                />
              );
            })}
          </View>

          <View style={styles.Enviar}>
            <Text style={styles.TextoEnviar}>{screenTexts.NoCodeTitle}</Text>
            <TouchableOpacity onPress={volverEnviar}>
              <Text style={styles.botonTextoEnviar}>{screenTexts.NoCodeSubtitle}</Text>
            </TouchableOpacity>
          </View>

          

        </ScrollView>

        <View style={styles.buttonContainer}>
          <GradientButton
            text={screenTexts.GradientButton}
            color='Blue'
            onPress={handleSendCode}
          />
        </View>

        {error && 
        
          <Error message={errorMessage} func={setError} />
          
        }

        {loading && (
          <LoadingOverlay/>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor:'white',
  },
  content:{
    width:'100%',
    
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal:16,
  },
  textContrasenia: {
    fontSize: 35,

    fontWeight: 'bold',

    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginTop: 70,
  },
  textTelefono: {
    fontSize: 13,

    color: '#71717A',

    marginBottom: 20,
    marginTop: 20,
  },
  inputs: {
    flexDirection: 'row',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  input: {
    flex: 1,
    height: 65,
    fontSize: 33,
    borderColor: '#A7B0C0',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingLeft: 20,
    alignSelf: 'center',
    marginHorizontal: 6,
    textAlign: 'center',
    backgroundColor: '#FFFFFF',
    transition: 'all 0.2s ease-in-out',
  },
  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
    backgroundColor: '#F8F9FA',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  inputFilled: {
    borderColor: '#5AC8FA',
    backgroundColor: '#F0F8FF',
  },
  Enviar: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  TextoEnviar: {
    fontSize: 13,

    color: '#71717A',

    alignSelf: 'center',
  },
  botonTextoEnviar: {
    fontSize: 13,

    fontWeight: 'bold',
    color: '#71717A',
    textDecorationLine: 'underline',

    alignSelf: 'center',
  },
  buttonContainer: {
    width: '100%',
    
    justifyContent: 'flex-end',
    marginBottom: 20,
    paddingHorizontal: 16
  },
});

export default CodigoVerificacion;
