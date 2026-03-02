import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";

import { getNotification, postNotification } from '../../services/profileService';

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

// Custom Notification Toggle Component
const NotificationToggle = ({ title, subtitle, isEnabled, onToggle }) => {
  return (
    <TouchableOpacity 
      style={styles.notificationCard}
      onPress={() => onToggle(!isEnabled)}
      activeOpacity={0.7}
    >
      <View style={styles.notificationContent}>
        <View style={styles.textContainer}>
          <Text style={styles.notificationTitle}>{title}</Text>
          <Text style={styles.notificationSubtitle}>{subtitle}</Text>
        </View>
        
        <View style={styles.toggleContainer}>
          <View style={[styles.toggleTrack, isEnabled && styles.toggleTrackActive]}>
            <View style={[styles.toggleThumb, isEnabled && styles.toggleThumbActive]} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};



const NotificacionesPerfil = () => {
  const navigate= useNavigation()
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.notificacionesPerfil

  const [nuevosSeguidores, setNuevosSeguidores] = useState(false);
  const [recordatorioRuleta, setRecordatorioRuleta] = useState(false);
  const [reciboKylets, setReciboKylets] = useState(false);
  const [publicacionesAmigos, setPublicacionesAmigos] = useState(false);
  const [visualizacionesPerfil, setVisualizacionesPerfil] = useState(false);
  const [nuevaListaSeguido, setNuevaListaSeguido] = useState(false);
  const [nuevaExpeSeguido, setNuevaExpeSeguido] = useState(false);
  const [novedadesKylot, setNovedadesKylot] = useState(false);
  const [microfuncionalidades, setMicrofuncionalidades] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  
  
  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    
    handleGetNotification()
    
  },[])


  const handleGetNotification = async () => {
    if(!loading){
      setLoading(true)
      try {
        getNotification(logout)
          .then((response) => {
            if (response) {
              setNuevosSeguidores(response.notificacionesPush.nuevosSeguidores)
              setRecordatorioRuleta(response.notificacionesPush.recordatorioRuleta)
              setReciboKylets(response.notificacionesPush.reciboKylets)
              setPublicacionesAmigos(response.notificacionesPush.publicacionesAmigos)
              setVisualizacionesPerfil(response.notificacionesPush.visualizacionesPerfil)
              setNuevaListaSeguido(response.notificacionesPush.nuevaListaSeguido)
              setNovedadesKylot(response.notificacionesEmail.novedadesKylot)
              setMicrofuncionalidades(response.notificacionesEmail.microfuncionalidades)
              setLoading(false)
            }
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

  const handlePostNotification = async (updatedValues) => {
    if(!loading){
      setLoading(true)
      try {
        postNotification({
          notificacionesPush: {
            nuevosSeguidores: updatedValues.nuevosSeguidores,
            recordatorioRuleta: updatedValues.recordatorioRuleta,
            reciboKylets: updatedValues.reciboKylets,
            publicacionesAmigos: updatedValues.publicacionesAmigos,
            visualizacionesPerfil: updatedValues.visualizacionesPerfil,
            nuevaListaSeguido: updatedValues.nuevaListaSeguido
          },
          notificacionesEmail: {
            novedadesKylot: updatedValues.novedadesKylot,
            microfuncionalidades: updatedValues.microfuncionalidades
          }
        }, logout)
          .then(() => {
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


  return (

    <View style={styles.container}>

        <Top 
          left={true} leftType={'Back'} 
          typeCenter={'Text'} textCenter={screenTexts.Top}
        />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Push Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{screenTexts.Title1}</Text>
          
          <NotificationToggle
            title={screenTexts.NewFollowers}
            subtitle={screenTexts.SubNewFollowers}
            isEnabled={nuevosSeguidores}
            onToggle={(value) => {
              setNuevosSeguidores(value);
              handlePostNotification({
                nuevosSeguidores: value,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.Roullete}
            subtitle={screenTexts.SubRoullete}
            isEnabled={recordatorioRuleta}
            onToggle={(value) => {
              setRecordatorioRuleta(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta: value,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.Kylets}
            subtitle={screenTexts.SubKylets}
            isEnabled={reciboKylets}
            onToggle={(value) => {
              setReciboKylets(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets: value,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.FriendsPosts}
            subtitle={screenTexts.SubFriendsPosts}
            isEnabled={publicacionesAmigos}
            onToggle={(value) => {
              setPublicacionesAmigos(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos: value,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.Visualizations}
            subtitle={screenTexts.SubVisualizations}
            isEnabled={visualizacionesPerfil}
            onToggle={(value) => {
              setVisualizacionesPerfil(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil: value,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.NewList}
            subtitle={screenTexts.SubNewList}
            isEnabled={nuevaListaSeguido}
            onToggle={(value) => {
              setNuevaListaSeguido(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido: value,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.NewExperience}
            subtitle={screenTexts.SubNewExperience}
            isEnabled={nuevaExpeSeguido}
            onToggle={(value) => {
              setNuevaExpeSeguido(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades
              });
            }}
          />
        </View>

        {/* Email Notifications Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{screenTexts.Title2}</Text>

          <NotificationToggle
            title={screenTexts.News}
            subtitle={screenTexts.SubNews}
            isEnabled={novedadesKylot}
            onToggle={(value) => {
              setNovedadesKylot(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot: value,
                microfuncionalidades
              });
            }}
          />

          <NotificationToggle
            title={screenTexts.Microfunctionalities}
            subtitle={screenTexts.SubMicrofunctionalities}
            isEnabled={microfuncionalidades}
            onToggle={(value) => {
              setMicrofuncionalidades(value);
              handlePostNotification({
                nuevosSeguidores,
                recordatorioRuleta,
                reciboKylets,
                publicacionesAmigos,
                visualizacionesPerfil,
                nuevaListaSeguido,
                novedadesKylot,
                microfuncionalidades: value
              });
            }}
          />
        </View>
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
    backgroundColor: 'white',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    marginTop: 20,
  },
  notificationCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  notificationSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '400',
  },
  toggleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    padding: 2,
  },
  toggleTrackActive: {
    backgroundColor: '#1D7CE4',
  },
  toggleThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});

export default NotificacionesPerfil;
