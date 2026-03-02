import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, TouchableOpacity } from 'react-native';
import { useUser } from "../../../context/useUser";
import fondo from '../../../../assets/fondo_experiencia.png'
import candadoBloqueado from '../../../../assets/candadoBloqueado.png'
import candadoDesloqueado from '../../../../assets/candadoDesloqueado.png'


const Experiences = (props) => {
  const { texts } = useUser();
  const screenTexts = texts.components.Blocks.Experiences.Experiences
    const [name, setName] = useState('');
    const [friendsCount, setFriendsCount] = useState(0);
    const [view, setView] = useState('Private');

    
    useEffect(() => {
        
        setName(props.name)
        setView(props.view)
        setFriendsCount(props.save)
        
    },[])
  

  return (
    <TouchableOpacity style={styles.touchableContainer} onPress={props.onPress} activeOpacity={0.7}>
        <ImageBackground style={styles.container} source={props.photo ? { uri: props.photo } : fondo}>
            <View style={styles.overlay} />
            <View style={styles.content}>
                <View style={styles.headerRow}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {name}
                        </Text>
                        {props.subText && (
                            <Text style={styles.subtitle} numberOfLines={2}>
                                {props.subText}
                            </Text>
                        )}
                    </View>
                    <View style={styles.privateContainer}>
                        <Image style={styles.lockIcon} source={view ? candadoDesloqueado : candadoBloqueado}/>
                    </View>
                </View>
                
                {friendsCount >= 0 && (
                    <View style={styles.statsContainer}>
                        <View style={styles.statsRow}>
                            <View style={styles.userAvatarsContainer}>
                                {/* Ejemplo de avatares de usuarios que guardaron la lista */}
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face' }} 
                                    style={styles.userAvatar} 
                                />
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }} 
                                    style={styles.userAvatar} 
                                />
                                <Image 
                                    source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face' }} 
                                    style={styles.userAvatar} 
                                />
                                {friendsCount > 3 && (
                                    <View style={styles.moreUsersAvatar}>
                                        <Text style={styles.moreUsersText}>+{friendsCount - 3}</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.statsText}>
                                {friendsCount} {screenTexts.FriendsShare}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    touchableContainer: {
        marginHorizontal: 20,
        marginTop: 20,
    },
    container: {
        borderRadius: 16,
        height: 140,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: 16,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 18,
        justifyContent: 'space-between',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    titleContainer: {
        flex: 1,
        marginRight: 12,
        paddingTop: 4,
    },
    name: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        marginTop: 16,
        lineHeight: 26,
        textShadowColor: 'rgba(0, 0, 0, 0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
        letterSpacing: -0.2,
    },
    subtitle: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        letterSpacing: -0.1,
        marginBottom: 2,
    },
    privateContainer: {
        backgroundColor: '#FFFFFF',
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    lockIcon: {
        height: 16,
        width: 12,
        tintColor: '#8E8E93',
    },
    statsContainer: {
        marginTop: 6,
        paddingTop: 2,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatarsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginLeft: -4,
        backgroundColor: '#F2F2F7',
    },
    moreUsersAvatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        marginLeft: -4,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreUsersText: {
        fontSize: 8,
        fontWeight: '600',
        color: '#1D1D1F',
        textAlign: 'center',
    },
    statsText: {
        fontSize: 11,
        color: 'rgba(255, 255, 255, 0.85)',
        fontWeight: '500',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        letterSpacing: -0.1,
        marginLeft: 2,
    },
});

export default Experiences;