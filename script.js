// Selecting the game board where the snake and food will be displayed
const playBoard = document.querySelector(".play-board");
// Selecting the score display element
const scoreElement = document.querySelector(".score");
// Selecting the high-score display element
const highScoreElement = document.querySelector(".high-score");
// Selecting all control buttons (used for mobile directional controls)
const controls = document.querySelectorAll(".controls i");

// Declaring variables to manage game state
let gameOver = false; // A flag to check if the game is over
let foodX, foodY; // Variables to store the position of the food
let snakeX = 5,
  snakeY = 5; // Initial position of the snake's head
let velocityX = 0,
  velocityY = 0; // Variables to control the snake's movement direction
let snakeBody = []; // Array to store the snake's body segments
let setIntervalId; // Variable to store the interval ID for the game loop
let score = 0; // Variable to keep track of the current score

// Retrieve the high score from the browser's local storage, or default to 0 if not available
let highScore = localStorage.getItem("high-score") || 0;
// Display the retrieved high score in the high-score element
highScoreElement.innerText = `High Score: ${highScore}`;

// Function to update the position of the food on the grid
const updateFoodPosition = () => {
  // Generate random positions for the food within the 30x30 grid
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

// Function to handle game-over logic
const handleGameOver = () => {
  // Stop the game loop by clearing the interval
  clearInterval(setIntervalId);
  // Display an alert to the user and reload the page for a restart
  alert("Game Over! Press OK to replay...");
  location.reload();
};

// Function to change the direction of the snake based on user input
const changeDirection = (e) => {
  // If the user presses the "ArrowUp" key and the snake is not moving down
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0; // Stop horizontal movement
    velocityY = -1; // Start upward movement
  }
  // If the user presses the "ArrowDown" key and the snake is not moving up
  else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0; // Stop horizontal movement
    velocityY = 1; // Start downward movement
  }
  // If the user presses the "ArrowLeft" key and the snake is not moving right
  else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1; // Start leftward movement
    velocityY = 0; // Stop vertical movement
  }
  // If the user presses the "ArrowRight" key and the snake is not moving left
  else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1; // Start rightward movement
    velocityY = 0; // Stop vertical movement
  }
};

// Attach event listeners to all control buttons for mobile users
controls.forEach((button) => {
  // When a control button is clicked, simulate a keypress event
  button.addEventListener("click", () =>
    changeDirection({ key: button.dataset.key })
  );
});

// Main function that runs the game logic repeatedly
const initGame = () => {
  // If the game is over, call the game-over handler
  if (gameOver) return handleGameOver();

  // Create the HTML for the food element and position it on the grid
  let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  // Check if the snake's head is at the same position as the food
  if (snakeX === foodX && snakeY === foodY) {
    // Update the food's position to a new random location
    updateFoodPosition();
    // Add a new segment to the snake's body
    snakeBody.push([foodY, foodX]);
    // Increment the score
    score++;
    // Update the high score if the current score exceeds it
    highScore = score >= highScore ? score : highScore;
    // Save the updated high score to local storage
    localStorage.setItem("high-score", highScore);
    // Update the score and high-score displays
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  // Update the snake's head position based on the current velocity
  snakeX += velocityX;
  snakeY += velocityY;

  // Move each segment of the snake's body forward
  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1]; // Shift each segment to the position of the one in front of it
  }
  // Update the first segment of the snake's body to the head's position
  snakeBody[0] = [snakeX, snakeY];

  // Check if the snake's head has collided with the wall
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    // Set the gameOver flag to true if the snake hits a wall
    return (gameOver = true);
  }

  // Loop through each segment of the snake's body
  for (let i = 0; i < snakeBody.length; i++) {
    // Add a div for each segment of the snake's body
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    // Check if the snake's head has collided with its body
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      // Set the gameOver flag to true if there is a collision
      gameOver = true;
    }
  }

  // Update the game board's HTML to display the food and snake
  playBoard.innerHTML = html;
};

// Initialize the food position at the start of the game
updateFoodPosition();
// Start the game loop, calling the initGame function every 100 milliseconds
setIntervalId = setInterval(initGame, 100);
// Add an event listener to detect key presses and change the snake's direction
document.addEventListener("keyup", changeDirection);
