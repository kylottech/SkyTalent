import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ImageBackground } from 'react-native';
import { useUser } from "../../context/useUser";
import candado from '../../../assets/candadoBloqueado.png';
import regalo from '../../../assets/RegaloAzul.png';
import HorizontalSlider from '../../components/Utils/HorizontalSlider';
import Top from '../Utils/Top';
import { formatString } from '../../utils/formatString';

const BenefitBlock = (props) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Maps.PlaceBlock; // Usando los mismos textos que PlaceBlock
  const [price, setPrice] = useState(0);
  const [usuario, setUsuario] = useState('');
  const [kylets, setKylets] = useState('');

  const handlePass = async () => {
    const result = await props.onPress();

    if (result === true) {
      setPrice(2);
    }
  };

  const handleKylets = async () => {
    try {
      // Aquí iría la llamada al servicio para obtener el precio de desbloqueo del beneficio
      // Por ahora usamos valores de ejemplo
      setUsuario('Sistema');
      setKylets(props.kyletsPrice || 100);
    } catch (error) {
      // Error handled silently
    }
  };

  useEffect(() => {
    handleKylets();
  }, []);

  return (
    <View style={styles.container}>
      {price === 0 && (
        <ImageBackground 
          source={{ uri: props.benefitPhoto }} 
          style={styles.benefitImage} 
          blurRadius={30}
        >
          <Image source={candado} style={styles.candado} />
          <View style={{ flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center' }}>
            <HorizontalSlider 
              color={'Gold'} 
              text={screenTexts.DiscoverVerticalSlider} 
              onPress={() => setPrice(1)} 
            />
          </View>
        </ImageBackground>
      )}

      {price === 1 && (
        <>
          <Top
            left={true}
            leftType={'Back'}
            typeCenter={'Text'}
            textCenter={screenTexts.Top}
          />
          <View style={styles.info}>
            <Image source={regalo} style={styles.pin} />
            <Text style={styles.title}>{screenTexts.Title}</Text>
            <Text style={styles.text}>
              {formatString(screenTexts.Subtitle, { 
                variable1: usuario, 
                variable2: kylets 
              })}
            </Text>
          </View>
          <View style={{ flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center' }}>
            <HorizontalSlider 
              color={'Gold'} 
              text={screenTexts.UnBlockVerticalSlider} 
              onPress={handlePass} 
            />
          </View>
        </>
      )}

      {price === 2 && (
        <>
          <Top typeCenter={'Text'} textCenter={screenTexts.Top} />
          <View style={styles.info}>
            <Image source={regalo} style={styles.pin} />
            <Text style={styles.title}>{screenTexts.Title2}</Text>
            <Text style={styles.text}>
              {formatString(screenTexts.Subtitle3, { 
                variable1: props.benefitName || 'beneficio' 
              })}
            </Text>
          </View>
          <View style={{ flex: 1, position: 'absolute', bottom: 20, alignSelf: 'center' }}>
            <HorizontalSlider 
              color={'Black'} 
              text={screenTexts.UnBlockVerticalSlider} 
              onPress={props.pass} 
            />
          </View>
        </>
      )}
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
  benefitImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  title: {
    marginTop: 115,
    marginBottom: 20,
    fontSize: 20,
    color: '#AE9358',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
    paddingHorizontal: 16,
  },
  candado: {
    alignSelf: 'center',
    width: 100,
    height: 100,
  },
  pin: {
    width: 80,
    height: 80,
  },
});

export default BenefitBlock;

