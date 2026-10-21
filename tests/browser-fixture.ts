import { useGameStore } from '../src/store/gameStore';
import { activities, lessonById } from '../src/data/curriculum';
import { exercisesFor } from '../src/engine/scoring/rules';
import { correctAnswer, passLesson } from './helpers';
const state = () => useGameStore.getState();
document.getElementById('lab')!.onclick = () => {
  state().reset();
  state().createPlayer('Perfil QA', 'university');
  state().start('L01');
  for (const e of exercisesFor(lessonById.L01, 'university').slice(0, -1)) {
    state().submit(correctAnswer(e));
    state().next();
  }
  location.href = '/#/lesson/L01';
};
function complete(name: string) {
  state().reset();
  state().createPlayer(name, 'university');
  for (const l of activities) passLesson(l.id);
  state().issueCertificate(name);
  location.href = '/#/certificate';
}
document.getElementById('certificate')!.onclick = () => complete('Estudiante de prueba');
document.getElementById('long-name')!.onclick = () =>
  complete('María Alejandra Fernanda de los Ángeles Rodríguez Fernández de la Cruz');
document.getElementById('clear')!.onclick = () => {
  state().reset();
  document.getElementById('status')!.textContent =
    'Perfil de prueba eliminado; aplicación lista para comenzar.';
};
