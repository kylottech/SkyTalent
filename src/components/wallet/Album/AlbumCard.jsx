import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Progress from "react-native-progress";
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/useUser';

const AlbumCard = ({ info, onImagePress }) => {
  const navigate=useNavigation()
  const { texts, logout } = useUser();
  const screenTexts = texts.components.Wallet.Album.AlbumCard;
  const { name, descripcion, milestones } = info;

  const total = milestones.length;
  const completed = milestones.filter(m => m.photo?.url).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const renderItem = ({ item }) => {
    const imageUrl = item.photo?.url;
    return (
      <TouchableOpacity style={styles.imageWrapper} onPress={() => imageUrl && onImagePress(imageUrl)}>
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={32} color="#aaa" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigate.navigate("AlbumDetail", {_id: info._id})}
      activeOpacity={0.95}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
          <Text style={styles.subtitle} numberOfLines={2} ellipsizeMode="tail">{descripcion}</Text>
        </View>
        
        <View style={styles.progressSection}>
          <Progress.Circle
            progress={progress / 100}
            size={44}
            thickness={3}
            color="#1D7CE4"
            unfilledColor="#F2F2F7"
            borderWidth={0}
            showsText={true}
            formatText={() => `${Math.round(progress)}%`}
            textStyle={{ 
              fontSize: 10, 
              fontWeight: '700', 
              color: '#1D7CE4',
              letterSpacing: -0.2
            }}
          />
        </View>
      </View>

      {/* Images Section */}
      <View style={styles.imagesSection}>
        <FlatList
          data={milestones}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          contentContainerStyle={styles.flatList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
        
        {/* View All Button */}
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => navigate.navigate("AlbumDetail", {_id: info._id})}
        >
          <Text style={styles.viewAllText}>{screenTexts.Navigate}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 6,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 15,
    color: '#86868B',
    fontWeight: '400',
    lineHeight: 20,
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagesSection: {
    position: 'relative',
  },
  flatList: {
    paddingRight: 80,
  },
  separator: {
    width: 12,
  },
  imageWrapper: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 120,
    height: 160,
    backgroundColor: '#F2F2F7',
  },
  placeholder: {
    width: 120,
    height: 160,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewAllButton: {
    position: 'absolute',
    right: 0,
    top: '50%',
    marginTop: -12,
    backgroundColor: 'rgba(29, 124, 228, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(29, 124, 228, 0.2)',
  },
  viewAllText: {
    color: '#1D7CE4',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
});

export default AlbumCard;
