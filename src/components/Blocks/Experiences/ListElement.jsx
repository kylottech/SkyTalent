import React, { useState } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { lessPlace } from '../../../services/walletServices';
import corona from '../../../../assets/CORONA_DORADA.png';


const ListElement = (props) => {
  const navigation=useNavigation()
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Blocks.Experiences.ListElement
  const [isMenuVisible, setIsMenuVisible] = useState(false);

    const handleDelete = async (item) => {
      try {
        lessPlace({_idList: item.idLista, _idPlace : item.info._id}, logout)
          .then((res) => {
            props.setConfirmacionMensaje(screenTexts.DeletePlaceConfirmation)
            props.setConfirmacion(true)
          })
          .catch((error) => {
            props.setError(true);
            props.setErrorMessage(error.message);
          });
      } catch (error) {
        props.setError(true);
        props.setErrorMessage(error.message);
      }
  
    }

    const handleclose = () => {
        setIsMenuVisible(!isMenuVisible)
        handleDelete(props)
    };

  

  return (
    
    <View style={styles.componenteLugar}>
        {props.info.blocked ? (
            <View style={styles.info}>
                <View style={styles.circulo}>
                    <Image source={corona} style={styles.image}/>
                </View>
                <Text style={styles.text} >{screenTexts.Blocked}</Text>

            </View>
        ) : (
            <TouchableOpacity style={styles.linea} onPress={() => props.onPress(props.info.location.latitude, props.info.location.longitude)}>
            <View style={styles.info} >
                <View style={styles.circulo}>
                    <Image source={corona} style={styles.image}/>
                </View>
                <Text style={styles.text} >{props.info.name}</Text>

            </View>
            {props.mine &&
                <TouchableOpacity style={styles.menu} onPress={() => setIsMenuVisible(!isMenuVisible)}>
                    <View style={styles.circulito}/>
                    <View style={styles.circulito}/>
                    <View style={styles.circulito}/>
                </TouchableOpacity>
            }
            </TouchableOpacity>
        )

        }

        {isMenuVisible && (
            <Modal
                transparent={true}
                visible={isMenuVisible}
                animationType="slide"
                onRequestClose={() => setIsMenuVisible(false)}
            >
                <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPressOut={() => setIsMenuVisible(false)}
                >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalContent}
                    onPress={() => {}}
                >
                    <TouchableOpacity onPress={handleclose}>
                    <Text>{screenTexts.Option}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        )}
        
    </View>


  );
};

const styles = StyleSheet.create({
  
    componenteLugar:{
        flexDirection: 'row',
        alignItems: 'center',
        width:'90%',
        height: 68,
        backgroundColor: 'white',
        marginBottom: 10,
        alignSelf: 'center',
        borderColor: '#f0f0f0',
        borderWidth: 1,
        borderRadius: 10,
        shadowColor: '#000', // Color de la sombra
        shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
        shadowOpacity: 0.2, // Opacidad de la sombra
        shadowRadius: 4, // Radio de la sombra
        elevation: 5, // Sombra en Android

    },
    info:{
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10
    },
    circulo:{
        backgroundColor: 'white',
        borderRadius: 50,
        borderColor: '#C8A65A',
        borderWidth: 1.5,
        width: 40,
        height:40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    image:{
        width: 30,
        height: 20,
    },
    text:{
        fontSize: 14,
        marginHorizontal: 10,
        fontWeight: 'bold'
    },
    linea:{
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    menu:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        width: 20
    },
    circulito:{
        backgroundColor: 'gray',
        width:3,
        height:3,
        borderRadius: 4,
        marginTop: 3,

    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: 20,
      marginHorizontal: 40,
      borderRadius: 10,
    },

});

export default ListElement;