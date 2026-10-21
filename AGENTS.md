# Proyecto: C# Quest — El camino del programador

## 1. Rol y objetivo

Actúa como arquitecto de software senior, desarrollador frontend especializado en React y TypeScript, diseñador de videojuegos educativos y especialista en enseñanza de programación.

Tu objetivo es desarrollar una aplicación web completa llamada **C# Quest**, un videojuego educativo inspirado en el sistema de progresión de Duolingo, pero con una dificultad propia de una asignatura universitaria de programación.

El juego enseñará fundamentos del lenguaje C# y programación orientada a objetos (POO) mediante un camino de aprendizaje compuesto por mundos, lecciones, desafíos, recompensas y evaluaciones.

La aplicación debe permitir que los estudiantes aprendan progresivamente desde variables y estructuras de control hasta herencia, polimorfismo, interfaces, colecciones y diseño orientado a objetos.

El videojuego debe poder publicarse gratuitamente en GitHub Pages y funcionar desde cualquier navegador moderno.

**No quiero una maqueta visual ni un prototipo con botones sin funcionalidad. Quiero una aplicación funcional con navegación, contenido educativo, evaluaciones, persistencia y sistema de progresión.**

---

## 2. Tecnologías obligatorias

Utiliza las siguientes tecnologías:

| Tecnología | Uso |
|---|---|
| React | Interfaz del videojuego |
| TypeScript | Lógica de aplicación |
| Vite | Compilación y desarrollo |
| Tailwind CSS | Diseño visual |
| React Router | Navegación |
| Zustand | Estado global |
| localStorage | Persistencia local |
| Monaco Editor | Editor de código C# |
| Lucide React | Iconografía |
| html-to-image | Generación de certificados PNG |
| Vitest | Pruebas automatizadas |

Se permite instalar otras librerías pequeñas cuando estén justificadas.

Condiciones:

- No utilizar ASP.NET Core como backend.
- No utilizar servicios que requieran pagos.
- No utilizar bases de datos externas.
- No implementar autenticación en servidor.
- No depender de APIs externas para funcionar.
- No utilizar CDN obligatorios.
- Evitar dependencias innecesarias.
- Configurar todas las rutas y recursos para GitHub Pages.
- Utilizar versiones estables y compatibles de las dependencias.

La aplicación debe funcionar como sitio estático.

---

# 3. Concepto general del videojuego

Nombre: **C# Quest**

Subtítulo: **El camino del programador orientado a objetos**

El estudiante interpreta el papel de un aprendiz que debe convertirse en arquitecto de software.

Para lograrlo recorrerá diez mundos temáticos, donde cada mundo representa un conjunto de competencias en C# y POO.

Cada mundo contiene:

- Seis lecciones.
- Un jefe final.
- Una ambientación visual propia.
- Recompensas por completarlo.
- Nuevas competencias desbloqueables.

En total:

- 10 mundos.
- 60 lecciones.
- 10 jefes finales.
- 70 actividades principales.
- Un desafío integrador final.
- Un certificado de aprobación descargable.

Los jefes finales deben integrar diferentes conocimientos y no ser simples cuestionarios.

El juego debe ser exigente. Un estudiante no debería completarlo únicamente memorizando definiciones.

---

# 4. Diseño visual general

## 4.1 Estilo artístico

Diseña una interfaz que combine:

- Gamificación de Duolingo.
- Progresión visual de videojuegos RPG.
- Estética tecnológica moderna.
- Componentes de una plataforma educativa profesional.

No copies logotipos, personajes ni elementos gráficos protegidos de Duolingo.

Utiliza una identidad gráfica original para C# Quest.

Características visuales:

- Tema oscuro predominante.
- Fondos azul oscuro y gris carbón.
- Color principal azul eléctrico.
- Color secundario violeta.
- Verde para respuestas correctas.
- Rojo para errores.
- Dorado para recompensas y jefes finales.
- Tarjetas con bordes redondeados.
- Iconos simples.
- Animaciones suaves y discretas.
- Tipografía moderna y legible.
- Código con fuente monoespaciada.

Paleta inicial sugerida:

