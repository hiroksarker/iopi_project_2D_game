// Game variables
const gravity = 0.5;

// Character variables
let gameChar_x;
let gameChar_y;
let floorPos_y;
let scrollPos;
let gameChar_world_x;
let jumpVelocity = 0;

// Game state
let isLeft = false;
let isRight = false;
let isFalling = false;
let isPlummeting = false;
let isJumping = false;
let isGameOver = false;

// Game score and lives
let lives;
let gameScore;

// Game objects
let flagpole;
let treePos_x;
let treePos_y;
let clouds;
let mountain;

// Refactored background items
let backgrounds = {
    mountains: [],
    clouds: [],
    trees: []
};

// Refactored game objects
let gameObjects = {
    canyons: [],
    collectables: []
};

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 0.75;
    startGame();
}
function draw() {
    // Draw sky background
    background(100, 155, 255);
    
    // Draw ground
    noStroke();
    fill(102, 155, 51);
    rect(0, floorPos_y, width, height - floorPos_y);
    
    // Begin world scrolling for scenery and game objects
    push();
    translate(scrollPos, 0);
    
    // Draw background elements
    drawFlagpole();
    drawMountains();
    drawClouds();
    drawTrees();
    drawSmallTrees();
    
    // Draw and check canyons
    for(let i = 0; i < gameObjects.canyons.length; i++) {
        drawCanyon(gameObjects.canyons[i]);
    }
    
    // Draw and check collectables
    for(let i = 0; i < gameObjects.collectables.length; i++) {
        if(!gameObjects.collectables[i].isFound) {
            drawCollectable(gameObjects.collectables[i]);
            checkCollectable(gameObjects.collectables[i]);
        }
    }
    
    pop();
    
    // Draw game character
    drawGameChar();
    
    // Draw game status (score, lives, etc.)
    drawGameStatus();
    
    // Game logic updates
    if(!isGameOver) {
        // Character movement with improved boundaries
        if(isLeft) {
            if(gameChar_x > width * 0.2) {
                gameChar_x -= 5;
            } else {
                // Only scroll if we're not at the start of the level
                if(scrollPos < 0) {
                    scrollPos += 5;
                } else {
                    // Allow character to move to the edge of screen when at start
                    if(gameChar_x > 0) {
                        gameChar_x -= 5;
                    }
                }
            }
        }
        
        if(isRight) {
            if(gameChar_x < width * 0.8) {
                gameChar_x += 5;
            } else {
                // Only scroll if we haven't reached the end (flagpole)
                if(gameChar_world_x < flagpole.x_pos + 100) {
                    scrollPos -= 5;
                } else {
                    // Allow character to move to the edge of screen when at end
                    if(gameChar_x < width) {
                        gameChar_x += 5;
                    }
                }
            }
        }

        // Update world position
        gameChar_world_x = gameChar_x - scrollPos;

        // Clamp character position to prevent going off-screen
        if(gameChar_x < 0) {
            gameChar_x = 0;
        }
        if(gameChar_x > width) {
            gameChar_x = width;
        }

        // Check flagpole first
        checkFlagpole();
        
        // Only process jumping and falling if level is not complete
        if(!flagpole.isReached) {
            // Jumping logic
            if(isJumping) {
                gameChar_y -= jumpVelocity;
                jumpVelocity -= gravity;
            }

            // Ground collision and jump reset
            if(gameChar_y >= floorPos_y && !isPlummeting) {
                gameChar_y = floorPos_y;
                isJumping = false;
                jumpVelocity = 0;
            }
            
            // Check canyon collisions
            for(let i = 0; i < gameObjects.canyons.length; i++) {
                checkCanyon(gameObjects.canyons[i]);
            }
            
            // Handle plummeting
            if(isPlummeting) {
                gameChar_y += 5;
            }

            // Check if not over canyon when on ground
            if (!isJumping && !isPlummeting) {
                let isOverCanyon = false;
                for (let i = 0; i < gameObjects.canyons.length; i++) {
                    let canyon = gameObjects.canyons[i];
                    if (gameChar_world_x > canyon.x_pos + 15 && 
                        gameChar_world_x < canyon.x_pos + canyon.width - 15) {
                        isOverCanyon = true;
                        break;
                    }
                }
                if (!isOverCanyon) {
                    isPlummeting = false;
                }
            }

            // Check player death
            checkPlayerDie();
        } else {
            // When level is complete, ensure character stays on ground
            gameChar_y = floorPos_y;
            isPlummeting = false;
            isJumping = false;
        }
        
        // Update game over state if flagpole is reached
        if(flagpole.isReached) {
            isGameOver = true;
        }
    }
}

