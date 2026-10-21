import type { Answer, CodeExercise, Evaluation, Exercise } from '../../types/game';

// Lexer for the supported exercise subset. Strings retain case and whitespace.
// Comments cannot satisfy a rule. This is not a C# parser or compiler.
export function tokens(code: string): string[] {
  return (
    code.match(
      /@"(?:""|[^"])*"|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\/|\b\w+\b|=>|==|!=|<=|>=|\+\+|--|&&|\|\||\+=|-=|\S/g,
    ) ?? []
  ).filter((t) => !t.startsWith('//') && !t.startsWith('/*'));
}
export const normalizeCode = (code: string) => tokens(code).join(' ');
const normalizeOutput = (text: string) => text.replace(/\r\n/g, '\n').trim();
export interface CodeEvaluator {
  readonly name: string;
  evaluate(code: string, exercise: CodeExercise): Evaluation | Promise<Evaluation>;
}
export class RuleCodeEvaluator implements CodeEvaluator {
  readonly name = 'Reglas locales · sin compilación';
  evaluate(code: string, exercise: CodeExercise): Evaluation {
    const normalized = normalizeCode(code);
    const checks = exercise.rules.map((rule) => {
      let passed = false;
      if (rule.kind === 'exact')
        passed = normalized === normalizeCode(rule.value ?? exercise.solution);
      if (rule.kind === 'includes') passed = normalized.includes(normalizeCode(rule.value ?? ''));
      if (rule.kind === 'pattern') passed = new RegExp(rule.value ?? '', 'm').test(normalized);
      if (rule.kind === 'balanced') {
        const stack: string[] = [];
        const closing: Record<string, string> = { '}': '{', ')': '(', ']': '[' };
        passed =
          tokens(code).every((t) => {
            if (['{', '(', '['].includes(t)) stack.push(t);
            else if (closing[t]) return stack.pop() === closing[t];
            return true;
          }) && stack.length === 0;
      }
      return { label: rule.label, passed };
    });
    return { correct: checks.length > 0 && checks.every((c) => c.passed), checks, method: 'rules' };
  }
}
const codeEvaluator = new RuleCodeEvaluator();
export function evaluate(exercise: Exercise, answer: Answer): Evaluation {
  if (exercise.type === 'code')
    return codeEvaluator.evaluate(typeof answer === 'string' ? answer : '', exercise);
  let checks: Evaluation['checks'] = [];
  switch (exercise.type) {
    case 'choice':
    case 'debug':
      checks = [{ label: 'Decisión', passed: answer === exercise.correct }];
      break;
    case 'predict':
      checks = [
        {
          label: 'Salida esperada',
          passed:
            typeof answer === 'string' &&
            normalizeOutput(answer) === normalizeOutput(exercise.expected),
        },
      ];
      break;
    case 'fill':
      checks = exercise.blanks.map((values, i) => ({
        label: `Espacio ${i + 1}`,
        passed:
          Array.isArray(answer) &&
          values.some((v) => normalizeCode(v) === normalizeCode(answer[i] ?? '')),
      }));
      break;
    case 'order':
      checks = [
        {
          label: 'Secuencia',
          passed:
            Array.isArray(answer) &&
            answer.length === exercise.correctOrder.length &&
            answer.every((v, i) => v === exercise.correctOrder[i]),
        },
      ];
      break;
    case 'design':
      checks = exercise.decisions.map((d, i) => ({
        label: d.label,
        passed: Array.isArray(answer) && answer[i] === d.correct,
      }));
      break;
  }
  return { correct: checks.every((c) => c.passed), checks, method: 'answer' };
}
export function solutionOf(e: Exercise): string {
  switch (e.type) {
    case 'choice':
    case 'debug':
      return e.correct;
    case 'fill':
      return e.blanks.map((b, i) => `${i + 1}: ${b[0]}`).join('\n');
    case 'order':
      return e.correctOrder.join('\n');
    case 'predict':
      return e.expected;
    case 'code':
      return e.solution;
    case 'design':
      return e.decisions.map((d) => `${d.label}: ${d.correct}`).join('\n');
  }
}
