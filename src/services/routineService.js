import { addDoc, collection, getDocs, query, serverTimestamp, where } from 'firebase/firestore'
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

// Gets all the routines that belong to one user, newest first.
export async function getUserRoutines(userId) {
  // where() asks Firestore for ONLY this user's documents (the security rules require this)
  const q = query(collection(db, 'routines'), where('userId', '==', userId))
  const snapshot = await getDocs(q)

  // A Firestore document keeps its id separate from its data, so we join them
  const routines = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

  // createdAt is a Firestore Timestamp; toMillis() turns it into a number we can compare.
  // Sorting here (instead of in the query) means we don't need to create a Firestore index.
  return routines.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}
