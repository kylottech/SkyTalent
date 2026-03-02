import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { unblockAnswer } from '../../services/kyletsServices'
import { unblockQuestion } from '../../services/questionsServices'
import { formatString } from '../../utils/formatString'
import corona from '../../../assets/CORONA_DORADA.png';
import pin from '../../../assets/pinMapa.png';
import VerticalSlider from '../../components/Utils/VerticalSlider';
import Top from '../../components/Utils/Top';


const BlockQuestion = ({route}) => {
  const navigate=useNavigation()
  const {userInfo, _id, func} = route.params
  const { logout, texts }=useUser()
  const screenTexts = texts.pages.usuarios.BlockQuestion
  const [price, setPrice] = useState(0);
  const [usuario, setUsuario] = useState('');
  const [kylets, setKylets] = useState('');

  const handlePass = async () => {
    try {
      unblockQuestion({_id: _id}, logout)
        .then((response) => {
          setPrice(2)
          func()
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleKylets = async () => {
    try {
      unblockAnswer(logout)
      .then((res) => {
        setUsuario(res.name)
        setKylets(res.answerOther)
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error.message);
      });
  } catch (error) {
      setError(true);
      setErrorMessage(error.message);
  }
  };

  useEffect(() => {
    handleKylets()
  
  },[])

  
  return (
    <View style={styles.container}>
      {price === 0 &&
        <ImageBackground source={{ uri: userInfo.avatar }} style={styles.dubai}>
          <Text style={styles.city}>{userInfo.kylotId}</Text>
          <View style={styles.kylets}>
            <Image source={corona} style={styles.corona}/>
            <Text style={styles.numero}>{kylets}</Text>
          </View>
          <VerticalSlider color={'Gold'} text={screenTexts.VerticalSlider1} onPress={() => setPrice(1)} />
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
                <Text style={styles.title}>{screenTexts.Title1}</Text>
                <Text style={styles.text}>{formatString(screenTexts.Subtitle, { variable1: usuario, variable2: kylets })}</Text>
            </View>

            <VerticalSlider color={'Gold'} text={screenTexts.VerticalSlider2} onPress={handlePass}/>
            
        </>
        
    }

    {price === 2 &&
        <>
            <Top 
            typeCenter={'Text'} textCenter={'Kylot Map'} 
            />
            <View style={styles.info}>
                <Image source={pin} style={styles.pin}/>
                <Text style={styles.title}>{screenTexts.Title2}</Text>
                <Text style={styles.text}>{formatString(screenTexts.Subtitle3, { variable1: userInfo.name })}</Text>
            </View>

            <VerticalSlider color={'Black'} text={screenTexts.VerticalSlider3} onPress={() => navigate.navigate('Preguntas', {userInfo: userInfo})}/>
            
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

export default BlockQuestion;
