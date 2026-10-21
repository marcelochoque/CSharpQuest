import { useEffect, useRef, useState } from 'react';
import { RotateCcw, Terminal, Type } from 'lucide-react';
import type * as Monaco from 'monaco-editor/editor/editor.api';
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
let monacoPromise: Promise<typeof Monaco> | undefined;
function loadMonaco() {
  self.MonacoEnvironment = { getWorker: () => new EditorWorker() };
  monacoPromise ??= Promise.all([
    import('monaco-editor/editor/editor.api'),
    import('monaco-editor/languages/definitions/csharp/register'),
  ]).then(([monaco]) => monaco);
  return monacoPromise;
}
export function CodeEditor({
  value,
  onChange,
  starter,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  starter: string;
  disabled: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);
  const editor = useRef<Monaco.editor.IStandaloneCodeEditor | null>(null);
  const callback = useRef(onChange);
  callback.current = onChange;
  const initial = useRef(value);
  const [plain, setPlain] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    if (plain) return;
    let disposed = false;
    void loadMonaco()
      .then((monaco) => {
        if (disposed || !host.current) return;
        editor.current = monaco.editor.create(host.current, {
          value: initial.current,
          language: 'csharp',
          theme: 'vs-dark',
          fontSize: 14,
          fontFamily: 'Consolas, monospace',
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          tabSize: 4,
          wordWrap: 'on',
          ariaLabel: 'Editor de código C#',
          readOnly: disabled,
          accessibilitySupport: 'on',
          tabFocusMode: true,
          padding: { top: 18 },
        });
        editor.current.onDidChangeModelContent(() =>
          callback.current(editor.current?.getValue() ?? ''),
        );
      })
      .catch(() => {
        setError('No se pudo iniciar Monaco. Puedes continuar con el editor de texto accesible.');
        setPlain(true);
      });
    return () => {
      disposed = true;
      editor.current?.getModel()?.dispose();
      editor.current?.dispose();
      editor.current = null;
    };
  }, [plain]);
  useEffect(() => {
    initial.current = value;
    if (editor.current && editor.current.getValue() !== value) editor.current.setValue(value);
  }, [value]);
  useEffect(() => {
    editor.current?.updateOptions({ readOnly: disabled });
  }, [disabled]);
  return (
    <div className="code-lab">
      <div className="editor-toolbar">
        <span>
          <Terminal size={16} />
          Laboratorio · C#
        </span>
        <div>
          <button className="text-button" type="button" onClick={() => setPlain(!plain)}>
            <Type size={14} />
            {plain ? 'Usar Monaco' : 'Texto accesible'}
          </button>
          <button
            className="text-button"
            type="button"
            disabled={disabled}
            onClick={() => onChange(starter)}
          >
            <RotateCcw size={14} />
            Restablecer
          </button>
        </div>
      </div>
      {error && <p role="status">{error}</p>}
      {plain ? (
        <textarea
          aria-label="Editor de código C#"
          className="plain-editor"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          spellCheck={false}
        />
      ) : (
        <div ref={host} className="monaco-host" />
      )}
      <div className="editor-note">
        Evaluación local por reglas. No se compila ni ejecuta C#. La evaluación de programación
        libre requiere un compilador en una versión posterior.
      </div>
    </div>
  );
}
