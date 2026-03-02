import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { enviarCodigoEmail, codVerificacionContrasenia } from '../../services/logServices';
import { formatString } from '../../utils/formatString'
import GradientButton from '../../components/Utils/GradientButton';
import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

const CodigoVerificacionContrasenia = ({ route }) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.contrasenia.CodigoVerificacionContrasenia;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  const [numero1, setNumero1] = useState('');
  const [numero2, setNumero2] = useState('');
  const [numero3, setNumero3] = useState('');
  const [numero4, setNumero4] = useState('');
  const [numero5, setNumero5] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(0);

  const navigation = useNavigation();

  const ocultarEmail = (email) => {
    const [nombreUsuario, dominio] = email.split("@");
    const nombreOculto = nombreUsuario.charAt(0) + "*".repeat(nombreUsuario.length - 2) + nombreUsuario.charAt(nombreUsuario.length - 1);
    return `${nombreOculto}@${dominio}`;
  };

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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

  useEffect(() => {
    setEmail(ocultarEmail(route.params.email));
  }, []);

  const handleSendCode = async () => {
    if(!loading){
      setLoading(true)
      if (numero1 && numero2 && numero3 && numero4 && numero5) {
        const codigoNumber = parseInt(numero1 + numero2 + numero3 + numero4 + numero5);
        setCodigo(codigoNumber);
        try {
          codVerificacionContrasenia({ email: route.params.email, codigo: codigoNumber }, logout)
            .then(() => {
              setLoading(false)
              navigation.navigate('RecuperarContrasenia2', { email: route.params.email });
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
    if(!loading){
      setLoading(true)
      enviarCodigoEmail({ username: route.params.email }, logout)
        .then(() => {
          setConfirmacion(true);
          setConfirmacionMensaje(screenTexts.SetConfirmationMensaje);
          setLoading(false)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false)
        });
    }
    
  };

  return (
    <TouchableWithoutFeedback onPress={() => {
      if (Platform.OS === 'ios') Keyboard.dismiss();
    }}>
      <View style={styles.container}>
        <Top left={true} leftType={'Back'} typeCenter={'Photo'} />
        <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
        <Text style={styles.textTelefono}>{formatString(screenTexts.Subtitle, { variable1: email })}</Text>

        <View style={styles.inputs}>
          {[numero1, numero2, numero3, numero4, numero5].map((num, index) => {
            const isFocused = focusedIndex === index;
            const hasValue = num !== '';
            const inputStyle = [
              styles.input,
              isFocused && styles.inputFocused,
              hasValue && styles.inputFilled
            ];
            
            return (
              <TextInput
                key={index}
                ref={inputRefs[index]}
                style={inputStyle}
                value={num}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={(event) => handleKeyPress(event, index)}
                onFocus={() => handleFocus(index)}
                onBlur={() => handleBlur(index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus={true}
              />
            );
          })}
        </View>

        <GradientButton text={screenTexts.GradientButton} color={'Blue'} onPress={handleSendCode} />

        <TouchableOpacity style={styles.botonOlvidarContrasenia} onPress={volverEnviar}>
          <Text style={styles.olvidadoContrasenia}>
            {screenTexts.ForgottenPasswordTouchable1}{' '}
            <Text style={styles.olvidadoContraseniaNegrita}>{screenTexts.ForgottenPasswordTouchable2}</Text>
          </Text>
        </TouchableOpacity>

        {error && <Error message={errorMessage} func={setError} />}
        {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
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
    width: '100%',
    paddingHorizontal: 16,
    alignSelf: 'center',
  },
  textContrasenia: {
    fontSize: 35,
    alignSelf: 'flex-start',
    marginHorizontal: 10,
    marginTop: 70,
    fontWeight: 'bold',
  },
  textTelefono: {
    fontSize: 13,
    marginBottom: 20,
    marginTop: 20,
    color: '#71717A',
    marginHorizontal: 10,
  },
  inputs: {
    flexDirection: 'row',
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  input: {
    height: 65,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    paddingLeft: 20,
    borderRadius: 10,
    borderColor: '#A7B0C0',
    fontSize: 33,
    alignSelf: 'center',
    flex: 1,
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
  botonOlvidarContrasenia: {
    alignItems: 'center',
    marginVertical: 10,
  },
  olvidadoContrasenia: {
    fontSize: 14,
  },
  olvidadoContraseniaNegrita: {
    fontWeight: '600',
  },
});

export default CodigoVerificacionContrasenia;
