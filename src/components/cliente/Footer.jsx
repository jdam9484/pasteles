import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer" id="contacto">
      <div className="footer-content">
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
          <h3>Próximamente en estas plataformas!</h3>
          <div className="descarga">
            <img src="/assets/store1.png" alt="App Store" />
            <img src="/assets/store2.png" alt="Google Play" />
          </div>
        </div>
      </div>
    </footer>
  );
}
