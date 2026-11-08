# 🎲 Generala

Juego web de **Generala** hecho con **React + Vite**, sin librerías externas. El foco del proyecto es la interacción: un vaso de dados que se agarra de verdad (con Pointer Events, funciona igual en mouse y en touch) en vez de un simple botón de "tirar dados".

## ✨ Características

- **Vaso interactivo**: se mantiene presionado (tiembla mientras lo sostenés) y los dados se lanzan en el momento en que lo soltás. Un toque rápido no cuenta como sacudida.
- **5 dados con pips** (sin números), animados al salir del vaso.
- **Selección de dados guiada**: después de cada lanzamiento, tocás los dados que querés guardar (quedan marcados) y confirmás con un botón. Los que no elegiste vuelven al vaso con una animación, listos para el próximo lanzamiento.
- **Hasta 3 lanzamientos por turno**, con un aviso si intentás guardar los 5 dados antes de tiempo (no se puede sacudir un cubilete vacío).
- **Reglas completas de Generala**: 1 a 6, Escalera, Full, Poker, Generala y Generala Doble (11 categorías).
- **Combinaciones servidas**: lograr Escalera, Full, Poker, Generala o Generala Doble en el primer lanzamiento del turno suma +5 puntos extra.
- **Aviso de especial**: cuando sale una combinación especial que todavía no anotaste, aparece una ventana que pregunta si querés anotarla ahora (y terminar tu turno) o seguir jugando. Si esa categoría ya está anotada, no aparece nada.
- **Ventana para elegir categoría** que se abre sola, 2 segundos después del último lanzamiento, separando lo que podés anotar de lo que hay que tachar. También podés anotar o tachar tocando directamente la categoría en el tablero.
- **Dos modos de juego**:
  - **Práctica**: un jugador, sin puntaje comparado.
  - **Común**: hasta 4 jugadores por partida. El primero sos vos; los demás son opcionales, y cada uno se puede asignar a un jugador humano (con nombre) o a la CPU con un botón, sin necesidad de completar los 4 puestos.
  - La CPU juega su propio turno de forma automática (tira, decide qué guardar y elige categoría) con una estrategia simple y un ritmo parecido al de una persona, para que se alcance a ver cada jugada.
- **Tablero de puntuación** multi-columna con vista previa en vivo del puntaje que darían los dados actuales en cada categoría.
- **Música de fondo** con botón para silenciarla.
- **Modal de reglas** ("¿Cómo se juega?") accesible desde el menú inicial.
- **Botón de volver** disponible durante toda la partida.
- Pantalla de fin de partida con el resultado (ganador o empate en modo Común, puntaje final en modo Práctica) y opción de jugar de nuevo.
- Diseño responsive, pensado para jugarse tanto en PC como en el celular.

## 🛠️ Tecnologías

- React
- Vite
- CSS puro (sin frameworks ni librerías de UI)
- Pointer Events API

## 🚀 Cómo correrlo localmente

```bash
npm install
npm run dev
```

Para probar la interacción táctil desde el celular en la misma red:

```bash
npm run dev -- --host
```

## 🎵 Música

Para escuchar la música de fondo, agregá un archivo `music.mp3` en `public/sounds/` (no se incluye en el repo). Sin él, el juego funciona igual, simplemente sin audio.

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
│  ├─ GameOver.jsx
│  ├─ SoundToggle.jsx
│  ├─ SpecialPopup.jsx
│  ├─ SpecialOfferModal.jsx
│  └─ CategoryPickerModal.jsx
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
   ├─ game-over.css
   ├─ sound-toggle.css
   ├─ special-popup.css
   ├─ special-offer.css
   └─ category-modal.css
```

## 🎯 Cómo se juega

1. Elegí **Modo Práctica** o **Modo Común** (agregando entre 2 y 4 jugadores, cada uno humano o CPU).
2. Mantené presionado el vaso con el mouse o el dedo y soltalo para lanzar los dados.
3. Tocá los dados que quieras guardar (quedan marcados) y confirmá la selección: los no elegidos vuelven al vaso, listos para relanzarse.
4. Repetí hasta 3 lanzamientos por turno. Si sale una combinación especial, podés anotarla en el momento.
5. Elegí una categoría (en la ventana que se abre o directamente en el tablero) para anotar o tachar y pasar al siguiente turno.
6. La partida termina cuando se completaron las 11 categorías. En modo Común se anuncia el ganador (o el empate).

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
