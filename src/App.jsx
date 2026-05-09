import { objects } from "./data/objects";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const getRandomLetter = () => {
    return letters[
      Math.floor(Math.random() * letters.length)
    ];
  };

  const [gameStarted, setGameStarted] =
    useState(false);

  const [randomLetter, setRandomLetter] =
    useState("");

  const [userInput, setUserInput] =
    useState("");

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] =
    useState("");

  const [currentObject, setCurrentObject] =
    useState(null);

  const [highestObject, setHighestObject] =
    useState(null);

  const [score, setScore] = useState(0);

  const [timeLeft, setTimeLeft] = useState(30);

  const [gameOver, setGameOver] =
    useState(false);

  const generateNewLetter = () => {
    setRandomLetter(getRandomLetter());
  };

  const startGame = () => {
    setGameStarted(true);

    generateNewLetter();
  };

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    if (timeLeft <= 0) {
      setMessage("Game Over!");
      setMessageType("error");
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, gameOver]);

  const handleSubmit = () => {
    if (gameOver) return;

    const input =
      userInput.toLowerCase().trim();

    if (!input) return;

    const startsCorrectly =
      input[0] ===
      randomLetter.toLowerCase();

    const objectExists = objects.find(
      (obj) => obj.name === input
    );

    if (!startsCorrectly) {
      setMessage(
        "Wrong starting letter!"
      );

      setMessageType("error");

      setUserInput("");

      return;
    }

    if (!objectExists) {
      setMessage("Object not found!");

      setMessageType("error");

      setUserInput("");

      return;
    }

    if (
      currentObject &&
      objectExists.tier <
        currentObject.tier
    ) {
      setMessage("Object is too small!");

      setMessageType("error");

      setUserInput("");

      return;
    }

    setCurrentObject(objectExists);

    setHighestObject(objectExists);

    setScore((prevScore) => prevScore + 1);

    setMessage("Correct!");

    setMessageType("success");

    generateNewLetter();

    setUserInput("");

    setTimeLeft(30);
  };

  const restartGame = () => {
    setCurrentObject(null);

    setHighestObject(null);

    setScore(0);

    setTimeLeft(30);

    setGameOver(false);

    setMessage("");

    setMessageType("");

    setUserInput("");

    generateNewLetter();
  };

  if (!gameStarted) {
    return (
      <div className="app">
        <div className="game-card">
          <h1>Size Game</h1>

          <div className="rules-box">
            <h2>Rules</h2>

            <ul>
              <li>
                A random letter will
                appear.
              </li>

              <li>
                Enter an object starting
                with that letter.
              </li>

              <li>
                Next object must be same
                tier or bigger.
              </li>

              <li>
                You have 30 seconds for
                each round.
              </li>

              <li>
                Timeout ends the game.
              </li>
            </ul>
          </div>

          <button
            className="start-button"
            onClick={startGame}
          >
            Start Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="game-card">
        <h1>Size Game</h1>

        <br />

        <div className="letter">
          {randomLetter}
        </div>

        <br />

        <div className="timer">
          <span className="timer-label">
            ⏰ Time Left :
          </span>

          <span className="timer-value">
            {timeLeft}s
          </span>
        </div>

        <div className="object">
          Current Object:{" "}
          {currentObject
            ? currentObject.name
            : "None"}
        </div>

        <div className="score">
          Score: {score}
        </div>

        {!gameOver && (
          <>
            <input
              type="text"
              placeholder="Enter object name"
              value={userInput}
              onChange={(e) =>
                setUserInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />

            <br />

            <button
              onClick={handleSubmit}
            >
              Submit
            </button>
          </>
        )}

        <div
          className={`message ${messageType}`}
        >
          {message}
        </div>

        {gameOver && (
          <div className="game-over-box">
            <h2>GAME OVER</h2>

            <p>
              Final Score: {score}
            </p>

            <p>
              Highest Object:{" "}
              {highestObject
                ? highestObject.name
                : "None"}
            </p>

            <button
              onClick={restartGame}
            >
              Restart Game
            </button>
          </div>
        )}
      </div>

      <div className="credit">
        Made by Anand Raj
      </div>
    </div>
  );
}

export default App;