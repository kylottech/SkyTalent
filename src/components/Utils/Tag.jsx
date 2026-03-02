import React, { useEffect, useState  } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';


const Tag = ({ text, selected, color, onToggle }) => {
  const [backgroundColor, setBackgroundColor] = useState('');

  useEffect(() => {
    if (color === 'Gold') {
      setBackgroundColor('#B5A363');
    } else {
      setBackgroundColor('#1D7CE4');
    }
  }, [color]);
  
  return (
    <TouchableOpacity
      style={[
        styles.opcion,
        selected ? { backgroundColor: backgroundColor } : styles.opcionInactiva,
      ]}
      onPress={onToggle}
    >
      <Text style={[styles.setSelected, selected ? styles.textoActiva : styles.textoInactiva]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    opcion:{
        borderColor: '#71717A',
        borderWidth:1,
        borderRadius:20,
        paddingVertical: 8,
        paddingHorizontal: 8,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start',
        marginVertical: 10,
      },
      opcionInactiva:{
        backgroundColor: 'white'
      },
      opcionTexto:{
        fontSize: 15,
        marginHorizontal:20
      },
      textoActiva:{
        color: 'white'
      },
      textoInactiva:{
        color: 'black'
      },
});

export default Tag;
