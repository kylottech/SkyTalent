import React, { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { View, StyleSheet } from 'react-native';
import Loader from '../components/Utils/Loader';
import { useFocusEffect } from '@react-navigation/native';

const LoaderScreen = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, verificacion } = useUser();

  useFocusEffect(
    useCallback(() => {
      if (!isLoading && !isLogged) { 
        navigate.navigate("FirstScreen");
      }
      else if(!isLoading && isLogged && verificacion === 0 ){ 
        navigate.navigate("ThankYouScreen");
      }
      else if(!isLoading && isLogged && (verificacion === 1 || verificacion === 2)){
        navigate.navigate("Decision");
      }
      else if(!isLoading && isLogged && verificacion === 3){
        navigate.navigate("GlobeScreen");  
      }
    }, [isLogged, isLoading, verificacion])
  );

  return (
    <View style={styles.container}> 
      <Loader />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default LoaderScreen;
