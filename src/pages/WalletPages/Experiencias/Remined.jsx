import React, { useEffect, useState } from 'react';
import {
  View, StyleSheet, ScrollView, TextInput, TouchableOpacity,
  Text, KeyboardAvoidingView, Platform, RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useUser } from "../../../context/useUser";
import Top from '../../../components/Utils/Top';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';
import Error from '../../../components/Utils/Error';
import Confirmacion from '../../../components/Utils/Confirmacion';

import {
  getReminder,
  createReminder,
  updateReminder,
  reminderCheckbox,
  deleteReminder
} from '../../../services/experienceServices';

const Reminder = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading: authLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Experiencias.Reminder

  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');

  useEffect(() => {
    if (!authLoading && !isLogged) {
      navigate.navigate('Login');
    } else {
      handleGetReminders();
    }
  }, [isLogged, authLoading]);

  useEffect(() => {
    handleGetReminders();
  }, [route.params._id]);

  const handleGetReminders = async () => {
    if (!loading) {
      try {
        setLoading(true);
        getReminder({ _id: route.params._id }, logout)
          .then((response) => {
            setReminders([...response, { text: '', state: false }]);
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

  const handleTextChange = (text, index) => {
    const updated = [...reminders];
    updated[index].text = text;
    setReminders(updated);
  };

  const handleBlur = (index) => {
    const updated = [...reminders];
    const reminder = updated[index];
    const isLast = index === updated.length - 1;
    const isEmpty = reminder.text.trim() === '';

    if (!isLast && isEmpty && reminder._id) {
      deleteReminder({_id: reminder._id}, logout)
        .then(() => {
          updated.splice(index, 1);
          setReminders(updated);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(screenTexts.DeleteError);
        });
      return;
    }

    if (!reminder._id && !isEmpty) {
      createReminder({
        text: reminder.text,
        experienceId: route.params._id
      }, logout)
        .then((newReminder) => {
          updated[index] = newReminder;
          updated.push({ text: '', state: false });
          setReminders(updated);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(screenTexts.CreateError);
        });
      return;
    }

    if (reminder._id && !isEmpty) {
      updateReminder({ _id: reminder._id, text: reminder.text, experienceId: route.params._id }, logout)
        .catch((err) => {
          setError(true);
          setErrorMessage(screenTexts.UpdateError);
        });
    }
  };

  const toggleState = (index) => {
    const updated = [...reminders];
    const reminder = updated[index];
    reminder.state = !reminder.state;
    setReminders(updated);

    if (reminder._id) {
      reminderCheckbox({_id: reminder._id, state: reminder.state }, logout)
        .catch((err) => {
          setError(true);
          setErrorMessage(screenTexts.UpdateStateError);
        });
    }
  };

  return (
    <View style={styles.container}>
      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />

    <View style={styles.headerContainer}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.headerTitle}>{screenTexts.Title}</Text>
            {/*<TouchableOpacity style={styles.infoButton} onPress={() => setShowConfirmation(true)}>
                <Image source={info} style={styles.infoIcon}/>
            </TouchableOpacity>*/}
        </View>
        <Text style={styles.headerSubtitle}>{screenTexts.Subtitle}</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleGetReminders} />
          }
        >
          {reminders.map((item, index) => {
            const isEmpty = item.text.trim() === '';

            return (
              <View key={index} style={styles.reminderItem}>
                <TouchableOpacity
                  onPress={() => !isEmpty && toggleState(index)}
                  activeOpacity={isEmpty ? 1 : 0.7}
                  style={[styles.customCheckbox, item.state && styles.customCheckboxChecked, isEmpty && { opacity: 0.3 }]}
                >
                  {item.state && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>

                <View style={styles.inputWrapper}>
                  {item.state && (
                    <Text style={styles.strikeOverlay}>{item.text}</Text>
                  )}
                  <TextInput
                    style={[styles.input, item.state && styles.inputTransparent]}
                    value={item.text}
                    placeholder={screenTexts.ReminderPlaceHolder}
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => handleTextChange(text, index)}
                    onBlur={() => handleBlur(index)}
                    multiline
                  />
                </View>
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
      {loading && <LoadingOverlay />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  strikeOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    color: '#aaa',
    textDecorationLine: 'line-through',
    fontSize: 16,
    paddingVertical: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 4,
  },
  inputTransparent: {
    color: 'transparent',
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20
  },
  customCheckbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#555',
    borderRadius: 4, // <- ajusta esto para hacerla más o menos redondeada
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginLeft: 12,
    marginTop: 4,
  },
  customCheckboxChecked: {
    backgroundColor: '#555',
  }
});

export default Reminder;
