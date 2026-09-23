# 🎲 Generala

Juego web de **Generala** hecho con **React + Vite**, sin librerías externas. El foco del proyecto es la interacción: un vaso de dados que se agarra y se sacude de verdad (con Pointer Events, funciona igual en mouse y en touch) en vez de un simple botón de "tirar dados".

## ✨ Características

- **Vaso interactivo**: se agarra, sigue el movimiento del cursor/dedo y detecta cuándo el gesto es una sacudida real (distancia mínima recorrida + cambios de dirección), no solo mantener presionado.
- **5 dados con pips** (sin números), animados al salir del vaso.
- **Selección de dados guiada**: después de cada lanzamiento, tocás los dados que querés guardar (quedan marcados) y confirmás con un botón. Los que no elegiste vuelven al vaso con una animación, listos para el próximo lanzamiento.
- **Hasta 3 lanzamientos por turno**.
- **Reglas completas de Generala**: 1 a 6, Escalera, Full, Poker, Generala y Generala Doble (11 categorías).
- **Combinaciones servidas**: lograr Escalera, Full, Poker, Generala o Generala Doble en el primer lanzamiento del turno suma +5 puntos extra.
- **Dos modos de juego**:
  - **Práctica**: un jugador, sin puntaje comparado.
  - **Común**: hasta 4 jugadores por partida. El primero sos vos; los demás son opcionales, y cada uno se puede asignar a un jugador humano (con nombre) o a la CPU con un botón, sin necesidad de completar los 4 puestos.
  - La CPU juega su propio turno de forma automática (sacude, decide qué guardar y elige categoría) con una estrategia simple.
- **Tablero de puntuación** multi-columna con vista previa en vivo del puntaje que darían los dados actuales en cada categoría.
- **Modal de reglas** ("¿Cómo se juega?") accesible desde el menú inicial, con la explicación del vaso, la selección de dados, la servida y una tabla con las 11 categorías y sus puntajes.
- **Botón de volver** disponible durante toda la partida, para salir a la pantalla inicial sin perder tiempo recargando la página.
- Pantalla de fin de partida con el resultado (ganador o empate en modo Común, puntaje final en modo Práctica) y opción de jugar de nuevo.
- Diseño responsive, pensado para jugarse tanto en PC como en el celular.

## 🛠️ Tecnologías

- React
- Vite
- CSS puro (sin frameworks ni librerías de UI)
- Pointer Events API (sin dependencias de gestos)

## 🚀 Cómo correrlo localmente

```bash
git clone <url-del-repo>
cd generala
npm install
npm run dev
```

Para probar la interacción táctil desde el celular en la misma red:

```bash
npm run dev -- --host
```

y abrir desde el teléfono la dirección de red que muestra la terminal.

## 📁 Estructura del proyecto

```
src/
├─ main.jsx
├─ App.jsx
├─ components/
│  ├─ StartScreen.jsx
│  ├─ RulesModal.jsx
│  ├─ Game.jsx
│  ├─ TurnInfo.jsx
│  ├─ Instructions.jsx
│  ├─ DiceCup.jsx
│  ├─ Dice.jsx
│  ├─ DiceArea.jsx
│  ├─ Scoreboard.jsx
│  └─ GameOver.jsx
├─ utils/
│  ├─ dice.js
│  ├─ scoring.js
│  └─ cpu.js
└─ styles/
   ├─ global.css
   ├─ start-screen.css
   ├─ rules-modal.css
   ├─ game.css
   ├─ dice.css
   ├─ dice-cup.css
   ├─ instructions.css
   ├─ scoreboard.css
   └─ game-over.css
```

## 🎯 Cómo se juega

1. Elegí **Modo Práctica** o **Modo Común** (agregando entre 2 y 4 jugadores, cada uno humano o CPU).
2. Agarrá el vaso con el mouse o el dedo y sacudilo: cuando se pone dorado, ya se registró la sacudida.
3. Soltalo para lanzar los dados.
4. Tocá los dados que quieras guardar (quedan marcados) y confirmá la selección: los no elegidos vuelven al vaso animados, listos para relanzarse.
5. Repetí hasta 3 lanzamientos por turno.
6. Elegí una categoría del tablero para anotar tu puntaje y pasar al siguiente turno.
7. La partida termina cuando se completaron las 11 categorías. En modo Común se anuncia el ganador (o el empate).

Podés repasar todo esto en cualquier momento desde el enlace **¿Cómo se juega?** del menú inicial.

## 📌 Reglas de puntuación

| Categoría | Puntos | Servida (1er lanzamiento) |
|---|---|---|
| 1 a 6 | Suma de los dados de ese número | — |
| Escalera (1-2-3-4-5 o 2-3-4-5-6) | 20 | 25 |
| Full (tres iguales + dos iguales) | 30 | 35 |
| Poker (cuatro iguales) | 40 | 45 |
| Generala (cinco iguales) | 50 | 55 |
| Generala Doble* | 100 | 105 |

\* Solo puntúa si ese jugador ya anotó una Generala real antes. Si no, la categoría se puede tachar igualmente.

## 🧑‍💻 Autor

Valentin Eduardo Rodriguez Lloret
