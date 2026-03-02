import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useUser } from "../../context/useUser";
import { tagsAdvice } from '../../services/communityServices'
import Top from "../../components/Utils/Top";
import AdviceBlock from "../../components/Blocks/Community/AdviceBlock";

const Advice = ({route}) => {
  const navigation = useNavigation();
  const { isLogged, isLoading, texts, logout, translateTag, language } = useUser();
  const screenTexts = texts.pages.ComunidadPages.Advice;
  const { paisId, ciudadId } = route.params
  const [info, setInfo] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

const handleTagsAdvice = async () => {
    setLoading(true)
    setInfo([])
    try {
      await tagsAdvice( {paisId: paisId, ciudadId: ciudadId }, logout )
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
    handleTagsAdvice()
    
  },[]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all(
      handleTagsAdvice()
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
              <AdviceBlock 
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
  overlay:{
    alignSelf: 'center'
  }
});

export default Advice;
