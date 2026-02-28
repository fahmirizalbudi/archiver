import { db } from '../lib/firebase';
import { ref, push, set, onValue, remove, query, limitToLast } from 'firebase/database';

/**
 * Represents a document archived in the system.
 */
export interface ArchivedDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  format: string;
  categoryId: string;
  category: string;
  security: 'Public' | 'Internal' | 'Confidential';
  uploadDate: number;
}

/**
 * Represents an organizational category for documents.
 */
export interface DocumentCategory {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

/**
 * Service for managing document and category data in Firebase Realtime Database.
 */
export const archiveService = {
  /**
   * Creates a new document category.
   * @param category - The category data to save.
   * @returns A promise resolving to the saved category with generated metadata.
   */
  saveCategory: async (category: Omit<DocumentCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    const catRef = ref(db, 'categories');
    const newCatRef = push(catRef);
    const catData = {
      ...category,
      id: newCatRef.key,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await set(newCatRef, catData);
    return catData;
  },

  /**
   * Subscribes to document category updates.
   * @param callback - Function invoked with the updated categories list.
   * @returns An unsubscribe function.
   */
  getCategories: (callback: (categories: DocumentCategory[]) => void) => {
    const catRef = ref(db, 'categories');
    return onValue(catRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categories = Object.values(data) as DocumentCategory[];
        callback(categories.sort((a, b) => b.updatedAt - a.updatedAt));
      } else {
        callback([]);
      }
    });
  },

  /**
   * Deletes a document category.
   * @param categoryId - Unique identifier of the category.
   * @returns A promise resolving when the removal is complete.
   */
  deleteCategory: async (categoryId: string) => {
    const catRef = ref(db, `categories/${categoryId}`);
    return remove(catRef);
  },

  /**
   * Saves document metadata and updates category activity.
   * @param doc - Document data to archive.
   * @returns A promise resolving to the archived document data.
   */
  saveDocument: async (doc: Omit<ArchivedDocument, 'id'>) => {
    const docRef = ref(db, 'documents');
    const newDocRef = push(docRef);
    const docData = {
      ...doc,
      id: newDocRef.key
    };
    await set(newDocRef, docData);

    if (doc.categoryId) {
      const catRef = ref(db, `categories/${doc.categoryId}/updatedAt`);
      await set(catRef, Date.now());
    }

    return docData;
  },

  /**
   * Subscribes to all document updates.
   * @param callback - Function invoked with the updated documents list.
   * @returns An unsubscribe function.
   */
  getDocuments: (callback: (docs: ArchivedDocument[]) => void) => {
    const docRef = ref(db, 'documents');
    return onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const docs = Object.values(data) as ArchivedDocument[];
        callback(docs.reverse());
      } else {
        callback([]);
      }
    });
  },

  /**
   * Subscribes to a limited set of recent document updates.
   * @param limit - Maximum number of recent documents to fetch.
   * @param callback - Function invoked with the recent documents list.
   * @returns An unsubscribe function.
   */
  getRecentDocuments: (limit: number, callback: (docs: ArchivedDocument[]) => void) => {
    const docRef = ref(db, 'documents');
    const recentQuery = query(docRef, limitToLast(limit));
    return onValue(recentQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const docs = Object.values(data) as ArchivedDocument[];
        callback(docs.reverse());
      } else {
        callback([]);
      }
    });
  },

  /**
   * Deletes document metadata.
   * @param docId - Unique identifier of the document.
   * @returns A promise resolving when the removal is complete.
   */
  deleteDocument: async (docId: string) => {
    const docRef = ref(db, `documents/${docId}`);
    return remove(docRef);
  },

  /**
   * Clears all document and category data from the system.
   * @returns A promise resolving when the operation is complete.
   */
  clearAllData: async () => {
    const docsRef = ref(db, 'documents');
    const catsRef = ref(db, 'categories');
    await remove(docsRef);
    await remove(catsRef);
  }
};
