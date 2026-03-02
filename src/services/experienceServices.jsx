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

const getErrorMessageExperience = async (statusCode) => {
    const texts = await loadTexts();

    return texts.experienceServices?.[statusCode] || texts.experienceServices?.Default
};

//pedir
//pedir mis experiencias
//conectada
export async function getMyExperience(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getMyExperience`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir experiencias
//conectada
export async function getExperience(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getExperience`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir experiencias favoritas
//conectada
export async function getFavExperiences(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getFavExperiences`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir experiencias de seguidos
//conectada
export async function getFollowExperiences(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getFollowExperiences`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info visita + primer dia
//conectada
export async function getFirstDay(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getFirstDay/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info de dia
//no conectada
export async function getDay({_id, indice}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getDay/${_id}/${indice}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir los steps
//conectada
export async function getSteps(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getSteps/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir los contactos
//conectada
export async function infoContact({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getContactos/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir los comentarios
//no conectada
export async function getComments({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getComments/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir las ubis
//conectada
export async function getLocations(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getLocations`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir la ruta
//conectada
export async function getRoute({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getRoute/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir los reminders
//conectada
export async function getReminder({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getReminder/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir las notas
//conectada
export async function getNotes({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getNotes/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//añadir
//añadir experiencia
//conectada
export async function createExperience(formData, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createExperience`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: formData.title, description: formData.description, date: formData.date, city: formData.city, countrie: formData.countrie }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//añadir foto experiencia
//conectada
export async function uploadImageExperience({selectedImage, _id}, logout) {
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/experience/createExperience/photo/${_id}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token, // Agregar token al header
          Accept: 'application/json',
        },
        body: formData,
      }).then(async (res) => {
            if (!res.ok){
                if(res.status === 410 || res.status === 412 || res.status === 412){
                    logout();
                    return
                }
            let error= await getErrorMessageExperience(res.status)
            throw new Error(error);
            }
            return await res.json()
        }
        )
      
      
    } catch (error) {
      throw error; // Puedes propagar el error si necesitas manejarlo más arriba
    }
}

//añadir visita
//conectada
export async function createVisit(data, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createVisit`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name, tags: data.tags, date: data.date, experienceId: data.experienceId, city: data.city, countrie: data.countrie  }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//añadir foto visita
//conectada
export async function uploadImageVisit({selectedImage, _id}, logout) {
    
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/experience/createVisit/photo/${_id}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token, // Agregar token al header
          Accept: 'application/json',
        },
        body: formData,
      }).then(async (res) => {
            if (!res.ok){
                if(res.status === 410 || res.status === 412 || res.status === 412){
                    logout();
                    return
                }
            let error= await getErrorMessageExperience(res.status)
            throw new Error(error);
            }
            return await res.json()
        }
        )
      
      
    } catch (error) {
      throw error; // Puedes propagar el error si necesitas manejarlo más arriba
    }
}

//añadir dia
//conectada
export async function createDay(data, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createDay`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ experienceId: data._id, date: data.date }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//añadir post
//conectada
export async function createPost(data, logout){ 
  const token = await AsyncStorage.getItem('token');

  // Construimos el payload y añadimos partId si existe
  const payload = {
    name: data.name,
    dayId: data.dayId,
    ...(data.partId ? { partId: data.partId } : {}),
  };

  return fetch(`${ENDPOINT}/experience/createPost`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412){
        logout();
        return;
      }
      let error = await getErrorMessageExperience(res.status);
      throw new Error(error);
    }
    return await res.json();
  })
  .then((response) => response);
}

//añadir foto post
//conectada
export async function uploadImagePost({selectedImage, _id}, logout) {
    
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/experience/createPost/photo/${_id}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token, // Agregar token al header
          Accept: 'application/json',
        },
        body: formData,
      }).then(async (res) => {
            if (!res.ok){
                if(res.status === 410 || res.status === 412 || res.status === 412){
                    logout();
                    return
                }
            let error= await getErrorMessageExperience(res.status)
            throw new Error(error);
            }
            return await res.json()
        }
        )
      
      
    } catch (error) {
      throw error; // Puedes propagar el error si necesitas manejarlo más arriba
    }
}

