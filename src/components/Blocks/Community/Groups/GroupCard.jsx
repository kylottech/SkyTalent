import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../../context/useUser";
import { formatString } from '../../../../utils/formatString'

const GroupCard = ({ name, members, memberAvatars, _id }) => {
  const navigate = useNavigation();
  const { texts } = useUser();
  const screenTexts = texts.components.Blocks.Community.Groups.GroupCard
  const maxAvatars = 4; // Reducido para mejor legibilidad
  const totalMembers = members;
  const extra = totalMembers - maxAvatars;

  const renderAvatar = (avatar, index) => (
    <View key={index} style={styles.avatarContainer}>
      <Image
        source={{ uri: avatar.avatar.url }}
        style={styles.avatar}
        resizeMode="cover"
      />
    </View>
  );

  const handlePress = () => {
    navigate.navigate("GroupDetail", {_id: _id, name: name});
  };

  return (
    <Pressable 
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed
      ]} 
      onPress={handlePress}
      android_ripple={{ color: 'rgba(29, 124, 228, 0.1)', borderless: false }}
    >
      <View style={styles.content}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarGrid}>
            {memberAvatars.slice(0, maxAvatars).map((avatar, index) => {
              // Si es el último espacio y hay extras, mostrar el +X
              if (index === maxAvatars - 1 && totalMembers > maxAvatars) {
                return (
                  <View key={'extra'} style={[styles.avatarContainer, styles.extraAvatarContainer]}>
                    <View style={styles.extraAvatar}>
                      <Text style={styles.extraText}>+{extra}</Text>
                    </View>
                  </View>
                );
              } else {
                return renderAvatar(avatar, index);
              }
            })}
          </View>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {name}
          </Text>
          <Text style={styles.members}>
            {formatString(screenTexts.Members, { variable1: totalMembers })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Card Container
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 2,
    overflow: 'visible',
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  
  // Content Layout
  content: {
    padding: 20,
    paddingBottom: 16,
  },
  
  // Avatar Section
  avatarSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  avatarGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
  },
  
  // Extra Avatar (for +X)
  extraAvatarContainer: {
    backgroundColor: '#F8F9FA',
    borderColor: '#E9ECEF',
  },
  extraAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 19,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E9ECEF',
  },
  extraText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6C757D',
    letterSpacing: -0.2,
  },
  
  // Text Section
  textSection: {
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    letterSpacing: -0.4,
    lineHeight: 22,
    marginBottom: 4,
  },
  members: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    textAlign: 'center',
    letterSpacing: -0.1,
    lineHeight: 18,
  },
});

export default GroupCard;
