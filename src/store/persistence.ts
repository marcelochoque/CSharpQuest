import type { StateStorage } from 'zustand/middleware';
import type { Attempt, Certificate, GameData, Player, Progress } from '../types/game';
import { activities, lessonById } from '../data/curriculum';
import { exercisesFor, MODES } from '../engine/scoring/rules';
import { evaluate } from '../engine/evaluators/evaluate';
import type { Mode } from '../types/game';
import { eligibleForCertificate, isUnlocked } from '../engine/progression/progression';
export const SAVE_VERSION = 1;
export const SAVE_KEY = 'csharp-quest-save';
export let storageNotice = '';
export const emptyData = (): GameData => ({
  player: null,
  progress: {},
  active: null,
  lastLesson: 'L01',
  certificate: null,
  eligibleAt: null,
  activityDates: [],
});
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === 'object' && !Array.isArray(v);
const finite = (v: unknown, max = Number.MAX_SAFE_INTEGER) =>
  typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= max;
const integer = (v: unknown, max = Number.MAX_SAFE_INTEGER) =>
  finite(v, max) && Number.isInteger(v);
const date = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));
const text = (v: unknown, max = 200): v is string =>
  typeof v === 'string' && v.length > 0 && v.length <= max;
function validAttempt(v: unknown): v is Attempt {
  if (
    !object(v) ||
    !text(v.id) ||
    typeof v.lessonId !== 'string' ||
    !Object.hasOwn(lessonById, v.lessonId) ||
    !Object.hasOwn(MODES, String(v.mode)) ||
    !date(v.startedAt) ||
    !integer(v.index, 100) ||
    !integer(v.lives, 5) ||
    !integer(v.hintsUsed, 3) ||
    !object(v.results) ||
    typeof v.checked !== 'boolean'
  )
    return false;
  const selected = exercisesFor(lessonById[v.lessonId], v.mode as Mode);
  const config = MODES[v.mode as Mode];
  const index = v.index as number;
  if (
    index >= selected.length ||
    (v.lives as number) > config.lives ||
    (v.hintsUsed as number) > config.hints
  )
    return false;
  const ids = new Set(selected.slice(0, index + 1).map((e) => e.id));
  if (
    !Object.entries(v.results).every(
      ([key, r]) =>
        object(r) &&
        ids.has(key) &&
        r.exerciseId === key &&
        ((typeof r.answer === 'string' && r.answer.length <= 30000) ||
          (Array.isArray(r.answer) &&
            r.answer.length <= 100 &&
            r.answer.every((a) => typeof a === 'string' && a.length <= 30000))) &&
        typeof r.correct === 'boolean' &&
        integer(r.errors, config.lives) &&
        integer(r.hints, 1) &&
        finite(r.credit, 1),
    )
  )
    return false;
  const attempt = v as unknown as Attempt;
  if (
    v.draft !== undefined &&
    !(
      (typeof v.draft === 'string' && v.draft.length <= 30000) ||
      (Array.isArray(v.draft) &&
        v.draft.length <= 100 &&
        v.draft.every((a) => typeof a === 'string' && a.length <= 30000))
    )
  )
    return false;
  const results = Object.values(attempt.results);
  if (
    results.reduce((s, r) => s + r.errors, 0) !== config.lives - attempt.lives ||
    results.reduce((s, r) => s + r.hints, 0) !== attempt.hintsUsed
  )
    return false;
  if (
    selected
      .slice(0, index)
      .some(
        (e) =>
          !attempt.results[e.id] ||
          !(attempt.results[e.id].correct || attempt.results[e.id].errors),
      )
  )
    return false;
  const current = attempt.results[selected[index].id];
  if (attempt.checked && (!current || !(current.correct || current.errors))) return false;
  for (const r of results) {
    const e = selected.find((e) => e.id === r.exerciseId)!;
    if (r.correct && !evaluate(e, r.answer).correct) return false;
    if (r.credit !== (r.correct ? (r.errors > 0 ? 0.5 : 1) : 0)) return false;
  }
  return (
    (v.score === undefined || finite(v.score, 100)) &&
    (v.finishedAt === undefined || date(v.finishedAt)) &&
    (v.passed === undefined || typeof v.passed === 'boolean') &&
    (v.abandoned === undefined || typeof v.abandoned === 'boolean') &&
    (v.xp === undefined || integer(v.xp))
  );
}
export function validateData(value: unknown): GameData {
  if (!object(value) || !object(value.progress))
    throw new Error('El archivo no contiene progreso válido de C# Quest.');
  const result = emptyData();
  if (value.player !== null) {
    const p = value.player;
    if (
      !object(p) ||
      !text(p.id) ||
      !text(p.name, 80) ||
      !p.name.trim() ||
      !Object.hasOwn(MODES, String(p.mode)) ||
      !date(p.startedAt) ||
      !date(p.lastAccess)
    )
      throw new Error('Los datos del jugador no son válidos.');
    result.player = {
      id: p.id,
      name: p.name.trim(),
      mode: p.mode,
      avatar: ['azure', 'violet', 'emerald'].includes(String(p.avatar)) ? p.avatar : 'azure',
      startedAt: p.startedAt,
      lastAccess: p.lastAccess,
    } as Player;
  }
  for (const lesson of activities) {
    const p = value.progress[lesson.id];
    if (p === undefined) continue;
    if (
      !object(p) ||
      !integer(p.attempts) ||
      !integer(p.errors) ||
      !finite(p.bestScore, 100) ||
      typeof p.passed !== 'boolean' ||
      !date(p.firstStartedAt) ||
      !object(p.masteryXp) ||
      !integer(p.bonusXp, 425) ||
      (p.passed && (!date(p.passedAt) || (p.bestScore as number) < 70)) ||
      (p.last !== undefined &&
        (!validAttempt(p.last) || p.last.lessonId !== lesson.id || !date(p.last.finishedAt)))
    )
      throw new Error(`Progreso inválido en ${lesson.id}.`);
    const masteryXp: Record<string, number> = {};
    for (const exercise of lesson.exercises) {
      const xp = p.masteryXp[exercise.id];
      if (xp !== undefined) {
        if (!finite(xp, 15)) throw new Error('XP fuera de rango.');
        masteryXp[exercise.id] = xp as number;
      }
    }
    result.progress[lesson.id] = {
      attempts: p.attempts,
      errors: p.errors,
      bestScore: p.bestScore,
      passed: p.passed,
      passedAt: p.passedAt,
      firstStartedAt: p.firstStartedAt,
      masteryXp,
      bonusXp: p.bonusXp,
      last: p.last,
    } as Progress;
  }
  for (const l of activities)
    if (result.progress[l.id]?.passed && !isUnlocked(l, result.progress))
      throw new Error('El archivo tiene aprobaciones sin sus requisitos previos.');
  if (value.active != null) {
    if (
      !validAttempt(value.active) ||
      !isUnlocked(lessonById[value.active.lessonId], result.progress) ||
      value.active.finishedAt ||
      value.active.lives <= 0 ||
      !result.progress[value.active.lessonId]
    )
      throw new Error('El intento guardado no es válido.');
    result.active = value.active;
  }
  if (typeof value.lastLesson === 'string' && lessonById[value.lastLesson])
    result.lastLesson = value.lastLesson;
  if (date(value.eligibleAt)) result.eligibleAt = value.eligibleAt;
  if (Array.isArray(value.activityDates))
    result.activityDates = [
      ...new Set(
        value.activityDates.filter(
          (d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d),
        ),
      ),
    ].sort();
  if (value.certificate != null) {
    const c = value.certificate;
    if (
      !object(c) ||
      !eligibleForCertificate(result.progress) ||
      !text(c.id) ||
      !text(c.name, 80) ||
      !date(c.issuedAt) ||
      !date(c.eligibleAt) ||
      !finite(c.grade, 100) ||
      !text(c.programVersion)
    )
      throw new Error('El certificado guardado no es válido.');
    result.certificate = {
      id: c.id,
      name: c.name,
      issuedAt: c.issuedAt,
      eligibleAt: c.eligibleAt,
      grade: c.grade,
      programVersion: c.programVersion,
      verification: 'local',
      ...(date(c.updatedAt) ? { updatedAt: c.updatedAt } : {}),
    } as Certificate;
  }
  if (
    !result.player &&
    (Object.keys(result.progress).length || result.active || result.certificate)
  )
    throw new Error('El progreso no tiene jugador.');
  return result;
}
export function parseImport(raw: string): GameData {
  if (raw.length > 5_000_000) throw new Error('El archivo supera el límite de 5 MB.');
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('El archivo no es JSON válido.');
  }
  if (!object(parsed) || parsed.version !== SAVE_VERSION)
    throw new Error('Versión de progreso incompatible. Conserva el archivo original.');
  return validateData(parsed.state);
}
export const dataOnly = (s: GameData): GameData => ({
  player: s.player,
  progress: s.progress,
  active: s.active,
  lastLesson: s.lastLesson,
  certificate: s.certificate,
  eligibleAt: s.eligibleAt,
  activityDates: s.activityDates,
});
export const exportData = (s: GameData) =>
  JSON.stringify(
    {
      application: 'CSharpQuest',
      version: SAVE_VERSION,
      exportedAt: new Date().toISOString(),
      state: dataOnly(s),
    },
    null,
    2,
  );
