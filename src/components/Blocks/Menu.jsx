import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState  } from 'react';
import { View, StyleSheet, TouchableOpacity, Text , Image} from 'react-native';
import { useUser } from "../../context/useUser";
import mapa from '../../../assets/pinMenu.png';
import wallet from '../../../assets/walletMenu.png';
import comunidad from '../../../assets/comunidadMenu.png';
import MarketPlace from '../../../assets/MarketPlace.png';

const NavigationMenu = ({ active , setActive, avatar }) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Blocks.Menu
  const [photo, setPhoto] = useState('');

  useEffect(() => {
    
    setPhoto(avatar)
    
  },[avatar])

  return (
    <View style={styles.container}>

    
        <TouchableOpacity style={styles.button} onPress={() => {setActive(1)}}>

            <Image style={styles.mapa} source={mapa} />
            <Text 
                style={[styles.texto, active === 1 ? styles.textoActiva : styles.textoInactiva]}
            >
                {screenTexts.MenuTouchable1}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => {setActive(2)}}>

            <Image style={styles.wallet} source={wallet} />
            <Text 
                style={[styles.texto, active === 2 ? styles.textoActiva : styles.textoInactiva]}
            >
                {screenTexts.MenuTouchable2}
            </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCamara} onPress={() => {setActive(3)}}>

            <LinearGradient
            colors={['#004999', '#1D7CE4']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradient}
            >
            
                <Image style={styles.camara} source={comunidad} />

            </LinearGradient>

            
        </TouchableOpacity>

        <TouchableOpacity style={styles.button2} onPress={() => {setActive(4)}}>

            <Image style={styles.comunidad} source={MarketPlace} />
            <Text 
                style={[styles.texto, active === 4 ? styles.textoActiva : styles.textoInactiva]}
            >
                {screenTexts.MenuTouchable3}
            </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => {setActive(5)}}>

            <Image style={styles.perfil} source={{ uri: photo }} />
            <Text 
                style={[styles.texto, active === 5 ? styles.textoActiva : styles.textoInactiva]}
            >
                {screenTexts.MenuTouchable4}
            </Text>
        </TouchableOpacity>
        
    
      

      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row',
    width:'100%',
    height: 73,
    alignItems:'flex-end',
    justifyContent: 'space-between',
    paddingBottom:23,
    paddingHorizontal: 7,
    backgroundColor: 'white'
  },
  gradient: {
    width:70,
    height:70,
    borderRadius:35,
    justifyContent:'center',
    alignItems:'center',

  },
  button: {
    width:60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:2,
    marginTop: 15
  },
  button2: {
    width:60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex:2,
  },
  buttonCamara:{
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom:16,
  },
  logoCamara: {
    height: 30,
    width: 30,
  },
  texto:{
    fontSize:10,
  },
  textoActiva:{
    color:'#1D7CE4',
  },
  textoInactiva:{
    color:'#818181',
  },
  mapa:{
    width:20,
    height:30
  },
  perfil:{
    width:30,
    height:30,
    borderRadius: 15,
    borderColor: 'black',
    borderWidth:1
  },
  wallet:{
    width:25,
    height:30
  },
  comunidad:{
    width:25,
    height:32
  },
  camara:{
    width:45,
    height:46
  }
});

export default NavigationMenu;