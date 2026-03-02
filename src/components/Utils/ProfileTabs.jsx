import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useUser } from '../../context/useUser';
import { formatString } from '../../utils/formatString';

const ProfileTabs = ({ activeTab, onTabChange, eventCount = 0, followerCount = 0, followingCount = 0, badgeCount = 0 }) => {
  const { texts } = useUser();
  const screenTexts = texts.pages.Perfil;

  const tabs = [
    { id: 'events', label: screenTexts.TabEvents, count: eventCount, key: 'events' },
    { id: 'followers', label: screenTexts.TabFollowers, count: followerCount, key: 'followers' },
    { id: 'following', label: screenTexts.TabFollowing, count: followingCount, key: 'following' },
    { id: 'badges', label: screenTexts.TabBadges, count: badgeCount, key: 'badges' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  activeTab: {
    // Active state styling
  },
  tabText: {
    fontSize: 15,
    fontWeight: '400',
    color: '#8E8E93',
    letterSpacing: -0.2,
  },
  activeTabText: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: '#7C3AED',
    borderRadius: 1,
  },
});

export default ProfileTabs;

