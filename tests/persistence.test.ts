import { beforeEach, describe, expect, it } from 'vitest';
import { useGameStore } from '../src/store/gameStore';
import {
  emptyData,
  exportData,
  makeSafeStorage,
  parseImport,
  SAVE_KEY,
  validateData,
} from '../src/store/persistence';
import { sanitizeFilename } from '../src/utils/download';
import { passLesson } from './helpers';
beforeEach(() => {
  useGameStore.getState().reset();
  useGameStore.getState().createPlayer('Ada', 'university');
});
describe('Guardado y recuperación', () => {
  it('exporta e importa sin perder resultados, nombre ni intentos', () => {
    passLesson('L01');
    const raw = exportData(useGameStore.getState());
    const restored = parseImport(raw);
    expect(restored.progress.L01.bestScore).toBe(100);
    expect(restored.player?.name).toBe('Ada');
    useGameStore.getState().reset();
    useGameStore.getState().importProgress(raw);
    expect(useGameStore.getState().progress.L01.passed).toBe(true);
  });
  it('conserva un intento en curso al exportar', () => {
    useGameStore.getState().start('L01');
    useGameStore.getState().hint();
    useGameStore.getState().saveDraft(['WriteLine']);
    expect(parseImport(exportData(useGameStore.getState())).active).toEqual(
      useGameStore.getState().active,
    );
    expect(parseImport(exportData(useGameStore.getState())).active?.draft).toEqual(['WriteLine']);
  });
  it('rechaza JSON, versión y tipos corruptos sin sobrescribir el progreso', () => {
    for (const raw of [
      '{',
      '{}',
      '{"version":500,"state":{}}',
      '{"version":1,"state":{"progress":{},"player":{"name":8}}}',
    ])
      expect(() => useGameStore.getState().importProgress(raw)).toThrow();
    expect(useGameStore.getState().player?.name).toBe('Ada');
  });
  it('rechaza fechas y puntuaciones inválidas y aprobaciones sin prerrequisitos', () => {
    passLesson('L01');
    const copy = parseImport(exportData(useGameStore.getState()));
    copy.progress.L02 = { ...copy.progress.L01 };
    delete copy.progress.L01;
    expect(() => validateData(copy)).toThrow();
  });
  it('respalda texto corrupto sin eliminarlo', () => {
    const items = new Map([[SAVE_KEY, '{ broken']]);
    const safe = makeSafeStorage({
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => {
        items.set(key, value);
      },
      removeItem: (key) => {
        items.delete(key);
      },
    });
    expect(safe.getItem(SAVE_KEY)).toBeNull();
    expect(items.get(`${SAVE_KEY}-recovery`)).toBe('{ broken');
    expect(items.get(SAVE_KEY)).toBe('{ broken');
  });
  it('no falla si el almacenamiento está bloqueado o lleno', () => {
    const safe = makeSafeStorage({
      getItem: () => {
        throw new Error('denied');
      },
      setItem: () => {
        throw new Error('full');
      },
      removeItem: () => {
        throw new Error('denied');
      },
    });
    expect(() => safe.getItem(SAVE_KEY)).not.toThrow();
    expect(() => safe.setItem(SAVE_KEY, 'x')).not.toThrow();
  });
  it('admite datos vacíos y sanitiza nombres de descarga', () => {
    expect(validateData(emptyData())).toEqual(emptyData());
    expect(sanitizeFilename('José / Pérez:*?')).toBe('JosePerez');
    expect(sanitizeFilename('///')).toBe('Estudiante');
  });
  it('rechaza intentos con índices o vidas fuera del modo', () => {
    useGameStore.getState().start('L01');
    const copy = parseImport(exportData(useGameStore.getState()));
    copy.active!.index = 99;
    expect(() => validateData(copy)).toThrow('intento');
    copy.active!.index = 0;
    copy.active!.lives = 5;
    expect(() => validateData(copy)).toThrow('intento');
  });
  it('protege un guardado de una versión futura de cualquier sobrescritura', () => {
    const raw = JSON.stringify({ version: 999, state: emptyData() });
    const items = new Map([[SAVE_KEY, raw]]);
    const safe = makeSafeStorage({
      getItem: (key) => items.get(key) ?? null,
      setItem: (key, value) => {
        items.set(key, value);
      },
      removeItem: (key) => {
        items.delete(key);
      },
    });
    expect(safe.getItem(SAVE_KEY)).toBeNull();
    safe.setItem(SAVE_KEY, '{}');
    safe.removeItem(SAVE_KEY);
    expect(items.get(SAVE_KEY)).toBe(raw);
  });
});
