import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useUser } from "../../context/useUser";
import { tagsContact } from '../../services/communityServices'
import Top from "../../components/Utils/Top";
import ContactsBlock from "../../components/Blocks/Community/ContactsBlock";

const Contacts = ({route}) => {
  const { isLogged, isLoading, texts, logout, translateTag, language } = useUser();
  const screenTexts = texts.pages.ComunidadPages.Contacts;
  const { paisId, ciudadId } = route.params
  const [info, setInfo] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTagsContact = async () => {
    setLoading(true)
    setInfo([])
    try {
      await tagsContact( {paisId: paisId, ciudadId: ciudadId }, logout )
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
    handleTagsContact()
    
  },[]);

  const onRefresh = useCallback(async () => {
      setRefreshing(true);
      await Promise.all(
        handleTagsContact()
      );
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
        <View style={styles.grid}>
          {info.map((item, i) => (
            <View key={i} style={styles.itemWrapper}>
              <ContactsBlock 
                avatar={item.avatar}
                categoria={translateTag(item.category, language)}
                total={item.total}
                ciudadId={ciudadId}
                paisId={paisId}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  itemWrapper: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
  },
  overlay: {
    alignSelf: 'center',
    marginTop: 40,
  }
});

export default Contacts;
