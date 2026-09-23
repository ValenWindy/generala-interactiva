import { calculateScore } from '../utils/scoring'
import '../styles/scoreboard.css'

export default function Scoreboard({
  categories,
  players,
  scoresByPlayer,
  diceValues,
  rollCount,
  activePlayerId,
  canSelect,
  onSelect,
}) {
  const hasRolled = diceValues.some((v) => v !== null)
  const multi = players.length > 1

  return (
    <aside className="scoreboard">
      <h2 className="scoreboard__title">Tablero</h2>

      <div className="scoreboard__scroll">
        {multi && (
          <div className="scoreboard__header">
            <span />
            {players.map((p) => (
              <span
                key={p.id}
                className={`scoreboard__player ${
                  p.id === activePlayerId ? 'scoreboard__player--active' : ''
                }`}
              >
                {p.name}
              </span>
            ))}
          </div>
        )}

        <ul className="scoreboard__list">
          {categories.map(({ id, label }) => (
            <li key={id} className="score-row">
              <span className="score-row__label">{label}</span>
              <span className="score-row__values">
                {players.map((p) => {
                  const scores = scoresByPlayer[p.id] || {}
                  const used = scores[id] !== undefined
                  const isActiveCol = p.id === activePlayerId
                  const generalaScored = (scores.generala ?? 0) > 0
                  const preview =
                    isActiveCol && hasRolled && !used
                      ? calculateScore(id, diceValues, { rollCount, generalaScored })
                      : null
                  const clickable = isActiveCol && canSelect && !used && hasRolled

                  return (
                    <button
                      key={p.id}
                      type="button"
                      className={`score-cell ${used ? 'score-cell--used' : ''} ${
                        clickable ? 'score-cell--clickable' : ''
                      }`}
                      disabled={!clickable}
                      onClick={() => onSelect(id)}
                    >
                      {used ? scores[id] : preview !== null ? preview : '—'}
                    </button>
                  )
                })}
              </span>
            </li>
          ))}
        </ul>

        <div className="scoreboard__totals">
          <span className="score-row__label">Total</span>
          <span className="score-row__values">
            {players.map((p) => {
              const scores = scoresByPlayer[p.id] || {}
              const total = Object.values(scores).reduce((sum, n) => sum + n, 0)
              return (
                <span key={p.id} className="scoreboard__total-value">
                  {total}
                </span>
              )
            })}
          </span>
        </div>
      </div>
    </aside>
  )
}
