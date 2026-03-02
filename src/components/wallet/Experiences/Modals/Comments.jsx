import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  RefreshControl
} from 'react-native';
import { useUser } from "../../../../context/useUser";
import { SafeAreaView } from 'react-native-safe-area-context';
import { getComments, comment } from '../../../../services/experienceServices';
import LoadingOverlay from '../../../../components/Utils/LoadingOverlay';
import back from '../../../../../assets/arrow_left.png';
import send from '../../../../../assets/send.png';

// Función para calcular "hace cuánto"
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: 'año', seconds: 31536000 },
    { label: 'mes', seconds: 2592000 },
    { label: 'día', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 },
    { label: 'segundo', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `hace ${count} ${interval.label}${count > 1 ? 's' : ''}`;
    }
  }

  return 'justo ahora';
};

export function CommentsModal({ isOpen, onClose, idComments, loading, setLoading }) {
  const { logout, texts } = useUser();
  const screenTexts = texts.components.Wallet.Experiences.Modals.Comments;
  const [message, setMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [showOptionsFor, setShowOptionsFor] = useState(null);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleGetComments = async () => {
    if(!loading){
      setLoading(true)
      try {
        const response = await getComments({ _id: idComments }, logout);
        const formattedComments = response.map(comment => ({
          id: comment._id,
          text: comment.content,
          user: comment.user,
          createdAt: comment.createdAt,
          replies: (comment.replies || []).map(reply => ({
            id: reply._id,
            text: reply.content,
            user: reply.user,
            createdAt: reply.createdAt
          }))
        }));
        setComments(formattedComments);
        setLoading(false)
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  const renderComments = (comments) => {
    return comments.map((comment) => (
      <View key={comment.id} style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Image source={{ uri: comment.user.avatar.url }} style={styles.avatar} />
          <View style={styles.commentContent}>
            <View style={styles.commentBubble}>
              <View style={styles.commentHeaderInfo}>
                <Text style={styles.userName}>@{comment.user.kylotId}</Text>
              </View>
              <Text style={styles.timeAgoText}>{timeAgo(comment.createdAt)}</Text>
              <Text style={styles.commentText}>{comment.text}</Text>
            </View>
          </View>
        </View>
      </View>
    ));
  };

  const handleSubmit = async () => {
    if(!loading){
      setLoading(true)
      if (!message.trim()) return;
      const newComment = {
        text: message,
        parentId: replyTo || null,
        _id: idComments,
      };
      try {
        const response = await comment(newComment, logout);
        const newFormattedComment = {
          id: response._id,
          text: response.content,
          user: response.user,
          createdAt: response.createdAt,
          replies: []
        };
        setComments([newFormattedComment, ...comments]);
        setMessage('');
        setReplyTo(null);
        setLoading(false)
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  useEffect(() => {
    if (idComments !== null) {
      handleGetComments();
    }
  }, [idComments]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (idComments !== null) {
      await Promise.all(
        handleGetComments()
      );
    }
    setRefreshing(false);
  }, []);

  if (!isOpen) return null;

  return (
    <Modal visible={isOpen} animationType="slide" transparent onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={onClose}>
                <Image source={back} style={styles.backIcon} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
              <View style={{ width: 32 }} />
            </View>

            <ScrollView 
              style={styles.commentsList}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentContainer}>
                  <View style={styles.commentHeader}>
                    <Image source={{ uri: comment.user.avatar.url }} style={styles.avatar} />
                    <View style={styles.commentContent}>
                      <View style={styles.commentBubble}>
                        <View style={styles.commentHeaderInfo}>
                          <Text style={styles.userName}>@{comment.user.kylotId}</Text>
                        </View>
                        
                        <Text style={styles.commentText}>{comment.text}</Text>
                        <Text style={styles.timeAgoText}>{timeAgo(comment.createdAt)}</Text>
                      </View>

                      {comment.replies && comment.replies.length > 0 && (
                        <View style={{ marginLeft: 20 }}>
                          {renderComments(comment.replies)}
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                value={message}
                onChangeText={setMessage}
                placeholder={screenTexts.CommentsPlaceHolder}
                multiline
              />
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Image style={styles.send} source={send} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      {loading && (
        <LoadingOverlay/>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingTop: 24,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  commentsList: {
    flex: 1,
    marginTop: 10,
  },
  commentContainer: {
    marginBottom: 15,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
    borderColor: '#f0f0f0',
    borderWidth: 1,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  commentHeaderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
  },
  commentText: {
    marginVertical: 5,
  },
  timeAgoText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  commentInput: {
    flex: 1,
    borderRadius: 25,
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    paddingLeft: 15,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  send: {
    width: 20,
    height: 20,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
