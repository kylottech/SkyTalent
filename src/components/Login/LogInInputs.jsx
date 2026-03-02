import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TextInput, Image } from 'react-native';
import { useUser } from "../../context/useUser";
import persona from '../../../assets/IconoPersona.png'; 
import candado from '../../../assets/candadoDorado.png';

const LogInInputs = (props) => {
    const { texts } = useUser();
    const screenTexts = texts.components.Login.LogInInputs
    const [placeholder, setPlaceholder] = useState('');
    const [photo, setPhoto] = useState();
    const [keyboard, setKeyboard] = useState('default'); // Definido por defecto a 'default'

    useEffect(() => {
        if (props.type === 'Username') {
            setPlaceholder(screenTexts.TlfInput);
            setPhoto(persona);
            setKeyboard('phone-pad');
        } else if (props.type === 'Password') {
            setPlaceholder(screenTexts.PasswordInput);
            setPhoto(candado);
            setKeyboard('default') // Puedes cambiar esto a 'default' si no es numérico
        }
    }, [props.type]); // Añadido 'props.type' como dependencia

    return (
        <View style={styles.rectangle}>
            <View style={styles.recuadroIcono}>
                <Image source={photo} style={styles.icono} />
            </View>
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                keyboardType={keyboard}
                secureTextEntry={props.secureTextEntry}
                maxLength={props.maxLength}
                autoCorrect={false}
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    rectangle: {
        flexDirection: 'row',
        width: '100%',
        height: 56,
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        alignItems: 'center',
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    recuadroIcono: {
        height: 32,
        width: 32,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    icono: {
        width: 18,
        height: 18,
        tintColor: '#6B7280',
    },
    linea: {
        display: 'none',
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#1F2937',
        fontWeight: '400',
    },
});

export default LogInInputs;
