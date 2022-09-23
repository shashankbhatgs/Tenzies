import React from "react";
import Die from './Die';
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(0)
  const [bestRollCount, setBestRollCount] = React.useState(
    parseInt(localStorage.getItem("bestRollCount") || 0)
  )

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log("You won!")
    }
  }, [dice])

  React.useEffect(() => {
    localStorage.setItem("bestRollCount", JSON.stringify(bestRollCount))
  }, [bestRollCount])

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid()
    }
  }

  function allNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(generateNewDie())
    }
    return newDice
  }

  function rollDice() {
    if (!tenzies) {         //game has not ended yet
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : generateNewDie()
      }))
      setRolls(oldRolls => oldRolls + 1) //increase the count
    } else { //game has ended 
      setTenzies(false)

      if (bestRollCount == 0 || rolls < bestRollCount) {
        setBestRollCount(rolls);
      }

      setDice(allNewDice());
      setRolls(0);
    }
  }

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? { ...die, isHeld: !die.isHeld } : die
    }))
  }

  const diceElements = dice.map(die => <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)} />)

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
      <div className="dice-stats">
        <div className="stat-rolls">
          Rolls: {rolls}
        </div>
        <div className="stat-best">{bestRollCount ? (<div>Best: {bestRollCount}</div>) : ("")}</div>
      </div>
    </main>
  )
}
