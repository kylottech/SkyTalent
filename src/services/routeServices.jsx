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

const getErrorMessageRoute = async (statusCode) => {
    const texts = await loadTexts();

    return texts.routeServices?.[statusCode] || texts.routeServices?.Default
};

//pedir rutas
//conectada
export async function getRoutes(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/route/getRoutes`,
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
          let error= await getErrorMessageRoute(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info de ruta
//conectada
export async function getRouteInfo({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/route/getRouteInfo/${_id}`,
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
          let error= await getErrorMessageRoute(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info de usuarios
//conectada
export async function getUsersInfo(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/route/getUsersInfo`,
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
          let error= await getErrorMessageRoute(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//modificar la linea de algun usuario
//conectada
export async function updateLine({_id, color, stroke, discontinuous}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/route/updateLine`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, color: color, stroke: stroke, discontinuous: discontinuous }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoute(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
    
}

//añadir una persona
//conectada
export async function addPerson({ _id }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/route/addPerson`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoute(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
    
}

//quitar una persona una persona
//conectada
export async function lessPerson({ _id }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/route/lessPerson`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageRoute(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
    
}

//añadir elemento a la ruta
//conectada
export async function uploadStep({ _id, selectedImages, logout, setErrorMessage }) {
  try {
    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();
    formData.append('_id', _id); // validatorId espera _id como campo

    selectedImages.forEach((image, index) => {
      formData.append('images', {
        uri: image.uri,
        type: 'image/jpeg',
        name: `step_${Date.now()}_${index}.jpg`
      });
    });

    const response = await fetch(`${ENDPOINT}/route/createStep`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      },
      body: formData
    });

    if (!response.ok) {
      if ([410, 411, 412].includes(response.status)) {
        logout();
        return;
      }
      const errorText = await response.text();
      throw new Error(errorText || 'Error en el servidor');
    }

    const data = await response.json();
    return data; // { success: true, routeId: ... }

  } catch (error) {
    console.error('Error al subir step:', error);
    setErrorMessage?.(error.message || 'Error al subir el paso');
    throw error;
  }
}