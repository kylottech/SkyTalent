import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { notification } from '../../services/notificationServices';
import kylot from '../../../assets/logoKylot.png';
import kylotBlanco from '../../../assets/logoKylot_blanco.png';
import back from '../../../assets/arrow_left.png';
import mapa from '../../../assets/mapaMenu.png';
import notificaciones from '../../../assets/iconoNotificaciones.png';
import corona from '../../../assets/CORONA_DORADA.png';
import menu from '../../../assets/menu.png';

const Top = (props) => {
    const { logout } = useUser();
    const [left, setLeft] = useState(false);
    const [leftType, setLeftType] = useState();
    const [leftRoute, setLeftRoute] = useState('');
    const [typeCenter, setTypeCenter] = useState('Photo');
    const [logoColor, setLogoColor] = useState();
    const [textCenter, setTextCenter] = useState('');
    const [right, setRight] = useState(false);
    const [rightType, setRightType] = useState();
    const [rightRoute, setRightRoute] = useState('');
    const [rightType2, setRightType2] = useState();
    const [rightRoute2, setRightRoute2] = useState('');
    const [kylets, setKylets] = useState('');
    const [hasNotification, setHasNotification] = useState(false);

    const navigate = useNavigation();

    const handleNotification = async () => {
        try {
            const response = await notification(logout);
            setHasNotification(response === true);
        } catch (error) {
            // Error al obtener notificaciones
        }
    };

    const handleNavigateToNotifications = () => {
        setHasNotification(false); // Oculta el punto rojo
        navigate.navigate(rightRoute2); // Navega a pantalla de notificaciones
    };

    useEffect(() => {
        let intervalId;

        if (props.right) {
            handleNotification(); // Llamada inmediata
            intervalId = setInterval(() => {
                handleNotification();
            }, 30000); // Cada 30s
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [props.right]);

    useEffect(() => {
        if (props.left) {
            if (props.leftType === 'Back') {
                setLeft(true);
                setLeftType(back);
            } else if (props.leftType === 'Map') {
                setLeft(true);
                setLeftType(mapa);
                setLeftRoute('GlobeScreen');
            }
        }

        if (props.typeCenter === 'Photo') {
            setTypeCenter('Photo');
            setLogoColor(props.logoColor === 'White' ? kylotBlanco : kylot);
        } else {
            setTextCenter(props.textCenter || 'Kylot');
            setTypeCenter(props.typeCenter);
        }

        if (props.right) {
            if (props.rightType === 'Kylets') {
                setRight(true);
                setRightType();
                setRightType2(notificaciones);
                setRightRoute('');
                setRightRoute2('Notificaciones');
            } else if (props.rightType === 'Profile') {
                setRight(true);
                setRightType(menu);
                setRightType2(notificaciones);
                setRightRoute('AjustesPerfil');
                setRightRoute2('Notificaciones');
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.left, props.leftType, props.typeCenter, props.logoColor, props.textCenter, props.right, props.rightType]);

    useEffect(() => {
        if (props.right && props.rightType === 'Kylets') {
            let formattedAmount;
            if (props.amount >= 1_000_000_000) {
                formattedAmount = (props.amount / 1_000_000_000).toFixed(1).replace('.0', '') + 'B';
            } else if (props.amount >= 1_000_000) {
                formattedAmount = (props.amount / 1_000_000).toFixed(1).replace('.0', '') + 'M';
            } else if (props.amount >= 10_000) {
                formattedAmount = (props.amount / 1_000).toFixed(1).replace('.0', '') + 'K';
            } else {
                formattedAmount = props.amount.toString();
            }

            setKylets(formattedAmount);
        }
    }, [props.right, props.rightType, props.amount]);

    return (
        <View style={styles.top}>
            {left &&
                <View style={styles.left}>
                    <TouchableOpacity style={styles.button2} onPress={() => {
                        if (props.leftType === 'Back') {
                            props.back ? props.back() : navigate.goBack();
                        } else if (props.leftType === 'Map' && leftRoute) {
                            navigate.navigate(leftRoute);
                        }
                    }}>
                        <Image source={leftType} style={styles.icono3} />
                    </TouchableOpacity>
                </View>
            }

            {typeCenter === 'Photo' &&
                <Image source={logoColor} style={styles.logo} />
            }

            {(typeCenter === 'Text' || typeCenter === 'TextWhite') &&
                <Text style={styles.text}>{textCenter}</Text>
            }

            {right &&
                <View style={props.rightType === 'Kylets' ? styles.right : styles.right2}>

                    {/* Ícono de notificaciones */}
                    <TouchableOpacity style={styles.button} onPress={handleNavigateToNotifications}>
                        <Image source={rightType2} style={styles.icono2} />
                        {hasNotification && <View style={styles.redDot} />}
                    </TouchableOpacity>

                    {/* Otro botón a la derecha */}
                    <TouchableOpacity style={styles.button}
                        disabled={props.rightType === 'Profile' && props.cargando === false}
                        onPress={() => {
                            if (props.rightType === 'Profile') {
                                navigate.navigate(rightRoute, {
                                    name: props.name,
                                    surname: props.surname,
                                    kylotId: props.kylotId,
                                    photo: props.photo,
                                    cargo: props.cargo,
                                    frase: props.frase,
                                    instagram: props.instagram,
                                    tikTok: props.tikTok,
                                    whatsapp: props.whatsapp,
                                    banner: props.banner,
                                    setName: props.setName,
                                    setSurname: props.setSurname,
                                    setKylotId: props.setKylotId,
                                    setPhoto: props.setPhoto,
                                    setCargo: props.setCargo,
                                    setFrase: props.setFrase,
                                    setInstagram: props.setInstagram,
                                    setTikTok: props.setTikTok,
                                    setWhatsapp: props.setWhatsapp,
                                    setBanner: props.setBanner,
                                });
                            } else if (props.rightType === 'Community') {
                                navigate.navigate(rightRoute);
                            }
                        }}>
                        {props.rightType === 'Kylets' ? (
                            <TouchableOpacity style={styles.kylets} onPress={() => navigate.navigate('Banco')}>
                                <Image source={corona} style={styles.corona} />
                                <Text style={styles.numero}>{kylets}</Text>
                            </TouchableOpacity>
                        ) : (
                            <Image source={rightType} style={styles.icono4} resizeMode="contain"/>
                        )}
                    </TouchableOpacity>
                </View>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    top: {
        flexDirection: 'row',
        marginTop: 35,
        height: 64,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        backgroundColor: 'white',
    },
    left: {
        position: 'absolute',
        left: 24,
        paddingTop: 10,
    },
    button: {
        width: 46,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button2: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
    },
    icono1: {
        width: '100%',
        height: '100%',
    },
    icono2: {
        width: 26,
        height: 26,
    },
    icono3: {
        width: 24,
        height: 24,
    },
    icono4: {
        width: 30,
        height: 24,
    },
    right: {
        position: 'absolute',
        right: 24,
        paddingTop: 10,
        marginLeft: 0,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    right2: {
        position: 'absolute',
        right: 24,
        paddingTop: 10,
        marginLeft: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    text: {
        alignSelf: 'center',
        fontSize: 18,
        fontWeight: '600',
        color: '#1A1A1A',
        letterSpacing: -0.3,
    },
    logo: {
        alignSelf: 'center',
        width: 110,
        height: 38,
    },
    kylets: {
        backgroundColor: 'white',
        minWidth: 72,
        height: 36,
        paddingHorizontal: 10,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        gap: 5,
    },
    corona: {
        width: 20,
        height: 20,
    },
    numero: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2A2A2A',
        letterSpacing: -0.2,
    },
    redDot: {
        position: 'absolute',
        top: 9,
        right: 10,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#1D7CE4',
        borderWidth: 1.5,
        borderColor: 'white',
        zIndex: 2,
    }
});

export default Top;
