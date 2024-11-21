document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.querySelector('.game-arena');
    const arenaWidth = 800;
    const arenaHeight = 400;
    const cellSize = 20;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
    let gamestarted = false;
    let ball = { x: 200, y: 0 };
    let batPlayer1 = [{ x: 180, y: -10 }, { x: 200, y: -10 }, { x: 220, y: -10 }];
    let batPlayer2 = [{ x: 180, y: 800 }, { x: 200, y: 800 }, { x: 220, y: 800 }];

    let dx = 0;
    let dy = 0;

    function changeDirection(e) {
        console.log(e);
        if (e.key === 'ArrowUp' || e.key === 'KeyQ') {
            dx = -cellSize;
            dy = 0;
        } else if (e.key === 'ArrowDown' || e.key === 'KeyA') {
            dx = cellSize;
            dy = 0;
        }
    }

    function stopBat(e) {
        
        if (e.key === 'ArrowUp' || e.key === 'KeyQ' || e.key === 'ArrowDown' || e.key === 'KeyA') {
            dx = 0;
            dy = 0;
        }
    }

    function updateBat() {
        const batLength = 3;
        
        if (dx !== 0 || dy !== 0) {
            const newPosPlayer1 = { // Player1
                x: batPlayer1[0].x + dx, 
                y: batPlayer1[0].y 
            };

            const newPosUpPlayer1 = { // Player1
                x: batPlayer1[batPlayer2.length - 1].x + dx,
                y: batPlayer1[batPlayer2.length - 1].y
            };   

            const newPosPlayer2 = { // Player1
                x: batPlayer2[0].x + dx, 
                y: batPlayer2[0].y 
            };

            const newPosUpPlayer2 = { // Player1
                x: batPlayer2[batPlayer2.length - 1].x + dx,
                y: batPlayer2[batPlayer2.length - 1].y
            }; 
            
            if (newPosPlayer1.x >= 0 && newPosPlayer1.x <= arenaHeight - cellSize && newPosUpPlayer1.x >= 0 && newPosUpPlayer1.x <= arenaHeight - cellSize) {
                if (dx !== 0) {
                    if (dx > 0) {
                        batPlayer1.push(newPosUpPlayer1);
                        if (batPlayer1.length > batLength) {
                            batPlayer1.shift();
                        }
                    } else {
                        batPlayer1.unshift(newPosPlayer1);
                        if (batPlayer1.length > batLength) {
                            batPlayer1.pop();
                        }
                    }
                }
            } else if(newPosPlayer2.x >= 0 && newPosPlayer2.x <= arenaHeight - cellSize && newPosUpPlayer2.x >= 0 && newPosUpPlayer2.x <= arenaHeight - cellSize) {
                if (dx !== 0) {
                    if (dx > 0) {
                        batPlayer1.push(newPosUpPlayer2);
                        if (batPlayer1.length > batLength) {
                            batPlayer1.shift();
                        }
                    } else {
                        batPlayer1.unshift(newPosPlayer2);
                        if (batPlayer1.length > batLength) {
                            batPlayer1.pop();
                        }
                    }
                }
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
        });

        batPlayer2.forEach((batCell) => {
            const batElement = createDiv(batCell.x, batCell.y, 'bat');
            gameArena.appendChild(batElement);
        });

        const ballElement = createDiv(ball.x, ball.y, 'ball');
        gameArena.appendChild(ballElement);
    }

    function gameLoop() {
        setInterval(() => {
            updateBat();
            drawBatAndBall();
            
        }, 50);
    }

    function gameStarted() {
        if (!gamestarted) {
            gamestarted = true;
            gameLoop();
            document.addEventListener('keydown', changeDirection);
            document.addEventListener('keyup', stopBat); 
        }
    }

    function initiateGame() {
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Game';
        startButton.classList.add('start-btn');
        document.body.appendChild(startButton);

        startButton.addEventListener('click', function () {
            startButton.style.display = 'none';
            gameStarted();
        });
    }

    initiateGame();
});
