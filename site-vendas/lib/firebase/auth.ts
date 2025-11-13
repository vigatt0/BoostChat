import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

const googleProvider = new GoogleAuthProvider();

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  plan: string;
  messageBalance: number;
  messageLimit: number;
  isUnlimited: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Registrar novo usuário
export async function signUp(email: string, password: string, displayName?: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Criar documento do usuário no Firestore
    await createUserDocument(user, displayName);

    return { user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { user: null, error: errorMessage };
  }
}

// Login de usuário
export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { user: null, error: errorMessage };
  }
}

// Login com Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Verificar se o usuário já existe no Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await createUserDocument(user);
    }

    return { user, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { user: null, error: errorMessage };
  }
}

// Logout
export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return { error: errorMessage };
  }
}

// Criar documento do usuário no Firestore
async function createUserDocument(user: User, displayName?: string) {
  const userRef = doc(db, 'users', user.uid);
  
  const userData: Partial<UserData> = {
    uid: user.uid,
    email: user.email || '',
    displayName: displayName || user.displayName || 'Usuário',
    plan: 'free',
    messageBalance: 0,
    messageLimit: 0,
    isUnlimited: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await setDoc(userRef, userData);
}

// Obter dados do usuário
export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    return null;
  }
}
