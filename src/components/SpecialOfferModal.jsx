import '../styles/special-offer.css'

export default function SpecialOfferModal({ special, onAccept, onDecline }) {
  return (
    <div className="special-offer__overlay" onClick={onDecline}>
      <div className="special-offer" onClick={(e) => e.stopPropagation()}>
        <span className="special-offer__title">
          {special.label}
          {special.servida ? ' Servida' : ''}
        </span>
        <span className="special-offer__points">+{special.score} puntos</span>
        <p className="special-offer__question">¿Querés anotarlo ahora?</p>
        <div className="special-offer__actions">
          <button type="button" className="btn btn--small" onClick={onAccept}>
            Anotar ahora
          </button>
          <button type="button" className="btn btn--small btn--ghost" onClick={onDecline}>
            Seguir jugando
          </button>
        </div>
      </div>
    </div>
  )
}
