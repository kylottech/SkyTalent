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

const getErrorMessageCommunity = async (statusCode) => {
    const texts = await loadTexts();

    return texts.communityServices?.[statusCode] || texts.communityServices?.Default
};

//buscador
//conectada
export async function searcher({search, trick, advice, contact}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/searcher/${search}/${trick}/${advice}/${contact}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//buscador con filtro de usuario
//conectada
export async function searcherUser({search, trick, advice, contact}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/searcherUser/${search}/${trick}/${advice}/${contact}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//buscador de users y grupos
//conectada
export async function searcherGroup({search}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/searcherGroup/${search}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//buscador categorias 
//conectada
export async function categorySearcher({search}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/categorySearcher/${search}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//crear truco + subir multimedia 
//conectada
export async function createTrick(formValues, selectedFiles, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    // Añadir campos de texto
    formData.append('titulo', formValues.titulo);
    formData.append('descripcion', formValues.descripcion);
    formData.append('pais', formValues.pais);
    formData.append('ciudad', formValues.ciudad);
    formData.append('categoria', formValues.categoria);

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
    const response = await fetch(`${ENDPOINT}/community/create/trick`, {
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
      let error = await getErrorMessageCommunity(response.status);
      throw new Error(error);
    }

    return await response.json();

  } catch (error) {
    console.error('Error creating trick:', error);
    throw error;
  }
}

//crear consejo + subir multimedia
//conectada
export async function createAdvice(formValues, selectedFiles, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    // Añadir campos de texto
    formData.append('titulo', formValues.titulo);
    formData.append('descripcion', formValues.descripcion);
    formData.append('pais', formValues.pais);
    formData.append('ciudad', formValues.ciudad);
    formData.append('categoria', formValues.categoria);

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
    const response = await fetch(`${ENDPOINT}/community/create/advice`, {
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
      let error = await getErrorMessageCommunity(response.status);
      throw new Error(error);
    }

    return await response.json();

  } catch (error) {
    console.error('Error creating trick:', error);
    throw error;
  }
}

//crear contacto + subir multimedia
//conectada
export async function createContact(formValues, selectedFiles, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    // Añadir campos de texto
    formData.append('userId', formValues.user);
    formData.append('descripcion', formValues.descripcion);
    formData.append('pais', formValues.pais);
    formData.append('ciudad', formValues.ciudad);
    formData.append('categoria', formValues.categoria);
    formData.append('puntuacion', formValues.puntuacion);
    formData.append('telefono', formValues.preferPhone);
    formData.append('email', formValues.preferEmail);

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
    const response = await fetch(`${ENDPOINT}/community/create/contact`, {
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
      let error = await getErrorMessageCommunity(response.status);
      throw new Error(error);
    }

    return await response.json();

  } catch (error) {
    console.error('Error creating trick:', error);
    throw error;
  }
}

//pedir categorias
//conectada
export async function tagsTrick({paisId, ciudadId}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/tags/trick/${paisId}/${ciudadId}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//pedir categorias
//conectada
export async function tagsAdvice({paisId, ciudadId}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/tags/advice/${paisId}/${ciudadId}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//pedir categorias
//conectada
export async function tagsContact({paisId, ciudadId}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/tags/contact/${paisId}/${ciudadId}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//pedir trucos
//conectada
export async function infoTrick({paisId, ciudadId, categoriaId}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/info/trick/${paisId}/${ciudadId}/${categoriaId}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//pedir consejos
//conectada
export async function infoAdvice({paisId, ciudadId, categoriaId}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/info/advice/${paisId}/${ciudadId}/${categoriaId}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//pedir contactos
//conectada
export async function infoContact({paisId, ciudadId, categoriaId}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/community/info/contact/${paisId}/${ciudadId}/${categoriaId}`,
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
            let error= await getErrorMessageCommunity(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )
}

//darlike a truco
//conectada
export async function trickLike({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/community/like/trick`,
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
          let error= await getErrorMessageCommunity(res.status)
          throw new Error(error);
        }
        
        return 
     }
    ).then((response)=>{
        return response

    })
    
}

//darlike a consejo
//conectada
export async function adviceLike({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/community/like/advice`,
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
          let error= await getErrorMessageCommunity(res.status)
          throw new Error(error);
        }
        
        return 
     }
    ).then((response)=>{
        return response

    })
    
}

//darlike a contacto
//conectada
export async function contactLike({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/community/like/contact`,
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
          let error= await getErrorMessageCommunity(res.status)
          throw new Error(error);
        }
        
        return 
     }
    ).then((response)=>{
        return response

    })
    
}

//votar a contacto
//conectada
export async function votedContact({_id, number}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/community/voted/contact`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: _id, number: number }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageCommunity(res.status)
          throw new Error(error);
        }
        
        return 
     }
    ).then((response)=>{
        return response

    })
    
}

//aceptar solicitud de amistad
//conectada
export async function acept(userId, communityId, logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/community/acept`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userId, communityId: communityId}),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageCommunity(res.status)
          throw new Error(error);
        }
        return res.json()
    })
}

//rechazar solicitud de amistad
//conectada
export async function reject(userId, communityId, logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/community/reject`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: userId, communityId: communityId}),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageCommunity(res.status)
          throw new Error(error);
        }
        return res.json()
    })
}