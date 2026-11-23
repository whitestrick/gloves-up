import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore'
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

// NEW: gets ONE routine by its id. Returns null if it does not exist.
export async function getRoutine(id) {
  // doc(db, 'routines', id) points at one document; getDoc() reads it
  const snapshot = await getDoc(doc(db, 'routines', id))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

// NEW: changes fields on an existing routine.
// updateDoc only touches the fields we send, so userId and createdAt stay as they were.
export function updateRoutine(id, changes) {
  return updateDoc(doc(db, 'routines', id), {
    ...changes,
    updatedAt: serverTimestamp(), // when it was last edited
  })
}
