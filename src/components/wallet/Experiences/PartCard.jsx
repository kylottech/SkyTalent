import React, { useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";

const PartCard = (props) => {
  const navigate = useNavigation();
  const { texts } = useUser();
  const screenTexts = texts.components.Wallet.Experiences.PartCard;
  const { info, mine, setPartId, setShowStepModal, setShowContactoModal, llamada, setShowPartOptionModal, index, setIndexParts } = props;
  
  // Animation refs
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleOpciones = () => {
    setIndexParts(index);
    setShowPartOptionModal(true);
  };

  const handleNavigatioStep = () => {
    if (info.steps) {
      navigate.navigate('StepGuide', { _id: info._id, llamada });
    } else if (mine) {
      setPartId(info._id);
      setShowStepModal(true);
    }
  };

  const handleNavigatioContact = () => {
    if (info.contact.length !== 0) {
      navigate.navigate('ExperienceContacts', { _id: info._id });
    } else if (mine) {
      setPartId(info._id);
      setShowContactoModal(true);
    }
  };

  // url estrictamente desde info.avatar.url
  const imageUri = info?.avatar?.url || null;

  // Animation functions
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  // Fade in animation on mount
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Timeline */}
      <View style={styles.timelineContainer}>
        <View style={styles.timelineLine} />
        <View style={styles.timelineDot} />
        <View style={styles.timelineLineBottom} />
      </View>

      {/* Card */}
      <Animated.View 
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
        onTouchStart={handlePressIn}
        onTouchEnd={handlePressOut}
      >
        {/* Header with time and options */}
        <View style={styles.cardHeader}>
          <Text style={styles.time}>{info.time}</Text>
          {mine && (
            <TouchableOpacity style={styles.optionsButton} onPress={handleOpciones}>
              <View style={styles.optionDot} />
              <View style={styles.optionDot} />
              <View style={styles.optionDot} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content */}
        <View style={styles.cardContent}>
          <View style={styles.textContent}>
            <Text style={styles.title}>{info.name}</Text>
            <Text style={styles.location}>{info.ubication}</Text>
            <View style={styles.detailsRow}>
              <Text style={styles.placeText}>📍 {info.place}</Text>
              <Text style={styles.separator}>|</Text>
              <Text style={styles.groupText}>👥 {info.grupo}</Text>
            </View>
          </View>

          {/* Image */}
          {imageUri && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.cardImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity onPress={handleNavigatioStep} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: info.steps ? '#1D7CE4' : '#86868B' }]}>
              {screenTexts.Step}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigatioContact} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: info.contact.length !== 0 ? '#1D7CE4' : '#86868B' }]}>
              {screenTexts.Contacts}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate.navigate('Notes', { _id: info._id, mine })} style={styles.actionButton}>
            <Text style={[styles.actionText, { color: '#1D7CE4' }]}>
              {screenTexts.Notes}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingLeft: 24,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  timelineLine: {
    width: 2,
    height: 20,
    backgroundColor: '#E5E5E7',
    marginBottom: 4,
  },
  timelineDot: {
    width: 12,
    height: 12,
    backgroundColor: '#1D7CE4',
    borderRadius: 6,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#1D7CE4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineLineBottom: {
    width: 2,
    height: 140,
    backgroundColor: '#E5E5E7',
    marginTop: 4,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    marginRight: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  time: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D7CE4',
    letterSpacing: 0.2,
  },
  optionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  optionDot: {
    width: 4,
    height: 4,
    backgroundColor: '#86868B',
    borderRadius: 2,
    marginHorizontal: 1,
  },
  cardContent: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  textContent: {
    flex: 1,
    marginRight: 16,
    paddingTop: 4,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 6,
    lineHeight: 22,
    letterSpacing: -0.3,
  },
  location: {
    fontSize: 14,
    color: '#86868B',
    fontWeight: '500',
    marginBottom: 8,
    lineHeight: 18,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeText: {
    fontSize: 12,
    color: '#86868B',
    fontWeight: '500',
  },
  separator: {
    fontSize: 12,
    color: '#D1D1D6',
    marginHorizontal: 8,
  },
  groupText: {
    fontSize: 12,
    color: '#86868B',
    fontWeight: '500',
  },
  cardImage: {
    width: 88,
    height: 88,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  actionButton: {
    marginRight: 20,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default PartCard;
