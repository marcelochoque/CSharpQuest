import { useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Award, Download, Flame, RotateCcw, Upload, Zap, Check } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { achievementDefinitions, statistics, streak } from '../../engine/progression/progression';
import { MODES, playerLevel, xpTotals } from '../../engine/scoring/rules';
import { exportData, parseImport, SAVE_KEY } from '../../store/persistence';
import { downloadBlob } from '../../utils/download';
import { Avatar } from '../../components/game/Avatar';
import type { Mode } from '../../types/game';
export function ProfilePage() {
  const state = useGameStore();
  const file = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(state.player?.name ?? '');
  const [mode, setMode] = useState<Mode>(state.player?.mode ?? 'apprentice');
  const [avatar, setAvatar] = useState(state.player?.avatar ?? 'azure');
  if (!state.player) return <Navigate to="/" replace />;
  const stats = statistics(state.progress);
  const xp = xpTotals(state.progress);
  const earned = achievementDefinitions.filter((a) => a.test(state.progress));
  async function importFile(selected?: File) {
    if (!selected) return;
    try {
      if (selected.size > 5_000_000) throw new Error('El archivo supera los 5 MB.');
      const raw = await selected.text();
      const data = parseImport(raw);
      if (
        !window.confirm(
          `¿Reemplazar el progreso actual por el de ${data.player?.name ?? 'un perfil vacío'}? Exporta antes una copia si quieres conservarlo.`,
        )
      )
        return;
      state.importProgress(raw);
      setName(data.player?.name ?? '');
      setMode(data.player?.mode ?? 'apprentice');
      setAvatar(data.player?.avatar ?? 'azure');
      setMessage('Progreso importado correctamente.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo importar el archivo.');
    } finally {
      if (file.current) file.current.value = '';
    }
  }
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">TU HISTORIA EN CÓDIGO</p>
          <h1>Un aprendiz. Muchas posibilidades.</h1>
          <p>Todo lo que has aprendido, en un solo lugar.</p>
        </div>
      </div>
      <div className="profile-hero panel">
        <Avatar size={160} variant={state.player.avatar} evolved={stats.worlds >= 5} />
        <div>
          <span className="pill">{playerLevel(xp.total)}</span>
          <h2>{state.player.name}</h2>
          <p>En la aventura desde {new Date(state.player.startedAt).toLocaleDateString('es-BO')}</p>
          <div className="inline-stats">
            <span className="gold">
              <Zap size={17} />
              {xp.total} XP
            </span>
            <span>
              <Flame size={17} />
              {streak(state.activityDates)} días de racha
            </span>
            <span>
              <Award size={17} />
              {earned.length} insignias
            </span>
          </div>
        </div>
      </div>
      <div className="stat-grid">
        <div className="panel">
          <strong>{stats.lessons}/60</strong>
          <span>Lecciones aprobadas</span>
        </div>
        <div className="panel">
          <strong>{stats.worlds}/10</strong>
          <span>Mundos conquistados</span>
        </div>
        <div className="panel">
          <strong>{stats.percent}%</strong>
          <span>Progreso total</span>
        </div>
        <div className="panel">
          <strong>{stats.errors}</strong>
          <span>Errores registrados</span>
        </div>
      </div>
      <div className="profile-grid">
        <section className="panel topic-stats">
          <h2>Tus competencias</h2>
          <p className="muted">
            Promedio de las mejores puntuaciones de cada mundo; las actividades pendientes cuentan
            como cero.
          </p>
          {stats.themes.map((t) => (
            <div key={t.id}>
              <div>
                <span>{t.theme}</span>
                <strong>{t.score}%</strong>
              </div>
              <div className="progress-track">
                <div style={{ width: `${t.score}%`, background: t.color }} />
              </div>
              {t.score >= 95 && <small className="green">Competencia dominada</small>}
            </div>
          ))}
          <p className="xp-breakdown">
            XP de dominio: <strong>{xp.mastery}</strong> · XP de hitos:{' '}
            <strong>{xp.general}</strong>
          </p>
        </section>
        <div className="settings-column">
          <section className="panel settings">
            <h2>Personaliza tu aventura</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                state.updatePlayer(name, mode, avatar);
                setMessage(
                  'Perfil actualizado. La dificultad se aplicará al próximo intento; el certificado conserva su nombre hasta que lo edites explícitamente.',
                );
              }}
            >
              <label>
                Nombre del estudiante
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={80}
                />
              </label>
              <label>
                Dificultad
                <select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
                  {Object.entries(MODES).map(([key, m]) => (
                    <option key={key} value={key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </label>
              <p className="muted">
                {MODES[mode].description}. {MODES[mode].hints} pistas por intento.{' '}
                {mode !== 'apprentice' &&
                  `Cada error resta ${MODES[mode].penalty} puntos adicionales.`}
              </p>
              <fieldset className="avatar-picker">
                <legend>Color de tu avatar</legend>
                {[
                  ['azure', 'Azul'],
                  ['violet', 'Violeta'],
                  ['emerald', 'Esmeralda'],
                ].map(([value, label]) => (
                  <label key={value}>
                    <input
                      type="radio"
                      name="avatar"
                      checked={avatar === value}
                      onChange={() => setAvatar(value)}
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              <button className="button primary" disabled={!name.trim()}>
                <Check size={16} />
                Guardar preferencias
              </button>
            </form>
          </section>
          <section className="panel settings">
            <h2>Tu progreso te pertenece</h2>
            <p>
              Se guarda en este navegador. Exporta una copia para trasladarlo a otro dispositivo o
              conservarlo antes de borrar los datos del navegador.
            </p>
            <div className="button-stack">
              <button
                className="button secondary"
                onClick={() =>
                  downloadBlob(
                    new Blob([exportData(state)], { type: 'application/json' }),
                    'CSharpQuest_Progreso.json',
                  )
                }
              >
                <Download size={17} />
                Exportar progreso
              </button>
              <button className="button secondary" onClick={() => file.current?.click()}>
                <Upload size={17} />
                Importar progreso
              </button>
              <input
                className="sr-only"
                type="file"
                accept=".json,application/json"
                ref={file}
                aria-label="Importar archivo de progreso JSON"
                onChange={(e) => void importFile(e.target.files?.[0])}
              />
              <button
                className="text-button"
                onClick={() => {
                  try {
                    const raw = localStorage.getItem(`${SAVE_KEY}-recovery`);
                    if (!raw) {
                      setMessage('No hay una copia de recuperación guardada.');
                      return;
                    }
                    downloadBlob(
                      new Blob([raw], { type: 'application/json' }),
                      'CSharpQuest_Recuperacion.json',
                    );
                  } catch {
                    setMessage('No se pudo leer el almacenamiento.');
                  }
                }}
              >
                Descargar copia de recuperación
              </button>
              <button
                className="button danger"
                onClick={() => {
                  if (
                    window.confirm(
                      '¿Reiniciar todo el progreso y eliminar el certificado de este perfil? Esta acción no se puede deshacer. Exporta primero una copia.',
                    )
                  )
                    state.reset();
                }}
              >
                <RotateCcw size={16} />
                Reiniciar progreso
              </button>
            </div>
          </section>
        </div>
      </div>
      {message && (
        <div role="status" className="toast">
          <span>{message}</span>
          <button aria-label="Cerrar mensaje" onClick={() => setMessage('')}>
            ×
          </button>
        </div>
      )}
    </>
  );
}
export function AchievementsPage() {
  const state = useGameStore();
  if (!state.player) return <Navigate to="/" replace />;
  const count = achievementDefinitions.filter((a) => a.test(state.progress)).length;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">HISTORIAS QUE MERECEN UNA INSIGNIA</p>
          <h1>Tu colección de logros</h1>
          <p>
            {count} de {achievementDefinitions.length} insignias desbloqueadas.
          </p>
        </div>
      </div>
      <div className="badge-grid">
        {achievementDefinitions.map((a) => {
          const earned = a.test(state.progress);
          return (
            <article className={`panel badge-card ${earned ? 'earned' : 'unearned'}`} key={a.id}>
              <div className="badge-art">
                <Award size={54} />
              </div>
              <span className="eyebrow">{earned ? 'CONSEGUIDA' : 'POR DESCUBRIR'}</span>
              <h2>{a.title}</h2>
              <p>{a.description}</p>
              {earned && (
                <span className="green">
                  <Check size={16} />
                  Misión cumplida
                </span>
              )}
            </article>
          );
        })}
      </div>
      <Link className="button primary" to="/map">
        Continuar mi aventura
      </Link>
    </>
  );
}
