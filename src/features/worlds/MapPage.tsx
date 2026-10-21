import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Code2,
  Crown,
  Flag,
  LockKeyhole,
  Play,
  Sparkles,
  Star,
  Swords,
  Target,
  Zap,
  BookOpen,
  RotateCcw,
} from 'lucide-react';
import { worlds } from '../../data/worlds';
import { activities, lessonById } from '../../data/curriculum';
import {
  currentLesson,
  isUnlocked,
  nodeStatus,
  statistics,
} from '../../engine/progression/progression';
import { MODES, xpTotals } from '../../engine/scoring/rules';
import { useGameStore } from '../../store/gameStore';
import { Avatar } from '../../components/game/Avatar';
const labels = {
  locked: 'Bloqueado',
  available: 'Disponible',
  'in-progress': 'En progreso',
  completed: 'Completado',
  mastered: 'Dominado',
};
export function MapPage() {
  const state = useGameStore();
  const { worldId } = useParams();
  const navigate = useNavigate();
  const current = currentLesson(state.progress);
  const remembered = lessonById[state.lastLesson];
  const initial = remembered && isUnlocked(remembered, state.progress) ? remembered : current;
  const [selected, setSelected] = useState(initial.id);
  const activeRef = useRef<HTMLButtonElement>(null);
  const selectedLesson = lessonById[selected] ?? current;
  const stats = statistics(state.progress);
  const shownWorlds = worldId ? worlds.filter((w) => w.id === Number(worldId)) : worlds;
  useEffect(() => {
    if (!worldId && current.id !== 'L01')
      activeRef.current?.scrollIntoView({ block: 'center', behavior: 'instant' });
  }, []);
  if (!state.player) return <Navigate to="/" replace />;
  if (!shownWorlds.length)
    return (
      <div className="empty-state">
        <h1>Mundo no encontrado</h1>
        <Link to="/map" className="button primary">
          Volver al mapa
        </Link>
      </div>
    );
  function begin() {
    if (state.start(selectedLesson.id)) navigate(`/lesson/${selectedLesson.id}`);
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">EL CAMINO DEL PROGRAMADOR</p>
          <h1>
            Tu próxima gran idea
            <br className="mobile-break" /> empieza aquí.
          </h1>
          <p>Una lección a la vez. Un mundo de posibilidades.</p>
        </div>
        <Link to="/profile" className="mode-chip">
          <ShieldIcon />
          {MODES[state.player.mode].label}
          <ChevronRight size={14} />
        </Link>
      </div>
      <div className="map-layout">
        <div className="map-main">
          <section className="journey-summary panel">
            <div className="summary-icon">
              <Flag size={22} />
            </div>
            <div>
              <strong>Tu viaje a arquitecto</strong>
              <p>{stats.completed} de 71 actividades completadas</p>
            </div>
            <strong className="blue">{stats.percent}%</strong>
            <div className="progress-track">
              <div style={{ width: `${stats.percent}%` }} />
            </div>
          </section>
          {shownWorlds.map((world) => {
            const group = activities.filter((l) => l.worldId === world.id);
            const completed = group.filter((l) => state.progress[l.id]?.passed).length;
            return (
              <section
                key={world.id}
                id={`world-${world.id}`}
                className="world-section"
                style={{ '--world-color': world.color } as CSSProperties}
              >
                <div className="world-banner">
                  <div>
                    <p className="eyebrow">
                      MUNDO {String(world.id).padStart(2, '0')} <span>· {world.theme}</span>
                    </p>
                    <h2>{world.title}</h2>
                    <p>{world.description}</p>
                    <span className="world-progress">
                      <BookOpen size={14} />
                      {completed}/{group.length} actividades <span>·</span>
                      {completed === group.length
                        ? 'Mundo conquistado'
                        : 'Construye tu próximo logro'}
                    </span>
                  </div>
                  <div className="world-emblem" aria-hidden="true">
                    {world.symbol}
                  </div>
                </div>
                <div className="learning-path">
                  {group.map((lesson, index) => {
                    const status = nodeStatus(lesson, state);
                    const boss = lesson.kind !== 'lesson';
                    const isCurrent = current.id === lesson.id;
                    const Icon =
                      status === 'locked'
                        ? LockKeyhole
                        : status === 'mastered'
                          ? Star
                          : status === 'completed'
                            ? Check
                            : boss
                              ? Swords
                              : status === 'in-progress'
                                ? RotateCcw
                                : Code2;
                    return (
                      <div
                        key={lesson.id}
                        className={`path-step step-${index % 4} ${boss ? 'boss-step' : ''}`}
                      >
                        <div className="path-connector" />
                        {isCurrent && <div className="current-label">TU PRÓXIMA MISIÓN</div>}
                        <button
                          ref={isCurrent ? activeRef : undefined}
                          className={`lesson-node ${status} ${boss ? 'boss-node' : ''} ${selected === lesson.id ? 'selected' : ''}`}
                          disabled={status === 'locked'}
                          aria-label={`${lesson.title}: ${labels[status]}`}
                          aria-pressed={selected === lesson.id}
                          onClick={() => {
                            setSelected(lesson.id);
                            if (window.matchMedia('(max-width: 760px)').matches)
                              document
                                .querySelector('.mission-card')
                                ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
                          }}
                        >
                          <Icon size={28} />
                          {(status === 'completed' || status === 'mastered') && (
                            <span className="node-check">
                              <Check size={10} />
                            </span>
                          )}
                        </button>
                        <span className="node-title">{lesson.title}</span>
                        <small>
                          {boss
                            ? lesson.kind === 'final'
                              ? 'DESAFÍO INTEGRADOR'
                              : 'JEFE FINAL'
                            : `LECCIÓN ${lesson.order}`}{' '}
                          {status === 'locked' ? '· Bloqueada' : ''}
                        </small>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
        <aside className="map-aside">
          <div className="mission-card panel" aria-live="polite">
            <div className="mission-top">
              <span>
                <Target size={16} /> TU MISIÓN
              </span>
              <span className="pill small">
                {selectedLesson.kind === 'lesson' ? 'LECCIÓN' : 'DESAFÍO'}
              </span>
            </div>
            <span className="mission-world">
              Mundo {selectedLesson.worldId} · {worlds[selectedLesson.worldId - 1].theme}
            </span>
            <h2>{selectedLesson.title}</h2>
            <p>{selectedLesson.description}</p>
            <div className="mission-meta">
              <span>
                <Zap size={16} /> +{selectedLesson.reward} XP base
              </span>
              <span>
                <Star size={15} />
                Dificultad {selectedLesson.difficulty}/5
              </span>
            </div>
            <details>
              <summary>Objetivo de aprendizaje</summary>
              <p>{selectedLesson.objective}</p>
            </details>
            {state.active && state.active.lessonId !== selectedLesson.id ? (
              <Link className="button primary full" to={`/lesson/${state.active.lessonId}`}>
                Reanudar lección pendiente <ArrowRight size={17} />
              </Link>
            ) : (
              <button onClick={begin} className="button primary full">
                {state.active
                  ? 'Reanudar lección'
                  : state.progress[selected]?.passed
                    ? 'Practicar de nuevo'
                    : 'Iniciar lección'}
                <Play size={16} fill="currentColor" />
              </button>
            )}
            <small className="muted">
              Las repeticiones mejoran tu dominio. Los XP tienen un límite por ejercicio.
            </small>
          </div>
          <div className="mentor-card panel">
            <Avatar size={90} variant={state.player.avatar} evolved={stats.worlds >= 5} />
            <div>
              <h3>El poder está en practicar</h3>
              <p>Entender un error también es avanzar. Vuelve a intentarlo.</p>
            </div>
          </div>
          <div className="world-index panel">
            <h3>
              Explora los mundos <Sparkles size={16} />
            </h3>
            {worlds.map((w) => (
              <Link
                className={current.worldId === w.id ? 'current' : ''}
                key={w.id}
                to={`/world/${w.id}`}
              >
                <span style={{ color: w.color }}>{String(w.id).padStart(2, '0')}</span>
                {w.title}
                {state.progress[`B${w.id}`]?.passed ? (
                  <Check size={14} />
                ) : w.id > current.worldId ? (
                  <LockKeyhole size={13} />
                ) : (
                  <ChevronRight size={14} />
                )}
              </Link>
            ))}
            {worldId && (
              <Link to="/map">
                Ver el camino completo <ArrowRight size={15} />
              </Link>
            )}
          </div>
          <div className="xp-note">
            <Zap size={16} />
            {xpTotals(state.progress).total.toLocaleString()} XP de experiencia acumulada
          </div>
        </aside>
      </div>
    </>
  );
}
function ShieldIcon() {
  return <Crown size={16} />;
}
