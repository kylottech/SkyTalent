import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../context/useUser";

import { friendList, searcherUser } from '../../services/bankServices';

import Top from '../../components/Utils/Top';
import UserCard from '../../components/user/UserCard';
import BuscadorComponente from '../../components/Utils/Buscador';
import Error from '../../components/Utils/Error';

const Buscador = () => {
  const navigate=useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.BancoPages.Buscador

  const [friends, setFriends] = useState([])
  const [list, setList] = useState([])
  const [search, setSearch] = useState('');

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    handleFriendList()
    
  },[])

  useEffect(() => {
    if(search === ''){
      setList(friends)
    }
    else{
      handleSearcher(search)
    }
    
  },[search])


  const handleFriendList = async () => {
    try {
      friendList(logout)
        .then((response) => {
          setFriends(response)
          setList(response)
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

  const handleSearcher = async (search) => {
    try {
      searcherUser(search, logout)
        .then((response) => {
          setList(response)
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
  

  return (
    <View style={styles.container}>

      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter="Kylot Bank"
      />
      
      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Text style={styles.title}>Enviar Kylets a Amigos</Text>
          <Text style={styles.subtitle}>Comparte la magia con tus amigos</Text>
        </View>

        <View style={styles.searchSection}>
          <BuscadorComponente placeholder={screenTexts.SearcherPlaceHolder} search={search} func={setSearch}/>
        </View>
        

        {list.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {screenTexts.EmptyList}
            </Text>
          </View>
        ) : (
          <View style={styles.friendsList}>
            {list.map(user => (
              <View key={user._id} style={styles.userCardContainer}>
                <UserCard
                  profileImage={user.avatar.url}
                  username={user.kylotId}
                  fullName={user.name + ' ' + user.surname}
                  action={() => navigate.navigate('Teclado', 
                    { profile: true, 
                      tlfBuscador:  user.telefono,
                      _idBuscador: user._id,
                      nameBuscador: user.name + ' ' + user.surname,
                      imageBuscador: user.avatar.url
                    })}
                />
              </View>
            ))}
          </View>
        )}

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
    backgroundColor: 'white',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  
  // Search Section
  searchSection: {
    marginBottom: 24,
  },
  
  // Header Section
  headerSection: {
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 8,
    textAlign: 'left',
  },
  
  // Empty State
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  
  // Friends List
  friendsList: {
    flex: 1,
  },
  userCardContainer: {
    marginBottom: 6,
    backgroundColor: 'transparent',
    borderRadius: 0,
    shadowColor: 'transparent',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    overflow: 'visible',
  },
});

export default Buscador;