import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator, FlatList, TextInput, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../../context/useUser';
import { trickLike } from '../../../services/communityServices';
import Icon from 'react-native-vector-icons/Ionicons';
import fondoExperiencia from '../../../../assets/fondo_experiencia.png';
import createButton from '../../../../assets/createButton.png';
import { LinearGradient } from 'expo-linear-gradient';

const RetoDiario = () => {
    const { texts, logout } = useUser();
    const navigate = useNavigation();
    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.RetoDiario;
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSubmenu, setSelectedSubmenu] = useState('comunidad'); // 'comunidad' o 'mis_retos'
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [challengeTitle, setChallengeTitle] = useState('');
    const [challengeDescription, setChallengeDescription] = useState('');

    // Datos de ejemplo para los retos de diferentes días
    const [dailyChallenges, setDailyChallenges] = useState([
        {
            id: '1',
            date: '2024-01-15',
            dayName: 'Lunes',
            challenge: 'Reto del Amanecer',
            featuredMoment: {
                user: {
                    name: 'María García',
                    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                    kylotId: '@maria_g'
                },
                photo: {
                    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop'
                },
                title: 'Amanecer en la montaña',
                liked: true,
                likes: 24,
            },
            allMoments: [
                {
                    id: '1_1',
                    user: { name: 'María García', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', kylotId: '@maria_g' },
                    photo: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
                    title: 'Amanecer en la montaña',
                    liked: true
                },
                {
                    id: '1_2',
                    user: { name: 'Carlos López', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', kylotId: '@carlos_l' },
                    photo: { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop' },
                    title: 'Primer rayo de sol',
                    liked: false
                },
                {
                    id: '1_3',
                    user: { name: 'Ana Martínez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', kylotId: '@ana_m' },
                    photo: { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop' },
                    title: 'Alba dorada',
                    liked: true
                },
                {
                    id: '1_4',
                    user: { name: 'David Ruiz', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', kylotId: '@david_r' },
                    photo: { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
                    title: 'Nuevo día',
                    liked: false
                }
            ]
        },
        {
            id: '2',
            date: '2024-01-14',
            dayName: 'Domingo',
            challenge: 'Reto del Atardecer',
            featuredMoment: {
                user: {
                    name: 'Carlos López',
                    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
                    kylotId: '@carlos_l'
                },
                photo: {
                    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop'
                },
                title: 'Puesta de sol en el mar',
                liked: false,
                likes: 18,
            },
            allMoments: [
                {
                    id: '2_1',
                    user: { name: 'Carlos López', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', kylotId: '@carlos_l' },
                    photo: { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop' },
                    title: 'Puesta de sol en el mar',
                    liked: false
                },
                {
                    id: '2_2',
                    user: { name: 'Laura Sánchez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', kylotId: '@laura_s' },
                    photo: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
                    title: 'Atardecer dorado',
                    liked: true
                },
                {
                    id: '2_3',
                    user: { name: 'Miguel Torres', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', kylotId: '@miguel_t' },
                    photo: { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop' },
                    title: 'Crepúsculo perfecto',
                    liked: false
                },
                {
                    id: '2_4',
                    user: { name: 'Sofia García', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', kylotId: '@sofia_g' },
                    photo: { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
                    title: 'Ocaso mágico',
                    liked: true
                }
            ]
        },
        {
            id: '3',
            date: '2024-01-13',
            dayName: 'Sábado',
            challenge: 'Reto de la Naturaleza',
            featuredMoment: {
                user: {
                    name: 'Ana Martínez',
                    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
                    kylotId: '@ana_m'
                },
                photo: {
                    url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop'
                },
                title: 'Bosque encantado',
                liked: true,
                likes: 31,
            },
            allMoments: [
                {
                    id: '3_1',
                    user: { name: 'Ana Martínez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', kylotId: '@ana_m' },
                    photo: { url: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop' },
                    title: 'Bosque encantado',
                    liked: true
                },
                {
                    id: '3_2',
                    user: { name: 'Pedro López', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', kylotId: '@pedro_l' },
                    photo: { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop' },
                    title: 'Cascada natural',
                    liked: false
                },
                {
                    id: '3_3',
                    user: { name: 'Elena Ruiz', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', kylotId: '@elena_r' },
                    photo: { url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop' },
                    title: 'Montaña verde',
                    liked: true
                },
                {
                    id: '3_4',
                    user: { name: 'Roberto Sánchez', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', kylotId: '@roberto_s' },
                    photo: { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop' },
                    title: 'Sendero oculto',
                    liked: false
                }
            ]
        }
    ]);

    const handleLike = async (challengeId) => {
        try {
            setLoading(true);
            const challenge = dailyChallenges.find(c => c.id === challengeId);
            
            // Usar el mismo servicio para like y unlike
            await trickLike({ _id: challengeId }, logout)
                .then(() => {
                    // Alternar el estado y actualizar el contador
                    setDailyChallenges(prev => prev.map(c => 
                        c.id === challengeId 
                            ? { 
                                ...c, 
                                featuredMoment: { 
                                    ...c.featuredMoment, 
                                    liked: !c.featuredMoment.liked, 
                                    likes: c.featuredMoment.liked ? c.featuredMoment.likes - 1 : c.featuredMoment.likes + 1
                                }
                              }
                            : c
                    ));
                })
                .catch((error) => {
                    console.error('Error al dar like:', error);
                    alert('Error al dar like. Por favor, inténtalo de nuevo.');
                });
        } catch (error) {
            console.error('Error al dar like:', error);
            alert('Error al dar like. Por favor, inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleChallengePress = (challenge) => {
        navigate.navigate('RetoDiarioDetalle', { 
            challenge: challenge,
            challengeId: challenge.id,
            challengeTitle: challenge.challenge,
            dayName: challenge.dayName,
            date: challenge.date
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);
        // Simular carga de datos
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        return `${day}/${month}`;
    };

    const handleCreateChallenge = () => {
        if (challengeTitle.trim() && challengeDescription.trim()) {
            // Aquí iría la lógica para crear el reto
            console.log('Creando reto:', { title: challengeTitle, description: challengeDescription });
            
            // Limpiar formulario y cerrar modal
            setChallengeTitle('');
            setChallengeDescription('');
            setShowCreateModal(false);
            
            // Aquí podrías añadir el nuevo reto a la lista
            // setDailyChallenges(prev => [...prev, newChallenge]);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{screenTexts?.Title || 'Reto Diario'}</Text>
                    <Text style={styles.subtitle}>{screenTexts?.Subtitle || 'Descubre los retos diarios de la comunidad'}</Text>
                    <Text style={styles.subtitle2}>Participa en los desafíos diarios y comparte tus momentos</Text>
                </View>
            </View>
            
            {/* Submenu */}
            <View style={styles.submenuContainer}>
                <TouchableOpacity
                    style={[styles.submenuTab, selectedSubmenu === 'comunidad' && styles.activeSubmenuTab]}
                    onPress={() => setSelectedSubmenu('comunidad')}
                >
                    <Text style={[styles.submenuText, selectedSubmenu === 'comunidad' && styles.activeSubmenuText]}>
                        Comunidad
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.submenuTab, selectedSubmenu === 'mis_retos' && styles.activeSubmenuTab]}
                    onPress={() => setSelectedSubmenu('mis_retos')}
                >
                    <Text style={[styles.submenuText, selectedSubmenu === 'mis_retos' && styles.activeSubmenuText]}>
                        Mis retos
                    </Text>
                </TouchableOpacity>
            </View>
            
            <ScrollView 
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1D7CE4" />
                    </View>
                )}

                {!loading && selectedSubmenu === 'comunidad' && dailyChallenges.map((challenge) => (
                    <TouchableOpacity 
                        key={challenge.id} 
                        style={styles.challengeCard}
                        onPress={() => handleChallengePress(challenge)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.challengeHeader}>
                            <View style={styles.dateContainer}>
                                <Text style={styles.dayName}>{challenge.dayName}</Text>
                                <Text style={styles.date}>{formatDate(challenge.date)}</Text>
                            </View>
                            <View style={styles.challengeTitleContainer}>
                                <Text style={styles.challengeTitle}>{challenge.challenge}</Text>
                                <Text style={styles.momentsCount}>{challenge.allMoments.length} momentos</Text>
                            </View>
                        </View>

                        <View style={styles.momentContainer}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: challenge.featuredMoment.photo.url }} style={styles.momentImage} resizeMode="cover" />
                                
                                {/* Botón de like en esquina superior derecha */}
                                <TouchableOpacity 
                                    style={styles.likeButtonTopRight}
                                    onPress={(e) => {
                                        e.stopPropagation();
                                        handleLike(challenge.id);
                                    }}
                                    disabled={loading}
                                >
                                    <Icon 
                                        name={challenge.featuredMoment.liked ? "heart" : "heart-outline"} 
                                        size={16} 
                                        color={challenge.featuredMoment.liked ? "#ff4757" : "#FFFFFF"} 
                                    />
                                </TouchableOpacity>
                            </View>
                            
                            <View style={styles.momentInfo}>
                                <View style={styles.userInfo}>
                                    <Image source={{ uri: challenge.featuredMoment.user.avatar }} style={styles.userAvatar} />
                                    <View style={styles.userDetails}>
                                        <Text style={styles.userName} numberOfLines={1}>{challenge.featuredMoment.user.name}</Text>
                                        <Text style={styles.userKylotId} numberOfLines={1}>{challenge.featuredMoment.user.kylotId}</Text>
                                    </View>
                                </View>
                                
                                <Text style={styles.momentTitle} numberOfLines={2}>{challenge.featuredMoment.title}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Estado vacío para Mis retos */}
                {!loading && selectedSubmenu === 'mis_retos' && (
                    <View style={styles.emptyStateContainer}>
                        <Image source={fondoExperiencia} style={styles.emptyStateImage} />
                        <Text style={styles.emptyStateTitle}>No tienes retos completados</Text>
                        <Text style={styles.emptyStateSubtitle}>Participa en los retos de la comunidad para ver tus logros aquí</Text>
                        <TouchableOpacity 
                            style={styles.createGroupButton}
                            onPress={() => setSelectedSubmenu('comunidad')}
                        >
                            <Text style={styles.createGroupButtonText}>Ver retos de la comunidad</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Botón flotante para crear reto */}
            <LinearGradient
                colors={['#1D7CE4', '#1D7CE4']}
                style={styles.buttonAdd}
            >
                <TouchableOpacity onPress={() => setShowCreateModal(true)}>
                    <Image source={createButton} style={styles.imageCreate}/>
                </TouchableOpacity>
            </LinearGradient>

            {/* Modal para crear reto */}
            <Modal
                visible={showCreateModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Crear Reto Diario</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowCreateModal(false)}
                            >
                                <Icon name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Título del reto</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={challengeTitle}
                                    onChangeText={setChallengeTitle}
                                    placeholder="Ej: Visita un museo"
                                    placeholderTextColor="#8E8E93"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Descripción</Text>
                                <TextInput
                                    style={[styles.textInput, styles.textArea]}
                                    value={challengeDescription}
                                    onChangeText={setChallengeDescription}
                                    placeholder="Describe el reto y cómo participar..."
                                    placeholderTextColor="#8E8E93"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowCreateModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.createButtonModal}
                                onPress={handleCreateChallenge}
                            >
                                <LinearGradient
                                    colors={['#007AFF', '#0056CC']}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.createButtonText}>Crear Reto</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    titleSection: {
        marginBottom: 8,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 4,
        letterSpacing: -0.5,
        paddingHorizontal: 16,
    },
    subtitle: {
        fontSize: 16,
        color: '#86868B',
        fontWeight: '400',
        lineHeight: 22,
        marginBottom: 2,
        paddingHorizontal: 16,
    },
    subtitle2: {
        fontSize: 16,
        color: '#86868B',
        fontWeight: '400',
        lineHeight: 22,
        paddingHorizontal: 16,
    },
    challengeCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.04)',
    },
    challengeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 18,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0,0,0,0.06)',
        backgroundColor: 'rgba(29, 124, 228, 0.02)',
    },
    dateContainer: {
        alignItems: 'center',
        marginRight: 20,
        minWidth: 70,
        backgroundColor: 'rgba(29, 124, 228, 0.1)',
        borderRadius: 12,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dayName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1D7CE4',
        marginBottom: 2,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    date: {
        fontSize: 11,
        color: '#1D7CE4',
        fontWeight: '600',
        opacity: 0.8,
    },
    challengeTitleContainer: {
        flex: 1,
    },
    challengeTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 4,
        letterSpacing: -0.2,
        lineHeight: 22,
    },
    momentsCount: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
        backgroundColor: 'rgba(142, 142, 147, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    momentContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 18,
        backgroundColor: '#FFFFFF',
    },
    imageContainer: {
        position: 'relative',
        width: 88,
        height: 88,
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    momentImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F7',
    },
    likeButtonTopRight: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 16,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    momentInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    userAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 2,
        letterSpacing: -0.1,
    },
    userKylotId: {
        fontSize: 12,
        color: '#8E8E93',
        fontWeight: '500',
    },
    momentTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1D1F',
        lineHeight: 22,
        marginBottom: 12,
        letterSpacing: -0.1,
    },
    // Submenu Styles
    submenuContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
        marginTop: -20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    submenuTab: { 
        flex: 1, 
        alignItems: 'center', 
        paddingVertical: 8 
    },
    activeSubmenuTab: { 
        borderBottomWidth: 3, 
        borderColor: '#1D7CE4' 
    },
    submenuText: { 
        color: '#000', 
        fontSize: 14 
    },
    activeSubmenuText: { 
        fontWeight: 'bold' 
    },
    // Empty State Styles - Premium UX/UI Design (matching Solicitudes)
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 60,
        marginTop: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        marginHorizontal: 20,
    },
    emptyStateImage: {
        width: 120,
        height: 120,
        marginBottom: 24,
        resizeMode: 'contain',
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D1D1F',
        textAlign: 'center',
        marginBottom: 12,
        letterSpacing: -0.5,
        lineHeight: 30,
        paddingHorizontal: 16,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
        letterSpacing: -0.2,
        maxWidth: 240,
        paddingHorizontal: 16,
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
    // Botón flotante para crear reto
    buttonAdd: {
        backgroundColor: '#1D7CE4',
        width: 50,
        height: 50,
        borderRadius: 25,
        position: 'absolute',
        bottom: 120,
        right: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    imageCreate: {
        width: 35,
        height: 35
    },
    // Estilos del modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34, // Safe area bottom
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    closeButton: {
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1D1D1F',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#D1D1D6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1D1D1F',
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D1D6',
        alignItems: 'center',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8E8E93',
    },
    createButtonModal: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default RetoDiario;
