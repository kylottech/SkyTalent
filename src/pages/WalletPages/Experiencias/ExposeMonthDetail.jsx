import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, TextInput, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../../context/useUser';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const IMAGE_SIZE = (width - 48) / 3;

const ExposeMonthDetail = () => {
    const { texts } = useUser();
    const navigate = useNavigation();
    const route = useRoute();
    const { exposeId, monthIndex, monthName, year } = route.params;

    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.ExposeMonthDetail || {
        Title: 'Momentos de ',
        AddPhotos: 'Añadir fotos',
        DeleteButton: 'Eliminar',
        SaveButton: 'Guardar',
        TitlePlaceholder: 'Título del mes (opcional)',
        EmptyTitle: 'No hay fotos',
        EmptySubtitle: 'Añade fotos para este mes'
    };

    const [photos, setPhotos] = useState([
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
    ]);
    const [monthTitle, setMonthTitle] = useState('Marzo mágico');
    const [selectedPhotos, setSelectedPhotos] = useState([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const handleAddPhotos = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
            });

            if (!result.canceled) {
                const newPhotos = result.assets.map(asset => asset.uri);
                setPhotos([...photos, ...newPhotos]);
            }
        } catch (error) {
            console.error('Error picking images:', error);
        }
    };

    const handlePhotoPress = (photoUri) => {
        if (isSelectionMode) {
            if (selectedPhotos.includes(photoUri)) {
                setSelectedPhotos(selectedPhotos.filter(uri => uri !== photoUri));
            } else {
                setSelectedPhotos([...selectedPhotos, photoUri]);
            }
        } else {
            // Abrir vista de foto completa
            navigate.navigate('PhotoViewer', { photos, initialIndex: photos.indexOf(photoUri) });
        }
    };

    const handleLongPress = (photoUri) => {
        setIsSelectionMode(true);
        setSelectedPhotos([photoUri]);
    };

    const handleDeleteSelected = () => {
        Alert.alert(
            'Eliminar fotos',
            `¿Quieres eliminar ${selectedPhotos.length} foto(s)?`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        setPhotos(photos.filter(photo => !selectedPhotos.includes(photo)));
                        setSelectedPhotos([]);
                        setIsSelectionMode(false);
                    }
                }
            ]
        );
    };

    const handleCancelSelection = () => {
        setIsSelectionMode(false);
        setSelectedPhotos([]);
    };

    const renderPhoto = ({ item: photoUri, index }) => {
        const isSelected = selectedPhotos.includes(photoUri);

        return (
            <TouchableOpacity
                style={[styles.photoItem, isSelected && styles.photoItemSelected]}
                onPress={() => handlePhotoPress(photoUri)}
                onLongPress={() => handleLongPress(photoUri)}
                activeOpacity={0.8}
            >
                <Image source={{ uri: photoUri }} style={styles.photoImage} resizeMode="cover" />
                {isSelectionMode && (
                    <View style={styles.selectionOverlay}>
                        <View style={[styles.selectionCheckbox, isSelected && styles.selectionCheckboxActive]}>
                            {isSelected && <Icon name="checkmark" size={16} color="#FFFFFF" />}
                        </View>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={styles.backButton}>
                    <Icon name="chevron-back" size={28} color="#1D1D1F" />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerTitleText}>{monthName} {year}</Text>
                    <Text style={styles.headerSubtitle}>{photos.length} foto(s)</Text>
                </View>
                {isSelectionMode ? (
                    <TouchableOpacity onPress={handleCancelSelection} style={styles.cancelButton}>
                        <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={handleAddPhotos} style={styles.addButton}>
                        <Icon name="add" size={28} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Month Title Input */}
            <View style={styles.titleSection}>
                <TextInput
                    style={styles.titleInput}
                    value={monthTitle}
                    onChangeText={setMonthTitle}
                    placeholder={screenTexts.TitlePlaceholder}
                    placeholderTextColor="#8E8E93"
                />
            </View>

            {/* Photos Grid */}
            {photos.length > 0 ? (
                <FlatList
                    data={photos}
                    renderItem={renderPhoto}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    numColumns={3}
                    contentContainerStyle={styles.photoGrid}
                    showsVerticalScrollIndicator={false}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Icon name="images-outline" size={80} color="#D1D1D6" />
                    <Text style={styles.emptyStateTitle}>{screenTexts.EmptyTitle}</Text>
                    <Text style={styles.emptyStateSubtitle}>{screenTexts.EmptySubtitle}</Text>
                    <TouchableOpacity style={styles.addPhotosButton} onPress={handleAddPhotos}>
                        <LinearGradient
                            colors={['#007AFF', '#0056CC']}
                            style={styles.addPhotosButtonGradient}
                        >
                            <Icon name="add" size={20} color="#FFFFFF" />
                            <Text style={styles.addPhotosButtonText}>{screenTexts.AddPhotos}</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            )}

            {/* Selection Actions */}
            {isSelectionMode && selectedPhotos.length > 0 && (
                <View style={styles.selectionActions}>
                    <Text style={styles.selectionCount}>
                        {selectedPhotos.length} seleccionada(s)
                    </Text>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteSelected}
                    >
                        <Icon name="trash-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.deleteButtonText}>{screenTexts.DeleteButton}</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    headerTitle: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitleText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    headerSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8E8E93',
        marginTop: 2,
    },
    addButton: {
        padding: 8,
    },
    cancelButton: {
        padding: 8,
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
    },
    titleSection: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FAFAFA',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
    },
    titleInput: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1D1F',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D1D1D6',
    },
    photoGrid: {
        padding: 4,
        paddingBottom: 100,
    },
    photoItem: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        margin: 4,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#F2F2F7',
    },
    photoItemSelected: {
        borderWidth: 3,
        borderColor: '#007AFF',
    },
    photoImage: {
        width: '100%',
        height: '100%',
    },
    selectionOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        padding: 8,
    },
    selectionCheckbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    selectionCheckboxActive: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyStateTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D1D1F',
        marginTop: 20,
        marginBottom: 8,
    },
    emptyStateSubtitle: {
        fontSize: 16,
        fontWeight: '400',
        color: '#8E8E93',
        textAlign: 'center',
        marginBottom: 32,
    },
    addPhotosButton: {
        borderRadius: 25,
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
    addPhotosButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        gap: 8,
    },
    addPhotosButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    selectionActions: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    selectionCount: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ff4757',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 20,
        gap: 6,
    },
    deleteButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ExposeMonthDetail;

