// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');
const rows = 8;
const columns = 5;
let board = 1;
let wormPosition;
let won = false;

const score = document.getElementById('score');
const winMessage = document.getElementById('winMessage');
const winMessageHeading = winMessage.querySelector('h2');
const winMessageText = winMessage.querySelector('p');
const confetti = document.getElementById('confetti');

const winSound = new Audio('sound/Win.wav');
const powerUpSound = new Audio('sound/PowerUp.wav');
const obstacleSound = new Audio('sound/Hurt.wav');
const loseSound = new Audio('sound/Lose.wav');

function playSound(sound){
  sound.currentTime = 0;
  sound.play().catch(function(error){
    console.log('The sound could not play:', error);
  });
}

const timer = document.getElementById('timer');
let timeLeft = 30;
let timerInterval;

function resetTimer(){
  clearInterval(timerInterval);
  timeLeft = 30;
  timer.textContent = timeLeft;
  startTimer();
}

function startTimer(){
  timerInterval = setInterval(function(){
    // TODO: Subtract one from timeLeft.
    timeLeft--;
    // TODO: Show the updated time in the timer element.
    timer.textContent = timeLeft;
    // TODO: When timeLeft reaches 0, stop timerInterval.
    if(timeLeft == 0 && won == true){
      clearInterval(timerInterval);
    } else if (timeLeft == 0) {
      lose();
      clearInterval(timerInterval);
    }
  }, 1000);
}

startTimer();

const wormImage = document.createElement('img');
wormImage.src = 'img/worm.png';
wormImage.alt = 'worm';

const spikeImage = document.createElement('img');
spikeImage.src = 'img/spike.png';
spikeImage.alt = 'spike';

const jerryImage = document.createElement('img');
jerryImage.src = 'img/water-can-transparent.png';
jerryImage.alt = 'jerry';

// Find the game board so we can add a cell to it.
const gameBoard = document.getElementById('game-board');

const switchButton = document.getElementById('switchButton');
const mobileControls = document.getElementById('mobile-controls');

switchButton.addEventListener('click', function() {
  if(board === 1){
    board = 2;
    setBoard2();
  }else{
    board = 1;
    setBoard1();
  }
  resetTimer();
})

const resetButton = document.getElementById('resetButton');

resetButton.addEventListener('click', function() {
  won = false;
  board = 1;
  score.textContent = 0;
  winMessage.hidden = true;
  winMessage.classList.remove('win-message--loss');
  confetti.replaceChildren();
  setBoard1();
  resetTimer();
})

function win(){
  playSound(winSound);
  winMessage.hidden = false;
  winMessage.classList.remove('win-message--loss');
  winMessageHeading.textContent = 'You win!';
  winMessageText.textContent = 'You reached the goal. Great job!';
  confetti.replaceChildren();

  const confettiColors = ['#FFC907', '#2E9DF7', '#4FCB53', '#FF902A', '#F16061'];

  for(let i = 0; i < 40; i++){
    const piece = document.createElement('span');
    piece.classList.add('confetti-piece');
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.backgroundColor = confettiColors[i % confettiColors.length];
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    confetti.appendChild(piece);
  }
}

function lose(){
  playSound(loseSound);
  winMessage.hidden = false;
  winMessage.classList.add('win-message--loss');
  winMessageHeading.textContent = 'You lost!';
  winMessageText.textContent = "You didn't reach the goal in time!";
  confetti.replaceChildren();
}

// Create one cell and give it the styles for a filled box.
for(let i = 0; i < rows; i++){
  for(let j = 0; j < columns; j++){
    const cell = document.createElement('div');
      cell.classList.add('cell');

// Put the new cell inside the game board.
gameBoard.appendChild(cell);
  }
}
  const cells = gameBoard.querySelectorAll('.cell');

  function clearBoard(){
    for(let j = 0; j < cells.length; j++){
      cells[j].className = 'cell';
      cells[j].replaceChildren();
    }
  }

  function moveWorm(direction){
    if(won == true){
      return;
    }
    let nextPosition = wormPosition;

    if(direction == 'up' && wormPosition >= columns){
      nextPosition -= columns;
    }else if (direction === 'down' && wormPosition < cells.length - columns) {
      nextPosition += columns;
    }else if (direction === 'left' && wormPosition % columns > 0) {
      nextPosition -= 1;
    } else if (direction === 'right' && wormPosition % columns < columns - 1) {
      nextPosition += 1;
    } else {
      return;
    }

    const nextCell = cells[nextPosition];
    if(nextCell.classList.contains('cell-filled')){
      return;
    }else if(nextCell.classList.contains('cell-obstacle')){
       playSound(obstacleSound);
       timeLeft -= 10;
      nextCell.removeChild(spikeImage);
      nextCell.classList.remove('cell-obstacle');
    }else if(nextCell.classList.contains('cell-powered')){
      playSound(powerUpSound);
      timeLeft += 10;
      nextCell.removeChild(jerryImage);
      nextCell.classList.remove('cell-powered');
    }else if(nextCell.classList.contains('cell-goal')){
      won = true;
      score.textContent = Number(score.textContent) + timeLeft * 100;
      win();
    }

    nextCell.appendChild(wormImage);
    wormPosition = nextPosition;
  }

  document.addEventListener('keydown', function(event){
    let direction;
    if(event.key == 'ArrowUp'){
      direction = 'up';
    }else if(event.key == 'ArrowDown'){
      direction = 'down';
    }else if(event.key == 'ArrowLeft'){
      direction = 'left';
    }else if(event.key == 'ArrowRight'){
      direction = 'right';
    }

    if(direction){
      event.preventDefault();
      moveWorm(direction);
    }

  });

  mobileControls.addEventListener('click', function(event){
    const button = event.target.closest('button[data-direction]');

    if(button){
      moveWorm(button.dataset.direction);
    }
  });

  function setBoard1(){
    clearBoard();
    wormPosition = 39;

      for(let j = 0; j < 40; j++){
        if(j < 4 || j > 10 && j < 12 || j > 12 && j < 15 ||j > 17 && j < 22 || j > 22 && j < 27 || j > 27 && j < 32 || j > 34 && j < 39){
          cells[j].classList.add('cell-filled');
        }
      }
      cells[4].classList.add('cell-goal');

      cells[22].classList.add('cell-powered');
      cells[22].appendChild(jerryImage);

      cells[12].classList.add('cell-obstacle');
      cells[12].appendChild(spikeImage);

      cells[wormPosition].appendChild(wormImage);
  }

  function setBoard2(){
      clearBoard();
      wormPosition = 39;

      const barriers = [6, 7, 8, 9, 11, 12, 13, 14, 18, 19, 20, 21, 23, 24, 25, 26, 29, 30, 31, 32, 34, 35, 36, 37];

      for(let j = 0; j < barriers.length; j++){
        cells[barriers[j]].classList.add('cell-filled');
      }

      cells[4].classList.add('cell-goal');

      cells[33].classList.add('cell-powered');
      cells[33].appendChild(jerryImage);

      cells[17].classList.add('cell-obstacle');
      cells[17].appendChild(spikeImage);

      cells[wormPosition].appendChild(wormImage);
  }

  setBoard1();