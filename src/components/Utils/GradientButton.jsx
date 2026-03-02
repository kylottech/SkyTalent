import React, { useEffect,useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const GradientButton = (props) => {
    const [text, setText] = useState('');
    const [firstColor, setFirstColor] = useState('#004999');
    const [secondColor, setSecondColor] = useState('#1D7CE4');



  useEffect(() => {
    setText(props.text)
    if(props.color === 'Blue'){
        setFirstColor('#004999')
        setSecondColor('#1D7CE4')
    }
    else if(props.color === 'Gold'){
        setFirstColor('#977B3C')
        setSecondColor('#C8A65A')
    }
    
  },[props.text, props.color])
  

  return (
    <View style={styles.container}>

        <LinearGradient
          colors={[ firstColor, secondColor]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.gradient}
        >
          <TouchableOpacity style={styles.botonInicio} onPress={props.onPress} >
              <Text style={styles.botonTexto}>{text}</Text>
          </TouchableOpacity>

        </LinearGradient>

        
    </View>
    


  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 24,
  },
  gradient:{
    height: 56,
    borderRadius: 12,
    justifyContent:'center',
    alignItems:'center',
    alignSelf: 'center',
    width:'100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  botonInicio: {
    height: '100%',
    width: '100%',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 12,
  },
  botonTexto: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

});

export default GradientButton;