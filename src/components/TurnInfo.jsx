export default function TurnInfo({ turn, rollCount, maxRolls, activePlayerName, total }) {
  return (
    <header className="turn-info">
      <div className="turn-info__item">
        <span className="turn-info__label">Turno {turn}</span>
        <span className="turn-info__value">{activePlayerName}</span>
      </div>
      <div className="turn-info__item">
        <span className="turn-info__label">Lanzamiento</span>
        <span className="turn-info__value">
          {rollCount}/{maxRolls}
        </span>
      </div>
      <div className="turn-info__item">
        <span className="turn-info__label">Puntos</span>
        <span className="turn-info__value">{total}</span>
      </div>
    </header>
  )
}
