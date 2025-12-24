import { auth, db } from "../firebase/config";
import { collection, doc, getDoc, serverTimestamp, writeBatch } from "firebase/firestore";

export async function crearVentaDesdeCarrito(carritoItems) {
  const user = auth.currentUser;
  if (!user) throw new Error("Debes iniciar sesión para comprar.");
  if (!Array.isArray(carritoItems) || carritoItems.length === 0) throw new Error("Tu carrito está vacío.");

  const perfilSnap = await getDoc(doc(db, "user", user.uid));
  const perfil = perfilSnap.exists() ? perfilSnap.data() : {};
  const email = (perfil?.email || user.email || "").trim();
  const usuarioNombre = (perfil?.nombre || email || "Cliente").trim();

  const items = carritoItems.map((it) => {
    const productId = it.productId || it.id; // ✅ id Firestore
    const titulo = it.titulo || it.nombre || "-";
    const precio = Number(it.precio || 0);
    const cantidad = Number(it.cantidad || 1);
    return { productId, titulo, precio, cantidad, subtotal: precio * cantidad };
  });

  if (items.some((it) => !it.productId)) throw new Error("Producto inválido (sin id).");

  const total = items.reduce((sum, it) => sum + it.subtotal, 0);

  // ✅ validación stock antes de commit
  for (const it of items) {
    const pSnap = await getDoc(doc(db, "productos", it.productId));
    const stockActual = pSnap.exists() ? Number(pSnap.data()?.stock || 0) : 0;
    if (stockActual < it.cantidad) {
      throw new Error(`No hay stock suficiente para: ${it.titulo} (stock: ${stockActual})`);
    }
  }

  const batch = writeBatch(db);

  // venta
  const ventasRef = collection(db, "ventas");
  const ventaDocRef = doc(ventasRef);
  batch.set(ventaDocRef, {
    uid: user.uid,
    usuario: usuarioNombre,
    email,
    items,
    total,
    fecha: serverTimestamp(),
    estado: "pagado",
  });

  // descontar stock
  for (const it of items) {
    const pRef = doc(db, "productos", it.productId);
    const pSnap = await getDoc(pRef);
    const stockActual = pSnap.exists() ? Number(pSnap.data()?.stock || 0) : 0;
    batch.update(pRef, { stock: Math.max(stockActual - it.cantidad, 0) });
  }

  await batch.commit();
  return { ventaId: ventaDocRef.id, total };
}
