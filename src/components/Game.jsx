import { useEffect, useState } from 'react'
import TurnInfo from './TurnInfo'
import DiceCup from './DiceCup'
import DiceArea from './DiceArea'
import Scoreboard from './Scoreboard'
import Instructions from './Instructions'
import GameOver from './GameOver'
import { MAX_ROLLS, createDice, rollDie } from '../utils/dice'
import { CATEGORIES, calculateScore } from '../utils/scoring'
import { cpuRollStep, cpuChooseCategory } from '../utils/cpu'
import '../styles/game.css'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const RETURN_MS = 900 // 3 dados de stagger (270ms) + 0.7s de animación + margen

export default function Game({ players, onExit }) {
  const [dice, setDice] = useState(createDice)
  const [rollCount, setRollCount] = useState(0)
  const [turn, setTurn] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [scoresByPlayer, setScoresByPlayer] = useState(() =>
    Object.fromEntries(players.map((p) => [p.id, {}]))
  )

  const activePlayer = players[activeIndex]
  const isCpuTurn = activePlayer.isCPU

  const hasRollsLeft = rollCount < MAX_ROLLS
  // Todo dado está o guardado, o vacío esperando el próximo lanzamiento
  const allResolved = dice.every((die) => die.held || die.value === null)

  const canRoll = !isCpuTurn && hasRollsLeft && allResolved
  const canInteract = !isCpuTurn && !allResolved && hasRollsLeft && !dice.some((d) => d.returning)
  const canConfirm = canInteract
  const canSelectCategory = !isCpuTurn && rollCount > 0 && !dice.some((d) => d.returning)

  const activeTotal = Object.values(scoresByPlayer[activePlayer.id] || {}).reduce(
    (sum, n) => sum + n,
    0
  )
  const isGameOver = players.every(
    (p) => Object.keys(scoresByPlayer[p.id] || {}).length === CATEGORIES.length
  )

  // Turno automático de la CPU
  useEffect(() => {
    if (!isCpuTurn || isGameOver) return
    let cancelled = false

    async function playCpuTurn() {
      let localDice = createDice()
      setDice(localDice)
      setRollCount(0)
      await wait(500)

      for (let i = 0; i < MAX_ROLLS; i++) {
        if (cancelled) return
        localDice = cpuRollStep(localDice)
        setDice(localDice)
        setRollCount(i + 1)
        await wait(700)
      }

      if (cancelled) return
      await wait(500)
      if (cancelled) return

      const values = localDice.map((d) => d.value)
      const scores = scoresByPlayer[activePlayer.id] || {}
      const generalaScored = (scores.generala ?? 0) > 0
      const categoryId = cpuChooseCategory(values, scores, MAX_ROLLS, generalaScored)
      if (categoryId) commitCategory(activePlayer.id, categoryId, values, MAX_ROLLS)
    }

    playCpuTurn()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  function handleRoll() {
    if (!canRoll) return

    const nextDice = dice.map((die) =>
      die.held
        ? { ...die, fresh: false }
        : { ...die, value: rollDie(), fresh: true, marked: false }
    )

    setDice(nextDice)
    setRollCount(rollCount + 1)
  }

  // Tocar un dado en la mesa lo marca/desmarca para guardar.
  // Tocar un dado ya guardado lo devuelve a la mesa (sin confirmar todavía).
  function handleToggleDie(id) {
    if (!canInteract) return

    setDice((prev) =>
      prev.map((die) => {
        if (die.id !== id) return die
        if (die.held) return { ...die, held: false, marked: false }
        return { ...die, marked: !die.marked }
      })
    )
  }

  // Confirma la selección: los marcados quedan guardados, el resto vuelve al vaso
  function handleConfirmSelection() {
    if (!canConfirm) return

    setDice((prev) =>
      prev.map((die) => {
        if (die.held) return die
        if (die.marked) return { ...die, held: true, marked: false, fresh: false }
        return { ...die, returning: true }
      })
    )

    setTimeout(() => {
      setDice((prev) =>
        prev.map((die) => (die.returning ? { ...die, value: null, returning: false } : die))
      )
    }, RETURN_MS)
  }

  function handleSelectCategory(categoryId) {
    if (!canSelectCategory) return
    const scores = scoresByPlayer[activePlayer.id] || {}
    if (scores[categoryId] !== undefined) return

    const values = dice.map((die) => die.value)
    commitCategory(activePlayer.id, categoryId, values, rollCount)
  }

  function commitCategory(playerId, categoryId, values, atRollCount) {
    const scores = scoresByPlayer[playerId] || {}
    const generalaScored = (scores.generala ?? 0) > 0
    const points = calculateScore(categoryId, values, {
      rollCount: atRollCount,
      generalaScored,
    })

    setScoresByPlayer((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [categoryId]: points },
    }))
    setDice(createDice())
    setRollCount(0)

    const next = (activeIndex + 1) % players.length
    if (next === 0) setTurn((t) => t + 1)
    setActiveIndex(next)
  }

  function handleRestart() {
    setDice(createDice())
    setRollCount(0)
    setTurn(1)
    setActiveIndex(0)
    setScoresByPlayer(Object.fromEntries(players.map((p) => [p.id, {}])))
  }

  function handleBack() {
    if (window.confirm('¿Volver al inicio? Se va a perder el progreso de la partida.')) {
      onExit()
    }
  }

  if (isGameOver) {
    return (
      <GameOver
        players={players}
        scoresByPlayer={scoresByPlayer}
        onRestart={handleRestart}
        onExit={onExit}
      />
    )
  }

  return (
    <main className="game">
      <div className='game__body'>
      <section className="table">
        <button className="game__back" onClick={handleBack}>
          ← Volver
        </button>
        <TurnInfo turn={turn} rollCount={rollCount} maxRolls={MAX_ROLLS} activePlayerName={activePlayer.name} total={activeTotal} />
        <Instructions isCpuTurn={isCpuTurn} playerName={activePlayer.name} />
        <div className="table__play">
          <DiceCup disabled={!canRoll} onRoll={handleRoll} />
          <DiceArea
            dice={dice}
            rollCount={rollCount}
            canInteract={canInteract}
            onToggleDie={handleToggleDie}
          />
        </div>
        <div className="table__actions">
          {!isCpuTurn && (
            <button className="btn btn--small" onClick={handleConfirmSelection} disabled={!canConfirm}>
              Confirmar selección
            </button>
          )}
        </div>
      </section>
      <Scoreboard
        categories={CATEGORIES}
        players={players}
        scoresByPlayer={scoresByPlayer}
        diceValues={dice.map((die) => die.value)}
        rollCount={rollCount}
        activePlayerId={activePlayer.id}
        canSelect={canSelectCategory}
        onSelect={handleSelectCategory}
      />
      </div>
    </main>
  )
}
