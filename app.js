document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.querySelector('.game-arena');
    const arenaWidth = 800;
    const arenaHeight = 400;
    const cellSize = 20;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
    let gamestarted = false;
    let ball = { x: 200, y: -10 };
    let batPlayer1 = [{ x: 180, y: -10 }, { x: 200, y: -10 }, { x: 220, y: -10 }];
    let batPlayer2 = [{ x: 180, y: 800 }, { x: 200, y: 800 }, { x: 220, y: 800 }];

    let dx1 = 0;
    let dy1 = 0;

    let dx2 = 0;
    let dy2 = 0;

    let dxb = 0;
    let dyb = 0;

    function changeDirection(e) {
        console.log(e);
        e.preventDefault(); 
        if (e.key === 'ArrowUp') {
            dx1 = -cellSize;
            dy1 = 0;
        } else if (e.key === 'ArrowDown') {
            dx1 = cellSize;
            dy1 = 0;
        } else if (e.key === 'q') {
            dx2 = -cellSize;
            dy2 = 0;
        } else if (e.key === 'a') {
            dx2 = cellSize;
            dy2 = 0;
        }
        
    }

    function moveBall() {      
        ball = {x: ball.x + dxb, y: ball.y + dyb};  
        
    }

    function isHit(ball, batPlayer1) {
        console.log("Ball position:", ball.x, ball.y);
        console.log("Player 1 bat positions:", batPlayer1.map(cell => `(${cell.x},${cell.y})`));
        
        const leftX = Math.min(...batPlayer1.map(cell => cell.x)) - 10;
        const rightX = Math.max(...batPlayer1.map(cell => cell.x)) + 10;
        
        const player1Hit = batPlayer1.some((batCell) => {
            const sameY = batCell.y === ball.y;
            const withinXRange = ball.x >= leftX && ball.x <= rightX;
            
            const isHit = sameY && withinXRange;
            if (isHit) {
                console.log("Hit Player 1 at position between:", leftX, "and", rightX);
                console.log("Ball position:", ball.x);
            }
            return isHit;
        });

        const player2Hit = batPlayer2.some((batCell) => {
            const sameY = batCell.y === ball.y;
            const withinXRange = ball.x >= (Math.min(...batPlayer2.map(cell => cell.x)) - 10) && 
                                (ball.x <= Math.max(...batPlayer2.map(cell => cell.x)) + 10);
            return sameY && withinXRange;
        });
    
        if (player1Hit) return 1;
        if (player2Hit) return 2;
        return 0;
    }

    function stopBat(e) {
        if (e.key === 'ArrowUp' || e.key === 'q' || e.key === 'ArrowDown' || e.key === 'a') {
            dx1 = 0;
            dy1 = 0;
            dx2 = 0;
            dy2 = 0;
        }
    }

    

    function updateBat() {
        const batLength = 3;

        // Player 1 movement
        if (dx1 !== 0 || dy1 !== 0) {
            const newPosPlayer1 = {
                x: batPlayer1[0].x + dx1,
                y: batPlayer1[0].y
            };

            const newPosUpPlayer1 = {
                x: batPlayer1[batPlayer1.length - 1].x + dx1,
                y: batPlayer1[batPlayer1.length - 1].y
            };

            if (
                newPosPlayer1.x >= 0 &&
                newPosPlayer1.x <= arenaHeight - cellSize &&
                newPosUpPlayer1.x >= 0 &&
                newPosUpPlayer1.x <= arenaHeight - cellSize
            ) {
                if (dx1 > 0) {
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
        }
        
        if (dx2 !== 0 || dy2 !== 0) {
            const newPosPlayer2 = {
                x: batPlayer2[0].x + dx2,
                y: batPlayer2[0].y
            };

            const newPosUpPlayer2 = {
                x: batPlayer2[batPlayer2.length - 1].x + dx2,
                y: batPlayer2[batPlayer2.length - 1].y
            };

            if (
                newPosPlayer2.x >= 0 &&
                newPosPlayer2.x <= arenaHeight - cellSize &&
                newPosUpPlayer2.x >= 0 &&
                newPosUpPlayer2.x <= arenaHeight - cellSize
            ) {
                if (dx2 > 0) {
                    batPlayer2.push(newPosUpPlayer2); 
                    if (batPlayer2.length > batLength) {
                        batPlayer2.shift();
                    }
                } else {
                    batPlayer2.unshift(newPosPlayer2);
                    if (batPlayer2.length > batLength) {
                        batPlayer2.pop();
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
            drawBatAndBall();
            updateBat();
    
            const hitResult = isHit(ball, batPlayer1);
            console.log("Checking collision every frame: ", hitResult);
    
            if (hitResult === 1 || hitResult === 2) {
                if (dxb === 0 && dyb === 0) {
                    if (hitResult === 1) {
                        dxb = 3;
                    } else {
                        dxb = -3;
                    }
                    dyb = cellSize/2;
                } else {
                    dyb = -dyb;
                }
            }
           
            else if (ball.x <= 0 || ball.x >= 380) {
                dxb = -dxb; 
            }
    
            moveBall();
        }, 30);
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
        const scoreBoard = document.createElement('div');
        scoreBoard.id = 'score-board';
        document.body.insertBefore(scoreBoard, gameArena);
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
