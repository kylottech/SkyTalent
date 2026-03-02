import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import decisionNegativa from '../../../assets/DecisionNegativa.png';
import Top from '../../components/Utils/Top';


const Denegacion = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, texts } = useUser();
  const screenTexts = texts.pages.BancoPages.Denegacion
  
  
  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);
  

  return (
    <View style={styles.container}>

      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter={screenTexts.Top}
      />

      <View style={styles.decision}>
        <Image source={decisionNegativa} style={styles.imagen}/>
        <Text style={styles.decisionTexto}>{screenTexts.Title}</Text>
        <Text style={styles.decisionSubtexto}>{screenTexts.SubTitle}</Text>
      </View>


        <LinearGradient
          colors={['#004999', '#1D7CE4']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        >
          <TouchableOpacity style={styles.botonInicio} onPress={()=> navigate.navigate('Home')} >
              <Text style={styles.botonTexto}>{screenTexts.Button}</Text>
          </TouchableOpacity>

        </LinearGradient>

        
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal:16,
    alignItems: 'center',
  },
  top:{
    flexDirection: 'row',
    marginTop: 35,
    height: 60,
    width: '100%',
    alignItems: 'center',
    justifyContent :  'center',

  },
  TextTop:{
    alignSelf: 'center',
    fontSize: 22,
    fontWeight: 'bold',
  },
  gradient:{
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
    fontWeight:'400',

  },
  decision:{
    height:'60%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  imagen:{
    height: 140,
    width: 140,
  },
  decisionTexto:{
    color: '#F80A0A',
    fontSize: 23,
    marginHorizontal: 15,
    textAlign:'center',
    marginVertical: 15,
    fontWeight: 'bold',
  },
  decisionSubtexto:{
    fontSize: 15,
    marginHorizontal: 15,
    textAlign:'center',
    marginHorizontal: 60
  }

});

export default Denegacion;