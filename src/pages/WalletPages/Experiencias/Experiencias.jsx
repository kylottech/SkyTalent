import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import ToggleSwitch from 'toggle-switch-react-native'
import { Feather } from '@expo/vector-icons';
import { useUser } from "../../../context/useUser";
import { formatString } from '../../../utils/formatString'
import { getMyExperience, getExperience, deleteExperience, getFavExperiences, getFollowExperiences } from '../../../services/experienceServices'
import AddExperienceModal from '../../../components/wallet/Experiences/Modals/AddExperienceModal';
import {CommentsModal} from '../../../components/wallet/Experiences/Modals/Comments'
import ExperienceCard from '../../../components/wallet/Experiences/ExperienceCard';
import OptionsModal from '../../../components/wallet/Experiences/Modals/OpcionsModal';
import DeleteConfirmationModal from '../../../components/wallet/Experiences/Modals/DeleteConfirmationModal';
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';
import InfoModal from '../../../components/Utils/InfoModal';
import UserCard from '../../../components/wallet/Experiences/UserCard'
import info from '../../../../assets/info.png'; 
import createButton from '../../../../assets/createButton.png'
import fondoExperiencia from '../../../../assets/fondo_experiencia.png';

export default function Experiencias({ setError, setErrorMessage, setConfirmacion, setConfirmacionMensaje}) {
  const { logout, texts } = useUser();
  const screenTexts = texts.pages.WalletPages.Experiencias.Experiencias
  const navigate = useNavigation();
  const [activeTab, setActiveTab] = useState('explore');
  const [experiences, setExperiences] = useState([]);
  const [myExperiences, setMyExperiences] = useState([]);
  const [favExperiences, setFavExperiences] = useState([]);
  const [followExperiences, setFollowExperiences] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showConfirmation2, setShowConfirmation2] = useState(false);
  const [showConfirmation3, setShowConfirmation3] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [idComments, setIdComments] = useState(null);
  const [modalTypePost, setModalTypePost] = useState('edit');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [follow, setFollow] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);
  const [winKylets, setWinKylets] = useState(0);
  const [winKyletsText, setWinKyletsText] = useState('');
  const [showConfirmationKylot, setShowConfirmationKylot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    trending: true,
    fugaces: true,
    mostCopied: true,
    mostLiked: true,
    popular: true,
    allExperiences: true,
    myExperiences: true,
    sharedExperiences: true,
  });

  useEffect(() => {
      
    if(winKylets !== 0){
      setWinKyletsText(formatString(screenTexts.KyletsTitle, { variable1: winKylets }))
      setShowConfirmationKylot(true)
    }
  },[winKylets])

  const handleGetMyExperience = async () => {
    if(!loading){
      try {
        setLoading(true)
        getMyExperience(logout) 
          .then((response) => {
            setMyExperiences(response)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  const handleGetFavExperience = async () => {
    if(!loading){
      try {
        setLoading(true)
        getFavExperiences(logout) 
          .then((response) => {
            setFavExperiences(response)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  const handleGetExperience = async () => {
    if(!loading){
      try {
        setLoading(true)
        getExperience(logout) 
          .then((response) => {
            setExperiences(response)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  const handleGetFollowExperiences = async () => {
    if(!loading){
      try {
        setLoading(true)
        getFollowExperiences(logout) 
          .then((response) => {
            setFollowExperiences(response)
            setLoading(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoading(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoading(false)
      }
    }
    
  };

  const handleDeleteExperience = async () => {
    if(!loadingModal){
      setLoadingModal(true)
      try {
        
        deleteExperience({_id: myExperiences[selectedIndex]._id}, logout)
          .then(() => { 
            handleGetMyExperience()
            setConfirmacion(true)
            setConfirmacionMensaje(screenTexts.DeleteConfirmationMessage)
            setLoadingModal(false)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
            setLoadingModal(false)
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
        setLoadingModal(false)
      }
    }
    
  };

  const handleEditFunc = async () => {
    setModalTypePost('edit')
    setShowConfirmation3(false)
    setShowConfirmation(true)
  }

  const handleCreateFunc = async () => {
    setModalTypePost('Add')
    setShowConfirmation(true)
  }

  const handleDeleteFunc = async () => {
    setShowConfirmation3(false);
    setShowDeleteConfirmation(true);
  }

  const handleConfirmDelete = async () => {
    setShowDeleteConfirmation(false);
    handleDeleteExperience();
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  useEffect(() => {
    if(activeTab === 'explore' && !follow){
      handleGetExperience()
    }
    else if(activeTab === 'explore' && follow){
      handleGetFollowExperiences()
    }
    else if(activeTab === 'user'){
      handleGetMyExperience()
    }
    else if(activeTab === 'communities'){
      handleGetFavExperience()
    }
      
  }, [activeTab, follow]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if(activeTab === 'explore' && !follow){
      handleGetExperience()
    }
    else if(activeTab === 'explore' && follow){
      handleGetFollowExperiences()
    }
    else if(activeTab === 'user'){
      handleGetMyExperience()
    }
    else if(activeTab === 'communities'){
      handleGetFavExperience()
    }
    setRefreshing(false);
  }, []);


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header section integrated with Wallet's consolidated banner */}
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <View style={styles.titleRow}>
              <View style={styles.titleTextContainer}>
                <Text style={styles.title}>{screenTexts.Title}</Text>
                <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
              </View>
              
              {activeTab === 'explore' && 
                <View style={styles.switchContainer}>
                  <ToggleSwitch
                    isOn={follow}
                    onColor="#1D7CE4"
                    offColor="#E5E5E7"
                    size="small"
                    trackOnStyle={{ borderRadius: 12 }}  
                    trackOffStyle={{ borderRadius: 12 }} 
                    onToggle={() => {
                      setFollow(!follow)
                    }}
                  />
                  <TouchableOpacity onPress={() => setVisibleModal(!visibleModal)} style={styles.infoButton}>
                    <Image source={info} style={styles.infoIcon}/>
                  </TouchableOpacity>
                </View>
              }
            </View>
          </View>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'explore' && styles.activeTab]}
            onPress={() => setActiveTab('explore')}
          >
            <Text style={[styles.tabText, activeTab === 'explore' && styles.activeTabText]}>
              {screenTexts.ExploreTabButton}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'user' && styles.activeTab]}
            onPress={() => setActiveTab('user')}
          >
            <Text style={[styles.tabText, activeTab === 'user' && styles.activeTabText]}>
              {screenTexts.UserTabButton}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
            onPress={() => setActiveTab('communities')}
          >
            <Text style={[styles.tabText, activeTab === 'communities' && styles.activeTabText]}>
              {screenTexts.CommunityTabButton}
            </Text>
          </TouchableOpacity>
        </View>


        <View style={styles.content}>
        {(activeTab === 'explore' && !follow) && (
          experiences.length > 0 ? (
            <>
              {/* Tendencias del momento */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('trending')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.Trending}</Text>
                    <Text style={styles.sectionSubtitle}>Experiencias más populares del momento</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.trending ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.trending && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.horizontalScroll, { paddingLeft: 16, paddingRight: 8 }]}
                  >
                    {experiences
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, 5)
                      .map((experience, index) => (
                      <View key={experience._id} style={styles.horizontalCard}>
                        <ExperienceCard 
                          setId={setIdComments} 
                          experience={experience} 
                          showConfirmationModal3={() => setShowConfirmation3(true)} 
                          mine={experience.mine} 
                          commentsModal={setShowConfirmation2}
                          setLoadingModal={setLoadingModal}
                          loadingModal={loadingModal}
                        />
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Experiencias de un día (fugaces) */}
              {experiences.filter(exp => exp.duration === 'day').length > 0 && (
                <View style={styles.sectionContainer}>
                  <TouchableOpacity 
                    style={styles.sectionHeader} 
                    onPress={() => toggleSection('fugaces')}
                    activeOpacity={0.6}
                  >
                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitle}>{screenTexts.Sections.Fugaces}</Text>
                      <Text style={styles.sectionSubtitle}>Experiencias que duran solo un día</Text>
                    </View>
                    <View style={styles.sectionAddButton}>
                      <Text style={styles.sectionAddIcon}>{expandedSections.fugaces ? "−" : "+"}</Text>
                    </View>
                  </TouchableOpacity>
                  {expandedSections.fugaces && (
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={[styles.horizontalScroll, { paddingLeft: 16, paddingRight: 8 }]}
                    >
                      {experiences.filter(exp => exp.duration === 'day').map((experience, index) => (
                        <View key={experience._id} style={styles.horizontalCard}>
                          <ExperienceCard 
                            setId={setIdComments} 
                            experience={experience} 
                            showConfirmationModal3={() => setShowConfirmation3(true)} 
                            mine={experience.mine} 
                            commentsModal={setShowConfirmation2}
                            setLoadingModal={setLoadingModal}
                            loadingModal={loadingModal}
                          />
                        </View>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}

              {/* Experiencias más copiadas */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('mostCopied')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.MostCopied}</Text>
                    <Text style={styles.sectionSubtitle}>Las experiencias más replicadas por la comunidad</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.mostCopied ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.mostCopied && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.horizontalScroll, { paddingLeft: 16, paddingRight: 8 }]}
                  >
                    {experiences
                      .sort((a, b) => (b.copies || 0) - (a.copies || 0))
                      .slice(0, 5)
                      .map((experience, index) => (
                      <View key={experience._id} style={styles.horizontalCard}>
                        <ExperienceCard 
                          setId={setIdComments} 
                          experience={experience} 
                          showConfirmationModal3={() => setShowConfirmation3(true)} 
                          mine={experience.mine} 
                          commentsModal={setShowConfirmation2}
                          setLoadingModal={setLoadingModal}
                          loadingModal={loadingModal}
                        />
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Experiencias con más Me gusta */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('mostLiked')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.MostLiked}</Text>
                    <Text style={styles.sectionSubtitle}>Las experiencias con más likes de la comunidad</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.mostLiked ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.mostLiked && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.horizontalScroll, { paddingLeft: 16, paddingRight: 8 }]}
                  >
                    {experiences
                      .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
                      .slice(0, 5)
                      .map((experience, index) => (
                      <View key={experience._id} style={styles.horizontalCard}>
                        <ExperienceCard 
                          setId={setIdComments} 
                          experience={experience} 
                          showConfirmationModal3={() => setShowConfirmation3(true)} 
                          mine={experience.mine} 
                          commentsModal={setShowConfirmation2}
                          setLoadingModal={setLoadingModal}
                          loadingModal={loadingModal}
                        />
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Más populares */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('popular')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.Popular}</Text>
                    <Text style={styles.sectionSubtitle}>Las experiencias más populares en general</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.popular ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.popular && (
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={[styles.horizontalScroll, { paddingLeft: 16, paddingRight: 8 }]}
                  >
                    {experiences
                      .sort((a, b) => ((b.likes?.length || 0) + (b.copies || 0)) - ((a.likes?.length || 0) + (a.copies || 0)))
                      .slice(0, 5)
                      .map((experience, index) => (
                      <View key={experience._id} style={styles.horizontalCard}>
                        <ExperienceCard 
                          setId={setIdComments} 
                          experience={experience} 
                          showConfirmationModal3={() => setShowConfirmation3(true)} 
                          mine={experience.mine} 
                          commentsModal={setShowConfirmation2}
                          setLoadingModal={setLoadingModal}
                          loadingModal={loadingModal}
                        />
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>

              {/* Todas las experiencias */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('allExperiences')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.AllExperiences}</Text>
                    <Text style={styles.sectionSubtitle}>Explora todas las experiencias disponibles</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.allExperiences ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.allExperiences && (
                  <View style={styles.sectionContent}>
                    {experiences.map((experience, index) => (
                      <ExperienceCard 
                        key={experience._id} 
                        setId={setIdComments} 
                        experience={experience} 
                        showConfirmationModal3={() => setShowConfirmation3(true)} 
                        mine={experience.mine} 
                        commentsModal={setShowConfirmation2}
                        setLoadingModal={setLoadingModal}
                        loadingModal={loadingModal}
                      />
                    ))}
                  </View>
                )}
              </View>
            </>
          ) : (

            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D7CE4" />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {screenTexts.EmptyExplore}
                </Text>
              </View>
            )
            
          )
        )}

        {(activeTab === 'explore' && follow) && (
          followExperiences.length > 0 ? (
            <View style={styles.sectionContent}>
              {followExperiences.map((user, index) => (
                <UserCard
                  key={user._id}
                  user={user}
                  setId={setIdComments}  
                  showConfirmationModal3={() => setShowConfirmation3(true)} 
                  mine={false} 
                  commentsModal={setShowConfirmation2}
                  setLoadingModal={setLoadingModal}
                  loadingModal={loadingModal}
                />
              ))}
            </View>
          ) : (

            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D7CE4" />
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {screenTexts.EmptyFollow}
                </Text>
              </View>
            )
            
          )
        )}

        {activeTab === 'user' && (
          myExperiences.length > 0 ? (
            <>
              {/* Mis Experiencias Section */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('myExperiences')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.MyExperiences}</Text>
                    <Text style={styles.sectionSubtitle}>Tus experiencias personales creadas</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.myExperiences ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.myExperiences && (
                  <View style={styles.sectionContent}>
                    {myExperiences.map((experience, index) => (
                      <ExperienceCard 
                        key={experience._id} 
                        setId={setIdComments} 
                        experience={experience} 
                        showConfirmationModal3={() => setShowConfirmation3(true)} 
                        mine={experience.mine}
                        commentsModal={setShowConfirmation2} 
                        setSelectedIndex={setSelectedIndex}
                        index={index} 
                        setLoadingModal={setLoadingModal}
                        loadingModal={loadingModal}
                      />
                    ))}
                  </View>
                )}
              </View>

              {/* Experiencias Compartidas Section */}
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.sectionHeader} 
                  onPress={() => toggleSection('sharedExperiences')}
                  activeOpacity={0.6}
                >
                  <View style={styles.sectionTitleContainer}>
                    <Text style={styles.sectionTitle}>{screenTexts.Sections.SharedExperiences}</Text>
                    <Text style={styles.sectionSubtitle}>Experiencias compartidas por otros usuarios</Text>
                  </View>
                  <View style={styles.sectionAddButton}>
                    <Text style={styles.sectionAddIcon}>{expandedSections.sharedExperiences ? "−" : "+"}</Text>
                  </View>
                </TouchableOpacity>
                {expandedSections.sharedExperiences && (
                  <View style={styles.sectionContent}>
                    {/* Empty state with image and improved design */}
                    <View style={styles.emptyStateContainer}>
                      <View style={styles.emptyStateImageContainer}>
                        <Text style={styles.emptyStateEmoji}>📤</Text>
                      </View>
                      <Text style={styles.emptyStateTitle}>No hay experiencias compartidas</Text>
                      <Text style={styles.emptyStateSubtitle}>Cuando recibas experiencias compartidas aparecerán aquí</Text>
                      <TouchableOpacity 
                        style={styles.exploreButton}
                        onPress={() => navigate.navigate('Comunidad')}
                      >
                        <Text style={styles.exploreButtonText}>Explorar comunidad</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </>
          ) : (

            loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1D7CE4" />
              </View>
            ) : (
              <>
                {/* Mis Experiencias Section - Empty */}
                <View style={styles.sectionContainer}>
                  <TouchableOpacity 
                    style={styles.sectionHeader} 
                    onPress={() => toggleSection('myExperiences')}
                    activeOpacity={0.6}
                  >
                    <View style={styles.sectionTitleContainer}>
                      <Text style={styles.sectionTitle}>{screenTexts.Sections.MyExperiences}</Text>
                      <Text style={styles.sectionSubtitle}>Tus experiencias personales creadas</Text>
                    </View>
                    <View style={styles.sectionAddButton}>
                      <Text style={styles.sectionAddIcon}>{expandedSections.myExperiences ? "−" : "+"}</Text>
                    </View>
                  </TouchableOpacity>
                  {expandedSections.myExperiences && (
                    <View style={styles.sectionContent}>
                      <View style={styles.emptyStateContainer}>
                        <Image source={fondoExperiencia} style={styles.emptyStateImage} />
                        <Text style={styles.emptyStateTitle}>No tienes ninguna experiencia</Text>
                        <Text style={styles.emptyStateSubtitle}>Crea una para comenzar</Text>
                        <TouchableOpacity 
                          style={styles.createGroupButton}
                          onPress={handleCreateFunc}
                        >
                          <Text style={styles.createGroupButtonText}>Crear experiencia</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

                {/* Experiencias Compartidas Section - Empty */}
                <View style={styles.sectionContainer}>
                  <Text style={styles.sectionTitle}>{screenTexts.Sections.SharedExperiences}</Text>
                  <View style={styles.sectionContent}>
                    <View style={styles.emptyStateContainer}>
                      <Image source={fondoExperiencia} style={styles.emptyStateImage} />
                      <Text style={styles.emptyStateTitle}>No hay experiencias compartidas</Text>
                      <Text style={styles.emptyStateSubtitle}>Cuando recibas experiencias compartidas aparecerán aquí</Text>
                      <TouchableOpacity 
                        style={styles.createGroupButton}
                        onPress={handleCreateFunc}
                      >
                        <Text style={styles.createGroupButtonText}>Crear experiencia</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            )
            
          )
        )}

        {activeTab === 'communities' && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionTitle}>Experiencias Favoritas</Text>
                <Text style={styles.sectionSubtitle}>Tus experiencias guardadas para acceso rápido</Text>
              </View>
            </View>
            
            {favExperiences.length > 0 ? (
              <View style={styles.sectionContent}>
                {favExperiences.map((experience, index) => (
                  <ExperienceCard 
                    key={experience._id} 
                    setId={setIdComments} 
                    experience={experience} 
                    showConfirmationModal3={() => setShowConfirmation3(true)} 
                    mine={experience.mine ?? false} 
                    commentsModal={setShowConfirmation2}
                    setSelectedIndex={setSelectedIndex}
                    index={index} 
                    setLoadingModal={setLoadingModal}
                    loadingModal={loadingModal}
                  />
                ))}
              </View>
            ) : (
              loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#1D7CE4" />
                </View>
              ) : (
                <View style={styles.emptyStateContainer}>
                  <View style={styles.emptyStateImageContainer}>
                    <Text style={styles.emptyStateEmoji}>❤️</Text>
                  </View>
                  <Text style={styles.emptyStateTitle}>No tienes experiencias favoritas</Text>
                  <Text style={styles.emptyStateSubtitle}>Guarda experiencias que te gusten para encontrarlas fácilmente</Text>
                  <TouchableOpacity 
                    style={styles.exploreButton}
                    onPress={() => setActiveTab('explore')}
                  >
                    <Text style={styles.exploreButtonText}>Explorar experiencias</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </View>
        )}
        </View>
      </ScrollView>

      <LinearGradient
        colors={['#004999', '#1D7CE4']}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.buttonAdd}
      >
        <TouchableOpacity onPress={handleCreateFunc}>
          <Image source={createButton} style={styles.imageCreate}/>
        </TouchableOpacity>
      </LinearGradient>

      <CommentsModal 
        idComments={idComments} 
        isOpen={showConfirmation2} 
        onClose={() => setShowConfirmation2(false)}
        loading={loadingModal}
        setLoading={setLoadingModal}
      />

      
      <AddExperienceModal 
        setMyExperiences={setMyExperiences} 
        _id={myExperiences.length > selectedIndex ? myExperiences[selectedIndex]._id : null}
        isOpen={showConfirmation} 
        onClose={() => setShowConfirmation(false)}
        type={modalTypePost}
        info={myExperiences.length > selectedIndex ? myExperiences[selectedIndex] : null}
        llamada={handleGetMyExperience}
        loading={loadingModal}
        setLoading={setLoadingModal}
        setWinKylets={setWinKylets}
      />

      <OptionsModal 
        isOpen={showConfirmation3} 
        onClose={() => setShowConfirmation3(false)} 
        options={2}
        editFunc={handleEditFunc}
        deleteFunc = {handleDeleteFunc}
        colaborators = {true}
        colaboratorsFunc = {() => navigate.navigate('Colaborators', {type: 'Experience', _id: myExperiences[selectedIndex]._id})}
      />

      <InfoModal 
        isOpen={visibleModal} 
        onClose={ () => setVisibleModal(false)} 
        Title={screenTexts.ModalTitle} 
        Subtitle= {screenTexts.ModalSubtitle} 
        Button={screenTexts.ContinueTouchable} 
      />

      <InfoModal 
        celebration={true}
        isOpen={showConfirmationKylot} 
        onClose={() => {setShowConfirmationKylot(false), setWinKylets(0)} } 
        Title={winKyletsText} 
        Subtitle={screenTexts.KyletsSubtitle} 
        Button={screenTexts.KyletsButton} 
      />
      
      <DeleteConfirmationModal 
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
        experienceName={myExperiences[selectedIndex]?.name || 'esta experiencia'}
      />
      
      {loadingModal && (
        <LoadingOverlay/>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginBottom: 50,
    marginHorizontal: -15
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  titleSection: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 8,
    letterSpacing: -0.8,
    lineHeight: 40,
    paddingHorizontal: 16,
  },
  subtitle: {
    fontSize: 17,
    color: '#6E6E73',
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: -0.2,
    paddingHorizontal: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  infoButton: {
    padding: 6,
  },
  infoIcon: {
    width: 20,  
    height: 20,
    tintColor: '#86868B',
  },
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
  content: {
    paddingTop: 8,
    paddingBottom: 100,
    backgroundColor: '#FFFFFF'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
  },
  // Empty State Styles - Premium UX/UI Design (matching Solicitudes)
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 60,
    paddingVertical: 60,
    marginTop: 0,
  },
  emptyStateImage: {
    width: 120,
    height: 120,
    marginBottom: 24,
    resizeMode: 'contain',
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D1D1F',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
    lineHeight: 30,
    paddingHorizontal: 16,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
    letterSpacing: -0.2,
    maxWidth: 240,
    paddingHorizontal: 16,
  },
  createGroupButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  createGroupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  // Shared Experiences Empty State Styles
  emptyStateImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyStateEmoji: {
    fontSize: 32,
  },
  exploreButton: {
    backgroundColor: '#1D7CE4',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  exploreButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 80,
    right: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1D7CE4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 40,
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#8E8E93',
    lineHeight: 18,
    letterSpacing: -0.1,
  },
  sectionAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  sectionAddIcon: {
    fontSize: 18,
    fontWeight: '400',
    color: '#1D1D1F',
  },
  horizontalScroll: {
    paddingHorizontal: 0,
  },
  horizontalCard: {
    width: 280,
    marginRight: 16,
  },
  sectionContent: {
    paddingHorizontal: 0,
  },
  buttonAdd:{
    backgroundColor: '#1D7CE4',
    width:50,
    height:50,
    borderRadius:25,
    position: 'absolute',
    bottom:120,
    right:20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageCreate:{
    width: 35,
    height: 35
  },
});