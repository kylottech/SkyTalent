//Importamos las librerias principales de react 
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';

//importamos el userUser para las principales funcionalidades
import { useUser } from "../../context/useUser";

//importamos Services para las llamadas al backend
import {  } from '../services/ExampleServices';

//importamos componentes propios
import Top from '../components/Utils/Top';
import Error from '../components/Utils/Error';
import Confirmacion from '../components/Utils/Confirmacion';

//archivos multimedia (assets)


const Template = ({route}) => {
    //Se crea la navegacion y se importan useUser y los textos
    const navigate= useNavigation()
    const {isLogged, isLoading, logout, texts}=useUser()
    const screenTexts = texts.pages.Example //se sigue la misma ruta que en el proyecto

    //Datos de route y constantes del codigo (por orden de aparicion en el codigo)
    const {  } = route.params || {};
    const example = 'Esto es un ejemplo'

    //Variables de estado (por orden de aparicion en el codigo)
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmacion, setConfirmacion] = useState(false);
    const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

    //Referencias
    const exampleRef = useRef(null)

    //UseEffects
    useEffect(() => { //Este useEffect debe estar en todas las pantallas (que haya que estar logueado)
        if (!isLoading && !isLogged) {
            navigate.navigate('Login');
        }
    }, [isLogged, isLoading])

    //Llamadas al Backend (Services)
    const handleExample = async () => {
        try {
            //Acciones necesarias antes de la llamada

            daily({ data }, logout) //({informacion necesaria}, funcion_de_logout)
            .then((response) => {
                //tratamiento del la respuesta (si la hay)

                setConfirmacion(true);
                setConfirmacionMensaje(screenTexts.confimationMessage); //mensaje si procede
            })
            .catch((error) => {
                setError(true); //error si falla el backend
                setErrorMessage(error.message);
            });
        } catch (error) {
          setError(true); //error si falla aqui
          setErrorMessage(error.message);
        }
    
    };

    //Funciones de javaScript propias
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        
        //acciones necesarias
        await Promise.all(
            handleExample()
        );
        setRefreshing(false);
    }, []);

    return (
        <View style={styles.container}> {/*contenedor general*/}

            <Top //Top (presente en casi todas las pantallas)
                left={true} leftType={'Back'} 
                typeCenter={'Text'} textCenter={screenTexts.Top}
            />

            <ScrollView 
                contentContainerStyle={styles.content}
                refreshControl={ //funcion para recargar
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            > 
                {/*Contenido de la pantalla*/}
            </ScrollView>

            {error && //Mensaje de error
                <Error message={errorMessage} func={setError} />
            }

            {confirmacion && //Mensaje de confirmacion
                <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />
            }
            
        </View>
        


    );
};

const styles = StyleSheet.create({
    //Por orden de aparicion
    /*
    example: { //junto con orden deseado de estilos
        Referentes a tamaño
        flex:
        width:
        fontSize:

        Referente a estilo visulal
        color:
        borderRadius:
        backgroundColor:

        Posicion:
        margin:
        padding:
        alignSelf:
        justifyContent:
        position:
        left:

        Otros:
    }
    */
    container: {
        flex: 1,

        backgroundColor:'white',
    },
    content:{
        width:'100%',
        
        alignSelf: 'center',
        paddingHorizontal:16,
    },
});

export default Template;