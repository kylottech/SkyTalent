import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'
import adri from "../../../../assets/welcome1.jpg"

const UtilsCard = ({ type, ciudad, pais, ciudadId, paisId, total, avatar }) => {
  const navigate = useNavigation();
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Blocks.Community.UtilsCard

  const transformTextsTitle = () => {
    if(type === 'Tricks'){
        return screenTexts.TricksTitle
    }
    else if(type === 'Advice'){
        return screenTexts.AdviceTitle
    }
    else if(type === 'Contacts'){
        return screenTexts.ContactsTitle
    }
    else if(type === 'Post'){
        return screenTexts.PostsTitle
    }
  };

  const transformTextsAviable = () => {
    if(type === 'Tricks'){
        return screenTexts.TricksAviable
    }
    else if(type === 'Advice'){
        return screenTexts.AdviceAviable
    }
    else if(type === 'Contacts'){
        return screenTexts.ContactsAviable
    }
    else if(type === 'Post'){
        return screenTexts.PostsAviable
    }
  };

  const transformNavigate = () => {
    if(type === 'Tricks'){
        navigate.navigate('Tricks', { paisId: paisId, ciudadId: ciudadId })
    }
    else if(type === 'Advice'){
      navigate.navigate('Advice', { paisId: paisId, ciudadId: ciudadId })
    }
    else if(type === 'Contacts'){
      navigate.navigate('Contacts', { paisId: paisId, ciudadId: ciudadId })
    }
    else if(type === 'Post'){
      //navigate.navigate('Contacts', { paisId: paisId, ciudadId: ciudadId })
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => transformNavigate()}
    >
      <ImageBackground
        source={avatar ? { uri: avatar.url } : adri}
        style={styles.cardImage}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.8)', 'transparent']}
          style={styles.gradient}
        >
          <Text style={styles.date}>{transformTextsTitle()}</Text>
          
        </LinearGradient>

        <View style={styles.cardContent}>
          <View style={styles.cardText}>
            <Text style={styles.place}>
              {ciudad ? `${ciudad}, ${pais}` : pais}
            </Text>
            <Text style={styles.description}>{formatString(transformTextsAviable(), { variable1: total })}</Text>
          </View>

          
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 195
  },
  cardImage: {
    height: '100%',
    backgroundColor: '#eee'
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 85,
    paddingTop: 22,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'flex-start'
  },
  date: {
    color: '#fff',
    fontSize: 18,
    opacity: 0.9
  },
  opciones: {
    width: 20,
    height: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  punto: {
    backgroundColor: 'white',
    width: 5,
    height: 5,
    borderRadius: 5
  },
  cardContent: {
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  cardText: {
    //marginBottom: 10,
    borderRadius: 10
  },
  place: {
    fontSize: 30,
    fontWeight: '600',
    marginBottom: 2,
    color: 'white'
  },
  description: {
    fontSize: 13,
    marginBottom: 18,
    color: '#9d9d9d'
  },
  stats: {
    flexDirection: 'row',
    gap: 7,
    width: '100%',
    justifyContent: 'space-between'
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    backgroundColor: 'rgba(29, 32, 41, 0.8)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 0.5,
    marginRight: 15
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  guideButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  guideButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500'
  },
  icono:{
width:17,
height:15
  },
  icono2:{
width:17,
height:16
  },
  heart: {
    flex:1,
    alignItems: 'flex-end',
    alignContent: 'flex-end',
  },
});

export default UtilsCard;