- Fondo principal: `#0B1020`
- Superficie: `#151D2E`
- Superficie elevada: `#202C43`
- Azul principal: `#3B82F6`
- Violeta: `#8B5CF6`
- Verde: `#22C55E`
- Rojo: `#EF4444`
- Dorado: `#F59E0B`
- Texto principal: `#F8FAFC`
- Texto secundario: `#94A3B8`

Centraliza los colores y estilos mediante variables de diseño.

La interfaz debe funcionar correctamente en computadoras, tablets y teléfonos.

## 4.2 Identidad del videojuego

Crear una identidad propia para C# Quest.

Diseñar un logotipo textual con el nombre:

**C# QUEST**

Agregar un símbolo tecnológico que represente programación, como llaves `{ }`, un terminal o un escudo digital.

Crear un avatar original del estudiante, con estilo RPG tecnológico.

El avatar puede evolucionar visualmente al completar mundos.

No utilizar imágenes remotas obligatorias. Los recursos gráficos deben ser locales o generados mediante CSS/SVG.

---

# 5. Pantallas del videojuego

Desarrollar las siguientes pantallas.

## Pantalla 1: Inicio

Debe mostrar:

- Logotipo del videojuego.
- Nombre C# Quest.
- Subtítulo.
- Ilustración temática.
- Descripción breve del juego.
- Botón "Comenzar aventura".
- Botón "Continuar aventura", cuando exista progreso previo.
- Indicador de cantidad de mundos y lecciones.
- Diseño atractivo, similar a la pantalla de inicio de un videojuego.

Al comenzar por primera vez, solicitar el nombre del estudiante.

Guardar el nombre en localStorage.

No solicitar correo electrónico ni contraseña.

## Pantalla 2: Mapa de aprendizaje

Esta será la pantalla principal.

Diseñar un camino vertical con nodos conectados, similar al recorrido de niveles de Duolingo.

Los nodos deben tener un recorrido visual en zigzag.

Cada nodo representa una lección o un jefe final.

Estados de cada nodo:

1. Bloqueado.
2. Disponible.
3. En progreso.
4. Completado.
5. Dominado.

Utilizar iconos diferentes para cada estado.

Los nodos completados deben mostrar una marca de verificación.

Los nodos bloqueados deben mostrar un candado.

El nodo actual debe destacarse mediante una animación discreta.

Al seleccionar un nodo disponible, mostrar una tarjeta con:

- Nombre de la lección.
- Mundo correspondiente.
- Objetivo de aprendizaje.
- Dificultad.
- Recompensa en XP.
- Botón "Iniciar lección".

Los nodos bloqueados no deben permitir iniciar la lección.

El mapa debe desplazarse verticalmente.

Debe recordar automáticamente la última lección disponible.

El sistema debe permitir volver a lecciones anteriores para practicar.

## Pantalla 3: Lección interactiva

Mostrar:

- Nombre de la lección.
- Nombre del mundo.
- Número del ejercicio actual.
- Barra de progreso.
- Vidas restantes.
- XP disponibles.
- Enunciado del ejercicio.
- Área interactiva según el tipo de pregunta.
- Botón "Comprobar".
- Botón "Continuar".
- Opción para abandonar la lección.

Al comprobar una respuesta:

- Mostrar si es correcta o incorrecta.
- Explicar el concepto.
- Actualizar la puntuación.
- Descontar vidas si corresponde.
- Registrar los errores.
- Permitir continuar de acuerdo con las reglas del ejercicio.

No mostrar automáticamente la respuesta correcta después del primer error en ejercicios difíciles.

Cuando termine la lección, mostrar la pantalla de resultados.

## Pantalla 4: Laboratorio de código

Crear un laboratorio para los ejercicios avanzados.

Utilizar Monaco Editor configurado para C#.

El editor debe permitir:

- Escribir código.
- Resaltar sintaxis.
- Mostrar números de línea.
- Insertar fragmentos iniciales.
- Restablecer el código.
- Mostrar instrucciones.
- Comprobar respuestas.
- Visualizar retroalimentación.

IMPORTANTE:

GitHub Pages no ejecuta C# en un servidor.

Por tanto, implementar inicialmente un evaluador local por reglas, con ejercicios diseñados específicamente para ese mecanismo.

Este evaluador debe poder:

