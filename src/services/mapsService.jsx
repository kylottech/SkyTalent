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

const getErrorMessageMaps = async (statusCode) => {
    const texts = await loadTexts();

    return texts.mapsServices?.[statusCode] || texts.mapsServices?.Default
};

//pedir ubicacion por tamaño de mapa
//conectada
export async function getPlaces(northEast, southWest, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/getPlaces/${northEast.latitude}/${southWest.latitude}/${northEast.longitude}/${southWest.longitude}`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir momentos por tamaño de mapa
//conectada
export async function getMoments(northEast, southWest, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/getMoments/${northEast.latitude}/${southWest.latitude}/${northEast.longitude}/${southWest.longitude}`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info de sitio componente
//conectada
export async function getMinInfo(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/getMinInfo/${_id}`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//pedir info de sitio completa
//conectada
export async function getInfo(_id, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/getInfo/${_id}`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//añadir foto a sitio
//conectada
export async function uploadPhoto1({imagesArray, setErrorMessage, _id}, logout) {
  try {
    const token = await AsyncStorage.getItem('token');

    const formData = new FormData();

    imagesArray.forEach((img, index) => {
      formData.append('images', {
        uri: img.url,
        type: img.type || 'image/jpeg',
        name: img.name || `image_${Date.now()}_${index}.jpg`,
      });
    });
    
    const res = await fetch(`${ENDPOINT}/maps/photo1/${_id}`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!res.ok) {
      if ([410, 412].includes(res.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(res.status);
      throw new Error(error);
    }

    return await res.json();

  } catch (error) {
    console.error('Error uploading image:', error);
    setErrorMessage('Error uploading image');
    throw error;
  }
}

//crear lugar
//conectada
export async function createPlace(
  { name, categoria, experiencia, amigo, recomendacion, nota, location, urls, newPhotos },
  logout,
  setErrorMessage
) {
  try {
    if (newPhotos.length > 10) {
      throw new Error("No puedes subir más de 10 fotos nuevas.");
    }

    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    // Añadir datos del lugar
    formData.append("name", name);
    formData.append("categoria", categoria);
    formData.append("experiencia", experiencia);
    formData.append("amigo", JSON.stringify(amigo));
    formData.append("recomendacion", recomendacion);
    formData.append("nota", nota.toString());
    formData.append("location.latitude", location.latitude.toString());
    formData.append("location.longitude", location.longitude.toString());

    // Añadir URLs ya existentes (en S3)
    formData.append("urls", JSON.stringify(urls)); // [{ url, perfil }]

    // Añadir imágenes nuevas
    for (const photo of newPhotos) {
      const filename = `image_${Date.now()}_${Math.random()}.jpg`;

      formData.append("images", {
        uri: photo.url,
        type: "image/jpeg",
        name: filename
      });

      if (photo.perfil === true) {
        formData.append(`perfil_${filename}`, "true");
      }
    }

    const response = await fetch(`${ENDPOINT}/maps/createPlace`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json"
        // No se pone Content-Type: multipart/form-data manualmente
      },
      body: formData
    });

    if (!response.ok) {
      if ([410, 412].includes(response.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating place:", error);
    setErrorMessage?.(error.message || "Error al crear el lugar");
    throw error;
  }
}

//crear momento
//conectada
export async function createMoment(
  { name, location, urls, newPhotos },
  logout,
  setErrorMessage
) {
  try {
    if (newPhotos.length > 1) {
      throw new Error("Solo se puede subir 1 foto nueva para los momentos.");
    }

    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    // Datos básicos
    formData.append("name", name);
    formData.append("location.latitude", location.latitude.toString());
    formData.append("location.longitude", location.longitude.toString());

    // Foto desde S3 (si hay)
    formData.append("urls", JSON.stringify(urls)); // debe ser tipo [{ url, perfil }]

    // Nueva foto desde dispositivo
    for (const photo of newPhotos) {
      const filename = `moment_${Date.now()}_${Math.random()}.jpg`;

      formData.append("images", {
        uri: photo.url,
        type: "image/jpeg",
        name: filename
      });

      if (photo.perfil === true) {
        formData.append(`perfil_${filename}`, "true");
      }
    }

    const response = await fetch(`${ENDPOINT}/maps/createMoment`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json"
        // No content-type manually for multipart/form-data
      },
      body: formData
    });

    if (!response.ok) {
      if ([410, 412].includes(response.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating moment:", error);
    setErrorMessage?.(error.message || "Error al crear el momento");
    throw error;
  }
}

//accion diaria
//conectada
export async function daily(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/daily`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        
        return await res.json()
     }
    )
    
}

//desbloquear ciudad
//conectada
export async function unblockCity({ city, country }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/unblockCity`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city: city, country: country }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        return true
     }
    )
    
}

//desbloquear sitio
//conectada
export async function unblockPlace({ _id }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/unblockPlace`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        return
     }
    )
    
}

//pedir ciudad y pais
//conectada
export async function city(current, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/city`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latitude: current.latitude, longitude: current.longitude }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    ).then((response)=>{

        return response

    })
    
}

//ubicaciones bola
//conectada
export async function bola(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/earth`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        
        return await res.json()
     }
    )
    
}

//votar localizacion
//conectada
export async function voted({_id, number}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/voted`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        return true
     }
    ).then((response)=>{
        return response

    })
    
}

