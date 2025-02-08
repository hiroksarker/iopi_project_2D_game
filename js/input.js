function keyPressed() {
    if (game.gameState.isGameOver && keyCode == 32) {
        game.startGame();
        return;
    }
    
    if (!game.gameState.isGameOver) {
        switch(keyCode) {
            case LEFT_ARROW:
                game.gameState.isLeft = true;
                break;
            case RIGHT_ARROW:
                game.gameState.isRight = true;
                break;
            case UP_ARROW:
                if (!game.gameState.isJumping && 
                    game.character.y === game.worldPos.floorPos_y) {
                    game.gameState.isJumping = true;
                    game.character.jumpVelocity = JUMP_POWER;
                }
                break;
        }
    }
}

function keyReleased() {
    if (!game.gameState.isGameOver) {
        switch(keyCode) {
            case LEFT_ARROW:
                game.gameState.isLeft = false;
                break;
            case RIGHT_ARROW:
                game.gameState.isRight = false;
                break;
        }
    }
}