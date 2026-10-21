import { useEffect, useState, type RefObject } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { sanitizeFilename } from '../../utils/download';
export function CertificateDownloadButton({
  target,
  name,
  label = 'Descargar certificado',
}: {
  target: RefObject<HTMLDivElement | null>;
  name: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    setImageUrl('');
  }, [name]);
  async function download() {
    if (!target.current) {
      setError('La vista previa todavía no está lista. Espera un momento y vuelve a intentarlo.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await document.fonts.ready;
      const data = await toPng(target.current, {
        width: 1123,
        height: 794,
        pixelRatio: 2,
        cacheBust: false,
        skipFonts: true,
        backgroundColor: '#fffdf5',
        style: { transform: 'none', margin: '0' },
      });
      setImageUrl(data);
      const link = document.createElement('a');
      link.href = data;
      link.download = `CSharpQuest_Certificado_${sanitizeFilename(name)}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      setError('No se pudo generar la imagen. Vuelve a intentarlo en un navegador moderno.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <button className="button primary" disabled={busy} onClick={() => void download()}>
        <Download size={18} />
        {busy ? 'Generando PNG…' : label}
      </button>
      {error && (
        <p role="alert" className="red">
          {error}
        </p>
      )}
      {imageUrl && (
        <p className="muted" role="status">
          PNG de 2246 × 1588 generado.{' '}
          <a
            className="blue"
            href={imageUrl}
            download={`CSharpQuest_Certificado_${sanitizeFilename(name)}.png`}
          >
            Guardar imagen generada
          </a>
        </p>
      )}
    </div>
  );
}