function startGame() {
    // Initialize character position
    gameChar_x = width - 300;
    gameChar_y = floorPos_y;
    scrollPos = 0;
    gameChar_world_x = gameChar_x - scrollPos;
    jumpVelocity = 0;
    
    // Reset game state
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    isJumping = false;
    isGameOver = false;
    
    // Initialize game score and lives
    if (lives === undefined) {
        lives = 3;
    }
    gameScore = 0;
    
    // Initialize canyons first
    gameObjects.canyons = [
        {
            x_pos: 220,
            width: 150,
            depth: height - floorPos_y
        },
        {
            x_pos: 570,
            width: 120,
            depth: height - floorPos_y
        },
        {
            x_pos: 1000,
            width: 180,
            depth: height - floorPos_y
        }
    ];
    
    // Initialize flagpole after canyons
    flagpole = {
        x_pos: gameObjects.canyons[2].x_pos + gameObjects.canyons[2].width + 400,
        isReached: false
    };

    // Initialize tree position
    treePos_x = 200;
    treePos_y = floorPos_y;
    
    // Initialize canyons
    gameObjects.canyons = [
        {
            x_pos: 220,
            width: 150,
            depth: height - floorPos_y
        },
        {
            x_pos: 570,
            width: 120,
            depth: height - floorPos_y
        }
    ];
    
    // Initialize collectables with symmetric arrangement
    gameObjects.collectables = [
        // Left side collectables
        {
            x_pos: gameObjects.canyons[0].x_pos - 300,
            y_pos: floorPos_y - 120,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        },
        {
            x_pos: gameObjects.canyons[0].x_pos - 100,
            y_pos: floorPos_y - 180,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        },
        // Right side collectables
        {
            x_pos: gameObjects.canyons[0].x_pos + gameObjects.canyons[0].width + 100,
            y_pos: floorPos_y - 180,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        },
        {
            x_pos: gameObjects.canyons[0].x_pos + gameObjects.canyons[0].width + 300,
            y_pos: floorPos_y - 120,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        },
        {
            x_pos: gameObjects.canyons[1].x_pos - 100,
            y_pos: floorPos_y - 180,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        },
        {
            x_pos: gameObjects.canyons[1].x_pos + gameObjects.canyons[1].width + 100,
            y_pos: floorPos_y - 180,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        },
        {
            x_pos: gameObjects.canyons[1].x_pos + gameObjects.canyons[1].width + 300,
            y_pos: floorPos_y - 120,
            size: 50,
            isFound: false,
            rotation: 0,
            hoverOffset: 0
        }
    ];
    
    // Initialize clouds
    clouds = [
        { x_pos: 100, y_pos: 100, size: 60 },
        { x_pos: 300, y_pos: 150, size: 80 },
        { x_pos: 600, y_pos: 120, size: 70 },
        { x_pos: 900, y_pos: 100, size: 50 }
    ];
    
    // Initialize mountains
    mountain = [
        { x_pos: 50, y_pos: floorPos_y, height: 300, width: 350 },
        { x_pos: 400, y_pos: floorPos_y, height: 150, width: 200 },
        { x_pos: 700, y_pos: floorPos_y, height: 400, width: 500 }
    ];
}

// New function to draw flagpole
function drawFlagpole() {
    push();
    strokeWeight(5);
    stroke(180);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250);
    fill(255, 0, 0);
    noStroke();
    
    if(flagpole.isReached) {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50);
    } else {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50);
    }
    pop();
}

// New function to check flagpole
function checkFlagpole() {
    let d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15) {
        flagpole.isReached = true;
    }
}

// New function to check player die
function checkPlayerDie() {
    if(gameChar_y > height) {
        if(lives > 0) {
            lives -= 1;
            if(lives > 0) {
                startGame();
                return;
            }
        }
        isGameOver = true;
    }
}

// New function to draw game status
function drawGameStatus() {
    fill(255);
    noStroke();
    textSize(24);
    
    // Draw score
    textAlign(LEFT);
    text('Score: ' + gameScore, 20, 30);
    
    // Draw lives
    text('Lives: ' + lives, 20, 60);
    
    // Game over or level complete text
    if(isGameOver) {
        textSize(32);
        textAlign(CENTER);
        
        if(flagpole.isReached) {
            fill(0, 255, 0);
            text("Level Complete!\nScore: " + gameScore + 
                 "\nPress SPACE to restart", width/2, height/2);
        } else if(lives < 1) {
            fill(255, 0, 0);
            text("Game Over - Out of Lives!\nScore: " + gameScore + 
                 "\nPress SPACE to restart", width/2, height/2);
        } else {
            fill(255, 0, 0);
            text("Game Over!\nScore: " + gameScore + 
                 "\nPress SPACE to restart", width/2, height/2);
        }
    }
}

