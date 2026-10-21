# C# Quest

**El camino del programador orientado a objetos.** Videojuego educativo estático en español construido siguiendo `AGENTS.md`.

## Ejecutar

Requiere Node.js 22.12 o posterior y npm. El proyecto se verificó con Node 22.14.

```sh
npm ci
npm run dev
```

Abre la dirección que imprime Vite, normalmente `http://127.0.0.1:5173/`. Crea un perfil con tu nombre; no se solicita correo ni contraseña.

```sh
npm test          # Pruebas de dominio y contenido con Vitest
npm run build    # TypeScript estricto + compilación estática
npm run check    # Pruebas y compilación
npm run preview  # Servir dist, normalmente en el puerto 4173
```

No abras `index.html` con `file://`: los módulos y workers necesitan un servidor HTTP. En producción no se necesita Node ni ningún backend.

## Lo que incluye

- Diez mundos con identidad propia, 60 lecciones, diez jefes y un integrador independiente: **71 actividades obligatorias**.
- Siete tipos: opción múltiple, huecos individuales, ordenamiento mediante botones utilizables con ratón/teclado/táctil, diagnóstico de errores, predicción de salida, editor de código y decisiones de diseño POO.
- 510 configuraciones de ejercicios. Cada recorrido Aprendiz o Universitario presenta 390 ejercicios; Experto presenta 450. Hay cinco ejercicios por lección en los dos primeros modos, seis en Experto, ocho por jefe y diez en el integrador. Los jefes recuperan contenidos previos y añaden construcción de código y revisión de contratos.
- Mapa vertical, recorrido en zigzag, estados de nodo, selección de misión, navegación por mundo, recuerdo del nivel actual y repetición de actividades aprobadas.
- Laboratorio Monaco con sintaxis C#, numeración, restablecimiento y alternativa de texto accesible. Editor, lenguaje y worker se empaquetan localmente y se cargan bajo demanda.
- Resultados, revisión de soluciones después de terminar, perfil, estadísticas reales por tema, racha diaria, niveles, avatar original SVG evolutivo y ocho insignias.
- Persistencia local de perfil, progreso, borrador de respuesta, intento activo y certificado; exportación/importación JSON con validación y reinicio con confirmación.
- Pantalla final y certificado PNG de **2246 × 1588**, con vista previa responsive, nombre editable mediante acción explícita e identificador estable.

## Dificultad y puntuación

| Modo          | Vidas | Aprobación | Pistas por intento |     Penalización por error |
| ------------- | ----: | ---------: | -----------------: | -------------------------: |
| Aprendiz      |     5 |        70% |                  3 | Sin penalización adicional |
| Universitario |     3 |        85% |                  1 |                  −5 puntos |
| Experto       |     1 |        95% |                  0 |                 −10 puntos |

Una respuesta correcta al primer intento aporta un punto de crédito. Corregir tras un error aporta medio punto. La calificación es el porcentaje de créditos sobre **todos** los ejercicios del intento, menos la penalización del modo. Las preguntas no resueltas cuentan como cero. Perder todas las vidas o abandonar impide aprobar ese intento. Cada nuevo intento renueva las vidas. Cambiar el modo en el perfil no modifica un intento ya iniciado.

La mejor nota y una aprobación previa nunca se reducen. Se conserva el último intento completo, el contador histórico de intentos y los errores acumulados. El historial detallado no crece ilimitadamente: solo se conserva el último intento por actividad, además de los máximos y contadores.

XP: 10 por ejercicio correcto, hasta 5 extra si fue correcto al primer intento sin pista; 50 por aprobar una actividad; 25 extra por 100%; 200 por jefe y 150 por completar su mundo. Cada ejercicio guarda su máximo de XP y cada actividad su máximo de bonificaciones. Una repetición solo entrega la diferencia hasta ese máximo. El XP de dominio y el de hitos se calculan por separado.

El nivel, las insignias, los mundos conquistados y las estadísticas se derivan de resultados persistidos, evitando duplicar fuentes de verdad. La calificación global promedia las mejores notas de las 71 actividades. Las pendientes cuentan como cero.

## Evaluación de C#: alcance real

**No se compila ni se ejecuta C#.** No hay `eval`, backend, APIs de evaluación, bases de datos ni servicios de pago.

`CodeEvaluator` define una interfaz que admite evaluadores síncronos o asíncronos. `RuleCodeEvaluator` implementa comparación de tokens normalizados, fragmentos obligatorios, patrones y equilibrio de delimitadores. El tokenizador elimina comentarios y conserva el contenido y las mayúsculas de los literales. No es un parser completo de C#.

Los desafíos actuales de código usan contratos restringidos con nombres, operaciones y orden explícitos. Se aceptan cambios de espacios y comentarios; una implementación semánticamente equivalente puede rechazarse si cambia la forma requerida. La interfaz y los enunciados explican esta limitación. El ordenamiento reconstruye el fragmento de referencia; no pretende reconocer todos los órdenes válidos.

