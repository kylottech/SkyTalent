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

const getErrorMessageRanking = async (statusCode) => {
  const texts = await loadTexts();
  return texts.rankingServices?.[statusCode] || texts.rankingServices?.Default
};

// Util para query string de paginación (opcional)
const qs = (cursor, limit) => {
  const params = new URLSearchParams();
  if (cursor !== undefined && cursor !== null) params.set('cursor', String(cursor));
  if (limit !== undefined && limit !== null) params.set('limit', String(limit));
  const s = params.toString();
  return s ? `?${s}` : '';
};

/* =========================================================
   CATEGORÍA BASE (usuarios) – EXISTENTE
   ========================================================= */

// Top de menores de 30
export async function topLesser(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/topLesser`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// lista de menores de 30 (ahora con paginación opcional)
export async function listLesser(logout, { cursor, limit } = {}){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/listLesser${qs(cursor, limit)}`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// posicion de menores de 30
export async function positionLesser(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/positionLesser`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// Top de mayores de 30
export async function topGreater(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/topGreater`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// lista de mayores de 30 (paginación opcional)
export async function listGreater(logout, { cursor, limit } = {}){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/listGreater${qs(cursor, limit)}`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// posicion de mayores de 30
export async function positionGreater(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/positionGreater`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// Top competición
export async function topCompetition(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/topCompetition`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// lista competición (paginación opcional)
export async function listCompetition(logout, { cursor, limit } = {}){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/listCompetition${qs(cursor, limit)}`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

// posicion competición
export async function positionCompetition(logout){ 
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/positionCompetition`,
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
        let error= await getErrorMessageRanking(res.status)
        throw new Error(error);
      }
      return await res.json()
   }
  ).then((response)=>{
      return response
  })
}

/* =========================================================
   NUEVAS CATEGORÍAS: EXPERIENCES
   - Métrica: likes.length + copied (por experiencia), agrupado por creator
   ========================================================= */

// top
export async function topExperiencesLesser(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/topLesser`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function topExperiencesGreater(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/topGreater`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function topExperiencesCompetition(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/topCompetition`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

// list (paginación opcional)
export async function listExperiencesLesser(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/listLesser${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function listExperiencesGreater(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/listGreater${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function listExperiencesCompetition(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/listCompetition${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

// position
export async function positionExperiencesLesser(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/positionLesser`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function positionExperiencesGreater(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/positionGreater`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function positionExperiencesCompetition(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/experiences/positionCompetition`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

/* =========================================================
   NUEVAS CATEGORÍAS: LISTS
   - Métrica: followers.length (por lista), agrupado por creator
   ========================================================= */

// top
export async function topListsLesser(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/topLesser`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function topListsGreater(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/topGreater`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function topListsCompetition(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/topCompetition`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

// list (paginación opcional)
export async function listListsLesser(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/listLesser${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function listListsGreater(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/listGreater${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function listListsCompetition(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/listCompetition${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

// position
export async function positionListsLesser(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/positionLesser`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function positionListsGreater(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/positionGreater`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function positionListsCompetition(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/lists/positionCompetition`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

/* =========================================================
   NUEVAS CATEGORÍAS: ALBUM
   - Métrica: copied.length (por álbum), agrupado por creator
   ========================================================= */

// top
export async function topAlbumLesser(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/topLesser`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function topAlbumGreater(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/topGreater`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function topAlbumCompetition(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/topCompetition`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

// list (paginación opcional)
export async function listAlbumLesser(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/listLesser${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function listAlbumGreater(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/listGreater${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function listAlbumCompetition(logout, { cursor, limit } = {}){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/listCompetition${qs(cursor, limit)}`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

// position
export async function positionAlbumLesser(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/positionLesser`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function positionAlbumGreater(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/positionGreater`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}

export async function positionAlbumCompetition(logout){
  const token= await AsyncStorage.getItem('token')
  return fetch(`${ENDPOINT}/ranking/album/positionCompetition`,
  {
    method:'GET',
    headers: {
      Authorization: 'Bearer '+ token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok){
      if(res.status === 410 || res.status === 412 || res.status === 412){
        logout(); return
      }
      let error= await getErrorMessageRanking(res.status)
      throw new Error(error);
    }
    return await res.json()
  }).then((response)=> response)
}
