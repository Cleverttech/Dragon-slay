let canvas = document.getElementById("myCanvas");
canvas.style.border = "2px solid blue";
let ctx = canvas.getContext("2d");

//DOM Elements
let startBtn = document.querySelector("#start");
let restartBtn = document.querySelector("#restart");
let restartBtn2 = document.querySelector("#restart2");
let gameover = document.querySelector("#gameover");
let winScreen = document.querySelector("#winscreen");
let totalKilled = document.querySelector("#gameover h3");
let splashScreen = document.querySelector("#splashscreen");
let scoreText = document.querySelector("#scoreText");

//Load Images
let cloud1 = new Image();
cloud1.src = "./assets/cloud1.png";

let cloud2 = new Image();
cloud2.src = "./assets/cloud2.png";

// let cloud3 = new Image();
// cloud3.src = "./assets/cloud2.png";

let playscreen = new Image();
playscreen.src = "./assets/playscreen.png";

let enemy1 = new Image(100, 100);
enemy1.src = "./assets/enemy1.png";

let enemy2 = new Image(100, 100);
enemy2.src = "./assets/enemy2.png";

let mother1 = new Image(110, 110);
mother1.src = "./assets/mother1.png";

let mother2 = new Image(110, 110);
mother2.src = "./assets/mother2.png";

let motherFrame = new Image();
motherFrame.src = "./assets/motherframe.png";

let babyFrame = new Image(173, 180);
babyFrame.src = "./assets/babyframe.png";

let fireball = new Image();
fireball.src = "./assets/fireball.png";

let wingsAudio = new Audio("./assets/wings-sound.wav");
wingsAudio.loop = "false";

let fireballWhoosh = new Audio("./assets/fireball-whoosh.wav");
// fireballWhoosh.loop = "true";

let gameoverAudio = new Audio("./assets/gameover-sound.wav");
gameoverAudio.loop = "false";

let mainAudio = new Audio("./assets/main-music.wav");
mainAudio.loop = "true";

canvas.width = "600";
canvas.height = "800";

let intervalId = 0;
let incrSpeed = false;
let isGameOver = false;
let score = 0;
let score2 = score;
let canvasX = 0,
  canvasY = 0;
//cloud position Array
let clouds = [
  { x: 50, y: 250 },
  { x: 300, y: 400 },
];

//Variables for characterAnimate()
let cycleLoop = [0, 1];
let currentLoopIndex = 0;
let frameCount = 0;

//Variables for drawMother()
let motherX = 100;
let motherY = canvas.height - 110;
let incrX = 2,
  incrY = 2;
let isArrowUp = false;
let isArrowRight = false;
let isArrowLeft = false;
let isArrowDown = false;
let isSpaceKey = false;
//fireballs variables
fireball.width = 20;
fireball.height = 20;

let fireballs = [];
let fire = true;
let fireballY = motherY + mother1.height;
let fireballX = motherX;
let incrBall = 20;
let initalSize = randomSize(); //for resizing enemies
let imgArr = [enemy1, enemy2];
let enemies = [
  {
    x: 30,
    y: 30,
    width: initalSize[0],
    height: initalSize[1],
    img: imgArr[Math.floor(Math.random() * imgArr.length)],
  },
];
let incrSpeedEnemies = 2;
let isWinGame = false;
winScreen.style.display = "none";

//----EVENT LISTENERS for MOTHER Dragon movements---
document.addEventListener("keydown", (event) => {
  if (event.code == "ArrowRight") {
    isArrowRight = true;
    wingsAudio.play();
    isArrowLeft = false;
    isArrowUp = false;
    isArrowDown = false;
  } else if (event.code == "ArrowLeft") {
    wingsAudio.play();
    isArrowLeft = true;
    isArrowRight = false;
    isArrowUp = false;
    isArrowDown = false;
  } else if (event.code == "ArrowUp") {
    wingsAudio.play();
    isArrowUp = true;
    isArrowRight = false;
    isArrowLeft = false;
    isArrowDown = false;
  } else if (event.code == "ArrowDown") {
    wingsAudio.play();
    isArrowDown = true;
    isArrowUp = false;
    isArrowRight = false;
    isArrowLeft = false;
  } else if (event.code == "Space") {
    isSpaceKey = true;
  }
});
document.addEventListener("keyup", (event) => {
  (isArrowUp = false),
    (isArrowRight = false),
    (isArrowLeft = false),
    (isArrowDown = false),
    wingsAudio.pause();
});

