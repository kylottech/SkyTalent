import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Image, Alert, StyleSheet, Modal, 
  KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import ToggleSwitch from 'toggle-switch-react-native'
import { useUser } from "../../../../context/useUser";
import { searcherGroup } from '../../../../services/communityServices';
import { create } from '../../../../services/activitiesServices';
import { SafeAreaView } from 'react-native-safe-area-context';
import GradientButton from '../../../Utils/GradientButton';
import MapContainerModal from '../../../Maps/MapContainerModal';
import LoadingOverlay from '../../../Utils/LoadingOverlay';
import BuscadorComponente from '../../../Utils/Buscador';
import Error from '../../../Utils/Error';
import User from '../../Community/User';
import { LinearGradient } from 'expo-linear-gradient';
import x from '../../../../../assets/x.png'
import subir from '../../../../../assets/addImage.png';

function AddActivity({ visible, onClose, loading, setLoading, setWinKylets }) {
  const { logout, texts } = useUser()
  const navigate = useNavigation();
  const screenTexts = texts.components.Blocks.Community.Groups.AddActivity
  const mapRef = useRef(null);
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDay, setStartDay] = useState('');
  const [endDay, setEndDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [automaticAprove, setAutomaticAprove] = useState(false);
  const [location, setLocation] = useState({
    latitude: 40.4168, // Madrid por defecto
    longitude: -3.7038
  });
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [usersSelected, setUsersSelected] = useState([]);
  const [groupsSelected, setGroupsSelected] = useState([]);
  const [selectedImage, setSelectedImage] = useState(subir)
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  // DateTime Picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  // Date formatting functions
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  useEffect(() => {
      if (search.trim()) {
        handleSearcher({ search });
      } else {
        setUsers([]);
        setGroups([]);
      }
    }, [search]);

  // Reset modal state when opened
  useEffect(() => {
    if (visible) {
      console.log('AddActivity modal opened - resetting state');
      setStep(1);
      setError(false);
      setErrorMessage('');
      
      // Sincronizar estados iniciales de fecha/hora
      setStartDay(formatDate(startDate));
      setStartTime(formatTime(startDate));
      setEndDay(formatDate(endDate));
      setEndTime(formatTime(endDate));
    }
  }, [visible]);

  // Debug current step changes
  useEffect(() => {
    console.log(`Current step changed to: ${step}`);
  }, [step]);

  // Picker handlers
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setStartDay(formatDate(selectedDate));
    }
  };

  const onStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartDate(new Date(selectedTime));
      setStartTime(formatTime(selectedTime));
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setEndDay(formatDate(selectedDate));
    }
  };

  const onEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndDate(new Date(selectedTime));
      setEndTime(formatTime(selectedTime));
    }
  };

    const handleLocationChange = (newLocation) => {
        setLocation({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
        });
        
    };

    const handleSearcher = async ({ search }) => {
        setLoading(true);
        setUsers([]);
        setGroups([]);
        try {
          searcherGroup({ search }, logout)
            .then((res) => {
              setUsers(res?.users || []);
              setGroups(res?.groups || []);
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
    };

    const handleCreate = async () => {
        console.log('=== handleCreate started ===');
        setLoading(true);
        setError(false); // Clear any previous errors

        // Timeout de seguridad para evitar que se quede colgado
        const timeoutId = setTimeout(() => {
            console.error('Activity creation timeout - forcing loading to false');
            setLoading(false);
            setError(true);
            setErrorMessage('La creación de la actividad tardó demasiado. Inténtalo de nuevo.');
        }, 30000); // 30 segundos timeout

        try {
            // Crear objetos Date a partir de los strings guardados
            const parseDateTime = (day, time) => {
                console.log(`Parsing: ${day} - ${time}`);
                const [dd, mm, yyyy] = day.split('/');
                const [hh, min] = time.split(':');
                
                // Crear la fecha en el formato correcto 'YYYY-MM-DDTHH:mm:ss'
                const isoString = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}T${hh.padStart(2, '0')}:${min.padStart(2, '0')}:00`;
                const date = new Date(isoString);
                
                console.log(`Created date: ${isoString} -> ${date.toISOString()}`);
                
                // Validar que la fecha sea válida
                if (isNaN(date.getTime())) {
                    console.error(`Invalid date created from: ${day} ${time}`);
                    throw new Error(`Fecha o hora inválida: ${day} ${time}`);
                }
                
                return date;
            };

            console.log('Parsing start date...');
            const start = parseDateTime(startDay, startTime);
            console.log('Parsing end date...');
            const end = parseDateTime(endDay, endTime);

            const payload = {
                image: selectedImage?.uri,
                name: name.trim(),
                description: description.trim(),
                start,
                end,
                isPublic,
                automaticAprove,
                users: usersSelected.map(u => u._id),
                groups: groupsSelected.map(g => g._id),
                location: {
                latitude: location.latitude,
                longitude: location.longitude,
                },
            };

            console.log('Creating activity with payload:', payload);
            console.log('Image URI:', payload.image);
            console.log('Start ISO:', payload.start.toISOString());
            console.log('End ISO:', payload.end.toISOString());
            console.log('Location:', payload.location);
            console.log('Users array:', payload.users);
            console.log('Groups array:', payload.groups);
            console.log('IsPublic:', payload.isPublic);
            console.log('AutomaticAprove:', payload.automaticAprove);

            console.log('Calling create service...');
            const result = await create(payload, logout);
            
            console.log('Activity created successfully:', result);
            
            // Limpiar timeout
            clearTimeout(timeoutId);
            
            // Resetear estado
            setSelectedImage(subir);
            setName('');
            setDescription('');
            setStartDay('');
            setEndDay('');
            setStartTime('');
            setEndTime('');
            setIsPublic(false);
            setAutomaticAprove(false);
            setGroupsSelected([]);
            setUsersSelected([]);
            setLocation({
              latitude: 40.4168, // Madrid por defecto
              longitude: -3.7038
            });
            setUsers([]);
            setGroups([]);
            setWinKylets(result.kylets);
            setStep(1);
            setLoading(false);
            onClose();
            
        } catch (error) {
            console.error('Error creating activity:', error);
            // Limpiar timeout
            clearTimeout(timeoutId);
            setError(true);
            setErrorMessage(error.message || error.toString() || 'Error al crear la actividad');
            setLoading(false);
        }
        
        console.log('=== handleCreate finished ===');
    };

    const handleSubmit = () => {
        console.log('Starting final validation before creating...');
        console.log('Current state:', {
            location,
            isPublic,
            usersSelected: usersSelected.length,
            groupsSelected: groupsSelected.length,
            startDay,
            startTime,
            endDay,
            endTime,
            name: name.trim(),
            description: description.trim()
        });
        
        // Validación final de ubicación (lo único que falta en paso 4)
        if (!location?.latitude || !location?.longitude) {
            console.log('Final validation failed: No location selected');
            setError(true);
            setErrorMessage('Debes seleccionar una ubicación para la actividad');
            return;
        }

        // Validación de usuarios y grupos (solo si la actividad no es pública)
        // Comentamos esta validación para permitir actividades privadas sin invitaciones específicas
        // if (!isPublic && usersSelected.length === 0 && groupsSelected.length === 0) {
        //     console.log('Final validation failed: Private activity needs invitations');
        //     setError(true);
        //     setErrorMessage('Para una actividad privada necesitas invitar al menos un usuario o grupo');
        //     return;
        // }

        console.log('All final validations passed, creating activity...');
        handleCreate();
    };

  const handleUser = (item) => {
    setUsersSelected(prev => [...prev, item])
    
  };

  const handleGroup = (item) => {
    setGroupsSelected(prev => [...prev, item])
    
  };

    const handleImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            setErrorMessage(screenTexts.PermissionError);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
            selectionLimit: 1,
            orderedSelection: true
        });

        if (!result.canceled) {
            setSelectedImage({uri: result.assets[0].uri});
        }
    };

    const renderStep1 = () => {
        return (
        <View style={styles.stepContainer}>
        <View style={styles.headerContainer}>
            <Text style={styles.title}>{screenTexts.Title}</Text>
            <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
        </View>
        
        <View style={styles.imageContainer}>
            
            <TouchableOpacity style={styles.uploadContainer} onPress={handleImage}>
            <Image 
                source={selectedImage} 
                style={[
                typeof selectedImage === 'object' && selectedImage.uri
                    ? styles.subirFotoLocal // Si es una imagen con URI, aplica este estilo
                    : styles.subirFotoUri, // Si es una imagen local, aplica este estilo
                ]}
        
            />
            </TouchableOpacity>
        </View>
        </View>
    )};

  const renderStep2 = () => {
    return (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{screenTexts.TitleInput}</Text>
          <TextInput
            value={name}
            onChangeText={(text) => setName(text)}
            style={styles.input}
            placeholder={screenTexts.TitlePlaceHolder}
          />
        </View>
        <View style={styles.inputGroup}>
        <Text style={styles.label}>{screenTexts.Description}</Text>
            <TextInput
            value={description}
            onChangeText={(text) => setDescription(text)}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={3}
            placeholder={screenTexts.Description}
            />
        </View>

        {/* Start DateTime Section */}
        <View style={styles.dateTimeSection}>
          <Text style={styles.dateTimeSectionTitle}>{screenTexts.Start}</Text>
          <View style={styles.dateTimeRow}>
            {/* Start Date Picker */}
            <TouchableOpacity 
              style={styles.dateTimeCard}
              onPress={() => setShowStartDatePicker(true)}
            >
              <View style={styles.dateTimeIcon}>
                <Text style={styles.dateTimeIconText}>📅</Text>
            </View>
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Fecha</Text>
                <Text style={styles.dateTimeValue}>
                  {startDay || formatDate(startDate)}
                </Text>
          </View>
            </TouchableOpacity>

            {/* Start Time Picker */}
            <TouchableOpacity 
              style={styles.dateTimeCard}
              onPress={() => setShowStartTimePicker(true)}
            >
              <View style={styles.dateTimeIcon}>
                <Text style={styles.dateTimeIconText}>🕐</Text>
            </View>
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Hora</Text>
                <Text style={styles.dateTimeValue}>
                  {startTime || formatTime(startDate)}
                </Text>
          </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dateTimeSection}>
          <Text style={styles.dateTimeSectionTitle}>{screenTexts.End}</Text>
          <View style={styles.dateTimeRow}>
            {/* End Date Picker */}
            <TouchableOpacity 
              style={styles.dateTimeCard}
              onPress={() => setShowEndDatePicker(true)}
            >
              <View style={styles.dateTimeIcon}>
                <Text style={styles.dateTimeIconText}>📅</Text>
            </View>
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Fecha</Text>
                <Text style={styles.dateTimeValue}>
                  {endDay || formatDate(endDate)}
                </Text>
          </View>
            </TouchableOpacity>

            {/* End Time Picker */}
            <TouchableOpacity 
              style={styles.dateTimeCard}
              onPress={() => setShowEndTimePicker(true)}
            >
              <View style={styles.dateTimeIcon}>
                <Text style={styles.dateTimeIconText}>🕐</Text>
            </View>
              <View style={styles.dateTimeContent}>
                <Text style={styles.dateTimeLabel}>Hora</Text>
                <Text style={styles.dateTimeValue}>
                  {endTime || formatTime(endDate)}
                </Text>
          </View>
            </TouchableOpacity>
          </View>
        </View>

         
        
      </View>
    </View>
  )};

  const renderStep3 = () => {
    return (
    <View style={styles.stepContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle}</Text>
      </View>

      {/* Settings Section */}
      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>Configuración de la actividad</Text>
        
        {/* Public Activity Setting */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>{screenTexts.Public}</Text>
            <Text style={styles.settingSubtitle}>
              {isPublic ? 'Cualquier usuario puede ver y unirse' : 'Solo miembros invitados pueden participar'}
            </Text>
          </View>
              <ToggleSwitch
                  isOn={isPublic}
                  onColor="#1D7CE4"
            offColor="#E5E7EB"
                  size="medium"
            trackOnStyle={{ borderRadius: 12 }}
            trackOffStyle={{ borderRadius: 12 }}
                  onToggle={(value) => setIsPublic(value)}
              />
            </View>

        {/* Automatic Approval Setting (only shown when activity is public) */}
        {isPublic && (
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingTitle}>{screenTexts.AutomaticAprove}</Text>
              <Text style={styles.settingSubtitle}>
                {automaticAprove ? 'Los usuarios se unen automáticamente' : 'Requiere aprobación para participar'}
              </Text>
        </View>
                <ToggleSwitch
                    isOn={automaticAprove}
                    onColor="#1D7CE4"
              offColor="#E5E7EB"
                    size="medium"
              trackOnStyle={{ borderRadius: 12 }}
              trackOffStyle={{ borderRadius: 12 }}
                    onToggle={(value) => setAutomaticAprove(value)}
                />
                </View>
        )}
            </View>

      <View style={styles.headerContainer}>
        <Text style={styles.title}>{screenTexts.Title2}</Text>
        <Text style={styles.subtitle}>{screenTexts.Subtitle2}</Text>
      </View>

      <BuscadorComponente placeholder={screenTexts.SearcherPlaceHolder} search={search} func={setSearch} />

      {search.trim().length > 0 && (users.length > 0 || groups.length > 0 || loading) && (
        <View style={styles.searchContainer}>
        <ScrollView 
          contentContainerStyle={styles.modalContainer2}
          
        >
          {loading ? (
            <ActivityIndicator size="large" color="#1D7CE4" />
          ) : (
            <>
              {users.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{screenTexts.UsersSectionTitle}</Text>
                  {users.filter(u => !usersSelected.some(su => su._id === u._id)).map((item, index) => (
                    <User
                      key={`user-${index}`}
                      profileImage={item.avatar?.url}
                      fullName={`${item.name} ${item.surname}`}
                      username={item.kylotId}
                      _id={item._id}
                      onPress={() => handleUser(item)}
                    />
                  ))}
                </>
              )}
              {groups.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>{screenTexts.GroupsSectionTitle}</Text>
                  {groups.filter(g => !groupsSelected.some(sg => sg._id === g._id)).map((group, index) => (
                    <TouchableOpacity key={`group-${index}`} onPress={() => handleGroup(group)}>
                      <Text style={styles.groupText}>
                        {group.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </>
              )}
              {users.length === 0 && groups.length === 0 && (
                <Text style={styles.noResultsText}>{screenTexts.NoItemsTexts}</Text>
              )}
            </>
          )}
        </ScrollView>
        </View>
      )}
      
      {/* Selected Invitations Section */}
      <View style={styles.selectedInvitationsContainer}>
        {(usersSelected.length > 0 || groupsSelected.length > 0) ? (
          <>
            <View style={styles.invitationsHeader}>
              <Text style={styles.invitationsTitle}>Invitaciones seleccionadas</Text>
              <View style={styles.invitationsCount}>
                <Text style={styles.invitationsCountText}>
                  {usersSelected.length + groupsSelected.length}
                </Text>
              </View>
            </View>

            {/* Selected Users Section */}
            {usersSelected.length > 0 && (
              <View style={styles.selectedSection}>
                <Text style={styles.selectedSectionTitle}>
                  <Text style={styles.selectedSectionTitleIcon}>👤</Text> {usersSelected.length} {screenTexts.UsersSectionTitle}
                </Text>
                <View style={styles.selectedItemsContainer}>
                  {usersSelected.map((item, index) => (
                    <TouchableOpacity
                      key={`selected-user-${index}`}
                      style={styles.selectedUserCard}
                      onPress={() => {
                        setUsersSelected(prev => prev.filter(u => u._id !== item._id));
                      }}
                    >
                      <View style={styles.selectedItemContent}>
                        <Image 
                          source={{ uri: item.avatar?.url || '' }} 
                          style={styles.selectedUserAvatar} 
                        />
                        <View style={styles.selectedUserInfo}>
                          <Text style={styles.selectedUserName}>
                            {item.name} {item.surname}
                          </Text>
                          <Text style={styles.selectedUserUsername}>
                            @{item.kylotId}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.removeButton}>
                        <Text style={styles.removeButtonIcon}>×</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Selected Groups Section */}
              {groupsSelected.length > 0 && (
              <View style={styles.selectedSection}>
                <Text style={styles.selectedSectionTitle}>
                  <Text style={styles.selectedSectionTitleIcon}>👥</Text> {groupsSelected.length} {screenTexts.GroupsSectionTitle}
                </Text>
                <View style={styles.selectedItemsContainer}>
                  {groupsSelected.map((group, index) => (
                    <TouchableOpacity
                      key={`selected-group-${index}`}
                      style={styles.selectedGroupCard}
                      onPress={() => {
                        setGroupsSelected(prev => prev.filter(g => g._id !== group._id));
                      }}
                    >
                      <View style={styles.selectedItemContent}>
                        <View style={styles.selectedGroupIcon}>
                          <Text style={styles.selectedGroupIconText}>👥</Text>
                        </View>
                        <View style={styles.selectedGroupInfo}>
                          <Text style={styles.selectedGroupName}>
                        {group.name}
                      </Text>
                        </View>
                      </View>
                      <TouchableOpacity style={styles.removeButton}>
                        <Text style={styles.removeButtonIcon}>×</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              )}
            </>
        ) : (
          <View style={styles.emptySelectedContainer}>
            <Text style={styles.emptySelectedIcon}>📝</Text>
            <Text style={styles.emptySelectedTitle}>No hay invitaciones</Text>
            <Text style={styles.emptySelectedSubtitle}>
              Busca usuarios o grupos arriba para invitarlos
            </Text>
          </View>
        )}
      </View>
    </View>
  )};

  const renderStep4 = () => {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>{screenTexts.LocationTitle}</Text>
        <Text style={{ fontSize: 14, color: 'gray', marginBottom: 12 }}>
          {screenTexts.LocationSubtitle}
        </Text>

        {/* MapContainerModal optimizado para modales */}
        <View style={styles.mapWrapper}>
          <MapContainerModal 
              ref={mapRef}
              type={'Add'} 
              func={handleLocationChange}
              ciudad={'Madrid'}
              coords={{latitude: location.latitude, longitude: location.longitude}}
              setError={setError} 
              setErrorMessage={setErrorMessage}
          />
        </View>
      </View>
    );
};

  return (
    <Modal
      visible={visible}
      animationType="slide" 
      transparent
      onRequestClose={() => {
        console.log('Modal closing requested');
        onClose();
      }}
    >
      <SafeAreaView style={styles.modalContainer}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView} 
        >
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{screenTexts.Top}</Text>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
              >
                <Image source={x} style={styles.x}/>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
              <View 
                style={[
                  styles.progressBar,
                  { width: `${(step / 4) * 100}%` }
                ]} 
              >
                <LinearGradient
                  colors={[ '#004999', '#1D7CE4']}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradient}
                />
              </View>  
            </View>

            {/* Steps Indicator */}
            <View style={styles.stepsIndicator}>
              <Text style={[styles.stepText, step === 1 && styles.activeStep]}>
              {screenTexts.Menu1}
              </Text>
              <Text style={[styles.stepText, step === 2 && styles.activeStep]}>
              {screenTexts.Menu2}
              </Text>
              <Text style={[styles.stepText, step === 3 && styles.activeStep]}>
              {screenTexts.Menu3}
              </Text>
              <Text style={[styles.stepText, step === 4 && styles.activeStep]}>
              {screenTexts.Menu4}
              </Text>
            </View>

            {/* Content */}
            <ScrollView style={styles.content} contentContainerStyle={{ flexGrow: 1 }}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
            </ScrollView>

            {/* DateTime Picker Modals */}
            {showStartDatePicker && (
              <Modal
                visible={showStartDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStartDatePicker(false)}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Seleccionar fecha de inicio</Text>
                      <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                        <Text style={styles.pickerDone}>Listo</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Simplified Date Grid */}
                    <View style={styles.minimalPickerContainer}>
                      <Text style={styles.minimalPickerTitle}>
                        {startDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + 
                         startDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).slice(1)}
                      </Text>
                      
                      <View style={styles.dateGrid}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <TouchableOpacity
                            key={day}
                            style={[styles.minimalDayButton, day === startDate.getDate() && styles.minimalSelectedButton]}
                            onPress={() => {
                              const newDate = new Date(startDate);
                              newDate.setDate(day);
                              setStartDate(newDate);
                            }}
                          >
                            <Text style={[styles.minimalDayText, day === startDate.getDate() && styles.minimalSelectedText]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      {/* Month Navigation */}
                      <View style={styles.minimalMonthNav}>
                        <TouchableOpacity 
                          style={styles.minimalNavButton}
                          onPress={() => {
                            const newDate = new Date(startDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setStartDate(newDate);
                          }}
                        >
                          <Text style={styles.minimalNavText}>‹</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.minimalNavButton}
                          onPress={() => {
                            const newDate = new Date(startDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setStartDate(newDate);
                          }}
                        >
                          <Text style={styles.minimalNavText}>›</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.pickerButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.pickerButton}
                        onPress={() => {
                          setShowStartDatePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerConfirmButton}
                        onPress={() => {
                          console.log('Confirming start date:', formatDate(startDate));
                          setStartDay(formatDate(startDate));
                          setShowStartDatePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerConfirmButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {showStartTimePicker && (
              <Modal
                visible={showStartTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowStartTimePicker(false)}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Seleccionar hora de inicio</Text>
                      <TouchableOpacity onPress={() => setShowStartTimePicker(false)}>
                        <Text style={styles.pickerDone}>Listo</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Simplified Time Selector */}
                    <View style={styles.minimalTimeContainer}>
                      <View style={styles.timeDisplay}>
                        <Text style={styles.minimalTimeText}>Hora</Text>
                        <Text style={styles.minimalCurrentTime}>
                          {startDate.getHours().toString().padStart(2, '0')}:{(Math.floor(startDate.getMinutes() / 5) * 5).toString().padStart(2, '0')}
                        </Text>
                      </View>
                      
                      {/* Quick Time Selection */}
                      <View style={styles.quickTimeGrid}>
                        {[
                          '09:00', '10:00', '11:00', '12:00',
                          '14:00', '15:00', '16:00', '17:00',
                          '18:00', '19:00', '20:00', '21:00'
                        ].map((time) => {
                          const [hours, minutes] = time.split(':').map(Number);
                          const isSelected = startDate.getHours() === hours && 
                                            Math.floor(startDate.getMinutes() / 5) * 5 === minutes;
                          
                          return (
                            <TouchableOpacity
                              key={time}
                              style={[styles.quickTimeButton, isSelected && styles.minimalSelectedButton]}
                              onPress={() => {
                                const newDate = new Date(startDate);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                setStartDate(newDate);
                              }}
                            >
                              <Text style={[styles.quickTimeText, isSelected && styles.minimalSelectedText]}>
                                {time}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.pickerButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.pickerButton}
                        onPress={() => {
                          setShowStartTimePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerConfirmButton}
                        onPress={() => {
                          console.log('Confirming start time:', formatTime(startDate));
                          setStartTime(formatTime(startDate));
                          setShowStartTimePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerConfirmButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {showEndDatePicker && (
              <Modal
                visible={showEndDatePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEndDatePicker(false)}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Seleccionar fecha de fin</Text>
                      <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                        <Text style={styles.pickerDone}>Listo</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Simplified Date Grid */}
                    <View style={styles.minimalPickerContainer}>
                      <Text style={styles.minimalPickerTitle}>
                        {endDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).charAt(0).toUpperCase() + 
                         endDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).slice(1)}
                      </Text>
                      
                      <View style={styles.dateGrid}>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <TouchableOpacity
                            key={day}
                            style={[styles.minimalDayButton, day === endDate.getDate() && styles.minimalSelectedButton]}
                            onPress={() => {
                              const newDate = new Date(endDate);
                              newDate.setDate(day);
                              setEndDate(newDate);
                            }}
                          >
                            <Text style={[styles.minimalDayText, day === endDate.getDate() && styles.minimalSelectedText]}>
                              {day}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                      
                      {/* Month Navigation */}
                      <View style={styles.minimalMonthNav}>
                        <TouchableOpacity 
                          style={styles.minimalNavButton}
                          onPress={() => {
                            const newDate = new Date(endDate);
                            newDate.setMonth(newDate.getMonth() - 1);
                            setEndDate(newDate);
                          }}
                        >
                          <Text style={styles.minimalNavText}>‹</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.minimalNavButton}
                          onPress={() => {
                            const newDate = new Date(endDate);
                            newDate.setMonth(newDate.getMonth() + 1);
                            setEndDate(newDate);
                          }}
                        >
                          <Text style={styles.minimalNavText}>›</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={styles.pickerButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.pickerButton}
                        onPress={() => {
                          setShowEndDatePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerConfirmButton}
                        onPress={() => {
                          console.log('Confirming end date:', formatDate(endDate));
                          setEndDay(formatDate(endDate));
                          setShowEndDatePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerConfirmButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {showEndTimePicker && (
              <Modal
                visible={showEndTimePicker}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowEndTimePicker(false)}
              >
                <View style={styles.pickerModalContainer}>
                  <View style={styles.pickerModalContent}>
                    <View style={styles.pickerHeader}>
                      <Text style={styles.pickerTitle}>Seleccionar hora de fin</Text>
                      <TouchableOpacity onPress={() => setShowEndTimePicker(false)}>
                        <Text style={styles.pickerDone}>Listo</Text>
                      </TouchableOpacity>
                    </View>
                    
                    {/* Simplified Time Selector */}
                    <View style={styles.minimalTimeContainer}>
                      <View style={styles.timeDisplay}>
                        <Text style={styles.minimalTimeText}>Hora</Text>
                        <Text style={styles.minimalCurrentTime}>
                          {endDate.getHours().toString().padStart(2, '0')}:{(Math.floor(endDate.getMinutes() / 5) * 5).toString().padStart(2, '0')}
                        </Text>
                      </View>
                      
                      {/* Quick Time Selection */}
                      <View style={styles.quickTimeGrid}>
                        {[
                          '09:00', '10:00', '11:00', '12:00',
                          '14:00', '15:00', '16:00', '17:00',
                          '18:00', '19:00', '20:00', '21:00'
                        ].map((time) => {
                          const [hours, minutes] = time.split(':').map(Number);
                          const isSelected = endDate.getHours() === hours && 
                                            Math.floor(endDate.getMinutes() / 5) * 5 === minutes;
                          
                          return (
                            <TouchableOpacity
                              key={time}
                              style={[styles.quickTimeButton, isSelected && styles.minimalSelectedButton]}
                              onPress={() => {
                                const newDate = new Date(endDate);
                                newDate.setHours(hours);
                                newDate.setMinutes(minutes);
                                setEndDate(newDate);
                              }}
                            >
                              <Text style={[styles.quickTimeText, isSelected && styles.minimalSelectedText]}>
                                {time}
                              </Text>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>

                    <View style={styles.pickerButtonsContainer}>
                      <TouchableOpacity 
                        style={styles.pickerButton}
                        onPress={() => {
                          setShowEndTimePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerButtonText}>Cancelar</Text>
                      </TouchableOpacity>
                      
                      <TouchableOpacity 
                        style={styles.pickerConfirmButton}
                        onPress={() => {
                          console.log('Confirming end time:', formatTime(endDate));
                          setEndTime(formatTime(endDate));
                          setShowEndTimePicker(false);
                          setError(false);
                        }}
                      >
                        <Text style={styles.pickerConfirmButtonText}>Confirmar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            )}

            {/* Footer */}
            <View style={styles.footer}>
              {step > 1 ? (
                <TouchableOpacity
                  onPress={() => {
                    console.log(`Back button pressed - Moving from step ${step} to ${step - 1}`);
                    setStep(step - 1);
                    setError(false); // Clear any errors when going back
                  }}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>{screenTexts.Back}</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.backButton}/>
              )}
              <View style={styles.nextButton}>
                <GradientButton 
                  color='Blue' 
                  text={step === 4 ? screenTexts.GradientButton1 : screenTexts.GradientButton2}  
                  onPress={() => {
                    console.log(`Button pressed - Step: ${step}`);
                    
                    if (step === 4) {
                      console.log('Publishing activity...');
                      handleSubmit();
                    } else {
                      // Validación específica por step antes de avanz }
                      if (step === 1) {
                        // Solo requiere imagen en paso 1
                        if (!selectedImage?.uri) {
                          console.log('Step 1 validation failed: No image');
                          setError(true);
                          setErrorMessage(screenTexts.PhotoAumontError);
                          return;
                        }
                        console.log('Step 1 validation passed, moving to step 2');
                        setStep(2);
                      }
                      else if (step === 2) {
                        // Paso 2 requiere nombre, descripción y fechas/horas
                        if (!name.trim()) {
                          console.log('Step 2 validation failed: No name');
                          setError(true);
                          setErrorMessage(screenTexts.NameError);
                          return;
                        }
                        if (!description.trim()) {
                          console.log('Step 2 validation failed: No description');
                          setError(true);
                          setErrorMessage(screenTexts.DescriptionError);
                          return;
                        }
                        if (!startDay || !endDay) {
                          console.log('Step 2 validation failed: Missing dates');
                          setError(true);
                          setErrorMessage('Selecciona fechas de inicio y fin');
                          return;
                        }
                        if (!startTime || !endTime) {
                          console.log('Step 2 validation failed: Missing times');
                          setError(true);
                          setErrorMessage('Selecciona horas de inicio y fin');
                          return;
                        }
                        console.log('Step 2 validation passed, moving to step 3');
                        setStep(3);
                      }
                      else if (step === 3) {
                        // Paso 3 no requiere validación, es solo para invitaciones
                        console.log('Moving from step 3 to step 4');
                        setStep(4);
                      }
                    }
                  }}
                />
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {error && <Error message={errorMessage} func={setError} />}
      {loading && (
        <LoadingOverlay/>
      )}
    </Modal>
    
      
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingTop: 16,
  },
  keyboardAvoidingView:{
    flex: 1,
    width: '100%'
  },
  subirFotoUri: { 
    height:100,
    width:103,
  },
  subirFotoLocal:{
    width: '100%',
    height: '100%',
    borderRadius: 9, 
  },
  modalContent: {
    flex: 1,
    width:'100%',
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: 'rgba(249, 250, 251, 0.5)'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937'
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    padding: 8
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#F3F4F6'
  },
  progressBar: {
    height: '100%',
    borderTopRightRadius: 2,
    borderBottomRightRadius: 2
  },
  gradient:{
    flex: 1
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    alignSelf: 'center',
    paddingTop: 16,
    paddingBottom: 8,
    width: '100%',
  },
  stepText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: 'bold'
  },
  activeStep: {
    color: '#3B82F6'
  },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: "white",
  },
  stepContainer: {
    padding: 24,
    flex: 1,
    width: '100%'
  },
  headerContainer: {
    marginBottom: 18
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280'
  },
  imageContainer: {
    width: '100%',
    height: 150,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    marginTop: 40,
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: 'hidden'
  },
  previewImage: {
    width: '100%',
    height: '100%'
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 20
  },
  uploadContainer: {
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  uploadText: {
    fontSize: 18,
    color: '#4B5563',
    marginBottom: 4
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)'
  },
  buttonText: {
    color: '#3B82F6',
    fontWeight: '500'
  },
  formContainer: {
  },
  inputGroup: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom:10
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1F2937',
    height: 50,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  row: {
    flexDirection: 'row',
    gap: 20
  },
  flex1: {
    flex: 1
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: 'white'
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#6B7280',
    fontWeight: '500'
  },
  nextButton: {
    width: '50%'
    
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    marginTop: 20
  },
  addButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  contactsList: {
    marginTop: 24
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937'
  },
  contactRole: {
    fontSize: 14,
    color: '#6B7280'
  },
  contactActions: {
    flexDirection: 'row',
    gap: 8
  },
  actionButton: {
    padding: 8
  },
  editContainer: {
    backgroundColor: 'rgba(249, 250, 251, 0.5)',
    borderRadius: 12,
    padding: 24,
    gap: 16,
    marginTop: 24,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8
  },
  cancelButtonText: {
    color: '#6B7280',
    fontWeight: '500'
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '500'
  },
  x: {
    width: 15,
    height: 15,
  },
  // Settings Section Styles (matching AddGroup design)
  settingsSection: {
    marginBottom: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
    letterSpacing: -0.1,
  },
  settingSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    lineHeight: 18,
  },
  
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
    color: '#1D7CE4',
  },
  searchContainer: {
    width: '95%', 
    alignSelf: 'center', 
    zIndex:200,
    backgroundColor: '#f5f5f5',
    elevation: 3,
    borderRadius: 10,
    padding: 12,
  },
  modalContainer2: {
    width: '100%',
  },
  groupText: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  noResultsText: {
    color: '#9d9d9d',
    marginTop:10
  },
  
  // Enhanced Selected Invitations Styles
  selectedInvitationsContainer: {
    marginTop: 20,
    paddingVertical: 8,
  },
  invitationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  invitationsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  invitationsCount: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  invitationsCountText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedSection: {
    marginBottom: 20,
  },
  selectedSectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1D1D1F',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  selectedSectionTitleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  selectedItemsContainer: {
    gap: 8,
  },
  selectedUserCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  selectedGroupCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E6F0FF',
  },
  selectedItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#E9ECEF',
  },
  selectedUserInfo: {
    flex: 1,
  },
  selectedUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  selectedUserUsername: {
    fontSize: 14,
    color: '#8E8E93',
  },
  selectedGroupIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  selectedGroupIconText: {
    fontSize: 18,
  },
  selectedGroupInfo: {
    flex: 1,
  },
  selectedGroupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  removeButtonIcon: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptySelectedContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderStyle: 'dashed',
  },
  emptySelectedIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  emptySelectedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySelectedSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  // Enhanced Search Results Styles
  enhancedSearchContainer: {
    width: '95%',
    alignSelf: 'center',
    zIndex: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    maxHeight: '60%',
    marginBottom: 16,
  },
  searchHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  searchHeaderTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  searchScrollView: {
    maxHeight: 300,
  },
  searchScrollContent: {
    padding: 16,
  },
  searchLoadingContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  searchLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#8E8E93',
  },
  searchSection: {
    marginBottom: 20,
  },
  searchSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  searchSectionIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  searchItemsList: {
    gap: 8,
  },
  searchUserCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  searchUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    backgroundColor: '#E9ECEF',
  },
  searchUserInfo: {
    flex: 1,
  },
  searchUserName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  searchUserUsername: {
    fontSize: 13,
    color: '#8E8E93',
  },
  searchGroupCard: {
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E6F0FF',
  },
  searchGroupIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  searchGroupIconText: {
    fontSize: 16,
  },
  searchGroupInfo: {
    flex: 1,
  },
  searchGroupName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  searchEmptyContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  searchEmptyText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  
  // DateTime Picker Styles (Minimalist Design)
  dateTimeSection: {
    marginBottom: 20,
  },
  dateTimeSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateTimeCard: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateTimeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dateTimeIconText: {
    fontSize: 20,
  },
  dateTimeContent: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
    marginBottom: 4,
  },
  dateTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  
  // Picker Modal Styles
  pickerModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  pickerDone: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  pickerButtonsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  pickerButton: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
   pickerButtonText: {
     fontSize: 16,
     fontWeight: '600',
     color: '#FF3B30',
   },
   
   // Ultra Minimalist Picker Styles (Meta/Apple/Duolingo inspired)
   minimalPickerContainer: {
     paddingHorizontal: 20,
     paddingVertical: 16,
     minHeight: 280,
   },
   minimalPickerTitle: {
     fontSize: 20,
     fontWeight: '600',
     color: '#1D1D1F',
     textAlign: 'center',
     marginBottom: 24,
     letterSpacing: -0.3,
   },
   dateGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
     marginBottom: 24,
     paddingHorizontal: 4,
   },
   minimalDayButton: {
     width: 44,
     height: 44,
     borderRadius: 22,
     backgroundColor: '#F2F2F7',
     justifyContent: 'center',
     alignItems: 'center',
     marginBottom: 8,
   },
   minimalSelectedButton: {
     backgroundColor: '#007AFF',
     shadowColor: '#007AFF',
     shadowOffset: { width: 0, height: 2 },
     shadowOpacity: 0.25,
     shadowRadius: 4,
     elevation: 3,
   },
   minimalDayText: {
     fontSize: 16,
     fontWeight: '500',
     color: '#1D1D1F',
   },
   minimalSelectedText: {
     color: '#FFFFFF',
     fontWeight: '600',
   },
   minimalMonthNav: {
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     gap: 32,
   },
   minimalNavButton: {
     width: 32,
     height: 32,
     borderRadius: 16,
     backgroundColor: '#F2F2F7',
     justifyContent: 'center',
     alignItems: 'center',
   },
   minimalNavText: {
     fontSize: 18,
     fontWeight: '600',
     color: '#1D1D1F',
   },
   minimalTimeContainer: {
     paddingHorizontal: 20,
     paddingVertical: 16,
     minHeight: 240,
   },
   timeDisplay: {
     alignItems: 'center',
     marginBottom: 24,
   },
   minimalTimeText: {
     fontSize: 14,
     fontWeight: '500',
     color: '#8E8E93',
     marginBottom: 8,
   },
   minimalCurrentTime: {
     fontSize: 32,
     fontWeight: '700',
     color: '#1D1D1F',
     letterSpacing: -0.5,
   },
   quickTimeGrid: {
     flexDirection: 'row',
     flexWrap: 'wrap',
     justifyContent: 'space-between',
     gap: 8,
   },
   quickTimeButton: {
     width: '22%',
     height: 44,
     borderRadius: 10,
     backgroundColor: '#F2F2F7',
     justifyContent: 'center',
     alignItems: 'center',
     borderWidth: 1,
     borderColor: '#E5E7EB',
   },
   quickTimeText: {
     fontSize: 16,
     fontWeight: '500',
     color: '#1D1D1F',
   },
   pickerConfirmButton: {
     backgroundColor: '#007AFF',
     borderRadius: 12,
     paddingVertical: 16,
     alignItems: 'center',
     marginLeft: 8,
   },
  pickerConfirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  mapWrapper: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    elevation: 0, // Evita interferencia con el modal
    zIndex: 1, // Z-index bajo para no interferir
  },
});

export default AddActivity;