function drawCollectable(collectable) {
    push();
    translate(collectable.x_pos, collectable.y_pos);
    
    // Add floating animation
    collectable.hoverOffset = sin(frameCount * 0.05) * 5;
    translate(0, collectable.hoverOffset);
    
    // Add rotation animation
    collectable.rotation += 0.02;
    rotate(collectable.rotation);
    
    // Draw apple with improved detail
    fill(255, 0, 0);
    ellipse(0, 0, collectable.size, collectable.size);
    
    // Apple leaf
    fill(34, 139, 34);
    ellipse(-10, -collectable.size/2, collectable.size/4, collectable.size/6);
    
    // Apple stem
    stroke(139, 69, 19);
    strokeWeight(3);
    line(0, -collectable.size/2, 0, -collectable.size/2 - 15);
    
    // Apple shading
    noStroke();
    fill(255, 100, 100, 150);
    ellipse(10, -10, collectable.size * 0.5, collectable.size * 0.5);
    
    pop();
}

function checkCollectable(collectable) {
    if(!collectable.isFound) {
        let d = dist(gameChar_world_x, gameChar_y, 
                     collectable.x_pos, collectable.y_pos);
        
        if(d < collectable.size * 0.8) {
            collectable.isFound = true;
            gameScore += 1;
        }
    }
}


function drawCanyon(canyon) {
    fill(139, 69, 19);
    beginShape();
    vertex(canyon.x_pos - scrollPos, floorPos_y);
    vertex(canyon.x_pos + canyon.width / 4 - scrollPos, floorPos_y + canyon.depth / 2);
    vertex(canyon.x_pos + canyon.width / 2 - scrollPos, floorPos_y + canyon.depth);
    vertex(canyon.x_pos + (3 * canyon.width) / 4 - scrollPos, floorPos_y + canyon.depth / 2);
    vertex(canyon.x_pos + canyon.width - scrollPos, floorPos_y);
    endShape(CLOSE);

    // Canyon details
    fill(101, 67, 33);
    beginShape();
    vertex(canyon.x_pos + 20 - scrollPos, floorPos_y);
    vertex(canyon.x_pos + canyon.width / 4 + 20 - scrollPos, floorPos_y + canyon.depth / 2.5);
    vertex(canyon.x_pos + canyon.width / 2 - scrollPos, floorPos_y + canyon.depth - 20);
    vertex(canyon.x_pos + (3 * canyon.width) / 4 - 20 - scrollPos, floorPos_y + canyon.depth / 2.5);
    vertex(canyon.x_pos + canyon.width - 20 - scrollPos, floorPos_y);
    endShape(CLOSE);

    // Draw river
    fill(30, 144, 255);
    rect(canyon.x_pos + 10 - scrollPos, floorPos_y + canyon.depth - 10, canyon.width - 20, 10);
}

function checkCanyon(canyon) {
    // Only check for canyon collision when character is at ground level
    if (gameChar_y >= floorPos_y) {
        // Make sure character is actually over the canyon
        if (gameChar_world_x > canyon.x_pos + 15 && 
            gameChar_world_x < canyon.x_pos + canyon.width - 15) {
            isPlummeting = true;
        }
    }
}

function updateGameLogic() {
    // Character movement
    updateCharacterMovement();
    
    // Update game world position
    gameChar_world_x = gameChar_x - scrollPos;
    
    // Jumping logic
    updateJumpingLogic();
    
    // Check for canyon collisions only when on or near ground
    if (gameChar_y >= floorPos_y - 5) {
        for(let i = 0; i < gameObjects.canyons.length; i++) {
            checkCanyon(gameObjects.canyons[i]);
        }
    }
    
    // Check win condition
    if(game_score === gameObjects.collectables.length) {
        isGameOver = true;
    }
    
    // Update plummeting
    if (isPlummeting) {
        gameChar_y += 5;
        if (gameChar_y > height + 100) {
            isGameOver = true;
        }
    }
}

