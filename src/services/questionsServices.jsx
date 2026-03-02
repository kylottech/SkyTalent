import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from 'react-native';
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

const getErrorMessageQuestions = async (statusCode) => {
    const texts = await loadTexts();

    return texts.questionsServices?.[statusCode] || texts.questionsServices?.Default
};

//Hay preguntas hoy???
//conectada
export async function today(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/questions/today`,
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
          let error= await getErrorMessageQuestions(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pregunta de hoy
//conectada
export async function todayData(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/questions/todayData`,
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
          let error= await getErrorMessageQuestions(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//responder
//conectada
export async function responseQuestion(payload, logout) {
  const token = await AsyncStorage.getItem('token');
  const { _id, response, media } = payload || {};

  const url = `${ENDPOINT}/questions/responseQuestion`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
  };

  let options = { method: 'POST', headers, body: null };

  if (media && media.uri && (media.type === 'image' || media.type === 'video')) {
    // ------- Envío con FormData (foto o video) -------
    const form = new FormData();

    // Nombre y mime "seguros" a partir del uri
    const uri = media.uri;
    const extGuess = (() => {
      const q = uri.split('?')[0]; // limpia query string
      const p = q.split('.').pop();
      return p && p.length < 6 ? p.toLowerCase() : (media.type === 'image' ? 'jpg' : 'mp4');
    })();

    const mime =
      media.type === 'image'
        ? (extGuess === 'jpg' ? 'image/jpeg' : `image/${extGuess}`)
        : `video/${extGuess}`;

    const filename = `response.${extGuess}`;

    // Nota: en React Native, el objeto de archivo es { uri, type, name }
    form.append('_id', _id);
    form.append('type', media.type); // opcional si tu API lo usa
    form.append('media', {
      uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
      type: mime,
      name: filename,
    });

    options.body = form;
    // ¡No pongas 'Content-Type'! fetch lo añade con el boundary automáticamente.
  } else {
    // ------- Envío como JSON (texto) -------
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify({ _id, response });
  }
console.log('p')
  const res = await fetch(url, options);

  if (!res.ok) {
    if (res.status === 410 || res.status === 412) {
      logout();
      return;
    }
    const errorMsg = await getErrorMessageQuestions(res.status);
    throw new Error(errorMsg);
  }

  // Si el backend devuelve contenido, lo parseamos; si no, devolvemos algo neutro
  if (res.status === 204) return { ok: true };
  try {
    return await res.json();
  } catch {
    return { ok: true };
  }
}

//pedir preguntas contestadas
//conectada
export async function otherQuestions({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/questions/otherQuestions/${_id}`,
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
          let error= await getErrorMessageQuestions(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//dar like
//conectada
export async function like(_id, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/questions/like`,
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
          let error= await getErrorMessageQuestions(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}

//dar dislike
//conectada
export async function dislike(_id, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/questions/disLike`,
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
          let error= await getErrorMessageQuestions(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}

//desbloquear
//conectada
export async function unblockQuestion({_id}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/questions/unblockQuestion`,
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
          let error= await getErrorMessageQuestions(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}