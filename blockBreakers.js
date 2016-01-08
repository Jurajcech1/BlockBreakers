var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var gameStatus = "active";
var brickRowCount = 6;
var brickColumnCount = 4;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 20;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var score = 0;
var lives = 3;
var bricks = [];
var level = 0;


document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("keypress", pauseHandler, false);
document.addEventListener("keypress", levelHandler, false);

function brickMaker() {
  for(c=0; c<brickColumnCount; c++) {
      bricks[c] = [];
      for(r=0; r<brickRowCount; r++) {
          bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
  }
}

brickMaker();

function keyDownHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = true;
    }
    else if(e.keyCode === 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode === 39) {
        rightPressed = false;
    }
    else if(e.keyCode === 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function pauseHandler(e) {
  if(e.keyCode === 32 && gameStatus === "paused") {
    gameStatus = "active";
    draw();
  } else if(e.keyCode === 32 && gameStatus === "active") {
    gameStatus = "paused";
  }
}

function levelHandler(e) {
  if(e.keyCode === 13) {
    draw();
    document.removeEventListener("keypress", levelHandler, false);
  } else if(e.keyCode === 49) {
    mediumSettings();
    draw();
    document.removeEventListener("keypress", levelHandler, false);
  } else if(e.keyCode === 50) {
    hardSettings();
    draw()
    document.removeEventListener("keypress", levelHandler, false);
  }
}

function mediumSettings() {
  dx+=2;
  dy-=2;
  brickColumnCount = 6;
  level+=2
  brickMaker();
}

function hardSettings() {
  dx+=3;
  dy-=3;
  brickColumnCount = 7;
  level+=3
  brickMaker();
}

function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        gameStatus = "paused";
                        setTimeout(resetBricks, 6000);
                        startCountdown();
                    }
                }
            }
        }
    }
}

function positionResetter() {
  x = canvas.width/2;
  y = canvas.height-30;
  dx = 2 + level;
  dy = -2 - level;
  paddleX = (canvas.width-paddleWidth)/2;
}

function resetBricks() {
  level++
  brickColumnCount++;
  score = 0;
  brickMaker();
  positionResetter();
  gameStatus = "active"
  draw();
}

function pauseGame() {
  if(gameStatus === "paused") {

  } else if(gameStatus === "active") {
    requestAnimationFrame(draw);
  }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "rgb(158, 59, 98)";
                ctx.strokeStyle = "green";
                ctx.lineWidth = "3";
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawBorders() {
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.29";
  ctx.lineWidth = "1";
  ctx.moveTo(0,0);
  ctx.lineTo(0, canvas.height+30);
  ctx.moveTo(canvas.width,0);
  ctx.lineTo(canvas.width, canvas.height+30);
  ctx.stroke();
  ctx.closePath();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}

function startScreen() {
  ctx.beginPath();
  ctx.rect(110, 140, 380, 300);
  ctx.fillStyle = "rgba(255, 255, 255, 0.29)";
  ctx.fill();
  ctx.closePath();
  ctx.font = "20px Arial";
  ctx.fillStyle = "rgba(244, 67, 54, 0.8)";
  ctx.fillText("WELCOME TO BLOCKBREAKERS!", canvas.width-460, 200);
  ctx.font = "16px Arial";
  ctx.fillText("Press Spacebar to pause in game", canvas.width-420, 300);
  ctx.fillText("Use mouse or arrow keys to control paddle", canvas.width-450, 330);
  ctx.fillText("Press enter to begin on easy mode", canvas.width-410, 360);
  ctx.fillText("1 to begin on medium", canvas.width-380, 380);
  ctx.fillText("Or 2 for hard mode!", canvas.width-370, 400);
}

function startCountdown() {
  var counter = 5
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  var countDown = setInterval(function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Next level will start in: "+counter, canvas.width-380, 20);
    ctx.fillText("Press Spacebar to pause in game", canvas.width-420, 300);
    ctx.fillText("Use mouse or arrow keys to control paddle", canvas.width-450, 330);
    counter--;
    if(counter <=0) {
      clearInterval(countDown);
    }
  }, 1000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    drawBorders();
    collisionDetection();

    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }

    if(y + dy < ballRadius) {
        dy = -dy;
    } else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                positionResetter();
            }
        }
    }
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    } else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    x += dx;
    y += dy;
    pauseGame();
}

function beginGame() {
  startScreen();
}

beginGame();