- Comparar respuestas exactas normalizadas.
- Comprobar fragmentos obligatorios.
- Validar estructuras básicas mediante reglas.
- Evaluar respuestas de predicción de salida.
- Reconocer patrones simples previamente definidos.

No considerar una coincidencia textual como prueba de equivalencia funcional entre dos programas.

No afirmar que un ejercicio ha sido compilado si solamente fue evaluado mediante reglas.

No ejecutar código C# utilizando `eval`, JavaScript o mecanismos equivalentes.

Para ejercicios de programación libre que requieran compilación real, mostrar claramente que la evaluación automática completa estará disponible en una versión posterior.

Diseñar una interfaz `CodeEvaluator` extensible que permita incorporar posteriormente un evaluador real de C# mediante WebAssembly o un servicio de compilación aislado.

## Pantalla 5: Resultados de lección

Al finalizar cada lección, mostrar:

- Resultado obtenido.
- Respuestas correctas e incorrectas.
- Puntos ganados.
- XP.
- Cantidad de intentos.
- Competencias practicadas.
- Estado de aprobación.
- Recomendaciones de repaso.

Incluir los botones:

- Repetir lección.
- Continuar al siguiente nivel.
- Volver al mapa.

Agregar una animación sencilla cuando el estudiante apruebe.

## Pantalla 6: Perfil del estudiante

Mostrar:

- Nombre.
- Avatar.
- Nivel de jugador.
- XP acumulados.
- Mundos completados.
- Lecciones aprobadas.
- Porcentaje de progreso.
- Cantidad de errores.
- Racha de actividades.
- Insignias conseguidas.
- Competencias dominadas.

Agregar una sección de estadísticas por tema.

Ejemplo:

- Fundamentos C#: 95%.
- Estructuras de control: 90%.
- Métodos: 85%.
- Encapsulamiento: 70%.
- Herencia: 60%.
- Polimorfismo: 40%.

Los porcentajes deben calcularse a partir de resultados reales, no ser valores decorativos.

## Pantalla 7: Certificado de aprobación

Desarrollar el módulo de certificado digital descrito en la sección 13 de este documento.

---

# 6. Estructura curricular completa

Construir los siguientes mundos y lecciones.

Cada lección debe tener:

- ID.
- Título.
- Descripción.
- Objetivo.
- Mundo.
- Orden.
- Dificultad.
- Lista de ejercicios.
- Recompensa.
- Requisitos de desbloqueo.

## MUNDO 1: La aldea de C#

Tema: fundamentos del lenguaje C#.

Lecciones:

1. Mi primer programa en C#.
2. Variables y constantes.
3. Tipos de datos.
4. Operadores aritméticos y relacionales.
5. Conversión de tipos de datos.
6. Expresiones y precedencia de operadores.

Jefe final:

**El calculador perdido**

El estudiante debe resolver un conjunto de problemas relacionados con cálculos de estadísticas de un personaje RPG.

## MUNDO 2: El bosque de la lógica

Tema: estructuras de control.

Lecciones:

7. Condicionales `if` y `else`.
8. Operadores lógicos.
9. Estructura `switch`.
10. Ciclo `for`.
11. Ciclos `while` y `do-while`.
12. Control de flujo y bucles anidados.

Jefe final:

**La inteligencia del enemigo**

El estudiante debe diseñar la lógica de decisión de un enemigo según sus condiciones de vida, energía y distancia.

## MUNDO 3: La torre de los métodos

Tema: programación modular.

Lecciones:

13. Declaración de métodos.
14. Parámetros y argumentos.
15. Valores de retorno.
16. Alcance de las variables.
17. Sobrecarga de métodos.
18. Organización y reutilización de código.

Jefe final:

**La biblioteca de hechizos**

El estudiante debe construir métodos reutilizables para calcular ataques, defensas, curaciones y habilidades.

## MUNDO 4: El reino de los objetos

Tema: introducción a POO.

Lecciones:

19. ¿Qué es una clase?
20. Objetos e instancias.
21. Atributos y comportamiento.
22. Constructores.
23. Métodos de instancia.
24. Referencias y estado de los objetos.

Jefe final:

**El nacimiento del héroe**

Diseñar una clase `Personaje` con propiedades, constructores y comportamientos.