//main screen
function drawMainUi() {
  splashScreen.style.display = "none";
  gameover.style.display = "none";
  canvas.style.display = "block";
  scoreText.style.display = "block";
  ctx.drawImage(playscreen, 0, 0);
  scoreText.innerText = `Score : ${score}`;
  // mainAudio.play();
}
//splash screen
function drawSplashUI() {
  startBtn.style.display = "block";
  splashScreen.style.display = "block";
  winScreen.style.display = "none";
  gameover.style.display = "none";
  scoreText.style.display = "none";
  canvas.style.display = "none";
}

//finished gameover UI-MVP done
function gameOverUI() {
  restartBtn.style.display = "block";
  gameover.style.display = "block";
  splashScreen.style.display = "none";
  canvas.style.display = "none";
  scoreText.style.display = "none";
  totalKilled.innerText = `Total number of Dragons killed: ${score}`;
  // mainAudio.pause();
  // gameoverAudio.play();
  // intervalId = requestAnimationFrame(gameOverUI);
}

//draw baby
function drawBabyUpdate(
  babyFrame,
  frameX,
  frameY,
  canvasX,
  canvasY,
  updateWidth,
  updateHeight
) {
  ctx.drawImage(
    babyFrame,
    frameX * babyFrame.width,
    frameY * babyFrame.height,
    babyFrame.width, //width
    babyFrame.height, //height
    canvasX,
    canvasY,
    updateWidth, // scaledWidth
    updateHeight // scaledHeight
  );
}
//Win screen
function drawWinScreen() {
  winScreen.style.display = "block";
  restartBtn.style.display = "block";
  gameover.style.display = "none";
  splashScreen.style.display = "none";
  canvas.style.display = "none";
  scoreText.style.display = "none";
}
// move baby
function characterAnimate(pWidth, pHeight, onCanvasX, onCanvasY) {
  //to keep track of number of frames
  frameCount++;

  if (frameCount < 7) {
    requestAnimationFrame(characterAnimate);
    // return;
  }
  frameCount = 0;
  ctx.clearRect(onCanvasX, onCanvasY, pWidth, pHeight);
  ctx.imageSmoothingEnabled = false;
  drawBabyUpdate(
    babyFrame,
    cycleLoop[currentLoopIndex],
    0,
    onCanvasX,
    onCanvasY,
    pWidth,
    pHeight
  );
  currentLoopIndex++;
  if (currentLoopIndex >= cycleLoop.length) {
    currentLoopIndex = 0;
  }
  // window.requestAnimationFrame(characterAnimate);
}
//draw & MoveMother
function moveMother() {
  ctx.drawImage(mother1, motherX, motherY, mother1.width, mother1.height);

  if (isArrowRight && mother1.width + motherX < canvas.width + 50) {
    motherX += 10;
  }
  if (isArrowLeft && motherX + 50 > 0) motherX -= 10;

  if (isArrowUp) motherY -= 10;

  if (isArrowDown) motherY += 10;
}
//to animate mother sprite
function motherAnim() {}

//cloud animation
function moveCloud() {
  //   animation conditions
  let countInterval = 50;
  let speedInterval = Math.floor(Math.random() * 0.5);
  for (let i = 0; i < clouds.length; i++) {
    countInterval += 10;
    speedInterval += 0.1;

    ctx.drawImage(
      cloud2,
      clouds[i].x,
      clouds[i].y + (cloud1.height + countInterval),
      200,
      140
    );

    ctx.drawImage(cloud1, clouds[i].x, clouds[i].y, 150, 100);
    ctx.drawImage(cloud2, clouds[i].x + 300, clouds[i].y + 100, 100, 70);

    if (clouds[i].y + cloud2.height < 0 || clouds[i].y + cloud1.height < 0) {
      clouds[i] = {
        x: Math.floor(Math.random() * 100),
        y: 200,
      };
    }
    clouds[i].y -= speedInterval;
  }
  // window.requestAnimationFrame(moveCloud);
}

//On -hold animate clouds for splash screen
function cloudAnimationSplash() {
  moveCloud();
  drawSplashUI();
}

//create firefireballs
function createFireball() {
  if (isSpaceKey && fire) {
    fireballWhoosh.play();
    fireballs.push({
      x: motherX,
      y: motherY,
    });
    isSpaceKey = false;
    fire = false;
  }
}
function drawFireball() {
  for (let i = 0; i < fireballs.length; i++) {
    ctx.drawImage(fireball, fireballs[i].x + 30, fireballs[i].y - 20, 20, 30);
    fireballs[i].y -= incrBall;
    if (fireballs[i].y < 0) {
      fireballs.splice(i, 1);
      fire = true;
    }
  }
}
function randomSize() {
  let randomWidth = Math.floor(Math.random() * 80) + 20;
  let randomHeight = randomWidth * 1.4;
  return [randomWidth, randomHeight];
}

