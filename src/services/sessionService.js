import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
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

// NEW: gets all of one user's sessions, newest first.
// Same approach as getUserRoutines: where() asks for ONLY this user's documents
// (the security rules require it), and we sort in the browser so no Firestore index is needed.
export async function getUserSessions(userId) {
  const q = query(collection(db, 'sessions'), where('userId', '==', userId))
  const snapshot = await getDocs(q)

  // A Firestore document keeps its id separate from its data, so we join them
  const sessions = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  // createdAt is a Firestore Timestamp; toMillis() gives a number we can compare
  return sessions.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}
