import '../styles/instructions.css'

export default function Instructions({ isCpuTurn, playerName }) {
  return (
    <p className="instructions">
      {isCpuTurn
        ? `${playerName} está jugando su turno...`
        : 'Mantené presionado el vaso para sacudirlo y soltalo para lanzar los dados. Tocá los dados que querés guardar y confirmá la selección: los demás vuelven al cubilete.'}
    </p>
  )
}
