import React, {useState, useEffect, useCallback} from 'react';
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUser } from "../../../context/useUser";
import { infoContact } from '../../../services/experienceServices'
import ContactsDetail from "../../../components/Blocks/Community/ContactsDetail";
import Top from '../../../components/Utils/Top';
import { CommentsModal } from "../../../components/wallet/Experiences/Modals/Comments";
import LoadingOverlay from '../../../components/Utils/LoadingOverlay';

const { width } = Dimensions.get('window');

export default function ExperienceContacts({ route }) {
    const navigate=useNavigation()
    const { texts, logout }=useUser()
    const screenTexts = texts.pages.WalletPages.Experiencias.ExperienceContacts
    const { _id } = route.params;
    const [info, setInfo] = useState({});
    const [comentsModal, setComentsModal] = useState(false);
    const [id, setId] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleInfoContact = async () => {
      
      try {
        await infoContact( {_id: _id }, logout )
          .then((res) => {
            setInfo(res)
            setCargando(true)
          })
          .catch((error) => {
            setError(true);
            setErrorMessage(error.message);
          });
      } catch (error) {
        setError(true);
        setErrorMessage(error.message);
      }
  
    }
  
    useEffect(() => {
      handleInfoContact()
      
    },[]);

    const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await Promise.all(
        handleInfoContact()
      );
      setRefreshing(false);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
          <Top 
            left={true} leftType={'Back'}
            typeCenter={'Text'} textCenter={screenTexts.Top}
          />
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {cargando &&
                <ContactsDetail 
                  key={info._id} 
                  _id={info._id} 
                  contactInfo={info.contactInfo} 
                  descripcion={info.descripcion} 
                  liked={info.liked} 
                  likes={info.likes} 
                  puntuacion={info.puntuacion} 
                  voted={info.voted} 
                  multimedia={info.multimedia}
                  telefono={info.telefono}
                  email={info.email}
                  setComentsModal={() => setComentsModal(true)}
                  setId={() => setId(info._id)}
                />
              }
            </ScrollView>
            <CommentsModal 
              idComments={id} 
              isOpen={comentsModal} 
              onClose={() => setComentsModal(false)} 
              loading={loading}
              setLoading={setLoading}
            />
            {loading && (
              <LoadingOverlay/>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
      },
      header: {
        height: width * 0.8,
        position: 'relative'
    },
    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 10,
      width: 40,
      height: 40,
      borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  coverImage: {
    width: '100%',
    height: '100%'
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '100%'
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20
  },
  date: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 8
},
place: {
  color: '#fff',
  fontSize: 32,
  fontWeight: '600',
  marginBottom: 8
},
description: {
  color: '#fff',
  fontSize: 16,
  opacity: 0.9
},
content: {
  marginTop: 20
},
section: {
  marginBottom: 24,
  marginLeft: 14
},
sectionTitle: {
  fontSize: 18,
  fontWeight: '600',
  marginBottom: 16,
  marginLeft: 8
},
contactCard: {
  flexDirection: 'row',
  alignItems: 'center',
  borderColor: '#9d9d9d',
  borderWidth: 0.5,
  padding: 16,
  borderRadius: 16,
  marginBottom: 12,
  width: '95%',
  backgroundColor: 'white',
  shadowColor: '#000', // Color de la sombra
  shadowOffset: { width: 0, height: 2 }, // Dirección de la sombra
  shadowOpacity: 0.2, // Opacidad de la sombra
  shadowRadius: 4, // Radio de la sombra
  elevation: 5, // Sombra en Android
},
contactAvatar: {
  width: 50,
  height: 50,
  borderRadius: 25
},
contactInfo: {
  flex: 1,
  marginLeft: 16
},
contactName: {
  fontSize: 16,
  fontWeight: '500'
},
contactRole: {
  fontSize: 14,
  color: '#666',
  marginTop: 2
},
contactActions: {
  flexDirection: 'row',
  gap: 8
},
contactButton: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#e8f2ff',
  justifyContent: 'center',
  alignItems: 'center'
},
visitors: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 8
},
visitorAvatar: {
  width: 40,
  height: 40,
  borderRadius: 20,
  marginRight: -10,
  borderWidth: 2,
  borderColor: '#fff'
},
visitorCount: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#f0f0f0',
  justifyContent: 'center',
  alignItems: 'center',
  marginLeft: 8
},
visitorCountText: {
  fontSize: 12,
  fontWeight: '500'
},
footer: {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 16,
  borderTopWidth: 1,
  borderTopColor: '#eee',
  backgroundColor: '#fff'
},
footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 12
},
footerButtonText: {
  color: '#fff',
  fontSize: 14,
    fontWeight: '500'
},
guideButton: {
  marginLeft: 'auto',
  backgroundColor: '#3b82f6'
},
guideButtonText: {
  color: '#fff',
  fontSize: 14,
    fontWeight: '500'
  }
})