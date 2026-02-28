import { db } from '../lib/firebase';
import { ref, push, set, onValue, remove, query, limitToLast } from 'firebase/database';

export interface ArchivedDocument {
  id: string;
  name: string;
  url: string;
  size: number;
  format: string;
  categoryId: string; // Changed to reference Category ID
  category: string;   // Keeping this for display/fallback
  security: 'Public' | 'Internal' | 'Confidential';
  uploadDate: number;
}

export interface DocumentCategory {
  id: string;
  name: string;
  color: string;
  createdAt: number;
  updatedAt: number;
}

export const archiveService = {
  // --- Category Management ---
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

  deleteCategory: async (categoryId: string) => {
    const catRef = ref(db, `categories/${categoryId}`);
    return remove(catRef);
  },

  // --- Document Management ---
  saveDocument: async (doc: Omit<ArchivedDocument, 'id'>) => {
    const docRef = ref(db, 'documents');
    const newDocRef = push(docRef);
    const docData = {
      ...doc,
      id: newDocRef.key
    };
    await set(newDocRef, docData);

    // Update category timestamp if a category is specified
    if (doc.categoryId) {
      const catRef = ref(db, `categories/${doc.categoryId}/updatedAt`);
      await set(catRef, Date.now());
    }

    return docData;
  },

  // Get all documents
  getDocuments: (callback: (docs: ArchivedDocument[]) => void) => {
    const docRef = ref(db, 'documents');
    return onValue(docRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const docs = Object.values(data) as ArchivedDocument[];
        callback(docs.reverse()); // Newest first
      } else {
        callback([]);
      }
    });
  },

  // Get recent documents
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

  // Delete document
  deleteDocument: async (docId: string) => {
    const docRef = ref(db, `documents/${docId}`);
    return remove(docRef);
  },

  // Clear all data (System Reset)
  clearAllData: async () => {
    const docsRef = ref(db, 'documents');
    const catsRef = ref(db, 'categories');
    await remove(docsRef);
    await remove(catsRef);
  }
};
