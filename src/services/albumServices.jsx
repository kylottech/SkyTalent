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

const getErrorMessageAlbum = async (statusCode) => {
    const texts = await loadTexts();

    return texts.albumServices?.[statusCode] || texts.albumServices?.Default
};

//crear album
//conectada
export async function create({ name, description, isPublic }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/create`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            kylot: false,
            public: isPublic,
            name: name,
            descripcion: description
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir mis albums
//conectada
export async function getMyAlbums({ page },logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/myAlbums/${page}`,
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
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir otros albums
//conectada
export async function othersAlbums({ page },logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/othersAlbums/${page}`,
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
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir otros albums de amigos
//conectada
export async function getFriendsAlbums({ page },logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/friendsAlbums/${page}`,
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
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir otros albums de kylot
//conectada
export async function getKylotAlbums({ page },logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/kylotAlbums/${page}`,
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
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir info de un album
//conectada
export async function getAlbum({ _id },logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/getAlbum/${_id}`,
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
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//copiar album
//conectada
export async function copy({ _id }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/copy`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id: _id
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//crear hito
//conectada
export async function createMilestones({ _id, name }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/createMilestones`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id: _id,
            name: name
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//editar nombre del hito
//conectada
export async function updateMilestones({ _id, name, _idMilestones }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/updateMilestones`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id: _id,
            name: name,
            _idMilestones: _idMilestones
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//eliminar foto del hito
//conectada
export async function deletePhoto({ _id, _idMilestones }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/deletePhoto`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id: _id,
            _idMilestones: _idMilestones
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//eliminar hito
//conectada
export async function deleteMilestones({ _id, _idMilestones }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/deleteMilestones`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            _id: _id,
            _idMilestones: _idMilestones
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageAlbum(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//subir hito
//conectada
export async function completeMilestones({ _id, _idMilestones, selectedImage }, logout) {
    try {
        const token = await AsyncStorage.getItem("token");

        const formData = new FormData();

        // Campos simples
        formData.append("_id", _id);
        formData.append("_idMilestones", _idMilestones);

        // Imagen (si se proporciona)
        if (selectedImage) {
            const filename = `milestone_${Date.now()}.jpg`;
            formData.append("image", {
                uri: selectedImage,
                name: filename,
                type: "image/jpeg",
            });
        

        return fetch(`${ENDPOINT}/album/completeMilestones`, {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                Accept: "application/json",
            },
            body: formData,
        }).then(async (res) => {
            if (!res.ok) {
                if (res.status === 410 || res.status === 411 || res.status === 412) {
                    logout();
                    return;
                }
                let error = await getErrorMessageAlbum(res.status);
                throw new Error(error);
            }
            return 
        });
    }
    } catch (error) {
        console.error("Error completing milestone:", error);
        throw error;
    }
}

//pedir colaboradores y request
//conectada
export async function getRequestsAlbum({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/album/getRequests/${_id}`,
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
          let error= await getErrorMessageAlbum(res.status)
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
export async function updateRequestsAlbum({ _id, newSelected, editedCollaborators }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/album/updateCollaborators`, { // 👈 sin _id en la URL
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
      const error = await getErrorMessageAlbum(res.status);
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
export async function postAlbumDecision({ _id, decision }, logout) {
  const token = await AsyncStorage.getItem('token');

  return fetch(`${ENDPOINT}/album/decision`, {
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
      const error = await getErrorMessageAlbum(res.status);
      throw new Error(error);
    }
    return await res.json();
  })
  .then((response) => {
    return response; // { ok: true, accepted: true/false, experienceId: '...' }
  });
}