## MUNDO 5: La fortaleza de la encapsulación

Tema: encapsulamiento.

Lecciones:

25. Modificadores de acceso.
26. Campos privados y propiedades públicas.
27. Propiedades `get` y `set`.
28. Validaciones e invariantes.
29. Miembros estáticos.
30. Encapsulamiento aplicado.

Jefe final:

**El tesoro protegido**

Diseñar una clase `CuentaBancaria` que controle depósitos, retiros y restricciones de saldo.

## MUNDO 6: El árbol de la herencia

Tema: herencia.

Lecciones:

31. Introducción a la herencia.
32. Clases base y derivadas.
33. Uso de `base`.
34. Métodos virtuales.
35. Sobrescritura con `override`.
36. Clases abstractas.

Jefe final:

**Las tres clases del reino**

Implementar guerreros, magos y arqueros que compartan atributos y comportamientos.

## MUNDO 7: Las formas del polimorfismo

Tema: polimorfismo e interfaces.

Lecciones:

37. Polimorfismo.
38. Despacho dinámico.
39. Introducción a interfaces.
40. Implementación de interfaces.
41. Sustitución de objetos.
42. Diseño de comportamientos intercambiables.

Jefe final:

**La batalla de las habilidades**

Crear diferentes habilidades que implementen un contrato común.

## MUNDO 8: El inventario infinito

Tema: colecciones y genéricos.

Lecciones:

43. Arreglos.
44. Listas genéricas.
45. Diccionarios.
46. Recorridos con `foreach`.
47. Genéricos.
48. Introducción a LINQ.

Jefe final:

**El inventario del aventurero**

Construir un inventario con objetos, búsquedas, filtros y operaciones básicas.

## MUNDO 9: La mazmorra de los errores

Tema: excepciones, depuración y pruebas.

Lecciones:

49. Errores de compilación y ejecución.
50. Manejo de excepciones.
51. `try`, `catch` y `finally`.
52. Excepciones personalizadas.
53. Depuración de programas.
54. Introducción a pruebas unitarias.

Jefe final:

**El código corrupto**

Analizar, corregir y verificar un pequeño sistema defectuoso.

## MUNDO 10: El arquitecto supremo

Tema: diseño orientado a objetos.

Lecciones:

55. Asociación entre objetos.
56. Composición.
57. Responsabilidad única.
58. Principios SOLID básicos.
59. Introducción a UML.
60. Refactorización y diseño de clases.

Jefe final:

**El arquitecto de C#**

Resolver un desafío integrador de diseño de un sistema RPG orientado a objetos.

El desafío debe combinar los conocimientos de los mundos anteriores.

---

# 7. Tipos de ejercicios

Implementar un motor de ejercicios extensible.

Cada ejercicio debe declarar su tipo y su configuración.

Los tipos iniciales serán:

### Tipo 1: Opción múltiple

Mostrar una pregunta y varias respuestas.

Admitir únicamente una respuesta correcta.

Incluir explicación después de responder.

### Tipo 2: Completar código

Mostrar código C# con uno o varios espacios vacíos.

El estudiante seleccionará o escribirá los fragmentos faltantes.

El evaluador debe validar los espacios individualmente.

### Tipo 3: Ordenar código

Mostrar varias líneas o fragmentos desordenados.

El estudiante debe organizar los fragmentos en el orden correcto.

La interacción debe funcionar con ratón, teclado y pantalla táctil.

### Tipo 4: Identificar errores

Mostrar código C# incorrecto.

El estudiante debe identificar el error o seleccionar la corrección correspondiente.

### Tipo 5: Predecir resultado

Mostrar un fragmento de código y preguntar por su salida.

La salida esperada debe estar definida previamente en el contenido del ejercicio.

### Tipo 6: Completar una clase

Mostrar un editor con una clase incompleta.

El estudiante debe introducir campos, propiedades, constructores o métodos.

Evaluar mediante reglas explícitas mientras no exista un compilador real.

### Tipo 7: Desafío de diseño POO

Presentar un problema para decidir:

- Qué clases crear.
- Qué atributos utilizar.
- Qué métodos implementar.
- Qué relaciones establecer.
- Cuándo utilizar herencia.
- Cuándo utilizar interfaces.
- Cuándo utilizar composición.

