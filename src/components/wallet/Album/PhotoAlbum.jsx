import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../../../context/useUser';

export default function PhotoAlbum({ 
  title, achieved, photo, Add, onPress, onAddPhoto, mine, editMilestones, setEditMilestones, setVisibleEditMilestones,
  setSelectedMilestones
}) {
  const { texts, logout } = useUser();
  const screenTexts = texts.components.Wallet.Album.AlbumCard;
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (!title) {
    return (
      <TouchableOpacity 
        style={styles.cardEmpty} 
        onPress={Add} 
        disabled={!mine}
        activeOpacity={0.95}
      >
        <View style={styles.addContent}>
          <View style={styles.addIcon}>
            <Feather name="plus" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.addText}>{screenTexts.Add}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  if (!photo) {
    return (
      <TouchableOpacity 
        style={[styles.cardNotPhoto, editMilestones ? styles.cardSizeMin : styles.cardSizeMax]} 
        onPress={onAddPhoto} 
        disabled={!mine || editMilestones}
        onLongPress={() => setEditMilestones(true)}
        delayLongPress={300}
        activeOpacity={0.95}
      >
        <View style={styles.emptyContent}>
          <Text style={styles.titleNotPhoto} numberOfLines={2} ellipsizeMode="tail">{title}</Text>
          <View style={styles.addPhotoHint}>
            <Feather name="camera" size={20} color="#86868B" />
            <Text style={styles.addPhotoText}>Toca para agregar</Text>
          </View>
        </View>
        
        {(editMilestones && mine) && (
          <TouchableOpacity 
            style={styles.editButton} 
            onPress={() => {setVisibleEditMilestones(true), setSelectedMilestones()}}
          >
            <Feather name="more-horizontal" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={[styles.card, editMilestones ? styles.cardSizeMin : styles.cardSizeMax]} 
      onPress={() => onPress(photo.url, title, achieved)}
      disabled={editMilestones}
      activeOpacity={0.95}
    >
      <ImageBackground source={{ uri: photo.url }} style={styles.image}>
        <View style={styles.overlay} />
        
        <View style={styles.content}>
          <View style={styles.textSection}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
            <Text style={styles.date}>{formatDate(achieved)}</Text>
          </View>
        </View>
      </ImageBackground>
      
      {(editMilestones && mine) && (
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {setVisibleEditMilestones(true), setSelectedMilestones()}}
        >
          <Feather name="more-horizontal" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  cardNotPhoto: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardSizeMax:{
    width: '30%',
    height: 180,
  },
  cardSizeMin:{
    width: '25%',
    height: 140,
  },
  editButton:{
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 8,
    right: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  textSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontWeight: '700',
    fontSize: 14,
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  date: {
    fontSize: 11,
    color: '#86868B',
    fontWeight: '500',
  },
  emptyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  titleNotPhoto: {
    fontWeight: '600',
    fontSize: 14,
    color: '#86868B',
    textAlign: 'center',
    letterSpacing: -0.2,
    marginBottom: 16,
    lineHeight: 18,
  },
  addPhotoHint: {
    alignItems: 'center',
    opacity: 0.6,
  },
  addPhotoText: {
    fontSize: 11,
    color: '#86868B',
    fontWeight: '400',
    marginTop: 6,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
  cardEmpty: {
    width: '30%',
    height: 180,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  addContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  addIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#1D7CE4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addText: {
    fontSize: 12,
    color: '#86868B',
    fontWeight: '500',
    letterSpacing: -0.1,
    textAlign: 'center',
  },
});
