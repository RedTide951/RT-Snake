// script.js
// Get references to DOM elements
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
// Screens
const difficultySelection = document.getElementById("difficulty-selection");
const gameOverScreen = document.getElementById("game-over");
const restartBtn = document.getElementById("restart-btn");
// Difficulty Buttons
const difficultyButtons = document.querySelectorAll(".difficulty-btn");
// Game settings
const box = 20;
const canvasSize = 400; // Canvas size
let gameSpeed; // To be set based on difficulty
let game; // To store the interval
// Snake and food
let snake;
let direction;
let food;
// Initialize the game
function init(speed) {
    // Reset game variables
    snake = [
        {
            x: box * 5,
            y: box * 5
        }
    ];
    direction = "RIGHT";
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    // Clear any existing game loop
    clearInterval(game);
    // Start the game loop with the selected speed
    gameSpeed = speed;
    game = setInterval(draw, gameSpeed);
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw boundary
    ctx.strokeStyle = "#04b910";
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    // Draw the food
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
    // Move the snake by creating a new head
    const head = {
        x: snake[0].x,
        y: snake[0].y
    };
    // Move the snake's head based on the direction
    if (direction === "LEFT") head.x -= box;
    if (direction === "UP") head.y -= box;
    if (direction === "RIGHT") head.x += box;
    if (direction === "DOWN") head.y += box;
    // Add the new head to the snake
    snake.unshift(head);
    // Wll Collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        endGame();
        return;
    }
    // Self Collision
    for(let i = 1; i < snake.length; i++)if (head.x === snake[i].x && head.y === snake[i].y) {
        endGame();
        return;
    }
    // Draw the snake
    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = i === 0 ? "green" : "lightgreen"; // Head vs body
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
    // Check if snake has eaten the food
    if (head.x === food.x && head.y === food.y) // Snake grows, spawn new food
    spawnFood();
    else // Remove the tail to keep the snake the same length
    snake.pop();
}
// Function to handle game over
function endGame() {
    clearInterval(game);
    canvas.classList.add("hidden");
    gameOverScreen.classList.remove("hidden");
}
// Spawn food
function spawnFood() {
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    // food doesn't spawn on the snake
    for (let segment of snake)if (segment.x === food.x && segment.y === food.y) {
        spawnFood();
        break;
    }
}
// Change direction based on key presses
document.addEventListener("keydown", (event)=>{
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});
// Handle difficulty selection
difficultyButtons.forEach((button)=>{
    button.addEventListener("click", ()=>{
        const speed = parseInt(button.getAttribute("data-speed"));
        console.log(`Difficulty selected: ${button.textContent}, Speed: ${speed}`);
        startGame(speed);
    });
});
// Start the game with selected difficulty
function startGame(speed) {
    difficultySelection.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    canvas.classList.remove("hidden");
    init(speed);
}
// Handle game restart
restartBtn.addEventListener("click", ()=>{
    console.log("Restart button clicked");
    startGame(gameSpeed); // Restart with the same speed
});

//# sourceMappingURL=index.44983732.js.map
