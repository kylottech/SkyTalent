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

const getErrorMessageActivities = async (statusCode) => {
    const texts = await loadTexts();

    return texts.activitiesServices?.[statusCode] || texts.activitiesServices?.Default
};


//crear actividad
//conectada
export async function create(
    { name, description, start, end, isPublic, automaticAprove, users, groups, location, image },
    logout 
    ) {
    try {
        const token = await AsyncStorage.getItem("token");

        const formData = new FormData();

        // Campos de texto
        formData.append("name", name);
        formData.append("description", description);
        formData.append("start", start.toISOString());
        formData.append("end", end.toISOString());
        formData.append("isPublic", JSON.stringify(isPublic));
        formData.append("automaticAprove", JSON.stringify(automaticAprove));

        // Ubicación
        formData.append("location.latitude", location.latitude.toString());
        formData.append("location.longitude", location.longitude.toString());

        // Arrays de usuarios y grupos
        formData.append("idsUsers", JSON.stringify(users));
        formData.append("idsGroups", JSON.stringify(groups));

        // Imagen
        if (image) {
        const filename = `activity_${Date.now()}.jpg`;
        formData.append("image", {
            uri: image,
            name: filename,
            type: "image/jpeg",
        });
        }

        return fetch(`${ENDPOINT}/myJourney/create`, {
        method: "POST",
        headers: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
        },
        body: formData,
        }).then(async (res) => {
            if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageActivities(res.status)
            throw new Error(error);
            }
            return await res.json()
        })
    } catch (error) {
        console.error("Error creating activity:", error);
        throw error;
    }
}

//buscador
//conectada
export async function searcher({search}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/myJourney/searcher/${search}`,
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
          let error= await getErrorMessageActivities(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir actividades por tamaño de mapa
//conectada
export async function getActivities(northEast, southWest, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/myJourney/getActivities/${northEast.latitude}/${southWest.latitude}/${northEast.longitude}/${southWest.longitude}`,
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
          let error= await getErrorMessageActivities(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info de una actividad
//conectada
export async function getActivity({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/getActivity/${_id}`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return await res.json()
    })
}

//pedir users de una actividad
//conectada
export async function getUsers({ _id, page }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/getUsers/${_id}/${page}`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return await res.json()
    })
}

//aceptar invitacion a actividad
//conectada
export async function request({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/request`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return
    })
}

//pedir mis acts
//conectada
export async function getMyActivities( logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/myJourney/getMyActivities`,
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
          let error= await getErrorMessageActivities(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir actividades de un grupo
//conectada
export async function getGroupActivities({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/getGroupActivities/${_id}`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return await res.json()
    })
}

//pedir mis solicitues
//conectada
export async function getMyRequests( logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/myJourney/getMyRequests`,
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
          let error= await getErrorMessageActivities(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir mis invitaciones
//conectada
export async function getMyInvitations( logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/myJourney/getMyInvitations`,
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
          let error= await getErrorMessageActivities(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir request de act
//conectada
export async function getRequests({ _id, page }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/getRequests/${_id}/${page}`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return await res.json()
    })
}

//aceptar invitacion a actividad
//conectada
export async function aceptInvitation({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/aceptInvitation`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return await res.json()
    })
}

//rechazar invitacion a actividad
//conectada
export async function rejectInvitation({ _id }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/rejectInvitation`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return
    })
}

//aceptar peticion a una actividad
//conectada
export async function aceptRequest({ _id, _idUser }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/aceptRequest`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return
    })
}

//rechazar peticion a una actividad
//conectada
export async function rejectRequest({ _id, _idUser }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/myJourney/rejectRequest`, {
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
        const error = await getErrorMessageActivities(res.status);
        throw new Error(error);
      }
      return
    })
}