import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useUser } from '../../context/useUser';

const UserPhotos = ({ photos }) => {
  const { texts } = useUser();
  const userPhotosTexts = texts.pages.MarketPlacePages.Details.UserPhotos;

  if (!photos || photos.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{userPhotosTexts.Title}</Text>
      <Text style={styles.subtitle}>{userPhotosTexts.Subtitle}</Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
                {photos.map((photo, index) => (
                  <TouchableOpacity key={index} style={styles.polaroidCard} activeOpacity={0.8}>
                    <View style={styles.polaroidFrame}>
                      <Image source={photo.source} style={styles.polaroidImage} />
                      <View style={styles.polaroidCaption}>
                        <Text style={styles.captionText}>{photo.userName}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 40,
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 20,
    fontWeight: '400',
    lineHeight: 24,
  },
  scrollContent: {
    paddingRight: 16,
  },
  polaroidCard: {
    marginRight: 16,
  },
  polaroidFrame: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    width: 160,
  },
  polaroidImage: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
  },
  polaroidCaption: {
    paddingHorizontal: 4,
    paddingBottom: 4,
  },
  captionText: {
    fontSize: 13,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default UserPhotos;
