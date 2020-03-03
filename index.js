const canvas = document.getElementById('snake');
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById('score');

const leftControl = document.getElementById('left');
const rightControl = document.getElementById('right');
const upControl = document.getElementById('up');
const downControl = document.getElementById('down');

const gameSpeedEl = document.getElementById('speed');

const SQUARE_SIZE = 40;
const FRUIT_IMAGES = ['./images/apple.png', './images/cherry.png', './images/heart.jpg', './images/peach.png'];

const rows = canvas.width / SQUARE_SIZE;
const columns = canvas.height / SQUARE_SIZE;
let renderedFruitImages = [];
let gameStopped = false;

drawGrid();
loadImages();

class Fruit {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.image;

        this.pickImage();
    }

    pickLocation(){
        this.x = Math.floor(Math.random() * rows) * SQUARE_SIZE;
        this.y = Math.floor(Math.random() * columns) * SQUARE_SIZE;
    }

    pickImage(){
        this.image = renderedFruitImages[Math.floor(Math.random() * renderedFruitImages.length)];
    }

    draw(){
        ctx.drawImage(this.image, this.x, this.y, SQUARE_SIZE, SQUARE_SIZE);
    }
}

class Snake {
    constructor(){
        this.x = 0;
        this.y = 0;
        this.xSpeed = SQUARE_SIZE;
        this.ySpeed = 0;
        this.total = 0;
        
        this.tail = [];
    }

    addTail(){
        this.total++;
        scoreEl.textContent = 'Score: ' + this.total;
    }

    touchingFruit(fruit){
        if (this.x === fruit.x && this.y === fruit.y){
            return true;
        }
        else {
            return false
        };
    }

    draw(){
        ctx.fillStyle = '#70ff75';
        
        for (let i = 0; i < this.tail.length; i++){
            ctx.fillRect(this.tail[i].x, this.tail[i].y, SQUARE_SIZE, SQUARE_SIZE);
        };

        ctx.fillStyle = '#44f84a';

        ctx.fillRect(this.x, this.y, SQUARE_SIZE, SQUARE_SIZE);
    }

    checkForCollisions(){
        let collided = false;
        for (let i = 1; i < this.tail.length; i++){
            if (this.x === this.tail[i].x && this.y === this.tail[i].y){
                this.total = 0;
                this.tail = [];

                collided = true;
            };
        };

        return collided;
    }

    update(){
        for (let i = 0; i < this.tail.length - 1; i++){
            this.tail[i] = this.tail[i + 1];
        };

        this.tail[this.total - 1] = {
            x: this.x,
            y: this.y,
        };

        this.x += this.xSpeed;
        this.y += this.ySpeed;

        if (this.x >= canvas.width){
            this.x = 0;
        };

        if (this.x < 0){
            this.x = canvas.width;
        };

        if (this.y < 0){
            this.y = canvas.height - SQUARE_SIZE;
        };

        if (this.y >= canvas.height){
            this.y = 0;
        };
    }

    setDirection(direction){
        switch(direction){
            case 'UP':
                this.ySpeed = -SQUARE_SIZE;
                this.xSpeed = 0;
                break;
            case 'DOWN':
                this.ySpeed = SQUARE_SIZE;
                this.xSpeed = 0;
                break;
            case 'LEFT':
                this.xSpeed = -SQUARE_SIZE;
                this.ySpeed = 0;
                break;
            case 'RIGHT':
                this.xSpeed = SQUARE_SIZE;
                this.ySpeed = 0;
                break;
        };
    }
}

const snake = new Snake();
const fruit = new Fruit();

console.log(fruit.image);

fruit.draw();
fruit.pickLocation();

snake.draw();

function gameLoop(){
    if (!gameStopped){
        const isColliding = snake.checkForCollisions();

        if (isColliding){
            ctx.fillStyle = 'rgba(255, 0, 0, 0.6)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.font = "40px Monospace";
            ctx.fillStyle = 'white';
            ctx.fillText("You died!", canvas.width / 2 - 110, canvas.height / 2);

            ctx.font = "20px Monospace";
            ctx.fillText("Click to restart.", canvas.width / 2 - 100, canvas.height / 2 + 40);

            gameStopped = true;

            return;
        };

        drawGrid();

        snake.update();
        snake.draw();

        if (snake.touchingFruit(fruit)){
            fruit.pickLocation();
            fruit.pickImage();

            snake.addTail();
        };

        fruit.draw();
    };
};

let gameSpeed = gameSpeedEl.value;
let gameIntervalLoop;

gameSpeedEl.addEventListener('change', () => {
    if (!gameIntervalLoop) return;

    clearInterval(gameIntervalLoop);

    gameSpeed = 600 - gameSpeedEl.value;
    gameIntervalLoop = setInterval(gameLoop, gameSpeed);
});

window.addEventListener('keyup', e => {
    switch(e.key){
        case 'ArrowUp':
            snake.setDirection('UP');
            break;
        case 'ArrowDown':
            snake.setDirection('DOWN');
            break;
        case 'ArrowLeft':
            snake.setDirection('LEFT');
            break;
        case 'ArrowRight':
            snake.setDirection('RIGHT');
            break;
        case 'w':
            snake.setDirection('UP');
            break;
        case 's':
            snake.setDirection('DOWN');
            break;
        case 'a':
            snake.setDirection('LEFT');
            break;
        case 'd':
            snake.setDirection('RIGHT');
            break;
    };
});

rightControl.addEventListener('click', () => snake.setDirection('RIGHT'));
leftControl.addEventListener('click', () => snake.setDirection('LEFT'));
upControl.addEventListener('click', () => snake.setDirection('UP'));
downControl.addEventListener('click', () => snake.setDirection('DOWN'));

canvas.addEventListener("click", () => {
    if (gameStopped){
        snake.tail = [];
        snake.total = 0;

        scoreEl.textContent = 'Score: 0';

        gameStopped = false;
    };
});

function drawGrid(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < rows; i ++){
        ctx.beginPath();
        ctx.moveTo(i * SQUARE_SIZE, 0);
        ctx.lineTo(i * SQUARE_SIZE, canvas.height);
        ctx.strokeStyle = "white";
        ctx.stroke();
    };

    for (let i = 0; i < columns; i ++){
        ctx.beginPath();
        ctx.moveTo(0, i * SQUARE_SIZE);
        ctx.lineTo(canvas.width, i * SQUARE_SIZE);
        ctx.strokeStyle = "white";
        ctx.stroke();
    };
};

function loadImages(){
    let imagesLoaded = 0;
    for (let image of FRUIT_IMAGES){
        const img = new Image();
        img.src = image;

        img.addEventListener('load', () => {
            imagesLoaded++;

            console.log(`Image #${imagesLoaded} loaded.`);
        
            if (imagesLoaded === FRUIT_IMAGES.length){
                gameIntervalLoop = setInterval(gameLoop, gameSpeed);
            };
        });

        renderedFruitImages = [...renderedFruitImages, img];
    };
};