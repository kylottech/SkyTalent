import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'
import adri from "../../../../assets/welcome1.jpg"

const AdviceBlock = ({ avatar, categoria, total, ciudadId, paisId }) => {
  const navigation = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Blocks.Community.AdviceBlock;

 return (
     <TouchableOpacity 
       style={styles.container} 
       onPress={() => navigation.navigate('AdviceDetails', {paisId: paisId, ciudadId: ciudadId, categoriaId: categoria._id})}
     >
         <View style={styles.containerInfo}>
           <Image source={avatar ? { uri: avatar.url } : adri} style={styles.image}/>
           <Text style={styles.nombre}>{categoria.category}</Text>
           <Text style={styles.nombre2}>{formatString(screenTexts.Available, { variable1: total })}</Text> 
         </View>
 
       
 
     </TouchableOpacity>
   );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingVertical: 8,
    width: '100%',
    borderColor: '#e7e7e7',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 15,
    backgroundColor: 'white'
  },
  containerInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    //alignItems: 'center',
  },
  image: {
    width: '90%',
    height: 140,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 10
  },
  textContainer: {
    flex: 1,
  },
  tagContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginLeft: 10
  },
  nombre2: {
    fontSize: 10,
    color: '#9d9d9d',
    marginLeft: 10,
    paddingBottom: 10
  },
  usuario: {
    fontSize: 12,
  },
  tag:{
    backgroundColor: '#004999',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  tagText:{
    color: 'white',
    fontSize: 12,
  },
});

export default AdviceBlock;
