// Get references
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Screens
const difficultySelection = document.getElementById("difficulty-selection");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");

// Difficulty
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

const box = 20;
const canvasSize = 400;

let gameSpeed;
let game;
let snake;
let direction;
let food;
let score = 0;
let scoreIncrement = 10; // default

// Initialize
function init(speed) {
  score = 0;
  snake = [{ x: box * 5, y: box * 5 }];
  direction = "RIGHT";
  food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };
  // Clear any existing  loop
  clearInterval(game);

  // Start the game loop with the selected speed
  gameSpeed = speed;
  game = setInterval(draw, gameSpeed);
}

const displayUpdate = () => {
  document.getElementById("scoreBox").textContent = `Score: ${score}`;
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw boundary
  ctx.strokeStyle = "#04b910";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  // Move the snake by creating a new head
  const head = { x: snake[0].x, y: snake[0].y };

  // Move the snake's head based on the direction
  if (direction === "LEFT") head.x -= box;
  if (direction === "UP") head.y -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "DOWN") head.y += box;

  // Add the new head to the snake
  snake.unshift(head);

  // Wall Collision
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize
  ) {
    endGame();
    return;
  }

  // Self Collision
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      endGame();
      return;
    }
  }

  // Draw the snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "lightgreen" : "darkgreen"; // Head vs body
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // if snake has eaten the food
  if (head.x === food.x && head.y === food.y) {
    score += scoreIncrement;
    spawnFood();
    displayUpdate();
  } else {
    // if else remove the tail
    snake.pop();
  }
}

// game over
function endGame() {
  clearInterval(game);

  const finalScoreElement = document.getElementById("final-score");
  finalScoreElement.textContent = `Your score: ${score}`;

  canvas.classList.add("hidden");
  scoreBox.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  score = 0;
  displayUpdate();
}

// Spawn food
function spawnFood() {
  food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box,
  };

  // food doesn't spawn on the snake
  for (let segment of snake) {
    if (segment.x === food.x && segment.y === food.y) {
      spawnFood();
      break;
    }
  }
}

// Controls
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") {
    direction = "LEFT";
  } else if (event.key === "ArrowUp" && direction !== "DOWN") {
    direction = "UP";
  } else if (event.key === "ArrowRight" && direction !== "LEFT") {
    direction = "RIGHT";
  } else if (event.key === "ArrowDown" && direction !== "UP") {
    direction = "DOWN";
  }
});

// difficulty selection
difficultyButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const speed = parseInt(button.getAttribute("data-speed"));
    console.log(`Difficulty selected: ${button.textContent}, Speed: ${speed}`);
    startGame(speed);
  });
});

// start game --- Difficulty multipliers
function startGame(speed) {
  gameSpeed = speed;

  if (speed === 150) {
    scoreIncrement = 10;
  } else if (speed === 100) {
    scoreIncrement = 20;
  } else if (speed === 50) {
    scoreIncrement = 30;
  }

  difficultySelection.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  canvas.classList.remove("hidden");
  scoreBox.classList.remove("hidden");
  init(gameSpeed);
}

// game restart
restartBtn.addEventListener("click", () => {
  console.log("Restart button clicked");
  difficultySelection.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");
});
