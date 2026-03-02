import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const CompanyIconCard = ({ 
  companyName, 
  iconSource, 
  onPress,
  isVerified = false 
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
          style={styles.companyIcon}
          resizeMode="contain"
        />
        {isVerified && (
          <View style={styles.verifiedBadge}>
            <Image 
              source={require('../../../assets/verificado.png')} 
              style={styles.verifiedIcon}
              resizeMode="contain"
            />
          </View>
        )}
      </View>
      <Text style={styles.companyName} numberOfLines={1}>
        {companyName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    width: 80,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    position: 'relative',
  },
  companyIcon: {
    width: 32,
    height: 32,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  verifiedIcon: {
    width: 12,
    height: 12,
  },
  companyName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1D1D1F',
    textAlign: 'center',
    letterSpacing: -0.1,
  },
});

export default CompanyIconCard;
