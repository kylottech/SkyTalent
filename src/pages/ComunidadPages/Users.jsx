import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import { formatString } from '../../utils/formatString'
import { searcherGroup } from '../../services/communityServices';
import { getMyGroups } from '../../services/groupsServices';
import User from '../../components/Blocks/Community/User';
import BuscadorComponente from '../../components/Utils/Buscador';
import Error from '../../components/Utils/Error';
import createButton from '../../../assets/createButton.png'
import AddGroup from '../../components/Blocks/Community/Groups/AddGroup';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import GroupCard from '../../components/Blocks/Community/Groups/GroupCard';
import InfoModal from '../../components/Utils/InfoModal';

const Users = (props) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.Users;

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [info, setInfo] = useState([])
  const [request, setRequest] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showKyletsConfirmation, setShowKyletsConfirmation] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');

  useEffect(() => {
          
    if(winKylets !== 0){
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
      setShowKyletsConfirmation(true)
    }
  },[winKylets])

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setSearch('')
    await Promise.all(
      handleGetMyGroups()
    )
    setRefreshing(false);
  }, []);

  const handleSearcher = async ({ search }) => {
    setLoading(true);
    setUsers([]);
    setGroups([]);
    try {
      searcherGroup({ search }, logout)
        .then((res) => {
          setUsers(res?.users || []);
          setGroups(res?.groups || []);
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

  const handleGetMyGroups = async () => {
    setLoading(true);
    setInfo([]);
    try {
      getMyGroups(logout)
        .then((res) => {
          setInfo(res?.info || []);
          setRequest(res?.requests)
          setLoading(false);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false);
        })
      
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
      setUsers([]);
      setGroups([]);
    }
  }, [search]);

  useEffect(() => {
    handleGetMyGroups()
  }, []);

  return (
    <View style={styles.mainContainer}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>{screenTexts.Title}</Text>
          <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
        </View>
      </View>

      {/* Main ScrollView */}
      <ScrollView 
        style={styles.mainScrollView}
        contentContainerStyle={styles.mainScrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end', paddingHorizontal: 0, marginTop: 8, paddingBottom: 15 }}>
            <View style={{ flex: 1, justifyContent: 'flex-end', paddingRight: 8 }}>
              <BuscadorComponente placeholder={screenTexts.SearcherPlaceHolder} search={search} func={setSearch} />
              <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }} onPress={() => navigate.navigate("Request", {type: 'Groups'})}>
                <Text style={{ fontSize: 16, color: request > 0 ? '#1D7CE4' : 'Black' }}>
                  {formatString(screenTexts.Request, { variable1: request })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Results */}
        {search.trim().length > 0 && (users.length > 0 || groups.length > 0 || loading) && (
          <View style={styles.searchContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#1D7CE4" />
            ) : (
              <>
                {users.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>{screenTexts.UsersSectionTitle}</Text>
                    {users.map((item, index) => (
                      <User
                        key={`user-${index}`}
                        profileImage={item.avatar?.url}
                        fullName={`${item.name} ${item.surname}`}
                        username={item.kylotId}
                        _id={item._id}
                      />
                    ))}
                  </>
                )}
                {groups.length > 0 && (
                  <>
                    <Text style={styles.sectionTitle}>{screenTexts.GroupsSectionTitle}</Text>
                    {groups.map((group, index) => (
                      <TouchableOpacity key={`group-${index}`} onPress={() => navigate.navigate("GroupDetail", {_id: group._id, name: group.name})}>
                        <Text style={styles.groupText}>
                          {group.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </>
                )}
                {users.length === 0 && groups.length === 0 && (
                  <Text style={styles.noResultsText}>{screenTexts.NoItemsTexts}</Text>
                )}
              </>
            )}
          </View>
        )}

        {/* Groups Grid */}
        <View style={styles.groupsContainer}>
          {info.length === 0 ? 
            (
              loading ? (
                <View style={styles.overlay}>
                  <ActivityIndicator size="large" color="#1D7CE4" />
                </View>
              ) : (
                <Text style={styles.noFriendsText}>{screenTexts.NoItemsTexts}</Text>
              )
            ) : (
              <View style={styles.gridContainer}>
                {info.map((item, index) => (
                  <View style={styles.gridItem} key={index}>
                    <GroupCard
                      _id={item._id}
                      name={item.name}
                      members={item.members.length}
                      memberAvatars={item.memberAvatars}
                    />
                  </View>
                ))}
              </View>
            )
          }
        </View>
      </ScrollView>

      <LinearGradient
        colors={[ '#1D7CE4', '#004999']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.button}
      >
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Image source={createButton} style={styles.imageCreate}/>
        </TouchableOpacity>
      </LinearGradient>

      <AddGroup visible={showModal} onClose={() => setShowModal(false)} avatar={props.avatar} loading={loading2} setLoading={setLoading2} setWinKylets={setWinKylets} />

      {loading2 && (
          <LoadingOverlay/>
        )}
      {error && <Error message={errorMessage} func={setError} />}

      <InfoModal 
        celebration={true}
        isOpen={showKyletsConfirmation} 
        onClose={() => {setShowKyletsConfirmation(false), setWinKylets(0)} } 
        Title={winKyletsText} 
        Subtitle={screenTexts.KyletsSubtitle} 
        Button={screenTexts.KyletsButton} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  mainScrollView: {
    flex: 1,
  },
  mainScrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Espacio para el botón flotante
  },
  searchSection: {
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 22,
    letterSpacing: -0.2,
  },
  groupsContainer: {
    paddingHorizontal: 18,
    paddingTop: 15,
    paddingBottom: 15,
  },
  scrollContainer: {},
  searchContainer: {
    position: 'absolute', 
    top: 200, 
    width: '95%', 
    alignSelf: 'center', 
    maxHeight: '60%', 
    zIndex:200,
    backgroundColor: '#f5f5f5',
    elevation: 3,
    borderRadius: 10,
    padding: 12,
  },
  modalContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
    color: '#1D7CE4',
  },
  groupText: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginVertical: 12,
  },
  noFriendsText:{
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 30,
    color: 'gray'
  },
  button:{
    backgroundColor: '#1D7CE4',
    width:50,
    height:50,
    borderRadius:25,
    position: 'absolute',
    bottom:80,
    right:20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  imageCreate:{
    width: 35,
    height: 35
  },
  gridContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 90,
  },
  gridItem: {
    width: '48%',
    marginBottom: 16,
  },
});

export default Users;
