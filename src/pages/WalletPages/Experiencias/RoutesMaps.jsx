import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  Text,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { getRoute } from '../../../services/experienceServices';
import Top from '../../../components/Utils/Top';
import Maps from '../../../components/Maps/Maps';
import LocationInfo from '../../../components/Maps/LocationInfo';
import Loader from '../../../components/Utils/Loader';
import Error from '../../../components/Utils/Error';

const screenHeight = Dimensions.get('window').height;
const sheetInitialPosition = screenHeight * 0.9;
const sheetExpandedPosition = 95;

const RoutesMaps = ({ route }) => {
  const navigation = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Experiencias.RoutesMaps;
  const { _id } = route.params;

  const mapRef = useRef(null);
  const scrollRef = useRef(null);
  const locationRefs = useRef({});
  const [coord, setCoord] = useState({});
  const [cargando, setCargando] = useState(false);
  const [visibleComponent, setVisibleComponent] = useState(false);
  const [locations, setLocations] = useState([]);
  const [locationInfo, setLocationInfo] = useState([]);
  const [locationBlockedMap, setLocationBlockedMap] = useState({});
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const translateY = useRef(new Animated.Value(sheetInitialPosition)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const newPos = Math.max(sheetExpandedPosition, sheetInitialPosition + gestureState.dy);
        translateY.setValue(newPos);
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -50) {
          Animated.spring(translateY, {
            toValue: sheetExpandedPosition,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.spring(translateY, {
            toValue: sheetInitialPosition,
            useNativeDriver: true,
          }).start();
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
      },
    })
  ).current;

  const updateLocationBlocked = (id, blocked) => {
    setLocationBlockedMap((prev) => ({
      ...prev,
      [id]: blocked,
    }));
  };


  const transformLocation = (data) => {
    return data.map(item => {
      if (item.location?.coordinates?.length === 2) {
        return {
          _id: item._id,
          blocked: item.blocked,
          categoria: item.categoria,
          location: {
            latitude: item.location.coordinates[1],
            longitude: item.location.coordinates[0]
          }
        };
      }
      return item;
    });
  };

  const handleRoute = async () => {
    try {
      const response = await getRoute({ _id }, logout);
      const processedLocations = transformLocation(response);
      setLocations([processedLocations]);
      setLocationInfo(response);

      const initialBlockedMap = {};
      response.forEach((location) => {
        initialBlockedMap[location._id] = location.locationBlocked ?? false;
      });
      setLocationBlockedMap(initialBlockedMap);

      setCargando(true);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    handleRoute();
  }, []);

  const focusOnLocation = (_id) => {
    Animated.spring(translateY, {
      toValue: sheetExpandedPosition,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      const node = locationRefs.current[_id];
      if (node && scrollRef.current) {
        node.measureLayout(
          scrollRef.current.getInnerViewNode(),
          (x, y) => {
            scrollRef.current.scrollTo({ y: y - 100, animated: true });
          },
          (error) => console.error('No se pudo medir el nodo:', error)
        );
      }
    }, 400);
  };

  return (
    <View style={styles.container}>
      <Top
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={screenTexts.Top}
      />

      {cargando && locations.length > 0 && locations[0]?.length > 0 && locations[0][0]?.location ? (
        <Maps
          ref={mapRef}
          origin={{
            latitude: locations[0][0].location.latitude,
            longitude: locations[0][0].location.longitude
          }}
          type={'View'}
          lines={true}
          locations={locations}
          onPress={focusOnLocation}
        />
      ) : (
        <Loader />
      )}

      {!visibleComponent && (
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          <View {...panResponder.panHandlers} style={styles.sheetHandleWrapper}>
            <View style={styles.sheetHandle} />
          </View>

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={{ padding: 16, alignItems: "center" }}
          >
            <Text style={styles.visit}>{screenTexts.Title}</Text>

            <View style={styles.menu}>
              <View style={styles.subMenu}>
                <Text style={styles.numberMenu}>{locationInfo.length}</Text>
                <Text style={styles.textMenu}>{screenTexts.Menu1}</Text>
              </View>
              <View style={styles.lineaV} />
              <View style={styles.subMenu}>
                <Text style={styles.numberMenu}>{locationInfo[0]?.numPosts}</Text>
                <Text style={styles.textMenu}>{screenTexts.Menu2}</Text>
              </View>
              <View style={styles.lineaV} />
              <View style={styles.subMenu}>
                <Text style={styles.numberMenu}>0</Text>
                <Text style={styles.textMenu}>{screenTexts.Menu3}</Text>
              </View>
            </View>

            <View style={{ marginBottom: 50, width: '100%', alignItems: 'center' }}>
              {locationInfo.map((location) => (
                <View
                  key={location._id}
                  ref={(el) => { locationRefs.current[location._id] = el }}
                  style={{ marginBottom: 25, width: '100%', alignItems: 'center' }}
                >
                  <Text style={styles.textTime}>{location.time}</Text>
                  <LocationInfo
                    close={() => setVisibleComponent(false)}
                    expand={() => navigation.navigate('Place', {
                      locationInfo: location,
                      setLocationBlocked: (blocked) => updateLocationBlocked(location._id, blocked)
                    })}
                    info={location}
                    locationBlocked={locationBlockedMap[location._id] ?? false}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      )}

      {error && <Error message={errorMessage} func={setError} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  sheet: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: screenHeight,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 16,
    zIndex: 10,
  },
  sheetHandleWrapper: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 2,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
  },
  visit: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  menu: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  subMenu: {
    flex: 1,
    justifyContent: 'center',
    alignItems: "center",
  },
  numberMenu: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  textMenu: {
    fontSize: 12,
    color: '#86868B',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 16,
  },
  lineaV: {
    width: 1,
    height: 32,
    backgroundColor: '#E5E5E7',
    marginHorizontal: 16,
  },
  textTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D7CE4',
    marginBottom: 12,
    letterSpacing: 0.2,
    alignSelf: 'flex-start',
    marginLeft: 16,
  }
});

export default RoutesMaps;
