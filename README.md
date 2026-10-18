# 🎲 Generala

Juego web de **Generala** hecho con **React + Vite**, sin librerías externas. El foco del proyecto es la interacción: un vaso de dados que se agarra de verdad (con Pointer Events, funciona igual en mouse y en touch) en vez de un simple botón de "tirar dados".

## ✨ Características

- **Vaso interactivo**: se mantiene presionado y se suelta para lanzar los 5 dados. Mientras se sostiene, tiembla.
- **5 dados con pips** (sin números), animados al salir del vaso.
- **Selección de dados guiada**: después de cada lanzamiento, tocás los dados que querés guardar (quedan marcados) y confirmás con un botón. Los que no elegiste vuelven al vaso con una animación, listos para el próximo lanzamiento.
- **Hasta 3 lanzamientos por turno**, con un aviso si intentás guardar los 5 dados antes de tiempo (no se puede sacudir un cubilete vacío).
- **Reglas completas de Generala**: 1 a 6, Escalera, Full, Poker, Generala y Generala Doble (11 categorías).
- **Combinaciones servidas**: lograr Escalera, Full, Poker, Generala o Generala Doble en el primer lanzamiento del turno suma +5 puntos extra.
- **Cartel emergente** cuando sale una combinación especial en la mesa (sea servida o no).
- **Ventana para elegir categoría** al terminar los 3 lanzamientos, separando lo que conviene anotar de lo que hay que tachar.
- **Dos modos de juego**:
  - **Práctica**: un jugador, sin puntaje comparado.
  - **Común**: hasta 4 jugadores por partida. El primero sos vos; los demás son opcionales, y cada uno se puede asignar a un jugador humano (con nombre) o a la CPU con un botón, sin necesidad de completar los 4 puestos.
  - La CPU juega su propio turno de forma automática (sacude, decide qué guardar y elige categoría) con una estrategia simple.
- **Tablero de puntuación** multi-columna con vista previa en vivo del puntaje que darían los dados actuales en cada categoría.
- **Música de fondo y efectos de sonido**, con botón para silenciar.
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

## 🔊 Sonido

Agregá estos 6 archivos en `public/sounds/` (no se incluyen en el repo):

```
roll.mp3, select.mp3, confirm.mp3, special.mp3, win.mp3, music.mp3
```

Sin ellos el juego funciona igual, simplemente sin audio.

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
│  └─ CategoryPickerModal.jsx
├─ utils/
│  ├─ dice.js
│  ├─ scoring.js
│  ├─ cpu.js
│  └─ sound.js
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
   └─ category-modal.css
```

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
