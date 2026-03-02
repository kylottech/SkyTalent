import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList, Animated, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useUser } from '../../../context/useUser';
import { trickLike } from '../../../services/communityServices';
import Icon from 'react-native-vector-icons/Ionicons';
import Top from '../../../components/Utils/Top';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const RetoDiarioDetalle = () => {
    const { texts, logout } = useUser();
    const navigate = useNavigation();
    const route = useRoute();
    const { challenge, challengeTitle, dayName, date } = route.params;
    const [loading, setLoading] = useState(false);
    const [moments, setMoments] = useState(
        challenge.allMoments.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    );
    
    // Referencias para animaciones
    const likeAnimations = useRef({});

    // Función para crear animación de like si no existe
    const getLikeAnimation = (momentId) => {
        if (!likeAnimations.current[momentId]) {
            likeAnimations.current[momentId] = new Animated.Value(1);
        }
        return likeAnimations.current[momentId];
    };

    // Función para animar el like
    const animateLike = (momentId) => {
        const animation = getLikeAnimation(momentId);
        
        // Animación de escala y bounce
        Animated.sequence([
            Animated.timing(animation, {
                toValue: 1.3,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.spring(animation, {
                toValue: 1,
                tension: 100,
                friction: 3,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleLike = async (momentId) => {
        try {
            setLoading(true);
            const moment = moments.find(m => m.id === momentId);
            
            // Animar el like inmediatamente para feedback visual
            animateLike(momentId);
            
            // Usar el mismo servicio para like y unlike, como en TrickDetail.jsx
            await trickLike({ _id: momentId }, logout)
                .then(() => {
                    // Alternar el estado y actualizar el contador
                    setMoments(prev => prev.map(m => 
                        m.id === momentId 
                            ? { 
                                ...m, 
                                liked: !m.liked, 
                                likes: m.liked ? (m.likes || 0) - 1 : (m.likes || 0) + 1
                              }
                            : m
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

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = d.getDate();
        const month = d.getMonth() + 1;
        return `${day}/${month}`;
    };

    const handleAddPhoto = () => {
        Alert.alert(
            'Agregar momento',
            '¿Cómo quieres agregar tu momento?',
            [
                {
                    text: 'Galería',
                    onPress: () => pickImageFromGallery(),
                },
                {
                    text: 'Cámara',
                    onPress: () => pickImageFromCamera(),
                },
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    const pickImageFromGallery = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                // Aquí puedes agregar la lógica para subir la imagen
                console.log('Imagen seleccionada:', result.assets[0].uri);
                // TODO: Implementar subida de imagen al reto
                alert('Funcionalidad de subir imagen próximamente disponible');
            }
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
            alert('Error al seleccionar imagen');
        }
    };

    const pickImageFromCamera = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                // Aquí puedes agregar la lógica para subir la imagen
                console.log('Imagen capturada:', result.assets[0].uri);
                // TODO: Implementar subida de imagen al reto
                alert('Funcionalidad de subir imagen próximamente disponible');
            }
        } catch (error) {
            console.error('Error al capturar imagen:', error);
            alert('Error al capturar imagen');
        }
    };

    const renderFeaturedMoment = (moment) => (
        <View style={styles.featuredMomentContainer}>
            <Text style={styles.featuredMomentTitle}>Momento destacado</Text>
            <View style={styles.featuredMomentCard}>
                <View style={styles.featuredImageContainer}>
                    <Image source={{ uri: moment.photo.url }} style={styles.featuredMomentImage} resizeMode="cover" />
                    
                    {/* Botón de like en esquina superior derecha */}
                    <TouchableOpacity 
                        style={styles.featuredLikeButtonTopRight}
                        onPress={() => handleLike(moment.id)}
                        disabled={loading}
                    >
                        <Animated.View style={{ transform: [{ scale: getLikeAnimation(moment.id) }] }}>
                            <Icon 
                                name={moment.liked ? "heart" : "heart-outline"} 
                                size={20} 
                                color={moment.liked ? "#ff4757" : "#FFFFFF"} 
                            />
                        </Animated.View>
                    </TouchableOpacity>
                    
                    {/* Badge de likes */}
                    <View style={styles.likesBadge}>
                        <Icon name="heart" size={12} color="#ff4757" />
                        <Text style={styles.likesBadgeText}>{moment.likes || 0}</Text>
                    </View>
                </View>
                
                {/* Título del momento */}
                <Text style={styles.featuredMomentTitleText} numberOfLines={2}>{moment.title}</Text>
                
                {/* Información del usuario */}
                <View style={styles.featuredUserInfo}>
                    <Image source={{ uri: moment.user.avatar }} style={styles.featuredUserAvatar} />
                    <View style={styles.featuredUserDetails}>
                        <Text style={styles.featuredUserName} numberOfLines={1}>{moment.user.name}</Text>
                        <Text style={styles.featuredUserKylotId} numberOfLines={1}>{moment.user.kylotId}</Text>
                    </View>
                </View>
                
                {/* Número de likes */}
                <View style={styles.featuredLikesInfo}>
                    <Icon name="heart" size={16} color="#ff4757" />
                    <Text style={styles.featuredLikesCount}>{moment.likes || 0} likes</Text>
                </View>
            </View>
        </View>
    );

    const renderMoment = ({ item }) => (
        <TouchableOpacity style={styles.momentCard} activeOpacity={0.9}>
            <View style={styles.momentContainer}>
                {/* Imagen del momento */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.photo.url }} style={styles.momentImage} resizeMode="cover" />
                    
                    {/* Botón de like en esquina superior derecha */}
                    <TouchableOpacity 
                        style={styles.likeButtonTopRight}
                        onPress={() => handleLike(item.id)}
                        disabled={loading}
                    >
                        <Animated.View style={{ transform: [{ scale: getLikeAnimation(item.id) }] }}>
                            <Icon 
                                name={item.liked ? "heart" : "heart-outline"} 
                                size={16} 
                                color={item.liked ? "#ff4757" : "#FFFFFF"} 
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
                
                {/* Información del usuario */}
                <View style={styles.userInfo}>
                    <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName} numberOfLines={1}>{item.user.name}</Text>
                        <Text style={styles.userKylotId} numberOfLines={1}>{item.user.kylotId}</Text>
                    </View>
                </View>
                
                {/* Título del momento */}
                <Text style={styles.momentTitle} numberOfLines={2}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Top 
                left={true} 
                leftType={'Back'}
                typeCenter={'Text'} 
                textCenter={challengeTitle}
                right={false}
            />
            
            <View style={styles.headerContainer}>
                <View style={styles.titleSection}>
                    <Text style={styles.subtitle}>{dayName} {formatDate(date)}</Text>
                    <Text style={styles.title}>{challengeTitle}</Text>
                    <Text style={styles.subtitle2}>{moments.length} momentos compartidos</Text>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
                {/* Momento destacado */}
                {moments.length > 0 && renderFeaturedMoment(moments[0])}
                
                {/* Grid de momentos */}
                <View style={styles.momentsGrid}>
                    <Text style={styles.allMomentsTitle}>Todos los momentos</Text>
                    <View style={styles.gridContainer}>
                        {moments.slice(1).map((moment, index) => (
                            <View key={moment.id} style={[styles.gridItem, index % 2 === 0 ? styles.gridItemLeft : styles.gridItemRight]}>
                                {renderMoment({ item: moment })}
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Botón flotante para agregar foto */}
            <LinearGradient
                colors={['#1D7CE4', '#1D7CE4']}
                style={styles.floatingAddButton}
            >
                <TouchableOpacity 
                    onPress={handleAddPhoto}
                    style={styles.addButtonContent}
                >
                    <Icon name="camera" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
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
        color: '#86868B',
        fontWeight: '400',
        lineHeight: 22,
        marginBottom: 2,
    },
    subtitle2: {
        fontSize: 16,
        color: '#86868B',
        fontWeight: '400',
        lineHeight: 22,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    // Estilos para el momento destacado
    featuredMomentContainer: {
        marginBottom: 24,
    },
    featuredMomentTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 12,
        letterSpacing: -0.3,
    },
    featuredMomentCard: {
        backgroundColor: '#FFFFFF',
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
    featuredImageContainer: {
        position: 'relative',
        width: '100%',
        height: 180,
        borderRadius: 16,
        overflow: 'hidden',
        margin: 16,
        marginBottom: 0,
    },
    featuredMomentImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F7',
    },
    featuredLikeButtonTopRight: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 20,
        width: 40,
        height: 40,
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
    likesBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(255, 71, 87, 0.9)',
        borderRadius: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    likesBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 4,
    },
    featuredUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        paddingHorizontal: 16,
    },
    featuredUserAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    featuredUserDetails: {
        alignItems: 'center',
    },
    featuredUserName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 2,
        letterSpacing: -0.1,
        textAlign: 'center',
    },
    featuredUserKylotId: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
        textAlign: 'center',
    },
    featuredMomentTitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1D1D1F',
        lineHeight: 24,
        marginBottom: 12,
        paddingHorizontal: 16,
        textAlign: 'center',
        letterSpacing: -0.1,
    },
    featuredLikesInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    featuredLikesCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#ff4757',
        marginLeft: 6,
    },
    // Estilos para el grid de momentos
    momentsGrid: {
        marginBottom: 20,
    },
    allMomentsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 16,
        letterSpacing: -0.3,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 16,
    },
    gridItemLeft: {
        marginRight: '2%',
    },
    gridItemRight: {
        marginLeft: '2%',
    },
    // Estilos para las tarjetas de momentos (mantenidos del diseño original pero mejorados)
    momentCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.04)',
    },
    momentContainer: {
        padding: 12,
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        height: 120,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 12,
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
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1D1D1F',
        marginBottom: 2,
        letterSpacing: -0.1,
    },
    userKylotId: {
        fontSize: 11,
        color: '#8E8E93',
        fontWeight: '500',
    },
    momentTitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1D1D1F',
        lineHeight: 18,
        marginBottom: 8,
        letterSpacing: -0.1,
    },
    // Estilos para el botón flotante
    floatingAddButton: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        shadowColor: '#1D7CE4',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default RetoDiarioDetalle;
