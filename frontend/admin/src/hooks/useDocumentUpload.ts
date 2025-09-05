import { useState } from 'react';
import { uploadPackageDocuments, getPackageDocuments, deletePackageDocument } from '../services/api.services';

interface DocumentUploadOptions {
  entityType: 'package' | 'user' | 'rack' | 'supplier' | 'pre-arrival' | 'pickup-request' | 'shopping-request';
  entityId: string;
  category?: string;
  isRequired?: boolean;
  uploadedBy: string;
}

interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
}

export const useDocumentUpload = (options: DocumentUploadOptions) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocuments = async (files: File[]) => {
    if (!files.length) return;

    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Use specific API based on entity type
      switch (options.entityType) {
        case 'package':
          response = await uploadPackageDocuments(options.entityId, files);
          break;
        // Add other entity types as needed
        default:
          throw new Error(`Unsupported entity type: ${options.entityType}`);
      }

      // Transform response to UI format
      const newDocuments = response.documents?.map((doc: any) => ({
        id: doc.id,
        name: doc.document_name || doc.name,
        url: doc.document_url || doc.url,
        type: doc.document_type || doc.type
      })) || [];

      setDocuments(prev => [...prev, ...newDocuments]);
      return newDocuments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload documents';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Use specific API based on entity type
      switch (options.entityType) {
        case 'package':
          response = await getPackageDocuments(options.entityId);
          break;
        // Add other entity types as needed
        default:
          throw new Error(`Unsupported entity type: ${options.entityType}`);
      }

      // Transform response to UI format
      const formattedDocuments = response.map((doc: any) => ({
        id: doc.id,
        name: doc.document_name || doc.name,
        url: doc.document_url || doc.url,
        type: doc.document_type || doc.type
      }));

      setDocuments(formattedDocuments);
      return formattedDocuments;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    setLoading(true);
    setError(null);

    try {
      let response;
      
      // Use specific API based on entity type
      switch (options.entityType) {
        case 'package':
          response = await deletePackageDocument(options.entityId, documentId);
          break;
        // Add other entity types as needed
        default:
          throw new Error(`Unsupported entity type: ${options.entityType}`);
      }

      setDocuments(prev => prev.filter(doc => doc.id !== documentId));
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    documents,
    loading,
    error,
    uploadDocuments,
    fetchDocuments,
    deleteDocument,
    setDocuments
  };
};
