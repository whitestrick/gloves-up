import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// Saves a new routine in the "routines" collection.
// Firestore creates the document id for us.
export function createRoutine(userId, routine) {
  return addDoc(collection(db, 'routines'), {
    ...routine,
    userId, // who owns this routine (the security rules check this field)
    createdAt: serverTimestamp(), // the server sets the time, not the user's clock
  })
}
