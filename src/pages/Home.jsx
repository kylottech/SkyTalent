import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { myInfo } from '../services/profileService';
import { useUser } from "../context/useUser";
import { StatusBar } from 'expo-status-bar';
import NavigationMenu from '../components/Blocks/Menu';
import Perfil from './Perfil';
import Mapa from './Mapa';
import Wallet from './Wallet';
import Comunidad from './Comunidad';
import Camara from './Camara';
import Error from '../components/Utils/Error';
import MarketPlace from './MarketPlace';




const HomeScreen = ({route}) => {
  const navigate= useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Home
  const [activeButton, setActiveButton] = useState(1);
  const [photo, setPhoto] = useState('');
  const [kylets, setKylets] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const handleInfo = async () => {
    try {
      myInfo(logout)
        .then((response) => {
          setPhoto(response.avatar.url);
          setKylets(response.kylets);
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
    
    if(route.params?.screen){
      setActiveButton(route.params.screen)
    }
    
  },[])

  useEffect(() => {
    
    handleInfo()
    
  },[])


  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>{screenTexts.Loader}</Text>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      {isLogged && (
        <>
          <View style={styles.contentContainer}>
            {activeButton === 1 && <View style={styles.componentContainer}><Mapa amount={kylets}/></View>}
            {activeButton === 2 && <View style={styles.componentContainer}><Wallet amount={kylets}/></View>}
            {activeButton === 3 && <View style={styles.componentContainer}><Comunidad avatar={photo}/></View>}
            {activeButton === 4 && <View style={styles.componentContainer}><MarketPlace amount={kylets}/></View>}
            {activeButton === 5 && <View style={styles.componentContainer}><Perfil/></View>}
          </View>

          <View style={styles.navigationMenuContainer}>
              <NavigationMenu 
              active={activeButton} 
              setActive={setActiveButton}
              avatar={photo}
            />
            </View>
          

          <StatusBar style="auto" />
        
        </>
      )}

      {error &&

      <Error message={errorMessage} func={setError} />

      }
        
    </View>


  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  componentContainer: {
    flex: 1,
    
  },
  navigationMenuContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  
  

});

export default HomeScreen;