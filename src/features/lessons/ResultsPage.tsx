import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, Check, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';
import { lessonById, activities } from '../../data/curriculum';
import { eligibleForCertificate, isUnlocked } from '../../engine/progression/progression';
import { exercisesFor, MODES } from '../../engine/scoring/rules';
import { solutionOf } from '../../engine/evaluators/evaluate';
import { useGameStore } from '../../store/gameStore';
export function ResultsPage() {
  const { lessonId = '' } = useParams();
  const state = useGameStore();
  const navigate = useNavigate();
  const lesson = lessonById[lessonId];
  const progress = state.progress[lessonId];
  const attempt = progress?.last;
  if (!state.player) return <Navigate to="/" replace />;
  if (state.active?.lessonId === lessonId) return <Navigate to={`/lesson/${lessonId}`} replace />;
  if (!lesson || !attempt)
    return (
      <div className="empty-state">
        <h1>Aún no hay resultados</h1>
        <Link className="button primary" to="/map">
          Volver al mapa
        </Link>
      </div>
    );
  const next = activities[activities.findIndex((l) => l.id === lessonId) + 1];
  const complete = eligibleForCertificate(state.progress);
  const exercises = exercisesFor(lesson, attempt.mode);
  const results = Object.values(attempt.results);
  const correct = results.filter((r) => r.correct).length;
  const errors = results.reduce((s, r) => s + r.errors, 0);
  return (
    <div className="results-page">
      <section className={`results-hero panel ${attempt.passed ? 'celebrate' : ''}`}>
        <div className={`result-medal ${attempt.passed ? 'passed' : ''}`}>
          {attempt.passed ? <Trophy size={42} /> : <RotateCcw size={42} />}
        </div>
        <p className="eyebrow">
          {attempt.abandoned
            ? 'INTENTO ABANDONADO'
            : attempt.passed
              ? 'MISIÓN CUMPLIDA'
              : 'CADA INTENTO TE ACERCA'}
        </p>
        <h1>
          {attempt.passed ? '¡Un paso más hacia tu futuro!' : 'Vuelve con una nueva estrategia'}
        </h1>
        <p>
          {lesson.title} · {MODES[attempt.mode].label}
        </p>
        <div className="result-stats">
          <div>
            <strong>{attempt.score}%</strong>
            <span>Calificación</span>
          </div>
          <div>
            <strong>+{attempt.xp}</strong>
            <span>XP obtenidos</span>
          </div>
          <div>
            <strong>
              {correct}/{exercises.length}
            </strong>
            <span>Correctas</span>
          </div>
          <div>
            <strong>{errors}</strong>
            <span>Errores</span>
          </div>
        </div>
        <p className="muted">
          Intento {progress.attempts} · Mejor calificación: {progress.bestScore}% ·{' '}
          {exercises.length - results.filter((r) => r.correct || r.errors > 0).length} sin responder
        </p>
        {progress.passed && !attempt.passed && (
          <p className="green">Tu aprobación anterior sigue vigente.</p>
        )}
        <div className="button-row">
          {complete && attempt.passed ? (
            <Link to="/final" className="button primary">
              Celebrar mi logro <Sparkles size={18} />
            </Link>
          ) : next && isUnlocked(next, state.progress) ? (
            <Link to={`/lesson/${next.id}`} className="button primary">
              Continuar al siguiente nivel <ArrowRight size={18} />
            </Link>
          ) : null}
          <button
            className="button secondary"
            onClick={() => {
              if (state.start(lessonId)) navigate(`/lesson/${lessonId}`);
              else if (state.active) navigate(`/lesson/${state.active.lessonId}`);
            }}
          >
            <RotateCcw size={16} />
            Repetir lección
          </button>
          <Link className="button ghost" to="/map">
            Volver al mapa
          </Link>
        </div>
      </section>
      <section className="review panel">
        <p className="eyebrow">APRENDER DEL CAMINO</p>
        <h2>Tu revisión de la misión</h2>
        <p>
          <strong>Competencia practicada:</strong> {lesson.title}.{' '}
          {attempt.passed
            ? 'Consolida lo aprendido explicando la solución con tus propias palabras.'
            : 'Repasa los ejercicios con errores y vuelve a intentarlo. Las vidas se renuevan en cada intento.'}
        </p>
        {exercises.map((e, i) => (
          <details key={e.id}>
            <summary>
              {attempt.results[e.id]?.correct ? (
                <Check className="green" size={18} />
              ) : (
                <X className="red" size={18} />
              )}
              <span>
                Ejercicio {i + 1} · {e.question.slice(0, 100)}
                {e.question.length > 100 ? '…' : ''}
              </span>
            </summary>
            <p>{e.explanation}</p>
            <strong>Solución de referencia para repasar</strong>
            <pre className="code-block">{solutionOf(e)}</pre>
            {e.type === 'code' && <p className="muted">Evaluada por reglas. No compilada.</p>}
          </details>
        ))}
      </section>
    </div>
  );
}
