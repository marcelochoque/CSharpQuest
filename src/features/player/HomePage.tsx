import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Terminal, Shield, Swords, Code2, Sparkles, Check } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { MODES } from '../../engine/scoring/rules';
import type { Mode } from '../../types/game';
import { Avatar } from '../../components/game/Avatar';
export function HomePage() {
  const state = useGameStore();
  const navigate = useNavigate();
  const [starting, setStarting] = useState(false);
  const [name, setName] = useState('');
  const [mode, setMode] = useState<Mode>('apprentice');
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="pill">
            <span className="online-dot" /> TU AVENTURA EN EL CÓDIGO
          </div>
          <h1>
            No solo aprendas.
            <br />
            <span>
              Conviértete en
              <br />
              el arquitecto.
            </span>
          </h1>
          <p className="hero-subtitle">El camino del programador orientado a objetos</p>
          <p className="hero-description">
            De tu primera línea en C# a diseñar tu propio universo. Conquista mundos, resuelve
            desafíos y construye habilidades que van más allá de memorizar.
          </p>
          {state.player ? (
            <Link className="button primary large" to="/map">
              Continuar aventura <ArrowRight size={20} />
            </Link>
          ) : !starting ? (
            <button className="button primary large" onClick={() => setStarting(true)}>
              Comenzar aventura <ArrowRight size={20} />
            </button>
          ) : (
            <form
              className="start-form panel"
              onSubmit={(e) => {
                e.preventDefault();
                state.createPlayer(name, mode);
                navigate('/map');
              }}
            >
              <label htmlFor="player-name">¿Cómo te llamas, aprendiz?</label>
              <input
                id="player-name"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={80}
                placeholder="Tu nombre"
              />
              <label htmlFor="start-mode">Elige tu desafío</label>
              <select
                id="start-mode"
                value={mode}
                onChange={(e) => setMode(e.target.value as Mode)}
              >
                {Object.entries(MODES).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.description}
                  </option>
                ))}
              </select>
              <button className="button primary" disabled={!name.trim()}>
                Entrar al mundo <ArrowRight size={18} />
              </button>
            </form>
          )}
          <div className="hero-footnote">
            <Check size={15} /> A tu ritmo <span>·</span> Sin cuentas <span>·</span> Gratis, de
            principio a fin
          </div>
          <div className="hero-counts">
            <div>
              <strong>10</strong>
              <span>mundos por descubrir</span>
            </div>
            <div>
              <strong>60</strong>
              <span>lecciones prácticas</span>
            </div>
            <div>
              <strong>01</strong>
              <span>gran transformación</span>
            </div>
          </div>
        </div>
        <div
          className="hero-art"
          aria-label="Ilustración de un aprendiz digital construyendo su mundo"
        >
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <span className="art-star star-one">+</span>
          <span className="art-star star-two">+</span>
          <div className="floating-tag tag-one">
            <Shield size={18} /> APRENDIZ NIVEL 01
          </div>
          <div className="hero-platform">
            <Avatar size={280} />
          </div>
          <div className="floating-tag tag-two">
            <Sparkles size={18} /> + NUEVA HABILIDAD
          </div>
          <div className="code-window">
            <div className="window-bar">
              <i />
              <i />
              <i />
              <span>TuPrimeraAventura.cs</span>
              <Code2 size={15} />
            </div>
            <pre>
              <span className="code-purple">public class</span>{' '}
              <span className="code-blue">TuFuturo</span>
              {'\n{\n    '}
              <span className="code-purple">public void</span> Comenzar(){'\n    {\n        '}
              <span className="code-muted">// Cada línea cuenta.</span>
              {'\n        '}Aprender();{'\n        '}Construir();{'\n        '}Evolucionar();
              {'\n    }\n}'}
            </pre>
            <div className="terminal-status">
              <span className="online-dot" /> Listo para una nueva aventura<span>C#</span>
            </div>
          </div>
        </div>
      </section>
      <section className="home-features">
        <article>
          <Terminal />
          <h2>Aprende haciendo</h2>
          <p>Escribe, predice y depura código. Comprende lo que ocurre en cada paso.</p>
        </article>
        <article>
          <Swords />
          <h2>Demuestra tu dominio</h2>
          <p>Diez jefes ponen a prueba lo aprendido en un sistema RPG que crece contigo.</p>
        </article>
        <article>
          <AwardIcon />
          <h2>Haz visible tu logro</h2>
          <p>Supera el integrador y desbloquea tu certificado de finalización.</p>
        </article>
      </section>
      <div className="home-bottom">
        DISEÑADO PARA MENTES CURIOSAS{' '}
        <span>De los fundamentos a la programación orientada a objetos.</span>
      </div>
    </>
  );
}
function AwardIcon() {
  return <Shield />;
}
