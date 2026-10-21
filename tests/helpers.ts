import type { Answer, Exercise } from '../src/types/game';
import { useGameStore } from '../src/store/gameStore';
import { lessonById } from '../src/data/curriculum';
import { exercisesFor } from '../src/engine/scoring/rules';
export function correctAnswer(e: Exercise): Answer {
  switch (e.type) {
    case 'choice':
    case 'debug':
      return e.correct;
    case 'fill':
      return e.blanks.map((b) => b[0]);
    case 'predict':
      return e.expected;
    case 'order':
      return [...e.correctOrder];
    case 'code':
      return e.solution;
    case 'design':
      return e.decisions.map((d) => d.correct);
  }
}
export function passLesson(id: string) {
  if (!useGameStore.getState().start(id)) throw new Error(`Could not start ${id}`);
  const a = useGameStore.getState().active!;
  for (const e of exercisesFor(lessonById[id], a.mode)) {
    useGameStore.getState().submit(correctAnswer(e));
    useGameStore.getState().next();
  }
}
