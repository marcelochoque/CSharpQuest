import { forwardRef } from 'react';
import type { Certificate } from '../../types/game';
export const CertificateCard = forwardRef<HTMLDivElement, { certificate: Certificate }>(
  function CertificateCard({ certificate: c }, ref) {
    return (
      <div className="certificate-card" ref={ref}>
        <div className="certificate-inner">
          <div className="cert-corner corner-tl" />
          <div className="cert-corner corner-br" />
          <div className="certificate-logo">
            {'{ }'} <strong>C# QUEST</strong>
          </div>
          <div className="certificate-topline">EL CAMINO DEL PROGRAMADOR ORIENTADO A OBJETOS</div>
          <div className="cert-rule" />
          <h1>CERTIFICADO DE APROBACIÓN</h1>
          <p className="cert-intro">Se certifica que</p>
          <h2 style={{ fontSize: c.name.length > 60 ? 26 : c.name.length > 40 ? 32 : 39 }}>
            {c.name}
          </h2>
          <p>Ha completado satisfactoriamente el programa de formación</p>
          <h3>
            FUNDAMENTOS DE C# Y<br />
            PROGRAMACIÓN ORIENTADA A OBJETOS
          </h3>
          <p className="certificate-description">
            Demostrando conocimientos en fundamentos del lenguaje C#, clases, objetos,
            encapsulamiento, herencia, polimorfismo, interfaces, colecciones y principios de diseño
            orientado a objetos.
          </p>
          <div className="certificate-metrics">
            <span>
              <b>10</b> mundos completados
            </span>
            <span>
              <b>60</b> lecciones aprobadas
            </span>
            <span>
              <b>{c.grade}%</b> calificación global
            </span>
          </div>
          <div className="certificate-bottom">
            <div>
              <span>FECHA DE EMISIÓN</span>
              <strong>
                {new Date(c.issuedAt).toLocaleDateString('es-BO', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </strong>
              <small>ID: {c.id}</small>
            </div>
            <div className="cert-seal">
              <span>✧</span>
              <b>ARQUITECTO</b>
              <small>DE C#</small>
            </div>
            <div className="certificate-signature">
              <strong>C# Quest</strong>
              <span>EMISIÓN AUTOMÁTICA</span>
              <small>Reconocimiento educativo de la plataforma</small>
            </div>
          </div>
          <p className="certificate-footnote">
            Certificado de finalización emitido automáticamente por la plataforma educativa C#
            Quest.
          </p>
        </div>
      </div>
    );
  },
);
