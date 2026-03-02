import React, { useState, useEffect, forwardRef } from 'react';
import { useUser } from "../../context/useUser";
import * as Location from 'expo-location';
import { View, StyleSheet, Image, Text, TextInput, TouchableOpacity, FlatList, Alert, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { city } from '../../services/mapsService';
import Maps from './Maps'
import Loader from '../Utils/Loader';
import kylot from '../../../assets/logoKylot.png'

const MapContainer = forwardRef((props, ref) => {
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
            // Usando OpenStreetMap Nominatim API con headers apropiados
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'User-Agent': 'YourAppName/1.0'
                    }
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (parseError) {
                // JSON Parse Error handled silently
                throw new Error('Invalid JSON response');
            }
            
            const cities = data.map(item => ({
                id: item.place_id,
                name: item.display_name,
                latitude: parseFloat(item.lat),
                longitude: parseFloat(item.lon),
                city: item.address?.city || item.address?.town || item.address?.village || item.name,
                country: item.address?.country || ''
            }));

            setSearchResults(cities);
            setShowResults(cities.length > 0);
        } catch (error) {
            
        } finally {
            setSearching(false);
        }
    };

    // Función para seleccionar una ciudad de los resultados
    const selectCity = (selectedCity) => {
        const newCoords = {
            latitude: selectedCity.latitude,
            longitude: selectedCity.longitude
        };
        
        setCoord(newCoords);
        setCiudad(selectedCity.city);
        setPais(selectedCity.country);
        setSearchQuery(selectedCity.city);
        setShowResults(false);
        setSearchResults([]);
        props.func?.(newCoords)
        
        // Mover el mapa a la nueva ubicación
        if (ref?.current) {
            ref.current.animateToRegion({
                latitude: selectedCity.latitude,
                longitude: selectedCity.longitude,
                latitudeDelta: 0.050,
                longitudeDelta: 0.050
            }, 1000);
        }
    };

    // Función para obtener ubicación actual
    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync()

        if (status !== 'granted') {
            props.setError(true);
            props.setErrorMessage(screenTexts.PermissionError);
            return
        }
        else {
            let location = await Location.getCurrentPositionAsync({})
            const current = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            }
            setCoord(current)
            setCargando(true)
            handleCity(current)
            props.func?.(current)
            props.setLoading?.(false)
        }
    }

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
            })
            props.setLoading?.(false);
        } else {
            // Si no, pedir permiso y obtener la ubicación actual
            getLocationPermission();
        }
    }, []);

    // Función para cerrar la lista de resultados
    const closeSearchResults = () => {
        setShowResults(false);
        setSearchResults([]);
    };

    // Efecto para buscar ciudades cuando cambia la query
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery && props.type === 'Add') {
                searchCities(searchQuery);
            }
        }, 500); // Debounce de 500ms

        return () => clearTimeout(timeoutId);
    }, [searchQuery, props.type]);

    const renderSearchResult = ({ item }) => (
        <TouchableOpacity
            style={styles.searchResultItem}
            onPress={() => selectCity(item)}
        >
            <Text style={styles.searchResultText} numberOfLines={2}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <TouchableWithoutFeedback onPress={closeSearchResults}>
            <View style={styles.containerPrincipal}>
                {/* Buscador de ciudades - solo para tipo 'Add', fuera del mapa */}
                {props.type === 'Add' && (
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={screenTexts.SearcherPlaceHolder}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            autoCorrect={false}
                            autoCapitalize="words"
                            onFocus={() => {
                                if (searchResults.length > 0) {
                                    setShowResults(true);
                                }
                            }}
                        />
                        {searching && (
                            <View style={styles.searchingIndicator}>
                                <Text style={styles.searchingText}>{screenTexts.Searching}</Text>
                            </View>
                        )}
                        {showResults && (
                            <View style={styles.searchResultsContainer}>
                                <FlatList
                                    data={searchResults}
                                    renderItem={renderSearchResult}
                                    keyExtractor={(item) => item.id.toString()}
                                    style={styles.searchResultsList}
                                    keyboardShouldPersistTaps="handled"
                                />
                            </View>
                        )}
                    </View>
                )}

                <TouchableWithoutFeedback>
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
                </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    );
});

const styles = StyleSheet.create({
    containerPrincipal: {
        width: '100%',
    },
    mapaContainer: {
        borderWidth: 1,
        borderColor: '#f0f0f0',
        borderRadius: 15,
        width: '100%',
        height: 450,
        alignSelf: 'center',
        flexDirection: 'column',
    },
    kylotContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        height: 50,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    searchContainer: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginBottom: 10,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#f0f0f0',
        position: 'relative',
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    searchingIndicator: {
        position: 'absolute',
        right: 25,
        top: 20,
    },
    searchingText: {
        fontSize: 12,
        color: '#666',
    },
    searchResultsContainer: {
        position: 'absolute',
        top: 60,
        left: 15,
        right: 15,
        backgroundColor: 'white',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        maxHeight: 200,
        zIndex: 1001,
    },
    searchResultsList: {
        maxHeight: 200,
    },
    searchResultItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    searchResultText: {
        fontSize: 14,
        color: '#333',
    },
    gradient: {
        height: 40,
        borderBottomRightRadius: 13,
        borderBottomLeftRadius: 13,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ciudad: {
        color: 'white',
        fontSize: 15
    },
});

export default MapContainer;