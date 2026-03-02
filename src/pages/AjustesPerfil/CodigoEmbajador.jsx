import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Image, Share, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Clipboard from 'expo-clipboard';
import { Feather } from '@expo/vector-icons';

import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'

import { codigo } from '../../services/profileService';

import Top from '../../components/Utils/Top';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';

const CodigoEmbajador = () => {
  const navigation = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.AjustesPerfil.CodigoEmbajador;

  const [referralLink, setReferralLink] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [numInvitados, setNumInvitados] = useState(0);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');


  useEffect(() => { 
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading])

  useEffect(() => {
    getInfo();
  }, []);
  
  const getInfo = async () => {
    if(!loading){
      setLoading(true)
      try {
        codigo(logout)
          .then((res) => {
            setNumInvitados(res.numInvitados);
            setReferralLink(res.codigo);
            setUsers(res.invitados);
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

  const handleCopyLink = useCallback(async () => {
    try {
      await Clipboard.setStringAsync(referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 5000);
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  }, [referralLink]);

  const handleShare = useCallback(async () => {
    const text = formatString(screenTexts.shareText, { variable1: referralLink })
    try {
      await Share.share({
        message: text,
      });
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  }, [referralLink]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(
      getInfo()
    );
    setRefreshing(false);
  }, []);

  return (
    <View style={styles.container}>

      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter={screenTexts.Top} 
      />

      <ScrollView 
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        
        <View style={{ padding: 20 }}>
          {/* Sección de Invitación */}
          <LinearGradient colors={['#021b79', '#0575e6']} start={[0, 0]} end={[1, 1]} style={styles.card}>
            <Text style={styles.title}>{screenTexts.Title}</Text>
            <Text style={styles.text}>{screenTexts.Subtitle}</Text>
            <Text style={styles.inviteCount}>{numInvitados}</Text>
          </LinearGradient>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>{screenTexts.Link}</Text>
            <View style={styles.linkContainer}>
              <Text style={styles.linkText}>{referralLink}</Text>
              <TouchableOpacity onPress={handleCopyLink} style={{ marginLeft: 10 }}>
                <Feather name="copy" size={20} color="black" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleShare}>
              <LinearGradient colors={['#004999', '#1D7CE4']} start={[0, 0]} end={[1, 1]} style={styles.shareButton}>
                <Text style={styles.shareText}>{screenTexts.Share}</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.rewardContainer}>
              <Text style={styles.rewardText}>
                {screenTexts.Reward1}
                <Text style={styles.rewardHighlight}> 25 </Text>
                {screenTexts.Reward2}
              </Text>
            </View>
          </View>

          {/* Sección de Referidos */}
          <Text style={styles.referralTitle}>{screenTexts.References}</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={screenTexts.ReferencesPlaceHolder}
            placeholderTextColor="black"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={{ marginTop: 20 }}>
            {users
              .filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((item) => (
                <TouchableOpacity
                  key={item._id}
                  onPress={() => navigation.navigate('OtroPerfil', { userId: item._id })}
                  style={styles.userCard}
                >
                  <Image source={{ uri: item.avatar.url }} style={styles.image} />
                  <View style={styles.textContainer}>
                    <Text style={styles.nombre}>
                      {item.name} {item.surname}
                    </Text>
                    <Text style={styles.usuario}>@{item.kylotId}</Text>
                  </View>
                  <Text style={styles.rewardPoints}>25 kylets</Text>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      </ScrollView>

      {error && 
        <Error message={errorMessage} func={setError} />
      }

      {confirmacion &&
        <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />
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

    backgroundColor:'white',
  },
  content:{
    flex:1,
    width: '100%',
    
    alignSelf: 'center',
    paddingHorizontal:16,
  },
  card: {
    borderRadius: 10,

    padding: 20
  },
  title: {
    fontSize: 20,

    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    fontSize: 12,

    color: 'white',

    marginTop: 8,
  },
  label: {
    fontSize: 14,

    color: 'black',

    marginBottom: 10,
  },
  linkContainer: {
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,

    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  linkText: {
    flex: 1,
    fontSize: 16,

    color: 'black',
  },
  shareButton: {
    borderRadius: 10,

    padding: 10,
    marginTop: 10,
  },
  shareText: {
    color: 'white',

    textAlign: 'center',
  },
  rewardContainer: {
    borderRadius: 10,

    marginTop: 10,
  },
  rewardText: {
    fontSize: 13,

    color: 'black',
  },
  rewardHighlight: {
    color: '#0575e6',
    fontWeight: 'bold',
  },
  inviteCount: {
    fontSize: 40,

    color: 'white',
    fontWeight: 'bold',

    textAlign: 'center',
    marginTop: 10,
  },
  referralTitle: {
    fontSize: 20,

    color: 'black',
    fontWeight: 'bold',

    marginTop: 20,
  },
  searchInput: {
    color: 'black',
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,

    padding: 10,
    marginTop: 10,
  },
  userCard: {
    borderRadius: 10,

    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  image: {
    width: 40,
    height: 40,

    borderRadius: 30,
  },
  textContainer: {
    flex: 1,

    marginLeft: 10,
  },
  nombre: {
    fontSize: 14,

    color: 'black',
    fontWeight: 'bold',
  },
  usuario: {
    fontSize: 12,

    color: 'gray',
  },
  rewardPoints: {
    color: '#0575e6',
  },
});

export default CodigoEmbajador;
