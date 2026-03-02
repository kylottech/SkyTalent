import React, { useEffect, forwardRef, useState, memo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../context/useUser";
import { View, StyleSheet } from 'react-native';
import { myInfo } from '../../services/profileService'
import MapView, { Polyline } from 'react-native-maps';
import Market from './Market';
import Moment from './Moment';
import AddMarker from './AddMarker';

const Maps = forwardRef((props, ref) => {
    const navigation=useNavigation()
    const { locations, type, origin, onRegionChangeComplete, onPress, lines, func, moments, routes, polyPress, activities } = props;
    const { logout } = useUser();
    const [edad, setEdad] = useState(0);

    const propsMapaJovenes= [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f5f5"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "stylers": [
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#bdbdbd"
            }
          ]
        },
        {
          "featureType": "administrative.neighborhood",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ffffff"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#757575"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dadada"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#616161"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e5e5e5"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#eeeeee"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#c9c9c9"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9e9e9e"
            }
          ]
        }
      ]
    const propsMapaViejos= [
        {
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#ebe3cd"
            }
        ]
        },
        {
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#523735"
            }
        ]
        },
        {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
            "color": "#f5f1e6"
            }
        ]
        },
        {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
            "color": "#c9b2a6"
            }
        ]
        },
        {
        "featureType": "administrative.country",
        "stylers": [
            {
            "visibility": "simplified"
            }
        ]
        },
        {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry.stroke",
        "stylers": [
            {
            "color": "#dcd2be"
            }
        ]
        },
        {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#ae9e90"
            }
        ]
        },
        {
        "featureType": "administrative.neighborhood",
        "stylers": [
            {
            "visibility": "off"
            }
        ]
        },
        {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#dfd2ae"
            }
        ]
        },
        {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#dfd2ae"
            }
        ]
        },
        {
        "featureType": "poi",
        "elementType": "labels.text",
        "stylers": [
            {
            "visibility": "off"
            }
        ]
        },
        {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#93817c"
            }
        ]
        },
        {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
            {
            "color": "#a5b076"
            }
        ]
        },
        {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#447530"
            }
        ]
        },
        {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#f5f1e6"
            }
        ]
        },
        {
        "featureType": "road",
        "elementType": "labels",
        "stylers": [
            {
            "visibility": "off"
            }
        ]
        },
        {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#fdfcf8"
            }
        ]
        },
        {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#f8c967"
            }
        ]
        },
        {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
            "color": "#e9bc62"
            }
        ]
        },
        {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#e98d58"
            }
        ]
        },
        {
        "featureType": "road.highway.controlled_access",
        "elementType": "geometry.stroke",
        "stylers": [
            {
            "color": "#db8555"
            }
        ]
        },
        {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#806b63"
            }
        ]
        },
        {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#dfd2ae"
            }
        ]
        },
        {
        "featureType": "transit.line",
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#8f7d77"
            }
        ]
        },
        {
        "featureType": "transit.line",
        "elementType": "labels.text.stroke",
        "stylers": [
            {
            "color": "#ebe3cd"
            }
        ]
        },
        {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
            {
            "color": "#dfd2ae"
            }
        ]
        },
        {
        "featureType": "water",
        "elementType": "geometry.fill",
        "stylers": [
            {
            "color": "#b9d3c2"
            }
        ]
        },
        {
        "featureType": "water",
        "elementType": "labels.text",
        "stylers": [
            {
            "visibility": "off"
            }
        ]
        },
        {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            {
            "color": "#92998d"
            }
        ]
        }
    ]

    const handleInfo = async () => {
        try {
            const response = await myInfo(logout);
            const birthDate = new Date(response.date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const hasBirthdayPassed =
                today.getMonth() > birthDate.getMonth() ||
                (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());

            if (!hasBirthdayPassed) {
                age -= 1;
            }

            setEdad(age);
        } catch (error) {
            // Error al obtener info de usuario
        }
    };

    useEffect(() => {
        handleInfo();
    }, []);

    const handleRegionChangeComplete = async (region) => {
        if (onRegionChangeComplete) {
            onRegionChangeComplete(region);
        }
    };

    return (
        <View style={styles.container}>
            {edad !== 0 && origin && 
             typeof origin.latitude === 'number' && typeof origin.longitude === 'number' &&
             origin.latitude >= -90 && origin.latitude <= 90 &&
             origin.longitude >= -180 && origin.longitude <= 180 &&
                <MapView
                    ref={ref}
                    style={styles.mapa}
                    initialRegion={{
                        latitude: origin.latitude,
                        longitude: origin.longitude,
                        latitudeDelta: 0.050,
                        longitudeDelta: 0.050
                    }}
                    onRegionChangeComplete={handleRegionChangeComplete}
                    customMapStyle={edad >= 30 ? propsMapaViejos : propsMapaJovenes}
                >
                    
                    {type === 'View' && moments && Array.isArray(moments) && (
                        moments.map((item) => {
                            if (!item || !item._id || !item.location) return null;
                            return (
                                <View key={item._id}>
                                    <Moment
                                        _id={item._id}
                                        location={item.location}
                                        photo={item.photo}
                                        title={item.name}
                                        liked={item.liked}
                                        user={item.user || item.userId || { kylotId: item._id }}
                                        onPress={(data) => props?.onMomentPress && props.onMomentPress(data)}
                                    />
                                </View>
                            );
                        })
                    )}

                    {type === 'View' && activities && Array.isArray(activities) && (
                        activities.map((item) => {
                            if (!item || !item._id || !item.location) return null;
                            return (
                                <View key={item._id}>
                                    <Market
                                        _id={item._id}
                                        location={item.location}
                                        activity = {true}
                                        onPress={() => navigation.navigate("ActivityDetail", {_id: item._id, name: item.name})}
                                    />
                                </View>
                            );
                        })
                    )}

                    {type === 'View' && locations && Array.isArray(locations) && (
                        (lines ? locations.flat() : locations).map((item) => {
                            if (!item || !item._id || !item.location) return null;
                            return (
                                <View key={item._id}>
                                    <Market
                                        _id={item._id}
                                        location={item.location}
                                        blocked={item.blocked}
                                        categoria={item.categoria}
                                        {...(item._id && { onPress: () => onPress(item._id) })}
                                    />
                                </View>
                            );
                        })
                    )}

                    
                    {type === 'View' && lines && Array.isArray(locations) && locations.map((group, index) => (
                        <Polyline
                            key={`polyline-${index}`}
                            coordinates={group.map(loc => loc.location)}
                            strokeColor="#1D7CE4"
                            strokeWidth={3}
                        />
                    ))}

                   {type === 'View' && routes && Array.isArray(routes) && routes.map((user, index) => {
                      if (!user || !user.routeData || !Array.isArray(user.routeData.place) || user.routeData.place.length === 0) {
                        return null;
                      }
                      return (
                        <Polyline
                          key={`polyline-${index}`}
                          coordinates={user.routeData.place
                            .filter(p => p.location && typeof p.location.latitude === 'number' && typeof p.location.longitude === 'number')
                            .map(p => p.location)
                          }
                          strokeColor={user.color || '#1D7CE4'}
                          strokeWidth={user.stroke || 3}
                          tappable={true}
                          onPress={() => polyPress && polyPress(user)}
                          {...(user.discontinuous !== 0 && {
                            lineDashPattern: [user.discontinuous, user.discontinuous]
                          })}
                        />
                      );
                    })}

                    
                    {type === 'Add' && <AddMarker origin={origin} func={func} />}
                </MapView>
            }
        </View>
    );
});

const MemoMaps = memo(Maps);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    mapa: {
        flex: 1,
        width: '100%',
        height: '100%',
    }
});

export default MemoMaps;
