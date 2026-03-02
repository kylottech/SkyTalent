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

const getErrorMessageProfile = async (statusCode) => {
    const texts = await loadTexts();

    return texts.profileServices?.[statusCode] || texts.profileServices?.Default
};

//pedir info de mi perfil
//conectada
export async function myInfo(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/myInfo`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//pedir mis historias
//conectada
export async function histories(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/histories`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//actualizar info perfil
//conectada
export async function update(
    { 
        name: nombre, 
        surname: surname, 
        kylotId: kylotId, 
        cargo: cargo, 
        frase: frase,
        whatsapp: whatsapp,
        tikTok: tikTok,
        instagram: instagram
    }, 
    logout
){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/update`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            { 
                name: nombre, 
                surname: surname, 
                kylotId: kylotId,
                cargo: cargo, 
                frase: frase,
                whatsapp: whatsapp,
                tiktok: tikTok,
                instagram: instagram
            }
        ),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//pedir notificaciones
//conectada
export async function getNotification(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/notification`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//actualizar notificaciones
//conectada
export async function postNotification({notificacionesPush, notificacionesEmail}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/notification`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificacionesPush: notificacionesPush, notificacionesEmail: notificacionesEmail }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//actualizar email
//conectada
export async function updateEmail({email}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/updateEmail`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//actualizar contraseña
//conectada
export async function updatePassword({antiguaContraseña,nuevaContraseña}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/updatePassword`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lastPassword: antiguaContraseña, newPassword: nuevaContraseña }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return
     }
    )
    
}

//pedir informacion de otro usuario
//conectada
export async function otherInfo({_id}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/otherInfo/${_id}`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//lista de seguidores
//conectada
export async function getFollowers(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/getFollowers/${_id}`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//lista de seguidos
//conectada
export async function getFollowed(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/getFollowed/${_id}`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//seguir a alguien
//conectada
//token
export async function moreFollow(_id, logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/moreFollow`,
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
            let error= await getErrorMessageProfile(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//dejar de seguir a alguien
//conectada
//token
export async function lessFollow(_id, logout){
    const token= await AsyncStorage.getItem('token')
    
    return fetch(`${ENDPOINT}/profile/lessFollow`,
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
            let error= await getErrorMessageProfile(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//pedir mi codigo para compartir
//no conectada
export async function codigo(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/codigo`,
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
          let error= await getErrorMessageProfile(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{
        return response

    })
    
}

//cambiar foto de perfil
//conectada
export async function uploadImage(selectedImage, setErrorMessage, setSelectedImage, logout) {
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/profile/photo`, {
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
            let error= await getErrorMessageProfile(res.status)
            throw new Error(error);
            }
            return await res.json()
        }
        ).then((response)=>{
            setSelectedImage('');
            return response

        })
      
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Error uploading image');
      throw error; // Puedes propagar el error si necesitas manejarlo más arriba
    }
}

//cambiar banner de perfil
//conectada
export async function uploadbanner(selectedImage, setErrorMessage, setSelectedImage, logout) {
    
    try {
      const token = await AsyncStorage.getItem('token'); // Obtener el token de almacenamiento
      
      const formData = new FormData();
      formData.append('image', {
        uri: selectedImage.uri,
        type: 'image/jpeg', // Cambia el tipo si el archivo es diferente
        name: `image_${Date.now()}.jpg`,
      });
      
      return fetch(`${ENDPOINT}/profile/banner`, {
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
            let error= await getErrorMessageProfile(res.status)
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

export async function searcher({search, contact}, logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/searcher/${search}/${contact}`,
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
            let error= await getErrorMessageProfile(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )

}

export async function getContactPrivacity(logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/getContactPrivacity`,
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
            let error= await getErrorMessageProfile(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )

}

export async function postContactPrivacity(logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/profile/postContactPrivacity`,
        {
        method:'Post',
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
            let error= await getErrorMessageProfile(res.status)
            throw new Error(error);
        } 
        return await res.json()
     }
    )

}

export async function removeHistory(position, logout, setErrorMessage) {
  try {
    if (typeof position !== 'number' || position < 0) {
      throw new Error('Posición inválida.');
    }

    const token = await AsyncStorage.getItem('token');

    const res = await fetch(`${ENDPOINT}/profile/histories/remove`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ position }),
    });

    if (!res.ok) {
      if ([410, 412].includes(res.status)) {
        logout?.();
        return;
      }
      let msg = 'Error al eliminar la foto';
      try {
        const err = await res.json();
        if (err?.message) msg = err.message;
      } catch {}
      throw new Error(msg);
    }

    return
  } catch (e) {
    console.error('removeHistory error:', e);
    setErrorMessage?.(e.message || 'Error al eliminar la foto');
    throw e;
  }
}