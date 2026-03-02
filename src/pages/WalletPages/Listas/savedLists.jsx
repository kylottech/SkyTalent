import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { favList } from '../../../services/walletServices';
import Top from '../../../components/Utils/Top';
import Experiences from '../../../components/Blocks/Experiences/Experiences';
import Error from '../../../components/Utils/Error';



const SavedLists = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Listas.savedList
  const [listas, setListas] = useState([])
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  
  const handleLists = async () => {
    if(!loading){
      setLoading(true)
      try {
        favList(logout)
          .then((response) => {
            if (response) {
              setListas(response)
            }
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  useEffect(() => {
  
    handleLists()
    
  },[])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setListas([])
    await Promise.all(
      handleLists()
    );
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
        <Top 
            left={true} leftType={'Back'}
            typeCenter={'Text'} textCenter={screenTexts.Top}
        />


        <View style={styles.headerContainer}>
            <Text style={styles.title}>{screenTexts.Title}</Text>
        </View>
        <ScrollView 
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
            <View>
                                
                {(listas && listas.length > 0) ? (
                    listas.map((item) => (
                    <Experiences
                      key={item._id}
                      name={item.name} 
                      view={item.visibility}
                      photo={item.avatar.url}
                      save={item.numFollowers}
                      onPress={() => navigate.navigate('OtherExperience', {_id: item._id})}
                    />
                    ))) :(

                      loading ? (
                        <View style={styles.overlay}>
                          <ActivityIndicator size="large" color="#1D7CE4" />
                        </View>
                      ) : (
                        <Text style={styles.textoPublicaciones}>{screenTexts.NoListsSavedSubtitle}</Text>
                      )
                        
                    )
                }
                
            </View>
        </ScrollView>

      {error &&
      
        <Error message={errorMessage} func={setError} />

      }
        
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentSlider: {
    marginVertical: 10
  },
  textoPublicaciones: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 30,
    marginTop: 40,
    marginBottom: 110,
    color: '#8E8E93',
    lineHeight: 22,
    fontWeight: '400',
  },
  error: {
    position: 'absolute',
    width: '98%',
    backgroundColor: 'red',
    marginTop: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  errorTexto: {
    color: 'white',
    alignSelf: 'center',
    fontWeight: '600',
  },
  overlay: {
    marginTop: 30
  }
});

export default SavedLists;
