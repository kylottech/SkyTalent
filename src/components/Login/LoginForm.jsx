import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useUser } from "../../context/useUser";
import { useNavigation } from '@react-navigation/native';
import {login} from '../../services/logServices';
import GradientButton from '../Utils/GradientButton';
import LogInInputs from './LogInInputs';

const LoginForm = ({setError, setErrorMessage, loading, setLoading}) => {
    const { texts } = useUser();
    const screenTexts = texts.components.Login.LoginForm
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        if(!loading){
            if(username !== '' && password !== ''){
                setLoading(true)
                login({ username: username, password: password })
                .then((res) => {
                    setLoading(false)
                    navigation.navigate('CodigoVerificacion',{email: res});
                })
                .catch((error) => {
                    setLoading(false)
                    setError(true)
                    setErrorMessage(error.message)
                });
            }
            else{
                setError(true)
                setErrorMessage(screenTexts.FieldsErrorMessages)
                setLoading(false)
            }
        }
        
        
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputsContainer}>
                <LogInInputs 
                    type="Username" 
                    value={username}
                    onChangeText={setUsername}
                    maxLength={9}
                />
                
                <LogInInputs 
                    type="Password" 
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            
            <GradientButton text={screenTexts.SignInTouchable}  color={'Blue'} onPress={ handleLogin} />

            <TouchableOpacity style={styles.botonOlvidarContrasenia} onPress={() => navigation.navigate('RecuperarContrasenia1')}>
                <Text style={styles.olvidadoContrasenia}>
                {screenTexts.ForgottenPasswordTouchable}<Text style={styles.olvidadoContraseniaNegrita}>{screenTexts.ForgottenPasswordTouchable2}</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
    },
    inputsContainer: {
        width: '100%',
        marginBottom: 8,
    },
    botonOlvidarContrasenia: {
        alignItems: 'center',
        marginTop: 24,
        paddingVertical: 12,
    },
    olvidadoContrasenia: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
    },
    olvidadoContraseniaNegrita: {
        fontWeight: '600',
        color: '#004999',
    },
    error:{
        fontSize: 17,
        color: '#FF3B30',
        marginTop: 20,
        fontWeight: 'bold'
      }
});

export default LoginForm;
