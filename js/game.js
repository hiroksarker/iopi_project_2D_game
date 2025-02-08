// Game constants
const GRAVITY = 0.5;
const JUMP_POWER = 15;
const MOVE_SPEED = 5;
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 576;

class Game {
    constructor() {
        this.character = null;
        this.scene = null;
        this.worldPos = {
            scrollPos: 0,
            floorPos_y: 0
        };
        this.gameState = {
            isLeft: false,
            isRight: false,
            isJumping: false,
            isPlummeting: false,
            isGameOver: false,
            score: 0,
            lives: 3
        };
        this.flagpole = {
            x_pos: 0,
            isReached: false
        };
    }

    setup() {
        createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        this.worldPos.floorPos_y = height * 0.75;
        this.character = new Character(width - 300, this.worldPos.floorPos_y);
        this.scene = new Scene(this.worldPos);
        this.startGame();
    }

    draw() {
        // Draw background
        background(100, 155, 255);
        
        // Draw ground
        noStroke();
        fill(102, 155, 51);
        rect(0, this.worldPos.floorPos_y, width, height - this.worldPos.floorPos_y);
        
        // World scrolling
        push();
        translate(this.worldPos.scrollPos, 0);
        
        // Draw scene elements
        this.scene.drawSceneElements();
        this.drawFlagpole();
        
        // Draw game objects
        this.scene.drawGameObjects();
        
        pop();
        
        // Draw character and UI
        this.character.draw();
        this.drawGameStatus();
        
        // Update game logic
        if (!this.gameState.isGameOver) {
            this.updateGameLogic();
        }
    }

    updateGameLogic() {
        if (!this.flagpole.isReached) {
            this.handleMovement();
            this.character.update();
            this.checkCollisions();
            this.checkFlagpole();
        } else {
            this.handleLevelComplete();
        }
    }

    handleMovement() {
        if (this.gameState.isLeft) {
            if (this.character.x > width * 0.2) {
                this.character.x -= MOVE_SPEED;
            } else {
                if (this.worldPos.scrollPos < 0) {
                    this.worldPos.scrollPos += MOVE_SPEED;
                } else if (this.character.x > 0) {
                    this.character.x -= MOVE_SPEED;
                }
            }
        }

        if (this.gameState.isRight) {
            if (this.character.x < width * 0.8) {
                this.character.x += MOVE_SPEED;
            } else {
                if (this.character.world_x < this.flagpole.x_pos + 100) {
                    this.worldPos.scrollPos -= MOVE_SPEED;
                } else if (this.character.x < width) {
                    this.character.x += MOVE_SPEED;
                }
            }
        }

        this.character.world_x = this.character.x - this.worldPos.scrollPos;
        this.character.x = constrain(this.character.x, 0, width);
    }

    checkCollisions() {
        // Check canyon collisions
        this.scene.gameObjects.canyons.forEach(canyon => {
            if (this.character.y >= this.worldPos.floorPos_y) {
                if (this.character.world_x > canyon.x_pos + 15 && 
                    this.character.world_x < canyon.x_pos + canyon.width - 15) {
                    this.gameState.isPlummeting = true;
                }
            }
        });

        // Check collectables
        this.scene.gameObjects.collectables.forEach(collectable => {
            if (!collectable.isFound) {
                collectable.checkCollision(this.character);
            }
        });

        // Check death
        if (this.character.y > height) {
            this.handlePlayerDeath();
        }
    }

    handlePlayerDeath() {
        if (this.gameState.lives > 0) {
            this.gameState.lives--;
            if (this.gameState.lives > 0) {
                this.startGame();
                return;
            }
        }
        this.gameState.isGameOver = true;
    }

    checkFlagpole() {
        let d = abs(this.character.world_x - this.flagpole.x_pos);
        if (d < 15) {
            this.flagpole.isReached = true;
        }
    }

    drawFlagpole() {
        push();
        strokeWeight(5);
        stroke(180);
        line(this.flagpole.x_pos, this.worldPos.floorPos_y, 
             this.flagpole.x_pos, this.worldPos.floorPos_y - 250);
        fill(255, 0, 0);
        noStroke();
        
        if (this.flagpole.isReached) {
            rect(this.flagpole.x_pos, this.worldPos.floorPos_y - 250, 50, 50);
        } else {
            rect(this.flagpole.x_pos, this.worldPos.floorPos_y - 50, 50, 50);
        }
        pop();
    }

    drawGameStatus() {
        fill(255);
        noStroke();
        textSize(24);
        
        // Draw score
        textAlign(LEFT);
        text('Score: ' + this.gameState.score, 20, 30);
        
        // Draw lives
        text('Lives: ' + this.gameState.lives, 20, 60);
        
        // Game over or level complete text
        if (this.gameState.isGameOver) {
            textSize(32);
            textAlign(CENTER);
            
            if (this.flagpole.isReached) {
                fill(0, 255, 0);
                text("Level Complete!\nScore: " + this.gameState.score + 
                     "\nPress SPACE to restart", width/2, height/2);
            } else {
                fill(255, 0, 0);
                text("Game Over!\nScore: " + this.gameState.score + 
                     "\nPress SPACE to restart", width/2, height/2);
            }
        }
    }

    startGame() {
        // Reset character
        this.character = new Character(width - 300, this.worldPos.floorPos_y);
        
        // Reset world position
        this.worldPos.scrollPos = 0;
        
        // Reset game state
        this.gameState.isLeft = false;
        this.gameState.isRight = false;
        this.gameState.isJumping = false;
        this.gameState.isPlummeting = false;
        this.gameState.isGameOver = false;
        
        // Initialize game objects
        this.scene.setup();
        
        // Set flagpole position
        this.flagpole.x_pos = this.scene.gameObjects.canyons[2].x_pos + 
                             this.scene.gameObjects.canyons[2].width + 400;
        this.flagpole.isReached = false;
    }

    handleLevelComplete() {
        this.character.y = this.worldPos.floorPos_y;
        this.gameState.isPlummeting = false;
        this.gameState.isJumping = false;
        this.gameState.isGameOver = true;
    }
}