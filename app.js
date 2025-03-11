/**********************************************
 * STARTER CODE
 **********************************************/

/**
 * shuffle()
 * Shuffle the contents of an array
 *   depending the datatype of the source
 * Makes a copy. Does NOT shuffle the original.
 * Based on Steve Griffith's array shuffle prototype
 * @Parameters: Array or string
 * @Return: Scrambled Array or string, based on the provided parameter
 */
function shuffle(src) {
  const copy = [...src];

  const length = copy.length;
  for (let i = 0; i < length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * length);
    const z = copy[y];
    copy[i] = z;
    copy[y] = x;
  }

  if (typeof src === "string") {
    return copy.join("");
  }

  return copy;
}

/**********************************************
 * YOUR CODE BELOW
 **********************************************/

const flowers = [
  "rose",
  "tulip",
  "daisy",
  "lily",
  "orchid",
  "sunflower",
  "daffodil",
  "violet",
  "peony",
  "marigold",
  "jasmine",
  "camellia",
  "lavender",
  "hibiscus",
  "chrysanthemum",
];

function App() {
  // State initialization
  const [correctAnswer, setCorrectAnswer] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [points, setPoints] = React.useState(
    parseInt(localStorage.getItem("points")) || 0
  );
  const [strikes, setStrikes] = React.useState(
    parseInt(localStorage.getItem("strikes")) || 0
  );
  const [gameOver, setGameOver] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [passes, setPasses] = React.useState(
    parseInt(localStorage.getItem("passes")) || 3
  );
  const [flowersLeft, setFlowersLeft] = React.useState(
    JSON.parse(localStorage.getItem("flowersLeft")) || [...flowers]
  );
  const [word, setWord] = React.useState("");

  // Function to get the next scrambled word
  function getNextFlower() {
    if (flowersLeft.length === 0) {
      setGameOver(true);
      setMessage("Congratulations, you won!");
      localStorage.removeItem("flowersLeft");
    } else {
      const randomIndex = Math.floor(Math.random() * flowersLeft.length);
      const randomFlower = flowersLeft[randomIndex];
      const newFlowersLeft = flowersLeft.filter(
        (_, index) => index !== randomIndex
      );

      setFlowersLeft(newFlowersLeft);
      localStorage.setItem("flowersLeft", JSON.stringify(newFlowersLeft));
      setWord(shuffle(randomFlower));
      setCorrectAnswer(randomFlower);
    }
  }

  // Handle the submit action
  function submitHandler(e) {
    e.preventDefault();
    if (inputValue.toLowerCase() === correctAnswer.toLowerCase()) {
      setMessage("Correct! Next Word");
      const newPoints = points + 1;
      setPoints(newPoints);
      localStorage.setItem("points", newPoints);
      getNextFlower();
    } else {
      setMessage("Incorrect! Try Again");
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      localStorage.setItem("strikes", newStrikes);
      if (newStrikes >= 3) {
        setGameOver(true);
        setMessage("Game Over. You lost!");
      }
    }
    setInputValue("");
  }

  // Skip the word (if passes are available)
  function passHandler() {
    if (passes > 0) {
      const newPasses = passes - 1;
      setPasses(newPasses);
      localStorage.setItem("passes", newPasses);
      setMessage("You passed. Next word!");
      getNextFlower();
    } else {
      setMessage("No passes left!");
    }
  }

  // Restart the game
  function restartGame() {
    setGameOver(false);
    setStrikes(0);
    setPoints(0);
    setPasses(3);
    setMessage("");
    setFlowersLeft([...flowers]);
    localStorage.setItem("strikes", 0);
    localStorage.setItem("points", 0);
    localStorage.setItem("passes", 3);
    localStorage.setItem("flowersLeft", JSON.stringify([...flowers]));
    getNextFlower();
  }

  // Handle input change
  function inputHandler(e) {
    setInputValue(e.target.value);
  }

  // Initialize the game
  React.useEffect(() => {
    getNextFlower();
  }, []);

  return (
    <div class="container">
      <h1>Scramble Garden</h1>
      {gameOver ? (
        <div>
          <p>{message}</p>
          <button onClick={restartGame}>Start Again</button>
        </div>
      ) : (
        <div className="shadow">
          <h2>Scrambled Word: {word}</h2>
          <form onSubmit={submitHandler}>
            <input type="text" value={inputValue} onChange={inputHandler} />
            <button type="submit">Submit</button>
          </form>
          <button onClick={passHandler} disabled={passes === 0}>
            Pass ({passes} left)
          </button>
          <p>
            Points: {points} | Strikes: {strikes}
          </p>
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
