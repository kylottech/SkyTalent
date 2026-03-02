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

const getErrorMessageRoullete = async (statusCode) => {
    const texts = await loadTexts();

    return texts.roulleteServices?.[statusCode] || texts.roulleteServices?.Default
};

//pedir si ver ruleta
//conectada
export async function ruleta(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/ruleta/ruleta`,
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
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoullete(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//añadir kylets
//conectada
export async function kylets({kylets}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/ruleta/addKylets`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kylets: kylets }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoullete(res.status)
          throw new Error(error);
        }
        return 
     }
    )
    
}

//activar weekly
//no conectada
export async function weeklyOpen(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/ruleta/weeklyOpen`,
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
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoullete(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//data weekly
//no conectada
export async function weeklyData(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/ruleta/weeklyData`,
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
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoullete(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}