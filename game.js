const FRAMESPERSECOND = 30;
const PADDLEMARGIN = 5;
const AIVELOCITY = 4;
const PADDLE_ANGULAR_MULTIPLIER = .1;

var Score1PL = 0;
var Score2PL = 0;

var canvas;
var canvasContext;
var ball;
var paddlePLY;
var paddleAI;

window.onload = function () {
    canvas = document.getElementById('gamecanvas');
    canvasContext = canvas.getContext('2d');

    ball = {
       posX: 0,
       posY: 0,
       radius: 10,
       speedX: 10,
       speedY: 2,
       color: 'white'
   };

   paddlePLY = {
      posX: PADDLEMARGIN,
      posY: 5,
      width: 10,
      height: 100,
      color: 'white'
   };

   paddleAI = {
      posX: canvas.width-PADDLEMARGIN-10,//(width)
      posY: 70,
      width: 10,
      height: 100,
      color: 'white'
   };

      setInterval(function() {
            move();
            redraw();
          }, 1000/FRAMESPERSECOND);

   canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calculateMousePos(evt);
			paddlePLY.posY = mousePos.y - (paddlePLY.height/2);
		});
};

function move(){
   moveAI();

   ball.posX += ball.speedX;
	ball.posY += ball.speedY;

   if(ball.posX < 0) {
      if(ball.posY>paddlePLY.posY && ball.posY<(paddlePLY.posY+paddlePLY.height)){
         ball.speedX = -ball.speedX;
         ball.speedY = (ball.posY-(paddlePLY.posY+paddlePLY.height/2))*PADDLE_ANGULAR_MULTIPLIER;
      } else {
         ballReset();
         Score2PL++;
      }
   }

   if(ball.posX > canvas.width){
      if(ball.posY>paddleAI.posY && ball.posY<(paddleAI.posY+paddleAI.height)){
         ball.speedX = -ball.speedX;
         ball.speedY = (ball.posY-(paddleAI.posY+paddleAI.height/2))*PADDLE_ANGULAR_MULTIPLIER;
      } else {
         ballReset();
         Score1PL++;
      }
   }

   if(ball.posY < 0 || ball.posY > canvas.height)
      ball.speedY = -ball.speedY;
}

function moveAI(){
   pdAIcenter = paddleAI.posY + (paddleAI.height/2);
   if(pdAIcenter < ball.posY-(paddleAI.height/3)) paddleAI.posY += AIVELOCITY;
   else if(pdAIcenter > ball.posY+(paddleAI.height/3)) paddleAI.posY -= AIVELOCITY;
}

function ballReset(){
   ball.speedX = -ball.speedX;
   ball.posX = canvas.width/2;
   ball.posY = canvas.height/2;
}

function redraw(){
   drawRect(0,0,canvas.width,canvas.height, 'black');
   drawRect(paddlePLY.posX, paddlePLY.posY,paddlePLY.width,paddlePLY.height,paddlePLY.color);
   drawRect(paddleAI.posX, paddleAI.posY,paddleAI.width,paddleAI.height,paddleAI.color);
   drawBall(ball.posX,ball.posY,ball.radius,ball.color);

   drawText(Score1PL, 50, 50, 'white');
   drawText(Score2PL, canvas.width-50, 50, 'white');
}

// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
//                        UTILS
//^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function drawRect(posX, posY, width, height, color){
   canvasContext.fillStyle = color;
   canvasContext.fillRect(posX, posY, width, height);
}

function drawBall(centerX, centerY, radius, color) {
	canvasContext.fillStyle = color;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0,Math.PI*2,true);
	canvasContext.fill();
}

function drawText(text, posX, posY, color){
   canvasContext.fillStyle = color;
   canvasContext.fillText(text, posX, posY);
}

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}
