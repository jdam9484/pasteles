import { db } from "../firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export function listenVentas(onChange, onError) {
  const q = query(collection(db, "ventas"), orderBy("fecha", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      onChange(arr);
    },
    (err) => {
      onError?.(err);
    }
  );
}
