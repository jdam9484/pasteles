import { useEffect, useMemo, useState } from "react";
import "./GestionProductos.css";

import { listenProductos, createProducto, updateProducto, deleteProducto } from "../../services/productosService";

import ProductosTable from "../../components/admin/Productos/ProductosTable.jsx";
import ProductoModal from "../../components/admin/productos/ProductoModal.jsx";

const initialForm = {
  nombre: "",
  descripcion: "",
  categoria: "Bebida",
  imagen: "",
  precio: "",
  stock: "",
};

export default function GestionProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar y filtrar
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [editId, setEditId] = useState(null);

  // Form
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  // Mensajes
  const [msg, setMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    const unsub = listenProductos(
      (data) => {
        setProductos(data);
        setLoading(false);
      },
      (err) => {
        setMsg({ text: err?.message || "Error al listar productos", type: "error" });
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const categoriasDisponibles = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria).filter(Boolean));
    return ["Todas", ...Array.from(set)];
  }, [productos]);

  const filtrados = useMemo(() => {
    const s = search.trim().toLowerCase();

    return productos.filter((p) => {
      const nombre = String(p.nombre || "").toLowerCase();
      const cat = String(p.categoria || "").toLowerCase();

      const matchSearch = !s || nombre.includes(s) || cat.includes(s);
      const matchCat = categoria === "Todas" || p.categoria === categoria;

      return matchSearch && matchCat;
    });
  }, [productos, search, categoria]);

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setMsg({ text: "", type: "" });
    setMode("create");
    setEditId(null);
    setForm(initialForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setMsg({ text: "", type: "" });
    setMode("edit");
    setEditId(p.id);
    setForm({
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      categoria: p.categoria || "Bebida",
      imagen: p.imagen || "",
      precio: p.precio ?? "",
      stock: p.stock ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSaving(false);
  };

  const validate = () => {
    if (!form.nombre.trim()) return "El nombre es obligatorio.";
    const precio = Number(form.precio);
    const stock = Number(form.stock);
    if (Number.isNaN(precio) || precio <= 0) return "El precio debe ser mayor a 0.";
    if (Number.isNaN(stock) || stock < 0) return "El stock debe ser 0 o mayor.";
    if (!form.categoria.trim()) return "La categoría es obligatoria.";
    return "";
  };

  const handleSave = async () => {
    setMsg({ text: "", type: "" });

    const err = validate();
    if (err) return setMsg({ text: err, type: "error" });

    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim(),
      categoria: form.categoria.trim(),
      imagen: form.imagen.trim(), // ideal: "/assets/imagen.jpg" si está en public/assets
      precio: Number(form.precio),
      stock: Number(form.stock),
    };

    try {
      setSaving(true);

      if (mode === "create") {
        await createProducto(payload);
        setMsg({ text: "Producto creado ✅", type: "ok" });
      } else {
        await updateProducto(editId, payload);
        setMsg({ text: "Producto actualizado ✅", type: "ok" });
      }

      closeModal();
    } catch (e) {
      setMsg({ text: e?.message || "Error guardando producto", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("¿Seguro que deseas eliminar este producto?");
    if (!ok) return;

    try {
      await deleteProducto(id);
      setMsg({ text: "Producto eliminado 🗑️", type: "ok" });
    } catch (e) {
      setMsg({ text: e?.message || "Error eliminando producto", type: "error" });
    }
  };

  return (
    <div className="gpPage">
      <div className="gpHeader">
        <div>
          <h2>Gestión de Productos</h2>
          <p>Tabla + Crear (popup) + Editar/Eliminar</p>
        </div>

        <button className="gpCreateBtn" type="button" onClick={openCreate}>
          + Crear producto
        </button>
      </div>

      <div className="gpTools">
        <input
          className="gpSearch"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
        />

        <select className="gpSelect" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {categoriasDisponibles.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {msg.text ? (
        <div className={`gpMsg ${msg.type === "ok" ? "ok" : "err"}`}>{msg.text}</div>
      ) : null}

      <ProductosTable
        loading={loading}
        productos={filtrados}
        onEdit={openEdit}
        onDelete={handleDelete}
      />

      <ProductoModal
        open={modalOpen}
        mode={mode}
        saving={saving}
        form={form}
        onChange={setField}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
