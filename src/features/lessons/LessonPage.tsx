import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, BookOpen, Check, Heart, Lightbulb, RotateCcw, X, Zap } from 'lucide-react';
import { lessonById } from '../../data/curriculum';
import { worlds } from '../../data/worlds';
import { isUnlocked } from '../../engine/progression/progression';
import { calculateScore, exercisesFor, MODES } from '../../engine/scoring/rules';
import { evaluate } from '../../engine/evaluators/evaluate';
import { useGameStore } from '../../store/gameStore';
import type { Answer, Exercise } from '../../types/game';
import { ExerciseInput, initialAnswer, answerReady } from '../exercises/ExerciseInput';
const typeLabels = {
  choice: 'Elige tu respuesta',
  fill: 'Completa el código',
  predict: 'Predice el resultado',
  debug: 'Encuentra el error',
  order: 'Ordena el código',
  code: 'Laboratorio de código',
  design: 'Diseña la solución',
};
export function LessonPage() {
  const { lessonId = '' } = useParams();
  const state = useGameStore();
  const navigate = useNavigate();
  const lesson = lessonById[lessonId];
  if (!state.player) return <Navigate to="/" replace />;
  if (!lesson)
    return (
      <div className="empty-state">
        <h1>Lección no encontrada</h1>
        <Link to="/map">Volver al mapa</Link>
      </div>
    );
  if (!isUnlocked(lesson, state.progress))
    return (
      <div className="empty-state">
        <h1>Aún queda camino por recorrer</h1>
        <p>Aprueba las actividades anteriores para desbloquear esta misión.</p>
        <Link className="button primary" to="/map">
          Volver al mapa
        </Link>
      </div>
    );
  if (state.active && state.active.lessonId !== lessonId)
    return (
      <div className="empty-state">
        <h1>Tienes una misión en curso</h1>
        <Link className="button primary" to={`/lesson/${state.active.lessonId}`}>
          Reanudar la lección pendiente
        </Link>
      </div>
    );
  if (!state.active)
    return (
      <div className="lesson-intro panel">
        <p className="eyebrow">
          MUNDO {lesson.worldId} · {MODES[state.player.mode].label}
        </p>
        <h1>{lesson.title}</h1>
        <p>{lesson.description}</p>
        <p>
          {exercisesFor(lesson, state.player.mode).length} ejercicios ·{' '}
          {MODES[state.player.mode].lives} vidas · {MODES[state.player.mode].threshold}% para
          aprobar
        </p>
        <button className="button primary" onClick={() => state.start(lesson.id)}>
          Iniciar lección <ArrowRight size={18} />
        </button>
        <Link className="button secondary" to="/map">
          Volver al mapa
        </Link>
      </div>
    );
  const attempt = state.active;
  const exercises = exercisesFor(lesson, attempt.mode);
  const exercise = exercises[attempt.index];
  function goNext() {
    state.next();
    if (!useGameStore.getState().active) navigate(`/lesson/${lessonId}/results`);
  }
  function submit(answer: Answer) {
    state.submit(answer);
    if (!useGameStore.getState().active) navigate(`/lesson/${lessonId}/results`);
  }
  return (
    <div className="lesson-shell">
      <div className="lesson-top">
        <button
          className="icon-button"
          aria-label="Abandonar lección"
          onClick={() => {
            if (
              window.confirm(
                '¿Abandonar este intento? Se registrará el resultado y podrás volver a intentarlo con vidas nuevas.',
              )
            ) {
              state.abandon();
              navigate(`/lesson/${lessonId}/results`);
            }
          }}
        >
          <X />
        </button>
        <div>
          <p className="eyebrow">
            MUNDO {lesson.worldId} · {worlds[lesson.worldId - 1].theme}
          </p>
          <h1>{lesson.title}</h1>
        </div>
        <div className="lives" aria-label={`${attempt.lives} vidas restantes`}>
          <Heart size={20} fill="currentColor" />
          {attempt.lives}
        </div>
      </div>
      <div className="exercise-progress">
        <div className="progress-track">
          <div style={{ width: `${(attempt.index / exercises.length) * 100}%` }} />
        </div>
        <span>
          {attempt.index + 1} / {exercises.length}
        </span>
      </div>
      <div className="lesson-meta">
        <span>
          {MODES[attempt.mode].label} · aprobación ≥ {MODES[attempt.mode].threshold}%
        </span>
        <span>
          <Zap size={14} />
          {lesson.reward} XP base · {calculateScore(attempt, lesson)} puntos actuales
        </span>
      </div>
      <ExerciseStep
        key={`${attempt.id}-${exercise.id}`}
        exercise={exercise}
        onSubmit={submit}
        onNext={goNext}
      />
    </div>
  );
}
function ExerciseStep({
  exercise,
  onSubmit,
  onNext,
}: {
  exercise: Exercise;
  onSubmit: (answer: Answer) => void;
  onNext: () => void;
}) {
  const state = useGameStore();
  const attempt = state.active!;
  const result = attempt.results[exercise.id];
  const [answer, setAnswer] = useState<Answer>(
    attempt.draft ??
      (result?.answer && (Array.isArray(result.answer) || result.answer.length)
        ? result.answer
        : initialAnswer(exercise)),
  );
  const feedback = attempt.checked && result ? evaluate(exercise, result.answer) : null;
  const hintsLeft = MODES[attempt.mode].hints - attempt.hintsUsed;
  useEffect(() => {
    document.getElementById('exercise-title')?.focus();
  }, [exercise.id]);
  return (
    <section className="exercise-card panel">
      <div className="exercise-category">
        <BookOpen size={17} />
        {typeLabels[exercise.type]}
      </div>
      <h2 id="exercise-title" tabIndex={-1}>
        {exercise.question}
      </h2>
      {attempt.mode === 'apprentice' && (
        <details className="theory">
          <summary>Antes de comenzar: repasa el concepto</summary>
          <p>{lessonById[attempt.lessonId].description}</p>
        </details>
      )}
      <ExerciseInput
        exercise={exercise}
        answer={answer}
        onChange={(value) => {
          setAnswer(value);
          state.saveDraft(value);
        }}
        disabled={attempt.checked}
      />
      {result?.hints > 0 && (
        <div className="hint-box">
          <Lightbulb size={18} />
          <p>{exercise.hint}</p>
        </div>
      )}
      {feedback && (
        <div role="status" className={`feedback ${feedback.correct ? 'success' : 'failure'}`}>
          <strong>
            {feedback.correct ? <Check size={20} /> : <X size={20} />}{' '}
            {feedback.correct
              ? '¡Buen trabajo! Sigues avanzando.'
              : 'Todavía no. Revisa tu razonamiento.'}
          </strong>
          {feedback.correct && attempt.mode !== 'expert' ? (
            <p>{exercise.explanation}</p>
          ) : !feedback.correct ? (
            <p>
              Perdiste una vida. Revisa los requisitos y los casos límite. Puedes corregir tu
              respuesta o continuar sin los puntos de este ejercicio.
            </p>
          ) : (
            <p>
              Contrato satisfecho. Podrás consultar la explicación completa al terminar el intento.
            </p>
          )}
          {feedback.method === 'rules' && (
            <ul>
              {feedback.checks.map((c) => (
                <li key={c.label}>
                  {c.passed ? '✓' : '×'} {c.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="exercise-actions">
        <button
          className="button ghost"
          disabled={hintsLeft <= 0 || attempt.checked || !!result?.hints}
          onClick={state.hint}
        >
          <Lightbulb size={18} />
          Pista ({hintsLeft})
        </button>
        <div>
          {!attempt.checked ? (
            <button
              className="button primary"
              disabled={!answerReady(exercise, answer)}
              onClick={() => onSubmit(answer)}
            >
              Comprobar <Check size={18} />
            </button>
          ) : (
            <>
              {!result?.correct && (
                <button className="button secondary" onClick={state.retry}>
                  <RotateCcw size={16} />
                  Reintentar
                </button>
              )}
              <button className="button primary" onClick={onNext}>
                Continuar <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
