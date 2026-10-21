import type { CodeExercise, Exercise, Lesson } from '../types/game';
import { topics } from './topics';
import { challenges, finalChallenge, type Challenge } from './challenges';
import { worlds } from './worlds';
import { fillGoals } from './fillGoals';

function rotate<T>(items: T[], offset: number): T[] {
  const n = offset % items.length;
  return [...items.slice(n), ...items.slice(0, n)];
}
function codeTask(id: string, challenge: Challenge): CodeExercise {
  return {
    id,
    type: 'code',
    question: challenge.brief,
    starter: challenge.starter,
    solution: challenge.solution,
    explanation:
      'La solución de referencia cumple el contrato solicitado. La coincidencia de tokens solo verifica este ejercicio restringido; no demuestra equivalencia funcional ni sustituye una compilación.',
    hint: 'Divide el contrato en miembros, conserva nombres y tipos, y comprueba cada condición límite antes de mutar el estado.',
    rules: [
      { kind: 'balanced', label: 'Delimitadores equilibrados' },
      {
        kind: 'exact',
        label:
          'Plantilla restringida: nombres, operaciones y orden solicitados (se ignoran espacios y comentarios)',
      },
    ],
  };
}
const lessons: Lesson[] = topics.map((topic, index) => {
  const [title, teaching, question, options, template, blanks, trace, expected, broken, fixes] =
    topic;
  const id = `L${String(index + 1).padStart(2, '0')}`;
  let blankIndex = 0;
  const solution = template.replace(/___/g, () => blanks[blankIndex++]);
  const lines = trace.split('\n');
  const exercises: Exercise[] = [
    {
      id: `${id}-concept`,
      type: 'choice',
      question,
      options: rotate(options, index + 1),
      correct: options[0],
      explanation: teaching,
      hint: teaching,
      modes: ['apprentice'],
    },
    {
      id: `${id}-fill`,
      type: 'fill',
      question: `Completa cada espacio. ${fillGoals[index]}`,
      template,
      blanks: blanks.map((b) => [b]),
      explanation: teaching,
      hint: teaching,
    },
    {
      id: `${id}-trace`,
      type: 'predict',
      question:
        'Sigue el estado del programa y escribe su salida exacta, una línea por cada WriteLine. Supón los using de System, System.Collections.Generic y System.Linq cuando correspondan.',
      code: trace,
      expected,
      explanation: `${teaching} Salida de referencia:\n${expected}`,
      hint: 'Anota el valor de cada variable después de cada asignación. True y False se escriben con mayúscula inicial.',
    },
    {
      id: `${id}-debug`,
      type: 'debug',
      question: 'Analiza el problema y selecciona la corrección o diagnóstico preciso.',
      code: broken,
      options: rotate(fixes, index + 2),
      correct: fixes[0],
      explanation: `${fixes[0]} ${teaching}`,
      hint: 'Distingue entre sintaxis, tipos, acceso y comportamiento esperado.',
    },
    {
      id: `${id}-order`,
      type: 'order',
      question:
        'Reconstruye el fragmento de la predicción anterior en su orden original: declaraciones, operaciones y salida; las definiciones de tipos van al final. Usa las flechas para mover las líneas.',
      lines: rotate(lines, 1),
      correctOrder: lines,
      explanation:
        'Esta tarea comprueba la reconstrucción del fragmento de referencia. Otros órdenes pueden ser válidos en C#, pero no son el objetivo de esta actividad.',
      hint: 'Primero crea las variables que se usan después. Conserva los bloques y coloca las clases al final.',
    },
    {
      ...codeTask(`${id}-lab`, {
        brief: `Completa la plantilla: ${fillGoals[index]} Conserva nombres, instrucciones y orden. El evaluador compara tokens con la plantilla de referencia.`,
        starter: template,
        solution,
        decisions: [],
      }),
      modes: ['university', 'expert'],
    },
    {
      id: `${id}-expert`,
      type: 'design',
      question: `Transferencia al proyecto del mundo: ${worlds[Math.floor(index / 6)].boss}. Resuelve todas las decisiones del contrato.`,
      decisions: challenges[Math.floor(index / 6)].decisions.map((d, i) => ({
        ...d,
        options: rotate(d.options, index + i),
      })),
      explanation: challenges[Math.floor(index / 6)].decisions
        .map((d) => `${d.label}: ${d.correct}`)
        .join('\n'),
      hint: 'Evalúa invariantes, dependencias y casos límite.',
      modes: ['expert'],
    },
  ];
  const worldId = Math.floor(index / 6) + 1;
  return {
    id,
    title,
    description: teaching,
    objective: question,
    worldId,
    order: index + 1,
    kind: 'lesson',
    difficulty: Math.min(5, Math.ceil((index + 1) / 12)),
    reward: 50,
    prerequisites:
      index === 0
        ? []
        : index % 6 === 0
          ? [`B${worldId - 1}`]
          : [`L${String(index).padStart(2, '0')}`],
    exercises,
  };
});
export const activities: Lesson[] = worlds.flatMap((world) => {
  const group = lessons.filter((l) => l.worldId === world.id);
  const challenge = challenges[world.id - 1];
  const boss: Lesson = {
    id: `B${world.id}`,
    title: world.boss,
    description: `Restaura el módulo RPG de ${world.theme.toLowerCase()}. Integra los seis conceptos del mundo y construye su pieza de código.`,
    objective: challenge.brief,
    worldId: world.id,
    order: world.id * 7,
    kind: 'boss',
    difficulty: 5,
    reward: 400,
    prerequisites: group.map((l) => l.id),
    exercises: [
      ...group.map((l, i) => ({
        ...l.exercises[i % 2 === 0 ? 1 : 2],
        id: `B${world.id}-transfer-${i}`,
        question: `Parte ${i + 1} · ${l.title}. ${l.exercises[i % 2 === 0 ? 1 : 2].question}`,
        modes: undefined,
      })),
      codeTask(`B${world.id}-project`, challenge),
      {
        id: `B${world.id}-design`,
        type: 'design',
        question:
          'Revisa las decisiones del sistema antes de entregarlo. Deben cumplirse todos los contratos.',
        decisions: challenge.decisions.map((d, i) => ({
          ...d,
          options: rotate(d.options, i + world.id),
        })),
        explanation: challenge.decisions.map((d) => `${d.label}: ${d.correct}`).join('\n'),
        hint: 'Elige la opción que preserve las invariantes y permita ampliar el sistema.',
      },
    ],
  };
  return [...group, boss];
});
activities.push({
  id: 'FINAL',
  title: 'El legado del arquitecto',
  description:
    'La prueba integradora final: une fundamentos, control, objetos, contratos, colecciones y pruebas en el motor de tu aventura.',
  objective: finalChallenge.brief,
  worldId: 10,
  order: 71,
  kind: 'final',
  difficulty: 5,
  reward: 50,
  prerequisites: activities.map((a) => a.id),
  exercises: [
    ...[0, 1, 3, 4, 5, 6, 7, 8].map((worldIndex, i) => {
      const source = lessons[worldIndex * 6 + 5].exercises[i % 2 ? 1 : 2];
      return { ...source, id: `FINAL-transfer-${i}`, modes: undefined };
    }),
    codeTask('FINAL-code', finalChallenge),
    {
      id: 'FINAL-design',
      type: 'design',
      question:
        'Revisión de arquitectura del RPG. Decide las reglas de dominio, extensión, composición y verificación.',
      decisions: finalChallenge.decisions.map((d, i) => ({
        ...d,
        options: rotate(d.options, i + 1),
      })),
      explanation: finalChallenge.decisions.map((d) => `${d.label}: ${d.correct}`).join('\n'),
      hint: 'Protege el estado y depende de contratos.',
    },
  ],
});
export const lessonById: Record<string, Lesson> = Object.assign(
  Object.create(null),
  Object.fromEntries(activities.map((l) => [l.id, l])),
);
