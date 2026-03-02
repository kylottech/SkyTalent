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

const getErrorMessageWallet = async (statusCode) => {
    const texts = await loadTexts();

    return texts.walletServices?.[statusCode] || texts.walletServices?.Default
};

//pedir mis listas
//conectada
export async function lists(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/wallet/lists`,
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
          let error= await getErrorMessageWallet(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//pedir listas de amigos
//conectada
export async function friendList(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/wallet/friendList`,
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
          let error= await getErrorMessageWallet(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//crear lista
//conectada
export async function createList({name, categoria, privacidad, descripcion}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/wallet/create`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name, categoria: categoria, visibility: privacidad, descripcion: descripcion }),
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageWallet(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//pedir info de lista
//conectada
export async function getListInfo({ _id }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/wallet/listInfo/${_id}`,
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
          let error= await getErrorMessageWallet(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//pedir listas guardadas
//conectada
export async function favList(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/wallet/favList`,
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
          let error= await getErrorMessageWallet(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//añadir sitio a una lista
//conectada
export async function addPlace({_idList, _idPlace}, logout){
    const token= await AsyncStorage.getItem('token')
    //console.log(_idList)
    return fetch(`${ENDPOINT}/wallet/addPlace`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_idList: _idList, _idPlace: _idPlace}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageWallet(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//eliminar sitio de una lista
//conectada
export async function lessPlace({_idList, _idPlace}, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/wallet/lessPlace`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_idList: _idList, _idPlace: _idPlace}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageWallet(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//editar foto de una lista
//conectada
export async function uploadImage(selectedImage, setErrorMessage, setSelectedImage, _id, logout) {
    
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/wallet/photo/${_id}`, {
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
            let error= await getErrorMessageWallet(res.status)
            throw new Error(error);
            }
            return await res.json()
        }
        ).then((response)=>{
            setErrorMessage('Image uploaded successfully!');
            setSelectedImage(null);
            return response

        })
      
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Error uploading image');
      throw error; // Puedes propagar el error si necesitas manejarlo más arriba
    }
}

//eliminar foto de una lista
//conectada
export async function quitImage(_id, logout) {
    
    const token = await AsyncStorage.getItem('token');
            
    return fetch(`${ENDPOINT}/wallet/quit`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: _id}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
        let error= await getErrorMessageWallet(res.status)
        throw new Error(error);
        }
        return await res.json()
    }
    ).then((response)=>{
        return response

    })
}

//guardar lista ajena
//conectada
export async function saveList(_id, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/wallet/saveList`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: _id}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageWallet(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//eliminar lista ajena
//conectada
export async function deleteList(_id, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/wallet/deleteList`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id: _id}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
            let error= await getErrorMessageWallet(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//editar lista
//conectada
export async function updateList(
  { _id, name, categoria, privacidad, descripcion },
  logout,
  setErrorMessage
) {
  try {
    console.log(privacidad)
    if (!_id) throw new Error("Falta el identificador de la lista (_id).");
    if (!name || !categoria || !descripcion) {
      throw new Error("Faltan campos obligatorios.");
    }

    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${ENDPOINT}/wallet/update`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        _id,
        name,
        visibility: privacidad,
        categoria,
        descripcion,
      }),
    });

    if (!response.ok) {
      if ([410, 412].includes(response.status)) {
        // sesión inválida / expirada según tu backend
        logout?.();
        return;
      }
      // Intenta leer mensaje del backend; si no, usa genérico
      let msg = "Error al actualizar la lista";
      try {
        const errJson = await response.json();
        if (errJson?.message) msg = errJson.message;
      } catch (_) {
        // noop
      }
      throw new Error(msg);
    }

    // Backend devuelve { _id }
    return await response.json();
  } catch (err) {
    console.error("Error updating list:", err);
    setErrorMessage?.(err.message || "Error al actualizar la lista");
    throw err;
  }
}

//pedir colaboradores y request
//conectada
export async function getRequestsList({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/wallet/getRequests/${_id}`,
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
          let error= await getErrorMessageWallet(res.status)
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
export async function updateRequestsList({ _id, newSelected, editedCollaborators }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/wallet/updateCollaborators`, { // 👈 sin _id en la URL
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
      const error = await getErrorMessageWallet(res.status);
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
export async function postListDecision({ _id, decision }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/wallet/decision`, {
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
      const error = await getErrorMessageWallet(res.status);
      throw new Error(error);
    }
    return await res.json();
  })
  .then((response) => {
    return response; // { ok: true, accepted: true/false, experienceId: '...' }
  });
}