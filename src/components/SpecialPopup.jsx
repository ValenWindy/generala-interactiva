import '../styles/special-popup.css'

export default function SpecialPopup({ special }) {
  if (!special) return null

  return (
    <div className="special-popup">
      <span className="special-popup__title">
        {special.label}
        {special.servida ? ' Servida' : ''}
      </span>
      <span className="special-popup__points">+{special.score} puntos</span>
    </div>
  )
}
