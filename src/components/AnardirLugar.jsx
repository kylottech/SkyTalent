import React, { useState, useEffect} from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import pluma from '../../assets/pluma.png';
import x from '../../assets/x.png';


const AnadirLugar = (props) => {
  const navigation=useNavigation()
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');

  useEffect(() => {

    setName(props.lugar.name)
    
  },[props])

  useEffect(() => {

    setName2(props.lugar.name2)
    
  },[props])

  const handleCreate = async () => {
    navigation.navigate('AddMarket', {
      func: props.setLugar, 
      lugar: props.lugar, 
      pass: () =>navigation.navigate('AnadirRecomendacion') , 
      Onboarding: true,
      mode: false,
      setPhotos: props.setPhotos,
      setUrls: props.setUrls,
      photos: props.photos
    })
  }

  const handleDelete = async () => {
    setName(props.name2)
    props.setLugar({
      name: props.name2,
      categoria:'',
      experiencia: '',
      amigo: [],
      recomendacion: '',
      comentario: '',
      nota: 0,
      location: {
        latitude: 0,
        longitude: 0,
      }
    })
  }

  return (
     
    <View style={styles.componenteLugar}>
        <LinearGradient 
          colors={['#004999', '#1D7CE4']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.circuloNumero}
        >
          <Text style={styles.numero}>{props.numero}</Text>
        </LinearGradient>
        <Text style={styles.textoLugar} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
        <TouchableOpacity 
          style={styles.ciculoImagen}  
          onPress={handleCreate}>
            <Image source={pluma} style={styles.pluma}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonX} onPress={handleDelete}>
            <Image source={x} style={styles.x}/>
        </TouchableOpacity>

    </View>


  );
};

const styles = StyleSheet.create({
  
  componenteLugar:{
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  circuloNumero:{
    height:35,
    width: 35,
    borderRadius: 20,
    borderColor: '#000000',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  numero:{
    color: 'white'
  },
  textoLugar: {
    marginHorizontal: 15,
    maxWidth: '60%', 
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  ciculoImagen:{
    height:35,
    width: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  pluma:{
    width: 21, 
    height: 24,
  },
  botonX:{
    marginLeft:17
  },
  x: {
    width: 15,
    height: 15,
  },


});

export default AnadirLugar;