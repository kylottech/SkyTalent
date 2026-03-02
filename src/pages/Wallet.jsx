import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Animated, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { LinearGradient } from 'expo-linear-gradient';
import { notification } from '../services/notificationServices';
import Listas from './WalletPages/Listas/Listas';
import Experiencias from './WalletPages/Experiencias/Experiencias';
import Album from './WalletPages/Album/Album';
import Pasaporte from './WalletPages/Experiencias/Pasaporte';
import RetoDiario from './WalletPages/Experiencias/RetoDiario';
import Expose from './WalletPages/Experiencias/Expose';
import createButton from '../../assets/createButton.png'
import menu from '../../assets/menu.png';
import Error from '../components/Utils/Error';
import Confirmacion from '../components/Utils/Confirmacion';



const Wallet = (props) => {
    const navigate=useNavigation()
    const { isLogged, isLoading, texts, logout } = useUser();
    const screenTexts = texts.pages.Wallet
    const [selected, setSelected] = useState(1);
    const [kylets, setKylets] = useState(0);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Errorrr');
    const [confirmacion, setConfirmacion] = useState(false);
    const [confirmacionMensaje, setConfirmacionMensaje] = useState('Errorrr');
    const [menuVisible, setMenuVisible] = useState(false);
    const [hasNotification, setHasNotification] = useState(false);

  useEffect(() => {
    if (!isLoading && !isLogged) {
      navigate.navigate("Login");
    }
  }, [isLogged, isLoading]);

  useEffect(() => {
      
      setKylets(props.amount)
    
    },[props])

  const handleNotification = async () => {
    try {
      const response = await notification(logout);
      setHasNotification(response === true);
    } catch (error) {
      // Error al obtener notificaciones
    }
  };

  const handleNavigateToNotifications = () => {
    setHasNotification(false); // Oculta el punto rojo
    navigate.navigate('Notificaciones'); // Navega a pantalla de notificaciones
  };

  useEffect(() => {
    let intervalId;
    handleNotification(); // Llamada inmediata
    intervalId = setInterval(() => {
      handleNotification();
    }, 30000); // Cada 30s

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);


  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>{screenTexts.Loader}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
        {/* Consolidated header with Top component functionality and hamburger menu */}
        <View style={styles.consolidatedHeader}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{screenTexts.Top}</Text>
            
            {/* Right side with notifications and kylets */}
            <View style={styles.rightSection}>
              {/* Notifications */}
              <TouchableOpacity style={styles.notificationButton} onPress={handleNavigateToNotifications}>
                <Image source={require('../../assets/iconoNotificaciones.png')} style={styles.notificationIcon} />
                {hasNotification && <View style={styles.redDot} />}
              </TouchableOpacity>
              
              {/* Kylets */}
              <TouchableOpacity style={styles.kyletsButton} onPress={() => navigate.navigate('Banco')}>
                <Image source={require('../../assets/CORONA_DORADA.png')} style={styles.coronaIcon} />
                <Text style={styles.kyletsText}>{kylets}</Text>
              </TouchableOpacity>
              
              {/* Hamburger menu */}
              <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Image source={menu} style={styles.menuIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.contentContainer}>
        {selected === 1 &&
          <Listas
            setError={setError} 
            setErrorMessage={setErrorMessage} 
            setConfirmacion={setConfirmacion} 
            setConfirmacionMensaje={setConfirmacionMensaje}
          />
        }
        {selected === 2 &&
          <Experiencias
            setError={setError} 
            setErrorMessage={setErrorMessage} 
            setConfirmacion={setConfirmacion} 
            setConfirmacionMensaje={setConfirmacionMensaje}
          />
        }
        {selected === 3 &&
          <Album 
            setError={setError} 
            setErrorMessage={setErrorMessage} 
            setConfirmacion={setConfirmacion} 
            setConfirmacionMensaje={setConfirmacionMensaje}
          />
        }
        {selected === 4 &&
          <Pasaporte />
        }
        {selected === 5 &&
          <RetoDiario />
        }
        {selected === 6 &&
          <Expose />
        }
        </View>
        
        {selected === 1 &&
        <>
                    
          <LinearGradient
            colors={[ '#004999', '#1D7CE4']}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.buttonAdd}
          >
            <TouchableOpacity onPress={() => navigate.navigate('AddList')}>
              <Image source={createButton} style={styles.imageCreate}/>
            </TouchableOpacity>
          </LinearGradient>
        </>
      }

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.menuContainer}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>Seleccionar sección</Text>
                  <TouchableOpacity 
                    style={styles.closeButton}
                    onPress={() => setMenuVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
                
                <View style={styles.menuOptions}>
                  <TouchableOpacity
                    style={[styles.menuOption, selected === 1 && styles.menuOptionActive]}
                    onPress={() => {
                      setSelected(1);
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.menuOptionText, selected === 1 && styles.menuOptionTextActive]}>
                      {screenTexts.Menu1}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuOption, selected === 2 && styles.menuOptionActive]}
                    onPress={() => {
                      setSelected(2);
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.menuOptionText, selected === 2 && styles.menuOptionTextActive]}>
                      {screenTexts.Menu2}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuOption, selected === 3 && styles.menuOptionActive]}
                    onPress={() => {
                      setSelected(3);
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.menuOptionText, selected === 3 && styles.menuOptionTextActive]}>
                      {screenTexts.Menu3}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuOption, selected === 4 && styles.menuOptionActive]}
                    onPress={() => {
                      setSelected(4);
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.menuOptionText, selected === 4 && styles.menuOptionTextActive]}>
                      {screenTexts.Pasaporte?.Title || 'Pasaporte'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuOption, selected === 5 && styles.menuOptionActive]}
                    onPress={() => {
                      setSelected(5);
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.menuOptionText, selected === 5 && styles.menuOptionTextActive]}>
                      {screenTexts.RetoDiario?.Title || 'Reto Diario'}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.menuOption, selected === 6 && styles.menuOptionActive]}
                    onPress={() => {
                      setSelected(6);
                      setMenuVisible(false);
                    }}
                  >
                    <Text style={[styles.menuOptionText, selected === 6 && styles.menuOptionTextActive]}>
                      {screenTexts.Expose?.Title || 'Expose'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {error &&

        <Error message={errorMessage} func={setError} />

      }

      {confirmacion &&

        <Confirmacion message={confirmacionMensaje} func={setConfirmacion} />

      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'white',
  },
  consolidatedHeader: {
    marginTop: 35,
    height: 64,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
    letterSpacing: -0.3,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationButton: {
    width: 46,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 26,
    height: 26,
  },
  kyletsButton: {
    backgroundColor: 'white',
    minWidth: 72,
    height: 36,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#E5E5E5',
    borderWidth: 1,
    gap: 5,
  },
  coronaIcon: {
    width: 20,
    height: 20,
  },
  kyletsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2A2A2A',
    letterSpacing: -0.2,
  },
  menuButton: {
    width: 46,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuIcon: {
    width: 30,
    height: 24,
  },
  redDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#1D7CE4',
    borderWidth: 1.5,
    borderColor: 'white',
    zIndex: 2,
  },
  contentContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '80%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 16,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  closeButton: {
    padding: 4,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#86868B',
    fontWeight: '400',
  },
  menuOptions: {
    padding: 8,
  },
  menuOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginVertical: 4,
  },
  menuOptionActive: {
    backgroundColor: '#F2F2F7',
  },
  menuOptionText: {
    fontSize: 16,
    color: '#1D1D1F',
    fontWeight: '400',
  },
  menuOptionTextActive: {
    color: '#1D7CE4',
    fontWeight: '600',
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
  blocked: {
    flex: 1,
    marginLeft: -18
  }
});

export default Wallet;
