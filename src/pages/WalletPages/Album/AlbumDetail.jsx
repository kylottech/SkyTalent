import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Progress from "react-native-progress";
import { useUser } from '../../../context/useUser';
import { formatString } from '../../../utils/formatString'
import { getAlbum, completeMilestones, copy, postAlbumDecision, deletePhoto, deleteMilestones } from '../../../services/albumServices';
import PhotoAlbum from '../../../components/wallet/Album/PhotoAlbum';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';
import Top from '../../../components/Utils/Top';
import Error from '../../../components/Utils/Error';
import Confirmacion from '../../../components/Utils/Confirmacion';
import AddMilestones from '../../../components/wallet/Album/AddMilestones';
import ImageView from 'react-native-image-viewing';
import * as ImagePicker from 'expo-image-picker';
import GradientButton from '../../../components/Utils/GradientButton';
import EditMilestoneModal from '../../../components/wallet/Album/EditMilestoneModal';

export default function AlbumDetail({ route }) {
  const navigate = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Album.AlbumDetail;

  const [loading, setLoading] = useState(false);
  const [visibleAdd, setVisibleAdd] = useState(false);
  const [info, setInfo] = useState({});
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  const [imageVisible, setImageVisible] = useState(false);
  const [imageToView, setImageToView] = useState({ uri: '', title: '', date: '' });
  const [editMilestones, setEditMilestones] = useState(false);
  const [visibleEditMilestones, setVisibleEditMilestones] = useState(false);
  const [selectedMilestones, setSelectedMilestones] = useState(null);

  const { _id } = route.params;

  const handleGetInfo = () => {
    setLoading(true);
    getAlbum({ _id }, logout)
      .then((res) => {
        setInfo(res);
        setLoading(false);
        const items = Array.isArray(res.milestones) ? res.milestones : [];
        const completedCount = items.filter((m) => m.photo).length;
        const totalCount = items.length;
        setCompleted(completedCount);
        setTotal(totalCount);
        setPercentage(totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100));
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
        setLoading(false);
      });
  };

  const handleCompleteMilestones = ({ milestoneId, selectedImage }) => {
    setLoading(true);
    completeMilestones({ _id, _idMilestones: milestoneId, selectedImage }, logout)
      .then(() => {
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.CompleteMilestoneConfirmation);
        handleGetInfo()
        setLoading(false);
        setVisibleEditMilestones(false)
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
        setLoading(false);
      });
  };

  const handleDeletePhoto = (milestoneId) => {
    setLoading(true);
    deletePhoto({ _id, _idMilestones: milestoneId }, logout)
      .then(() => {
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.DeleteMilestoneConfirmation);
        handleGetInfo()
        setVisibleEditMilestones(false)
        setSelectedMilestones(null)
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
        setLoading(false);
      });
  };

  const handleDeleteMilestones = (milestoneId) => {
    setLoading(true);
    deleteMilestones({ _id, _idMilestones: milestoneId }, logout)
      .then(() => {
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.DeleteMilestoneConfirmation);
        handleGetInfo()
        setVisibleEditMilestones(false)
        setSelectedMilestones(null)
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
        setLoading(false);
      });
  };

  const handleCopy = () => {
    setLoading(true);
    copy({ _id }, logout)
      .then(() => {
        setConfirmacion(true);
        setConfirmacionMensaje(screenTexts.CopyConfirmation);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setErrorMessage(err.message);
        setLoading(false);
      });
  };

  // Aceptar / rechazar invitación (mismos estilos que List)
  const handleColaboration = async (decision) => {
    if (loading) return;
    setLoading(true);
    try {
      const resp = await postAlbumDecision({ _id, decision }, logout);
      if (resp?.ok) {
        setInfo((prev) => ({ ...prev, request: false, mine: decision ? true : prev.mine }));
      }
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleGetInfo();
  }, []);

  const handleImagePress = (uri, title, date) => {
    setImageToView({ uri, title, date });
    setImageVisible(true);
  };

  const handleAddPhoto = async (milestoneId) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        handleCompleteMilestones({ milestoneId, selectedImage: imageUri });
        handleGetInfo();
        setSelectedMilestones(null)
      }
    } catch (e) {
      setError(true);
      setErrorMessage(e.message);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} right={false} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{info.name}</Text>
            <Text style={styles.subtitle}>{info.descripcion}</Text>
          </View>
          
          <View style={styles.actionsSection}>
            <View style={styles.progressContainer}>
              <Progress.Circle
                progress={completed === 0 || total === 0 ? 0 : (completed / total)}
                size={60}
                thickness={4}
                color="#1D7CE4"
                unfilledColor="#F2F2F7"
                borderWidth={0}
                showsText={true}
                formatText={() => `${total === 0 ? 0 : Math.round((completed / total) * 100)}%`}
                textStyle={{ fontSize: 14, fontWeight: '600', color: '#1D1D1F' }}
              />
            </View>
            
            {!info.mine ? (
              <TouchableOpacity style={styles.actionButton} onPress={handleCopy}>
                <Text style={styles.actionButtonText}>{screenTexts.Copy}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigate.navigate('Colaborators', { type: 'Album', _id })}
              >
                <Text style={styles.actionButtonText}>{screenTexts.ColaboratorsButton}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <Text style={styles.progressText}>
            {formatString(screenTexts.Percentage, { variable1: completed, variable2: total })}
          </Text>
          
          {editMilestones && (
            <TouchableOpacity 
              style={styles.cancelEditButton}
              onPress={() => {setEditMilestones(false), setSelectedMilestones(null)}}
            >
              <Text style={styles.cancelEditText}>{screenTexts.CancelButton}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Collaboration Invitation */}
        {info.request && (
          <View style={styles.invitationCard}>
            <Text style={styles.inviteTitle}>{screenTexts.ColaboratorsInvitation}</Text>
            <View style={styles.decisionsRow}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleColaboration(true)}>
                <Text style={styles.acceptText}>{screenTexts.ColaboratorsInvitationAcept}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleColaboration(false)}>
                <Text style={styles.rejectText}>{screenTexts.ColaboratorsInvitationReject}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Photos Grid */}
        <View style={styles.photosSection}>
          {(() => {
            let items = Array.isArray(info.milestones) ? info.milestones : [];
            if (info.mine) items = [...items, { isAddButton: true }];

            const rows = [];
            for (let i = 0; i < items.length; i += 3) {
              const rowItems = items.slice(i, i + 3);
              rows.push(
                <View key={`row-${i}`} style={styles.photoRow}>
                  {rowItems.map((item, idx) =>
                    item.isAddButton ? (
                      <PhotoAlbum key="add" Add={() => setVisibleAdd(true)} mine={info.mine} />
                    ) : (
                      <PhotoAlbum
                        key={item._id || idx}
                        {...item}
                        onPress={handleImagePress}
                        onAddPhoto={() => handleAddPhoto(item._id)}
                        mine={info.mine}
                        editMilestones={editMilestones}
                        setEditMilestones={setEditMilestones}
                        setVisibleEditMilestones = {setVisibleEditMilestones}
                        setSelectedMilestones = {() => setSelectedMilestones(item)}
                      />
                    )
                  )}
                </View>
              );
            }
            return rows;
          })()}
        </View>
      </ScrollView>

      <AddMilestones
        visible={visibleAdd}
        onClose={() => setVisibleAdd(false)}
        _id={_id}
        setConfirmacion={setConfirmacion}
        setConfirmacionMensaje={setConfirmacionMensaje}
        llamada={handleGetInfo}
        edit={selectedMilestones}
        infoClean={() => setSelectedMilestones(null)}
      />

      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
      {error && <Error message={errorMessage} func={setError} />}
      {loading && <LoadingOverlay />}

      <ImageView
        images={[{ uri: imageToView.uri }]}
        imageIndex={0}
        visible={imageVisible}
        onRequestClose={() => setImageVisible(false)}
        FooterComponent={() => (
          <View style={{ padding: 16 }}>
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>{imageToView.title}</Text>
            <Text style={{ color: 'white', fontSize: 14 }}>{formatDate(imageToView.date)}</Text>
          </View>
        )}
      />

      <EditMilestoneModal
        isOpen={visibleEditMilestones}
        onClose={() => setVisibleEditMilestones(false)}
        editFunc={() => {setVisibleAdd(true), setVisibleEditMilestones(false)}}
        createFunc={() => {handleAddPhoto(selectedMilestones._id)}}
        deletePhoto={() => handleDeletePhoto(selectedMilestones._id)}
        deleteFunc={() => handleDeleteMilestones(selectedMilestones._id)}
        infoClean={() => setSelectedMilestones(null)}
      />

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: { 
    paddingHorizontal: 20, 
    paddingTop: 20, 
    paddingBottom: 40,
  },
  
  // Header Section
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  titleSection: {
    flex: 1,
    marginRight: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#1D1D1F',
    marginBottom: 6,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  subtitle: { 
    fontSize: 16, 
    color: '#86868B', 
    fontWeight: '400',
    lineHeight: 22,
  },
  
  // Actions Section
  actionsSection: {
    alignItems: 'flex-end',
  },
  progressContainer: {
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: '#1D7CE4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#1D7CE4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  
  // Progress Section
  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  progressText: { 
    fontSize: 16, 
    color: '#86868B', 
    fontWeight: '500',
  },
  cancelEditButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  cancelEditText: {
    color: '#1D7CE4', 
    fontWeight: '600', 
    fontSize: 16,
  },
  
  // Invitation Section
  invitationCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  inviteTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1D1D1F',
    marginBottom: 16,
    textAlign: 'center',
  },
  decisionsRow: { 
    flexDirection: 'row', 
    gap: 12,
  },
  acceptButton: { 
    flex: 1,
    backgroundColor: '#1D7CE4', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#1D7CE4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  acceptText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 16,
  },
  rejectButton: { 
    flex: 1,
    backgroundColor: '#FF3B30', 
    paddingVertical: 14, 
    borderRadius: 12, 
    alignItems: 'center',
    shadowColor: '#FF3B30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  rejectText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    fontSize: 16,
  },
  
  // Photos Section
  photosSection: {
    marginTop: 8,
  },
  photoRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 16, 
    gap: 12,
  },
});
