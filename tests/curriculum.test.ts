import { describe, expect, it } from 'vitest';
import { activities, lessonById } from '../src/data/curriculum';
import { worlds } from '../src/data/worlds';
import { evaluate, normalizeCode, RuleCodeEvaluator } from '../src/engine/evaluators/evaluate';
import { exercisesFor, MODES } from '../src/engine/scoring/rules';
import { correctAnswer } from './helpers';
describe('Currículo completo', () => {
  it('contiene 60 lecciones, 10 jefes y un integrador independiente', () => {
    expect(worlds).toHaveLength(10);
    expect(activities).toHaveLength(71);
    expect(activities.filter((l) => l.kind === 'lesson')).toHaveLength(60);
    expect(activities.filter((l) => l.kind === 'boss')).toHaveLength(10);
    expect(activities.filter((l) => l.kind === 'final')).toHaveLength(1);
    expect(new Set(activities.flatMap((l) => l.exercises.map((e) => e.id))).size).toBe(
      activities.reduce((s, l) => s + l.exercises.length, 0),
    );
  });
  for (const lesson of activities)
    it(`${lesson.id}: todas las soluciones satisfacen su evaluador y todos los modos tienen práctica suficiente`, () => {
      for (const mode of Object.keys(MODES) as (keyof typeof MODES)[])
        expect(exercisesFor(lesson, mode).length).toBeGreaterThanOrEqual(
          lesson.kind === 'lesson' ? 5 : 8,
        );
      for (const e of lesson.exercises) {
        expect(evaluate(e, correctAnswer(e)).correct, e.id).toBe(true);
        if (e.type === 'fill') expect(e.template.match(/___/g)?.length).toBe(e.blanks.length);
        if (e.type === 'order') {
          expect([...e.lines].sort()).toEqual([...e.correctOrder].sort());
          expect(e.lines).not.toEqual(e.correctOrder);
        }
        if (e.type === 'choice' || e.type === 'debug') {
          expect(e.options.filter((o) => o === e.correct)).toHaveLength(1);
          expect(new Set(e.options).size).toBe(e.options.length);
        }
      }
      for (const requirement of lesson.prerequisites)
        expect(activities.indexOf(lessonById[requirement])).toBeLessThan(
          activities.indexOf(lesson),
        );
      if (lesson.kind !== 'lesson')
        expect(lesson.exercises.some((e) => e.type === 'code')).toBe(true);
    });
});
describe('Evaluadores honestos y restringidos', () => {
  it('ignora comentarios pero conserva espacios y mayúsculas en cadenas', () => {
    expect(normalizeCode('int x=2; // comment')).toBe(normalizeCode('int x = 2;'));
    expect(normalizeCode('"a b"')).not.toBe(normalizeCode('"ab"'));
    expect(normalizeCode('"Hola"')).not.toBe(normalizeCode('"hola"'));
  });
  it('no acepta la solución escondida en un comentario o texto extra', () => {
    const e = lessonById.B5.exercises.find((e) => e.type === 'code')!;
    expect(evaluate(e, `/* ${e.solution} */`).correct).toBe(false);
    expect(evaluate(e, e.solution + '\nthrow new Exception();').correct).toBe(false);
    expect(evaluate(e, e.solution).method).toBe('rules');
  });
  it('comprueba huecos individualmente', () => {
    const e = lessonById.L02.exercises.find((e) => e.type === 'fill')!;
    expect(evaluate(e, ['const', 'INCORRECTO']).checks.map((c) => c.passed)).toEqual([true, false]);
  });
  it('normaliza saltos de salida sin cambiar mayúsculas', () => {
    const e = lessonById.L01.exercises.find((e) => e.type === 'predict')!;
    expect(evaluate(e, 'Hola\r\nAda\n').correct).toBe(true);
    expect(evaluate(e, 'hola\nAda').correct).toBe(false);
  });
  it('admite comprobaciones de fragmentos, patrones y delimitadores sin ejecutar', () => {
    const code = {
      id: 'test',
      type: 'code' as const,
      question: '',
      explanation: '',
      hint: '',
      starter: '',
      solution: '',
      rules: [
        { kind: 'includes' as const, value: 'class Hero', label: 'clase' },
        { kind: 'pattern' as const, value: 'int Vida', label: 'campo' },
        { kind: 'balanced' as const, label: 'delimitadores' },
      ],
    };
    const evaluator = new RuleCodeEvaluator();
    expect(evaluator.evaluate('class Hero { int Vida; }', code).correct).toBe(true);
    expect(evaluator.evaluate('class Hero { int Vida;', code).correct).toBe(false);
  });
});
