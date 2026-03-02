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

const getErrorMessageBuzon = async (statusCode) => {
    const texts = await loadTexts();

    return texts.buzonServices?.[statusCode] || texts.buzonServices?.Default
};

//guardar nota
//conectada
export async function send(newSituation, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/buzon/create`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newSituation }),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageBuzon(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//comprobar saldo
//conectada
export async function getAvailable(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/bank/available`,
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
          let error= await getErrorMessageBuzon(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        
        return response

    })
    
}