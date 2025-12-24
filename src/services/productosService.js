import { db } from "../firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const productosRef = collection(db, "productos");

// LISTAR (tiempo real)
export function listenProductos(onChange, onError) {
  // si tus docs no tienen createdAt, mejor ordenar por nombre
  const q = query(productosRef, orderBy("nombre", "asc"));

  return onSnapshot(
    q,
    (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(data);
    },
    (err) => onError?.(err)
  );
}

// CREAR
export async function createProducto(data) {
  // data: {nombre, descripcion, categoria, imagen, precio, stock}
  return addDoc(productosRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// EDITAR
export async function updateProducto(id, data) {
  return updateDoc(doc(db, "productos", id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ELIMINAR
export async function deleteProducto(id) {
  return deleteDoc(doc(db, "productos", id));
}