function drawMountains() {
    for (let i = 0; i < mountain.length; i++) {
        // Main mountain body
        fill(119, 136, 153);
        triangle(
            mountain[i].x_pos, mountain[i].y_pos,
            mountain[i].x_pos + mountain[i].width / 2, mountain[i].y_pos - mountain[i].height,
            mountain[i].x_pos + mountain[i].width, mountain[i].y_pos
        );
        
        // Snow cap
        fill(255, 255, 255);
        triangle(
            mountain[i].x_pos + mountain[i].width / 4, mountain[i].y_pos - mountain[i].height / 2,
            mountain[i].x_pos + mountain[i].width / 2, mountain[i].y_pos - mountain[i].height,
            mountain[i].x_pos + (mountain[i].width * 3 / 4), mountain[i].y_pos - mountain[i].height / 2
        );
        
        // Mountain details
        stroke(105, 105, 105);
        strokeWeight(2);
        line(
            mountain[i].x_pos + mountain[i].width / 4, mountain[i].y_pos - mountain[i].height / 3,
            mountain[i].x_pos + mountain[i].width / 2, mountain[i].y_pos - mountain[i].height / 1.5
        );
        noStroke();
    }
}

function drawClouds() {
    fill(255);
    for (let i = 0; i < clouds.length; i++) {
        ellipse(clouds[i].x_pos - scrollPos, clouds[i].y_pos, clouds[i].size, clouds[i].size);
        ellipse(clouds[i].x_pos + 30 - scrollPos, clouds[i].y_pos, clouds[i].size * 0.8, clouds[i].size * 0.8);
        ellipse(clouds[i].x_pos + 50 - scrollPos, clouds[i].y_pos, clouds[i].size * 0.6, clouds[i].size * 0.6);
    }
}

function drawTrees() {
    // Tree trunk with texture
    fill(139, 69, 19);
    rect(treePos_x - scrollPos, treePos_y - 150, 40, 150);
    
    // Aerial roots
    fill(139, 69, 19);
    rect(treePos_x - 10 - scrollPos, treePos_y - 150, 5, 100);
    rect(treePos_x + 30 - scrollPos, treePos_y - 120, 5, 80);
    
    // Tree foliage
    fill(34, 139, 34);
    ellipse(treePos_x - 50 - scrollPos, treePos_y - 180, 150, 100);
    ellipse(treePos_x + 50 - scrollPos, treePos_y - 200, 180, 120);
    ellipse(treePos_x - 30 - scrollPos, treePos_y - 250, 200, 150);
    ellipse(treePos_x + 70 - scrollPos, treePos_y - 230, 160, 110);
}

function drawSmallTrees() {
    // Draw two smaller banyan trees
    let smallTreeOffset = 300;
    for (let i = 0; i < 2; i++) {
        let smallTree_x = treePos_x + (i + 1) * smallTreeOffset;
        // Tree trunk
        fill(139, 69, 19);
        rect(smallTree_x - scrollPos, treePos_y - 100, 20, 100); // Smaller trunk
        
        // Aerial roots
        fill(139, 69, 19);
        rect(smallTree_x - 5 - scrollPos, treePos_y - 100, 3, 50);
        rect(smallTree_x + 15 - scrollPos, treePos_y - 80, 3, 40);
        
        // Tree foliage
        fill(34, 139, 34);
        ellipse(smallTree_x - 30 - scrollPos, treePos_y - 120, 100, 70);
        ellipse(smallTree_x + 30 - scrollPos, treePos_y - 140, 120, 90);
        ellipse(smallTree_x - 20 - scrollPos, treePos_y - 170, 130, 100);
    }
}

