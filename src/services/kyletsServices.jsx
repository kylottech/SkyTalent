import AsyncStorage from "@react-native-async-storage/async-storage";
import languageFiles from '../../assets/locales'; 
import { ENDPOINT } from "./config";

let cachedTexts = null;
let cachedLanguage = null;


const loadTexts = async () => {
  try {
    const storedLanguage = await AsyncStorage.getItem("language") || 'Espanol';

    if (cachedTexts && cachedLanguage === storedLanguage) {
      return cachedTexts;
    }

    const texts = languageFiles[storedLanguage] || {};
    cachedTexts = texts;
    cachedLanguage = storedLanguage;

    return texts.services;
  } catch (err) {
    console.error("Error cargando idioma:", err);
    return {};
  }
};

const getErrorMessageKylets = async (statusCode) => {
    const texts = await loadTexts();

    return texts.kyletsServices?.[statusCode] || texts.kyletsServices?.Default
};

//pedir precio desbloquear ciudad
//conectada
export async function unBlockCity(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/kylets/unBlockCity`,
    {
        method:'GET',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageKylets(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir precio desbloquear lugar
//no conectada
export async function unBlockPlace(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/kylets/unBlockPlace`,
    {
        method:'GET',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageKylets(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//Kylets para crear una ubicacion
//conectada
export async function createPlace(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/kylets/createPlace`,
    {
        method:'GET',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageKylets(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//Kylets para crear una comunidad
//conectada
export async function createCommunity(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/kylets/createCommunity`,
    {
        method:'GET',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageKylets(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir precio desbloquear respuesta
//conectada
export async function unblockAnswer(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/kylets/unblockAnswer`,
    {
        method:'GET',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageKylets(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}