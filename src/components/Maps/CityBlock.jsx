import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { useUser } from "../../context/useUser";
import { unBlockCity } from '../../services/kyletsServices'
import pin from '../../../assets/pinMapa.png';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import Top from '../Utils/Top';
import { formatString } from '../../utils/formatString'


const CityBlock = (props) => {
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Maps.CityBlock
  const [price, setPrice] = useState(0);
  const [usuario, setUsuario] = useState('');
  const [kylets, setKylets] = useState('');

  const handlePass = async () => {
    const result = await props.onPress()

    if(result === true) {
      
      setPrice(2)
    }
  };

  const handleKylets = async () => {
    try {
      unBlockCity(logout)
      .then((res) => {
        setUsuario(res.name)
        setKylets(res.unblockCity)
      })
      .catch((error) => {
        // Error handled silently
      });
  } catch (error) {
      // Error handled silently
  }
  };

  useEffect(() => {
    handleKylets()
  
  },[])

  
  return (
    <View style={styles.container}>
      {price === 0 &&
        <ImageBackground source={{ uri: props.cityPhoto }} style={styles.dubai}>
          <Text style={styles.city}>{props.city}</Text>
          <View style={{flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center'}}>
            <HorizontalSlider color={'Gold'} text={screenTexts.DiscoverLocationSlider} onPress={() => setPrice(1)} />
          </View>
        </ImageBackground>
      }

    {price === 1 &&
        <>
            <Top 
            left={true} leftType={'Back'}
            typeCenter={'Text'} textCenter={screenTexts.Top}
            />
            <View style={styles.info}>
                <Image source={pin} style={styles.pin}/>
                <Text style={styles.title}>{screenTexts.Title}</Text>
                <Text style={styles.text}>{formatString(screenTexts.Subtititle, { variable1: usuario, variable2: kylets })}</Text>
            </View>
            <View style={{flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center'}}>
              <HorizontalSlider color={'Gold'} text={screenTexts.UnBlockVerticalSlider} onPress={handlePass}/>
            </View>
            
            
        </>
        
    }

    {price === 2 &&
        <>
            <Top 
            typeCenter={'Text'} textCenter={screenTexts.Top} 
            />
            <View style={styles.info}>
                <Image source={pin} style={styles.pin}/>
                <Text style={styles.title}>{screenTexts.Title2}</Text>
                <Text style={styles.text}>{formatString(screenTexts.Subtitle2, { variable1: props.city })}</Text>
            </View>
            <View style={{flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center'}}>
              <HorizontalSlider color={'Black'} text={screenTexts.UnBlockVerticalSlider2} onPress={props.pass}/>
            </View>
        </>
        
    }

      
    </View>
      
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
  },
  dubai:{
    flex: 1,
    width: '100%',
    height: '100%', 
  },
  city:{
    fontSize: 35,
    color: 'white',
    alignSelf: 'center',
    marginTop: 55,
    fontWeight: 'bold'
  },
  kylets:{
    backgroundColor: 'white',
    position: 'absolute',
    top: 65,
    right: 20,
    width: 74,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
    //justifyContent: 'space-evenly',
    flexDirection: 'row',
    borderColor: '#9d9d9d',
    borderWidth:1,
    marginTop: -2,
    marginRight: 15,
    marginLeft: 15,
    backgroundColor: 'white',
    shadowColor: '#000', // Color de la sombra
    shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
    shadowOpacity: 0.2, // Opacidad de la sombra
    shadowRadius: 4, // Radio de la sombra
    elevation: 5, // Sombra en Android
  },
  corona:{
    width: 25,
    height: 25,
    marginHorizontal: 10
  },
  info:{
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50
  },
  title:{
    marginTop:115,
    marginBottom:20,
    fontSize: 20,
    color: '#AE9358',
    fontWeight: 'bold'
  },
  text:{
    textAlign: 'center',
    fontSize:16,
    paddingHorizontal:18
  },
  numero:{
    marginLeft: -10
  }
});

export default CityBlock;
