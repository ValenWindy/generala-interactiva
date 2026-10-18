import { useRef, useState } from 'react'
import StartScreen from './components/StartScreen'
import Game from './components/Game'

export default function App() {
  const [players, setPlayers] = useState(null)
  const [muted, setMuted] = useState(false)
  const musicRef = useRef(null)

  function toggleMuted() {
    setMuted((prev) => {
      const next = !prev
      if (musicRef.current) musicRef.current.muted = next
      return next
    })
  }

  function handleStart(newPlayers) {
    setPlayers(newPlayers)
    if (musicRef.current) {
      musicRef.current.muted = muted
      musicRef.current.volume = 0.35
      musicRef.current.play().catch(() => {})
    }
  }

  function handleExit() {
    setPlayers(null)
    if (musicRef.current) musicRef.current.pause()
  }

  return (
    <>
      <audio ref={musicRef} src="/sounds/music.mp3" loop />
      {!players ? (
        <StartScreen onStart={handleStart} muted={muted} onToggleMuted={toggleMuted} />
      ) : (
        <Game players={players} onExit={handleExit} muted={muted} onToggleMuted={toggleMuted} />
      )}
    </>
  )
}
