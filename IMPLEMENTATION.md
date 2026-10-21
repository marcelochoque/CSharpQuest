# Plan de implementación de C# Quest

Especificación leída íntegramente: AGENTS.md (18 secciones). Estado inicial: solo AGENTS.md, sin Git.

1. **Base compilable:** React + TypeScript + Vite, Tailwind, scripts y recursos locales.
2. **Dominio y contenido:** 60 lecciones, 10 jefes, integrador independiente; siete tipos de ejercicio; dificultades; evaluadores explícitos; progresión, recompensas y almacenamiento versionado.
3. **Experiencia completa:** inicio, mapa, mundos, lección, laboratorio, resultados, perfil, insignias, final y certificado PNG.
4. **Verificación y entrega:** pruebas de contenido, puntuación, desbloqueo, persistencia, certificado y recorridos; compilación de producción; documentación y workflow GitHub Pages.

## Decisiones

- Sitio completamente estático; HashRouter y base relativa.
- El integrador es la actividad obligatoria 71, separada del jefe del mundo 10.
- Las respuestas locales son inspeccionables. Las reglas de código no compilan ni demuestran equivalencia funcional.
- Mejor aprobación conservada; XP por ejercicio y bonificaciones con máximos persistidos para evitar acumulación ilimitada.
- Los datos calculables (nivel, insignias, mundos y estadísticas) se derivan de resultados, evitando fuentes de verdad contradictorias.
- No se publica automáticamente: este trabajo implementa el repositorio local y prepara GitHub Pages.

## Verificación

Todas las fases de implementación están completadas.

- Base: dependencias instaladas, TypeScript estricto y Vite compilables.
- Contenido y dominio: 71 actividades y 510 configuraciones; 96 pruebas Vitest aprobadas, incluidos recorridos completos en los tres modos.
- Interfaz: todas las rutas solicitadas, pantalla desconocida, guardas, diseño responsive y recursos locales.
- Laboratorio: Monaco y worker locales verificados en navegador; borrador conservado al recargar; evaluación de código correcta y alternativa de texto accesible.
- Recorrido manual: perfil nuevo → mapa → primera lección con error → reintento → ordenamiento → resultados (90%, un error, 120 XP).
- Certificado: requisitos probados, nombre largo revisado, PNG real inspeccionado a 2246 × 1588. El navegador integrado genera la imagen pero no confirma un archivo en su gestor de descargas; se añadió enlace alternativo de guardado.
- Responsive: mapa e inicio comprobados a 390 px sin desbordamiento horizontal; mapa también revisado a 1440 px. Se corrigió el ancho de los nodos desplazados del camino.
- Producción: compilación estática y workflow GitHub Pages preparados. Sin despliegue remoto: la carpeta inicial no contenía Git ni remoto.
- Auditoría npm: cero vulnerabilidades tras actualizar DOMPurify transitivo de Monaco mediante override.

## Límites explícitos

- Evaluación por reglas de plantillas; no compilación C#, equivalencia semántica general ni antifraude.
- Progreso en este navegador; sin sincronización entre dispositivos o pestañas simultáneas.
- Monaco produce un chunk grande (aproximadamente 2.7 MB minificado / 694 KB gzip), cargado solo al abrir un ejercicio de código.
- Las pruebas automatizadas verifican los contratos y soluciones de referencia; no sustituyen una revisión pedagógica independiente del curso.

Las capturas de QA y el PNG de prueba están en `test-results/` (excluido de Git). La página `tests/browser-fixture.html` sirve exclusivamente para pruebas locales y no forma parte de `dist`.
