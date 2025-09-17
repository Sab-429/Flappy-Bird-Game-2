// Add these import statements at the very top of your file
import bgMusicSrc from '/assets/game-music-loop-3-144252.mp3';
import gameOverSoundSrc from '/assets/game-over-arcade-6435.mp3';
import birdImgSrc from '/assets/flappybird2.png';
import topPipeImgSrc from '/assets/toppipe.png';
import bottomPipeImgSrc from '/assets/bottompipe.png';

let board;
let boardwidth = 360;
let boardheight = 640;
let context;

let bgMusic;
let gameOverSound;

//bird
let birdwidth = 34;
let birdheight = 24;
let birdX = boardwidth / 8;
let birdY = boardheight / 2;
let birdImg;

let bird = {
  x: birdX,
  y: birdY,
  width: birdwidth,
  height: birdheight,
}

//pipes
let pipeArray = [];
let pipewidth = 64;
let pipeheight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//phhysics
let velocityX = -2;
let velocityY = 0;
let gravity = 0.4;
let gap = 150;

let score = 0;

window.onload = function () {
  // Use the imported variables for your assets
  bgMusic = new Audio(bgMusicSrc);
  bgMusic.loop = true;
  bgMusic.volume = 0.5;

  gameOverSound = new Audio(gameOverSoundSrc);
  gameOverSound.volume = 0.8;

  board = document.getElementById("board");
  board.height = boardheight;
  board.width = boardwidth;
  context = board.getContext("2d");

  //loading of bird img
  birdImg = new Image();
  birdImg.src = birdImgSrc;
  birdImg.onload = function () {
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image();
  topPipeImg.src = topPipeImgSrc;

  bottomPipeImg = new Image();
  bottomPipeImg.src = bottomPipeImgSrc;

  requestAnimationFrame(update);
  setInterval(placepipes, 1500);
  document.addEventListener("keydown", moveBird);
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0, 0, board.width, board.height);

  // Bird physics: gravity + velocity
  velocityY += gravity;
  bird.y += velocityY;

  // Draw bird
  context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

  // Pipes movement and drawing
  for (let i = 0; i < pipeArray.length; i++) {
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    if (!pipe.passed && bird.x > pipe.x + pipe.width) {
      score += 0.5;
      pipe.passed = true;
    }

    // Collision detection
    if (detectCollision(bird, pipe)) {
      gameOver();
      return;
    }
  }

  // Check if bird hits ground or flies too high
  if (bird.y > boardheight || bird.y + bird.height < 0) {
    gameOver();
  }
  //score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

}

function detectCollision(b, p) {
  return (
    b.x < p.x + p.width &&
    b.x + b.width > p.x &&
    b.y < p.y + p.height &&
    b.y + b.height > p.y
  );
}

function gameOver() {
  // Stop background music
  bgMusic.pause();
  bgMusic.currentTime = 0;

  // Play game over sound
  gameOverSound.play();

  // Delay reload slightly so sound can play
  setTimeout(() => {
    alert("Game Over!");
    location.reload();
  }, 500);
}

function placepipes() {
  let openingSpace = 150; // gap between pipes

  // random Y position for top pipe (upwards offset)
  let randomPipeY = pipeY - pipeheight / 4 - Math.random() * (pipeheight / 2);

  let topPipe = {
    img: topPipeImg,
    x: pipeX,
    y: randomPipeY,
    width: pipewidth,
    height: pipeheight,
    passed: false
  };

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x: pipeX,
    y: randomPipeY + pipeheight + openingSpace,
    width: pipewidth,
    height: pipeheight,
    passed: false
  };

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if (e.code === "Space" || e.code === "ArrowUp") {
    velocityY = -6;
    bgMusic.play();
  }
}