Para incorporar compilación real, implementar otro `CodeEvaluator`, añadir el ciclo asíncrono al controlador y aislar ejecución y límites de recursos. La evaluación de programación libre queda para esa integración futura.

Las soluciones están en los recursos descargados del sitio estático. Son inspeccionables y el progreso local es modificable. Los guardas centralizados impiden saltarse niveles cambiando botones o visitando rutas, **pero no son un sistema antifraude ni una evaluación académica segura**.

## Persistencia y recuperación

- Clave: `csharp-quest-save`, esquema versión 1, middleware `persist` de Zustand.
- Se comprueban estructura, tipos, rangos, relaciones de desbloqueo, coherencia del intento y requisitos del certificado antes de aceptar datos.
- JSON corrupto se conserva en `csharp-quest-save-recovery`; la interfaz avisa y permite descargar esa copia desde el perfil.
- Un guardado de versión posterior queda protegido contra sobrescritura. Se debe usar una versión compatible para recuperarlo.
- Cuando localStorage está deshabilitado o lleno, el juego sigue en memoria y muestra un aviso para exportar. No hay sincronización entre dispositivos ni pestañas simultáneas; utiliza una pestaña de juego a la vez.
- La importación válida pide confirmación antes de reemplazar el perfil. Exporta antes una copia si quieres conservar ambos.

El certificado exige las 60 lecciones, los diez jefes y el integrador aprobados. No existe una bandera aislada `courseCompleted`. Guarda ID, nombre, fecha, nota de emisión, fecha de elegibilidad y versión. Descargar nuevamente no genera otro ID. Es un reconocimiento educativo de la plataforma, **sin acreditación universitaria ni verificación pública**.

## Estructura

```text
src/
  app/                   Enrutamiento HashRouter y límite de errores
  components/            Marco de navegación y avatar SVG
  data/                  Mundos, temas, objetivos y desafíos tipados
  engine/evaluators/     Evaluación de siete tipos de ejercicio
  engine/progression/    Desbloqueo, certificado, estadísticas e insignias
  engine/scoring/        Dificultades, puntuación, niveles y XP
  features/              Inicio, mapa, lección, resultados, perfil y certificado
  store/                 Zustand, validación y recuperación del guardado
  types/                 Uniones discriminadas y modelos del dominio
  utils/                 Descarga y sanitización
  styles/                Tailwind, variables y diseño responsive
tests/                   Vitest y página de QA exclusiva de desarrollo
.github/workflows/       Pruebas, build y despliegue Pages
```

Para añadir un tema, define su contenido en `topics.ts`, su objetivo preciso en `fillGoals.ts` y revisa la composición de `curriculum.ts`. Añade casos representativos al evaluador y conserva los IDs existentes para no romper el progreso. No pongas respuestas dentro de los componentes React.

## GitHub Pages

1. Sube estos archivos a un repositorio GitHub con rama `main`.
2. En **Settings → Pages → Build and deployment**, selecciona **GitHub Actions**.
3. Un push a `main`, o la ejecución manual del workflow, instala con `npm ci`, ejecuta las pruebas, compila y publica `dist`.
4. Las pull requests ejecutan las comprobaciones sin desplegar.

`base: './'` resuelve los recursos dentro de cualquier subcarpeta de repositorio. `HashRouter` permite direcciones como `https://usuario.github.io/JuegoPoo/#/map` sin reglas de reescritura. No se requiere configurar el nombre del repositorio en el código.

La carpeta recibida no contenía `.git` ni remoto; el workflow está preparado, pero esta entrega no publica una URL de GitHub Pages. Documentación oficial: [Vite](https://vite.dev/guide/) y [workflows para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## QA

Las pruebas cubren estructura de las 71 actividades, soluciones, los tres modos completos, bloqueos, notas, vidas, pistas, repetición, límites de XP, certificado, importaciones y almacenamiento dañado. El aviso de tamaño del chunk de Monaco es esperado: el editor se carga bajo demanda, no en el arranque del mapa.

Para reproducir QA visual, inicia Vite y abre `/tests/browser-fixture.html` en un origen separado del perfil real, por ejemplo `http://localhost:5173` para QA y `http://127.0.0.1:5173` para jugar. Los botones crean **datos de prueba**, recorriendo los evaluadores reales, para revisar el laboratorio y el diploma sin repetir manualmente todo el curso. Esa página y los helpers de prueba no se incluyen en `dist`.

Se comprobaron en el navegador: alta local, primera lección con error y recuperación, ordenamiento, resultados, Monaco, conservación del borrador tras recarga y PNG real del certificado con nombre largo. Se dispone de enlace alternativo a la imagen cuando el navegador integrado no entrega el archivo a su gestor de descargas. Para guardar en disco también puede abrirse el sitio en Chrome, Edge o Firefox.

## Dependencias

Todas las dependencias están fijadas reproduciblemente por `package-lock.json`. React, Vite, Tailwind, Router, Zustand, Monaco, Lucide, html-to-image y Vitest son locales. El override de DOMPurify actualiza la dependencia transitiva de Monaco a una versión corregida; no se utiliza directamente. Las fuentes son del sistema, sin CDN.
