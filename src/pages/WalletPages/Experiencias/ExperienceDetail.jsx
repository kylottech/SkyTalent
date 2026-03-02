import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, SafeAreaView, StyleSheet, FlatList, Platform, UIManager, LayoutAnimation } from 'react-native';
import { useUser } from '../../../context/useUser';
import { formatString } from '../../../utils/formatString'
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import Top from '../../../components/Utils/Top';
import GradientButton from '../../../components/Utils/GradientButton';
import DayCard from '../../../components/wallet/Experiences/DayCard';
import PostCard from '../../../components/wallet/Experiences/PostCard';
import PartCard from '../../../components/wallet/Experiences/PartCard';
import AddDayModal from '../../../components/wallet/Experiences/Modals/AddDayModal';
import AddPostModal from '../../../components/wallet/Experiences/Modals/AddPostModal';
import AddPartModal from '../../../components/wallet/Experiences/Modals/AddPartModal';
import AddStepsModal from '../../../components/wallet/Experiences/Modals/AddStepsModal';
import AddContactoModal from '../../../components/wallet/Experiences/Modals/AddContactoModal';
import OptionsModal from '../../../components/wallet/Experiences/Modals/OpcionsModal';
import InfoModal from '../../../components/Utils/InfoModal';
import Error from '../../../components/Utils/Error';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';
import { getFirstDay, getDay, deletePost, deletePart, postExperienceDecision } from '../../../services/experienceServices';