//ubicaciones aprovadas o no
//conectada
export async function pending(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/pending`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        
        return await res.json()
     }
    )
    
}

//actualizar lugar
//conectada
export async function updatePlace(
  { _id, name, categoria, experiencia, amigo, recomendacion, nota, location, urls, newPhotos },
  logout,
  setErrorMessage
) {
  try {
    if (! _id) {
      throw new Error("Falta el identificador del lugar (_id).");
    }

    if (newPhotos.length > 10) {
      throw new Error("No puedes subir más de 10 fotos nuevas.");
    }

    const token = await AsyncStorage.getItem("token");
    const formData = new FormData();

    // Identificador del lugar a actualizar
    formData.append("_id", _id);

    // Datos del lugar (mismo formato que createPlace)
    formData.append("name", name);
    formData.append("categoria", categoria);
    formData.append("experiencia", experiencia ?? "");
    formData.append("amigo", JSON.stringify(Array.isArray(amigo) ? amigo : []));
    formData.append("recomendacion", recomendacion ?? "");
    formData.append("nota", nota.toString());
    formData.append("location.latitude", location.latitude.toString());
    formData.append("location.longitude", location.longitude.toString());

    // URLs ya existentes (en S3) que quieres mantener (incluye perfil si procede)
    // [{ url, perfil }]
    formData.append("urls", JSON.stringify(urls || []));

    // Nuevas fotos locales (file://) igual que en createPlace
    for (const photo of newPhotos) {
      const filename = `image_${Date.now()}_${Math.random()}.jpg`;

      formData.append("images", {
        uri: photo.url,
        type: "image/jpeg",
        name: filename,
      });

      if (photo.perfil === true) {
        formData.append(`perfil_${filename}`, "true");
      }
    }

    const response = await fetch(`${ENDPOINT}/maps/updatePlace`, {
      method: "POST", // Cambia a "POST" si tu backend lo requiere
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        // No fijar Content-Type manualmente (multipart)
      },
      body: formData,
    });

    if (!response.ok) {
      if ([410, 412].includes(response.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(response.status);
      throw new Error(error);
    }

    return
  } catch (error) {
    console.error("Error updating place:", error);
    setErrorMessage?.(error.message || "Error al actualizar el lugar");
    throw error;
  }
}

//buscar lugar
//conectada
export async function searcher({search, language}, logout){ 
  const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/searcher/${search}/${language}`,
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
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        
        return await res.json()
     }
    )
    
}

export async function getTopCreator({ _id, cursorCount, cursorId }, logout) {
  const token = await AsyncStorage.getItem('token');
  let url = `${ENDPOINT}/maps/top/creator/${_id}`;
  if (cursorCount !== undefined && cursorCount !== null) {
    url += `/${cursorCount}`;
    if (cursorId !== undefined && cursorId !== null) {
      url += `/${cursorId}`;
    }
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      if ([410, 411, 412].includes(res.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Mis fotos en un place (del usuario autenticado)
export async function getMyPhotos({ _id, cursorCount, cursorId }, logout) {
  const token = await AsyncStorage.getItem('token');
  let url = `${ENDPOINT}/maps/myPhotos/${_id}`;
  if (cursorCount !== undefined && cursorCount !== null) {
    url += `/${cursorCount}`;
    if (cursorId !== undefined && cursorId !== null) {
      url += `/${cursorId}`;
    }
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      if ([410, 411, 412].includes(res.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Todas las fotos (comunidad) en orden inverso
export async function getAllPhotos({ _id, cursorCount, cursorId }, logout) {
  const token = await AsyncStorage.getItem('token');
  let url = `${ENDPOINT}/maps/allPhotos/${_id}`;
  if (cursorCount !== undefined && cursorCount !== null) {
    url += `/${cursorCount}`;
    if (cursorId !== undefined && cursorId !== null) {
      url += `/${cursorId}`;
    }
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      if ([410, 411, 412].includes(res.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Votos (puntuación) en orden inverso + datos del usuario
export async function getReviews({ _id, cursorCount, cursorId }, logout) {
  const token = await AsyncStorage.getItem('token');
  let url = `${ENDPOINT}/maps/reviews/${_id}`;
  if (cursorCount !== undefined && cursorCount !== null) {
    url += `/${cursorCount}`;
    if (cursorId !== undefined && cursorId !== null) {
      url += `/${cursorId}`;
    }
  }

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      if ([410, 411, 412].includes(res.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageMaps(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

export async function getTopCreatorByCategory({ _id, cursorCount, cursorId }, logout) {
  const token = await AsyncStorage.getItem('token');

  let url = `${ENDPOINT}/maps/top/creatorcategory/${_id}`; 
  if (cursorCount !== undefined && cursorCount !== null) {
    url += `/${cursorCount}`;
    if (cursorId !== undefined && cursorId !== null) {
      url += `/${cursorId}`;
    }
  }

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    if ([410, 411, 412].includes(res.status)) {
      logout && logout();
      return;
    }
    const error = await getErrorMessageMaps(res.status);
    throw new Error(error);
  }

  return await res.json(); // { items, nextCursor }
}

//likes momentos
//conectada
export async function likeMoment({ _id }, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/maps/likeMoment`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageMaps(res.status)
          throw new Error(error);
        }
        
        return await res.json()
     }
    )
    
}
