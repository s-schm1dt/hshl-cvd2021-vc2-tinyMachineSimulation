var ballX = 50, ballY = 50;
var running = false;
var wind = 50;

var canvas, canvasContext;

window.onload = function() {
    canvas = document.getElementById('scene');
    canvasContext = canvas.getContext('2d');

    let gameController = new GameController(canvasContext);

    let inputWind = document.getElementById('inputWind'),
        inputMass = document.getElementById('inputMass');

    var isDragging = false;

    document.getElementById('buttonStart').addEventListener('click', function () {
        running = true;
        wind = parseInt(inputWind.value);
        gameController.ball.mass = parseInt(inputMass.value);
        gameController.ball.lastTick = 0;
        gameController.render();
    });

    canvas.addEventListener('mousedown', function () {
        isDragging = true;
    });
    
    canvas.addEventListener('mousemove', function (e) {
        if (isDragging == true && !running) {
            gameController.ball.x = e.clientX - gameController.ball.radius / 2;
            gameController.ball.y = e.clientY - gameController.ball.radius / 2;

            gameController.render();
        }
    });
    
    canvas.addEventListener('mouseup', function () {
        isDragging = false;
    });
}

function moveEverything() {
    // move ball
    ballY += 2;
}

function drawEverything() {
    canvasContext.fillStyle = '#000';
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    if (running) {
        window.requestAnimationFrame(drawEverything);
    }
}

function GameController(ctx) {
    this.ctx = ctx;
    this.ball = null;

    this.initialize = function () {
        let ball = new Ball(this.ctx),
            self = this;

        this.ball = ball;

        window.requestAnimationFrame(function () {
            self.render();
        });
    }

    this.render = function () {
        let ctx = this.ctx,
            self = this,
            ball = this.ball;


        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        this.ball.render();
        
        if (running) {
            ball.dY += ball.mass / 1000 * 9.81;

            if (ball.x + ball.radius / 2 >= canvas.width) {
                ball.x = canvas.width - ball.radius / 2;
            }

            if (ball.y + ball.radius / 2 >= canvas.height) {
                ball.y = canvas.height - ball.radius / 2;
                ball.dY = 0;
            }

            window.requestAnimationFrame(function () {
                self.render();
            });
        }
    }

    this.initialize();
}

function Ball(ctx) {
    this.x = 0;
    this.y = 0;
    this.dX = 0;
    this.dY = 0;
    this.radius = 8;
    this.lastTick = 0;
    this.ctx = ctx;
    this.mass = 500;

    this.render = function () {
        this.update();

        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        this.ctx.fill();
    }

    this.update = function () {
        let currentTime = Date.now(),
            ellapsed = this.lastTick != 0 ? currentTime - this.lastTick : 0,
            progress = ellapsed / 1000;


        this.x += (this.dX * progress) + (wind * progress);
        this.y += this.dY * progress;

        this.lastTick = currentTime;
    }
}