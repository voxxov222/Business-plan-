import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from './auth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Global error handler mandated by the Firebase Integration Skill
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error details:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Comment {
  id: string;
  sectionId: string;
  authorName: string;
  authorEmail: string;
  authorPhoto?: string;
  authorUid: string;
  text: string;
  createdAt: any; // Firestore Timestamp
  resolved: boolean;
  response?: string;
  responseAuthorName?: string;
  responseCreatedAt?: any; // Firestore Timestamp
}

// Active sections map for easy lookups
export const SECTION_NAMES: { [key: string]: string } = {
  'executive-summary': 'Executive Summary',
  'safety-specs': 'Safe-Window Technical Specs',
  'lockdown-simulator': 'Walk-up Lockdown Simulator',
  '3d-architecture': '3D Portal Architecture',
  'financial-readiness': 'Loan Readiness Checklist',
  'projected-revenue': 'Projected Revenue & Growth',
  'competitor-analysis': 'Competitor Comparison & Strategy'
};

// Test firestore connection on load
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'comments', 'connection-test-placeholder'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore appears offline. Ensure connectivity is configured.");
    }
  }
}

// Subscribe to all comments real-time
export function subscribeToComments(onUpdate: (comments: Comment[]) => void, onError: (err: Error) => void) {
  const colPath = 'comments';
  const q = query(collection(db, colPath), orderBy('createdAt', 'desc'));

  return onSnapshot(
    q, 
    (snapshot) => {
      const comments: Comment[] = [];
      snapshot.forEach((doc) => {
        comments.push({ id: doc.id, ...doc.data() } as Comment);
      });
      onUpdate(comments);
    },
    (error) => {
      onError(new Error(error.message));
      handleFirestoreError(error, OperationType.GET, colPath);
    }
  );
}

// Submit a new comment / question
export async function addComment(sectionId: string, text: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Must be authenticated to submit a comment.");
  }

  const colPath = 'comments';
  // Use a custom alphanumeric document ID as mandated by security rules
  const commentId = 'comment_' + Math.random().toString(36).substring(2, 15);
  const commentDocRef = doc(db, colPath, commentId);

  const commentData = {
    sectionId,
    authorName: user.displayName || 'Anonymous Investor',
    authorEmail: user.email || '',
    authorPhoto: user.photoURL || '',
    authorUid: user.uid,
    text,
    createdAt: serverTimestamp(),
    resolved: false
  };

  try {
    await setDoc(commentDocRef, commentData);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${colPath}/${commentId}`);
  }
}

// Add an official owner reply
export async function replyToComment(commentId: string, responseText: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Must be authenticated to reply.");
  }

  const colPath = 'comments';
  const commentDocRef = doc(db, colPath, commentId);

  try {
    await updateDoc(commentDocRef, {
      response: responseText,
      responseAuthorName: user.displayName || 'Business Owner',
      responseCreatedAt: serverTimestamp(),
      resolved: true // Auto-resolve when answered
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${colPath}/${commentId}`);
  }
}

// Toggle comment resolved flag
export async function toggleCommentResolved(commentId: string, currentResolved: boolean): Promise<void> {
  const colPath = 'comments';
  const commentDocRef = doc(db, colPath, commentId);

  try {
    await updateDoc(commentDocRef, {
      resolved: !currentResolved
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${colPath}/${commentId}`);
  }
}

// Delete comment
export async function deleteComment(commentId: string): Promise<void> {
  const colPath = 'comments';
  const commentDocRef = doc(db, colPath, commentId);

  try {
    await deleteDoc(commentDocRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${colPath}/${commentId}`);
  }
}
