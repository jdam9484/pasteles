import React from "react";
import "./AppPromo.css";

export default function AppPromo() {
  return (
    <section className="app-promo container">
      <div className="app-txt">
        <h2>Próximamente descubre nuestra nueva App!</h2>
        <p>
          Se vienen tiempos brillantes descargando la futura App.<br/>
          Tu pedido con un solo toque y ofertas únicas.<br/>
          Secretitos online y mucho más.
        </p>
        <div className="descarga">
          <img src="/assets/store1.png" alt="App Store" />
          <img src="/assets/store2.png" alt="Google Play" />
        </div>
      </div>
      <div className="app-img">
        <img src="/assets/app.png" alt="App preview" />
      </div>
    </section>
  );
}
