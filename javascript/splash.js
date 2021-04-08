//anime
var canvas, ctx, mother, motherPng, key, frameNo;
canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
let motherX = 0,
  motherY = 0;
const mother1 = new Image(100, 100); // create
const mother2 = new Image(100, 100);
mother1.src = "./assets/mother1.png"; //load
mother2.src = "./assets/mother2.png";
frameNo = 0;
key = false;
const switchImg = [mother1, mother2]; // add animation sequence to arr
const switchImgFrames = 30;
function loop() {
  frameNo += 1.4;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = false;

  if (key === 39) {
    const motherImg =
      switchImg[((frameNo / switchImgFrames) | 0) % switchImg.length];
    ctx.drawImage(motherImg, motherX, motherY, mother1.width, mother1.height);
  } else {
    ctx.drawImage(mother2, motherX, motherY, mother1.width, mother1.height);
  }
  window.requestAnimationFrame(loop);
}
window.addEventListener("keydown", function (e) {
  key = e.keyCode;
});
window.addEventListener("keyup", function (e) {
  key = false;
});

loop();
