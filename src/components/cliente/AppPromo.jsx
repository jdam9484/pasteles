import "./AppPromo.css";

export default function AppPromo() {
  return (
    <section className="app container">
      <div className="app-txt">
        <h2>Próximamente descubre nuestra nueva App!</h2>
        <p>
          Tu pedido con un solo toque y ofertas únicas. Secretitos online y mucho más.
        </p>
        <div className="descarga">
          <img src="/assets/store1.png" alt="" />
          <img src="/assets/store2.png" alt="" />
        </div>
      </div>

      <div className="app-img">
        <img src="/assets/app.png" alt="" />
      </div>
    </section>
  );
}
