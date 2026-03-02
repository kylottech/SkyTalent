import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, Modal, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../../context/useUser';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const MONTH_CARD_SIZE = (width - 60) / 3;

const ExposeDetail = () => {
    const { texts, logout } = useUser();
    const navigate = useNavigation();
    const route = useRoute();
    const { exposeId } = route.params;

    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.ExposeDetail || {
        Title: 'Mi EXPOSE',
        EditButton: 'Editar',
        AddPhotos: 'Añadir fotos',
        GenerateWrap: 'Generar Wrap',
        ShareButton: 'Compartir',
        Empty: 'Toca para añadir fotos'
    };

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const [expose, setExpose] = useState({
        id: '1',
        title: 'Mi 2025',
        year: 2025,
        isPublic: true,
        coverPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        months: {
            0: { photos: [], title: '' },
            1: { photos: [], title: '' },
            2: { 
                photos: [
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
                    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
                ],
                title: 'Marzo mágico'
            },
            3: { photos: [], title: '' },
            4: { photos: [], title: '' },
            5: { photos: [], title: '' },
            6: { photos: [], title: '' },
            7: { photos: [], title: '' },
            8: { photos: [], title: '' },
            9: { photos: [], title: '' },
            10: { photos: [], title: '' },
            11: { photos: [], title: '' },
        }
    });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editTitle, setEditTitle] = useState(expose.title);
    const [editIsPublic, setEditIsPublic] = useState(expose.isPublic);

    const handleMonthPress = (monthIndex) => {
        navigate.navigate('ExposeMonthDetail', { 
            exposeId: expose.id, 
            monthIndex,
            monthName: monthNames[monthIndex],
            year: expose.year
        });
    };

    const handleGenerateWrap = () => {
        navigate.navigate('ExposeWrap', { exposeId: expose.id });
    };

    const getMonthPhotosCount = (monthIndex) => {
        return expose.months[monthIndex]?.photos?.length || 0;
    };

    const getMonthCoverPhoto = (monthIndex) => {
        const photos = expose.months[monthIndex]?.photos;
        return photos && photos.length > 0 ? photos[0] : null;
    };

    const getTotalPhotos = () => {
        return Object.values(expose.months).reduce((total, month) => {
            return total + (month.photos?.length || 0);
        }, 0);
    };

    const getCompletedMonths = () => {
        return Object.values(expose.months).filter(month => 
            month.photos && month.photos.length > 0
        ).length;
    };

    const handleSaveEdit = () => {
        setExpose({
            ...expose,
            title: editTitle,
            isPublic: editIsPublic
        });
        setShowEditModal(false);
    };

    const renderMonthCard = (monthIndex) => {
        const photosCount = getMonthPhotosCount(monthIndex);
        const coverPhoto = getMonthCoverPhoto(monthIndex);
        const monthData = expose.months[monthIndex];
        const hasPhotos = photosCount > 0;

        return (
            <TouchableOpacity
                key={monthIndex}
                style={styles.monthCard}
                onPress={() => handleMonthPress(monthIndex)}
                activeOpacity={0.8}
            >
                {hasPhotos ? (
                    <>
                        <Image source={{ uri: coverPhoto }} style={styles.monthImage} resizeMode="cover" />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            style={styles.monthGradient}
                        />
                        <View style={styles.monthInfo}>
                            <Text style={styles.monthName}>{monthNames[monthIndex]}</Text>
                            <View style={styles.monthPhotoCount}>
                                <Icon name="images" size={12} color="#FFFFFF" />
                                <Text style={styles.photoCountText}>{photosCount}</Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <View style={styles.emptyMonthCard}>
                        <Icon name="add-circle-outline" size={32} color="#D1D1D6" />
                        <Text style={styles.emptyMonthText}>{monthNames[monthIndex]}</Text>
                        <Text style={styles.emptyMonthSubtext}>{screenTexts.Empty}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const completionPercentage = (getCompletedMonths() / 12) * 100;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={styles.backButton}>
                    <Icon name="chevron-back" size={28} color="#1D1D1F" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editButton}>
                    <Icon name="create-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Cover Section */}
                <View style={styles.coverSection}>
                    <Image source={{ uri: expose.coverPhoto }} style={styles.coverImage} resizeMode="cover" />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.coverGradient}
                    />
                    <View style={styles.coverInfo}>
                        <Text style={styles.exposeTitle}>{expose.title}</Text>
                        <Text style={styles.exposeYear}>{expose.year}</Text>
                        <View style={styles.coverStats}>
                            <View style={styles.coverStat}>
                                <Icon name="images-outline" size={16} color="#FFFFFF" />
                                <Text style={styles.coverStatText}>{getTotalPhotos()} fotos</Text>
                            </View>
                            <View style={styles.coverStat}>
                                <Icon name="calendar-outline" size={16} color="#FFFFFF" />
                                <Text style={styles.coverStatText}>{getCompletedMonths()}/12 meses</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                        <Text style={styles.progressLabel}>Progreso del álbum</Text>
                        <Text style={styles.progressPercentage}>{Math.round(completionPercentage)}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <LinearGradient
                            colors={['#007AFF', '#0056CC']}
                            start={[0, 0]}
                            end={[1, 0]}
                            style={[styles.progressFill, { width: `${completionPercentage}%` }]}
                        />
                    </View>
                </View>

                {/* Months Grid */}
                <View style={styles.monthsSection}>
                    <Text style={styles.sectionTitle}>Meses del año</Text>
                    <View style={styles.monthsGrid}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(monthIndex => 
                            renderMonthCard(monthIndex)
                        )}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionsSection}>
                    <TouchableOpacity 
                        style={styles.wrapButton}
                        onPress={handleGenerateWrap}
                    >
                        <LinearGradient
                            colors={['#007AFF', '#0056CC']}
                            style={styles.wrapButtonGradient}
                        >
                            <Icon name="download-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.wrapButtonText}>{screenTexts.GenerateWrap}</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButton}>
                        <Icon name="share-outline" size={20} color="#007AFF" />
                        <Text style={styles.shareButtonText}>{screenTexts.ShareButton}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Edit Modal */}
            <Modal
                visible={showEditModal}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Editar EXPOSE</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Icon name="close" size={24} color="#8E8E93" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalContent}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Título</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={editTitle}
                                    onChangeText={setEditTitle}
                                    placeholder="Ej: Mi 2025"
                                    placeholderTextColor="#8E8E93"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Privacidad</Text>
                                <View style={styles.privacyOptions}>
                                    <TouchableOpacity
                                        style={[styles.privacyOption, editIsPublic && styles.privacyOptionActive]}
                                        onPress={() => setEditIsPublic(true)}
                                    >
                                        <Icon name="globe-outline" size={20} color={editIsPublic ? "#007AFF" : "#8E8E93"} />
                                        <Text style={[styles.privacyOptionText, editIsPublic && styles.privacyOptionTextActive]}>
                                            Público
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.privacyOption, !editIsPublic && styles.privacyOptionActive]}
                                        onPress={() => setEditIsPublic(false)}
                                    >
                                        <Icon name="lock-closed-outline" size={20} color={!editIsPublic ? "#007AFF" : "#8E8E93"} />
                                        <Text style={[styles.privacyOptionText, !editIsPublic && styles.privacyOptionTextActive]}>
                                            Privado
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.saveButtonModal}
                                onPress={handleSaveEdit}
                            >
                                <LinearGradient
                                    colors={['#007AFF', '#0056CC']}
                                    style={styles.gradientButton}
                                >
                                    <Text style={styles.saveButtonText}>Guardar</Text>
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
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
    },
    backButton: {
        padding: 8,
    },
    editButton: {
        padding: 8,
    },
    scrollContainer: {
        flex: 1,
    },
    coverSection: {
        height: 300,
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
        height: '60%',
    },
    coverInfo: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    exposeTitle: {
        fontSize: 34,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: -0.8,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    exposeYear: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 12,
        opacity: 0.9,
    },
    coverStats: {
        flexDirection: 'row',
        gap: 16,
    },
    coverStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    coverStatText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    progressSection: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    progressPercentage: {
        fontSize: 15,
        fontWeight: '700',
        color: '#007AFF',
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E5E7',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    monthsSection: {
        paddingHorizontal: 20,
        paddingVertical: 24,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '600',
        color: '#1D1D1F',
        marginBottom: 16,
        letterSpacing: -0.4,
    },
    monthsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    monthCard: {
        width: MONTH_CARD_SIZE,
        height: MONTH_CARD_SIZE,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#F2F2F7',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    monthImage: {
        width: '100%',
        height: '100%',
    },
    monthGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
    },
    monthInfo: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        right: 8,
    },
    monthName: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    monthPhotoCount: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    photoCountText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    emptyMonthCard: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
        borderWidth: 2,
        borderColor: '#E5E5E7',
        borderStyle: 'dashed',
        borderRadius: 16,
        padding: 8,
    },
    emptyMonthText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8E8E93',
        marginTop: 6,
        textAlign: 'center',
    },
    emptyMonthSubtext: {
        fontSize: 9,
        color: '#C7C7CC',
        marginTop: 2,
        textAlign: 'center',
    },
    actionsSection: {
        paddingHorizontal: 20,
        paddingVertical: 24,
        gap: 12,
        marginBottom: 40,
    },
    wrapButton: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#007AFF',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    wrapButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 8,
    },
    wrapButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#007AFF',
        gap: 8,
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },

    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 34,
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
        marginBottom: 24,
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
    privacyOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    privacyOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E5E5E7',
        gap: 8,
    },
    privacyOptionActive: {
        borderColor: '#007AFF',
        backgroundColor: 'rgba(0, 122, 255, 0.05)',
    },
    privacyOptionText: {
        fontSize: 15,
        fontWeight: '500',
        color: '#8E8E93',
    },
    privacyOptionTextActive: {
        color: '#007AFF',
        fontWeight: '600',
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
    saveButtonModal: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ExposeDetail;