//añadir part
//conectada
export async function createPart(data, _id, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createPart`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name, _idPlace: data._idPlace, dayId: _id, grupo: data.grupo, time: data.time }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
       
        return response
        
    })
    
}

//añadir step
//conectada
export async function createStep(data, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createStep`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: data.name, ubication: data.ubication, description: data.description, duracionHoras: data.duracionHoras, duracionMinutos: data.duracionMinutos, partId: data.partId }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//añadir foto de step
//conectada
export async function uploadImageStep({selectedImage, _id, indice}, logout) {
    
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/experience/createStep/photo/${_id}/${indice}`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token, // Agregar token al header
          Accept: 'application/json',
        },
        body: formData,
      }).then(async (res) => {
            if (!res.ok){
                if(res.status === 410 || res.status === 412 || res.status === 412){
                    logout();
                    return
                }
            let error= await getErrorMessageExperience(res.status)
            throw new Error(error);
            }
            return
        }
        )
      
      
    } catch (error) {
      throw error; // Puedes propagar el error si necesitas manejarlo más arriba
    }
}

//añadir contacto (usuario)
//no conectada
export async function createContacto(formValues, selectedFiles, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    // Añadir campos de texto
    formData.append('userId', formValues.user);
    formData.append('descripcion', formValues.descripcion);
    formData.append('categoria', formValues.categoria);
    formData.append('puntuacion', formValues.puntuacion);
    formData.append('telefono', formValues.preferPhone);
    formData.append('email', formValues.preferEmail);
    formData.append('partId', formValues.partId);

    // Añadir archivos multimedia
    selectedFiles.forEach((file, index) => {
      const fileExtension = file.uri.split('.').pop().toLowerCase();

      let mimeType = 'image/jpeg'; // Valor por defecto
      if (fileExtension === 'png') mimeType = 'image/png';
      else if (fileExtension === 'jpg' || fileExtension === 'jpeg') mimeType = 'image/jpeg';
      else if (fileExtension === 'mp4') mimeType = 'video/mp4';

      formData.append('media', {
        uri: file.uri,
        name: `file_${index}.${fileExtension}`,
        type: mimeType,
      });
    });

    // Enviar la petición
    const response = await fetch(`${ENDPOINT}/experience/createContacto/user`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        // NO poner Content-Type con multipart/form-data, fetch lo gestiona solo
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 412) {
        logout();
        return;
      }
      let error = getErrorMessageExperience(response.status);
      throw new Error(error);
    }

    return response;

  } catch (error) {
    console.error('Error creating trick:', error);
    throw error;
  }
}

//añadir recordatorio
//conectada
export async function createReminder({text, experienceId}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createReminder`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, experienceId: experienceId, state: false }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    )
    
}

//añadir Nota
//conectada
export async function createNotes({text, partId, title}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/createNotes`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text, partId: partId, title: title }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    )
    
}

//editar
//editar experiencia
//conectada
export async function updateExperience(data, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/updateExperience`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: data._id, name: data.title, description: data.description, date: data.date, city: data.city, countrie: data.countrie }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//editar post
//conectada
export async function updatePost(data, logout){ 
  const token = await AsyncStorage.getItem('token');

  // Construimos el payload y añadimos partId si existe
  const payload = {
    _id: data._id,
    name: data.name,
    dayId: data.dayId,
    ...(data.partId ? { partId: data.partId } : {}),
  };

  return fetch(`${ENDPOINT}/experience/updatePost`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  .then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412){
        logout();
        return;
      }
      let error = await getErrorMessageExperience(res.status);
      throw new Error(error);
    }
    return await res.json();
  })
  .then((response) => response);
}

