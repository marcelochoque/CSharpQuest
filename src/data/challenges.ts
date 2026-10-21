import type { DesignExercise } from '../types/game';
export interface Challenge {
  brief: string;
  starter: string;
  solution: string;
  decisions: DesignExercise['decisions'];
}
const decision = (label: string, correct: string, ...wrong: string[]) => ({
  label,
  correct,
  options: [correct, ...wrong],
});
export const challenges: Challenge[] = [
  {
    brief:
      'Reconstruye las estadísticas del héroe. Declara fuerza = 12 y arma = 5 como int. Calcula dano como (fuerza + arma) * 2 y muestra dano con Console.WriteLine, en ese orden. Conserva esos nombres.',
    starter: 'int fuerza = ___;\nint arma = ___;\nint dano = ___;\nConsole.WriteLine(___);',
    solution:
      'int fuerza = 12;\nint arma = 5;\nint dano = (fuerza + arma) * 2;\nConsole.WriteLine(dano);',
    decisions: [
      decision('Precisión del precio del equipo', 'decimal con sufijo m', 'int truncado', 'bool'),
      decision(
        'Daño antes de aplicar multiplicador',
        'Agrupar fuerza + arma con paréntesis',
        'Multiplicar solo el arma',
        'Convertir todo a string',
      ),
      decision(
        'Entrada de nivel inválida',
        'TryParse y mensaje de validación',
        'Parse sin gestionar fallo',
        'Aceptar cualquier texto como int',
      ),
    ],
  },
  {
    brief:
      'Completa Decidir: si vida <= 20 devuelve "Curar"; en otro caso si energia > 0 y distancia <= 2 devuelve "Atacar"; en cualquier otro caso "Esperar". Usa if con llaves y retornos en ese orden.',
    starter:
      'static string Decidir(int vida, int energia, int distancia) {\n// Implementa las tres decisiones.\n}',
    solution:
      'static string Decidir(int vida, int energia, int distancia) {\nif (vida <= 20) { return "Curar"; }\nif (energia > 0 && distancia <= 2) { return "Atacar"; }\nreturn "Esperar";\n}',
    decisions: [
      decision(
        'Prioridad con vida 10 y energía 5',
        'Curar antes de atacar',
        'Atacar siempre',
        'Evaluar distancia solamente',
      ),
      decision(
        'Condición de ataque',
        'Ambas condiciones mediante &&',
        'Una condición mediante ||',
        'Asignar energia = 1',
      ),
      decision(
        'Ciclo de turnos',
        'Actualizar estado para que pueda terminar',
        'Mantener la condición siempre true',
        'Usar una constante como contador',
      ),
    ],
  },
  {
    brief:
      'Implementa tres métodos static de expresión, en este orden: Dano(int a, int d) devuelve Math.Max(0, a - d); Curar(int vida, int n) devuelve Math.Min(100, vida + n); Defensa(int baseDefensa) devuelve baseDefensa * 2.',
    starter: '// Declara Dano, Curar y Defensa con retorno int.\n',
    solution:
      'static int Dano(int a, int d) => Math.Max(0, a - d);\nstatic int Curar(int vida, int n) => Math.Min(100, vida + n);\nstatic int Defensa(int baseDefensa) => baseDefensa * 2;',
    decisions: [
      decision(
        'Reutilizar hechizos',
        'Métodos que reciben datos y devuelven resultados',
        'Variables globales para cada daño',
        'Copiar y pegar cada cálculo',
      ),
      decision(
        'Curación en 99 con 5 puntos',
        'Limitar a 100',
        'Permitir 104 siempre',
        'Devolver cero',
      ),
      decision(
        'Probar Dano',
        'Ataque mayor, igual y menor que defensa',
        'Solo un ataque alto',
        'Solo verificar el nombre del método',
      ),
    ],
  },
  {
    brief:
      'Completa Personaje con propiedad pública int Vida de escritura privada. Constructor Personaje(int vida) asigna Math.Max(0, vida). Método público void RecibirDano(int dano) asigna Math.Max(0, Vida - Math.Max(0, dano)). Usa cuerpos con llaves y el orden indicado.',
    starter: 'class Personaje {\n// Propiedad, constructor y comportamiento.\n}',
    solution:
      'class Personaje {\npublic int Vida { get; private set; }\npublic Personaje(int vida) { Vida = Math.Max(0, vida); }\npublic void RecibirDano(int dano) { Vida = Math.Max(0, Vida - Math.Max(0, dano)); }\n}',
    decisions: [
      decision(
        'Dos héroes independientes',
        'Dos instancias con new',
        'Dos referencias al mismo objeto',
        'Vida static',
      ),
      decision(
        'Estado inicial válido',
        'Validar en el constructor',
        'Esperar a que otro método lo arregle',
        'No inicializar nunca',
      ),
      decision(
        'Identidad y copia',
        'Asignar una referencia comparte el objeto',
        'Asignar siempre clona todos los datos',
        'Todas las clases son tipos por valor',
      ),
    ],
  },
  {
    brief:
      'Construye CuentaBancaria: propiedad pública decimal Saldo con private set. Depositar(decimal n) devuelve bool: si n <= 0 retorna false; suma n a Saldo y retorna true. Retirar(decimal n): si n <= 0 || n > Saldo retorna false; resta n y retorna true. Usa los nombres y orden indicados, cuerpos con llaves y retornos sin llaves en los if.',
    starter: 'class CuentaBancaria {\n// Saldo, Depositar y Retirar.\n}',
    solution:
      'class CuentaBancaria {\npublic decimal Saldo { get; private set; }\npublic bool Depositar(decimal n) {\nif (n <= 0) return false;\nSaldo += n; return true;\n}\npublic bool Retirar(decimal n) {\nif (n <= 0 || n > Saldo) return false;\nSaldo -= n; return true;\n}\n}',
    decisions: [
      decision(
        'Retiro negativo',
        'Rechazarlo sin modificar saldo',
        'Restarlo para aumentar saldo',
        'Convertirlo silenciosamente en depósito',
      ),
      decision(
        'Encapsulamiento',
        'Solo operaciones validadas cambian Saldo',
        'Cualquier clase puede asignar Saldo',
        'El saldo es static para todas las cuentas',
      ),
      decision(
        'Límite de retiro',
        'Permitir retirar exactamente el saldo',
        'Rechazar siempre el saldo exacto',
        'Permitir saldo negativo',
      ),
    ],
  },
  {
    brief:
      'Declara abstract class Personaje con public abstract int Dano(). Crea, en orden, Guerrero, Mago y Arquero que heredan de Personaje y sobrescriben Dano con métodos de expresión => que devuelven 8, 12 y 10 respectivamente.',
    starter: '// Base abstracta y tres derivadas concretas.\n',
    solution:
      'abstract class Personaje { public abstract int Dano(); }\nclass Guerrero : Personaje { public override int Dano() => 8; }\nclass Mago : Personaje { public override int Dano() => 12; }\nclass Arquero : Personaje { public override int Dano() => 10; }',
    decisions: [
      decision(
        'Relación de dominio',
        'Mago es un Personaje',
        'Mago es un Inventario',
        'Personaje es un Arma',
      ),
      decision(
        'Comportamiento especializado',
        'override en cada derivada',
        'new para simular despacho virtual',
        'Un campo global por clase',
      ),
      decision(
        'Base abstracta',
        'No se instancia directamente',
        'Se instancia si no hay campos',
        'No puede tener métodos',
      ),
    ],
  },
  {
    brief:
      'Declara interface IHabilidad con int Usar(). Implementa Fuego e Hielo con public int Usar() => 12 y => 8, en ese orden. Combate tiene un campo privado readonly IHabilidad habilidad, constructor público Combate(IHabilidad h) que lo asigna, y public int Atacar() => habilidad.Usar().',
    starter: '// Contrato, dos habilidades y consumidor por composición.\n',
    solution:
      'interface IHabilidad { int Usar(); }\nclass Fuego : IHabilidad { public int Usar() => 12; }\nclass Hielo : IHabilidad { public int Usar() => 8; }\nclass Combate {\nprivate readonly IHabilidad habilidad;\npublic Combate(IHabilidad h) { habilidad = h; }\npublic int Atacar() => habilidad.Usar();\n}',
    decisions: [
      decision(
        'Añadir Rayo sin tocar Combate',
        'Implementar IHabilidad e inyectar Rayo',
        'Agregar un if por nombre a Combate',
        'Heredar Rayo de Combate',
      ),
      decision(
        'Contrato intercambiable',
        'Todas las habilidades respetan int Usar()',
        'Cada habilidad cambia el retorno',
        'El consumidor hace cast a Fuego',
      ),
      decision(
        'Compartir capacidad entre tipos distintos',
        'Interfaz común',
        'Obligar a una misma clase base siempre',
        'Duplicar la API de cada consumidor',
      ),
    ],
  },
  {
    brief:
      'Escribe en orden: var stock = new Dictionary<string, int>(); asigna stock["pocion"] = 3; incrementa con stock["pocion"] += 2; crea var disponibles = stock.Where(par => par.Value > 0).ToList(); imprime disponibles.Count. Supón System.Collections.Generic y System.Linq importados.',
    starter: '// Inventario por clave, actualización y filtro materializado.\n',
    solution:
      'var stock = new Dictionary<string, int>();\nstock["pocion"] = 3;\nstock["pocion"] += 2;\nvar disponibles = stock.Where(par => par.Value > 0).ToList();\nConsole.WriteLine(disponibles.Count);',
    decisions: [
      decision(
        'Buscar por clave ausente',
        'TryGetValue',
        'Acceso directo sin comprobación',
        'Usar índice negativo',
      ),
      decision(
        'Eliminar todos los agotados',
        'Seleccionar claves en una copia antes de eliminar',
        'Eliminar durante foreach del mismo diccionario',
        'Usar Count como clave',
      ),
      decision(
        'Capturar el filtro ahora',
        'ToList para materializar',
        'Where siempre materializa',
        'Guardar solo el nombre de la consulta',
      ),
    ],
  },
  {
    brief:
      'Repara la lectura de nivel. Declara int nivel = 0; en try asigna nivel = int.Parse("x"); captura FormatException y asigna nivel = -1; en finally imprime "Fin"; después imprime nivel. Usa llaves en los tres bloques.',
    starter: 'int nivel = 0;\n// try, captura específica, limpieza y salida.\n',
    solution:
      'int nivel = 0;\ntry { nivel = int.Parse("x"); }\ncatch (FormatException) { nivel = -1; }\nfinally { Console.WriteLine("Fin"); }\nConsole.WriteLine(nivel);',
    decisions: [
      decision(
        'Verificar lectura inválida',
        'Comprobar valor -1 y ejecución de limpieza',
        'Comprobar solo que el archivo existe',
        'Ignorar el resultado',
      ),
      decision(
        'Orden de captura',
        'Específica antes de Exception',
        'Exception antes de cualquier específica',
        'No importa el orden',
      ),
      decision(
        'Fallo al guardar',
        'Informar o propagar con contexto',
        'catch vacío para simular éxito',
        'Marcar éxito antes de intentar guardar',
      ),
    ],
  },
  {
    brief:
      'Refactoriza el combate: interface IHabilidad con int Dano(); class Espada lo implementa con public int Dano() => 7. class Personaje contiene private readonly IHabilidad habilidad; constructor público Personaje(IHabilidad h) asigna habilidad = h; public int Atacar() => habilidad.Dano(). Conserva este orden.',
    starter: '// Contrato, estrategia y personaje con responsabilidad de combate.\n',
    solution:
      'interface IHabilidad { int Dano(); }\nclass Espada : IHabilidad { public int Dano() => 7; }\nclass Personaje {\nprivate readonly IHabilidad habilidad;\npublic Personaje(IHabilidad h) { habilidad = h; }\npublic int Atacar() => habilidad.Dano();\n}',
    decisions: [
      decision(
        'Persistencia del personaje',
        'Servicio separado del cálculo de combate',
        'Añadir SQL y ventanas dentro de Atacar',
        'Guardar en cada getter',
      ),
      decision(
        'UML de la estrategia',
        'Asociación a IHabilidad',
        'Personaje hereda de cada habilidad',
        'IHabilidad es un campo int',
      ),
      decision(
        'Refactorización segura',
        'Preservar resultados con pruebas de regresión',
        'Cambiar comportamiento y diseño sin pruebas',
        'Borrar todos los casos límite',
      ),
    ],
  },
];
export const finalChallenge: Challenge = {
  brief:
    'Integra el motor RPG. Declara IHabilidad con int Dano(); Fuego implementa public int Dano() => 10. Personaje tiene public int Vida { get; private set; }, private readonly IHabilidad habilidad; constructor público Personaje(int vida, IHabilidad h) asigna Vida = Math.Max(0, vida) y habilidad = h. public void Recibir(int dano) asigna Vida = Math.Max(0, Vida - Math.Max(0, dano)); public int Atacar() => habilidad.Dano(). Usa exactamente esos miembros en ese orden.',
  starter: '// Combina contrato, estrategia, encapsulamiento, constructor y comportamiento.\n',
  solution:
    'interface IHabilidad { int Dano(); }\nclass Fuego : IHabilidad { public int Dano() => 10; }\nclass Personaje {\npublic int Vida { get; private set; }\nprivate readonly IHabilidad habilidad;\npublic Personaje(int vida, IHabilidad h) { Vida = Math.Max(0, vida); habilidad = h; }\npublic void Recibir(int dano) { Vida = Math.Max(0, Vida - Math.Max(0, dano)); }\npublic int Atacar() => habilidad.Dano();\n}',
  decisions: [
    decision(
      'Un héroe recibe daño negativo',
      'Conservar la vida; nunca curarlo con daño negativo',
      'Aumentar vida restando negativo',
      'Terminar siempre el programa',
    ),
    decision(
      'Añadir una habilidad',
      'Implementar IHabilidad sin editar Personaje',
      'Agregar un switch en cada método',
      'Convertir Personaje en static',
    ),
    decision(
      'Inventario y propietario',
      'Componer un inventario controlado por Personaje',
      'Heredar Personaje de List',
      'Hacer todo public',
    ),
    decision(
      'Verificación mínima del sistema',
      'Probar cero, negativos, límites y distintas habilidades',
      'Probar solo un ataque normal',
      'Inspeccionar nombres de clases únicamente',
    ),
  ],
};
