import { activities } from '../../data/curriculum';
import { worlds } from '../../data/worlds';
import type { GameData, Lesson, Progress } from '../../types/game';
export const isUnlocked = (lesson: Lesson, progress: Record<string, Progress>): boolean =>
  lesson.prerequisites.every((id) => progress[id]?.passed === true);
export function currentLesson(progress: Record<string, Progress>) {
  return (
    activities.find((l) => !progress[l.id]?.passed && isUnlocked(l, progress)) ??
    activities[activities.length - 1]
  );
}
export const eligibleForCertificate = (progress: Record<string, Progress>) =>
  activities.length === 71 &&
  activities.every((l) => progress[l.id]?.passed === true && isUnlocked(l, progress));
export function nodeStatus(lesson: Lesson, data: GameData) {
  if (!isUnlocked(lesson, data.progress)) return 'locked';
  if (data.progress[lesson.id]?.passed)
    return data.progress[lesson.id].bestScore === 100 ? 'mastered' : 'completed';
  if (data.active?.lessonId === lesson.id || data.progress[lesson.id]?.attempts)
    return 'in-progress';
  return 'available';
}
export function statistics(progress: Record<string, Progress>) {
  const passed = activities.filter((l) => progress[l.id]?.passed);
  const completedWorlds = worlds.filter((w) =>
    activities
      .filter((l) => l.worldId === w.id && l.kind !== 'final')
      .every((l) => progress[l.id]?.passed),
  );
  const themes = worlds.map((w) => {
    const group = activities.filter((l) => l.worldId === w.id && l.kind !== 'final');
    return {
      ...w,
      score: Math.round(
        group.reduce((s, l) => s + (progress[l.id]?.bestScore ?? 0), 0) / group.length,
      ),
    };
  });
  return {
    completed: passed.length,
    lessons: passed.filter((l) => l.kind === 'lesson').length,
    bosses: passed.filter((l) => l.kind === 'boss').length,
    worlds: completedWorlds.length,
    percent: Math.round((passed.length / activities.length) * 100),
    grade: Math.round(
      activities.reduce((s, l) => s + (progress[l.id]?.bestScore ?? 0), 0) / activities.length,
    ),
    errors: Object.values(progress).reduce((s, p) => s + p.errors, 0),
    themes,
  };
}
export const achievementDefinitions = [
  {
    id: 'class',
    title: '¡Tiene vida!',
    description: 'Aprueba tu primera lección de clases.',
    test: (p: Record<string, Progress>) => !!p.L19?.passed,
  },
  {
    id: 'ten',
    title: 'Paso a paso',
    description: 'Aprueba diez lecciones.',
    test: (p: Record<string, Progress>) => statistics(p).lessons >= 10,
  },
  {
    id: 'boss',
    title: 'Rompehechizos',
    description: 'Derrota a tu primer jefe.',
    test: (p: Record<string, Progress>) => statistics(p).bosses >= 1,
  },
  {
    id: 'worlds',
    title: 'Explorador',
    description: 'Completa tres mundos.',
    test: (p: Record<string, Progress>) => statistics(p).worlds >= 3,
  },
  ...[5, 6, 7].map((id) => ({
    id: `master-${id}`,
    title: ['Guardián del estado', 'Raíces del código', 'Mil formas'][id - 5],
    description: `Domina ${worlds[id - 1].theme.toLowerCase()} con al menos 95% en cada actividad del mundo.`,
    test: (p: Record<string, Progress>) =>
      activities
        .filter((l) => l.worldId === id)
        .every((l) => p[l.id]?.passed && p[l.id].bestScore >= 95),
  })),
  {
    id: 'complete',
    title: 'Arquitecto de C#',
    description: 'Aprueba el programa y el integrador final.',
    test: eligibleForCertificate,
  },
];
export function streak(dates: string[], today = new Date()) {
  let count = 0;
  const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const key = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  if (!dates.includes(key(cursor))) cursor.setDate(cursor.getDate() - 1);
  while (dates.includes(key(cursor))) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
