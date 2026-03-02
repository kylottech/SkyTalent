import React, { useState, useEffect, forwardRef } from 'react';
import { useUser } from "../../context/useUser";
import * as Location from 'expo-location';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { city } from '../../services/mapsService';
import Maps from './Maps'
import Loader from '../Utils/Loader';
import kylot from '../../../assets/logoKylot.png'

const MapContainerModal = forwardRef((props, ref) => {
    const { logout, texts } = useUser()
    const screenTexts = texts.components.Maps.MapContainer
    const [ciudad, setCiudad] = useState('');
    const [pais, setPais] = useState('');
    const [coord, setCoord] = useState({})
    const [cargando, setCargando] = useState(false)
    
    // Estados para el buscador de ciudades
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searching, setSearching] = useState(false);

    const handleCity = async (current) => {
        try {
            city(current, logout)
                .then((res) => {
                    setCiudad(res.city)
                    setPais(res.country)
                })
                .catch((error) => {
                    props.setError(true);
                    props.setErrorMessage(error.message);
                });
        } catch (error) {
            props.setError(true);
            props.setErrorMessage(error.message);
        }
    }

    // Función para buscar ciudades usando una API de geocodificación
    const searchCities = async (query) => {
        if (query.length < 3) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setSearching(true);
        try {
            // Usar una API de geocodificación gratuita
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
            );
            const data = await response.json();
            
            const cities = data.map(item => ({
                name: item.display_name.split(',')[0],
                country: item.address?.country || '',
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon)
            }));
            
            setSearchResults(cities);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching cities:', error);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    const selectCity = (city) => {
        const newCoords = {
            latitude: city.lat,
            longitude: city.lon
        };
        setCoord(newCoords);
        setCargando(true);
        handleCity(newCoords);
        props.func?.(newCoords);
        setSearchQuery('');
        setShowResults(false);
    };

    const closeSearchResults = () => {
        setShowResults(false);
    };

    useEffect(() => {
        if (props.type === 'Add' && props.coords && props.coords.latitude && props.coords.longitude) {
            // Si recibe coords por props cuando es Add, usar esa coord
            setCoord({
                latitude: props.coords.latitude,
                longitude: props.coords.longitude,
            });
            setCargando(true);
            handleCity({
                latitude: props.coords.latitude,
                longitude: props.coords.longitude,
            });
            props.func?.({
                latitude: props.coords.latitude,
                longitude: props.coords.longitude,
            });
        } else {
            // Obtener ubicación actual
            Location.getCurrentPositionAsync({})
                .then((location) => {
                    const current = {
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude
                    }
                    setCoord(current)
                    setCargando(true)
                    handleCity(current)
                    props.func?.(current)
                    props.setLoading?.(false)
                })
                .catch((error) => {
                    console.error('Error getting location:', error);
                    // Usar Madrid como fallback
                    const madrid = {
                        latitude: 40.4168,
                        longitude: -3.7038
                    };
                    setCoord(madrid);
                    setCargando(true);
                    handleCity(madrid);
                    props.func?.(madrid);
                    props.setLoading?.(false);
                });
        }
    }, [props.coords, props.type]);

    return (
        <View style={styles.containerPrincipal}>
            {/* Buscador de ciudades */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar ciudad..."
                    value={searchQuery}
                    onChangeText={(text) => {
                        setSearchQuery(text);
                        searchCities(text);
                    }}
                    onFocus={() => {
                        if (searchQuery.length >= 3) {
                            setShowResults(true);
                        }
                    }}
                />
                
                {showResults && (
                    <View style={styles.searchResultsContainer}>
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item, index) => `${item.lat}-${item.lon}-${index}`}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.searchResultItem}
                                    onPress={() => selectCity(item)}
                                >
                                    <Text style={styles.searchResultText}>
                                        {item.name}, {item.country}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            style={styles.searchResultsList}
                            keyboardShouldPersistTaps="handled"
                        />
                    </View>
                )}
            </View>

            {/* Mapa */}
            <View style={styles.mapaContainer}>
                <View style={styles.kylotContainer}>
                    <Image source={kylot} style={{ width: 120, height: 40 }} />
                </View>

                {cargando ? (
                    <Maps
                        ref={ref}
                        origin={coord}
                        type={props.type}
                        func={props.func}
                        locations={props.locations}
                        onPress={props.onPress}
                    />
                ) : (
                    <Loader />
                )}

                <View>
                    <LinearGradient
                        colors={['#1D7CE4', '#004999']}
                        start={[0, 0]}
                        end={[1, 1]}
                        style={styles.gradient}
                    >
                        {cargando ? (
                            <Text style={styles.ciudad}>{ciudad + ', ' + pais}</Text>
                        ) : (
                            <></>
                        )}
                    </LinearGradient>
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    containerPrincipal: {
        width: '100%',
    },
    searchContainer: {
        marginBottom: 16,
        position: 'relative',
        zIndex: 10,
    },
    searchInput: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchResultsContainer: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 1000,
        maxHeight: 200,
    },
    searchResultsList: {
        maxHeight: 200,
    },
    searchResultItem: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    searchResultText: {
        fontSize: 16,
        color: '#1F2937',
    },
    mapaContainer: {
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 15,
        width: '100%',
        height: 300,
        alignSelf: 'center',
        flexDirection: 'column',
    },
    kylotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 8,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    gradient: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    ciudad: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MapContainerModal;
