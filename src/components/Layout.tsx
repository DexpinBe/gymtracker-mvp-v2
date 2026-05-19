import { NavLink, Outlet } from 'react-router-dom';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'nav-link nav-link--active' : 'nav-link';

export default function Layout() {
  return (
    <div className="app">
      <header className="app-header">
        <p className="app-brand">GymTracker</p>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="app-nav" aria-label="Navegación principal">
        <NavLink to="/" end className={navLinkClass}>
          Inicio
        </NavLink>
        <NavLink to="/entrenamiento/nuevo" className={navLinkClass}>
          Nuevo entrenamiento
        </NavLink>
        <NavLink to="/historial" className={navLinkClass}>
          Historial
        </NavLink>
      </nav>
    </div>
  );
}
