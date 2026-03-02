import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, RefreshControl, ActivityIndicator, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../../context/useUser';
import Icon from 'react-native-vector-icons/Ionicons';
import fondoExperiencia from '../../../../assets/fondo_experiencia.png';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = CARD_WIDTH * 1.4; // Proporción de álbum de fotos

const Expose = () => {
    const { texts, logout } = useUser();
    const navigate = useNavigation();
    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.Expose || {
        Title: 'EXPOSE',
        Subtitle: 'Tu álbum de momentos del año',
        CreateButton: 'Crear EXPOSE',
        EmptyTitle: 'No tienes ningún EXPOSE',
        EmptySubtitle: 'Crea tu álbum de momentos y genera tu wrap anual'
    };

    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSubmenu, setSelectedSubmenu] = useState('mis_expose'); // 'mis_expose' o 'comunidad'
    const [myExposes, setMyExposes] = useState([]);
    const [communityExposes, setCommunityExposes] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Datos de ejemplo - esto vendrá de la API
    const sampleExposes = [
        {
            id: '1',
            title: 'Mi 2025',
            year: 2025,
            coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
            isPublic: true,
            totalPhotos: 24,
            completedMonths: 3,
            likes: 156,
            user: {
                name: 'María García',
                avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
                kylotId: '@maria_g'
            },
            months: {
                'enero': { photos: 8, coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop' },
                'febrero': { photos: 12, coverPhoto: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=600&fit=crop' },
                'marzo': { photos: 4, coverPhoto: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=600&fit=crop' },
            }
        }
    ];

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    useEffect(() => {
        loadExposes();
    }, [selectedSubmenu]);

    const loadExposes = async () => {
        setLoading(true);
        try {
            // Aquí irá la llamada a la API
            // const data = await getMyExposes(logout);
            // setMyExposes(data);
            
            // Por ahora usamos datos de ejemplo
            if (selectedSubmenu === 'mis_expose') {
                setMyExposes(sampleExposes);
            } else {
                setCommunityExposes(sampleExposes);
            }
        } catch (error) {
            console.error('Error cargando EXPOSE:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadExposes();
        setRefreshing(false);
    }, [selectedSubmenu]);

    const handleCreateExpose = () => {
        navigate.navigate('ExposeCreate');
    };

    const handleExposePress = (expose) => {
        navigate.navigate('ExposeDetail', { exposeId: expose.id });
    };

    const handleGenerateWrap = (expose) => {
        navigate.navigate('ExposeWrap', { exposeId: expose.id });
    };

    const renderExposeCard = (expose, index) => {
        const completionPercentage = (expose.completedMonths / 12) * 100;

        return (
            <TouchableOpacity
                key={expose.id}
                style={styles.albumCard}
                onPress={() => handleExposePress(expose)}
                activeOpacity={0.9}
            >
                {/* Cover Photo */}
                <View style={styles.albumCover}>
                    <Image source={{ uri: expose.coverPhoto }} style={styles.coverImage} resizeMode="cover" />
                    
                    {/* Gradient Overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.7)']}
                        style={styles.coverGradient}
                    />

                    {/* Privacy Badge */}
                    <View style={styles.privacyBadge}>
                        <Icon 
                            name={expose.isPublic ? "globe-outline" : "lock-closed-outline"} 
                            size={12} 
                            color="#FFFFFF" 
                        />
                        <Text style={styles.privacyText}>
                            {expose.isPublic ? 'Público' : 'Privado'}
                        </Text>
                    </View>

                    {/* Cover Info */}
                    <View style={styles.coverInfo}>
                        <Text style={styles.albumTitle}>{expose.title}</Text>
                        <Text style={styles.albumYear}>{expose.year}</Text>
                    </View>
                </View>

                {/* Album Spine (lado del álbum) */}
                <View style={styles.albumSpine}>
                    <LinearGradient
                        colors={['#1D1D1F', '#3A3A3C']}
                        style={styles.spineGradient}
                    >
                        <Text style={styles.spineText}>{expose.title}</Text>
                    </LinearGradient>
                </View>

                {/* Progress & Stats */}
                <View style={styles.albumStats}>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Icon name="images-outline" size={16} color="#1D7CE4" />
                            <Text style={styles.statText}>{expose.totalPhotos} fotos</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Icon name="calendar-outline" size={16} color="#1D7CE4" />
                            <Text style={styles.statText}>{expose.completedMonths}/12 meses</Text>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{Math.round(completionPercentage)}%</Text>
                    </View>

                    {/* Actions */}
                    <View style={styles.actionsRow}>
                        {expose.isPublic && (
                            <View style={styles.likesContainer}>
                                <Icon name="heart" size={16} color="#ff4757" />
                                <Text style={styles.likesText}>{expose.likes}</Text>
                            </View>
                        )}
                        
                        <TouchableOpacity
                            style={styles.wrapButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                handleGenerateWrap(expose);
                            }}
                        >
                            <Icon name="download-outline" size={16} color="#FFFFFF" />
                            <Text style={styles.wrapButtonText}>Generar Wrap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const renderCommunityCard = (expose, index) => {
        return (
            <TouchableOpacity
                key={expose.id}
                style={styles.communityCard}
                onPress={() => handleExposePress(expose)}
                activeOpacity={0.9}
            >
                <Image source={{ uri: expose.coverPhoto }} style={styles.communityImage} resizeMode="cover" />
                
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.communityGradient}
                />

                <View style={styles.communityInfo}>
                    <View style={styles.communityUser}>
                        <Image source={{ uri: expose.user.avatar }} style={styles.communityAvatar} />
                        <View style={styles.communityUserInfo}>
                            <Text style={styles.communityUserName}>{expose.user.name}</Text>
                            <Text style={styles.communityUserKylot}>{expose.user.kylotId}</Text>
                        </View>
                    </View>

                    <Text style={styles.communityTitle}>{expose.title}</Text>
                    
                    <View style={styles.communityStats}>
                        <View style={styles.communityStat}>
                            <Icon name="images-outline" size={14} color="#FFFFFF" />
                            <Text style={styles.communityStatText}>{expose.totalPhotos}</Text>
                        </View>
                        <View style={styles.communityStat}>
                            <Icon name="heart" size={14} color="#ff4757" />
                            <Text style={styles.communityStatText}>{expose.likes}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <View style={styles.titleSection}>
                    <View style={styles.titleRow}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{screenTexts.Title}</Text>
                            <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.createButton}
                            onPress={handleCreateExpose}
                        >
                            <Icon name="add" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Submenu */}
            <View style={styles.submenuContainer}>
                <TouchableOpacity
                    style={[styles.submenuTab, selectedSubmenu === 'mis_expose' && styles.activeSubmenuTab]}
                    onPress={() => setSelectedSubmenu('mis_expose')}
                >
                    <Text style={[styles.submenuText, selectedSubmenu === 'mis_expose' && styles.activeSubmenuText]}>
                        Mis EXPOSE
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                    style={[styles.submenuTab, selectedSubmenu === 'comunidad' && styles.activeSubmenuTab]}
                    onPress={() => setSelectedSubmenu('comunidad')}
                >
                    <Text style={[styles.submenuText, selectedSubmenu === 'comunidad' && styles.activeSubmenuText]}>
                        Comunidad
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content */}
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#1D7CE4" />
                    </View>
                ) : (
                    <>
                        {selectedSubmenu === 'mis_expose' && (
                            myExposes.length > 0 ? (
                                myExposes.map((expose, index) => renderExposeCard(expose, index))
                            ) : (
                                <View style={styles.emptyStateContainer}>
                                    <Image source={fondoExperiencia} style={styles.emptyStateImage} />
                                    <Text style={styles.emptyStateTitle}>{screenTexts.EmptyTitle}</Text>
                                    <Text style={styles.emptyStateSubtitle}>{screenTexts.EmptySubtitle}</Text>
                                    <TouchableOpacity 
                                        style={styles.createGroupButton}
                                        onPress={handleCreateExpose}
                                    >
                                        <Text style={styles.createGroupButtonText}>{screenTexts.CreateButton}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        )}

                        {selectedSubmenu === 'comunidad' && (
                            <View style={styles.communityGrid}>
                                {communityExposes.map((expose, index) => renderCommunityCard(expose, index))}
                            </View>
                        )}
                    </>
                )}
            </ScrollView>
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
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
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
        paddingHorizontal: 16,
    },
    createButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    submenuContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingTop: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
        marginTop: -20,
        backgroundColor: '#FFFFFF',
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
    scrollContainer: {
        flex: 1,
        marginBottom: 50,
    },
    scrollContent: {
        paddingTop: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
    },
    
    // Album Card Styles
    albumCard: {
        marginHorizontal: 20,
        marginBottom: 32,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 12,
        overflow: 'hidden',
    },
    albumCover: {
        height: CARD_HEIGHT * 0.6,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F2F2F7',
    },
    coverGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    privacyBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
    },
    privacyText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    coverInfo: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    albumTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: -0.5,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    albumYear: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    albumSpine: {
        height: 8,
        width: '100%',
    },
    spineGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    spineText: {
        fontSize: 8,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    albumStats: {
        padding: 16,
        backgroundColor: '#FAFAFA',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E5E5E7',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#1D7CE4',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#1D7CE4',
        minWidth: 35,
        textAlign: 'right',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    likesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    likesText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    wrapButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    wrapButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },

    // Community Grid Styles
    communityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        gap: 12,
    },
    communityCard: {
        width: (width - 36) / 2,
        height: (width - 36) / 2 * 1.5,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F2F2F7',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    communityImage: {
        width: '100%',
        height: '100%',
    },
    communityGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
    },
    communityInfo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 12,
    },
    communityUser: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    communityAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    communityUserInfo: {
        flex: 1,
    },
    communityUserName: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    communityUserKylot: {
        fontSize: 9,
        color: '#FFFFFF',
        opacity: 0.8,
    },
    communityTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 6,
    },
    communityStats: {
        flexDirection: 'row',
        gap: 12,
    },
    communityStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    communityStatText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },

    // Empty State Styles
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
        paddingVertical: 60,
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

export default Expose;

