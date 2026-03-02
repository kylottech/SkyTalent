import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useUser } from '../../context/useUser';
import { LinearGradient } from 'expo-linear-gradient';
import { like, dislike } from '../../services/questionsServices'
import ProfileHeader from './ProfileHeader';
import ActionButtons from './ActionButtons';

const QuestionCard = ({ 
  question, 
  showAnswer, 
  onViewResponse,
  userInfo
}) => {
  const { logout, texts } = useUser()
  const screenTexts = texts.components.Preguntas.QuestionCard
  const [isLiked, setIsLiked] = useState(question.like);
  const [Likes, setLikes] = useState(question.likes.length);
  const [unblocks, setUnblocks] = useState(question.unblocks.length);

  const handlelike = async () => {
    try {
      
      like(question._id, logout) 
        .then(() => {
          setIsLiked(true)
          setLikes(prevNumLikes => prevNumLikes + 1)

        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  //añadir llamada para quitar like
  const handleDislike = async () => {
    try {
      
      dislike(question._id, logout) 
        .then(() => {
          setIsLiked(false)
          setLikes(prevNumLikes => prevNumLikes - 1)

        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  //añadir funcion para diferenciar la accion en base a si esta dado like o no
  const handleDecisionLike = async () => {
    if(isLiked){
      handleDislike()
    }
    else{
      handlelike()
    }
  };

  return (
    <Animated.View style={[
      styles.container,
      {
        transform: [
          { scale: showAnswer ? 0.85 : 1 },
          { translateY: showAnswer ? -24 : 0 }
        ]
      }
    ]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: question.avatar.url }}
          style={styles.image}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.2)', 'transparent']}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.content}>
        <ProfileHeader userInfo={userInfo} />
        
        <Text style={styles.title}>{question.title}</Text>
        <Text style={styles.subtitle}>{question.subtitle}</Text>

        <ActionButtons 
          isLiked={isLiked}
          onToggleLike={handleDecisionLike}
          likes={Likes}
          unblocks={unblocks}
        />

        <TouchableOpacity
          onPress={onViewResponse}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{screenTexts.ViewResponseTouchable}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 32,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    padding: 24,
    borderWidth: 2,
    borderColor: 'white'
  },
  imageContainer: {
    height: 280,
    borderRadius: 24,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: '100%'
  },
  content: {
    marginTop: 24
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    lineHeight: 28
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500'
  }
});

export default QuestionCard;