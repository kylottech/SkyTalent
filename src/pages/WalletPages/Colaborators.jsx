import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

//importamos el userUser para las principales funcionalidades
import { useUser } from "../../context/useUser";

import { getRequestsExperience, updateRequestsExperience } from '../../services/experienceServices'
import { getRequestsList, updateRequestsList } from '../../services/walletServices'
import { getRequestsAlbum, updateRequestsAlbum } from '../../services/albumServices'

//importamos componentes propios
import Top from '../../components/Utils/Top';
import SearcherInput from '../../components/Utils/SearcherInput';
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import GradientButton from '../../components/Utils/GradientButton'; // ajusta la ruta si difiere

const Colaborators = ({ route }) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts, logout } = useUser();
  const screenTexts = texts.pages.WalletPages.Colaborators
  const { type, _id } = route.params;

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('');
  const [userInfo, setUserInfo] = useState({});

  // chips añadidos desde el buscador (nuevas solicitudes)
  const [selectedUsers, setSelectedUsers] = useState([]);

  // datos remotos
  const [experienceCollaborators, setExperienceCollaborators] = useState([]); // aceptados
  const [experienceRequests, setExperienceRequests] = useState([]);           // enviadas

  // snapshot para detectar cambios en “aceptados”
  const [experienceCollaboratorsInitial, setExperienceCollaboratorsInitial] = useState([]);

  const [refreshTick, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate('Login');
    }
  }, [isLogged, isLoading]);

  // ------- Loaders por tipo -------
  const handleExperience = async () => {
    try {
      getRequestsExperience({ _id }, logout)
        .then((response) => {
          const colaboradores = Array.isArray(response?.colaborators) ? response.colaborators : [];
          const solicitudes  = Array.isArray(response?.requestsColaborators) ? response.requestsColaborators : [];
          setExperienceCollaborators(colaboradores);
          setExperienceRequests(solicitudes);
          setExperienceCollaboratorsInitial(colaboradores);
          setSelectedUsers([]);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        });
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  };

  const handleList = async () => {
    try {
      getRequestsList({ _id }, logout)
        .then((response) => {
          const colaboradores = Array.isArray(response?.colaborators) ? response.colaborators : [];
          const solicitudes  = Array.isArray(response?.requestsColaborators) ? response.requestsColaborators : [];
          setExperienceCollaborators(colaboradores);
          setExperienceRequests(solicitudes);
          setExperienceCollaboratorsInitial(colaboradores);
          setSelectedUsers([]);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        });
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  };

  const handleAlbum = async () => {
    try {
      getRequestsAlbum({ _id }, logout)
        .then((response) => {
          const colaboradores = Array.isArray(response?.colaborators) ? response.colaborators : [];
          const solicitudes  = Array.isArray(response?.requestsColaborators) ? response.requestsColaborators : [];
          setExperienceCollaborators(colaboradores);
          setExperienceRequests(solicitudes);
          setExperienceCollaboratorsInitial(colaboradores);
          setSelectedUsers([]);
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        });
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  };

  // carga inicial + refresh
  useEffect(() => {
    const t = String(type ?? '').trim();
    if (t === 'Experience') handleExperience();
    else if (t === 'List') handleList();
    else if (t === 'Album') handleAlbum();
  }, [refreshTick, type, _id]);

  // ------- helpers UI -------
  const handleAddUser = (user) => {
    setUserInfo(user);
    setSelectedUsers((prev) => {
      if (prev.some((u) => u._id === user._id)) return prev;
      return [...prev, user];
    });
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleRemoveAccepted = (userId) => {
    setExperienceCollaborators(prev => prev.filter(u => u._id !== userId));
  };

  const sameIds = (a, b) => {
    const aa = (a || []).map(x => x?._id).filter(Boolean).sort();
    const bb = (b || []).map(x => x?._id).filter(Boolean).sort();
    if (aa.length !== bb.length) return false;
    for (let i = 0; i < aa.length; i++) if (aa[i] !== bb[i]) return false;
    return true;
  };

  const hasCollaboratorEdits = useMemo(
    () => !sameIds(experienceCollaborators, experienceCollaboratorsInitial),
    [experienceCollaborators, experienceCollaboratorsInitial]
  );
  const hasNewSelected = selectedUsers.length > 0;
  const hasChanges = hasNewSelected || hasCollaboratorEdits;

  // ------- Update por tipo -------
  const handleUpdateGeneric = async () => {
    try {
      const newSelected = selectedUsers.map(({ _id }) => ({ _id }));
      const editedCollaborators = experienceCollaborators.map(({ _id }) => ({ _id }));
      const payload = { _id, newSelected, editedCollaborators };

      const t = String(type ?? '').trim();
      const updater =
        t === 'List'
          ? updateRequestsList
          : t === 'Album'
          ? updateRequestsAlbum
          : updateRequestsExperience;

      updater(payload, logout)
        .then(() => {
          setConfirmacion(true);
          setConfirmacionMensaje(screenTexts.ConfirmationMensaje);
          setSelectedUsers([]);
          setRefreshTick(n => n + 1); // recarga
        })
        .catch((err) => {
          setError(true);
          setErrorMessage(err.message);
        });
    } catch (err) {
      setError(true);
      setErrorMessage(err.message);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setRefreshTick((n) => n + 1);
    setRefreshing(false);
  }, []);

  // --- Chip de usuario minimalista ---
  const UserChip = ({ user, canRemove, onRemove, status }) => (
    <View style={[styles.chip, status === 'sent' && styles.chipSent, status === 'accepted' && styles.chipAccepted]}>
      <Image source={{ uri: user?.avatar?.url }} style={ styles.chipAvatar } />
      <View style={styles.chipContent}>
        <Text style={styles.chipText}>{user?.name} {user?.surname}</Text>
        <Text style={styles.chipUsername}>@{user?.kylotId}</Text>
      </View>
      {canRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.chipRemove}
          hitSlop={10}
          activeOpacity={0.6}
        >
          <Ionicons name="close-circle" size={20} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Top left={true} leftType={'Back'} typeCenter={'Text'} textCenter={screenTexts.Top} />

      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Minimalista */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nueva colaboración</Text>
          <Text style={styles.headerSubtitle}>¿Con quién te gustaría colaborar?</Text>
        </View>

        {/* Search Section - Prioritized */}
        <View style={styles.searchSection}>
          <SearcherInput
            setUserInfo={handleAddUser}
            userInfo={userInfo}
            setError={setError}
            setErrorMessage={setErrorMessage}
          />
        </View>

        {/* Selected Users - New Collaborations */}
        {selectedUsers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nuevas colaboraciones</Text>
            <Text style={styles.sectionSubtitle}>Usuarios seleccionados para enviar solicitudes</Text>
            <View style={styles.userList}>
              {selectedUsers.map((u) => (
                <UserChip
                  key={u._id}
                  user={u}
                  canRemove={true}
                  status="new"
                  onRemove={() => handleRemoveUser(u._id)}
                />
              ))}
            </View>
          </View>
        )}

        {/* Current Collaborations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Text style={styles.sectionTitle}>Colaboradores actuales</Text>
              <Text style={styles.sectionSubtitle}>Miembros que ya colaboran contigo</Text>
            </View>
          </View>

          {experienceCollaborators.length > 0 ? (
            <View style={styles.userList}>
              {experienceCollaborators.map((u) => (
                <UserChip
                  key={u._id}
                  user={u}
                  canRemove={true}
                  status="accepted"
                  onRemove={() => handleRemoveAccepted(u._id)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons name="people-outline" size={32} color="#667eea" />
              </View>
              <Text style={styles.emptyTitle}>Sin colaboradores</Text>
              <Text style={styles.emptySubtitle}>
                Invita a otros usuarios a colaborar en tu lista y trabaja juntos
              </Text>
              <View style={styles.emptyActionContainer}>
                <Text style={styles.emptyActionText}>💡 Usa el buscador de arriba para invitar</Text>
              </View>
            </View>
          )}
        </View>

        {/* Pending Requests */}
        {experienceRequests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={20} color="#FF9500" style={styles.sectionIcon} />
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Solicitudes pendientes</Text>
                <Text style={styles.sectionSubtitle}>Esperando respuesta</Text>
              </View>
            </View>
            <View style={styles.userList}>
              {experienceRequests.map((u) => (
                <UserChip key={u._id} user={u} canRemove={false} status="sent" />
              ))}
            </View>
          </View>
        )}

        {/* Save Button - Fixed Bottom */}
        {hasChanges && (
          <View style={styles.saveContainer}>
            <GradientButton
              color="Blue"
              text={screenTexts.GradientButton}
              onPress={handleUpdateGeneric}
            />
          </View>
        )}
      </ScrollView>

      {error && <Error message={errorMessage} func={setError} />}
      {confirmacion && <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' 
  },
  content: { 
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40
  },
  
  // Header - Minimalist
  header: {
    marginBottom: 28,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.8,
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.3,
  },

  // Sections - Clean & Minimalist
  section: {
    marginBottom: 36,
  },
  sectionHeader: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sectionIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.5,
    lineHeight: 28,
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
    lineHeight: 21,
    letterSpacing: -0.2,
  },

  // Search Section
  searchSection: {
    marginBottom: 32,
  },

  // User List - Clean Cards
  userList: {
    gap: 12,
  },

  // User Chips - Premium Design
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E7',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  chipSent: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFE4B5',
  },
  chipAccepted: {
    backgroundColor: '#F0F8FF',
    borderColor: '#BFDBFE',
  },
  chipAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chipContent: {
    flex: 1,
  },
  chipText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.3,
    lineHeight: 20,
  },
  chipUsername: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    letterSpacing: -0.2,
    lineHeight: 18,
  },
  chipRemove: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#FFF1F1',
  },

  // Empty State - Premium Design
  emptyState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 40,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F2FF',
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
    lineHeight: 26,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    letterSpacing: -0.1,
    paddingHorizontal: 8,
  },
  emptyActionContainer: {
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E8FF',
  },
  emptyActionText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.1,
  },

  // Save Button Container
  saveContainer: {
    marginTop: 24,
    paddingHorizontal: 8,
  },

});

export default Colaborators;
