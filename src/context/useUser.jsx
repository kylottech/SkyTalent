import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { localizeTag, localizeTags } from "../utils/tags";
import { unregisterDevice } from '../notifications/unregisterPush'
import languageFiles from '../../assets/locales';

// Crear el contexto
const UserContext = createContext();

// Proveedor del contexto
export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificacion, setVerificacion] = useState(0);
  const isFirstRender = useRef(true);
  const [language, setLanguage] = useState('Spanish');
  const [texts, setTexts] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedVerificacion = await AsyncStorage.getItem("verificacion");
        const storedLanguage = await AsyncStorage.getItem("language");

        if (storedToken != null) {
          setToken(storedToken);
          setVerificacion(Number(storedVerificacion));
        }

        if (storedLanguage != null) {
          setLanguage(storedLanguage);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const saveVerificacion = async () => {
      await AsyncStorage.setItem("verificacion", JSON.stringify(verificacion));
      setIsLoading(false);
    };
    saveVerificacion();
  }, [verificacion]);

  useEffect(() => {
    if (isLoading) return;

    const loadTexts = () => {
      if (languageFiles && languageFiles[language]) {
        const selectedTexts = languageFiles[language];
        setTexts(selectedTexts);
      } else {
        console.warn(`No se encontró archivo para el idioma: ${language}`);
        setTexts({});
      }
    };

    const saveLanguage = async () => {
      try {
        await AsyncStorage.setItem("language", language);
      } catch (error) {
        console.error("Error guardando idioma:", error);
      }
    };

    loadTexts();
    saveLanguage();
  }, [language, isLoading]);


  const logout = async () => {
    try {
      // Si tienes JWT en estado, úsalo para desregistrar el dispositivo
      if (token) {
        await unregisterDevice({ jwt: token });
      }

      await AsyncStorage.removeItem("token");
      setToken(null);
      setIsLoading(true);
      setVerificacion(0);
    } catch (error) {
      console.error("Error removing token:", error);
    }
  }

  const getLanguages = () => {
    const languages = Object.keys(languageFiles); 

    const sortedLanguages = languages.sort((a, b) => a.localeCompare(b));
  
    return sortedLanguages;
  }

  const translateTag = (tagOrTags, overrideLanguage) => {
    const langToUse = overrideLanguage || language; // 'language' viene de tu estado
    return Array.isArray(tagOrTags)
      ? localizeTags(tagOrTags, langToUse)
      : localizeTag(tagOrTags, langToUse);
  }

  return (
    <UserContext.Provider
      value={{
        isLogged: Boolean(token),
        isLoading,
        token,
        verificacion,
        language,
        texts,
        setToken,
        logout,
        setVerificacion,
        getLanguages,
        setLanguage,
        translateTag
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Hook para consumir el contexto
export const useUser = () => useContext(UserContext);
