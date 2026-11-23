import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// Saves one finished (or ended-early) workout in the "sessions" collection.
// Same pattern as createRoutine: we add the owner's id and a server timestamp.
export function createSession(userId, session) {
  return addDoc(collection(db, 'sessions'), {
    ...session,
    userId, // the security rules check this field
    createdAt: serverTimestamp(),
  })
}
