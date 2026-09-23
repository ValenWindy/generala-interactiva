import '../styles/instructions.css'

export default function Instructions({ isCpuTurn, playerName }) {
  return (
    <p className="instructions">
      {isCpuTurn
        ? `${playerName} está jugando su turno...`
        : 'Sacudí el vaso para tirar. Tocá los dados que querés guardar y confirmá la selección: los demás vuelven al cubilete para tirarlos de nuevo.'}
    </p>
  )
}
