import React, { useState, useEffect, useCallback } from 'react';
import {
  View, StyleSheet, Text, TouchableOpacity, ScrollView, Image,
  RefreshControl, ActivityIndicator,
  ImageBackground, Linking, Modal, TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from "../../context/useUser";
import { getUsers, getInfo, acept, reject, request } from '../../services/groupsServices';
import { getGroupActivities } from '../../services/activitiesServices';
import { getGroupPolls, getGroupStories } from '../../services/groupSocialServices';
import { formatString } from '../../utils/formatString'
import Top from '../../components/Utils/Top';
import User from '../../components/Blocks/Community/User';
import GradientButton from '../../components/Utils/GradientButton';
import createButton from '../../../assets/createButton.png'
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import BlockedFuncionality from '../../components/Utils/BlockedFuncionality'
import Error from '../../components/Utils/Error';
import Confirmacion from '../../components/Utils/Confirmacion';
import ActivityCard from '../../components/Blocks/Community/Groups/ActivityCard';
import AddActivity from '../../components/Blocks/Community/Groups/AddActivity';
import AddPollModal from '../../components/Blocks/Community/Groups/AddPollModal';
import AddStoryModal from '../../components/Blocks/Community/Groups/AddStoryModal';

const GroupDetail = ({ route }) => {
  const navigate = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.ComunidadPages.GroupDetail;

  // Helper function to validate image URI
  const getValidImageUri = (uri, fallback) => {
    if (!uri || typeof uri !== 'string' || uri.trim() === '') {
      return fallback;
    }
    return uri;
  };

  const { _id, name } = route.params;

  const [selected, setSelected] = useState(1);
  const [description, setDescription] = useState('');
  const [isInvited, setIsInvited] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMember, setIsMember] = useState(true);
  const [banner, setBanner] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [numRequest, setNumRequest] = useState(0);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmacion, setConfirmacion] = useState(false);
  const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [polls, setPolls] = useState([]);
  const [stories, setStories] = useState([]);
  const [pollsLoading, setPollsLoading] = useState(false);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showCreatePollModal, setShowCreatePollModal] = useState(false);
  const [showCreateStoryModal, setShowCreateStoryModal] = useState(false);
  const [showSocialOptionsModal, setShowSocialOptionsModal] = useState(false);
  
  const handleAcept = async () => {
      setLoading(true);
      try {
          acept({ _id }, logout)
              .then(() => {
                  setConfirmacion(true)
                  setConfirmacionMensaje(screenTexts.AceptConfirmation)
                  setIsInvited(false)
                  setIsMember(true)
                  setLoading(false)
              })
              .catch((error) => {
                  setError(true);
                  setErrorMessage(error.message);
                  setLoading(false)
              })
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          setLoadingInvitations(false);
          setLoading(false)
      }
  }

  const handleReject = async () => {
      setLoading(true);
      try {
          reject({ _id }, logout)
              .then(() => {
                  setConfirmacion(true)
                  setConfirmacionMensaje(screenTexts.RejectConfirmation)
                  setIsInvited(false)
                  setLoading(false)
              })
              .catch((error) => {
                  setError(true);
                  setErrorMessage(error.message);
                  setLoading(false)
              })
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
      }
  }

  const handleRequest = async () => {
      setLoading(true);
      try {
          request({ _id }, logout)
              .then(() => {
                  if(isPublic){
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.RequestPublicConfirmation)
                    setIsMember(true)
                  }
                  else {
                    setConfirmacion(true)
                    setConfirmacionMensaje(screenTexts.RequestConfirmation)
                    setIsRequest(true)
                  }
                  setLoading(false)
                  
              })
              .catch((error) => {
                  setError(true);
                  setErrorMessage(error.message);
                  setLoading(false)
              })
      } catch (error) {
          setError(true);
          setErrorMessage(error.message);
          () => setLoading(false)
      }
  }

  const handleInfo = () => {
    if(!loadingBlocked){
      setLoadingBlocked(true);

      getInfo({ _id }, logout)
        .then((res) => {
          setDescription(res.description)
          setIsPublic(res.automaticAprove)
          setIsInvited(res.isInvited)
          setIsAdmin(res.isAdmin)
          setIsMember(res.isMember)
          setBanner(res.banner)
          setAvatar(res.avatar)
          setNumRequest(res.requestCount)
          setIsRequest(res.isRequest)
          setLoadingBlocked(false);
        })
        .catch((error) => {
          console.log(error)
          setLoadingBlocked(false);
        })
    }
    
  }

  const handleUsers = (reset = false) => {
    if (!hasMore && !reset) return;

    setLoading(true);
    const currentPage = reset ? 1 : page;

    getUsers({ _id, page: currentPage }, logout)
      .then((res) => {
        if (res && Array.isArray(res.users)) {
          setUsers(prev => reset ? res.users : [...prev, ...res.users]);
          setPage(prev => reset ? 2 : prev + 1);
          setHasMore(res.users.length > 0);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error.message);
        setHasMore(false);
        setLoading(false);
      })
  }

  const handleActivities = () => {
    setLoading(true);

    getGroupActivities({ _id }, logout)
      .then((res) => {
        setActivities(res)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching users:", error.message);
        setHasMore(false);
        setLoading(false);
      })
  }

  const loadGroupPolls = async () => {
    if (!_id) return;
    setPollsLoading(true);
    try {
      const result = await getGroupPolls({ groupId: _id }, logout);
      setPolls(result.polls || []);
    } catch (error) {
      console.error('Error loading polls:', error);
    } finally {
      setPollsLoading(false);
    }
  };

  const loadGroupStories = async () => {
    if (!_id) return;
    setStoriesLoading(true);
    try {
      const result = await getGroupStories({ groupId: _id }, logout);
      setStories(result.stories || []);
    } catch (error) {
      console.error('Error loading stories:', error);
    } finally {
      setStoriesLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleInfo()
    if (selected === 1) {
      handleUsers(true);
    } else if (selected === 2) {
      loadGroupPolls();
      loadGroupStories();
    } else if (selected === 3) {
      handleActivities()
    }
    setRefreshing(false);
  }, [selected]);

  useEffect(() => {
    if (selected === 1) {
      handleUsers(true);
    } else if (selected === 2) {
      loadGroupPolls();
      loadGroupStories();
    } else if (selected === 3) {
      handleActivities();
    }
  }, [selected]);

  useEffect(() => {
    handleInfo()
  }, []);

  const handleScroll = ({ nativeEvent }) => {
    if (selected !== 2) return;

    const paddingToBottom = 20;
    const isCloseToBottom =
      nativeEvent.layoutMeasurement.height + nativeEvent.contentOffset.y >=
      nativeEvent.contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loading && hasMore) {
      handleUsers();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Top
        left={true}
        leftType={'Back'}
        typeCenter={'Text'}
        textCenter={name}
        right={false}
      />
      
      {/* Main Content */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onScroll={handleScroll}
        scrollEventThrottle={400}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Group Info Section - Inspired by The Offline Club */}
        <View style={styles.groupInfoCard}>
          {/* Group Banner and Profile Image */}
          <View style={styles.groupImageContainer}>
            <Image 
              source={{ uri: getValidImageUri(banner?.url || banner, 'https://via.placeholder.com/400x150/1D7CE4/FFFFFF?text=Grupo') }} 
              style={styles.groupBanner} 
              onError={() => console.log('Error loading group banner')}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.groupProfileImageContainer}>
              <Image 
                source={{ uri: getValidImageUri(avatar?.url || avatar, 'https://via.placeholder.com/120x120/1D7CE4/FFFFFF?text=G') }} 
                style={styles.groupProfileImage} 
                onError={() => console.log('Error loading group avatar')}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
          
          <View style={styles.groupDetails}>
            <Text style={styles.groupName}>{name}</Text>
            {(description || screenTexts.DescriptionTitle) && (
              <Text style={styles.groupDescription}>
                {description || 'Conecta con amigos y descubre nuevas actividades juntos'}
              </Text>
            )}
          </View>
          
          {/* Member Status Actions */}
          {(!isMember && !isInvited && !isRequest) && (
            <TouchableOpacity style={styles.subscribeButton} onPress={() => handleRequest()}>
              <Text style={styles.subscribeText}>{screenTexts.NotMemberButton}</Text>
            </TouchableOpacity>
          )}
          
          {(!isMember && !isInvited && isRequest) && (
            <View style={styles.pendingButton}>
              <Text style={styles.pendingText}>{screenTexts.RequestTitle}</Text>
            </View>
          )}
          
          {(!isMember && isInvited && !isRequest) && (
            <View style={styles.invitationActions}>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAcept()}>
                <Text style={styles.acceptText}>{screenTexts.InvitationButton1}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.declineButton} onPress={() => handleReject()}>
                <Text style={styles.declineText}>{screenTexts.InvitationButton2}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Navigation Section - Standard Tab Design */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selected === 1 && styles.activeTab]}
            onPress={() => setSelected(1)}
          >
            <Text style={[styles.tabText, selected === 1 && styles.activeTabText]}>
              {screenTexts.Menu1}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selected === 2 && styles.activeTab]}
            onPress={() => setSelected(2)}
          >
            <Text style={[styles.tabText, selected === 2 && styles.activeTabText]}>
              {screenTexts.Menu2}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selected === 3 && styles.activeTab]}
            onPress={() => setSelected(3)}
          >
            <Text style={[styles.tabText, selected === 3 && styles.activeTabText]}>
              {screenTexts.Menu3}
            </Text>
          </TouchableOpacity>
          
          {/* Admin Section */}
          {(isAdmin && !isPublic) && selected === 3 && (
            <View style={styles.adminSection}>
              <TouchableOpacity 
                style={styles.adminButton}
                onPress={() => navigate.navigate("GroupRequest", {_id})}
              >
                <Text style={[styles.adminButtonText, numRequest > 0 && styles.adminButtonTextActive]}>
                  {formatString(screenTexts.Request, { variable1: numRequest })}
                </Text>
                {numRequest > 0 && (
                  <View style={styles.adminBadge}>
                    <Text style={styles.adminBadgeText}>{numRequest}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          {selected === 1 ? (
            // Users Tab
            <View style={styles.usersContainer}>
              {users.length > 0 ? (
                <>
                  {users.map((item, index) => (
                    <User
                      key={`user-${index}`}
                      profileImage={item.avatar?.url || item.avatar || null}
                      fullName={`${item.name || ''} ${item.surname || ''}`}
                      username={item.kylotId || ''}
                      _id={item._id}
                    />
                  ))}
                  
                  {/* Loading indicator */}
                  {loading && hasMore && (
                    <ActivityIndicator
                      style={{ marginVertical: 24 }}
                      size="small"
                      color="#007AFF"
                    />
                  )}
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons name="people-outline" size={48} color="#8E8E93" />
                  <Text style={styles.emptyStateText}>No hay miembros aún</Text>
                </View>
              )}
            </View>
          ) : selected === 2 ? (
            // Social Tab
            <View style={styles.socialContainer}>
              {/* WhatsApp Integration - Clean Section */}
              {(isAdmin || isMember) && (
                <View style={styles.whatsappSectionElegant}>
                  <Text style={styles.sectionTitleElegant}>WhatsApp</Text>
                  {whatsappLink ? (
                    <View style={styles.whatsappConnectedElegant}>
                      <Text style={styles.whatsappStatusElegant}>Conectado</Text>
                      <TouchableOpacity 
                        style={styles.whatsappButtonElegant}
                        onPress={() => Linking.openURL(whatsappLink)}
                      >
                        <Ionicons name="logo-whatsapp" size={18} color="#FFFFFF" />
                        <Text style={styles.whatsappButtonTextElegant}>Abrir chat</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.whatsappDisconnectedElegant}>
                      <Text style={styles.whatsappStatusElegant}>No conectado</Text>
                      {isAdmin && (
                        <TouchableOpacity 
                          style={styles.connectButtonElegant}
                          onPress={() => setShowWhatsappModal(true)}
                        >
                          <Ionicons name="add" size={18} color="#007AFF" />
                          <Text style={styles.connectButtonTextElegant}>Conectar</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              )}

              {/* Quick Polls Section - Elegant */}
              <View style={styles.pollsSectionElegant}>
                <Text style={styles.sectionTitleElegant}>Encuestas rápidas</Text>
                <Text style={styles.sectionSubtitleElegant}>
                  {pollsLoading ? 'Cargando encuestas...' : 
                   polls.length > 0 ? `${polls.length} encuestas activas` : 'No hay encuestas activas'}
                </Text>
                
                {pollsLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#1D7CE4" />
                    <Text style={styles.loadingText}>Cargando encuestas...</Text>
                  </View>
                ) : polls.length > 0 ? (
                  <View style={styles.pollsListElegant}>
                    {polls.map((poll, index) => (
                      <View key={poll._id || index} style={styles.pollCardElegant}>
                        <Text style={styles.pollQuestionElegant}>{poll.question}</Text>
                        <View style={styles.pollOptionsElegant}>
                          {poll.options.map((option, optionIndex) => (
                            <TouchableOpacity key={optionIndex} style={styles.pollOptionElegant}>
                              <Text style={styles.pollOptionTextElegant}>{option.text}</Text>
                              <Text style={styles.pollVotesElegant}>{option.votes || 0}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                        <Text style={styles.pollDateElegant}>
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateElegant}>
                    <Ionicons name="bar-chart-outline" size={32} color="#C7C7CC" />
                    <Text style={styles.emptyStateTextElegant}>No hay encuestas activas</Text>
                    {(isAdmin || isMember) && (
                      <TouchableOpacity 
                        style={styles.createFirstButton}
                        onPress={() => setShowCreatePollModal(true)}
                      >
                        <LinearGradient
                          colors={['#1D7CE4', '#004999']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.createFirstButtonGradient}
                        >
                          <Ionicons name="add" size={20} color="#FFFFFF" />
                          <Text style={styles.createFirstButtonText}>Crear la primera encuesta</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>

              {/* Stories Section - Elegant */}
              <View style={styles.storiesSectionElegant}>
                <Text style={styles.sectionTitleElegant}>Historias</Text>
                <Text style={styles.sectionSubtitleElegant}>
                  {storiesLoading ? 'Cargando historias...' : 
                   stories.length > 0 ? `${stories.length} historias activas` : 'No hay historias recientes'}
                </Text>
                
                {storiesLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#1D7CE4" />
                    <Text style={styles.loadingText}>Cargando historias...</Text>
                  </View>
                ) : stories.length > 0 ? (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesScrollElegant}>
                    {stories.map((story, index) => (
                      <TouchableOpacity key={story._id || index} style={styles.storyCardElegant}>
                        <Image 
                          source={{ uri: getValidImageUri(story.imageUrl || story.image, 'https://via.placeholder.com/80x120/1D7CE4/FFFFFF?text=Story') }} 
                          style={styles.storyImageElegant} 
                          onError={() => console.log('Error loading story image')}
                          resizeMode="cover"
                        />
                        <View style={styles.storyOverlayElegant}>
                          <Text style={styles.storyTimeElegant}>
                            {story.timeLeft || '24h'}
                          </Text>
                        </View>
                        {story.description && (
                          <View style={styles.storyDescriptionElegant}>
                            <Text style={styles.storyDescriptionTextElegant} numberOfLines={2}>
                              {story.description}
                            </Text>
                          </View>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View style={styles.emptyStateElegant}>
                    <Ionicons name="camera-outline" size={32} color="#C7C7CC" />
                    <Text style={styles.emptyStateTextElegant}>No hay historias recientes</Text>
                    {(isAdmin || isMember) && (
                      <TouchableOpacity 
                        style={styles.createFirstButton}
                        onPress={() => setShowCreateStoryModal(true)}
                      >
                        <LinearGradient
                          colors={['#1D7CE4', '#004999']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.createFirstButtonGradient}
                        >
                          <Ionicons name="add" size={20} color="#FFFFFF" />
                          <Text style={styles.createFirstButtonText}>Crear la primera historia</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            </View>
          ) : (
            // Activities Tab
            <>
              {(isPublic || isMember) ? (
                <View style={styles.activitiesContainer}>
                  {activities.length > 0 ? (
                    activities.map((item, index) => (
                      <ActivityCard key={index} info={item} />
                    ))
                  ) : (
                    <View style={styles.emptyState}>
                      <Ionicons name="calendar-outline" size={48} color="#8E8E93" />
                      <Text style={styles.emptyStateText}>No hay actividades programadas</Text>
                      <TouchableOpacity 
                        style={styles.createActivityButton}
                        onPress={() => setShowAddActivityModal(true)}
                      >
                        <LinearGradient
                          colors={['#1D7CE4', '#004999']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.createButtonGradient}
                        >
                          <Text style={styles.createButtonText}>Crear la primera actividad</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.blockedContainer}>
                  <BlockedFuncionality group={true} />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Button - Only show in Social tab */}
      {selected === 2 && (isAdmin || isMember) && (
        <LinearGradient
          colors={[ '#1D7CE4', '#004999']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.buttonGradient}
        >
          <TouchableOpacity onPress={() => setShowSocialOptionsModal(true)}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>
      )}

      {error &&

      <Error message={errorMessage} func={setError} />

      }

      {confirmacion &&

      <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

      }

      {loadingBlocked && (
          <LoadingOverlay/>
      )}

      {/* WhatsApp Configuration Modal */}
      <Modal
        visible={showWhatsappModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWhatsappModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{screenTexts.WhatsAppLink}</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowWhatsappModal(false)}
            >
              <Ionicons name="close" size={24} color="#1D1D1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Añade el enlace de tu grupo de WhatsApp para que los miembros puedan acceder fácilmente.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{screenTexts.WhatsAppLink}</Text>
              <TextInput
                style={styles.textInput}
                value={whatsappLink}
                onChangeText={setWhatsappLink}
                placeholder={screenTexts.WhatsAppPlaceholder}
                placeholderTextColor="#8E8E93"
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowWhatsappModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => {
                  // Here you would save the WhatsApp link to the backend
                  setShowWhatsappModal(false);
                }}
              >
                <Text style={styles.saveButtonText}>{screenTexts.WhatsAppSave}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <AddActivity 
        visible={showAddActivityModal} 
        onClose={() => setShowAddActivityModal(false)} 
        loading={loading} 
        setLoading={setLoading} 
        setWinKylets={() => {}} 
      />

      {/* Social Options Modal */}
      <Modal
        visible={showSocialOptionsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowSocialOptionsModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Crear contenido</Text>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowSocialOptionsModal(false)}
            >
              <Ionicons name="close" size={24} color="#1D1D1F" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => {
                setShowSocialOptionsModal(false);
                setShowCreatePollModal(true);
              }}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="bar-chart-outline" size={24} color="#1D7CE4" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Crear encuesta</Text>
                <Text style={styles.optionSubtitle}>Haz una pregunta rápida al grupo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.optionButton}
              onPress={() => {
                setShowSocialOptionsModal(false);
                setShowCreateStoryModal(true);
              }}
            >
              <View style={styles.optionIcon}>
                <Ionicons name="camera-outline" size={24} color="#1D7CE4" />
              </View>
              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Crear historia</Text>
                <Text style={styles.optionSubtitle}>Comparte un momento con el grupo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Poll Modal */}
      <AddPollModal
        visible={showCreatePollModal}
        onClose={() => setShowCreatePollModal(false)}
        groupId={_id}
        loading={loading}
        setLoading={setLoading}
        setWinKylets={() => {}}
      />

      {/* Add Story Modal */}
      <AddStoryModal
        visible={showCreateStoryModal}
        onClose={() => setShowCreateStoryModal(false)}
        groupId={_id}
        loading={loading}
        setLoading={setLoading}
        setWinKylets={() => {}}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Banner Section - Minimalist Design
  // Scroll Container
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Group Info Card - Inspired by The Offline Club
  groupInfoCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 20,
    marginBottom: 8,
  },
  groupImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  groupBanner: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  groupProfileImageContainer: {
    position: 'absolute',
    bottom: -50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 64,
    padding: 4,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    width: 128,
    height: 128,
  },
  groupProfileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  groupDetails: {
    alignItems: 'center',
    paddingTop: 40,
  },
  groupName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    letterSpacing: -0.5,
    lineHeight: 28,
    textAlign: 'center',
  },
  groupDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 21,
    letterSpacing: -0.2,
    textAlign: 'center',
    marginBottom: 16,
  },

  // Action Buttons - Premium Design
  subscribeButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  pendingButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.2,
  },
  invitationActions: {
    flexDirection: 'row',
    gap: 12,
  },
  acceptButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  declineButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: -0.2,
  },

  // Navigation Section - Standard Tab Design (same as Experiencias)
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#EAEAEA',
    marginTop: 0,
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  activeTab: { 
    borderBottomWidth: 3, 
    borderColor: '#1D7CE4' 
  },
  tabText: { 
    color: '#000', 
    fontSize: 14 
  },
  activeTabText: { 
    fontWeight: 'bold' 
  },

  // Admin Section
  adminSection: {
    alignItems: 'flex-end',
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFE4B5',
  },
  adminButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
    marginRight: 6,
  },
  adminButtonTextActive: {
    color: '#FF9500',
    fontWeight: '600',
  },
  adminBadge: {
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  adminBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },

  // Content Section
  contentSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  activitiesContainer: {
    gap: 16,
  },
  usersContainer: {
    gap: 12,
  },
  blockedContainer: {
    paddingHorizontal: -16,
    marginTop: 20,
  },

  // Social Tab - Elegant and Minimalist Styles
  socialContainer: {
    paddingTop: 8,
  },

  // Elegant Section Titles
  sectionTitleElegant: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1D1D1F',
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  sectionSubtitleElegant: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '400',
    marginBottom: 24,
    lineHeight: 18,
  },

  // WhatsApp Section - Elegant
  whatsappSectionElegant: {
    marginBottom: 32,
  },
  whatsappConnectedElegant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  whatsappDisconnectedElegant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  whatsappStatusElegant: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  whatsappButtonElegant: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  whatsappButtonTextElegant: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  connectButtonElegant: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  connectButtonTextElegant: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Polls Section - Elegant
  pollsSectionElegant: {
    marginBottom: 32,
  },
  pollsListElegant: {
    gap: 16,
  },
  pollCardElegant: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  pollQuestionElegant: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 16,
    letterSpacing: -0.3,
    lineHeight: 24,
  },
  pollOptionsElegant: {
    gap: 12,
  },
  pollOptionElegant: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  pollOptionTextElegant: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '500',
  },
  pollVotesElegant: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Stories Section - Elegant
  storiesSectionElegant: {
    marginBottom: 32,
  },
  storiesScrollElegant: {
    paddingLeft: 0,
  },
  storyCardElegant: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E5E5E7',
  },
  storyImageElegant: {
    width: '100%',
    height: '100%',
    borderRadius: 33,
  },
  storyOverlayElegant: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  storyTimeElegant: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Empty States - Elegant
  emptyStateElegant: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyStateTextElegant: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 12,
    textAlign: 'center',
  },

  createFirstButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  createFirstButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  createFirstButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E7',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.4,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 18,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 8,
  },
  pollDateElegant: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 8,
    textAlign: 'right',
  },
  storyDescriptionElegant: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  storyDescriptionTextElegant: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalDescription: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  textInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1D1D1F',
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 40,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E7',
  },
  cancelButtonText: {
    color: '#1D1D1F',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },

  // Empty States - Minimalist Design
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  createActivityButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
  createButtonGradient: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Legacy Styles (keeping for compatibility)
  scroll:{
    paddingHorizontal: 16
  },
  containerButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  button: {
    paddingVertical: 4,
    flex: 1,
    alignItems: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  rightButton: {
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  selectedButton: {
    borderBottomWidth: 3,
    borderColor: '#1D7CE4',
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
  },
  selectedButtonText: {
    fontWeight: 'bold',
  },
  imagenBanner: {
    width: '100%',
    height: 125,
  },
  userCard: {
    backgroundColor: '#F2F2F2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  userDetail: {
    fontSize: 14,
    color: '#666',
  },
  buttonGradient:{
    backgroundColor: '#1D7CE4',
    width:50,
    height:50,
    borderRadius:25,
    position: 'absolute',
    bottom:60,
    right:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCreate:{
    width: 35,
    height: 35
  },
  descriptionContainer:{
    marginTop: 10,
    marginBottom: 10,
  },
  descriptionTitle:{
    marginTop: 10,
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  descriptionText:{
    fontSize: 14,
    color: '#9d9d9d',
    marginBottom: 10
  },
  noMembersText:{
    alignSelf: 'center',
    fontWeight: 'bold',
    color: '#9d9d9d',
    fontSize: 18,
    textAlign: 'center'
  },
  publicContainer:{
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    alignSelf: 'flex-end',
    padding: 5,
    borderRadius: 15,
    zIndex: 50,
    marginTop: 10,
    marginRight: 10
  },
  publicTitle:{
    color: 'white'
  },
  rejectButton:{
    height: 47,
    marginTop:15,
    //paddingVertical: 10,
    //paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: '#d9d9d9',
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

export default GroupDetail;
