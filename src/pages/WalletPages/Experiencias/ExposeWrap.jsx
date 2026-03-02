import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, Share, Alert, Animated } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useUser } from '../../../context/useUser';
import Icon from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

const ExposeWrap = () => {
    const { texts } = useUser();
    const navigate = useNavigation();
    const route = useRoute();
    const { exposeId } = route.params;
    const viewShotRef = useRef();

    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.ExposeWrap || {
        Title: 'Tu Wrap 2025',
        SaveButton: 'Guardar',
        ShareButton: 'Compartir',
        Photos: 'Fotos',
        Months: 'Meses completados',
        TopMonth: 'Mes con más fotos'
    };

    const [isCapturing, setIsCapturing] = useState(false);

    // Datos de ejemplo - vendrán de la API
    const wrapData = {
        year: 2025,
        title: 'Mi 2025',
        totalPhotos: 156,
        completedMonths: 9,
        topMonth: { name: 'Julio', photos: 28 },
        monthlyPhotos: [
            { name: 'Ene', count: 12 },
            { name: 'Feb', count: 15 },
            { name: 'Mar', count: 18 },
            { name: 'Abr', count: 14 },
            { name: 'May', count: 20 },
            { name: 'Jun', count: 16 },
            { name: 'Jul', count: 28 },
            { name: 'Ago', count: 19 },
            { name: 'Sep', count: 14 },
            { name: 'Oct', count: 0 },
            { name: 'Nov', count: 0 },
            { name: 'Dic', count: 0 },
        ],
        highlights: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=400&fit=crop',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop',
        ]
    };

    const handleSave = async () => {
        try {
            setIsCapturing(true);
            const { status } = await MediaLibrary.requestPermissionsAsync();
            
            if (status !== 'granted') {
                Alert.alert('Permisos necesarios', 'Necesitamos permisos para guardar la imagen');
                setIsCapturing(false);
                return;
            }

            const uri = await viewShotRef.current.capture();
            await MediaLibrary.saveToLibraryAsync(uri);
            
            Alert.alert('¡Éxito!', 'Tu Wrap ha sido guardado en la galería');
            setIsCapturing(false);
        } catch (error) {
            console.error('Error saving wrap:', error);
            Alert.alert('Error', 'No se pudo guardar el Wrap');
            setIsCapturing(false);
        }
    };

    const handleShare = async () => {
        try {
            setIsCapturing(true);
            const uri = await viewShotRef.current.capture();
            
            await Share.share({
                message: `Mi año ${wrapData.year} en Expose - ${wrapData.totalPhotos} momentos capturados`,
                url: uri,
            });
            setIsCapturing(false);
        } catch (error) {
            console.error('Error sharing wrap:', error);
            setIsCapturing(false);
        }
    };

    const maxPhotos = Math.max(...wrapData.monthlyPhotos.map(m => m.count));

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={styles.backButton}>
                    <View style={styles.backIconContainer}>
                        <Icon name="chevron-back" size={24} color="#1D1D1F" />
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tu {wrapData.year}</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView 
                style={styles.scrollContainer} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Wrap Content */}
                <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1.0 }}>
                    <View style={styles.wrapContainer}>
                        {/* Hero Section - Apple Style */}
                        <LinearGradient
                            colors={['#FFFFFF', '#F5F5F7']}
                            style={styles.heroSection}
                        >
                            <View style={styles.yearBadge}>
                                <Text style={styles.yearBadgeText}>{wrapData.year}</Text>
                            </View>
                            
                            <Text style={styles.heroTitle}>Tu año fue</Text>
                            <Text style={styles.heroHighlight}>extraordinario</Text>
                            
                            <View style={styles.heroStats}>
                                <View style={styles.heroStatItem}>
                                    <Text style={styles.heroStatNumber}>{wrapData.totalPhotos}</Text>
                                    <Text style={styles.heroStatLabel}>momentos</Text>
                                </View>
                                <View style={styles.heroStatDivider} />
                                <View style={styles.heroStatItem}>
                                    <Text style={styles.heroStatNumber}>{wrapData.completedMonths}</Text>
                                    <Text style={styles.heroStatLabel}>meses activos</Text>
                                </View>
                            </View>
                        </LinearGradient>

                        {/* Top Month Section - Duolingo Style */}
                        <View style={styles.topMonthSection}>
                            <LinearGradient
                                colors={['#58CC02', '#46A302']}
                                style={styles.topMonthGradient}
                            >
                                <View style={styles.topMonthHeader}>
                                    <View style={styles.trophyContainer}>
                                        <Icon name="trophy" size={40} color="#FFD700" />
                                        <View style={styles.trophyGlow} />
                                    </View>
                                    <Text style={styles.topMonthTitle}>Tu mes estrella</Text>
                                </View>
                                
                                <View style={styles.topMonthContent}>
                                    <Text style={styles.topMonthName}>{wrapData.topMonth.name}</Text>
                                    <View style={styles.topMonthPhotosBadge}>
                                        <Icon name="camera" size={16} color="#FFFFFF" />
                                        <Text style={styles.topMonthPhotosText}>
                                            {wrapData.topMonth.photos} fotos
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.celebrationEmojis}>
                                    <Text style={styles.celebrationEmoji}>✨</Text>
                                    <Text style={styles.celebrationEmoji}>🎉</Text>
                                    <Text style={styles.celebrationEmoji}>🌟</Text>
                                </View>
                            </LinearGradient>
                        </View>

                        {/* Monthly Activity - BBVA Style */}
                        <View style={styles.monthlySection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Tu actividad mensual</Text>
                                <Text style={styles.sectionSubtitle}>Recuerdos capturados</Text>
                            </View>

                            <View style={styles.chartContainer}>
                                <View style={styles.chartGrid}>
                                    {[...Array(5)].map((_, i) => (
                                        <View key={i} style={styles.gridLine} />
                                    ))}
                                </View>

                                <View style={styles.chartBars}>
                                    {wrapData.monthlyPhotos.map((month, index) => {
                                        const barHeight = maxPhotos > 0 ? (month.count / maxPhotos) * 100 : 0;
                                        const isTopMonth = month.name === 'Jul';
                                        
                                        return (
                                            <View key={index} style={styles.chartBarContainer}>
                                                <View style={styles.barWrapper}>
                                                    {month.count > 0 && (
                                                        <View style={styles.barValue}>
                                                            <Text style={styles.barValueText}>{month.count}</Text>
                                                        </View>
                                                    )}
                                                    <LinearGradient
                                                        colors={
                                                            isTopMonth 
                                                                ? ['#FFD700', '#FFA500']
                                                                : month.count > 0 
                                                                    ? ['#007AFF', '#005BBB']
                                                                    : ['#E5E5EA', '#E5E5EA']
                                                        }
                                                        style={[
                                                            styles.chartBar,
                                                            { height: `${barHeight}%` }
                                                        ]}
                                                    >
                                                        {isTopMonth && (
                                                            <Icon name="star" size={10} color="#FFFFFF" style={styles.barStar} />
                                                        )}
                                                    </LinearGradient>
                                                </View>
                                                <Text style={[
                                                    styles.monthLabel,
                                                    isTopMonth && styles.monthLabelActive
                                                ]}>
                                                    {month.name}
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Stats Cards - BBVA Style */}
                            <View style={styles.statsCards}>
                                <View style={styles.statCard}>
                                    <LinearGradient
                                        colors={['#072146', '#004481']}
                                        style={styles.statCardGradient}
                                    >
                                        <View style={styles.statCardIcon}>
                                            <Icon name="calendar" size={24} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.statCardValue}>
                                            {(wrapData.totalPhotos / wrapData.completedMonths).toFixed(1)}
                                        </Text>
                                        <Text style={styles.statCardLabel}>fotos/mes</Text>
                                    </LinearGradient>
                                </View>

                                <View style={styles.statCard}>
                                    <LinearGradient
                                        colors={['#004481', '#1464A5']}
                                        style={styles.statCardGradient}
                                    >
                                        <View style={styles.statCardIcon}>
                                            <Icon name="trending-up" size={24} color="#FFFFFF" />
                                        </View>
                                        <Text style={styles.statCardValue}>
                                            {Math.round((wrapData.completedMonths / 12) * 100)}%
                                        </Text>
                                        <Text style={styles.statCardLabel}>completado</Text>
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>

                        {/* Highlights Grid - Apple Style */}
                        <View style={styles.highlightsSection}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Tus mejores momentos</Text>
                                <Text style={styles.sectionSubtitle}>Los recuerdos que marcaron tu año</Text>
                            </View>

                            <View style={styles.highlightsGrid}>
                                {wrapData.highlights.map((photo, index) => (
                                    <View key={index} style={styles.highlightItem}>
                                        <View style={styles.highlightImageContainer}>
                                            <Image 
                                                source={{ uri: photo }} 
                                                style={styles.highlightImage} 
                                                resizeMode="cover" 
                                            />
                                            <LinearGradient
                                                colors={['transparent', 'rgba(0,0,0,0.3)']}
                                                style={styles.highlightGradient}
                                            />
                                        </View>
                                        <View style={styles.highlightNumber}>
                                            <Text style={styles.highlightNumberText}>{index + 1}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Footer - Minimalist */}
                        <View style={styles.wrapFooter}>
                            <View style={styles.footerLogo}>
                                <Text style={styles.footerBrand}>Kylot</Text>
                                <Text style={styles.footerDot}>·</Text>
                                <Text style={styles.footerProduct}>Expose</Text>
                            </View>
                            <Text style={styles.footerYear}>{wrapData.year}</Text>
                            <View style={styles.footerLine} />
                        </View>
                    </View>
                </ViewShot>
            </ScrollView>

            {/* Action Buttons - Apple Style */}
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={handleSave}
                    disabled={isCapturing}
                    activeOpacity={0.7}
                >
                    <View style={styles.buttonContent}>
                        <Icon name="download-outline" size={20} color="#007AFF" />
                        <Text style={styles.secondaryButtonText}>{screenTexts.SaveButton}</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.primaryButton}
                    onPress={handleShare}
                    disabled={isCapturing}
                    activeOpacity={0.7}
                >
                    <LinearGradient
                        colors={['#007AFF', '#0051D5']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.primaryButtonGradient}
                    >
                        <Icon name="share-outline" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonText}>{screenTexts.ShareButton}</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E5EA',
    },
    backButton: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F7',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1D1D1F',
        letterSpacing: -0.4,
    },
    placeholder: {
        width: 44,
    },
    scrollContainer: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    wrapContainer: {
        backgroundColor: '#FFFFFF',
    },

    // Hero Section - Apple Style
    heroSection: {
        paddingHorizontal: 32,
        paddingTop: 48,
        paddingBottom: 56,
        alignItems: 'center',
    },
    yearBadge: {
        backgroundColor: '#1D1D1F',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 24,
    },
    yearBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: 1.2,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '400',
        color: '#1D1D1F',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    heroHighlight: {
        fontSize: 56,
        fontWeight: '700',
        color: '#007AFF',
        marginBottom: 40,
        letterSpacing: -2,
    },
    heroStats: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingVertical: 24,
        paddingHorizontal: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
    },
    heroStatItem: {
        alignItems: 'center',
    },
    heroStatNumber: {
        fontSize: 48,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 4,
        letterSpacing: -1.5,
    },
    heroStatLabel: {
        fontSize: 13,
        fontWeight: '500',
        color: '#8E8E93',
        letterSpacing: -0.1,
    },
    heroStatDivider: {
        width: 1,
        height: 50,
        backgroundColor: '#E5E5EA',
        marginHorizontal: 32,
    },

    // Top Month Section - Duolingo Style
    topMonthSection: {
        paddingHorizontal: 20,
        paddingVertical: 32,
    },
    topMonthGradient: {
        borderRadius: 24,
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
    },
    topMonthHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    trophyContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    trophyGlow: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFD700',
        borderRadius: 40,
        opacity: 0.3,
        transform: [{ scale: 1.5 }],
    },
    topMonthTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
    topMonthContent: {
        alignItems: 'center',
        marginBottom: 16,
    },
    topMonthName: {
        fontSize: 42,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 12,
        letterSpacing: -1,
    },
    topMonthPhotosBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    topMonthPhotosText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    celebrationEmojis: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    celebrationEmoji: {
        fontSize: 32,
    },

    // Monthly Activity - BBVA Style
    monthlySection: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        backgroundColor: '#F5F5F7',
    },
    sectionHeader: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1D1D1F',
        marginBottom: 4,
        letterSpacing: -0.6,
    },
    sectionSubtitle: {
        fontSize: 15,
        fontWeight: '400',
        color: '#8E8E93',
        letterSpacing: -0.2,
    },
    chartContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 4,
    },
    chartGrid: {
        position: 'absolute',
        top: 24,
        left: 24,
        right: 24,
        bottom: 60,
        justifyContent: 'space-between',
    },
    gridLine: {
        height: 1,
        backgroundColor: '#F5F5F7',
    },
    chartBars: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 180,
        paddingTop: 20,
    },
    chartBarContainer: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    barWrapper: {
        flex: 1,
        width: '70%',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    barValue: {
        marginBottom: 6,
    },
    barValueText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#1D1D1F',
    },
    chartBar: {
        width: '100%',
        borderRadius: 6,
        minHeight: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    barStar: {
        marginTop: 4,
    },
    monthLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#8E8E93',
        marginTop: 8,
    },
    monthLabelActive: {
        color: '#FFA500',
        fontWeight: '700',
    },
    statsCards: {
        flexDirection: 'row',
        gap: 12,
    },
    statCard: {
        flex: 1,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    statCardGradient: {
        padding: 20,
        alignItems: 'center',
    },
    statCardIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statCardValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
        letterSpacing: -1,
    },
    statCardLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255, 255, 255, 0.8)',
        letterSpacing: -0.1,
    },

    // Highlights Section - Apple Style
    highlightsSection: {
        paddingHorizontal: 20,
        paddingVertical: 32,
        backgroundColor: '#FFFFFF',
    },
    highlightsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    highlightItem: {
        width: (width - 52) / 2,
        height: (width - 52) / 2 * 1.3,
        position: 'relative',
    },
    highlightImageContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#F5F5F7',
    },
    highlightImage: {
        width: '100%',
        height: '100%',
    },
    highlightGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
    },
    highlightNumber: {
        position: 'absolute',
        top: 12,
        left: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    highlightNumberText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // Footer
    wrapFooter: {
        paddingHorizontal: 32,
        paddingVertical: 40,
        alignItems: 'center',
        backgroundColor: '#FAFAFA',
    },
    footerLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 8,
    },
    footerBrand: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1D1D1F',
        letterSpacing: 0.5,
    },
    footerDot: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8E8E93',
    },
    footerProduct: {
        fontSize: 16,
        fontWeight: '400',
        color: '#8E8E93',
        letterSpacing: 0.3,
    },
    footerYear: {
        fontSize: 13,
        fontWeight: '500',
        color: '#C7C7CC',
        marginBottom: 12,
    },
    footerLine: {
        width: 40,
        height: 3,
        backgroundColor: '#007AFF',
        borderRadius: 2,
    },

    // Action Buttons
    actionsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 12,
        paddingBottom: 34,
        backgroundColor: '#FFFFFF',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E5EA',
        gap: 12,
    },
    secondaryButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        letterSpacing: -0.3,
    },
    primaryButton: {
        flex: 1,
        height: 50,
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    primaryButtonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        letterSpacing: -0.3,
    },
});

export default ExposeWrap;
