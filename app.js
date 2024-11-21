document.addEventListener('DOMContentLoaded', function() {
    const gameArena = document.querySelector('.game-arena');
    const arenaWidth = 800;
    const arenaHeight = 400;
    const cellSize = 20;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
    let gamestarted = false;
    let ball = {x:200, y:0};
    let batPlayer1 = [{x:180, y:-10},{x:200, y:-10}, {x:220, y:-10}];
    let batPlayer2 = [{x:180, y:800},{x:200, y:800}, {x:220, y:800}];

    let dx = 0;
    let dy = 0;


    function changeDirection(e) {
        console.log(e);
        if (e.key === 'ArrowUp') {
            dx = -cellSize;
            dy = 0; 
        } else if (e.key === 'ArrowDown') {
            dx = cellSize;
            dy = 0; 
        }

        
    }

    function updateBat() {
        console.log(dx);
        if(batPlayer1[0].x <= 375 && batPlayer1[0].x >= 0) {
            if (dx > 0) {
                const newPos = {x: batPlayer1[0].x + dx, y: batPlayer1[0].y};
                console.log(newPos.x);
                batPlayer1.push(newPos);
                batPlayer1.shift();
                console.log(batPlayer1[0].x)
            } else if(dx < 0) {
                const newPos = {x: batPlayer1[0].x + dx, y: batPlayer1[0].y};
                batPlayer1.unshift(newPos);
            }
            
        }
        
    }

    function createDiv(x, y, className) {
        const gameDiv = document.createElement('div');
        gameDiv.classList.add(className);
        gameDiv.style.top = `${x}px`;
        gameDiv.style.left = `${y}px`;
        return gameDiv;
    }

    function drawBatAndBall() {
        gameArena.innerHTML = '';

        batPlayer1.forEach((batCell) => {
            const batElement = createDiv(batCell.x, batCell.y, 'bat');
            gameArena.appendChild(batElement);
        })

        batPlayer2.forEach((batCell) => {
            const batElement = createDiv(batCell.x, batCell.y, 'bat');
            gameArena.appendChild(batElement);
        })


        const ballElement =  createDiv(ball.x, ball.y, 'ball');
        gameArena.appendChild(ballElement);

    }

    function gameLoop() {
        setInterval(() => {
            drawBatAndBall();
            updateBat();
        }, 100)
        
    }

    function gameStarted() {
        if(!gamestarted) {
            gamestarted = true;
            gameLoop();
            document.addEventListener('keydown', changeDirection);
        }
    }

    function initiateGame() {
        const startButton = document.createElement('button');
        startButton.textContent = "Start Game";
        startButton.classList.add('start-btn');
        document.body.appendChild(startButton);

        startButton.addEventListener('click', function() {
            startButton.style.display = 'none';
            
            gameStarted();
        })

    }

    initiateGame();
})