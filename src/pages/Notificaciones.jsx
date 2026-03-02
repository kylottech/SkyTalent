import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { getNotifications } from '../services/notificationServices';
import Top from '../components/Utils/Top';
import NotificacionesPerfil from '../components/user/NotificacionesPerfil';
import LoadingOverlay from '../components/Utils/LoadingOverlay';
import Error from '../components/Utils/Error';

const Notificaciones = () => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Notificaciones
  const [notificaciones, setNotificaciones] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  
  const handleGetNotifications = async () => {
    if(!loading){
      setLoading(true)
      try { //modificar para añadir contador
        getNotifications({contador: 1}, logout)
          .then((response) => {
            setNotificaciones(response)
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
    handleGetNotifications()
  
  },[])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(
      handleGetNotifications()
    );
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>
      <Top 
            left={true} leftType={'Back'}
            typeCenter={'Text'} textCenter={screenTexts.Top} 
            right={false}  
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

      {notificaciones.map((notificacion) => (
          <NotificacionesPerfil
            key={notificacion._id}
            tipo={notificacion.type}
            kylotId = {notificacion.kylotId}
            avatar = {notificacion.avatar}
            _idUsuario = {notificacion._idUsuario }
            cantidad={notificacion.cantidad}
            comunidad = {notificacion.comunidad }
            _idInfo = {notificacion._idInfo }
            city = {notificacion.city}
            album = {notificacion.album}
            group = {notificacion.group}
            activity = {notificacion.activity}
            name = {notificacion.name}
            mine = {notificacion.mine}
            amount = {notificacion.amount}
            loading={loading}
            setLoading={setLoading}
            setError = {setError}
            setErrorMessage = {setErrorMessage}
          />
        ))}

          

       




        </ScrollView>
        
        {error &&

        <Error message={errorMessage} func={setError} />

        }
        {loading && (
          <LoadingOverlay/>
        )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },




});

export default Notificaciones;
