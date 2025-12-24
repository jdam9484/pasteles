import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-content container">
        <div className="link">
          <h3>Sobre Nosotros</h3>
          <ul>
            <li><a href="#">Trabaja con Nosotros</a></li>
            <li><a href="#">Nuestros Valores</a></li>
            <li><a href="#">Prensa y Noticias</a></li>
            <li><a href="#">Responsabilidad Social</a></li>
          </ul>
        </div>

        <div className="link">
          <h3>Preguntas Frecuentes (FAQ)</h3>
          <ul>
            <li><a href="#">Contáctanos</a></li>
            <li><a href="#">Términos y Condiciones</a></li>
            <li><a href="#">Política de Privacidad</a></li>
            <li><a href="#">Libro de Reclamaciones</a></li>
          </ul>
        </div>

        <div className="link">
          <h3>Menú Completo</h3>
          <ul>
            <li><a href="#">Servicio de Catering</a></li>
            <li><a href="#">Localiza Nuestras Sucursales</a></li>
            <li><a href="#">Programa de Lealtad</a></li>
            <li><a href="#">Platos de Temporada</a></li>
          </ul>
        </div>

        <div className="link">
          <h3>Próximamente en estas plataformas!</h3>
          <div className="descarga">
            <img src="/assets/store1.png" alt="" />
            <img src="/assets/store2.png" alt="" />
          </div>
        </div>
      </div>
    </footer>
  );
}
