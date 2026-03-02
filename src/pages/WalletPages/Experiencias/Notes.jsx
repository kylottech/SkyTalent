import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput,
  Text, KeyboardAvoidingView, Platform, RefreshControl, Dimensions, TouchableOpacity, Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUser } from "../../../context/useUser";
import Top from '../../../components/Utils/Top';
import InfoModal from '../../../components/Utils/InfoModal';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';
import Error from '../../../components/Utils/Error';
import Confirmacion from '../../../components/Utils/Confirmacion';

import info from '../../../../assets/info.png'; 

import {
  getNotes,
  createNotes,
  updateNotes,
  deleteNotes
} from '../../../services/experienceServices';

const screenWidth = Dimensions.get('window').width;

const Notes = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading: authLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Experiencias.Notes
  const isEditable = route.params?.mine;

  const [notes, setNotes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  useEffect(() => {
    if (!authLoading && !isLogged) {
      navigate.navigate('Login');
    } else {
      handleGetNotes();
    }
  }, [isLogged, authLoading]);

  useEffect(() => {
    handleGetNotes();
  }, [route.params._id]);

  const handleGetNotes = async () => {
    if (!loading) {
      try {
        setLoading(true);
        getNotes({ _id: route.params._id }, logout)
          .then((response) => {
            const items = isEditable
              ? [...response, { title: '', text: '', date: new Date() }]
              : response;
            setNotes(items);
            setLoading(false);
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false);
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false);
      }
    }
  };

  const handleChange = (field, value, index) => {
    if (!isEditable) return;
    const updated = [...notes];
    updated[index][field] = value;
    setNotes(updated);
  };

  const handleBlur = (index) => {
    if (!isEditable) return;

    const updated = [...notes];
    const note = updated[index];
    const isLast = index === updated.length - 1;
    const isEmpty = note.title.trim() === '' && note.text.trim() === '';
    const hasBoth = note.title.trim() !== '' && note.text.trim() !== '';

    if (!isLast && isEmpty && note._id) {
      deleteNotes({ _id: note._id }, logout)
        .then(() => {
          updated.splice(index, 1);
          setNotes(updated);
        })
        .catch(() => {
          setError(true);
          setErrorMessage(screenTexts.DeleteError);
        });
      return;
    }

    if (!note._id && hasBoth) {
      createNotes({
        title: note.title,
        text: note.text,
        partId: route.params._id
      }, logout)
        .then((newNote) => {
          newNote.date = new Date(); // fallback
          updated[index] = newNote;
          updated.push({ title: '', text: '', date: new Date() });
          setNotes(updated);
        })
        .catch(() => {
          setError(true);
          setErrorMessage(screenTexts.CreateError);
        });
      return;
    }

    if (note._id) {
      updateNotes({
        _id: note._id,
        title: note.title,
        text: note.text,
        partId: route.params._id
      }, logout)
        .catch(() => {
          setError(true);
          setErrorMessage(screenTexts.UpdateError);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${('0' + date.getDate()).slice(-2)}/${('0' + (date.getMonth() + 1)).slice(-2)}/${date.getFullYear()}`;
  };

  return (
    <View style={styles.container}>
      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />

      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
            <TouchableOpacity style={styles.infoButton} onPress={() => setShowConfirmation(true)}>
              <Image source={info} style={styles.infoIcon}/>
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>{screenTexts.Subtitle}</Text>
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={handleGetNotes} />}
          keyboardShouldPersistTaps="handled"
        >
          {notes.map((item, index) => (
            <View key={index} style={styles.noteCard}>
              <View style={styles.cardContent}>
                <View style={styles.textContent}>
                  <TextInput
                    editable={isEditable}
                    style={styles.noteTitle}
                    placeholder={screenTexts.TitlePlaceHolder}
                    placeholderTextColor="#86868B"
                    value={item.title || ''}
                    onChangeText={(text) => handleChange('title', text, index)}
                    onBlur={() => handleBlur(index)}
                  />
                  <TextInput
                    editable={isEditable}
                    style={styles.noteText}
                    placeholder={screenTexts.NotePlaceHolder}
                    placeholderTextColor="#86868B"
                    value={item.text || ''}
                    onChangeText={(text) => handleChange('text', text, index)}
                    onBlur={() => handleBlur(index)}
                    multiline
                  />
                </View>
                {item._id && (
                  <View style={styles.dateContainer}>
                    <Text style={styles.date}>{formatDate(item.updatedAt || new Date())}</Text>
                  </View>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
      {loading && <LoadingOverlay />}
      <InfoModal 
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)} 
        Title={screenTexts.ModalTitle}
        Subtitle={screenTexts.ModalSubtitle}
        Button={screenTexts.ContinueTouchable}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerSection: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C7C7CC',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.5,
    lineHeight: 26,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#86868B',
    fontWeight: '500',
    lineHeight: 20,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: screenWidth * 0.85,
    minHeight: 420,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  textContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 16,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  noteText: {
    fontSize: 16,
    color: '#1D1D1F',
    lineHeight: 24,
    flex: 1,
    textAlignVertical: 'top',
  },
  dateContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  date: {
    fontSize: 13,
    color: '#86868B',
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  infoButton: {
    padding: 8,
  },
  infoIcon: {
    width: 16,
    height: 16,
    tintColor: '#86868B',
  },
});

export default Notes;
