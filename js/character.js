class Character {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.world_x = x;
        this.jumpVelocity = 0;
        this.width = 40;
        this.height = 80;
        
        this.colors = {
            skin: color(255, 228, 196),
            hair: color(60, 40, 20),
            body: color(0, 140, 255),
            shoes: color(40),
            eyes: color(70, 50, 120)
        };
    }

    draw() {
        push();
        scale(1);
        strokeWeight(1);
        this.drawHead();
        this.drawBody();
        this.drawArms();
        this.drawLegs();
        pop();
    }

    drawHead() {
        // Ears
        fill(this.colors.skin);
        ellipse(this.x - 20, this.y - 65, 12, 15);
        ellipse(this.x + 20, this.y - 65, 12, 15);
        
        // Head
        fill(this.colors.skin);
        ellipse(this.x, this.y - 65, 40, 45);
        
        // Hair
        fill(this.colors.hair);
        arc(this.x, this.y - 75, 40, 30, PI, TWO_PI);
        
        // Eyes
        fill(255);
        ellipse(this.x - 8, this.y - 70, 8, 6);
        ellipse(this.x + 8, this.y - 70, 8, 6);
        fill(this.colors.eyes);
        ellipse(this.x - 8, this.y - 70, 4, 4);
        ellipse(this.x + 8, this.y - 70, 4, 4);
        fill(0);
        ellipse(this.x - 8, this.y - 70, 2, 2);
        ellipse(this.x + 8, this.y - 70, 2, 2);
        
        // Eyebrows
        stroke(this.colors.hair);
        strokeWeight(1.5);
        line(this.x - 12, this.y - 76, this.x - 4, this.y - 76);
        line(this.x + 4, this.y - 76, this.x + 12, this.y - 76);
        
        // Nose and mouth
        stroke(0);
        strokeWeight(1);
        line(this.x, this.y - 70, this.x, this.y - 65);
        noFill();
        arc(this.x, this.y - 65, 5, 3, 0, PI);
        arc(this.x, this.y - 60, 20, 10, 0, PI);
    }

    drawBody() {
        // Neck
        fill(this.colors.skin);
        rect(this.x - 5, this.y - 50, 10, 8);
        
        // Torso
        fill(this.colors.body);
        rect(this.x - 20, this.y - 42, 40, 45);
        
        // Clothing details
        stroke(0, 100, 200);
        line(this.x, this.y - 42, this.x, this.y - 15);
        fill(0, 100, 180);
        rect(this.x - 20, this.y - 42, 40, 5);
    }

    drawArms() {
        stroke(0);
        fill(this.colors.skin);
        
        // Left arm
        beginShape();
        vertex(this.x - 20, this.y - 40);
        vertex(this.x - 25, this.y - 30);
        vertex(this.x - 28, this.y - 20);
        vertex(this.x - 23, this.y - 20);
        vertex(this.x - 20, this.y - 30);
        endShape(CLOSE);
        
        // Right arm
        beginShape();
        vertex(this.x + 20, this.y - 40);
        vertex(this.x + 25, this.y - 30);
        vertex(this.x + 28, this.y - 20);
        vertex(this.x + 23, this.y - 20);
        vertex(this.x + 20, this.y - 30);
        endShape(CLOSE);
        
        // Hands
        fill(this.colors.skin);
        ellipse(this.x - 28, this.y - 18, 8, 8);
        ellipse(this.x + 28, this.y - 18, 8, 8);
    }

    drawLegs() {
        // Legs
        fill(0, 100, 200);
        
        // Left leg
        beginShape();
        vertex(this.x - 18, this.y + 5);
        vertex(this.x - 8, this.y + 5);
        vertex(this.x - 5, this.y - 15);
        vertex(this.x - 20, this.y - 15);
        endShape(CLOSE);
        
        // Right leg
        beginShape();
        vertex(this.x + 8, this.y + 5);
        vertex(this.x + 18, this.y + 5);
        vertex(this.x + 20, this.y - 15);
        vertex(this.x + 5, this.y - 15);
        endShape(CLOSE);
        
        // Shoes
        fill(this.colors.shoes);
        
        // Left shoe
        beginShape();
        vertex(this.x - 20, this.y + 5);
        vertex(this.x - 7, this.y + 5);
        vertex(this.x - 5, this.y + 7);
        vertex(this.x - 5, this.y + 12);
        vertex(this.x - 22, this.y + 12);
        endShape(CLOSE);
        
        // Right shoe
        beginShape();
        vertex(this.x + 7, this.y + 5);
        vertex(this.x + 20, this.y + 5);
        vertex(this.x + 22, this.y + 12);
        vertex(this.x + 5, this.y + 12);
        vertex(this.x + 5, this.y + 7);
        endShape(CLOSE);
    }

    update() {
        if (game.gameState.isJumping) {
            this.y -= this.jumpVelocity;
            this.jumpVelocity -= GRAVITY;
        }

        if (this.y >= game.worldPos.floorPos_y && !game.gameState.isPlummeting) {
            this.y = game.worldPos.floorPos_y;
            game.gameState.isJumping = false;
            this.jumpVelocity = 0;
        }

        if (game.gameState.isPlummeting) {
            this.y += 5;
        }
    }
}
