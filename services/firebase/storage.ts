import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTask,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload file to Firebase Storage
 */
export const uploadFile = async (
  path: string,
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string> => {
  try {
    const storageRef = ref(storage, path);

    if (onProgress) {
      // Use resumable upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      // Simple upload without progress tracking
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

/**
 * Upload user avatar
 */
export const uploadAvatar = async (
  userId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `avatars/${userId}/${Date.now()}_${file.name}`;
  return uploadFile(path, file, onProgress);
};

/**
 * Upload student submission
 */
export const uploadSubmission = async (
  userId: string,
  assignmentId: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const path = `submissions/${userId}/${assignmentId}/${Date.now()}_${file.name}`;
  return uploadFile(path, file, onProgress);
};

/**
 * Upload teacher content
 */
export const uploadTeacherContent = async (
  teacherId: string,
  file: File,
  folder?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const folderPath = folder ? `${folder}/` : '';
  const path = `content/${teacherId}/${folderPath}${Date.now()}_${file.name}`;
  return uploadFile(path, file, onProgress);
};

/**
 * Upload school resource
 */
export const uploadSchoolResource = async (
  schoolId: string,
  file: File,
  folder?: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const folderPath = folder ? `${folder}/` : '';
  const path = `schools/${schoolId}/${folderPath}${Date.now()}_${file.name}`;
  return uploadFile(path, file, onProgress);
};

/**
 * Delete file from Storage
 */
export const deleteFile = async (path: string): Promise<void> => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

/**
 * Delete file by URL
 */
export const deleteFileByURL = async (url: string): Promise<void> => {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting file by URL:', error);
    throw error;
  }
};

/**
 * Get download URL for a file
 */
export const getFileURL = async (path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error('Error getting file URL:', error);
    throw error;
  }
};

/**
 * List all files in a directory
 */
export const listFiles = async (path: string): Promise<string[]> => {
  try {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);

    const urls = await Promise.all(
      result.items.map((itemRef) => getDownloadURL(itemRef))
    );

    return urls;
  } catch (error) {
    console.error('Error listing files:', error);
    throw error;
  }
};

/**
 * Upload multiple files
 */
export const uploadMultipleFiles = async (
  basePath: string,
  files: File[],
  onProgress?: (fileIndex: number, progress: number) => void
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${Date.now()}_${index}_${file.name}`;
      return uploadFile(path, file, (progress) => {
        onProgress?.(index, progress);
      });
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw error;
  }
};

/**
 * Get file metadata
 */
export const getFileMetadata = async (path: string) => {
  try {
    const storageRef = ref(storage, path);
    return await storageRef;
  } catch (error) {
    console.error('Error getting file metadata:', error);
    throw error;
  }
};

/**
 * Validate file type
 */
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some((type) => {
    if (type.endsWith('/*')) {
      const category = type.split('/')[0];
      return file.type.startsWith(category + '/');
    }
    return file.type === type;
  });
};

/**
 * Validate file size
 */
export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Get file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

/**
 * Generate unique filename
 */
export const generateUniqueFilename = (originalFilename: string): string => {
  const extension = getFileExtension(originalFilename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${timestamp}_${random}.${extension}`;
};

// Common file type presets
export const FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  VIDEOS: ['video/mp4', 'video/quicktime', 'video/x-msvideo'],
  AUDIO: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  ALL: ['*'],
};

// Common file size limits
export const FILE_SIZE_LIMITS = {
  AVATAR: 5, // 5MB
  DOCUMENT: 10, // 10MB
  VIDEO: 100, // 100MB
  AUDIO: 50, // 50MB
};
