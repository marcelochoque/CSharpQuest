import { lazy, Suspense } from 'react';
import { ArrowDown, ArrowUp, GripVertical } from 'lucide-react';
import type { Answer, Exercise } from '../../types/game';
const CodeEditor = lazy(() => import('./CodeEditor').then((m) => ({ default: m.CodeEditor })));
export function initialAnswer(e: Exercise): Answer {
  if (e.type === 'order') return [...e.lines];
  if (e.type === 'fill') return e.blanks.map(() => '');
  if (e.type === 'design') return e.decisions.map(() => '');
  if (e.type === 'code') return e.starter;
  return '';
}
export function answerReady(e: Exercise, answer: Answer) {
  return (
    e.type === 'order' ||
    (Array.isArray(answer) ? answer.every((a) => a.trim()) : answer.trim().length > 0)
  );
}
export function ExerciseInput({
  exercise: e,
  answer,
  onChange,
  disabled,
}: {
  exercise: Exercise;
  answer: Answer;
  onChange: (a: Answer) => void;
  disabled: boolean;
}) {
  const values = Array.isArray(answer) ? answer : [];
  function setSlot(index: number, value: string) {
    const next = [...values];
    next[index] = value;
    onChange(next);
  }
  function move(index: number, direction: number) {
    const next = [...values];
    [next[index], next[index + direction]] = [next[index + direction], next[index]];
    onChange(next);
  }
  return (
    <div className="exercise-input">
      {e.code && (
        <pre className="code-block" tabIndex={0}>
          {e.code}
        </pre>
      )}
      {(e.type === 'choice' || e.type === 'debug') && (
        <fieldset className="choice-list">
          <legend className="sr-only">Selecciona una respuesta</legend>
          {e.options.map((option, i) => (
            <label className={`choice ${answer === option ? 'chosen' : ''}`} key={option}>
              <input
                type="radio"
                name={e.id}
                value={option}
                checked={answer === option}
                onChange={() => onChange(option)}
                disabled={disabled}
              />
              <span className="choice-letter">{String.fromCharCode(65 + i)}</span>
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      )}
      {e.type === 'fill' && (
        <>
          <pre className="code-block" tabIndex={0}>
            {e.template.replace(
              /___/g,
              (() => {
                let i = 0;
                return () => `⟦ ${++i} ⟧`;
              })(),
            )}
          </pre>
          <div className="blank-inputs">
            {e.blanks.map((_, i) => (
              <label key={i}>
                Espacio {i + 1}
                <input
                  aria-label={`Espacio ${i + 1}`}
                  value={values[i] ?? ''}
                  onChange={(event) => setSlot(i, event.target.value)}
                  disabled={disabled}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              </label>
            ))}
          </div>
        </>
      )}
      {e.type === 'predict' && (
        <label className="output-label">
          Salida del programa
          <textarea
            aria-label="Salida del programa"
            placeholder="Escribe la salida exacta…"
            value={typeof answer === 'string' ? answer : ''}
            onChange={(event) => onChange(event.target.value)}
            disabled={disabled}
            spellCheck={false}
            autoCapitalize="off"
            rows={3}
          />
        </label>
      )}
      {e.type === 'order' && (
        <ol className="order-list">
          {values.map((line, i) => (
            <li key={i}>
              <GripVertical size={16} />
              <span className="line-number">{i + 1}</span>
              <code>{line}</code>
              <div>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Subir línea ${i + 1}`}
                  disabled={disabled || i === 0}
                  onClick={() => move(i, -1)}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Bajar línea ${i + 1}`}
                  disabled={disabled || i === values.length - 1}
                  onClick={() => move(i, 1)}
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </li>
          ))}
        </ol>
      )}
      {e.type === 'design' && (
        <div className="design-decisions">
          {e.decisions.map((d, i) => (
            <label key={d.label}>
              <span>
                {i + 1}. {d.label}
              </span>
              <select
                value={values[i] ?? ''}
                disabled={disabled}
                onChange={(event) => setSlot(i, event.target.value)}
              >
                <option value="">Selecciona una decisión…</option>
                {d.options.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      {e.type === 'code' && (
        <>
          <Suspense fallback={<div className="panel">Cargando editor local…</div>}>
            <CodeEditor
              value={typeof answer === 'string' ? answer : ''}
              onChange={onChange}
              starter={e.starter}
              disabled={disabled}
            />
          </Suspense>
          <details className="rubric">
            <summary>Contrato de evaluación</summary>
            <ul>
              {e.rules.map((r) => (
                <li key={r.label}>{r.label}</li>
              ))}
            </ul>
            <p>
              Se exige la forma descrita en el enunciado. Una solución equivalente escrita de otra
              manera puede no ser aceptada.
            </p>
          </details>
        </>
      )}
    </div>
  );
}
