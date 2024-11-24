document.addEventListener('DOMContentLoaded', function () {
    const gameArena = document.querySelector('.game-arena');
    const arenaWidth = 800;
    const arenaHeight = 400;
    const cellSize = 20;
    let scorePlayer1 = 0;
    let scorePlayer2 = 0;
    // let modeOfPlaying = {1: "TwoPlayer", 2: "Online"};
    let gameMode = '';
    let gamestarted = false;
    let ball = { x: 200, y: 800 };
    let batPlayer1 = [{ x: 180, y: -10 }, { x: 200, y: -10 }, { x: 220, y: -10 }];
    let batPlayer2 = [{ x: 180, y: 800 }, { x: 200, y: 800 }, { x: 220, y: 800 }];
    let intervalId;
    
    let dx1 = 0;
    let dy1 = 0;

    let dx2 = 0;
    let dy2 = 0;

    let dxb = 0;
    let dyb = 0;

    function changeDirection(e) {
        // console.log(e);
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
        if(ball.y > 800) {
            // console.log('player1 scores');
            scorePlayer1++;
            ball = { x: 200, y: -10 };
        } else if (ball.y < -10) {
            // console.log('player2 scores');
            scorePlayer2++;
            ball = { x: 200, y: 790 }; 
        } 
    }

    function isHit(ball, batPlayer1, batPlayer2) {
        // console.log("Ball position:", ball.x, ball.y);
        // console.log("Player 1 bat positions:", batPlayer1.map(cell => `(${cell.x},${cell.y})`));
        
        const leftX1 = Math.min(...batPlayer1.map(cell => cell.x)) - 15;  
        const rightX1 = Math.max(...batPlayer1.map(cell => cell.x)) + 15;  
        
        const player1Hit = batPlayer1.some((batCell) => {  
            const sameY = batCell.y === ball.y;  
            const withinXRange = ball.x >= leftX1 && ball.x <= rightX1;  
            return sameY && withinXRange;  
        }); 

        const leftX2 = Math.min(...batPlayer2.map(cell => cell.x)) - 15;  
        const rightX2 = Math.max(...batPlayer2.map(cell => cell.x)) + 15;  
        
        const player2Hit = batPlayer2.some((batCell) => {  
            const sameY = batCell.y === ball.y;  
            const withinXRange = ball.x >= leftX2 && ball.x <= rightX2;  
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
        if(gameMode === 'twoPlayer') {
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
        } else if (gameMode === 'single') {
            // Computer player logic
            const ballX = ball.x;
            const ballY = ball.y;
            const batCenterX = (batPlayer2[0].x + batPlayer2[2].x) / 2;
            
            if (ballY > 0 && ballY < 800) {
                // Predict where the ball will intersect with the computer's y-position
                const slope = dyb / dxb; // Ball's movement slope
                const predictedX = ballX + (batPlayer2[0].y - ballY) / slope;
                
                // Constrain predicted X to stay within arena bounds
                const constrainedPredictedX = Math.max(
                    cellSize, 
                    Math.min(arenaHeight - cellSize * 2, predictedX)
                );
                
                const reactionThreshold = 40;
                const errorMargin = Math.random() * 20 - 10;
                const targetX = constrainedPredictedX + errorMargin;
        
                // Only move if the ball is moving towards the computer's side
                if (dyb > 0) {
                    if (Math.abs(batCenterX - targetX) > reactionThreshold) {
                        if (batCenterX < targetX) {
                            // Move right
                            dx2 = cellSize;
                            // Create new bat positions maintaining 3-segment length
                            const newBat = [];
                            const baseX = batPlayer2[2].x + cellSize; // Use rightmost segment as reference
                            for (let i = 0; i < 3; i++) {
                                newBat.push({
                                    x: baseX - (cellSize * (2-i)),
                                    y: batPlayer2[0].y
                                });
                            }
                            // Only update if within bounds
                            if (newBat[0].x >= 0 && newBat[2].x <= arenaHeight - cellSize) {
                                batPlayer2.length = 0; // Clear current bat
                                newBat.forEach(segment => batPlayer2.push(segment));
                            }
                        } else {
                            // Move left
                            dx2 = -cellSize;
                            // Create new bat positions maintaining 3-segment length
                            const newBat = [];
                            const baseX = batPlayer2[0].x - cellSize; // Use leftmost segment as reference
                            for (let i = 0; i < 3; i++) {
                                newBat.push({
                                    x: baseX + (cellSize * i),
                                    y: batPlayer2[0].y
                                });
                            }
                            // Only update if within bounds
                            if (newBat[0].x >= 0 && newBat[2].x <= arenaHeight - cellSize) {
                                batPlayer2.length = 0; // Clear current bat
                                newBat.forEach(segment => batPlayer2.push(segment));
                            }
                        }
                    } else {
                        dx2 = 0;
                    }
                } else {
                    // Return to center when ball is moving away
                    const centerX = arenaHeight / 2 - cellSize;
                    if (Math.abs(batCenterX - centerX) > reactionThreshold) {
                        if (batCenterX < centerX) {
                            dx2 = cellSize;
                            // Create new bat positions maintaining 3-segment length
                            const newBat = [];
                            const baseX = batPlayer2[2].x + cellSize;
                            for (let i = 0; i < 3; i++) {
                                newBat.push({
                                    x: baseX - (cellSize * (2-i)),
                                    y: batPlayer2[0].y
                                });
                            }
                            // Only update if within bounds
                            if (newBat[0].x >= 0 && newBat[2].x <= arenaHeight - cellSize) {
                                batPlayer2.length = 0;
                                newBat.forEach(segment => batPlayer2.push(segment));
                            }
                        } else {
                            dx2 = -cellSize;
                            // Create new bat positions maintaining 3-segment length
                            const newBat = [];
                            const baseX = batPlayer2[0].x - cellSize;
                            for (let i = 0; i < 3; i++) {
                                newBat.push({
                                    x: baseX + (cellSize * i),
                                    y: batPlayer2[0].y
                                });
                            }
                            // Only update if within bounds
                            if (newBat[0].x >= 0 && newBat[2].x <= arenaHeight - cellSize) {
                                batPlayer2.length = 0;
                                newBat.forEach(segment => batPlayer2.push(segment));
                            }
                        }
                    } else {
                        dx2 = 0;
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


    function isGameOver() {
        if( scorePlayer1 >= 5 || scorePlayer2 >= 5) {
            return true;
        }
        return false;
    }

    function gameLoop() {
        intervalId = setInterval(() => {
            if(isGameOver()) {
                clearInterval(intervalId);
                gameStarted= false;
                if(scorePlayer1 > scorePlayer2) {
                    alert(`Player1 Wins `);
                } else {
                    alert(`Player2 Wins`);
                }
                
            }
            drawBatAndBall();
            updateBat();
    
            const hitResult = isHit(ball, batPlayer1, batPlayer2);
            // console.log("Checking collision every frame: ", hitResult);
    
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
            drawScoreBoard();
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

    function drawScoreBoard() {
        const scoreBoard = document.querySelector('#score-board');
        scoreBoard.textContent = `Score P1: ${scorePlayer1} \n Score P2: ${scorePlayer2} `;

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

            const selectedMode = document.querySelector('input[name="mode"]:checked').value;
            gameMode = selectedMode;
            
            gameStarted();
        });
    }

    initiateGame();
});
