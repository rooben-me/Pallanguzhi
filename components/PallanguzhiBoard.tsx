"use client";
import React, { useEffect, useState } from "react";

const PallanguzhiBoard = () => {
  const [seeds, setSeeds] = useState([
    [6, 6, 6, 6, 6, 6, 0],
    [6, 6, 6, 6, 6, 6, 0],
  ]);

  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [capturedSeeds, setCapturedSeeds] = useState([0, 0]);
  const [gameOver, setGameOver] = useState(false);

  function distributeSeeds(row, col, remainingSeeds, newSeeds, callback) {
    if (remainingSeeds === 0) {
      callback(newSeeds);
      return;
    }

    col--;

    if (col < 0) {
      row = 1 - row;
      col = 6;
    }

    if (row === currentPlayer && col === 6) {
      col--;
    }

    newSeeds[row][col]++;
    remainingSeeds--;

    setSeeds([...newSeeds]);

    setTimeout(() => {
      distributeSeeds(row, col, remainingSeeds, newSeeds, callback);
    }, 200);
  }

  function handlePitClick(row, col) {
    if (gameOver) {
      return;
    }

    if (seeds[row][col] === 0 || currentPlayer !== row) {
      return;
    }

    const numSeeds = seeds[row][col];
    const newSeeds = [...seeds];
    newSeeds[row][col] = 0;

    let remainingSeeds = numSeeds;
    let currRow = row;
    let currCol = col;

    distributeSeeds(
      currRow,
      currCol,
      remainingSeeds,
      newSeeds,
      (finalSeeds) => {
        if (
          currRow === currentPlayer &&
          finalSeeds[currRow][currCol] === 2 &&
          finalSeeds[1 - currRow][5 - currCol] > 0
        ) {
          const capturedSeedsCount = finalSeeds[1 - currRow][5 - currCol];
          finalSeeds[1 - currRow][5 - currCol] = 0;
          finalSeeds[currRow][currCol] = 0;
          const newCapturedSeeds = [...capturedSeeds];
          newCapturedSeeds[currentPlayer] += capturedSeedsCount + 2;
          setCapturedSeeds(newCapturedSeeds);
        }

        let gameOverFlag = true;
        for (let i = 0; i < 2; i++) {
          let emptyPits = 0;
          for (let j = 0; j < 6; j++) {
            if (finalSeeds[i][j] === 0) {
              emptyPits++;
            }
          }
          if (emptyPits === 6) {
            gameOverFlag = true;
            break;
          }
          if (capturedSeeds[i] >= 25) {
            gameOverFlag = true;
            break;
          }
          gameOverFlag = false;
        }

        if (gameOverFlag) {
          setGameOver(true);
          return;
        }

        setCurrentPlayer(1 - currentPlayer);
        setSeeds(finalSeeds);
      }
    );
  }

  function handleRestartClick() {
    setSeeds([
      [6, 6, 6, 6, 6, 6, 0],
      [6, 6, 6, 6, 6, 6, 0],
    ]);
    setCurrentPlayer(0);
    setCapturedSeeds([0, 0]);
    setGameOver(false);
  }

  return (
    <div className="max-w-md mx-auto mt-4 text-center bg-gradient-to-br from-green-400 to-blue-500 p-5 rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-white">Pallanguzhi Game</h1>

      <div className="flex justify-center">
        <div className="p-4 border border-gray-400 rounded-lg bg-white">
          <div className="flex justify-between mb-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border border-slate-300 rounded-full"></div>
              <span className="mt-2 font-medium text-gray-700">Player 1</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border border-slate-300 rounded-full"></div>
              <span className="mt-2 font-medium text-gray-700">Player 2</span>
            </div>
          </div>

          <div className="grid grid-cols-6 gap-4 mt-8">
            {seeds[0]
              .slice(0, 6)
              .reverse()
              .map((numSeeds, index) => (
                <SeedPit
                  key={index}
                  currentPlayer={currentPlayer}
                  handlePitClick={() => handlePitClick(0, 5 - index)}
                  numSeeds={numSeeds}
                />
              ))}
          </div>

          <div className="grid grid-cols-6 gap-4 mt-4">
            {seeds[1].slice(0, 6).map((numSeeds, index) => (
              <SeedPit
                key={index}
                currentPlayer={currentPlayer}
                handlePitClick={() => handlePitClick(1, index)}
                numSeeds={numSeeds}
              />
            ))}
          </div>

          <div className="flex justify-between mt-4">
            <div className="text-xl font-medium text-gray-600">
              Captured: {capturedSeeds[0]}
            </div>
            <div className="text-xl font-medium text-gray-600">
              Captured: {capturedSeeds[1]}
            </div>
          </div>

          {gameOver && (
            <div className="text-lg font-medium mt-4 text-gray-600">
              Game Over!
            </div>
          )}

          <button
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded"
            onClick={handleRestartClick}
          >
            Restart
          </button>
        </div>
      </div>
    </div>
  );
};

function SeedPit({ currentPlayer, handlePitClick, numSeeds }) {
  const [prevNumSeeds, setPrevNumSeeds] = useState(numSeeds);

  useEffect(() => {
    // Check if the number of seeds has increased
    if (numSeeds > prevNumSeeds) {
      // Set the background color to green for 1 second
      const timeoutId = setTimeout(() => {
        setBgColor("");
      }, 1000);
      setBgColor("bg-green-200");
      // Clear the timeout after 1 second
      return () => clearTimeout(timeoutId);
    }
    // Check if the number of seeds has decreased
    else if (numSeeds < prevNumSeeds) {
      // Set the background color to red for 1 second
      const timeoutId = setTimeout(() => {
        setBgColor("");
      }, 1000);
      setBgColor("bg-red-200");
      // Clear the timeout after 1 second
      return () => clearTimeout(timeoutId);
    }
    // Update the previous value of numSeeds
    setPrevNumSeeds(numSeeds);
  }, [numSeeds]);

  const [bgColor, setBgColor] = useState("");

  return (
    <div
      className={`relative w-16 h-16 border border-slate-300 rounded-full cursor-pointer ${bgColor} ${
        currentPlayer === 1 ? "bg-gray-200" : ""
      }`}
      onClick={handlePitClick}
    >
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-bold text-2xl">
        {numSeeds}
      </div>
    </div>
  );
}

export default PallanguzhiBoard;
