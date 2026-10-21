import { Component, type ReactNode } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { HomePage } from '../features/player/HomePage';
import { MapPage } from '../features/worlds/MapPage';
import { LessonPage } from '../features/lessons/LessonPage';
import { ResultsPage } from '../features/lessons/ResultsPage';
import { AchievementsPage, ProfilePage } from '../features/player/ProfilePage';
import { CertificatePage, FinalPage } from '../features/certificates/CertificatePage';
import { SAVE_KEY } from '../store/persistence';
import { downloadBlob } from '../utils/download';
class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="empty-state">
        <h1>No pudimos abrir esta pantalla</h1>
        <p>Tu guardado se conserva. Descarga una copia antes de recargar.</p>
        <button
          className="button secondary"
          onClick={() => {
            try {
              downloadBlob(
                new Blob([localStorage.getItem(SAVE_KEY) ?? '{}'], { type: 'application/json' }),
                'CSharpQuest_Respaldo.json',
              );
            } catch {
              /* Browser denied storage. */
            }
          }}
        >
          Descargar guardado
        </button>
        <button className="button primary" onClick={() => location.reload()}>
          Recargar
        </button>
      </main>
    ) : (
      this.props.children
    );
  }
}
export function App() {
  return (
    <ErrorBoundary>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="map" element={<MapPage />} />
            <Route path="world/:worldId" element={<MapPage />} />
            <Route path="lesson/:lessonId" element={<LessonPage />} />
            <Route path="lesson/:lessonId/results" element={<ResultsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="achievements" element={<AchievementsPage />} />
            <Route path="certificate" element={<CertificatePage />} />
            <Route path="final" element={<FinalPage />} />
            <Route
              path="*"
              element={
                <div className="empty-state">
                  <h1>Este camino aún no existe</h1>
                  <p>Volvamos a un lugar conocido.</p>
                  <Link className="button primary" to="/map">
                    Volver al mapa
                  </Link>
                </div>
              }
            />
          </Route>
        </Routes>
      </HashRouter>
    </ErrorBoundary>
  );
}
