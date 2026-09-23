export const DICE_COUNT = 5
export const MAX_ROLLS = 3

export const rollDie = () => Math.floor(Math.random() * 6) + 1

export const createDice = () =>
  Array.from({ length: DICE_COUNT }, (_, id) => ({
    id,
    value: null,
    held: false,
    marked: false, // marcado para guardar, pendiente de confirmar
    fresh: false, // se acaba de lanzar (animación de salida del vaso)
    returning: false, // volviendo al vaso (animación)
  }))
