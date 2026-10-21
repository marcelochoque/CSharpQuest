import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Answer, Attempt, GameData, Mode } from '../types/game';
import { lessonById } from '../data/curriculum';
import { evaluate } from '../engine/evaluators/evaluate';
import { calculateScore, exercisesFor, MODES, rewards } from '../engine/scoring/rules';
import {
  currentLesson,
  eligibleForCertificate,
  isUnlocked,
  statistics,
} from '../engine/progression/progression';
import {
  browserStorage,
  dataOnly,
  emptyData,
  parseImport,
  SAVE_KEY,
  SAVE_VERSION,
  validateData,
} from './persistence';
const now = () => new Date().toISOString();
const uuid = () => crypto.randomUUID();
interface GameStore extends GameData {
  createPlayer(name: string, mode: Mode): void;
  updatePlayer(name: string, mode: Mode, avatar: string): void;
  touch(): void;
  start(id: string): boolean;
  submit(answer: Answer): void;
  saveDraft(answer: Answer): void;
  hint(): void;
  retry(): void;
  next(): void;
  abandon(): void;
  importProgress(raw: string): void;
  reset(): void;
  issueCertificate(name: string): void;
}
function finalize(state: GameStore, attempt: Attempt, abandoned = false): Partial<GameStore> {
  const lesson = lessonById[attempt.lessonId];
  const score = calculateScore(attempt, lesson);
  const complete = exercisesFor(lesson, attempt.mode).every(
    (e) =>
      attempt.results[e.id] !== undefined &&
      (attempt.results[e.id].correct || attempt.results[e.id].errors > 0),
  );
  const passed =
    !abandoned && complete && attempt.lives > 0 && score >= MODES[attempt.mode].threshold;
  const finished: Attempt = { ...attempt, finishedAt: now(), score, passed, abandoned };
  const previous = state.progress[lesson.id];
  const reward = rewards(lesson, finished, previous);
  finished.xp = reward.gained;
  const progress = {
    ...state.progress,
    [lesson.id]: {
      ...previous,
      bestScore: Math.max(previous.bestScore, score),
      passed: previous.passed || passed,
      passedAt: previous.passedAt ?? (passed ? now() : undefined),
      errors: previous.errors + Object.values(attempt.results).reduce((s, r) => s + r.errors, 0),
      last: finished,
      masteryXp: reward.masteryXp,
      bonusXp: reward.bonusXp,
    },
  };
  const d = new Date();
  const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  return {
    progress,
    active: null,
    lastLesson: currentLesson(progress).id,
    eligibleAt: state.eligibleAt ?? (eligibleForCertificate(progress) ? now() : null),
    activityDates: abandoned
      ? state.activityDates
      : [...new Set([...state.activityDates, day])].sort(),
  };
}
export const useGameStore = create<GameStore>()(
  persist<GameStore, [], [], GameData>(
    (set, get) => ({
      ...emptyData(),
      createPlayer(name, mode) {
        if (!name.trim() || name.trim().length > 80 || get().player || !Object.hasOwn(MODES, mode))
          return;
        const date = now();
        set({
          player: {
            id: uuid(),
            name: name.trim(),
            mode,
            avatar: 'azure',
            startedAt: date,
            lastAccess: date,
          },
        });
      },
      updatePlayer(name, mode, avatar) {
        const player = get().player;
        if (
          player &&
          name.trim() &&
          name.trim().length <= 80 &&
          Object.hasOwn(MODES, mode) &&
          ['azure', 'violet', 'emerald'].includes(avatar)
        )
          set({ player: { ...player, name: name.trim(), mode, avatar, lastAccess: now() } });
      },
      touch() {
        const player = get().player;
        if (player) set({ player: { ...player, lastAccess: now() } });
      },
      start(id) {
        const state = get();
        const lesson = Object.hasOwn(lessonById, id) ? lessonById[id] : undefined;
        if (!state.player || !lesson || !isUnlocked(lesson, state.progress)) return false;
        if (state.active) return state.active.lessonId === id;
        const previous = state.progress[id];
        set({
          active: {
            id: uuid(),
            lessonId: id,
            mode: state.player.mode,
            startedAt: now(),
            index: 0,
            lives: MODES[state.player.mode].lives,
            hintsUsed: 0,
            results: {},
            checked: false,
          },
          lastLesson: id,
          progress: {
            ...state.progress,
            [id]: {
              attempts: (previous?.attempts ?? 0) + 1,
              errors: previous?.errors ?? 0,
              bestScore: previous?.bestScore ?? 0,
              passed: previous?.passed ?? false,
              firstStartedAt: previous?.firstStartedAt ?? now(),
              passedAt: previous?.passedAt,
              last: previous?.last,
              masteryXp: previous?.masteryXp ?? {},
              bonusXp: previous?.bonusXp ?? 0,
            },
          },
        });
        return true;
      },
      submit(answer) {
        const state = get();
        const a = state.active;
        if (!a || a.checked || a.lives <= 0) return;
        const lesson = lessonById[a.lessonId];
        const exercise = exercisesFor(lesson, a.mode)[a.index];
        if (!exercise || !isUnlocked(lesson, state.progress)) return;
        const previous = a.results[exercise.id];
        const correct = evaluate(exercise, answer).correct;
        const errors = (previous?.errors ?? 0) + (correct ? 0 : 1);
        const active: Attempt = {
          ...a,
          checked: true,
          lives: a.lives - (correct ? 0 : 1),
          results: {
            ...a.results,
            [exercise.id]: {
              exerciseId: exercise.id,
              answer,
              correct,
              errors,
              hints: previous?.hints ?? 0,
              credit: correct ? (errors ? 0.5 : 1) : 0,
            },
          },
        };
        set(active.lives <= 0 ? finalize(state, active) : { active });
      },
      saveDraft(answer) {
        const a = get().active;
        if (a && !a.checked && JSON.stringify(a.draft) !== JSON.stringify(answer))
          set({ active: { ...a, draft: answer } });
      },
      hint() {
        const a = get().active;
        if (!a || a.checked || a.hintsUsed >= MODES[a.mode].hints) return;
        const e = exercisesFor(lessonById[a.lessonId], a.mode)[a.index];
        const previous = a.results[e.id];
        if (previous?.hints) return;
        set({
          active: {
            ...a,
            hintsUsed: a.hintsUsed + 1,
            results: {
              ...a.results,
              [e.id]: {
                ...(previous ?? {
                  exerciseId: e.id,
                  answer: '',
                  correct: false,
                  errors: 0,
                  credit: 0,
                }),
                hints: 1,
              },
            },
          },
        });
      },
      retry() {
        const a = get().active;
        if (
          a &&
          a.checked &&
          a.lives > 0 &&
          !a.results[exercisesFor(lessonById[a.lessonId], a.mode)[a.index].id]?.correct
        )
          set({ active: { ...a, checked: false } });
      },
      next() {
        const state = get();
        const a = state.active;
        if (!a || !a.checked) return;
        if (a.index === exercisesFor(lessonById[a.lessonId], a.mode).length - 1)
          set(finalize(state, a));
        else set({ active: { ...a, index: a.index + 1, checked: false, draft: undefined } });
      },
      abandon() {
        const state = get();
        if (state.active) set(finalize(state, state.active, true));
      },
      importProgress(raw) {
        set(parseImport(raw));
      },
      reset() {
        set(emptyData());
      },
      issueCertificate(name) {
        const state = get();
        if (!eligibleForCertificate(state.progress) || !name.trim() || name.trim().length > 80)
          return;
        if (state.certificate) {
          if (state.certificate.name !== name.trim())
            set({ certificate: { ...state.certificate, name: name.trim(), updatedAt: now() } });
          return;
        }
        set({
          certificate: {
            id: uuid(),
            name: name.trim(),
            issuedAt: now(),
            eligibleAt: state.eligibleAt ?? now(),
            grade: statistics(state.progress).grade,
            programVersion: '1.0.0',
            verification: 'local',
          },
        });
      },
    }),
    {
      name: SAVE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(browserStorage),
      partialize: dataOnly,
      migrate: (persisted) => validateData(persisted),
      merge: (persisted, current) => {
        try {
          return { ...current, ...validateData(persisted) };
        } catch {
          return current;
        }
      },
    },
  ),
);
