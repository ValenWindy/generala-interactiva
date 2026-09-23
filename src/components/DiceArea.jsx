import Dice from './Dice'

const FIRST_DELAY = 350
const STAGGER = 70

export default function DiceArea({ dice, rollCount, canInteract, onToggleDie }) {
  const onTable = dice.filter((die) => !die.held)
  const saved = dice.filter((die) => die.held)

  return (
    <div className="dice-area">
      <section className="dice-zone">
        <p className="dice-area__label">En la mesa</p>
        <div className="dice-zone__dice">
          {onTable.map((die, index) =>
  die.value === null ? (
    <div key={die.id} className="dice-slot" />
  ) : (
    <Dice
      key={`${die.id}-${rollCount}`}
      value={die.value}
      marked={die.marked}
      returning={die.returning}
      rolled={die.fresh}
      rollDelay={
        die.returning
          ? index * 90 // stagger de la vuelta al cubilete
          : FIRST_DELAY + index * STAGGER // stagger de la salida
      }
      disabled={!canInteract}
      onClick={() => onToggleDie(die.id)}
    />
  )
)}
        </div>
      </section>

      <section className="dice-zone dice-zone--saved">
        <p className="dice-area__label">Guardados</p>
        <div className="dice-zone__dice">
          {saved.length === 0 ? (
            <p className="dice-zone__hint">Sin dados guardados</p>
          ) : (
            saved.map((die) => (
              <Dice
                key={die.id}
                value={die.value}
                held
                disabled={!canInteract}
                onClick={() => onToggleDie(die.id)}
              />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
