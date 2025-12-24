import { useEffect, useState } from "react";
import "./InfoSlider.css";

const SLIDES = [
  "/assets/Postre_CremaVol.jpg",
  "/assets/Personalizado_Manza.JPG",
  "/assets/Bebidas_MosterCerveza.jpg",
  "/assets/Torta_Helada.jpg",
  "/assets/Torta_Selva_Negra.jpg",
];

export default function InfoSlider() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % SLIDES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="info">
      <img className="bg-2" src="/assets/bg-2.png" alt="" />

      <div className="info-content container">
        <div className="info-img">
          <img src={SLIDES[idx]} alt="Destacado" />
        </div>

        <div className="info-txt">
          <h2>La mejor calidad en todos los productos.</h2>
          <p>
            Puedes pedir con anticipación y recoger o solicitar delivery.
            También hacemos personalizados para eventos especiales.
          </p>
          <a href="#productos" className="btn-animado">Realizar pedido</a>
        </div>
      </div>
    </section>
  );
}
