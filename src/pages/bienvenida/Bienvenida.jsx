import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Animated, PanResponder } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import Top from '../../components/Utils/Top';
import VerticalSlider from '../../components/Utils/VerticalSlider';
import RegaloAzul from '../../../assets/RegaloAzul.png';
import corona from '../../../assets/CORONA_DORADA.png';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';

const Recomendacion = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.bienvenida.Bienvenida
  const [change, setChange] = useState(false);
  const [numero, setNumero] = useState(50);
  

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  handleChange = () => {
    if(!change){
        setChange(true)
    }
  };

  return (
    <View style={styles.container}>

      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top}/>

      <View style={{paddingHorizontal: 16, flex: 1, width: '92%'}}>
      <Text style={styles.textContrasenia}>{screenTexts.Title}</Text>
      <Text style={styles.textTelefono}>
      {screenTexts.Subtitle}
      </Text>

      {!change && 
        <>
          <Image source={RegaloAzul} style={styles.imagen}/>

          <VerticalSlider text={screenTexts.VerticalSlider} color={'Gold'} onPress={handleChange}/>
          
        </>
      }

      {change &&
        <>
        
        <View style={{alignSelf: 'center', marginTop: 30}}>
          <Image source={RegaloAzul} style={styles.cerdo} />
        </View>
        <View style={styles.numeroContainer}>
            <Image source={corona} style={styles.corona2} />
            <Text style={styles.numero}>{numero}</Text>
        </View>
        <Text style={styles.titulo}>{screenTexts.CongratulationsTitle}</Text>
        <Text style={styles.textTelefono2}>{screenTexts.CongratulationsSubtitle}</Text>

        <View style={styles.buttonContainer}>
          < HorizontalSlider
            text={screenTexts.HorizontalSlider}
            color='Blue' 
            onPress={()=> navigate.navigate('GlobeScreen')} 
          />
        </View>

        </>
      }
      </View>

      

      
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 16,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  top: {
    flexDirection: 'row',
    marginTop: 35,
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 40,
    height: 30,
    position: 'absolute',
    left: 0,
    paddingTop: 10,
    marginLeft: 10,
  },
  volver: {
    width: 30,
    height: 20,
  },
  TextTop: {
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  textContrasenia:{
    fontSize: 27,
    alignSelf: 'flex-start',
    marginTop:40,
    fontWeight: 'bold',

  },
  textTelefono:{
    fontSize: 13,
    alignSelf: 'flex-start',
    marginBottom:30,
    marginTop: 10,
    color: '#71717A',
  },
  textTelefono2:{
    fontSize: 14,
    textAlign: 'center',
    marginBottom:30,
    marginTop: 20,
    color: '#71717A',
    marginLeft: 8,
  },
  imagen: {
    height: 150,
    width: 150,
    justifyContent:'center',
    alignSelf: 'center',
    marginTop: 80
  },
  gradient: {
    width: 60, 
    height: 150,
    borderRadius: 30,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    marginBottom: 35,
  },
  track: { 
    width: 60, 
    height: 150,
    borderRadius: 30,
    alignItems: 'center',
  },
  flecha1: {
    position: 'absolute',
    top: '36%',
    left: '40%', 
  },
  flecha2: {
    position: 'absolute',
    top: '43%',
    left: '40%',
  },
  flecha3: {
    position: 'absolute',
    top: '50%',
    left: '40%',
  },
  textoSlide: {
    position: 'absolute',
    top: '11%',
    left: '8%', 
    fontSize: 12,
    color: 'white',
  },
  sliderContent: {
    width: 40,
    height: 40,
    backgroundColor: '#E3D9C4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  corona: {
    width: 30,
    height: 20,
  },
  cerdo: {
    width: 170, // Ajusta el tamaño según lo que necesites
    height: 170,
    resizeMode: 'contain', // Para que mantenga su relación de aspecto
  },
  numeroContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: -80
  },
  corona2: {
    width: 40,
    height: 40,
    marginRight: 5,
  },
  numero: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  titulo:{
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 55,
    color: '#A88B49',
    textAlign: 'center'
  },
  gradient2:{
    height: 47,
    borderRadius: 10,
    justifyContent:'center',
    alignItems:'center',
    marginTop:12,
    alignSelf: 'center',
    width:'75%',
    position: 'absolute', 
    bottom: 0, 
    marginBottom: 20,
  },
  botonInicio: {
    height: '100%',
    width: '100%',
    justifyContent:'center',
    alignItems:'center',
  },
  botonTexto: {
    color: 'white',
    fontSize:18,
    fontWeight:'700',
  },
  buttonContainer:{
    width:'100%',
    position: 'absolute', 
    bottom: 0, 
    alignSelf: 'center',
    marginBottom: 20
  },
});

export default Recomendacion;
