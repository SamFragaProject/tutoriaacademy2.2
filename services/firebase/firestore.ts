import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  QueryConstraint,
  DocumentData,
  serverTimestamp,
  writeBatch,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Generic document interface
 */
export interface FirestoreDocument {
  id: string;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Create a new document
 */
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  customId?: string
): Promise<string> => {
  try {
    const id = customId || doc(collection(db, collectionName)).id;
    await setDoc(doc(db, collectionName, id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get a single document by ID
 */
export const getDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string
): Promise<(T & { id: string }) | null> => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T & { id: string };
    }
    return null;
  } catch (error) {
    console.error(`Error getting document ${docId} from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Update a document
 */
export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
): Promise<void> => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating document ${docId} in ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (
  collectionName: string,
  docId: string
): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error) {
    console.error(`Error deleting document ${docId} from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Get all documents from a collection with optional query constraints
 */
export const getDocuments = async <T extends DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<(T & { id: string })[]> => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as (T & { id: string })[];
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Query documents by field
 */
export const queryDocuments = async <T extends DocumentData>(
  collectionName: string,
  field: string,
  operator: any,
  value: any,
  orderByField?: string,
  limitCount?: number
): Promise<(T & { id: string })[]> => {
  try {
    const constraints: QueryConstraint[] = [where(field, operator, value)];

    if (orderByField) {
      constraints.push(orderBy(orderByField));
    }

    if (limitCount) {
      constraints.push(limit(limitCount));
    }

    return await getDocuments<T>(collectionName, constraints);
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error);
    throw error;
  }
};

/**
 * Batch write operations
 */
export const batchWrite = async (
  operations: Array<{
    type: 'create' | 'update' | 'delete';
    collection: string;
    id: string;
    data?: DocumentData;
  }>
): Promise<void> => {
  try {
    const batch = writeBatch(db);

    operations.forEach(({ type, collection: collectionName, id, data }) => {
      const docRef = doc(db, collectionName, id);

      switch (type) {
        case 'create':
          batch.set(docRef, {
            ...data,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          break;
        case 'update':
          batch.update(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
          });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();
  } catch (error) {
    console.error('Error in batch write:', error);
    throw error;
  }
};

/**
 * Subscribe to real-time updates for a single document
 */
export const subscribeToDocument = <T extends DocumentData>(
  collectionName: string,
  docId: string,
  callback: (data: (T & { id: string }) | null) => void
): Unsubscribe => {
  const docRef = doc(db, collectionName, docId);

  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        callback({ id: docSnap.id, ...docSnap.data() } as T & { id: string });
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error(`Error subscribing to document ${docId}:`, error);
      callback(null);
    }
  );
};

/**
 * Subscribe to real-time updates for a collection
 */
export const subscribeToCollection = <T extends DocumentData>(
  collectionName: string,
  callback: (data: (T & { id: string })[]) => void,
  constraints: QueryConstraint[] = []
): Unsubscribe => {
  const q = query(collection(db, collectionName), ...constraints);

  return onSnapshot(
    q,
    (querySnapshot) => {
      const documents = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as (T & { id: string })[];
      callback(documents);
    },
    (error) => {
      console.error(`Error subscribing to collection ${collectionName}:`, error);
      callback([]);
    }
  );
};

/**
 * Get user's gym profile
 */
export const getGymProfile = async (userId: string) => {
  return getDocument('gymProfiles', userId);
};

/**
 * Update user's gym profile
 */
export const updateGymProfile = async (userId: string, data: any) => {
  return updateDocument('gymProfiles', userId, data);
};

/**
 * Create or update gym profile
 */
export const setGymProfile = async (userId: string, data: any) => {
  const docRef = doc(db, 'gymProfiles', userId);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

/**
 * Save game score
 */
export const saveGameScore = async (scoreData: {
  gameId: string;
  userId: string;
  schoolId: string;
  score: number;
  metrics: any;
  gradeLevel: string;
}) => {
  return createDocument('gameScores', scoreData);
};

/**
 * Get user's game scores
 */
export const getUserGameScores = async (userId: string, gameId?: string) => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(50),
  ];

  if (gameId) {
    constraints.unshift(where('gameId', '==', gameId));
  }

  return getDocuments('gameScores', constraints);
};

/**
 * Get progress data
 */
export const getProgress = async (userId: string) => {
  return getDocument('progress', userId);
};

/**
 * Update progress
 */
export const updateProgress = async (userId: string, data: any) => {
  const docRef = doc(db, 'progress', userId);
  await setDoc(docRef, {
    ...data,
    lastUpdated: serverTimestamp(),
  }, { merge: true });
};

/**
 * Get gamification data
 */
export const getGamificationData = async (userId: string) => {
  return getDocument('gamification', userId);
};

/**
 * Update gamification data
 */
export const updateGamificationData = async (userId: string, data: any) => {
  const docRef = doc(db, 'gamification', userId);
  await setDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
};

/**
 * Get student profile
 */
export const getStudentProfile = async (userId: string) => {
  return getDocument('studentProfiles', userId);
};

/**
 * Update student profile
 */
export const updateStudentProfile = async (userId: string, data: any) => {
  return updateDocument('studentProfiles', userId, data);
};

/**
 * Get school leaderboard
 */
export const getSchoolLeaderboard = async (schoolId: string, limitCount = 10) => {
  return queryDocuments(
    'gamification',
    'schoolId',
    '==',
    schoolId,
    'stats.totalXP',
    limitCount
  );
};

/**
 * Get screening data for student
 */
export const getScreeningData = async (userId: string) => {
  return queryDocuments('screening', 'userId', '==', userId, 'timestamp', 1);
};

/**
 * Save screening result
 */
export const saveScreeningResult = async (data: {
  userId: string;
  schoolId: string;
  results: any;
  recommendations: any;
}) => {
  return createDocument('screening', {
    ...data,
    timestamp: serverTimestamp(),
  });
};

export {
  // Re-export Firestore utilities
  where,
  orderBy,
  limit,
  startAfter,
  endBefore,
  serverTimestamp,
};