export function makeSafeStorage(storage: StateStorage): StateStorage {
  let futureVersion = false;
  return {
    getItem(name) {
      try {
        const raw = storage.getItem(name);
        if (typeof raw !== 'string') return null;
        const parsed = JSON.parse(raw);
        if (parsed.version > SAVE_VERSION) {
          futureVersion = true;
          storageNotice =
            'Este guardado pertenece a una versión posterior. Se conservó intacto; actualiza la aplicación para recuperarlo. El almacenamiento está protegido contra sobrescritura.';
          return null;
        }
        validateData(parsed.state);
        return raw;
      } catch {
        storageNotice =
          'No se pudo leer el guardado. Se conservó una copia de recuperación en este navegador; puedes descargarla desde el perfil.';
        try {
          const raw = storage.getItem(name);
          if (typeof raw === 'string') storage.setItem(`${SAVE_KEY}-recovery`, raw);
        } catch {
          /* Storage may be disabled. */
        }
        return null;
      }
    },
    setItem(name, value) {
      if (futureVersion) return;
      try {
        storage.setItem(name, value);
      } catch {
        storageNotice =
          'No se pudo guardar en el navegador. Exporta tu progreso desde el perfil antes de cerrar.';
      }
    },
    removeItem(name) {
      if (!futureVersion)
        try {
          storage.removeItem(name);
        } catch {
          storageNotice = 'No se pudo acceder al almacenamiento.';
        }
    },
  };
}
export function browserStorage(): StateStorage {
  return makeSafeStorage({
    getItem: (key) => (typeof window === 'undefined' ? null : window.localStorage.getItem(key)),
    setItem: (key, value) => {
      if (typeof window !== 'undefined') window.localStorage.setItem(key, value);
    },
    removeItem: (key) => {
      if (typeof window !== 'undefined') window.localStorage.removeItem(key);
    },
  });
}
