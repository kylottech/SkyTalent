import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CollectionCard = ({ 
  title, 
  subtitle, 
  iconSource, 
  itemCount,
  onPress 
}) => {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Image 
          source={iconSource} 
          style={styles.collectionIcon}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {itemCount && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>{itemCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  collectionIcon: {
    width: 20,
    height: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '400',
    letterSpacing: -0.1,
  },
  countContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.1,
  },
});

export default CollectionCard;
