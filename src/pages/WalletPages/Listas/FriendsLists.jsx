import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { friendList } from '../../../services/walletServices';
import Top from '../../../components/Utils/Top';
import Experiences from '../../../components/Blocks/Experiences/Experiences';
import corazon from '../../../../assets/corazonRelleno.png';
import Error from '../../../components/Utils/Error';



const FriendsLists = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Listas.FriendsLists
  const [friends, setFriends] = useState([]);
  const [visibleStates, setVisibleStates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  const toggleVisible = (id) => {
  setVisibleStates((prev) => ({
    ...prev,
    [id]: !prev[id]
  }));
}

  const handleGetFriends = async () => {
    if(!loading){
      setLoading(true)
      try {
        friendList(logout)
          .then((response) => {
            if (response) {
              setFriends(response)

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
  
    handleGetFriends()
    
  },[])

  const onRefresh = useCallback(async () => {
      setRefreshing(true);
      setFriends([])
      await Promise.all(
        handleGetFriends()
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

            {
            friends.length === 0 ? (
              loading ? (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color="#1D7CE4" />
                </View>
              ) : (
                <Text style={styles.noFriendsText}>{screenTexts.NoFriendsSubtitle}</Text>
              )
              
            ) : (
            friends.map((user) => {
              return (
                <View key={user._id}>
                  <TouchableOpacity style={styles.userCard} onPress={() => toggleVisible(user._id)} activeOpacity={0.7}>
                    <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
                    <View style={styles.userInfo}>
                      <Text style={styles.userName}>{user.name}</Text>
                      <Text style={styles.userSurname}>{user.surname}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Image source={corazon} style={styles.heartIcon} />
                      <Text style={styles.statsText}>{user.listas.reduce((acc, list) => acc + list.numFollowers, 0)}</Text>
                    </View>
                  </TouchableOpacity>

                  {visibleStates[user._id] &&
                    <View style={styles.listsContainer}>
                      {user.listas.map((list) => (
                        <Experiences 
                          key={list._id}
                          name={list.name} 
                          view={list.visibility}
                          photo={list.avatar.url}
                          save={list.numFollowers}
                          onPress={() => navigate.navigate('OtherExperience', {_id: list._id})} 
                        />
                      ))}
                    </View>
                  }
                </View>
              )
            }))
          }
            
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
    paddingBottom: 24,
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
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  userSurname: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  heartIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    tintColor: '#FF3B30',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  listsContainer: {
    marginTop: -4,
    marginBottom: 20,
  },
  noFriendsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8E8E93',
    marginHorizontal: 30,
    marginTop: 40,
    lineHeight: 22,
    fontWeight: '400',
  },
  overlay: {
    marginTop: 30,
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
});

export default FriendsLists;
