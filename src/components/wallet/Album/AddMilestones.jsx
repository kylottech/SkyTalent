import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { useUser } from "../../../context/useUser";
import { createMilestones, updateMilestones } from "../../../services/albumServices"
import LoadingOverlay from '../../Utils/LoadingOverlay';
import GradientButton from '../../Utils/GradientButton';
import Error from '../../Utils/Error';

const AddMilestones = ({ visible, onClose, _id, setConfirmacion, setConfirmacionMensaje, llamada, edit, infoClean }) => {
  const { texts, logout } = useUser();
  const screenTexts = texts.components.Wallet.Album.AddMilestones;
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const handleGetInfo = () => {
      setLoading(true);

      if(name.trim() !== ''){
        createMilestones({ _id: _id, name: name }, logout)
        .then(() => {
          setLoading(false)
          setConfirmacion(true)
          setConfirmacionMensaje(screenTexts.CreateConfirmation)
          llamada()
          onClose()
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false);
        });
      }
      else{
        setError(true);
          setErrorMessage(screenTexts.CreateError);
          setLoading(false);
      }
  
      
  };

  const handleupdate = () => {
      setLoading(true);

      if(name.trim() !== ''){
        updateMilestones({ _id: _id, _idMilestones: edit._id, name: name }, logout)
        .then(() => {
          setLoading(false)
          setConfirmacion(true)
          setConfirmacionMensaje(screenTexts.SaveConfirmation)
          llamada()
          onClose()
          infoClean()
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
          setLoading(false);
        });
      }
      else{
        setError(true);
          setErrorMessage(screenTexts.CreateError);
          setLoading(false);
      }
  
      
  };

  const handleType = () => {
      if(edit){
        handleupdate()
      } else {
        handleGetInfo()
      }
  
      
  };

  useEffect(() => {
    if(edit){
      setName(edit.title)
    }
  }, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={() => {
            Keyboard.dismiss();
            onClose();
        }}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            {/* Header con buscador */}
            <View style={styles.header}>
              <Text style={styles.title}>{screenTexts.Title}</Text>
              <Text style={styles.text}>{screenTexts.Subtitle}</Text>
            </View>

            <View style={styles.field}>
                <Text style={styles.label}>{screenTexts.NameTitle}</Text>
                <TextInput
                    style={styles.input}
                    placeholder={screenTexts.NamePlaceHolder}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.button}>
                <GradientButton
                  color="Blue"
                  text= {screenTexts.GradientButton}
                  onPress={() => {
                    handleType()
                  }}
                />
            </View>

            
          </View>
        </View>
      </TouchableWithoutFeedback>
      {error && <Error message={errorMessage} func={setError} />}
      {loading && <LoadingOverlay />}
    </Modal>
  );
};

export default AddMilestones;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    maxHeight: '80%',
    minHeight: '40%',
  },
  header: {
    position: 'relative',
    zIndex: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  headerIcons: {
    width: '100%',
    marginTop: 10,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: 'white',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  username: {
    color: 'gray',
    fontSize: 13,
  },
  iconRight: {
    marginLeft: 10,
  },
  absoluteSearchBox: {
    position: 'absolute',
    top: 80, // ajusta si tu buscador es más alto
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 10,
    elevation: 10,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  emptyText: {
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 10
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#111827',
  },
  button:{
    alignSelf: 'center',
    width: '100%'
  }
});
