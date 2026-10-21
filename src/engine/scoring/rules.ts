import type { Attempt, Lesson, Mode, Progress } from '../../types/game';
export const MODES = {
  apprentice: {
    label: 'Aprendiz',
    lives: 5,
    threshold: 70,
    hints: 3,
    penalty: 0,
    description: 'Guía paso a paso · 5 vidas · 70% para aprobar',
  },
  university: {
    label: 'Universitario',
    lives: 3,
    threshold: 85,
    hints: 1,
    penalty: 5,
    description: 'Más código · 3 vidas · 85% para aprobar',
  },
  expert: {
    label: 'Experto',
    lives: 1,
    threshold: 95,
    hints: 0,
    penalty: 10,
    description: 'Retos ampliados · 1 vida · 95% para aprobar',
  },
} satisfies Record<Mode, object>;
export const exercisesFor = (lesson: Lesson, mode: Mode) =>
  lesson.exercises.filter((e) => !e.modes || e.modes.includes(mode));
export function calculateScore(attempt: Attempt, lesson: Lesson) {
  const results = Object.values(attempt.results);
  return Math.max(
    0,
    Math.round(
      (results.reduce((sum, r) => sum + r.credit, 0) / exercisesFor(lesson, attempt.mode).length) *
        100 -
        results.reduce((s, r) => s + r.errors, 0) * MODES[attempt.mode].penalty,
    ),
  );
}
export function rewards(lesson: Lesson, attempt: Attempt, previous?: Progress) {
  const masteryXp = { ...previous?.masteryXp };
  for (const result of Object.values(attempt.results)) {
    const value = result.correct ? 10 + (result.hints === 0 && result.errors === 0 ? 5 : 0) : 0;
    masteryXp[result.exerciseId] = Math.max(masteryXp[result.exerciseId] ?? 0, value);
  }
  const bonus = attempt.passed
    ? 50 + (attempt.score === 100 ? 25 : 0) + (lesson.kind === 'boss' ? 350 : 0)
    : 0;
  const bonusXp = Math.max(previous?.bonusXp ?? 0, bonus);
  const total = Object.values(masteryXp).reduce((a, b) => a + b, 0) + bonusXp;
  const old =
    Object.values(previous?.masteryXp ?? {}).reduce((a, b) => a + b, 0) + (previous?.bonusXp ?? 0);
  return { masteryXp, bonusXp, gained: total - old };
}
export function xpTotals(progress: Record<string, Progress>) {
  const values = Object.values(progress);
  const mastery = values.reduce(
    (s, p) => s + Object.values(p.masteryXp).reduce((a, b) => a + b, 0),
    0,
  );
  return {
    mastery,
    general: values.reduce((s, p) => s + p.bonusXp, 0),
    total: mastery + values.reduce((s, p) => s + p.bonusXp, 0),
  };
}
export function playerLevel(xp: number) {
  return xp >= 9000
    ? 'Arquitecto de software'
    : xp >= 6000
      ? 'Programador avanzado'
      : xp >= 3000
        ? 'Desarrollador'
        : xp >= 800
          ? 'Programador novato'
          : 'Aprendiz';
}
