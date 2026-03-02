import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../../../context/useUser';
import BlockedFuncionality from '../../../components/Utils/BlockedFuncionality';

const Pasaporte = () => {
    const { texts } = useUser();
    const screenTexts = texts?.pages?.WalletPages?.Experiencias?.Pasaporte;

    console.log('Pasaporte component loaded');
    console.log('screenTexts:', screenTexts);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.titleSection}>
                    <Text style={styles.title}>
                        {screenTexts?.Title || 'Pasaporte'}
                    </Text>
                    <Text style={styles.subtitle}>
                        {screenTexts?.Subtitle || 'Descubre tu colección de lugares visitados'}
                    </Text>
                </View>
            </View>
            
            <View style={styles.content}>
                <View style={styles.lockContainer}>
                    {/* Área bloqueada con candado */}
                    <BlockedFuncionality />
                </View>
            </View>
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
    },
    content: {
        flex: 1,
    },
    lockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Pasaporte;
