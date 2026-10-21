import { beforeEach, describe, expect, it } from 'vitest';
import { activities, lessonById } from '../src/data/curriculum';
import {
  currentLesson,
  eligibleForCertificate,
  isUnlocked,
  statistics,
  streak,
} from '../src/engine/progression/progression';
import { exercisesFor, xpTotals } from '../src/engine/scoring/rules';
import { useGameStore } from '../src/store/gameStore';
import { correctAnswer, passLesson } from './helpers';
const store = () => useGameStore.getState();
beforeEach(() => {
  store().reset();
  store().createPlayer('Ada Lovelace', 'apprentice');
});
describe('Progresión y XP', () => {
  it('solo desbloquea el primer nivel y rechaza iniciar rutas posteriores', () => {
    expect(currentLesson(store().progress).id).toBe('L01');
    expect(store().start('L02')).toBe(false);
    expect(store().start('B1')).toBe(false);
    expect(store().start('FINAL')).toBe(false);
    expect(store().start('__proto__')).toBe(false);
    expect(store().start('constructor')).toBe(false);
    expect(store().start('L01')).toBe(true);
    store().next();
    expect(store().active?.index).toBe(0);
  });
  it('la primera aprobación perfecta gana 150 XP; repetir no añade XP', () => {
    passLesson('L01');
    const before = xpTotals(store().progress).total;
    expect(before).toBe(150);
    expect(isUnlocked(lessonById.L02, store().progress)).toBe(true);
    passLesson('L01');
    expect(xpTotals(store().progress).total).toBe(before);
    expect(store().progress.L01.attempts).toBe(2);
  });
  it('un intento fallido no elimina la aprobación ni baja la mejor puntuación', () => {
    passLesson('L01');
    store().updatePlayer('Ada', 'expert', 'azure');
    store().start('L01');
    store().submit('incorrecto');
    expect(store().active).toBeNull();
    expect(store().progress.L01.passed).toBe(true);
    expect(store().progress.L01.bestScore).toBe(100);
    expect(store().progress.L01.last?.passed).toBe(false);
    expect(store().start('L01')).toBe(true);
    expect(store().active?.lives).toBe(1);
  });
  it('las pistas y el modo se fijan para el intento; no se pueden farmear comprobaciones', () => {
    store().start('L01');
    store().hint();
    store().hint();
    expect(store().active?.hintsUsed).toBe(1);
    store().updatePlayer('Ada', 'expert', 'violet');
    expect(store().active?.mode).toBe('apprentice');
    store().submit(correctAnswer(lessonById.L01.exercises[0]));
    store().submit('incorrecto');
    expect(store().active?.lives).toBe(5);
    store().abandon();
    expect(store().progress.L01.passed).toBe(false);
  });
  it('penaliza error universitario aunque se corrija y permite aprobar con 85%', () => {
    store().updatePlayer('Ada', 'university', 'azure');
    store().start('L01');
    const exercises = exercisesFor(lessonById.L01, 'university');
    store().submit(['Wrong']);
    store().retry();
    store().submit(correctAnswer(exercises[0]));
    store().next();
    for (const e of exercises.slice(1)) {
      store().submit(correctAnswer(e));
      store().next();
    }
    expect(store().progress.L01.last?.score).toBe(85);
    expect(store().progress.L01.passed).toBe(true);
    expect(store().progress.L01.errors).toBe(1);
  });
  it('completar las seis lecciones permite el jefe pero el mundo siguiente requiere vencerlo', () => {
    for (const l of activities.slice(0, 6)) passLesson(l.id);
    expect(isUnlocked(lessonById.B1, store().progress)).toBe(true);
    expect(isUnlocked(lessonById.L07, store().progress)).toBe(false);
    passLesson('B1');
    expect(isUnlocked(lessonById.L07, store().progress)).toBe(true);
    expect(statistics(store().progress).worlds).toBe(1);
    expect(store().progress.B1.bonusXp).toBe(425);
  });
  it('recorre las 71 actividades; el certificado exige también el integrador', () => {
    for (const l of activities.slice(0, -1)) passLesson(l.id);
    expect(eligibleForCertificate(store().progress)).toBe(false);
    store().issueCertificate('Ada');
    expect(store().certificate).toBeNull();
    passLesson('FINAL');
    expect(eligibleForCertificate(store().progress)).toBe(true);
    expect(statistics(store().progress)).toMatchObject({
      lessons: 60,
      bosses: 10,
      worlds: 10,
      percent: 100,
      grade: 100,
    });
    store().issueCertificate('Ada Lovelace');
    const certificate = store().certificate!;
    store().issueCertificate('Ada Lovelace');
    expect(store().certificate).toEqual(certificate);
    store().issueCertificate('Ada L.');
    expect(store().certificate?.id).toBe(certificate.id);
    expect(store().certificate?.issuedAt).toBe(certificate.issuedAt);
    expect(store().certificate?.name).toBe('Ada L.');
  });
  it('la racha tolera ayer y se rompe tras un día vacío', () => {
    expect(streak(['2026-10-19', '2026-10-20'], new Date(2026, 9, 21))).toBe(2);
    expect(streak(['2026-10-19'], new Date(2026, 9, 21))).toBe(0);
  });
  for (const mode of ['university', 'expert'] as const)
    it(`todas las actividades se pueden aprobar en modo ${mode}`, () => {
      store().updatePlayer('Ada', mode, 'azure');
      for (const l of activities) passLesson(l.id);
      expect(eligibleForCertificate(store().progress)).toBe(true);
      expect(statistics(store().progress).grade).toBe(100);
    });
});
