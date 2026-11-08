import { useEffect, useState } from 'react'
import TurnInfo from './TurnInfo'
import DiceCup from './DiceCup'
import DiceArea from './DiceArea'
import Scoreboard from './Scoreboard'
import Instructions from './Instructions'
import GameOver from './GameOver'
import SpecialPopup from './SpecialPopup'
import SpecialOfferModal from './SpecialOfferModal'
import CategoryPickerModal from './CategoryPickerModal'
import SoundToggle from './SoundToggle'
import { MAX_ROLLS, createDice, rollDie } from '../utils/dice'
import { CATEGORIES, calculateScore, detectSpecial } from '../utils/scoring'
import { cpuRollStep, cpuChooseCategory } from '../utils/cpu'
import '../styles/game.css'

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const RETURN_MS = 700 // duración de la animación "vuelta al cubilete"
const CATEGORY_MODAL_DELAY_MS = 2000 // espera tras el último lanzamiento antes de abrir la ventana

// Ritmo del turno de la CPU, para que se vea como lo haría una persona
const CPU_INITIAL_WAIT = 600
const CPU_ROLL_WAIT = 1000
const CPU_FINAL_WAIT = 1800

export default function Game({ players, onExit, muted, onToggleMuted }) {
  const [dice, setDice] = useState(createDice)
  const [rollCount, setRollCount] = useState(0)
  const [turn, setTurn] = useState(1)
  const [activeIndex, setActiveIndex] = useState(0)
  const [scoresByPlayer, setScoresByPlayer] = useState(() =>
    Object.fromEntries(players.map((p) => [p.id, {}]))
  )
  const [specialPopup, setSpecialPopup] = useState(null) // toast, solo para la CPU
  const [specialOffer, setSpecialOffer] = useState(null) // pregunta, solo para el jugador humano
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const activePlayer = players[activeIndex]
  const isCpuTurn = activePlayer.isCPU

  const hasRollsLeft = rollCount < MAX_ROLLS
  const allResolved = dice.every((die) => die.held || die.value === null)

  const canRoll = !isCpuTurn && hasRollsLeft && allResolved
  const canInteract = !isCpuTurn && !allResolved && hasRollsLeft && !dice.some((d) => d.returning)
  const allWouldBeHeld = dice.every((die) => die.held || die.marked)
  const mustKeepOneLoose = hasRollsLeft && allWouldBeHeld
  const canConfirm = canInteract && !mustKeepOneLoose
  const canSelectCategory = !isCpuTurn && rollCount > 0 && !dice.some((d) => d.returning)

  const activeTotal = Object.values(scoresByPlayer[activePlayer.id] || {}).reduce(
    (sum, n) => sum + n,
    0
  )
  const isGameOver = players.every(
    (p) => Object.keys(scoresByPlayer[p.id] || {}).length === CATEGORIES.length
  )

  // Cartel de especial (CPU): se cierra solo
  useEffect(() => {
    if (!specialPopup) return
    const id = setTimeout(() => setSpecialPopup(null), 2200)
    return () => clearTimeout(id)
  }, [specialPopup])

  // Al terminar los 3 lanzamientos, se abre la ventana para elegir categoría.
  // No se abre mientras hay una pregunta de especial pendiente.
  useEffect(() => {
    if (isCpuTurn || specialOffer) return
    if (
      rollCount === MAX_ROLLS &&
      dice.every((d) => d.value !== null) &&
      !dice.some((d) => d.returning)
    ) {
      const id = setTimeout(() => setShowCategoryModal(true), CATEGORY_MODAL_DELAY_MS)
      return () => clearTimeout(id)
    }
  }, [rollCount, isCpuTurn, dice, specialOffer])

  function maybeShowSpecial(diceState, atRollCount, playerId, isCpu) {
    const values = diceState.map((d) => d.value)
    const scores = scoresByPlayer[playerId] || {}
    const generalaScored = (scores.generala ?? 0) > 0
    const special = detectSpecial(values, atRollCount, generalaScored)
    if (!special) return
    if (scores[special.id] !== undefined) return // esa categoría ya está anotada

    if (isCpu) {
      setSpecialPopup({ ...special, token: Date.now() })
    } else {
      setSpecialOffer({ ...special, token: Date.now() })
    }
  }

  // Turno automático de la CPU
  useEffect(() => {
    if (!isCpuTurn || isGameOver) return
    let cancelled = false

    async function playCpuTurn() {
      let localDice = createDice()
      setDice(localDice)
      setRollCount(0)
      await wait(CPU_INITIAL_WAIT)

      for (let i = 0; i < MAX_ROLLS; i++) {
        if (cancelled) return
        localDice = cpuRollStep(localDice)
        setDice(localDice)
        setRollCount(i + 1)
        maybeShowSpecial(localDice, i + 1, activePlayer.id, true)
        await wait(CPU_ROLL_WAIT)
      }

      if (cancelled) return
      await wait(CPU_FINAL_WAIT)
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
    const nextRollCount = rollCount + 1
    setRollCount(nextRollCount)
    maybeShowSpecial(nextDice, nextRollCount, activePlayer.id, false)
  }

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

  function handleAcceptSpecial() {
    if (!specialOffer) return
    const values = dice.map((die) => die.value)
    commitCategory(activePlayer.id, specialOffer.id, values, rollCount)
    setSpecialOffer(null)
  }

  function handleDeclineSpecial() {
    setSpecialOffer(null)
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
    setShowCategoryModal(false)

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
    setShowCategoryModal(false)
    setSpecialPopup(null)
    setSpecialOffer(null)
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
      <div className="game__topbar">
        <button className="game__back" onClick={handleBack}>
          ← Volver
        </button>
        <SoundToggle muted={muted} onToggle={onToggleMuted} />
      </div>

      <div className="game__body">
        <section className="table">
          <TurnInfo
            turn={turn}
            rollCount={rollCount}
            maxRolls={MAX_ROLLS}
            activePlayerName={activePlayer.name}
            total={activeTotal}
          />
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
              <>
                <button
                  className="btn btn--small"
                  onClick={handleConfirmSelection}
                  disabled={!canConfirm}
                >
                  Confirmar selección
                </button>
                {canInteract && mustKeepOneLoose && (
                  <p className="table__warning">
                    Dejá al menos un dado sin guardar para poder sacudir el cubilete de nuevo.
                  </p>
                )}
              </>
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

      {specialPopup && <SpecialPopup key={specialPopup.token} special={specialPopup} />}

      {specialOffer && (
        <SpecialOfferModal
          key={specialOffer.token}
          special={specialOffer}
          onAccept={handleAcceptSpecial}
          onDecline={handleDeclineSpecial}
        />
      )}

      {showCategoryModal && (
        <CategoryPickerModal
          diceValues={dice.map((die) => die.value)}
          scores={scoresByPlayer[activePlayer.id] || {}}
          rollCount={rollCount}
          onSelect={handleSelectCategory}
          onClose={() => setShowCategoryModal(false)}
        />
      )}
    </main>
  )
}
