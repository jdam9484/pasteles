import React, { useEffect, useState } from "react";
import "./InfoBanner.css";

// Puedes cambiar las rutas de las imágenes aquí
const images = [
  "public/assets/Postre_CremaVol.jpg",
  "public/assets/Personalizado_Manza.JPG",
  "public/assets/Bebidas_MosterCerveza.jpg",
  "public/assets/Torta_Helada.jpg",
  "public/assets/Torta_Selva_Negra.jpg",
];

export default function InfoBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="info-banner" >
      <img src="/assets/bg-2.png" alt="Decoración" className="bg-2" style={{position: 'absolute', left: '-120px', top: '-80px', width: '420px', maxWidth: '40vw', zIndex: -1, pointerEvents: 'none'}}/>
      <div className="info-img">
        {images.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`slide-${idx}`}
            className={`slide${current === idx ? " active" : ""}`}
          />
        ))}
      </div>
      <div className="info-txt">
        <h2>La mejor calidad en todos los productos.</h2>
        <p>
          Puede realizar su pedido con anticipación y recogerlo en la tienda o solicitar la entrega a domicilio.
          Ofrecemos opciones personalizadas para eventos especiales como cumpleaños, bodas y reuniones corporativas.
        </p>
        <a href="#" className="btn-animado">Realizar pedido</a>
      </div>
    </div>
  );
}