export default function VisitDetailScreen({ route }) {
  const { _id, name, mine, photo } = route.params;
  const navigation = useNavigation();
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Experiencias.ExperienceDetail;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [days, setDays] = useState([]);
  const [posts, setPosts] = useState([]);
  const [parts, setParts] = useState([]);
  const [request, setRequest] = useState(false);
  const [isMine, setIsMine] = useState(mine);      // <— antes era prop, ahora estado
  const [loading, setLoading] = useState(false);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingParts, setLoadingParts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [daysOpen, setDaysOpen] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showPartModal, setShowPartModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [showContactoModal, setShowContactoModal] = useState(false);
  const [showPostOptionModal, setShowPostOptionModal] = useState(false);
  const [showPartOptionModal, setShowPartOptionModal] = useState(false);
  const [modalTypePost, setModalTypePost] = useState('edit');
  const [indexPosts, setIndexPosts] = useState(0);
  const [indexParts, setIndexParts] = useState(0);
  const [partId, setPartId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const didRunOnce = useRef(false);

  const [opcion, setOpcion] = useState(1);

  useEffect(() => {
    console.log(mine)
    if (winKylets !== 0) {
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }));
      setShowConfirmation(true);
    }
  }, [winKylets]);

  if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
  const toggleDays = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setDaysOpen(o => !o);
  };
  const selectAndClose = (i) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedIndex(i);
    setDaysOpen(false);
  };

  const handleGetFirstDay = async () => {
    setLoadingDates(true);
    setLoadingPosts(true);
    setLoadingParts(true);
    try {
      const response = await getFirstDay(_id, logout);
      setDays(response.days || []);
      setPosts(response.posts.posts || []);
      setParts(response.parts || []);
      setRequest(!!response.request);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    } finally {
      setLoadingDates(false);
      setLoadingPosts(false);
      setLoadingParts(false);
    }
  };

  const handleGetDay = async ({ _id, indice }) => {
    setLoadingPosts(true);
    setLoadingParts(true);
    try {
      const response = await getDay({ _id, indice }, logout);
      setPosts(response.posts);
      setParts(response.parts);
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    } finally {
      setLoadingPosts(false);
      setLoadingParts(false);
    }
  };

  // ACEPTAR / RECHAZAR COLABORACIÓN
  const handleColaboration = async (decision) => {
    if (loading) return;
    setLoading(true);
    try {
      const resp = await postExperienceDecision({ _id, decision }, logout);
      // resp esperado: { ok: true, accepted: boolean, experienceId: '...' }
      if (resp?.ok) {
        setRequest(false);               // ocultar texto + botones
        if (resp.accepted) setIsMine(true); // si aceptó, ya es colaborador
      }
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await deletePost({ _id: posts[indexPosts]._id }, logout);
        handleGetDay({ _id: _id, indice: selectedIndex });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeletePart = async () => {
    if (!loading) {
      setLoading(true);
      try {
        await deletePart({ _id: parts[indexParts]._id }, logout);
        handleGetDay({ _id: _id, indice: selectedIndex });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditPostFunc = () => {
    setModalTypePost('edit');
    setShowPostOptionModal(false);
    setShowPostModal(true);
  };

  const handleCreatePostFunc = () => {
    setModalTypePost('Add');
    setShowPostModal(true);
  };

  const handleDeletePostFunc = () => {
    handleDeletePost();
    setShowPostOptionModal(false);
  };

  const handleEditPartFunc = () => {
    setModalTypePost('edit');
    setShowPartOptionModal(false);
    setShowPartModal(true);
  };

  const handleCreatePartFunc = () => {
    setModalTypePost('Add');
    setShowPartModal(true);
  };

  const handleDeletePartFunc = () => {
    handleDeletePart();
    setShowPartOptionModal(false);
  };

  useEffect(() => {
    handleGetFirstDay();
  }, []);

  useEffect(() => {
    if (!didRunOnce.current) {
      didRunOnce.current = true;
      return;
    }
    if (!days?.[selectedIndex]) return;
    handleGetDay({ _id, indice: selectedIndex });
  }, [selectedIndex]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    handleGetFirstDay().then(() => setRefreshing(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Top left={true} leftType='Back' typeCenter='Text' textCenter={screenTexts.Top} />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {/* Banner Section */}
        <View style={styles.bannerContainer}>
          <Image source={{ uri: photo }} style={styles.banner} />
          <View style={styles.bannerOverlay}>
            <Image source={{ uri: photo }} style={styles.profileImage} />
          </View>
        </View>

        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.experienceTitle}>{formatString(screenTexts.Title, { variable1: name })}</Text>
          <Text style={styles.experienceSubtitle}>{formatString(screenTexts.Subtitle, { variable1: name })}</Text>
          
          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Me gusta</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Copiadas</Text>
            </View>
          </View>
        </View>

        
        {request && (
          <View style={{ paddingHorizontal: '5%', marginBottom: 16 }}>
            <Text style={styles.titulo6}>{screenTexts.ColaboratorsInvitation}</Text>
            <View style={styles.decisionsRow}>
              
              <View style={styles.acceptGradient}>
                <GradientButton color="Blue" text={screenTexts.ColaboratorsInvitationAcept} onPress={() => handleColaboration(true)} />
              </View>
              

              
              <TouchableOpacity onPress={() => handleColaboration(false)} activeOpacity={0.9} style={[styles.cancelButton, { flex: 1 }]}>
                <Text style={styles.cancelText}>{screenTexts.ColaboratorsInvitationReject}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Dates Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{screenTexts.FechasSubtitle}</Text>
            {isMine && (
              <TouchableOpacity onPress={() => setShowDayModal(true)} style={styles.addButton}>
                <Feather name='plus' size={16} color='#1D7CE4' />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.sectionSubtitle}>{formatString(screenTexts.FechasSubtitle2, { variable1: name })}</Text>
          
          {loadingDates ? (
            <ActivityIndicator size="large" color="#1D7CE4" style={styles.loaderCentered} />
          ) : (
            days.length > 0 && (
              <View style={styles.datesCard}>
                <View style={styles.datesContent}>
                  <View style={styles.datesTextSection}>
                    <Text style={styles.datesTitle}>
                      {formatString(screenTexts.TripDetailsTitle, { variable1: name })}
                    </Text>
                    <Text style={styles.datesSubtitle}>
                      {days[selectedIndex]?.date ? new Date(days[selectedIndex].date).toLocaleDateString('es-ES', { 
                        day: '2-digit', 
                        month: 'long' 
                      }) : 'Fecha no disponible'} · {days.length} {days.length === 1 ? 'día' : 'días'} >
                    </Text>
                  </View>
                  
                  <View style={styles.calendarIcon}>
                    <View style={styles.calendarHeader}>
                      <Text style={styles.calendarHeaderText}>
                        {days[selectedIndex]?.date ? 
                          (Math.ceil((new Date(days[selectedIndex].date) - new Date()) / (1000 * 60 * 60 * 24)) > 0 ? screenTexts.CountdownTexts.StartsIn : 
                           Math.ceil((new Date(days[selectedIndex].date) - new Date()) / (1000 * 60 * 60 * 24)) === 0 ? screenTexts.CountdownTexts.StartsToday : screenTexts.CountdownTexts.AlreadyStarted) : 
                          screenTexts.CountdownTexts.NoDate
                        }
                      </Text>
                    </View>
                    <View style={styles.calendarNumber}>
                      <Text style={[
                        styles.calendarNumberText,
                        days[selectedIndex]?.date && Math.ceil((new Date(days[selectedIndex].date) - new Date()) / (1000 * 60 * 60 * 24)) === 0 && styles.calendarNumberToday,
                        days[selectedIndex]?.date && Math.ceil((new Date(days[selectedIndex].date) - new Date()) / (1000 * 60 * 60 * 24)) < 0 && styles.calendarNumberPast
                      ]}>
                        {days[selectedIndex]?.date ? 
                          Math.max(0, Math.ceil((new Date(days[selectedIndex].date) - new Date()) / (1000 * 60 * 60 * 24))) : 
                          0
                        }
                      </Text>
                    </View>
                    <View style={styles.calendarFooter}>
                      <Text style={styles.calendarFooterText}>
                        {days[selectedIndex]?.date ? 
                          (Math.ceil((new Date(days[selectedIndex].date) - new Date()) / (1000 * 60 * 60 * 24)) === 0 ? screenTexts.CountdownTexts.Today : screenTexts.CountdownTexts.Days) : 
                          screenTexts.CountdownTexts.Days
                        }
                      </Text>
                    </View>
                  </View>
                </View>
                
                {/* Day Selector */}
                <View style={styles.daySelector}>
                  <TouchableOpacity onPress={toggleDays} style={styles.daySelectorButton}>
                    <Text style={styles.daySelectorText}>
                      {days[selectedIndex]?.name || screenTexts.DaySelector.SelectDay}
                    </Text>
                    <Feather name={daysOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#86868B" />
                  </TouchableOpacity>
                  
                  {daysOpen && (
                    <View style={styles.dayDropdown}>
                      {days.map((day, index) => (
                        <TouchableOpacity
                          key={day._id}
                          style={[
                            styles.dayOption,
                            index === selectedIndex && styles.dayOptionActive
                          ]}
                          onPress={() => selectAndClose(index)}
                        >
                          <Text style={[
                            styles.dayOptionText,
                            index === selectedIndex && styles.dayOptionTextActive
                          ]}>
                            {day.name}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )
          )}
        </View>

       
        {/* Navigation Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, opcion === 1 && styles.activeTab]}
            onPress={() => setOpcion(1)}
          >
            <Text style={[styles.tabText, opcion === 1 && styles.activeTabText]}>{screenTexts.PostSubtitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, opcion === 2 && styles.activeTab]}
            onPress={() => setOpcion(2)}
          >
            <Text style={[styles.tabText, opcion === 2 && styles.activeTabText]}>{screenTexts.MyExperiencesSubtitle}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, opcion === 3 && styles.activeTab]}
            onPress={() => {
              const dayId = days?.[selectedIndex]?._id;
              if (dayId) navigation.navigate('RoutesMaps', { _id: dayId });
            }}
          >
            <Text style={[styles.tabText, opcion === 3 && styles.activeTabText]}>{screenTexts.RouteSubtitle}</Text>
          </TouchableOpacity>
        </View>

        
        {opcion === 1 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{screenTexts.PostSubtitle}</Text>
              {(isMine && days.length > 0) && (
                <TouchableOpacity onPress={handleCreatePostFunc} style={styles.addButton}>
                  <Feather name='plus' size={16} color='#1D7CE4' />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.sectionSubtitle}>{screenTexts.PostSubtitle2}</Text>
            {loadingPosts ? (
              <ActivityIndicator size='large' color='#1D7CE4' style={styles.overlay} />
            ) : (
              <FlatList
                data={posts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item._id}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
                contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}
                renderItem={({ item, index }) => (
                  <PostCard
                    info={item}
                    mine={isMine}
                    index={index}
                    setIndexPosts={setIndexPosts}
                    setShowPostOptionModal={setShowPostOptionModal}
                  />
                )}
                ListEmptyComponent={() => (
                  <View style={styles.emptyStateContainer}>
                    <View style={styles.emptyStateImageContainer}>
                      <Text style={styles.emptyStateEmoji}>📝</Text>
                    </View>
                    <Text style={styles.emptyStateTitle}>No hay posts aún</Text>
                    <Text style={styles.emptyStateSubtitle}>Comparte momentos especiales de tu experiencia</Text>
                    {isMine && (
                      <TouchableOpacity
                        style={styles.createPostButton}
                        onPress={() => setShowPostModal(true)}
                      >
                        <Text style={styles.createPostButtonText}>Crear primer post</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              />
            )}
          </View>
        )}

        
        {opcion === 2 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{screenTexts.MyExperiencesSubtitle}</Text>
              {(isMine && days.length > 0) && (
                <TouchableOpacity onPress={handleCreatePartFunc} style={styles.addButton}>
                  <Feather name='plus' size={16} color='#1D7CE4' />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.sectionSubtitle}>{screenTexts.MyExperiencesSubtitle2}</Text>
            

            {loadingParts ? (
              <ActivityIndicator size='large' color='#1D7CE4' style={styles.overlay} />
            ) : parts.length > 0 ? (
              parts.map((part, index) => (
                <PartCard
                  key={part._id}
                  info={part}
                  mine={isMine}
                  setShowPartOptionModal={setShowPartOptionModal}
                  setShowStepModal={setShowStepModal}
                  setPartId={setPartId}
                  setShowContactoModal={setShowContactoModal}
                  llamada={() => handleGetDay({ _id: _id, indice: selectedIndex })}
                  index={index}
                  setIndexParts={setIndexParts}
                />
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyStateImageContainer}>
                  <Text style={styles.emptyStateEmoji}>🎯</Text>
                </View>
                <Text style={styles.emptyStateTitle}>No hay experiencias aún</Text>
                <Text style={styles.emptyStateSubtitle}>Organiza tu experiencia en partes específicas</Text>
                {isMine && (
                  <TouchableOpacity
                    style={styles.createPostButton}
                    onPress={handleCreatePartFunc}
                  >
                    <Text style={styles.createPostButtonText}>Crear primera experiencia</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </ScrollView>

     
      {!loadingDates && !loading && (
        <AddDayModal isOpen={showDayModal} onClose={() => setShowDayModal(false)} _id={_id} days={days} setDays={setDays} loading={loading} setLoading={setLoading} />
      )}
      {days.length > 0 && (
        <AddPostModal
          setPosts={setPosts}
          mine={isMine}
          _id={days?.[selectedIndex]?._id}
          isOpen={showPostModal}
          onClose={() => setShowPostModal(false)}
          type={modalTypePost}
          info={posts[indexPosts]}
          llamada={() => handleGetDay({ _id: _id, indice: selectedIndex })}
          loading={loading}
          setLoading={setLoading}
          setWinKylets={setWinKylets}
          parts={parts}
        />
      )}
      {days.length > 0 && (
        <AddPartModal
          setParts={setParts}
          _id={days?.[selectedIndex]?._id}
          isOpen={showPartModal}
          onClose={() => setShowPartModal(false)}
          type={modalTypePost}
          info={parts[indexParts]}
          llamada={() => handleGetDay({ _id: _id, indice: selectedIndex })}
          loading={loading}
          setLoading={setLoading}
          setWinKylets={setWinKylets}
        />
      )}
      {parts.length > 0 && (
        <AddStepsModal
          _id={partId}
          isOpen={showStepModal}
          onClose={() => setShowStepModal(false)}
          llamada={() => handleGetDay({ _id: _id, indice: selectedIndex })}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {parts.length > 0 && (
        <AddContactoModal
          _id={partId}
          isOpen={showContactoModal}
          onClose={() => setShowContactoModal(false)}
          llamada={() => handleGetDay({ _id: _id, indice: selectedIndex })}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {posts.length > 0 && (
        <OptionsModal
          isOpen={showPostOptionModal}
          onClose={() => setShowPostOptionModal(false)}
          options={2}
          editFunc={handleEditPostFunc}
          deleteFunc={handleDeletePostFunc}
        />
      )}
      {parts.length > 0 && (
        <OptionsModal
          isOpen={showPartOptionModal}
          onClose={() => setShowPartOptionModal(false)}
          options={2}
          editFunc={handleEditPartFunc}
          deleteFunc={handleDeletePartFunc}
        />
      )}

      {error && <Error message={errorMessage} func={setError} />}
      <InfoModal celebration={true} isOpen={showConfirmation} onClose={() => { setShowConfirmation(false); setWinKylets(0); }} Title={winKyletsText} Subtitle={screenTexts.KyletsSubtitle} Button={screenTexts.KyletsButton} />
      {loading && <LoadingOverlay />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  bannerContainer: {
    position: 'relative',
  },
  banner: { 
    width: '100%', 
    height: 200 
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: -50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  headerSection: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    alignItems: 'center',
  },
  experienceTitle: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#1D1D1F',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  experienceSubtitle: { 
    fontSize: 16, 
    color: '#86868B', 
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statNumber: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#1D1D1F',
    marginBottom: 2,
  },
  statLabel: { 
    fontSize: 12, 
    color: '#86868B',
    fontWeight: '400',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E5E5E7',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1D1D1F',
    letterSpacing: -0.4,
  },
  sectionSubtitle: { 
    fontSize: 14, 
    color: '#86868B', 
    marginBottom: 16,
    lineHeight: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EAEAEA',
  },
  tab: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 12,
  },
  activeTab: { 
    borderBottomWidth: 3, 
    borderBottomColor: '#1D7CE4' 
  },
  tabText: { 
    color: '#86868B', 
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: { 
    color: '#1D7CE4',
    fontWeight: '700',
  },
  addButton: { 
    backgroundColor: '#F8F9FA', 
    padding: 8, 
    borderRadius: 20, 
    width: 36, 
    height: 36, 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  daysWrapper: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20 
  },
  daysContainer: { 
    flexDirection: 'column', 
    paddingLeft: 10, 
    justifyContent: 'center', 
    width: '100%' 
  },
  loaderCentered: { 
    marginVertical: 20, 
    alignSelf: 'center' 
  },
  overlay: { 
    marginVertical: 20, 
    alignSelf: 'center' 
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateEmoji: {
    fontSize: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  emptyStateSubtitle: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  createPostButton: {
    backgroundColor: '#1D7CE4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  createPostButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  // nuevos estilos botones decisión
  decisionsRow: { 
    flexDirection: 'row', 
    gap: 12, 
    justifyContent: 'space-between' 
  },
  acceptGradient: { 
    width: '50%', 
    alignItems: 'center' 
  },
  cancelButton: { 
    backgroundColor: '#ef4444', 
    paddingVertical: 12, 
    borderRadius: 12, 
    alignItems: 'center', 
    width: '50%' 
  },
  cancelText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  // Dates Card Styles
  datesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  datesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datesTextSection: {
    flex: 1,
    marginRight: 16,
  },
  datesTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  datesSubtitle: {
    fontSize: 13,
    color: '#86868B',
    fontWeight: '500',
    lineHeight: 18,
  },
  calendarIcon: {
    width: 64,
    height: 64,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    shadowColor: '#D4AF37',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  calendarHeader: {
    marginBottom: 2,
  },
  calendarHeaderText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  calendarNumber: {
    marginBottom: 2,
  },
  calendarNumberText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF3B30',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  calendarNumberToday: {
    color: '#1D7CE4',
  },
  calendarNumberPast: {
    color: '#86868B',
  },
  calendarFooter: {
    marginTop: 2,
  },
  calendarFooterText: {
    fontSize: 7,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  daySelector: {
    marginTop: 12,
  },
  daySelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 0,
  },
  daySelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  dayDropdown: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E5E7',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 4,
  },
  dayOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  dayOptionActive: {
    backgroundColor: '#F2F2F7',
  },
  dayOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  dayOptionTextActive: {
    fontWeight: '700',
    color: '#1D7CE4',
  },
});

const selectorStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', justifyContent: 'space-between' },
  chevron: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 4, borderRadius: 6 },
  dropdown: { marginTop: 6 },
});
