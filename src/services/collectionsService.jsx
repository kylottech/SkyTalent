import AsyncStorage from '@react-native-async-storage/async-storage';
import { ENDPOINT } from '../utils/constants';

// Obtener todas las colecciones del usuario
export async function getUserCollections(logout) {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${ENDPOINT}/collections/user`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 412) {
        logout();
        return;
      }
      let error = await getErrorMessageCollections(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Crear una nueva colección
export async function createCollection({ name, description, isPrivate }, logout) {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${ENDPOINT}/collections/create`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: name.trim(),
      description: description.trim(),
      isPrivate,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 412) {
        logout();
        return;
      }
      let error = await getErrorMessageCollections(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Agregar producto a una colección
export async function addProductToCollection(collectionId, productId, logout) {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${ENDPOINT}/collections/add-product`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collectionId,
      productId,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 412) {
        logout();
        return;
      }
      let error = await getErrorMessageCollections(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Remover producto de una colección
export async function removeProductFromCollection(collectionId, productId, logout) {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${ENDPOINT}/collections/remove-product`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collectionId,
      productId,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 412) {
        logout();
        return;
      }
      let error = await getErrorMessageCollections(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Obtener productos de una colección
export async function getCollectionProducts(collectionId, logout) {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${ENDPOINT}/collections/${collectionId}/products`, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 412) {
        logout();
        return;
      }
      let error = await getErrorMessageCollections(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Eliminar colección
export async function deleteCollection(collectionId, logout) {
  const token = await AsyncStorage.getItem('token');
  
  return fetch(`${ENDPOINT}/collections/delete`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      collectionId,
    }),
  }).then(async (res) => {
    if (!res.ok) {
      if (res.status === 410 || res.status === 412) {
        logout();
        return;
      }
      let error = await getErrorMessageCollections(res.status);
      throw new Error(error);
    }
    return await res.json();
  });
}

// Función para manejar errores específicos de colecciones
async function getErrorMessageCollections(status) {
  switch (status) {
    case 400:
      return 'Solicitud inválida';
    case 401:
      return 'No autorizado';
    case 403:
      return 'No tienes permisos para realizar esta acción';
    case 404:
      return 'Colección no encontrada';
    case 409:
      return 'Ya existe una colección con ese nombre';
    case 500:
      return 'Error del servidor';
    default:
      return 'Error desconocido';
  }
}
