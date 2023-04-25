var running = false;
// var vX = 0;
// var vY = 0;
// var aX = 0;
// var aY = 0;

var canvas, canvasContext;

window.onload = function () {
    canvas = document.getElementById('scene');
    canvasContext = canvas.getContext('2d');

    let gameController = new GameController(canvasContext);

    let inputVx = document.getElementById('inputVx');
        inputVy = document.getElementById('inputVy');
        inputAx = document.getElementById('inputAx');
        inputAy = document.getElementById('inputAy');

    var isDragging = false;

    document.getElementById('buttonStart').addEventListener('click', function () {
        running = true;
        gameController.ball.vX = parseInt(inputVx.value);
        gameController.ball.vY = parseInt(inputVy.value);
        gameController.ball.lastTick = 0;
        gameController.render();
    });

    canvas.addEventListener('mousedown', function () {
        isDragging = true;
    });

    canvas.addEventListener('mousemove', function (e) {
        if (isDragging == true ) {
            gameController.ball.x = e.clientX - gameController.ball.radius;
            gameController.ball.y = e.clientY - gameController.ball.radius;

            gameController.render();
        }
    });

    canvas.addEventListener('mouseup', function () {
        isDragging = false;
    });
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
            // ball.dY = pixelToMeter(ball.dY);

            if (ball.x + ball.radius >= canvas.width) {
                ball.x = canvas.width - ball.radius;
            }

            if (ball.y + ball.radius >= canvas.height) {
                ball.y = canvas.height - ball.radius;
                ball.vY = 0;
                ball.aY = 0;
            }

            window.requestAnimationFrame(function () {
                self.render();
            });
        }
    }

    this.initialize();
}

function Ball(ctx) {
    this.ctx = ctx;
    this.lastTick = 0;
    this.radius = 10;
    this.x = 50;
    this.y = 50;
    // this.dX = 0;
    // this.dY = 0;
    this.vX = 0;
    this.vY = 0;
    this.aX = 0;
    this.aY = 9.81;

    this.render = function () {
        this.update();

        this.ctx.fillStyle = 'red';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        this.ctx.fill();
    }

    this.update = function () {
        let currentTime = Date.now(),
            ellapsed = this.lastTick != 0 ? currentTime - this.lastTick : 0,
            progress = ellapsed / 1000;

        this.x += (this.vX * progress);
        this.y = meterToPixel(pixelToMeter(this.y) + this.vY * progress + 0.5*this.aY * progress**2);

        this.lastTick = currentTime;
    }
}

function pixelToMeter(px) {
    return px/1000;
}

function meterToPixel(m) {
    return m*1000;
}

// function Force() {
//     this.x = 0;
//     this.y = 0;
// }