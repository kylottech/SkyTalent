import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import { searcher, getMyActivities } from '../../services/activitiesServices';
import { formatString } from '../../utils/formatString'
import BuscadorComponente from '../../components/Utils/Buscador';
import Error from '../../components/Utils/Error';
import createButton from '../../../assets/createButton.png'
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import AddActivity from '../../components/Blocks/Community/Groups/AddActivity';
import ActivityCard from '../../components/Blocks/Community/Groups/ActivityCard';
import InfoModal from '../../components/Utils/InfoModal';

const Activities = (props) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.Activities;

  const [search, setSearch] = useState('');
  const [activities, setActivities] = useState([]);
  const [info, setInfo] = useState([])
  const [request, setRequest] = useState(0)
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showKyletsConfirmation, setShowKyletsConfirmation] = useState(false);

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
    setActivities([]);
    try {
      searcher({ search }, logout)
        .then((res) => {
          setActivities(res || []);
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
      getMyActivities(logout)
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
      setActivities([]);
    }
  }, [search]);

  useEffect(() => {
    handleGetMyGroups()
  }, []);

  return (
    <>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
      </View>

      <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-end', paddingHorizontal: 16, marginTop: 20, paddingBottom: 15 }}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <BuscadorComponente placeholder={screenTexts.SearcherPlaceHolder} search={search} func={setSearch} />
          <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 10 }} onPress={() => navigate.navigate("Request", {type: 'Activities'})}>
            <Text style={{ fontSize: 16, color: request > 0 ? '#1D7CE4' : 'Black' }}>
              {formatString(screenTexts.Request, { variable1: request })}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal debajo del buscador */}
      {search.trim().length > 0 && (activities.length > 0 || loading) && (
        <View style={styles.searchContainer}>
        <ScrollView 
          contentContainerStyle={styles.modalContainer}
          
        >
          {loading ? (
            <ActivityIndicator size="large" color="#1D7CE4" />
          ) : (
            <>
              {activities.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{screenTexts.GroupsSectionTitle}</Text>
                  {activities.map((activity, index) => (
                    <TouchableOpacity key={`activity-${index}`} onPress={() => navigate.navigate("ActivityDetail", {_id: activity._id, name: activity.name})}>
                      <Text style={styles.groupText}>
                        {activity.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {activities.length === 0 && (
                <View style={styles.emptySearchContainer}>
                  <Text style={styles.noResultsText}>{screenTexts.NoItemsTexts}</Text>
                  <TouchableOpacity 
                    style={styles.createExperienceButton} 
                    onPress={() => setShowModal(true)}
                  >
                    <LinearGradient
                      colors={['#1D7CE4', '#004999']}
                      start={[0, 0]}
                      end={[1, 1]}
                      style={styles.createButtonGradient}
                    >
                      <Text style={styles.createButtonText}>{screenTexts.CreateExperienceButton}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </ScrollView>
        </View>
      )}

      {/* Mantener scrollview para futuro uso */}
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ flex: 1, justifyContent: 'flex-end', marginBottom: 90, paddingHorizontal:16 }}>
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
              info.map((item, index) => (
              <ActivityCard key={index} info={item}/>
              ))
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

      <AddActivity 
        visible={showModal} 
        onClose={() => setShowModal(false)} 
        loading={loading2} 
        setLoading={setLoading2}
        setWinKylets={setWinKylets}
      />

      <InfoModal 
        celebration={true}
        isOpen={showKyletsConfirmation} 
        onClose={() => {setShowKyletsConfirmation(false), setWinKylets(0)} } 
        Title={winKyletsText} 
        Subtitle={screenTexts.KyletsSubtitle} 
        Button={screenTexts.KyletsButton} 
      />

      {loading2 && (
          <LoadingOverlay/>
        )}
      {error && <Error message={errorMessage} func={setError} />}
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 0,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
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
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  emptySearchContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
    marginBottom: 16,
  },
  createExperienceButton: {
    marginTop: 8,
  },
  createButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noFriendsText:{
    fontSize: 20,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 30,
    color: 'gray',
    marginTop: 100
  },
  button:{
    backgroundColor: '#1D7CE4',
    width:50,
    height:50,
    borderRadius:25,
    position: 'absolute',
    bottom:120,
    right:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCreate:{
    width: 35,
    height: 35
  },
});

export default Activities;
