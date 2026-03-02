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

const getErrorMessageBank = async (statusCode) => {
    const texts = await loadTexts();

    return texts.bankServices?.[statusCode] || texts.bankServices?.Default
};

//pedir lista de amigos
//conectada
export async function friendList(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/bank/friendList`,
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
          let error= await getErrorMessageBank(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//buscaador de usuarios
//conectada
export async function searcherUser(search, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/bank/searcher/user/${search}`,
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
          let error= await getErrorMessageBank(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//buscador de telefono
//conectada
export async function searcherTlf({search}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/bank/searcher/tlf/${search}`,
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
          let error= await getErrorMessageBank(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//enviar kilets
//conectada
export async function send(amount, _id, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/bank/send`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({kylets:amount, _id: _id}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageBank(res.status)
            console.log(error)
            throw new Error(error);
        } 
        return await res.json()
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
          let error= await getErrorMessageBank(res.status)
          
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        
        return response

    })
    
}

//pedir balance
//conectada
export async function getTraking(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/bank/traking`,
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
          let error= await getErrorMessageBank(res.status)
          
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        
        return response

    })
    
}

//pedir extractos
//conectada
function getUserTimeZone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz || 'UTC';
  } catch (e) {
    return 'UTC';
  }
}

/**
 * Carga extractos paginados (20 por página) agrupados por fecha.
 * - Primera llamada: NO pases `from` (el server usará ahora).
 * - Siguientes páginas: pasa `from` = createAt del ÚLTIMO item recibido.
 *
 * @param {Function} logout  función de logout para estados 410/412
 * @param {string|Date} [from]  cursor ISO o Date
 */
export async function getExtracts(logout, from) {
  const token = await AsyncStorage.getItem('token');
  const tz = getUserTimeZone();

  let url = `${ENDPOINT}/bank/extracts`;
  if (from) {
    const iso = from instanceof Date ? from.toISOString() : new Date(from).toISOString();
    url += `?from=${encodeURIComponent(iso)}`;
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-timezone': tz, // <- importante para agrupar por día en backend
    },
  });

  if (!res.ok) {
    if (res.status === 410 || res.status === 412) {
      if (typeof logout === 'function') logout();
      return;
    }
    const error = await getErrorMessageBank(res.status);
    throw new Error(error);
  }

  const json = await res.json();
  return json; // -> [{ fecha, datos: [...] }, ...]
}

/**
 * Devuelve el siguiente cursor `from` a partir de la respuesta agrupada.
 * Busca el último grupo y el último movimiento dentro de `datos`.
 *
 * @param {Array<{fecha:string, datos:Array}>} groups
 * @returns {string|null} ISO de createAt del último movimiento
 */
export function getNextCursorFromExtracts(groups) {
  if (!Array.isArray(groups) || groups.length === 0) return null;
  const lastGroup = groups[groups.length - 1];
  if (!lastGroup || !Array.isArray(lastGroup.datos) || lastGroup.datos.length === 0) return null;
  const lastItem = lastGroup.datos[lastGroup.datos.length - 1];
  return lastItem && lastItem.createAt ? lastItem.createAt : null;
}
