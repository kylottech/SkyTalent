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

const getErrorMessageLog = async (statusCode) => {
    const texts = await loadTexts();

    return texts.logServices?.[statusCode] || texts.logServices?.Default
};

//registro
//conectada
export async function register({username,surname,kylotID,tlfnumber,email,password, date, gender}){ 
    return fetch(`${ENDPOINT}/log/register`,
    {
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: username,surname: surname,kylotId: kylotID,telefono: tlfnumber,
            email: email,password: password, date: date, gender: gender
        }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
           let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        
        return res.json()
     }
    ).then((response)=>{
        AsyncStorage.setItem('_id', response._id).catch((error) => {

        });
        return response
    })
    
}

//login
//conectada
export async function login({ username, password }){ 
    return fetch(`${ENDPOINT}/log/authentication`,
    {
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, password: password }),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        
        return res.json()
     }
    ).then((response)=>{

        AsyncStorage.setItem('_id', response._id).catch((error) => {


        });
        return response.email
    })
    
}

//codigo de verificacion
//conectada
export async function codVeriRegister({_id,codigo}){ 
    
    return fetch(`${ENDPOINT}/log/code`,
    {
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id:_id,codigo:codigo}),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        return res.json()
     }
    ).then((response)=>{
        return response
    })
    
}

//pedir codigo de recuperacion
//conectada
export async function enviarCodigoEmail({username}){


    return fetch(`${ENDPOINT}/log/password/email`,
    {
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:username}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            let error= await getErrorMessageLog(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//codigo de recuperacion
//conectada
export async function codVerificacionContrasenia({email, codigo}){

    return fetch(`${ENDPOINT}/log/password/code`,
    {
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email,codigo:codigo}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            let error= await getErrorMessageLog(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//nueva contraseña
//conectada
export async function nuevaContrasenia({password,email}){
    return fetch(`${ENDPOINT}/log/password/password`,
    {
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({email:email,newPassword:password}),

    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            let error= await getErrorMessageLog(res.status)
            throw new Error(error);
        } 
        return res
     }
    ).then((response)=>{

        return response

    })

}

//codigo invitacion de usuario
//conectada
export async function userCode({_id,codigo}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/log/userCode`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id:_id,codigo:codigo}),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 411 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        return 
     }
    )
    
}

//codigo invitacion Kylot
//conectada
export async function kylotCode({_id,codigo}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/log/kylotCode`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({_id:_id,codigo:codigo}),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        return 
     }
    )
    
}

//enviar 5 lugares
//conectada
export async function savePlaces({ places, newPhotosByPlace }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    formData.append('places', JSON.stringify(places));

    newPhotosByPlace.forEach((photos, index) => {
      photos.forEach(photo => {
        const filename = `place_${index}_${Date.now()}_${Math.random()}.jpg`;

        formData.append('images', {
          uri: photo.url,
          type: 'image/jpeg',
          name: filename
        });

        formData.append(`placeIndex_${filename}`, index.toString());

        if (photo.perfil === true) {
          formData.append(`perfil_${filename}`, 'true');
        }
      });
    });

    const response = await fetch(`${ENDPOINT}/log/savePlaces`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      body: formData
    });

    if (!response.ok) {
      if ([410, 412].includes(response.status)) {
        logout();
        return;
      }
      const error = await getErrorMessageLog(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in savePlaces:", error);
    throw error;
  }
}


//anadir tags al perfil
//conectado
export async function addTags({tags}, logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/log/tags`,
    {
        method:'POST',
        headers: {
            Authorization: 'Bearer '+ token,
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({tags:tags}),
    
    }
    
    ).then(async (res) => {
        if (!res.ok){
            if(res.status === 410 || res.status === 412 || res.status === 412){
                logout();
                return
            }
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        return 
     }
    )
    
}

//pedir
//conectado
export async function getTags(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/log/getTags`,
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
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir
//conectado
export async function getSelectedTags(logout){ 
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/log/getSelectedTags`,
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
          let error= await getErrorMessageLog(res.status)
          throw new Error(error);
        }
        return await res.json()
     }
    )
    
}

//pedir decision de la app
//no conectado
export async function getDecision(logout){
    const token= await AsyncStorage.getItem('token')
    return fetch(`${ENDPOINT}/log/decision`,
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
            let error= await getErrorMessageLog(res.status)
            throw new Error(error);
        } 
        return res.json()
     }
    ).then((response)=>{

        return response

    })

}