Los ejercicios deben ser gradualmente más complejos.

---

# 8. Sistema de dificultad

Implementar tres modos.

### Aprendiz

- Cinco vidas por intento.
- Aprobación desde 70%.
- Hasta tres pistas.
- Ejercicios guiados.

### Universitario

- Tres vidas por intento.
- Aprobación desde 85%.
- Una pista.
- Mayor proporción de ejercicios de código.
- Penalización de puntuación al fallar.

### Experto

- Una vida por intento.
- Aprobación desde 95%.
- Sin pistas.
- Mayor complejidad.
- Sin soluciones directas durante el intento.

La dificultad seleccionada debe almacenarse.

Las vidas se reinician según las reglas de cada nuevo intento.

No bloquear permanentemente el aprendizaje por perder todas las vidas.

Los niveles deben poder repetirse.

Para cada nivel, guardar tanto la mejor puntuación como el último intento.

No reducir una calificación aprobada cuando el estudiante repite una lección.

---

# 9. Sistema de experiencia y recompensas

Implementar un sistema de puntos XP.

Propuesta:

- Respuesta correcta: 10 XP.
- Respuesta correcta sin pistas: bonificación de 5 XP.
- Completar una lección: 50 XP.
- Aprobar con 100%: bonificación de 25 XP.
- Completar un mundo: 150 XP.
- Derrotar al jefe final: 200 XP.

Evitar que repetir indefinidamente ejercicios sencillos permita obtener XP ilimitados.

Separar la experiencia por dominio de contenido de la experiencia general del jugador.

Agregar niveles de jugador:

- Aprendiz.
- Programador novato.
- Desarrollador.
- Programador avanzado.
- Arquitecto de software.

Crear insignias para logros como:

- Primera clase creada.
- Diez lecciones aprobadas.
- Primer jefe derrotado.
- Tres mundos completados.
- Dominio de encapsulamiento.
- Dominio de herencia.
- Dominio de polimorfismo.
- Juego completado.

Las recompensas deben calcularse con reglas centralizadas.

---

# 10. Sistema de progresión

Implementar un camino de desbloqueo secuencial.

Reglas:

1. La primera lección se encuentra disponible desde el inicio.
2. La siguiente lección se desbloquea después de aprobar la anterior.
3. El jefe final se desbloquea después de aprobar las seis lecciones de su mundo.
4. El siguiente mundo se desbloquea después de aprobar el jefe final anterior.
5. Los niveles aprobados pueden repetirse.
6. Una lección repetida no pierde su aprobación anterior.
7. El porcentaje de progreso debe calcularse dinámicamente.
8. No permitir desbloquear lecciones mediante modificaciones simples en la interfaz.

La lógica de desbloqueo debe estar centralizada y tener pruebas automatizadas.

Registrar:

- Lecciones aprobadas.
- Mejor calificación.
- Fecha de aprobación.
- Número de intentos.
- Errores.
- XP obtenidos.
- Mundos completados.

---

# 11. Sistema de contenidos

No escribir todas las preguntas directamente dentro de componentes React.

Diseñar un motor de contenidos basado en archivos JSON o módulos TypeScript tipados.

Ejemplo conceptual:

```json
{
  "id": "M04-L19-E01",
  "worldId": 4,
  "lessonId": 19,
  "type": "multiple-choice",
  "difficulty": "beginner",
  "question": "¿Qué palabra clave se utiliza para declarar una clase en C#?",
  "code": null,
  "options": [
    { "id": "A", "text": "object" },
    { "id": "B", "text": "class" },
    { "id": "C", "text": "new" },
    { "id": "D", "text": "struct" }
  ],
  "correctAnswer": "B",
  "explanation": "La palabra clave class permite declarar una clase en C#.",
  "xp": 10
}
```

Crear interfaces TypeScript para los diferentes tipos de ejercicio.

Utilizar uniones discriminadas cuando corresponda.

Separar los enunciados y datos educativos de los componentes visuales.

No mostrar respuestas correctas al usuario antes de evaluar.

IMPORTANTE: en un sitio estático, las respuestas contenidas en archivos descargados por el navegador no pueden considerarse secretas. Por tanto, la evaluación local sirve para aprendizaje y práctica, pero no proporciona protección contra manipulación.

