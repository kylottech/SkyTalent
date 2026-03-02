import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { useUser } from "../../context/useUser";
import { unBlockPlace } from '../../services/kyletsServices'
import candado from '../../../assets/candadoSitio.png';
import pin from '../../../assets/pinMapa.png';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import Top from '../Utils/Top';
import { formatString } from '../../utils/formatString'


const PlaceBlock = (props) => {
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Maps.PlaceBlock
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
      unBlockPlace(logout)
      .then((res) => {
        setUsuario(res.name)
        setKylets(res.unblockPlace)
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
        <ImageBackground source={{ uri: props.placePhoto }} style={styles.dubai} blurRadius={30}>
        <Image source={candado} style={styles.candado}/>
        <View style={{flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center'}}>
          <HorizontalSlider color={'Gold'} text={screenTexts.DiscoverVerticalSlider} onPress={() => setPrice(1)} />
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
                <Text style={styles.text}>{formatString(screenTexts.Subtitle, { variable1: usuario, variable2: kylets })}</Text>
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
                <Text style={styles.text}>{formatString(screenTexts.Subtitle3, { variable1: props.name })}</Text>
            </View>
            <View style={{flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center'}}>
              <HorizontalSlider color={'Black'} text={screenTexts.UnBlockVerticalSlider} onPress={props.pass}/>
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
    alignItems: 'center',
    justifyContent: 'center'
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
    width: 60,
    height: 30,
    borderRadius: 30,
    alignItems: 'center',
    //justifyContent: 'space-evenly',
    flexDirection: 'row',
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
    paddingHorizontal:16
  },
  numero:{
    marginLeft: -10
  },
  candado:{
    alignSelf: 'center'
  }
});

export default PlaceBlock;
