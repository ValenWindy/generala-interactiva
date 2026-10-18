import '../styles/sound-toggle.css'

export default function SoundToggle({ muted, onToggle }) {
  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={onToggle}
      aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
    >
      {muted ? '🔇' : '🔊'}
    </button>
  )
}
