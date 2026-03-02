import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../utils/config";

// Create a new EXPOSE
export const createExpose = async ({ title, year, isPublic, coverPhoto }, logout) => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append('title', title);
    formData.append('year', year);
    formData.append('isPublic', isPublic);
    
    if (coverPhoto) {
        const filename = coverPhoto.split('/').pop();
        const type = `image/${filename.split('.').pop()}`;
        formData.append('coverPhoto', {
            uri: coverPhoto,
            name: filename,
            type: type,
        });
    }

    return fetch(`${API_URL}/expose`, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al crear EXPOSE");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Get all my EXPOSE
export const getMyExposes = async (logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/my`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al obtener EXPOSE");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Get community EXPOSE (public ones)
export const getCommunityExposes = async (logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/community`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al obtener EXPOSE de la comunidad");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Get single EXPOSE by ID
export const getExposeById = async (exposeId, logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/${exposeId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al obtener EXPOSE");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Update EXPOSE
export const updateExpose = async ({ exposeId, title, isPublic, coverPhoto }, logout) => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    if (title) formData.append('title', title);
    if (typeof isPublic === 'boolean') formData.append('isPublic', isPublic);
    
    if (coverPhoto && !coverPhoto.startsWith('http')) {
        const filename = coverPhoto.split('/').pop();
        const type = `image/${filename.split('.').pop()}`;
        formData.append('coverPhoto', {
            uri: coverPhoto,
            name: filename,
            type: type,
        });
    }

    return fetch(`${API_URL}/expose/${exposeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al actualizar EXPOSE");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Delete EXPOSE
export const deleteExpose = async (exposeId, logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/${exposeId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al eliminar EXPOSE");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Add photos to a month
export const addMonthPhotos = async ({ exposeId, monthIndex, photos, title }, logout) => {
    const token = await AsyncStorage.getItem("token");

    const formData = new FormData();
    formData.append('monthIndex', monthIndex);
    if (title) formData.append('title', title);
    
    photos.forEach((photo, index) => {
        if (photo && !photo.startsWith('http')) {
            const filename = photo.split('/').pop();
            const type = `image/${filename.split('.').pop()}`;
            formData.append('photos', {
                uri: photo,
                name: filename,
                type: type,
            });
        }
    });

    return fetch(`${API_URL}/expose/${exposeId}/month`, {
        method: "POST",
        headers: {
            "Content-Type": "multipart/form-data",
            "x-access-token": token,
        },
        body: formData,
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al añadir fotos");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Delete photos from a month
export const deleteMonthPhotos = async ({ exposeId, monthIndex, photoUrls }, logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/${exposeId}/month/${monthIndex}/photos`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
        body: JSON.stringify({ photoUrls }),
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al eliminar fotos");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Like an EXPOSE
export const likeExpose = async (exposeId, logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/${exposeId}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al dar like");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Unlike an EXPOSE
export const unlikeExpose = async (exposeId, logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/${exposeId}/unlike`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al quitar like");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

// Get EXPOSE wrap data (statistics for generating wrap)
export const getExposeWrapData = async (exposeId, logout) => {
    const token = await AsyncStorage.getItem("token");

    return fetch(`${API_URL}/expose/${exposeId}/wrap`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    })
        .then((res) => res.json())
        .then((response) => {
            if (response.error) {
                if (response.error === "TokenExpired") {
                    logout();
                    throw new Error("Tu sesión ha expirado");
                }
                throw new Error(response.message || "Error al obtener datos del wrap");
            }
            return response;
        })
        .catch((error) => {
            throw error;
        });
};