Cada lección debe incluir suficientes ejercicios para practicar, no solo una pregunta.

Preparar el sistema para manejar al menos cinco ejercicios por lección y un número mayor en los jefes finales.

---

# 12. Persistencia local

Utilizar Zustand con persistencia en localStorage.

Guardar:

- Identificador local del jugador.
- Nombre.
- Modo de dificultad.
- Avatar.
- XP.
- Nivel.
- Mundos completados.
- Lecciones aprobadas.
- Resultados de ejercicios.
- Intentos.
- Insignias.
- Última lección.
- Fecha de inicio.
- Fecha de último acceso.
- Información del certificado.

Agregar versionado del estado persistido para futuras migraciones.

Implementar recuperación segura de datos cuando localStorage tenga información corrupta.

Crear una función para exportar el progreso a JSON y otra para importarlo.

Agregar una opción para reiniciar el progreso con confirmación.

No borrar el avance del estudiante automáticamente al actualizar la aplicación.

---

# 13. Certificado final de aprobación

Esta funcionalidad es obligatoria.

Al terminar el juego, el estudiante debe desbloquear un certificado digital.

## 13.1 Condiciones para obtener el certificado

El certificado solamente podrá generarse cuando:

1. Las 60 lecciones estén aprobadas.
2. Los 10 jefes finales estén aprobados.
3. El desafío integrador final esté aprobado.
4. No existan actividades obligatorias pendientes.

La aprobación debe calcularse a partir del estado real del progreso.

No utilizar únicamente una bandera `courseCompleted` como fuente de verdad.

No permitir que un estudiante acceda a la pantalla de certificado desde la navegación normal si no cumple los requisitos.

## 13.2 Datos del certificado

El certificado debe incluir:

**C# QUEST**

**CERTIFICADO DE APROBACIÓN**

Texto central:

"Se certifica que"

Nombre completo del estudiante.

"Ha completado satisfactoriamente el programa de formación"

**FUNDAMENTOS DE C# Y PROGRAMACIÓN ORIENTADA A OBJETOS**

"Demostrando conocimientos en fundamentos del lenguaje C#, clases, objetos, encapsulamiento, herencia, polimorfismo, interfaces, colecciones y principios de diseño orientado a objetos."

Información inferior:

- Fecha de emisión.
- Identificador del certificado.
- Número de mundos completados.
- Número de lecciones aprobadas.
- Calificación global.
- Nombre de la plataforma: C# Quest.

Texto inferior:

"Certificado de finalización emitido automáticamente por la plataforma educativa C# Quest."

No utilizar sellos universitarios, firmas de autoridades ni acreditaciones institucionales inexistentes.

El documento debe presentarse como un reconocimiento educativo emitido por la plataforma, no como una certificación oficial de una universidad.

## 13.3 Diseño del certificado

Crear un diseño horizontal con proporción similar a una hoja A4 apaisada.

Características:

- Fondo blanco marfil.
- Borde doble azul oscuro y dorado.
- Ornamentos geométricos discretos.
- Título centrado.
- Nombre del estudiante destacado con tipografía elegante.
- Texto académico legible.
- Logotipo de C# Quest.
- Insignia de finalización.
- Fecha e identificador en la parte inferior.
- Firma gráfica institucional simbólica, identificada claramente como emisión automática.

El certificado debe verse como un diploma profesional y no como una simple tarjeta.

## 13.4 Generación y descarga

Utilizar `html-to-image` o una solución equivalente.

Crear componentes:

- `CertificatePage.tsx`
- `CertificateCard.tsx`
- `CertificateDownloadButton.tsx`

Implementar:

- Vista previa.
- Edición o confirmación del nombre.
- Generación del certificado.
- Descarga como PNG.
- Botón "Volver al mapa".
- Botón "Volver a descargar".

Generar una imagen PNG de alta resolución.

Mantener una proporción fija durante la exportación, independientemente del tamaño de pantalla.

Esperar la carga de fuentes antes de generar la imagen.

El archivo debe descargarse con un nombre como:

`CSharpQuest_Certificado_NombreApellido.png`

Sanitizar el nombre utilizado en el archivo.

## 13.5 Identificador de certificado

