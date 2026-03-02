import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { saveList, deleteList, postListDecision } from '../../../services/walletServices';
import TextLine from '../../Utils/TextLine';
import ListElement from '../Experiences/ListElement';
import GradientButton from '../../Utils/GradientButton';

import kylot from '../../../../assets/KylotList.jpg';
import Empty_heart from '../../../../assets/empty_save.png';
import Full_heart from '../../../../assets/full_save.png';
import change from '../../../../assets/change.png';
import back from '../../../../assets/arrow_left.png';

const List = (props) => {
  const navigate = useNavigation();
  const { logout, texts, translateTag } = useUser();
  const screenTexts = texts.components.Blocks.Experiences.List;

  const [banner, setBanner] = useState(props.info.list.avatar.url);
  const [saved, setSaved] = useState(props.info.list.saved);

  // NUEVO: control de invitación y propiedad
  const [request, setRequest] = useState(!!props.info.list.request);
  const [isMine, setIsMine] = useState(!!props.info.user.mine);

  // Modal para editar
  const [showEditModal, setShowEditModal] = useState(false);

  const handleQuitList = async () => {
    if (!props.loading) {
      props.setLoading(true);
      try {
        deleteList(props.info.list._id, logout)
          .then(() => {
            setSaved(false);
            props.setConfirmacionMensaje(screenTexts.DeleteListConfirmation);
            props.setConfirmacion(true);
            props.setLoading(false);
          })
          .catch((error) => {
            props.setError(true);
            props.setErrorMessage(error.message);
            props.setLoading(false);
          });
      } catch (error) {
        props.setError(true);
        props.setErrorMessage(error.message);
        props.setLoading(false);
      }
    }
  };

  const handleAddList = async () => {
    if (!props.loading) {
      try {
        props.setLoading(true);
        saveList(props.info.list._id, logout)
          .then(() => {
            setSaved(true);
            props.setConfirmacionMensaje(screenTexts.SaveListConfirmation);
            props.setConfirmacion(true);
            props.setLoading(false);
          })
          .catch((error) => {
            props.setError(true);
            props.setErrorMessage(error.message);
            props.setLoading(false);
          });
      } catch (error) {
        props.setError(true);
        props.setErrorMessage(error.message);
        props.setLoading(false);
      }
    }
  };

  const handlePress = () => {
    if (saved) handleQuitList();
    else handleAddList();
  };

  // NUEVO: aceptar / rechazar colaboración en lista
  const handleColaboration = async (decision) => {
    if (props.loading) return;
    props.setLoading(true);
    try {
      const resp = await postListDecision({ _id: props.info.list._id, decision }, logout);
      // esperado: { ok: true, accepted: boolean, listId: '...' }
      if (resp?.ok) {
        setRequest(false);         // ocultar bloque
        if (resp.accepted) setIsMine(true); // ya es colaborador
      }
    } catch (error) {
      props.setError(true);
      props.setErrorMessage(error.message);
    } finally {
      props.setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigate.goBack()}>
          <Image source={back} style={styles.backIcon} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Image source={kylot} style={styles.logo} />
        </View>

        <View style={styles.spacer} />
      </View>

      <View style={styles.bannerContainer}>
        <Image source={{ uri: banner }} style={styles.banner} />
        <View style={styles.bannerOverlay} />
        
        {!isMine && (
          <TouchableOpacity style={styles.saveButton} onPress={handlePress}>
            <Image source={saved ? Full_heart : Empty_heart} style={styles.saveIcon} resizeMode="contain" />
          </TouchableOpacity>
        )}
        
        <View style={styles.userInfo}>
          <Image source={{ uri: props.info.user.photo.url }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{props.info.user.name}</Text>
            <Text style={styles.userHandle}>@{props.info.user.kylotId}</Text>
        </View>

        {isMine && (
            <TouchableOpacity style={styles.editButton} onPress={() => setShowEditModal(true)}>
              <Image source={change} style={styles.editIcon} />
            </TouchableOpacity>
        )}
        </View>
      </View>

      {/* Bloque de invitación */}
      {request && (
        <View style={styles.invitationContainer}>
          <Text style={styles.inviteTitle}>{screenTexts.ColaboratorsInvitation}</Text>
          <View style={styles.decisionsRow}>
            <View style={styles.acceptButton}>
            <GradientButton
              color="Blue"
              text={screenTexts.ColaboratorsInvitationAcept}
              onPress={() => handleColaboration(true)}
            />
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleColaboration(false)}>
              <Text style={styles.cancelText}>{screenTexts.ColaboratorsInvitationReject}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        <View style={styles.titleSection}>
          <Text style={styles.listTitle}>{props.info.list.name}</Text>
          <Text style={styles.listDescription}>{props.info.list.descripcion}</Text>
          <Text style={styles.saveCount}>{props.info.list.numFollowers} {props.info.list.numFollowers === 1 ? 'persona se ha guardado esta lista' : 'personas se han guardado esta lista'}</Text>
        </View>
      
        <Text style={styles.sectionTitle}>{screenTexts.Title}</Text>

        <ScrollView style={styles.placesScroll} nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>

        {props.info.list.places.map((item) => (
          <ListElement
            key={item._id}
            info={item}
            onPress={props.onPress}
            idLista={props.info.list._id}
            mine={isMine}
            setError={props.setError}
            setErrorMessage={props.setErrorMessage}
            setConfirmacion={props.setConfirmacion}
            setConfirmacionMensaje={props.setConfirmacionMensaje}
          />
        ))}
      </ScrollView>
      </View>

      {/* Modal: Editar / Editar colaboradores / Cancelar */}
      <Modal
        transparent
        visible={showEditModal}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowEditModal(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.optionBox}>
                <GradientButton
                  text={screenTexts.GradientButton}
                  color="Blue"
                  onPress={() => {
                    setShowEditModal(false);
                    navigate.navigate('AddList', {
                      type: 'edit',
                      info: props.info.list,
                    });
                  }}
                />
                <GradientButton
                  text={screenTexts.GradientButton2}
                  color="Blue"
                  onPress={() => {
                    setShowEditModal(false);
                    navigate.navigate('Colaborators', { type: 'List', _id: props.info.list._id });
                  }}
                />
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => setShowEditModal(false)}
                >
                  <Text style={styles.modalOptionText}>{screenTexts.CancelButton}</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 108,
    height: 54,
    resizeMode: 'contain',
  },
  heartButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    width: 24,
    height: 24,
    tintColor: '#1D7CE4',
  },
  spacer: {
    width: 44,
  },
  bannerContainer: {
    height: 200,
    position: 'relative',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  banner: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  saveButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveIcon: {
    width: 20,
    height: 20,
    tintColor: '#1D7CE4',
  },
  userInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userHandle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  editButton: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  editIcon: {
    width: 18,
    height: 18,
    tintColor: '#1D7CE4',
  },
  invitationContainer: {
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  decisionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 12,
  },
  titleSection: {
    marginBottom: 24,
  },
  listTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
    lineHeight: 28,
  },
  listDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    fontWeight: '400',
    marginBottom: 8,
  },
  saveCount: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  placesScroll: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  optionBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  modalOption: {
    paddingVertical: 16,
    width: '100%',
    marginTop: 8,
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
  },
});

export default List;
