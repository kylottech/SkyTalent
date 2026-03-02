import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from "../../context/useUser";
import { getRequestsGroups, aceptInvitation, rejectInvitation } from '../../services/groupsServices';
import Top from '../../components/Utils/Top';
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';

const GroupRequest = ({ route }) => {
    const navigate = useNavigation();
    const { isLogged, isLoading, texts, logout } = useUser();
    const screenTexts = texts.pages.ComunidadPages.GroupRequest;

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingRequests, setLoadingRequests] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmacion, setConfirmacion] = useState(false);
    const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const { _id } = route.params;

    useEffect(() => {
        if (!isLoading && !isLogged) {
            navigate.navigate("Login");
        }
    }, [isLogged, isLoading]);

    const handleGetRequests = (reset = false) => {
    if (!hasMore && !reset) return;

    setLoadingRequests(true);
    const currentPage = reset ? 1 : page;

    getRequestsGroups({ currentPage, _id }, logout)
      .then((res) => {
        if (res && Array.isArray(res.users)) {
          setRequests(prev => reset ? res.users : [...prev, ...res.users]);
          setPage(reset ? 2 : currentPage + 1);
          setHasMore(res.users.length > 0);
        } else {
          setHasMore(false);
        }
        setLoadingRequests(false);
      })
      .catch((error) => {
        setError(true);
        setErrorMessage(error);
        setHasMore(false);
        setLoadingRequests(false);
      });
    }

    const handleAcept = async (_idUser) => {
        setLoading(true);
        try {
            aceptInvitation({ _id, _idUser }, logout)
                .then(() => {
                    setConfirmacion(true);
                    setConfirmacionMensaje(screenTexts.AceptConfirmation);
                    setRequests(prev => prev.filter(req => req._id !== _idUser));
                    setLoading(false)
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                    setLoading(false)
                })
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

    const handleReject = async (_idUser) => {
        setLoading(true);
        try {
            rejectInvitation({ _id, _idUser }, logout)
                .then(() => {
                    setConfirmacion(true);
                    setConfirmacionMensaje(screenTexts.RejectConfirmation);
                    setRequests(prev => prev.filter(req => req._id !== _idUser));
                    setLoading(false)
                })
                .catch((error) => {
                    setError(true);
                    setErrorMessage(error.message);
                    setLoading(false)
                })
        } catch (error) {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        handleGetRequests(true);
        setRefreshing(false);
    };

    useEffect(() => {
        handleGetRequests();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => navigate.navigate('OtroPerfil', { userId: item._id })}>
                <Image 
                    source={{ uri: item?.avatar?.url}}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.name}>{item.name} {item.surname}</Text>
                    <Text style={styles.kylotId}>{item.kylotId}</Text>
                </View>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                <TouchableOpacity onPress={() => handleAcept(item._id)}>
                    <LinearGradient
                        colors={['#004999', '#1D7CE4']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.aceptButton}
                    >
                        <Text style={styles.aceptText}>{screenTexts.RequestButton1}</Text>
                    </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item._id)}>
                    <Text style={styles.rejectText}>{screenTexts.RequestButton2}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Top 
                left={true} leftType={'Back'}
                typeCenter={'Text'} textCenter={screenTexts.Top}
                right={false} 
            />

            <FlatList
                contentContainerStyle={styles.scrollContainer}
                data={requests}
                keyExtractor={(item, index) => item._id || index.toString()}
                renderItem={renderItem}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                onEndReached={() => {
                    if (!loadingRequests && hasMore) {
                        handleGetRequests();
                    }
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loadingRequests ? <ActivityIndicator size="large" color="#1D7CE4" /> : null}
            />

            {error && <Error message={errorMessage} func={setError} />}
            {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
            {loading && <LoadingOverlay />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',
    },
    scrollContainer: {
        paddingHorizontal: 18,
        paddingTop: 15,
        paddingBottom: 15,
        flexGrow: 1
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        borderColor: '#d9d9d9',
        borderWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },

    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    kylotId: {
        fontSize: 14,
        color: 'gray'
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 15
    },
    aceptButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    aceptText: {
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
    }
});

export default GroupRequest;
