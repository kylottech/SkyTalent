import React, { useEffect, useState, memo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import CountdownToMidnight from '../TextLine/CountdownToMidnight';
import Sentence from '../TextLine/Sentence';
import Name from '../TextLine/Name';



const TextLine = (props) => {
    const [type, setType] = useState(props.type || '');
    const [firstColor, setFirstColor] = useState('#004999');
    const [secondColor, setSecondColor] = useState('#1D7CE4');

  useEffect(() => {
    setType(props.type);
    
    if(props.color === 'Blue'){
        setFirstColor('#004999');
        setSecondColor('#1D7CE4');
    }
    else if(props.color === 'Gold'){
        setFirstColor('#977B3C');
        setSecondColor('#C8A65A');
    }
    else if(props.color === 'Black'){
        setFirstColor('black');
        setSecondColor('black');
    }
  }, [props.color, props.type]);
  

  if (!type) return null;

  return (
    <View style={styles.container}>
      {type === 'Countdown' ? (
        <LinearGradient
          colors={[firstColor, secondColor]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.countdownContainer}
        >
          <CountdownToMidnight/>
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={[firstColor, secondColor]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.linea}
        >
          {type === 'Name' && <Name text={props.text} />}
          {type === 'Sentence' && <Sentence text={props.text} />}
        </LinearGradient>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        paddingVertical: -2,
    },
    countdownContainer: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    linea:{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        height: 28,
        width: '100%',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    frase:{
        color: '#2A2A2A',
        fontSize: 13,
        fontWeight: '500',
        letterSpacing: 0.3,
    },

});

export default memo(TextLine);