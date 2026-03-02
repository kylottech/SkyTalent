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

const getErrorMessageMetrics = async (statusCode) => {
    const texts = await loadTexts();

    return texts.metricsServices?.[statusCode] || texts.metricsServices?.Default
};

//pedir metricas de paises
//conectada
export async function world(time, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/metrics/world/${time}`,
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
          let error= await getErrorMessageMetrics(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir metricas de locations
//conectada
export async function locations(time, logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/locations/${time}`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}

//pedir metricas de kylets
//conectada
export async function kylets(time, logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/kylets/${time}`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}

//pedir metricas de followers
//conectada
export async function followers(time, logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/followers/${time}`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}

//pedir metricas de newFollowers
//conectada
export async function newFollowers(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/newFollowers`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}

//pedir metricas de friends
//conectada
export async function friends(time, logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/friends/${time}`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}

//paises del progreso
//conectada
export async function getCountrie(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/countrie`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}

//paises del progreso
//conectada
export async function getCities({country}, logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/metrics/cities/${country}`,
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
        let error= await getErrorMessageMetrics(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{

      return response

  })
  
}