import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useUser } from "../../context/useUser";
import { getUsersInfo, addPerson, lessPerson } from '../../services/routeServices';
import { searcher } from '../../services/profileService';

import RouteUser from '../../components/Utils/RouteUser';
import Top from '../../components/Utils/Top';
import User from '../../components/Blocks/Community/User';
import BuscadorComponente from '../../components/Utils/Buscador';
import OptionsModal from '../../components/wallet/Experiences/Modals/OpcionsModal';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';

const ConfigRoute = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.usuarios.ConfigRoute;

  const [search, setSearch] = useState('');
  const [info, setInfo] = useState([]);
  const [myInfo, setMyInfo] = useState(false);
  const [myRoutes, setMyRoutes] = useState(false);
  const [routes, setRoutes] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showMyRoutes, setShowMyRoutes] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
    handleGetInfo();
  }, []);

  const handleAddRoute = (user) => {
    if (!myRoutes) return;
    const alreadyExists = myRoutes.some(route => route._id === user._id);
    if (alreadyExists) return;
    setSearch('');
    handleAddPerson(user);
  };

  const handleSearcher = async ({ search }) => {
    setLoading(true);
    try {
      setInfo([]);
      await searcher({ search }, logout)
        .then((res) => {
          setInfo(res);
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search.trim()) {
      handleSearcher({ search });
    } else {
      setInfo([]);
    }
  }, [search]);

  const handleGetInfo = async () => {
    try {
      setLoading(true);
      getUsersInfo(logout)
        .then((response) => {
          setMyInfo(response.myInfo);
          setMyRoutes(response.myRoutes);
          setRoutes(response.routes);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const handleAddPerson = (user) => {
    try {
        setLoading(true);
        addPerson({ _id: user._id }, logout)
        .then((response) => {
            setMyRoutes(prev => [user, ...prev]);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
            setError(true);
            setErrorMessage(error.message);
        });
    } catch (error) {
        setLoading(false);
        setError(true);
        setErrorMessage(error.message);
    }
    };


  const handleLessPerson = (_id) => {
    try {
        setLoading(true);
        lessPerson({ _id }, logout)
        .then((response) => {
            setMyRoutes(prev => prev.filter(user => user._id !== _id));
            setConfirmacion(true);
            setConfirmacionMensaje(screenTexts.EliminateConfirmation);
            setShowModal(false);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
            setError(true);
            setErrorMessage(error.message);
        });
    } catch (error) {
        setLoading(false);
        setError(true);
        setErrorMessage(error.message);
    }
    };


  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleGetInfo();
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
        <View style={[styles.TitleContent, {flexDirection: 'column'}]}>
          <Text style={styles.TitleText}>{screenTexts.Title1}</Text>
          <Text style={styles.SubtitleText}>{screenTexts.Subtitle1}</Text>
        </View>
        <View style={styles.space} />

        {myInfo &&
          <RouteUser
            _id={myInfo._id}
            profileImage={myInfo.avatar.url}
            username={myInfo.kylotId}
            fullName={`${myInfo.name} ${myInfo.surname}`}
            color={myInfo.color}
            discontinuous={myInfo.discontinuous}
            stroke={myInfo.stroke}
            editable={true}
            me={true}
            setLoading={setLoading}
            setError={setError}
            setErrorMessage={setErrorMessage}
            setConfirmacion={setConfirmacion}
            setConfirmacionMensaje={setConfirmacionMensaje}
          />
        }

        <View style={styles.space} />

        <TouchableOpacity
          style={styles.TitleContent}
          onPress={() => setShowRoutes(prev => !prev)}
        >
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.TitleText}>{screenTexts.Title2}</Text>
            <Text style={styles.TitleTextCount}>{routes?.length || 0}</Text>
          </View>
          <Text style={styles.SubtitleText}>{screenTexts.Subtitle2}</Text>
          
        </TouchableOpacity>

        {showRoutes && routes && routes.map((user, index) => (
          <RouteUser
            key={`route-${index}`}
            _id={user._id}
            profileImage={user.avatar.url}
            username={user.kylotId}
            fullName={`${user.name} ${user.surname}`}
            color={user.color}
            discontinuous={user.discontinuous}
            stroke={user.stroke}
            editable={true}
            me={false}
            setLoading={setLoading}
            setError={setError}
            setErrorMessage={setErrorMessage}
            setConfirmacion={setConfirmacion}
            setConfirmacionMensaje={setConfirmacionMensaje}
          />
        ))}

        <View style={styles.space} />

        <TouchableOpacity
          style={styles.TitleContent}
          onPress={() => setShowMyRoutes(prev => !prev)}
        >
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.TitleText}>{screenTexts.Title3}</Text>
            <Text style={styles.TitleTextCount}>{myRoutes?.length || 0}</Text>
          </View>
          <Text style={styles.SubtitleText}>{screenTexts.Subtitle3}</Text>
          
        </TouchableOpacity>

        <BuscadorComponente placeholder={screenTexts.SearcherPlaceHolder} search={search} func={setSearch} />

        <View style={{ flex: 1, justifyContent: 'flex-end', paddingHorizontal: 16, marginBottom: 10 }}>
          {info.length !== 0 &&
            info.map((item, index) => (
              <User
                key={index}
                profileImage={item.avatar.url}
                fullName={item.name + ' ' + item.surname}
                username={item.kylotId}
                _id={item._id}
                onPress={() => handleAddRoute(item)}
              />
            ))
          }
        </View>

        {showMyRoutes && myRoutes && myRoutes.map((user, index) => (
          <RouteUser
            key={`myroute-${index}`}
            _id={user._id}
            profileImage={user.avatar.url}
            username={user.kylotId}
            fullName={`${user.name} ${user.surname}`}
            color={user.color}
            discontinuous={user.discontinuous}
            stroke={user.stroke}
            editable={false}
            me={false}
            setLoading={setLoading}
            setError={setError}
            setErrorMessage={setErrorMessage}
            setConfirmacion={setConfirmacion}
            setConfirmacionMensaje={setConfirmacionMensaje}
            setShowModal={() => {
              setSelectedUserId(user._id);
              setShowModal(true);
            }}
          />
        ))}
      </ScrollView>

      <OptionsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        options={1}
        deleteFunc={() => handleLessPerson(selectedUserId)}
      />

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
      {loading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  // Updated styles with correct typography
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  TitleContent: {
    marginTop: 12,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingBottom: 5,
    flexDirection: 'column',
  },
  TitleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  TitleTextCount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D7CE4',
  },
  SubtitleText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: 'normal'
  },
  space: {
    height: 12
  }
});

export default ConfigRoute;
