const KEY = "carrito";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function clearCart() {
  localStorage.removeItem(KEY);
}
