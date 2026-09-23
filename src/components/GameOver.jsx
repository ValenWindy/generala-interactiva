import '../styles/game-over.css'

export default function GameOver({ players, scoresByPlayer, onRestart, onExit }) {
  const totals = players.map((p) => ({
    id: p.id,
    name: p.name,
    total: Object.values(scoresByPlayer[p.id] || {}).reduce((sum, n) => sum + n, 0),
  }))

  const isMulti = players.length > 1
  let resultLine = `Puntuación final: ${totals[0]?.total ?? 0}`

  if (isMulti) {
    const maxTotal = Math.max(...totals.map((t) => t.total))
    const winners = totals.filter((t) => t.total === maxTotal)
    resultLine =
      winners.length > 1
        ? `Empate entre ${winners.map((w) => w.name).join(', ')} con ${maxTotal} puntos`
        : `Ganó ${winners[0].name} con ${maxTotal} puntos`
  }

  return (
    <main className="game-over">
      <h1 className="game-over__title">PARTIDA TERMINADA</h1>
      <p className="game-over__score">{resultLine}</p>
      {isMulti && (
        <ul className="game-over__breakdown">
          {totals.map((t) => (
            <li key={t.id}>
              {t.name}: {t.total}
            </li>
          ))}
        </ul>
      )}
      <div className="game-over__actions">
        <button className="btn" onClick={onRestart}>
          Jugar de nuevo
        </button>
        <button className="btn btn--ghost" onClick={onExit}>
          Volver al inicio
        </button>
      </div>
    </main>
  )
}
