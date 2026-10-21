import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { eligibleForCertificate, statistics } from '../../engine/progression/progression';
import { xpTotals } from '../../engine/scoring/rules';
import { useGameStore } from '../../store/gameStore';
import { CertificateCard } from './CertificateCard';
import { CertificateDownloadButton } from './CertificateDownloadButton';
export function CertificatePage() {
  const state = useGameStore();
  const [name, setName] = useState(state.certificate?.name ?? state.player?.name ?? '');
  const [editing, setEditing] = useState(!state.certificate);
  const target = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    if (!viewport.current) return;
    const observer = new ResizeObserver((entries) =>
      setScale(Math.min(1, entries[0].contentRect.width / 1123)),
    );
    observer.observe(viewport.current);
    return () => observer.disconnect();
  }, [state.certificate]);
  if (!state.player) return <Navigate to="/" replace />;
  if (!eligibleForCertificate(state.progress)) return <Navigate to="/map" replace />;
  return (
    <>
      <div className="page-heading">
        <div>
          <p className="eyebrow">EL RECONOCIMIENTO A TU ESFUERZO</p>
          <h1>Tu certificado de aprobación</h1>
          <p>Un recuerdo de todo lo que has construido.</p>
        </div>
        <ShieldCheck className="gold" size={42} />
      </div>
      {editing && (
        <form
          className="panel certificate-form"
          onSubmit={(e) => {
            e.preventDefault();
            state.issueCertificate(name);
            setEditing(false);
          }}
        >
          <label>
            Confirma tu nombre completo
            <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
          </label>
          <button className="button primary" disabled={!name.trim()}>
            {state.certificate ? 'Confirmar cambio de nombre' : 'Generar certificado'}
          </button>
          {state.certificate && (
            <button
              type="button"
              className="button ghost"
              onClick={() => {
                setEditing(false);
                setName(state.certificate!.name);
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}
      {state.certificate && (
        <>
          <div ref={viewport} className="certificate-viewport" style={{ height: 794 * scale }}>
            <div
              style={{
                width: 1123,
                height: 794,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <CertificateCard ref={target} certificate={state.certificate} />
            </div>
          </div>
          <div className="button-row certificate-buttons">
            <CertificateDownloadButton
              target={target}
              name={state.certificate.name}
              label="Volver a descargar PNG"
            />
            <button className="button secondary" onClick={() => setEditing(true)}>
              Editar nombre del certificado
            </button>
            <Link className="button ghost" to="/map">
              Volver al mapa
            </Link>
          </div>
        </>
      )}
      <p className="certificate-disclaimer">
        Reconocimiento educativo emitido por C# Quest. Su identificador es local y no constituye una
        acreditación universitaria ni una verificación pública. Se conserva el mismo identificador
        en cada descarga.
      </p>
    </>
  );
}
export function FinalPage() {
  const state = useGameStore();
  const target = useRef<HTMLDivElement>(null);
  if (!state.player) return <Navigate to="/" replace />;
  if (!eligibleForCertificate(state.progress)) return <Navigate to="/map" replace />;
  const stats = statistics(state.progress);
  return (
    <section className="final-page panel celebrate">
      <div className="final-stars" aria-hidden="true">
        ✧ · ✦ · ✧
      </div>
      <div className="result-medal passed">
        <Trophy size={60} />
      </div>
      <p className="eyebrow gold">AVENTURA COMPLETADA</p>
      <h1>
        ¡Te has convertido en
        <br />
        <span>Arquitecto de C#!</span>
      </h1>
      <p>
        {state.player.name}, empezaste con una línea de código.
        <br />
        Hoy puedes diseñar un mundo completo. Este logro es tuyo.
      </p>
      <div className="result-stats">
        <div>
          <strong>{xpTotals(state.progress).total}</strong>
          <span>XP acumulados</span>
        </div>
        <div>
          <strong>{stats.lessons}</strong>
          <span>Lecciones</span>
        </div>
        <div>
          <strong>{stats.worlds}</strong>
          <span>Mundos conquistados</span>
        </div>
        <div>
          <strong>{stats.grade}%</strong>
          <span>Calificación global</span>
        </div>
      </div>
      <div className="button-row">
        <Link className="button primary" to="/certificate">
          <Sparkles size={18} />
          Ver certificado
        </Link>
        {state.certificate ? (
          <CertificateDownloadButton target={target} name={state.certificate.name} />
        ) : (
          <Link className="button secondary" to="/certificate">
            Descargar certificado
          </Link>
        )}
        <Link className="button ghost" to="/map">
          Volver al mapa
        </Link>
      </div>
      {state.certificate && (
        <div className="export-offscreen" aria-hidden="true">
          <CertificateCard ref={target} certificate={state.certificate} />
        </div>
      )}
    </section>
  );
}
