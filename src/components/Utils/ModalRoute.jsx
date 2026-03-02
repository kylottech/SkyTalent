import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  Text
} from 'react-native';
import { useUser } from '../../context/useUser';
import { useNavigation } from '@react-navigation/native';
import ImageView from 'react-native-image-viewing';
import Error from './Error';
import LoadingOverlay from './LoadingOverlay';
import { getRouteInfo } from '../../services/routeServices';
import LocationInfo from '../Maps/LocationInfo';
import Top from './Top';
import { formatString } from '../../utils/formatString'

const { width: screenWidth } = Dimensions.get('window');
const PHOTO_WIDTH = 90;
const PHOTO_HEIGHT = 100;
const ROTATION = 20;

const PhotoDeck = ({ group }) => {
  const first = group[0];
  const second = group[1];
  const third = group[2];

  return (
    <View style={{ width: PHOTO_WIDTH + 20, height: PHOTO_HEIGHT + 20, position: 'relative' }}>
      {third && <Image source={{ uri: third.url }} style={[styles.photo, styles.thirdPhoto]} />}
      {second && <Image source={{ uri: second.url }} style={[styles.photo, styles.secondPhoto]} />}
      {first && <Image source={{ uri: first.url }} style={[styles.photo, { zIndex: 3 }]} />}
    </View>
  );
};

const AnimatedGroupRow = ({ group, locationInfo, onPress, setLocationBlocked, locationBlocked }) => {
  const navigation = useNavigation();
  const translateY = useRef(new Animated.Value(50)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rectTranslateX = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      Animated.timing(rectTranslateX, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <TouchableOpacity onPress={() => onPress(group)}>
      <Animated.View
        style={[
          styles.expandedRow,
          { opacity, transform: [{ translateY }] }
        ]}
      >
        <PhotoDeck group={group} />
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <View style={{ width: '100%', transform: [{ scale: 0.85 }] }}>
            <LocationInfo
              close={() => console.log('close')}
              expand={() => navigation.navigate('Place', {
                locationInfo: locationInfo,
                setLocationBlocked: setLocationBlocked
              })}
              info={locationInfo}
              locationBlocked={locationBlocked}
            />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

const ModalRoute = ({ selectedRouteId, selectedRoute = [], isExpanded, back }) => {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Utils.ModalRoute;
  const [kylotId, setKylotId] = useState('');
  const [loading, setLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [currentGroup, setCurrentGroup] = useState([]);
  const [animation] = useState(new Animated.Value(0));
  const [showExpanded, setShowExpanded] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [locationBlockedStates, setLocationBlockedStates] = useState({});

  const photoGroups = selectedRoute.map(route => route.photos || []);

  useEffect(() => {
    if (selectedRouteId !== '') {
      handleGetPlaceInfo();
    }
  }, [selectedRouteId]);

  useEffect(() => {
    if (isExpanded) {
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false
      }).start(() => setShowExpanded(true));
    } else {
      setShowExpanded(false);
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false
      }).start();
    }
  }, [isExpanded]);

  const handleGetPlaceInfo = async () => {
    try {
      setLoading(true);
      const response = await getRouteInfo({ _id: selectedRouteId }, logout);
      if (response) {
        setKylotId(response.creatorKylotId)
        setRouteInfo(response) 
        const initialBlocked = {}
        response.placeInfos.forEach(info => {
          initialBlocked[info._id] = true;
        });
        setLocationBlockedStates(initialBlocked);
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError(true);
      setErrorMessage(error.message);
    }
  };

  const openViewer = (group) => {
    setCurrentGroup(group.map(p => ({ uri: p.url })));
    setViewerVisible(true);
  };

  const getLocationBlocked = (id) => {
    return locationBlockedStates[id] || false;
  };

  const updateLocationBlocked = (id, value) => {
    setLocationBlockedStates(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const matchPhotosWithInfo = () => {
    if (!routeInfo || !routeInfo.place) return [];

    return routeInfo.place.map((p) => {
      const info = routeInfo.placeInfos.find(pi => pi._id === p.placeId);
      return {
        photos: p.photos,
        info,
      };
    });
  };

  const transformPlaceInfo = (info, locationBlocked, cityBlocked = true) => {
    return {
      _id: info._id,
      avatar: info.avatar,
      city: info.city,
      country: info.country,
      name: info.name,
      puntuacion: Array.isArray(info.puntuacion) ? info.puntuacion.length : 0,
      locationBlocked,
      cityBlocked
    };
  };

  const renderDeckGroup = ({ item }) => (
    <TouchableOpacity onPress={() => openViewer(item)} style={{ marginRight: 20 }}>
      <PhotoDeck group={item} />
    </TouchableOpacity>
  );

  const renderExpandedView = () => {
    const matchedData = matchPhotosWithInfo();

    return (
      <ScrollView contentContainerStyle={{ /*paddingTop: 5,*/ paddingHorizontal: 20, paddingBottom: 20 }}>
        
        {matchedData.map((group, index) => {
          const placeId = group.info?._id || `group-${index}`;
          const locationBlocked = getLocationBlocked(placeId);

          return (
            <>
              <Text style={styles.index}>#{index +1}</Text>
              <View style={styles.linea}/>
              <AnimatedGroupRow
                key={placeId}
                group={group.photos}
                locationInfo={transformPlaceInfo(group.info, locationBlocked)}
                onPress={openViewer}
                locationBlocked={locationBlocked}
                setLocationBlocked={(value) => updateLocationBlocked(placeId, value)}
              />
            </>
            
          );
        })}
      </ScrollView>
    );
  };

  const interpolatedOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  return (
    <View style={{ flex: 1, marginTop: -40 }}>
      <Top 
        left={true} leftType={'Back'} 
        typeCenter={'Text'} textCenter={screenTexts.Top} 
        back={back}
      />
      <View style={{flexDirection: 'column'}}>
        <Text style={styles.TitleText}>{formatString(screenTexts.Title, { variable1: kylotId })}</Text>
        <Text style={styles.SubtitleText}>{formatString(screenTexts.Subtitle, { variable1: kylotId })}</Text>
      </View>
      {!showExpanded&&<Animated.View style={[styles.deckContainer, { opacity: interpolatedOpacity }]}>
        <FlatList
          horizontal
          data={photoGroups}
          keyExtractor={(_, i) => i.toString()}
          renderItem={renderDeckGroup}
          contentContainerStyle={{ padding: 20 }}
          showsHorizontalScrollIndicator={false}
        />
      </Animated.View>}

      {showExpanded && renderExpandedView()}

      <ImageView
        images={currentGroup}
        imageIndex={0}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />

      {error && <Error message={errorMessage} func={setError} />}
      {loading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  photo: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    position: 'absolute',
    borderRadius: 8,
  },
  secondPhoto: {
    zIndex: 2,
    transform: [{ rotate: `-${ROTATION}deg` }],
    top: -10,
    left: -10,
  },
  thirdPhoto: {
    zIndex: 1,
    transform: [{ rotate: `${ROTATION}deg` }],
    top: -10,
    left: 10,
  },
  deckContainer: {
  },
  expandedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: screenWidth,
    paddingHorizontal: 10,
  },
  index: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D7CE4'
  },
  
  TitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 16
  },
  SubtitleText: {
    fontSize: 14,
    marginLeft: 16,
    marginBottom: 20
  },
  linea:{
    borderColor: '#d9d9d9',
    borderWidth: 1,
    height: 1,
    width: '100%',
    alignSelf: 'center'
  }
});

export default ModalRoute;
