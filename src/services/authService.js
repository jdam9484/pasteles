import { auth, db } from "../firebase/config";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export async function getUserRole(uid) {
  const snap = await getDoc(doc(db, "user", uid));
  return snap.exists() ? (snap.data()?.rol ?? "cliente") : "cliente";
}

export async function loginUser(email, password) {
  try {
    const emailNorm = email.trim().toLowerCase();

    const cred = await signInWithEmailAndPassword(auth, emailNorm, password);
    const userSnap = await getDoc(doc(db, "user", cred.user.uid));

    if (!userSnap.exists()) return { success: false, error: "Perfil no encontrado en Firestore." };

    const userData = userSnap.data();
    return { success: true, user: cred.user, userData, role: userData?.rol ?? "cliente" };
  } catch (e) {
    return { success: false, error: e?.message || "Error al iniciar sesión" };
  }
}

export async function registerUser({ nombre, email, password, rol = "cliente" }) {
  try {
    const emailNorm = email.trim().toLowerCase();

    const cred = await createUserWithEmailAndPassword(auth, emailNorm, password);

    await setDoc(doc(db, "user", cred.user.uid), {
      email: emailNorm,
      nombre: nombre?.trim() || "",
      rol,
      activo: true,
      fechaRegistro: serverTimestamp(),
    });

    return { success: true };
  } catch (e) {
    return { success: false, error: e?.message || "Error registrando usuario" };
  }
}

export async function logoutUser() {
  await signOut(auth);
}
