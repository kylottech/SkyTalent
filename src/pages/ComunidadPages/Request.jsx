import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import { getRequests, getInvitations, acept, reject } from '../../services/groupsServices'
import { getMyRequests, getMyInvitations, aceptInvitation, rejectInvitation } from '../../services/activitiesServices'
import Top from '../../components/Utils/Top';
import GroupCard from '../../components/Blocks/Community/Groups/GroupCard';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import ActivityCard from '../../components/Blocks/Community/Groups/ActivityCard';
import AddGroup from '../../components/Blocks/Community/Groups/AddGroup';
import AddActivity from '../../components/Blocks/Community/Groups/AddActivity';
import InfoModal from '../../components/Utils/InfoModal';
import { formatString } from '../../utils/formatString';

const Request = ({route}) => {
    const navigate = useNavigation();
    const { isLogged, isLoading, texts, logout } = useUser();
    const screenTexts = texts.pages.ComunidadPages.Request
    const [selected, setSelected] = useState('Invitaciones');
    const [requests, setRequests] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(false); // NO SE TOCA
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [loadingInvitations, setLoadingInvitations] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmacion, setConfirmacion] = useState(false);
    const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
    const [showModal, setShowModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [winKylets, setWinKylets] = useState(0);
    const [winKyletsText, setWinKyletsText] = useState('');
    const [showKyletsConfirmation, setShowKyletsConfirmation] = useState(false);

    const { type } = route.params;

    useEffect(() => {
        if (!isLoading && !isLogged) {
            navigate.navigate("Login");
        }
    }, [isLogged, isLoading]);

    useEffect(() => {
        if(winKylets !== 0){
            setWinKyletsText(formatString("Has ganado {{variable1}} Kylets.", { variable1: winKylets }))
            setShowKyletsConfirmation(true)
        }
    }, [winKylets]);

    const handleGetRequestsGroup = async () => {
        setLoadingRequests(true);
        setRequests([]);
        try {
            getRequests(logout)
                .then((res) => {
                    setRequests(res || []);
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoadingRequests(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingRequests(false);
        }
    }

    const handleGetInvitationsGroup = async () => {
        setLoadingInvitations(true);
        setInvitations([]);
        try {
            getInvitations(logout)
                .then((res) => {
                    setInvitations(res || []);
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoadingInvitations(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingInvitations(false);
        }
    }

    const handleGetRequestsActivity = async () => {
        setLoadingRequests(true);
        setRequests([]);
        try {
            getMyRequests(logout)
                .then((res) => {
                    setRequests(res || []);
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoadingRequests(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingRequests(false);
        }
    }

    const handleGetInvitationsActivity = async () => {
        setLoadingInvitations(true);
        setInvitations([]);
        try {
            getMyInvitations(logout)
                .then((res) => {
                    setInvitations(res || []);
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoadingInvitations(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingInvitations(false);
        }
    }

    const handleAceptGroup = async (_id) => {
        setLoading(true);
        try {
            acept({ _id }, logout)
                .then((res) => {
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.ConfirmationMensajeAcept)
                    setInvitations(prev => prev.filter(inv => inv._id !== _id));
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoading(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingInvitations(false);
        }
    }

    const handleRejectGroup = async (_id) => {
        setLoading(true);
        try {
            reject({ _id }, logout)
                .then(() => {
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.ConfirmationMensajeReject)
                    setInvitations(prev => prev.filter(inv => inv._id !== _id));
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoading(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingInvitations(false);
        }
    }

    const handleAceptActivity = async (_id) => {
        setLoading(true);
        try {
            aceptInvitation({ _id }, logout)
                .then((res) => {
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.ConfirmationMensajeAcept)
                    setInvitations(prev => prev.filter(inv => inv._id !== _id));
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoading(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingInvitations(false);
        }
    }

    const handleRejectActivity = async (_id) => {
        setLoading(true);
        try {
            rejectInvitation({ _id }, logout)
                .then(() => {
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.ConfirmationMensajeReject)
                    setInvitations(prev => prev.filter(inv => inv._id !== _id));
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                })
                .finally(() => setLoading(false));
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoadingInvitations(false);
        }
    }

    const handleCalls = () => {
        if (type === 'Groups') {
            handleGetRequestsGroup();
            handleGetInvitationsGroup();
        }
        else {
            handleGetRequestsActivity();
            handleGetInvitationsActivity();
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if(type === 'Groups'){
            if (selected === 'Invitaciones') {
                handleGetInvitationsGroup().finally(() => setRefreshing(false));
            } else {
                handleGetRequestsGroup().finally(() => setRefreshing(false));
            }
        }
        else {
            if (selected === 'Invitaciones') {
                handleGetInvitationsActivity().finally(() => setRefreshing(false));
            } else {
                handleGetRequestsActivity().finally(() => setRefreshing(false));
            }
        }
        
    };

    useEffect(() => {
        handleCalls();
    }, [route]);

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
                <View style={styles.containerButtons}>
                    <TouchableOpacity
                        style={[styles.button, styles.leftButton, selected === 'Invitaciones' && styles.selectedButton]}
                        onPress={() => setSelected('Invitaciones')}
                    >
                        <Text style={[styles.buttonText, selected === 'Invitaciones' && styles.selectedButtonText]}>
                            {screenTexts.Menu1}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, selected === 'Solicitudes' && styles.selectedButton]}
                        onPress={() => setSelected('Solicitudes')}
                    >
                        <Text style={[styles.buttonText, selected === 'Solicitudes' && styles.selectedButtonText]}>
                            {screenTexts.Menu2}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginBottom: 90, marginTop: 20 }}>
                    {(selected === 'Invitaciones' && type === 'Groups') && (
                        loadingInvitations ? (
                            <ActivityIndicator size="large" color="#1D7CE4" />
                        ) : invitations.length > 0 ? (
                            invitations.map((item, index) => (
                                <React.Fragment key={index}>
                                    <GroupCard
                                        _id={item._id}
                                        name={item.name}
                                        members={item.members.length}
                                        memberAvatars={item.memberAvatars}
                                    />
                                    <View style={styles.buttonsContainer}>
                                        <LinearGradient 
                                            colors={['#004999', '#1D7CE4']}
                                            start={[0, 0]}
                                            end={[1, 1]}
                                            style={styles.aceptButton}
                                        >
                                            <TouchableOpacity onPress={() => handleAceptGroup(item._id)}>
                                                <Text style={styles.aceptText}>{screenTexts.aceptText}</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                        <TouchableOpacity style={styles.rejectButton} onPress={() => handleRejectGroup(item._id)}>
                                            <Text style={styles.rejectText}>{screenTexts.rejectText}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </React.Fragment>
                            ))
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyStateTitle}>{screenTexts.EmptyInvitationsTitle}</Text>
                                <Text style={styles.emptyStateSubtitle}>{screenTexts.EmptyInvitationsSubtitle}</Text>
                                <TouchableOpacity style={styles.createGroupButton} onPress={() => setShowModal(true)}>
                                    <Text style={styles.createGroupButtonText}>{screenTexts.CreateGroupButton}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    )}

                    {(selected === 'Invitaciones' && type === 'Activities') && (
                        loadingInvitations ? (
                            <ActivityIndicator size="large" color="#1D7CE4" />
                        ) : invitations.length > 0 ? (
                            invitations.map((item, index) => (
                                <React.Fragment key={index}>
                                    <ActivityCard info={item}/>
                                    <View style={styles.buttonsContainer}>
                                        <LinearGradient 
                                            colors={['#004999', '#1D7CE4']}
                                            start={[0, 0]}
                                            end={[1, 1]}
                                            style={styles.aceptButton}
                                        >
                                            <TouchableOpacity onPress={() => handleAceptActivity(item._id)}>
                                                <Text style={styles.aceptText}>{screenTexts.aceptText}</Text>
                                            </TouchableOpacity>
                                        </LinearGradient>
                                        <TouchableOpacity style={styles.rejectButton} onPress={() => handleRejectActivity(item._id)}>
                                            <Text style={styles.rejectText}>{screenTexts.rejectText}</Text>
                                        </TouchableOpacity>
                                    </View>
                                </React.Fragment>
                            ))
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyStateTitle}>{screenTexts.EmptyInvitationsTitleActivities}</Text>
                                <Text style={styles.emptyStateSubtitle}>{screenTexts.EmptyInvitationsSubtitleActivities}</Text>
                                <TouchableOpacity style={styles.createGroupButton} onPress={() => setShowActivityModal(true)}>
                                    <Text style={styles.createGroupButtonText}>{screenTexts.CreateActivityButton}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    )}

                    {(selected === 'Solicitudes' && type === 'Groups') && (
                        loadingRequests ? (
                            <ActivityIndicator size="large" color="#1D7CE4" />
                        ) : requests.length > 0 ? (
                            requests.map((item, index) => (
                                <GroupCard
                                    key={index}
                                    _id={item._id}
                                    name={item.name}
                                    members={item.members.length}
                                    memberAvatars={item.memberAvatars}
                                />
                            ))
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyStateTitle}>{screenTexts.EmptyRequestsTitle}</Text>
                                <Text style={styles.emptyStateSubtitle}>{screenTexts.EmptyRequestsSubtitle}</Text>
                                <TouchableOpacity style={styles.createGroupButton} onPress={() => setShowModal(true)}>
                                    <Text style={styles.createGroupButtonText}>{screenTexts.CreateGroupButton}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    )}

                    {(selected === 'Solicitudes' && type === 'Activities') && (
                        loadingRequests ? (
                            <ActivityIndicator size="large" color="#1D7CE4" />
                        ) : requests.length > 0 ? (
                            requests.map((item, index) => (
                                <ActivityCard key={index} info={item}/>
                            ))
                        ) : (
                            <View style={styles.emptyStateContainer}>
                                <Text style={styles.emptyStateTitle}>{screenTexts.EmptyRequestsTitleActivities}</Text>
                                <Text style={styles.emptyStateSubtitle}>{screenTexts.EmptyRequestsSubtitleActivities}</Text>
                                <TouchableOpacity style={styles.createGroupButton} onPress={() => setShowActivityModal(true)}>
                                    <Text style={styles.createGroupButtonText}>{screenTexts.CreateActivityButton}</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    )}
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

          <AddGroup visible={showModal} onClose={() => setShowModal(false)} avatar={''} loading={loading2} setLoading={setLoading2} setWinKylets={setWinKylets} />
          
          <AddActivity 
            visible={showActivityModal} 
            onClose={() => setShowActivityModal(false)} 
            loading={loading2} 
            setLoading={setLoading2}
            setWinKylets={setWinKylets}
          />

          {loading2 && (
              <LoadingOverlay/>
          )}

          <InfoModal 
            celebration={true}
            isOpen={showKyletsConfirmation} 
            onClose={() => {setShowKyletsConfirmation(false), setWinKylets(0)} } 
            Title={winKyletsText} 
            Subtitle={screenTexts.KyletsSubtitle} 
            Button={screenTexts.KyletsButton} 
            onPress={() => {setShowKyletsConfirmation(false), setWinKylets(0)}}
          />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      width: '100%',
      backgroundColor: 'white',
  },
  scrollContainer:{
      paddingHorizontal: 18,
      paddingTop: 15,
      paddingBottom: 15,
      flex: 1
  },
  containerButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
  },
  button: {
      paddingVertical: 4,
      flex: 1,
      alignItems: 'center',
  },
  leftButton: {
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
  },
  rightButton: {
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
  },
  selectedButton: {
      borderBottomWidth: 3,
      borderColor: '#1D7CE4'
  },
  buttonText: {
      color: '#000',
      fontSize: 14,
  },
  selectedButtonText:{
      fontWeight: 'bold',
  },
  buttonAdd:{
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
  blocked: {
      flex: 1,
      marginLeft: -18
  },
  buttonsContainer: { 
      width: '100%', 
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 15
  },
  aceptButton:{
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
  },
  aceptText:{
      color: 'white',
      fontSize: 14
  },
  rejectButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 10,
      backgroundColor: 'white',
      borderColor: '#d9d9d9',
      borderWidth: 1,
      elevation: 2,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
  },
  rejectText: {
      fontSize: 14
  },
  // Empty State Styles - Premium UX/UI Design
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 30,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    letterSpacing: -0.2,
    maxWidth: 280,
  },
  createGroupButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
});

export default Request;
