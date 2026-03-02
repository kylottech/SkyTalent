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

const getErrorMessageGroupSocial = async (statusCode) => {
    const texts = await loadTexts();
    return texts.groupSocialServices?.[statusCode] || texts.groupSocialServices?.Default || 'Error desconocido';
};

// Crear encuesta en grupo
export async function createGroupPoll({ groupId, question, options }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${ENDPOINT}/groups/${groupId}/polls`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: question.trim(),
        options: options.filter(opt => opt.trim())
      }),
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating group poll:', error);
    throw error;
  }
}

// Crear historia en grupo
export async function createGroupStory({ groupId, description, image }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    const formData = new FormData();

    formData.append('description', description.trim());
    formData.append('image', {
      uri: image.uri,
      type: 'image/jpeg',
      name: `story_${Date.now()}.jpg`,
    });

    const response = await fetch(`${ENDPOINT}/groups/${groupId}/stories`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating group story:', error);
    throw error;
  }
}

// Obtener encuestas del grupo
export async function getGroupPolls({ groupId, page = 1 }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${ENDPOINT}/groups/${groupId}/polls?page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching group polls:', error);
    throw error;
  }
}

// Obtener historias del grupo
export async function getGroupStories({ groupId, page = 1 }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${ENDPOINT}/groups/${groupId}/stories?page=${page}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching group stories:', error);
    throw error;
  }
}

// Votar en encuesta
export async function votePoll({ pollId, optionIndex }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${ENDPOINT}/polls/${pollId}/vote`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        optionIndex
      }),
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error voting poll:', error);
    throw error;
  }
}

// Eliminar encuesta (solo admin)
export async function deleteGroupPoll({ pollId }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${ENDPOINT}/polls/${pollId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting poll:', error);
    throw error;
  }
}

// Eliminar historia
export async function deleteGroupStory({ storyId }, logout) {
  try {
    const token = await AsyncStorage.getItem('token');
    
    const response = await fetch(`${ENDPOINT}/stories/${storyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 410 || response.status === 411 || response.status === 412) {
        logout();
        return;
      }
      const error = await getErrorMessageGroupSocial(response.status);
      throw new Error(error);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
}
