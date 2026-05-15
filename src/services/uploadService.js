import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

/**
 * Sube una imagen a Firebase Storage y retorna la URL pública.
 * @param {File} file - El archivo de imagen a subir.
 * @param {string} folder - Carpeta de destino (ej: 'orders').
 * @returns {Promise<string>} - URL de la imagen subida.
 */
export const uploadImage = async (file, folder = "orders") => {
    if (!file) return null;

    try {
        const timestamp = Date.now();
        const fileName = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
        const storageRef = ref(storage, `${folder}/${fileName}`);
        
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;
    } catch (error) {
        console.error("Error al subir imagen:", error);
        throw error;
    }
};
