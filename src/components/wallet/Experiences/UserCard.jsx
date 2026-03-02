import React, { useState } from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import ExperienceCard from './ExperienceCard'

const UserCard = ({ user, setId, showConfirmationModal3, mine, commentsModal, setLoadingModal, loadingModal }) => {
  const navigate = useNavigation();
  const { logout, texts }=useUser()
  const [open, setOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = () => {
    setIsPressed(true);
  };

  const handlePressOut = () => {
    setIsPressed(false);
  };

  return (
    <>
    <TouchableOpacity
      style={[
        styles.userContainer,
        isPressed && styles.userContainerPressed
      ]}
      onPress={() => setOpen(!open)}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.95}
    >
        <View style={styles.infoContainer}>
            <Image source={{uri: user.avatar.url}} style={styles.userPhoto}/>
            <View style={styles.textContainer}>
                <Text style={styles.name}>{user.name} {user.surname}</Text>
                <Text style={styles.kylotId}>@{user.kylotId}</Text>
            </View>
        </View>
        <View style={styles.numberContainer}>
          <Text style={styles.number}>{user.experiences.length}</Text>
          <Text style={styles.experienceLabel}>exp.</Text>
        </View>
    </TouchableOpacity>
    {open && (
        user.experiences.length > 0 && (
            user.experiences.map((experience, index) => (
              <ExperienceCard 
                key={experience._id} 
                setId={setId} 
                experience={experience} 
                showConfirmationModal3={showConfirmationModal3} 
                mine={mine} 
                commentsModal={commentsModal}
                setLoadingModal={setLoadingModal}
                loadingModal={loadingModal}
              />
            ))
          ) 
        )}
    </>
  );
};

const styles = StyleSheet.create({
  userContainer:{
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 12,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    // Apple-style subtle shadows
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    // BBVA-style border
    borderWidth: 0.5,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  infoContainer:{
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userPhoto:{
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    // Subtle border for better definition
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.08)',
  },
  textContainer:{
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  name:{
    // Apple SF Pro Display typography style
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.4,
    color: '#1D1D1F',
    marginBottom: 2,
  },
  kylotId:{
    // Apple SF Pro Text typography style
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.2,
    color: '#8E8E93',
  },
  userContainerPressed: {
    // Apple-style pressed state
    backgroundColor: '#F2F2F7',
    transform: [{ scale: 0.98 }],
  },
  numberContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  number:{
    // BBVA-style accent color
    fontSize: 20,
    fontWeight: '600',
    color: '#1D7CE4',
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  experienceLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: 0.2,
    marginTop: 1,
  },
});

export default UserCard;
