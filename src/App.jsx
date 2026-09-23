import { useState } from 'react'
import StartScreen from './components/StartScreen'
import Game from './components/Game'

export default function App() {
  const [players, setPlayers] = useState(null)

  if (!players) {
    return <StartScreen onStart={setPlayers} />
  }

  return <Game players={players} onExit={() => setPlayers(null)} />
}
