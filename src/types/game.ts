export type Mode = 'apprentice' | 'university' | 'expert';
export type Answer = string | string[];
interface ExerciseBase {
  id: string;
  question: string;
  explanation: string;
  hint: string;
  code?: string;
  modes?: Mode[];
}
export interface ChoiceExercise extends ExerciseBase {
  type: 'choice' | 'debug';
  options: string[];
  correct: string;
}
export interface FillExercise extends ExerciseBase {
  type: 'fill';
  template: string;
  blanks: string[][];
}
export interface OrderExercise extends ExerciseBase {
  type: 'order';
  lines: string[];
  correctOrder: string[];
}
export interface PredictExercise extends ExerciseBase {
  type: 'predict';
  expected: string;
}
export interface CodeRule {
  kind: 'exact' | 'includes' | 'pattern' | 'balanced';
  value?: string;
  label: string;
}
export interface CodeExercise extends ExerciseBase {
  type: 'code';
  starter: string;
  solution: string;
  rules: CodeRule[];
}
export interface DesignExercise extends ExerciseBase {
  type: 'design';
  decisions: { label: string; options: string[]; correct: string }[];
}
export type Exercise =
  ChoiceExercise | FillExercise | OrderExercise | PredictExercise | CodeExercise | DesignExercise;
export interface Lesson {
  id: string;
  title: string;
  description: string;
  objective: string;
  worldId: number;
  order: number;
  kind: 'lesson' | 'boss' | 'final';
  difficulty: number;
  reward: number;
  prerequisites: string[];
  exercises: Exercise[];
}
export interface World {
  id: number;
  title: string;
  theme: string;
  description: string;
  color: string;
  symbol: string;
  boss: string;
}
export interface Evaluation {
  correct: boolean;
  checks: { label: string; passed: boolean }[];
  method: 'answer' | 'rules';
}
export interface ExerciseResult {
  exerciseId: string;
  answer: Answer;
  correct: boolean;
  errors: number;
  hints: number;
  credit: number;
}
export interface Attempt {
  id: string;
  lessonId: string;
  mode: Mode;
  startedAt: string;
  finishedAt?: string;
  index: number;
  lives: number;
  hintsUsed: number;
  results: Record<string, ExerciseResult>;
  checked: boolean;
  draft?: Answer;
  score?: number;
  passed?: boolean;
  xp?: number;
  abandoned?: boolean;
}
export interface Progress {
  attempts: number;
  errors: number;
  bestScore: number;
  passed: boolean;
  passedAt?: string;
  firstStartedAt: string;
  last?: Attempt;
  masteryXp: Record<string, number>;
  bonusXp: number;
}
export interface Certificate {
  id: string;
  name: string;
  issuedAt: string;
  grade: number;
  programVersion: string;
  eligibleAt: string;
  verification: 'local';
  updatedAt?: string;
}
export interface Player {
  id: string;
  name: string;
  mode: Mode;
  avatar: string;
  startedAt: string;
  lastAccess: string;
}
export interface GameData {
  player: Player | null;
  progress: Record<string, Progress>;
  active: Attempt | null;
  lastLesson: string;
  certificate: Certificate | null;
  eligibleAt: string | null;
  activityDates: string[];
}
