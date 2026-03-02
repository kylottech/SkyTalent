import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../context/useUser";
import { searcher } from '../services/communityServices';
import CommunityMain from './ComunidadPages/CommunityMain';
import Users from './ComunidadPages/Users';
import Activities from './ComunidadPages/Activities';
import Match from './ComunidadPages/Match';
import CasaFavores from './ComunidadPages/CasaFavores';
import menu from '../../assets/menu.png';

const Comunidad = (props) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, logout, texts } = useUser();
  const screenTexts = texts.pages.Comunidad;

  const [search, setSearch] = useState('');
  const [info, setInfo] = useState([]);
  const [trucos, setTrucos] = useState(true);
  const [consejos, setConsejos] = useState(true);
  const [contactos, setContactos] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');

  const [selected, setSelected] = useState(1);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleSearcher = async ({ search }) => {
    try {
      let search2 = search === '' ? 'all' : search;
      await searcher({ search: search2, trick: trucos, advice: consejos, contact: contactos }, logout)
        .then((res) => {
          setInfo(res);
        })
        .catch((error) => {
          setError(true);
          setErrorMessage(error.message);
        });
    } catch (error) {
      setError(true);
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    handleSearcher({ search });
  }, [search, trucos, consejos, contactos]);

  return (
    <View style={styles.container}>
      {/* Header con menú hamburguesa */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{screenTexts.Top}</Text>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Image source={menu} style={styles.menuIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={true}
        alwaysBounceVertical={false}
      >
        {selected === 1 &&
          <CommunityMain/>
        }
        {selected === 2 &&
          <Users avatar={props.avatar}/>
        }
        {selected === 3 &&
          <Activities/>
        }
        {selected === 4 &&
          <Match/>
        }
        {selected === 5 &&
          <CasaFavores/>
        }
      </ScrollView>

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
                  style={[styles.menuOption, styles.menuOptionLast, selected === 3 && styles.menuOptionActive]}
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
                    {screenTexts.Menu4}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.menuOption, styles.menuOptionLast, selected === 5 && styles.menuOptionActive]}
                  onPress={() => {
                    setSelected(5);
                    setMenuVisible(false);
                  }}
                >
                  <Text style={[styles.menuOptionText, selected === 5 && styles.menuOptionTextActive]}>
                    {screenTexts.Menu5}
                  </Text>
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
    width: '100%',
    backgroundColor: 'white',
  },
  header: {
    marginTop: 35,
    height: 64,
    paddingHorizontal: 26,
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
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    width: 24,
    height: 24,
    tintColor: '#1D1D1F',
  },
  scrollContainer:{
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 15,
    flexGrow: 1
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '70%',
    maxWidth: 280,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  menuOption: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F2F2F7',
  },
  menuOptionLast: {
    borderBottomWidth: 0,
  },
  menuOptionActive: {
    backgroundColor: '#F8F9FF',
  },
  menuOptionText: {
    fontSize: 17,
    color: '#1D1D1F',
    fontWeight: '400',
    textAlign: 'center',
  },
  menuOptionTextActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
});

export default Comunidad;