//editar part
//conectada
export async function updatePart({data, _id, _idDay}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/updatePart`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, name: data.name, _idPlace: data._idPlace, dayId: _idDay, grupo: data.grupo, time: data.time }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
    
}

//editar step
//conectada
export async function updateStep(data, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/updateStep`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: data._id, name: data.name, ubication: data.ubication, description: data.description, duracionHoras: data.duracionHoras, duracionMinutos: data.duracionMinutos, partId: data.partId }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//dar like a experiencia
//conectada
export async function like(_id, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/like`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}

//quitar like a experiencia
//conectada
export async function dislike(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/dislike`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}

//comentar experiencia
//conectada
export async function comment({_id, text, parentId}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/comment`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, text: text, parentId: parentId }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    )
}

//cambiar checkbox
//conectada
export async function reminderCheckbox({_id, state}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/reminderCheckbox`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, state: state }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
    
}

//actulizar reminder
//conectada
export async function updateReminder({_id, experienceId, text}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/updateReminder`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, experienceId: experienceId, text: text }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
    
}

//actulizar Nota
//conectada
export async function updateNotes({_id, partId, text, title}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/updateNotes`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, partId: partId, text: text, title: title }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
    
}

//eliminar
//eliminar experiencia 
//no conectada
export async function deleteExperience({_id}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/deleteExperience`,
    {
        method:'DELETE',
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
}

//eliminar post
//conectada
export async function deletePost({_id}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/deletePost`,
    {
        method:'DELETE',
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
}

//eliminar part
//no conectada
export async function deletePart({_id}, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/deletePart`,
    {
        method:'DELETE',
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
}

//eliminar step
//no conectada
export async function deleteStep({_id, indice}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/deleteStep`,
    {
        method:'DELETE',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, indice: indice }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    )
}

//eliminar reminder
//no conectada
export async function deleteReminder({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/deleteReminder`,
    {
        method:'DELETE',
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
}

//eliminar nota
//no conectada
export async function deleteNotes({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/deleteNotes`,
    {
        method:'DELETE',
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
}

//guardar
//guardar experiencias
//conectada
export async function safe(_id, logout){ 
    
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/safe`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}

//desguardar experiencias
//conectada
export async function notSafe(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/notSafe`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        
        return 
     }
    )
}

export async function copyExperience({ _id }, logout, setErrorMessage) {
  try {
    if (!_id) throw new Error('Falta el _id de la experiencia a copiar.');

    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${ENDPOINT}/experience/copyExperience`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ _id }),
    });

    if (!res.ok) {
      // Manejo de sesión expirada/bloqueada
      if ([410, 412].includes(res.status)) {
        logout?.();
        return;
      }

      let msg = 'Error al copiar la experiencia';
      try {
        const err = await res.json();
        if (err?.message) msg = err.message;
      } catch (_) {}
      throw new Error(msg);
    }

    return
  } catch (e) {
    console.error('copyExperience error:', e);
    setErrorMessage?.(e.message || 'Error al copiar la experiencia');
    throw e;
  }
}

//pedir colaboradores y request
//conectada
export async function getRequestsExperience({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/experience/getRequests/${_id}`,
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
          let error= await getErrorMessageExperience(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//modificar colaboradores y request
//conectada
export async function updateRequestsExperience({ _id, newSelected, editedCollaborators }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/experience/updateCollaborators`, { // 👈 sin _id en la URL
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id, newSelected, editedCollaborators }), // 👈 _id en el body
  })
  .then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 411 || res.status === 412) {
        logout && logout();
        return;
      }
      const error = await getErrorMessageExperience(res.status);
      throw new Error(error);
    }
    return await res.json();
  })
  .then((response) => {
    return response;
  });
}

//aceptar o rechazar
//conectada
export async function postExperienceDecision({ _id, decision }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/experience/decision`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ _id, decision }), // <- _id de la experiencia y booleano
  })
  .then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 411 || res.status === 412) {
        logout && logout();
        return;
      }
      const error = await getErrorMessageExperience(res.status);
      throw new Error(error);
    }
    return await res.json();
  })
  .then((response) => {
    return response; // { ok: true, accepted: true/false, experienceId: '...' }
  });
}