Generar un identificador local mediante `crypto.randomUUID()` o mecanismo equivalente.

Guardar:

- ID.
- Nombre del estudiante.
- Fecha de emisión.
- Calificación al emitirlo.
- Versión del programa.
- Fecha en que cumplió los requisitos.

Una vez emitido, no generar un nuevo ID cada vez que se descarga.

Los cambios posteriores en el nombre deben estar controlados mediante una acción explícita.

IMPORTANTE:

El certificado no podrá verificarse públicamente de forma confiable porque el proyecto no tiene backend y el progreso está almacenado localmente.

No afirmar que el identificador constituye una validación oficial.

Diseñar una estructura extensible para añadir verificación pública en el futuro.

---

# 14. Pantalla final del videojuego

Después de aprobar el último desafío, mostrar una pantalla especial.

Título:

**¡Te has convertido en Arquitecto de C#!**

Elementos:

- Animación de celebración.
- Insignia final.
- Experiencia acumulada.
- Total de lecciones completadas.
- Mundos conquistados.
- Calificación global.
- Mensaje de felicitación.
- Botón "Ver certificado".
- Botón "Descargar certificado".
- Botón "Volver al mapa".

Diseñar esta pantalla como el final de una aventura RPG.

Debe sentirse como un logro importante después de completar todo el camino.

---

# 15. Arquitectura del código

Organizar el proyecto utilizando una estructura modular.

```text
csharp-quest/
│
├── public/
│   ├── images/
│   ├── icons/
│   ├── sounds/
│   └── fonts/
│
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── router.tsx
│   │   └── providers.tsx
│   │
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── game/
│   │   └── common/
│   │
│   ├── features/
│   │   ├── player/
│   │   ├── worlds/
│   │   ├── lessons/
│   │   ├── exercises/
│   │   ├── progression/
│   │   ├── rewards/
│   │   ├── statistics/
│   │   └── certificates/
│   │
│   ├── data/
│   │   ├── worlds/
│   │   ├── lessons/
│   │   └── achievements/
│   │
│   ├── engine/
│   │   ├── evaluators/
│   │   ├── scoring/
│   │   ├── progression/
│   │   └── validation/
│   │
│   ├── store/
│   │   └── gameStore.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   └── styles/
│
├── tests/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

La estructura puede ajustarse si una organización más sencilla resulta técnicamente superior.

Evitar sobreingeniería.

La lógica de negocio no debe quedar mezclada con el diseño visual.

---

# 16. Navegación

Implementar las siguientes rutas:

- `/` — Inicio.
- `/map` — Mapa de aprendizaje.
- `/world/:worldId` — Mundo seleccionado.
- `/lesson/:lessonId` — Lección.
- `/lesson/:lessonId/results` — Resultados.
- `/profile` — Perfil.
- `/achievements` — Insignias.
- `/certificate` — Certificado.
- `/final` — Pantalla de finalización.

Utilizar `HashRouter` para facilitar la compatibilidad con GitHub Pages.

No permitir que una ruta altere el estado de aprobación por el simple hecho de visitarla.

Incluir una página para rutas desconocidas.

---

# 17. Desafíos finales y narrativa

Los desafíos finales de cada mundo deben conectarse narrativamente.

El estudiante desarrolla gradualmente un pequeño sistema RPG.

Ejemplo:

- Mundo 1: estadísticas del personaje.
- Mundo 2: decisiones de combate.
- Mundo 3: métodos de ataques.
- Mundo 4: clase Personaje.
- Mundo 5: protección de atributos.
- Mundo 6: clases de personajes.
- Mundo 7: habilidades polimórficas.
- Mundo 8: inventario.
- Mundo 9: corrección de errores.
- Mundo 10: arquitectura del sistema.

Las soluciones deben permanecer accesibles para repaso cuando el estudiante haya completado cada actividad.

No asumir que todos los ejercicios pueden ejecutarse directamente. Diseñar los desafíos iniciales para ser evaluados de manera honesta mediante el evaluador disponible.

---

# 18. Accesibilidad y experiencia de usuario

Implementar:

- Diseño responsive.
- Navegación con teclado.
- Etiquetas accesibles.
- Contraste suficiente.
- Estados de foco visibles