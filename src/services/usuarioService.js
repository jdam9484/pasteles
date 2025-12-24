import { db } from "../firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";



export async function setUsuarioRol(uid, rol) {
  return updateDoc(doc(db, "user", uid), {
    rol, // "Administrador" o "cliente"
    updatedAt: serverTimestamp(),
  });
}

export async function deleteUsuarioPerfil(uid) {
  // OJO: Solo elimina el perfil en Firestore.
  // No se puede borrar la cuenta de Auth desde frontend.
  return deleteDoc(doc(db, "user", uid));
}
export function listenUsuarios(onChange, onError) {
  const q = query(collection(db, "user")); // SIN orderBy por ahora

  console.log("[listenUsuarios] suscribiendo a collection: user");

  return onSnapshot(
    q,
    (snap) => {
      console.log("[listenUsuarios] snap.size =", snap.size);
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      console.log("[listenUsuarios] first doc =", arr[0]);
      onChange(arr);
    },
    (err) => {
      console.error("[listenUsuarios] ERROR:", err);
      onError?.(err);
    }
  );
}