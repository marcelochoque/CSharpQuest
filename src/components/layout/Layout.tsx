import { useEffect, useLayoutEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Braces, Map, UserRound, Award, Flame, Zap, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { xpTotals, playerLevel, MODES } from '../../engine/scoring/rules';
import { eligibleForCertificate, statistics, streak } from '../../engine/progression/progression';
import { storageNotice } from '../../store/persistence';
import { Avatar } from '../game/Avatar';
export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="C# Quest, inicio">
      <span className="logo-icon">
        <Braces size={23} />
      </span>
      <span>
        C# <b>QUEST</b>
        <small>EL CAMINO DEL PROGRAMADOR</small>
      </span>
    </Link>
  );
}
export function Layout() {
  const state = useGameStore();
  const { pathname } = useLocation();
  const xp = xpTotals(state.progress);
  const stats = statistics(state.progress);
  useEffect(() => {
    state.touch();
  }, []); // Track access once, never approval.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const main = document.getElementById('main');
    main?.focus({ preventScroll: true });
  }, [pathname]);
  const home = pathname === '/';
  return (
    <div className={home ? 'app home-layout' : 'app'}>
      <a
        className="skip-link"
        href="#main"
        onClick={(event) => {
          event.preventDefault();
          document.getElementById('main')?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className="topbar">
        <Logo />
        <div className="topbar-right">
          <span className="online-dot" />{' '}
          <span className="desktop-label">TU PRÓXIMO NIVEL EMPIEZA AQUÍ</span>
          {state.player && (
            <>
              <span className="top-stat gold">
                <Zap size={17} />
                {xp.total.toLocaleString()} <small>XP</small>
              </span>
              <Link to="/profile" className="profile-mini">
                <Avatar size={40} variant={state.player.avatar} />
                <span>{state.player.name.split(' ')[0]}</span>
              </Link>
            </>
          )}
        </div>
      </header>
      {!home && (
        <aside className="sidebar">
          <p className="eyebrow">TU AVENTURA</p>
          <nav aria-label="Navegación principal">
            <NavLink to="/map">
              <Map size={20} />
              Mapa de aprendizaje
            </NavLink>
            <NavLink to="/profile">
              <UserRound size={20} />
              Mi perfil
            </NavLink>
            <NavLink to="/achievements">
              <Award size={20} />
              Mis insignias
            </NavLink>
            {eligibleForCertificate(state.progress) && (
              <NavLink to="/certificate">
                <ShieldCheck size={20} />
                Mi certificado
              </NavLink>
            )}
          </nav>
          <div className="sidebar-player">
            <Avatar size={100} variant={state.player?.avatar} evolved={stats.worlds >= 5} />
            <strong>{playerLevel(xp.total)}</strong>
            <span>{stats.worlds} de 10 mundos conquistados</span>
            <div className="progress-track">
              <div style={{ width: `${stats.percent}%` }} />
            </div>
            <Link to="/profile">
              Ver mi progreso <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="sidebar-bottom">
            <span>
              <Flame size={18} />
              {streak(state.activityDates)} días de racha
            </span>
            <small>{state.player ? MODES[state.player.mode].label : 'Aprende a tu ritmo'}</small>
          </div>
        </aside>
      )}
      <main id="main" tabIndex={-1} className={home ? 'home-main' : 'main-content'}>
        {storageNotice && (
          <div role="status" className="notice">
            {storageNotice}
          </div>
        )}
        <Outlet />
      </main>
      {!home && (
        <footer className="footer">
          C# Quest <span>Escribe código. Construye tu camino.</span>
          <span>Progreso guardado en este navegador</span>
        </footer>
      )}
    </div>
  );
}
