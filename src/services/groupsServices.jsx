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

const getErrorMessageGroups = async (statusCode) => {
    const texts = await loadTexts();

    return texts.groupsServices?.[statusCode] || texts.groupsServices?.Default
};

//pedir mis grupos
//conectada
export async function getMyGroups(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/groups/getMyGroups`,
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
          let error= await getErrorMessageGroups(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//crear grupo
//conectada
export async function createGroup({ name, automaticAprove, ids, description }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/createGroup`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      automaticAprove,
      ids,
      description
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return await res.json()
    })
}

//pedir solicitudes
//conectada
export async function getRequests(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/groups/getRequests`,
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
          let error= await getErrorMessageGroups(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir invitaciones
//conectada
export async function getInvitations(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/groups/getInvitations`,
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
          let error= await getErrorMessageGroups(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//aceptar invitacion a grupo
//conectada
export async function acept({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/acept`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return
    })
}

//rechazar invitacion a grupo
//conectada
export async function reject({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/reject`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return
    })
}

//lista de usuarios de un grupo
//conectada
export async function getUsers({ _id, page = 1 }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/getUsers/${_id}/${page}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return await res.json();
    })
    .then((response) => {
      return response;
    });
}

//info basica grupo
//conectada
export async function getInfo({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/getInfo/${_id}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return await res.json();
    })
    .then((response) => {
      return response;
    });
}

//intertar entrar a un grupo
//conectada
export async function request({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/request`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return
    })
}

//lista de usuarios de un grupo
//conectada
export async function getRequestsGroups({ _id, page = 1 }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/getRequestsGroups/${_id}/${page}`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return await res.json();
    })
    .then((response) => {
      return response;
    });
}

//aceptar peticion a de un grupo
//conectada
export async function aceptInvitation({ _id, _idUser }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/aceptInvitation`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: _id,
      _idUser: _idUser
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return
    })
}

//rechazar peticion a de un grupo
//conectada
export async function rejectInvitation({ _id, _idUser }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/groups/rejectInvitation`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      _id: _id,
      _idUser: _idUser
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        if (res.status === 410 || res.status === 411 || res.status === 412) {
          logout();
          return;
        }
        const error = await getErrorMessageGroups(res.status);
        throw new Error(error);
      }
      return
    })
}