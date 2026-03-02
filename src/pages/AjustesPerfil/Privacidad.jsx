import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native';

import { useUser } from "../../context/useUser";

import { getContactPrivacity, postContactPrivacity } from '../../services/profileService'

import Top from '../../components/Utils/Top';
import InfoModal from '../../components/Utils/InfoModal';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

import info from '../../../assets/info.png';

const Privacidad = () => {
  const { isLoading, isLogged, texts, logout } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.Privacidad

  const [isContact, setIsContact] = useState(false);
  const [isPublicProfile, setIsPublicProfile] = useState(true);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  useEffect(() => { 
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading])
  
  useEffect(() => {
      handleContactPrivacity()
  }, []);

  const handleContactPrivacity = async () => {
    if(!loading){
      setLoading(true)
      try {
        await getContactPrivacity(logout)
        .then((res) => {
          setIsContact(res)
          setLoading(false)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false)
        });
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    }  
    
  };

  const handlePostContactPrivacity = async () => {
    if(!loading){
      setLoading(true)
      try {
        await postContactPrivacity(logout)
        .then((res) => {
          setIsContact(!isContact)
          setLoading(false)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false)
        });
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    }  
    
  };

  const handleToggleProfilePrivacy = async () => {
    if(!loading){
      setLoading(true)
      try {
        // Aquí iría la llamada al API para cambiar la privacidad del perfil
        // Por ahora solo actualizamos el estado local
        setIsPublicProfile(!isPublicProfile)
        setLoading(false)
        
        // TODO: Implementar API call para cambiar privacidad del perfil
        // await postProfilePrivacy(logout, !isPublicProfile)
        
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
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
        </View>

        {/* Profile Privacy Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Perfil</Text>
          </View>
          <View style={styles.notificationItem}>
            <View style={styles.toggleRow}>
              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>Perfil público</Text>
                <Text style={styles.subtitleText}>
                  {isPublicProfile 
                    ? 'Tu perfil es visible para todos los usuarios' 
                    : 'Tu perfil solo es visible para tus seguidores'
                  }
                </Text>
              </View>
              <ToggleSwitch
                isOn={isPublicProfile}
                onColor="#1D7CE4"
                offColor="#D9D9D9"
                size="medium"
                trackOnStyle={{ borderRadius: 10 }}
                trackOffStyle={{ borderRadius: 10 }}
                onToggle={handleToggleProfilePrivacy}
              />
            </View>
          </View>
        </View>

        {/* Contact Privacy Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Contacto</Text>
            <TouchableOpacity onPress={() => setShowPrivacyModal(true)}>
              <Image source={info} style={styles.icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.notificationItem}>
            <View style={styles.toggleRow}>
              <View style={styles.textContainer}>
                <Text style={styles.notificationText}>{screenTexts.Contact}</Text>
                <Text style={styles.subtitleText}>
                  Controla quién puede contactarte
                </Text>
              </View>
              <ToggleSwitch
                isOn={isContact}
                onColor="#1D7CE4"
                offColor="#D9D9D9"
                size="medium"
                trackOnStyle={{ borderRadius: 10 }}
                trackOffStyle={{ borderRadius: 10 }}
                onToggle={() => {setIsContact(!isContact); handlePostContactPrivacity()}}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <InfoModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        Title={screenTexts.TitleInfoModal}
        Subtitle={screenTexts.SubtitleInfoModal}
        Button={screenTexts.ButtonInfoModal}
      />
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
  header: {
    marginTop: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: '#8E8E93',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
  },
  notificationItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    padding: 16,
    marginTop: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  notificationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  subtitleText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 16,
  },
});

export default Privacidad;
