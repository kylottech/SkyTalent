import React, { useState } from 'react';
import { TouchableOpacity, Text, ImageBackground, StyleSheet, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { safe, notSafe, like, dislike} from '../../../services/experienceServices'
import corazon from '../../../../assets/corazon.png'
import mensaje from '../../../../assets/mensajeBlanco.png'
import Empty_heart from '../../../../assets/empty_save.png';
import Full_heart from '../../../../assets/full_save.png';
import Reminder from '../../../../assets/Reminder.png'

const ExperienceCard = ({ setId, experience, showConfirmationModal3, mine, commentsModal, setSelectedIndex, index, setLoadingModal, loadingModal }) => {
  const navigate = useNavigation();
  const { logout, texts }=useUser()
  const screenTexts = texts.components.Wallet.Experiences.ExperienceCard
  const [saved, setSaved] = useState(experience.saved);
  const [likeBoolean, setLike] = useState(experience.like);
  const [numLikes, setNumLikes] = useState(experience.likes.length);
  const [numComments, setNumComments] = useState(experience.comments);

  const handleOpciones = () => {
    setSelectedIndex(index)
    showConfirmationModal3(true)
  };
  
  const formatDate = (date) => {
    const months = [
      screenTexts.January, 
      screenTexts.February, 
      screenTexts.March, 
      screenTexts.April, 
      screenTexts.May, 
      screenTexts.June, 
      screenTexts.July, 
      screenTexts.August, 
      screenTexts.September, 
      screenTexts.October, 
      screenTexts.November, 
      screenTexts.December
    ];
  
    const d = new Date(date);
    const day = d.getDate();
    const month = months[d.getMonth()];
    const year = d.getFullYear();
  
    return `${day} ${screenTexts.Of} ${month} ${screenTexts.Of} ${year}`;
  };

  const handleSaved = async () => {
    try {
      setLoadingModal(true)
      safe(experience._id, logout) 
        .then(() => {
          setSaved(true)
          setLoadingModal(false)
        })
        .catch((error) => {
        setError(true);
          setErrorMessage(error.message);
          setLoadingModal(false)
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setLoadingModal(false)
    }
  };

  const handleNotSaved = async () => {
    try {
      setLoadingModal(true)
      notSafe(experience._id, logout) 
        .then(() => {
          setSaved(false)
          setLoadingModal(false)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoadingModal(false)
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setLoadingModal(false)
    }
  };

  const handleDecisionSaved = async () => {
    if(!loadingModal){
      if(saved){
        handleNotSaved()
      }
      else{
        handleSaved()
      }
    }
    
  };

  //añadir llamada para dar like
  const handlelike = async () => {
    try {
      setLoadingModal(true)
      like(experience._id, logout) 
        .then(() => {
          setLike(true)
          setNumLikes(prevNumLikes => prevNumLikes + 1);
          setLoadingModal(false)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoadingModal(false)
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setLoadingModal(false)
    }
  };

  //añadir llamada para quitar like
  const handleDislike = async () => {
    try {
      setLoadingModal(true)
      dislike(experience._id, logout) 
        .then(() => {
          setLike(false)
          setNumLikes(prevNumLikes => prevNumLikes - 1);
          setLoadingModal(false)
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoadingModal(false)
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
      setLoadingModal(false)
    }
  };

  //añadir funcion para diferenciar la accion en base a si esta dado like o no
  const handleDecisionLike = async () => {
    if(!loadingModal){
      if(likeBoolean){
        handleDislike()
      }
      else{
        handlelike()
      }
    }
  };

  //modificar el icono para que se vea si esta dado like o no

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigate.navigate('ExperienceDetail', { _id: experience._id, mine: mine, name: experience.name, photo: experience.avatar.url })}
    >
      <ImageBackground
        source={{ uri: experience.avatar.url }}
        style={styles.cardImage}
        imageStyle={styles.cardImageStyle}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{formatDate(experience.date)}</Text>
          </View>
          
          <View style={styles.headerActions}>
            {mine ? 
              (
                <TouchableOpacity style={styles.menuButton} onPress={handleOpciones}>
                  <View style={styles.menuDots}>
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                </TouchableOpacity>
              ):(
                <TouchableOpacity style={styles.saveButton} onPress={handleDecisionSaved}>
                  <Image 
                    source={saved ? Full_heart : Empty_heart} 
                    style={[styles.saveIcon, saved && styles.savedIcon]} 
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              )
            }
          </View>
        </View>

        {/* Content Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.contentOverlay}
        >
          <View style={styles.content}>
            <View style={styles.textSection}>
              <Text style={styles.title}>{experience.name}</Text>
              <Text style={styles.description}>{experience.description}</Text>
            </View>

            <View style={styles.actionsSection}>
              <TouchableOpacity style={styles.actionButton} onPress={handleDecisionLike}>
                <Image 
                  source={corazon} 
                  style={[styles.actionIcon, likeBoolean && styles.likedIcon]}
                />
                <Text style={styles.actionText}>{numLikes}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={() => {setId(experience._id); commentsModal(true) }}>
                <Image source={mensaje} style={styles.actionIcon} />
                <Text style={styles.actionText}>{numComments}</Text>
              </TouchableOpacity>

              {mine && (
                <TouchableOpacity style={styles.actionButton} onPress={() => navigate.navigate('Reminder', {_id: experience._id} )}>
                  <Image source={Reminder} style={styles.actionIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    // Apple-style refined shadows
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    height: 280,
    marginHorizontal: 32,
  },
  cardImage: {
    height: '100%',
    backgroundColor: '#F2F2F7',
  },
  cardImageStyle: {
    borderRadius: 20,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  dateContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backdropFilter: 'blur(15px)',
    // Apple-style subtle shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  date: {
    color: '#1D1D1F',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: 'transparent',
    borderRadius: 0,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    backdropFilter: 'blur(15px)',
    // Apple-style subtle shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0,
    borderColor: 'transparent',
  },
  menuDots: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 10,
  },
  dot: {
    backgroundColor: '#FFFFFF',
    width: 3,
    height: 3,
    borderRadius: 2,
  },
  saveButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    // Apple-style subtle shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
    marginTop: -18,
    marginRight: -18,
  },
  saveIcon: {
    width: 18,
    height: 18,
    tintColor: '#1D7CE4',
  },
  savedIcon: {
    tintColor: '#1D7CE4',
  },
  contentOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  content: {
    padding: 16,
  },
  textSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 26,
    letterSpacing: -0.4,
    // Apple-style text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  description: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.1,
    // Apple-style text shadow for better readability
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
    backdropFilter: 'blur(15px)',
    minWidth: 50,
    justifyContent: 'center',
    // Apple-style subtle shadow
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  actionIcon: {
    width: 16,
    height: 16,
    tintColor: '#1D1D1F',
  },
  likedIcon: {
    tintColor: '#FF3B30',
    width: 16,
    height: 16,
  },
  actionText: {
    color: '#1D1D1F',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.1,
    lineHeight: 16,
  },
});

export default ExperienceCard;
