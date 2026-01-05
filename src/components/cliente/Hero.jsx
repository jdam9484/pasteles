
import "./Hero.css";

export default function Hero() {
  return (
    <header className="header" id="inicio">
      <div className="header-content">
        <div className="header-txt">
          <h1>
            <span>Bienvenido </span>disfruta de nuestros platillos
          </h1>
          <p>
            En cada bocado descubrirás el secreto de nuestras recetas familiares. Utilizamos ingredientes frescos y naturales para crear postres que no solo endulzan el paladar, sino que celebran los momentos más especiales de tu vida. De nuestro horno a tu mesa, con todo el amor que te mereces.
          </p>
          <div className="actions">
            <a href="#" className="btn-1">Informacion</a>
            <form className="search-container" onSubmit={e => e.preventDefault()}>
              <input type="text" placeholder="Buscar torta..." />
              <div className="suggestions"></div>
            </form>
          </div>
        </div>
        <div className="header-img">
            <div style={{position: 'relative'}}>
              <img src="/assets/bg.png" alt="Fondo naranja" className="bg-hero" style={{position: 'absolute', top: '-120px', right: '-70px', width: '700px', height: '700px', zIndex: 1, pointerEvents: 'none'}} />
              <img src="/assets/sel_sf.png" alt="Torta" style={{position: 'relative', zIndex: 2}} />
            </div>
        </div>
      </div>
    </header>
  );
}
