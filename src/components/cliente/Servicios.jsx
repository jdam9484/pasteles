import "./Servicios.css";

export default function Servicios() {
  return (
    <section className="breakfast container" id="servicios">
      <h2>Ven y disfruta los mejores sabores de Puerto Maldonado!</h2>
      <p>Horario 8 am - 8 pm</p>

      <div className="breakfast-content">
        <div className="breakfast-card">
          <img src="/assets/Torta_Selva_Negra.jpg" alt="Torta Selva Negra" />
          <h3>Tortas</h3>
        </div>

        <div className="breakfast-card">
          <img src="/assets/Postre_MussMara.jpg" alt="Postre MussMara" />
          <h3>Postres</h3>
        </div>

        <div className="breakfast-card">
          <img src="/assets/Bebidas_CocaInkaAgua.jpg" alt="Bebidas" />
          <h3>Bebidas</h3>
        </div>

        <div className="breakfast-card">
          <img src="/assets/Salado_PapaRellena.jpg" alt="Salado Papa Rellena" />
          <h3>Salados</h3>
        </div>
      </div>
    </section>
  );
}
