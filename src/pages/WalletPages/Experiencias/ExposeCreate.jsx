import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../../context/useUser';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';

const ExposeCreate = () => {
    const { texts } = useUser();
    const navigate = useNavigation();

    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.ExposeCreate || {
        Title: 'Crear EXPOSE',
        TitleLabel: 'Título',
        TitlePlaceholder: 'Ej: Mi 2025',
        YearLabel: 'Año',
        PrivacyLabel: 'Privacidad',
        PublicOption: 'Público',
        PrivateOption: 'Privado',
        CoverLabel: 'Foto de portada',
        SelectCover: 'Seleccionar portada',
        CreateButton: 'Crear EXPOSE',
        CancelButton: 'Cancelar'
    };

    const [title, setTitle] = useState('');
    const [year, setYear] = useState(new Date().getFullYear().toString());
    const [isPublic, setIsPublic] = useState(true);
    const [coverPhoto, setCoverPhoto] = useState(null);

    const handleSelectCover = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4],
                quality: 0.8,
            });

            if (!result.canceled) {
                setCoverPhoto(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking cover image:', error);
        }
    };

    const handleCreate = () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Por favor ingresa un título');
            return;
        }

        if (!year.trim() || isNaN(year) || year.length !== 4) {
            Alert.alert('Error', 'Por favor ingresa un año válido');
            return;
        }

        // Aquí iría la llamada a la API para crear el EXPOSE
        console.log('Creating EXPOSE:', { title, year, isPublic, coverPhoto });
        
        // Navegar de vuelta
        navigate.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={styles.backButton}>
                    <Icon name="close" size={28} color="#1D1D1F" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                {/* Cover Photo Section */}
                <View style={styles.coverSection}>
                    <TouchableOpacity
                        style={styles.coverPhotoContainer}
                        onPress={handleSelectCover}
                        activeOpacity={0.8}
                    >
                        {coverPhoto ? (
                            <>
                                <Image source={{ uri: coverPhoto }} style={styles.coverPhoto} resizeMode="cover" />
                                <View style={styles.coverOverlay}>
                                    <Icon name="camera" size={32} color="#FFFFFF" />
                                    <Text style={styles.coverOverlayText}>Cambiar portada</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.coverPlaceholder}>
                                <Icon name="image-outline" size={60} color="#D1D1D6" />
                                <Text style={styles.coverPlaceholderText}>{screenTexts.SelectCover}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Title Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{screenTexts.TitleLabel}</Text>
                        <TextInput
                            style={styles.textInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder={screenTexts.TitlePlaceholder}
                            placeholderTextColor="#8E8E93"
                            maxLength={50}
                        />
                    </View>

                    {/* Year Input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{screenTexts.YearLabel}</Text>
                        <TextInput
                            style={styles.textInput}
                            value={year}
                            onChangeText={setYear}
                            placeholder="2025"
                            placeholderTextColor="#8E8E93"
                            keyboardType="number-pad"
                            maxLength={4}
                        />
                    </View>

                    {/* Privacy Options */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>{screenTexts.PrivacyLabel}</Text>
                        <View style={styles.privacyOptions}>
                            <TouchableOpacity
                                style={[styles.privacyOption, isPublic && styles.privacyOptionActive]}
                                onPress={() => setIsPublic(true)}
                            >
                                <Icon name="globe-outline" size={20} color={isPublic ? "#007AFF" : "#8E8E93"} />
                                <Text style={[styles.privacyOptionText, isPublic && styles.privacyOptionTextActive]}>
                                    {screenTexts.PublicOption}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.privacyOption, !isPublic && styles.privacyOptionActive]}
                                onPress={() => setIsPublic(false)}
                            >
                                <Icon name="lock-closed-outline" size={20} color={!isPublic ? "#007AFF" : "#8E8E93"} />
                                <Text style={[styles.privacyOptionText, !isPublic && styles.privacyOptionTextActive]}>
                                    {screenTexts.PrivateOption}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Info Section */}
                    <View style={styles.infoSection}>
                        <Icon name="information-circle-outline" size={24} color="#007AFF" />
                        <Text style={styles.infoText}>
                            Crea tu álbum del año y rellena los momentos de cada mes. Al final podrás generar un wrap con todos tus recuerdos.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigate.goBack()}
                >
                    <Text style={styles.cancelButtonText}>{screenTexts.CancelButton}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreate}
                >
                    <LinearGradient
                        colors={['#007AFF', '#0056CC']}
                        style={styles.createButtonGradient}
                    >
                        <Text style={styles.createButtonText}>{screenTexts.CreateButton}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
        fontSize: 18,
        fontWeight: '600',
        color: '#1D1D1F',
    },
    placeholder: {
        width: 44,
    },
    scrollContainer: {
        flex: 1,
    },
    coverSection: {
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 32,
        backgroundColor: '#FAFAFA',
    },
    coverPhotoContainer: {
        width: '100%',
        height: 400,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F2F2F7',
        borderWidth: 2,
        borderColor: '#E5E5E7',
        borderStyle: 'dashed',
    },
    coverPhoto: {
        width: '100%',
        height: '100%',
    },
    coverOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverOverlayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginTop: 8,
    },
    coverPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverPlaceholderText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#8E8E93',
        marginTop: 12,
    },
    form: {
        paddingHorizontal: 20,
        paddingVertical: 24,
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
        paddingVertical: 14,
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
    infoSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 122, 255, 0.05)',
        padding: 16,
        borderRadius: 12,
        marginTop: 8,
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '400',
        color: '#1D1D1F',
        lineHeight: 20,
    },
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: 34,
        backgroundColor: '#FFFFFF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#EAEAEA',
        gap: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
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
    createButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    createButtonGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    createButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

export default ExposeCreate;

