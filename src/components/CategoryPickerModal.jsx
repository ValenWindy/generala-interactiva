import { CATEGORIES, calculateScore } from '../utils/scoring'
import '../styles/category-modal.css'

export default function CategoryPickerModal({ diceValues, scores, rollCount, onSelect, onClose }) {
  const generalaScored = (scores.generala ?? 0) > 0

  const available = CATEGORIES.filter((c) => scores[c.id] === undefined).map((c) => ({
    ...c,
    points: calculateScore(c.id, diceValues, { rollCount, generalaScored }),
  }))

  const canScore = available.filter((c) => c.points > 0).sort((a, b) => b.points - a.points)
  const mustCross = available.filter((c) => c.points === 0)

  return (
    <div className="category-modal__overlay" onClick={onClose}>
      <div className="category-modal" onClick={(e) => e.stopPropagation()}>
        <button className="category-modal__close" onClick={onClose} aria-label="Cerrar">
          ✕
        </button>
        <h2 className="category-modal__title">Elegí tu categoría</h2>

        {canScore.length > 0 && (
          <section className="category-modal__section">
            <h3>Podés anotar</h3>
            <ul className="category-modal__list">
              {canScore.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="category-modal__option category-modal__option--score"
                    onClick={() => onSelect(c.id)}
                  >
                    <span>{c.label}</span>
                    <span>{c.points}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {mustCross.length > 0 && (
          <section className="category-modal__section">
            <h3>{canScore.length > 0 ? 'O tachar' : 'Tachar'}</h3>
            <ul className="category-modal__list">
              {mustCross.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="category-modal__option"
                    onClick={() => onSelect(c.id)}
                  >
                    <span>{c.label}</span>
                    <span>0</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
