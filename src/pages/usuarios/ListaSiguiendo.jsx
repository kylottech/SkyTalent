import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import NotificacionUser from '../../components/Blocks/Community/NotificacionUser';
import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import { getFollowed } from '../../services/profileService';


const ListaSiguiendo = ({route}) => {
  const navigate= useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.usuarios.ListaSiguiendo
  const [lista, setLista]=useState([])
  const [cargando, setCargando]=useState(false)
  const [search, setSearch]=useState('')
  const [_id, set_id]=useState(route.params._id)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);


  const handleInfo = async (_id) => {
    if(!loading){
      setLoading(true)
      try {
      
        getFollowed(_id, logout)
          .then((res) => {
            setLista(res)
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
      

  }

  useEffect(() => {
    handleInfo(_id)
  
  },[_id]);

  return (
    <View style={styles.container}>
        <Top 
            left={true} leftType={'Back'}
            typeCenter={'Text'} textCenter={screenTexts.Top} 
            right={false}
        />
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1D7CE4" />
          </View>
        )}

        {!loading && lista.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>{screenTexts.NoFriendsSubtitle}</Text>
          </View>
        )}

        {!loading && lista.length > 0 && (
          <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.usersContainer}>
              {lista.map((item) => (
                <NotificacionUser
                  key={item._id}
                  imagen={item.avatar.url}
                  nombre={item.name + ' ' + item.surname}
                  usuario={item.kylotId}
                  userId={item._id}
                  comunidadId={item._id}
                  lista={true}
                  friend={item.friend}
                  me={item.me}
                  setError={setError}
                  setErrorMessage={setErrorMessage}
                />
              ))}
            </View>
          </ScrollView>
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
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  usersContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default ListaSiguiendo;