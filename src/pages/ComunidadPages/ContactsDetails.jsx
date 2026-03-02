import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import { infoContact } from '../../services/communityServices'
import Top from "../../components/Utils/Top";
import ContactsDetail from "../../components/Blocks/Community/ContactsDetail";
import { CommentsModal } from "../../components/wallet/Experiences/Modals/Comments";
import LoadingOverlay from '../../components/Utils/LoadingOverlay';
import Error from '../../components/Utils/Error';


const ContactsDetails = ({route}) => {
  const navigate = useNavigation();
  const { isLogged, isLoading, texts, logout } = useUser();
  const screenTexts = texts.pages.ComunidadPages.ContactsDetails;
  const { paisId, ciudadId, categoriaId } = route.params
  const [info, setInfo] = useState([]);
  const [comentsModal, setComentsModal] = useState(false);
  const [id, setId] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Errorrr');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);

  const handleInfoContact = async () => {
    setLoading(true)
    setInfo([])
    try {
      await infoContact( {paisId: paisId, ciudadId: ciudadId, categoriaId: categoriaId }, logout )
        .then((res) => {
          setInfo(res)
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

  useEffect(() => {
    handleInfoContact()
    
  },[]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleInfoContact()
    setRefreshing(false);
  }, []);


  return (
    <View style={styles.container}>
      <Top left={true} leftType={"Back"} typeCenter={"Text"} textCenter={screenTexts.Top} />
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {(info.length === 0 && loading) && 
          <View style={styles.overlay}>
            <ActivityIndicator size="large" color="#1D7CE4" />
          </View>
        }
        {info.map((item, index) => (
          <ContactsDetail 
            key={item._id} 
            _id={item._id} 
            contactInfo={item.contactInfo} 
            descripcion={item.descripcion} 
            liked={item.liked} 
            likes={item.likes} 
            puntuacion={item.puntuacion} 
            voted={item.voted} 
            multimedia={item.multimedia}
            telefono={item.telefono}
            email={item.email}
            setComentsModal={() => setComentsModal(true)}
            setId={() => setId(item._id)}
          />
        ))}
      </ScrollView>
      <CommentsModal 
        idComments={id} 
        isOpen={comentsModal} 
        onClose={() => setComentsModal(false)} 
        loading={loadingModal}
        setLoading={setLoadingModal}
      />
      {error &&
      
        <Error message={errorMessage} func={setError} />

      }
      {loadingModal && (
        <LoadingOverlay/>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 16,
    maxWidth: 768,
    alignSelf: 'center',
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  itemWrapper: {
    width: '48%',
    marginBottom: 16,
  },
});

export default ContactsDetails;