//increase speed of enemies
function speedIncr() {
  if (score > 0 && score % 5 === 0 && incrSpeed) {
    incrSpeed = false;
    incrSpeedEnemies *= 1.35;
    console.log(incrSpeedEnemies);
  }
}

function moveEnemies() {
  for (let i = 0; i < enemies.length; i++) {
    ctx.drawImage(
      enemies[i].img,
      enemies[i].x,
      enemies[i].y,
      enemy1.width,
      enemy1.height
    );

    enemies[i].y += incrSpeedEnemies;

    if (enemies[i].y > 50 && enemies[i].y <= 50 + incrSpeedEnemies) {
      initalSize = randomSize();
      enemies.push({
        x: Math.floor(Math.random() * (canvas.width - enemy1.width)),
        y: -enemy1.height,
        width: initalSize[0],
        height: initalSize[1],
        img: imgArr[Math.floor(Math.random() * imgArr.length)],
      });
    }
    if (enemies[i].y > canvas.height + 2) {
      enemies.shift();
      score--;
    }
  }
}

// Collision + winning condition
function collision() {
  for (let i = 0; i < enemies.length; i++) {
    if (
      motherX < enemies[i].x + enemies[i].width &&
      motherX + mother1.width > enemies[i].x &&
      motherY < enemies[i].y + enemies[i].height &&
      motherY + enemies[i].height > enemies[i].y
    ) {
      isGameOver = true;
    }
    if (score == 2) {
      isWinGame = true;
    }
    for (let j = 0; j < fireballs.length; j++) {
      if (
        fireballs[j].x < enemies[i].x + enemies[i].width &&
        fireballs[j].x + fireball.width > enemies[i].x &&
        fireballs[j].y < enemies[i].y + enemies[i].height &&
        fireballs[j].y + enemies[i].height > enemies[i].y
      ) {
        fireballs.splice(j, 1);
        enemies.splice(i, 1);
        fire = true;
        score++;
        incrSpeed = true;

        console.log(score, score2);
        if (enemies.length <= 0) {
          initalSize = randomSize();
          enemies.push({
            x: Math.floor(Math.random() * (canvas.width - enemy1.width)),
            y: -enemy1.height,
            width: initalSize[0],
            height: initalSize[1],
            img: imgArr[Math.floor(Math.random() * imgArr.length)],
          });
        }
      }
    }
  }
}
//RESET game variables
function reset() {
  motherX = 100;
  motherY = canvas.height - 110;
  intervalId = 0;
  incrSpeed = false;
  isGameOver = false;
  score = 0;
  score2 = score;
  (canvasX = 0), (canvasY = 0);
  //cloud position Array
  clouds = [
    { x: 50, y: 250 },
    { x: 300, y: 400 },
  ];

  cycleLoop = [0, 1];
  currentLoopIndex = 0;
  frameCount = 0;

  (incrX = 2), (incrY = 2);
  isArrowUp = false;
  isArrowRight = false;
  isArrowLeft = false;
  isSpaceKey = false;
  //fireballs variables
  fireball.width = 20;
  fireball.height = 20;

  fireballs = [];
  fire = true;
  fireballY = motherY + mother1.height;
  fireballX = motherX;
  incrBall = 20;
  initalSize = randomSize(); //for resizing enemies

  enemies = [
    {
      x: 30,
      y: 30,
      width: initalSize[0],
      height: initalSize[1],
      img: imgArr[Math.floor(Math.random() * imgArr.length)],
    },
  ];
  incrSpeedEnemies = 2;
  isWinGame = false;
}

//----MAINGAME putting it all together-----
function mainGameOnStart() {
  drawMainUi();
  moveCloud();
  characterAnimate(65, 69, 545, 260);
  moveMother();
  // motherAnim();
  createFireball();
  drawFireball(); //fireballs
  moveEnemies(); // making the enemies moves
  collision(); //all collisions
  speedIncr();
  //define GameOver
  if (isGameOver) {
    reset();
    cancelAnimationFrame(intervalId);
    gameOverUI();
  } else if (isWinGame) {
    reset();
    cancelAnimationFrame(intervalId);
    drawWinScreen();
  }
  {
    intervalId = requestAnimationFrame(mainGameOnStart);
  }
}

//EVENT Listeners
window.addEventListener("load", () => {
  win;
  drawSplashUI();
  // gameOverUI();

  //restart Button
  restartBtn.addEventListener("click", () => {
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    reset();
    mainGameOnStart();
  });
  // restartBtn2.addEventListener("click", () => {
  //   // ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   reset();
  //   mainGameOnStart();
  // });
  //start button-- still to implement click within the button image on canvas
  startBtn.addEventListener("click", () => {
    mainGameOnStart();
  });
});
