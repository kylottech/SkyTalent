import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'
import adri from "../../../../assets/welcome1.jpg"

const ContactsBlock = ({ avatar, categoria, total, ciudadId, paisId }) => {
  const navigation = useNavigation(); 
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Blocks.Community.ContactsBlock
  
  return (
    <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('ContactsDetails', {paisId: paisId, ciudadId: ciudadId, categoriaId: categoria._id})}>
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
    padding: 16,
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 12,
  },
  containerInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#F2F2F7',
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  tagContainer: {
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 20,
  },
  nombre2: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '400',
  },
  usuario: {
    fontSize: 12,
  },
  tag: {
    backgroundColor: '#004999',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
});

export default ContactsBlock;