function drawGameChar() {
    push();
    scale(1);
    strokeWeight(1);
    
    // Ears
    fill(255, 228, 196);
    ellipse(gameChar_x - 20, gameChar_y - 65, 12, 15);
    ellipse(gameChar_x + 20, gameChar_y - 65, 12, 15);
    
    // Head with better shape
    fill(255, 228, 196);
    ellipse(gameChar_x, gameChar_y - 65, 40, 45);
    
    // Hair
    fill(60, 40, 20);
    arc(gameChar_x, gameChar_y - 75, 40, 30, PI, TWO_PI);
    
    // Eyes with more detail
    fill(255);
    ellipse(gameChar_x - 8, gameChar_y - 70, 8, 6);
    ellipse(gameChar_x + 8, gameChar_y - 70, 8, 6);
    fill(70, 50, 120); // Eye color
    ellipse(gameChar_x - 8, gameChar_y - 70, 4, 4);
    ellipse(gameChar_x + 8, gameChar_y - 70, 4, 4);
    fill(0);
    ellipse(gameChar_x - 8, gameChar_y - 70, 2, 2);
    ellipse(gameChar_x + 8, gameChar_y - 70, 2, 2);
    
    // Eyebrows
    stroke(60, 40, 20);
    strokeWeight(1.5);
    line(gameChar_x - 12, gameChar_y - 76, gameChar_x - 4, gameChar_y - 76);
    line(gameChar_x + 4, gameChar_y - 76, gameChar_x + 12, gameChar_y - 76);
    
    // Nose
    stroke(0);
    strokeWeight(1);
    line(gameChar_x, gameChar_y - 70, gameChar_x, gameChar_y - 65);
    noFill();
    arc(gameChar_x, gameChar_y - 65, 5, 3, 0, PI);
    
    // Smile with more detail
    noFill();
    stroke(0);
    arc(gameChar_x, gameChar_y - 60, 20, 10, 0, PI);
    
    // Neck
    fill(255, 228, 196);
    rect(gameChar_x - 5, gameChar_y - 50, 10, 8);
    
    // Body with better proportions
    fill(0, 140, 255);
    rect(gameChar_x - 20, gameChar_y - 42, 40, 45); // Torso
    
    // Clothing details
    stroke(0, 100, 200);
    line(gameChar_x, gameChar_y - 42, gameChar_x, gameChar_y - 15);
    fill(0, 100, 180);
    rect(gameChar_x - 20, gameChar_y - 42, 40, 5);
    
    // Arms with joints
    stroke(0);
    fill(255, 228, 196);
    // Left arm
    beginShape();
    vertex(gameChar_x - 20, gameChar_y - 40);
    vertex(gameChar_x - 25, gameChar_y - 30);
    vertex(gameChar_x - 28, gameChar_y - 20);
    vertex(gameChar_x - 23, gameChar_y - 20);
    vertex(gameChar_x - 20, gameChar_y - 30);
    endShape(CLOSE);
    
    // Right arm
    beginShape();
    vertex(gameChar_x + 20, gameChar_y - 40);
    vertex(gameChar_x + 25, gameChar_y - 30);
    vertex(gameChar_x + 28, gameChar_y - 20);
    vertex(gameChar_x + 23, gameChar_y - 20);
    vertex(gameChar_x + 20, gameChar_y - 30);
    endShape(CLOSE);
    
    // Hands
    fill(255, 228, 196);
    ellipse(gameChar_x - 28, gameChar_y - 18, 8, 8);
    ellipse(gameChar_x + 28, gameChar_y - 18, 8, 8);
    
    // Legs with better shape
    fill(0, 100, 200);
    // Left leg
    beginShape();
    vertex(gameChar_x - 18, gameChar_y + 5);
    vertex(gameChar_x - 8, gameChar_y + 5);
    vertex(gameChar_x - 5, gameChar_y - 15);
    vertex(gameChar_x - 20, gameChar_y - 15);
    endShape(CLOSE);
    
    // Right leg
    beginShape();
    vertex(gameChar_x + 8, gameChar_y + 5);
    vertex(gameChar_x + 18, gameChar_y + 5);
    vertex(gameChar_x + 20, gameChar_y - 15);
    vertex(gameChar_x + 5, gameChar_y - 15);
    endShape(CLOSE);
    
    // Shoes with more detail
    fill(40);
    // Left shoe
    beginShape();
    vertex(gameChar_x - 20, gameChar_y + 5);
    vertex(gameChar_x - 7, gameChar_y + 5);
    vertex(gameChar_x - 5, gameChar_y + 7);
    vertex(gameChar_x - 5, gameChar_y + 12);
    vertex(gameChar_x - 22, gameChar_y + 12);
    endShape(CLOSE);
    
    // Right shoe
    beginShape();
    vertex(gameChar_x + 7, gameChar_y + 5);
    vertex(gameChar_x + 20, gameChar_y + 5);
    vertex(gameChar_x + 22, gameChar_y + 12);
    vertex(gameChar_x + 5, gameChar_y + 12);
    vertex(gameChar_x + 5, gameChar_y + 7);
    endShape(CLOSE);
    
    pop();
}

function keyPressed() {
    if (isGameOver && keyCode == 32) {
        startGame();
        return;
    }
    
    if (!isGameOver) {
        if (keyCode === LEFT_ARROW) {
            isLeft = true;
        }
        if (keyCode === RIGHT_ARROW) {
            isRight = true;
        }
        if (keyCode === UP_ARROW && !isJumping && gameChar_y === floorPos_y) {
            isJumping = true;
            jumpVelocity = 15;
        }
    }
}

function keyReleased() {
    if (!isGameOver) {
        if (keyCode === LEFT_ARROW) {
            isLeft = false;
        }
        if (keyCode === RIGHT_ARROW) {
            isRight = false;
        }
    }
}