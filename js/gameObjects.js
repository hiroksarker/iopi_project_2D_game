class Collectable {
    constructor(x, y, size) {
        this.x_pos = x;
        this.y_pos = y;
        this.size = size;
        this.isFound = false;
        this.rotation = 0;
        this.hoverOffset = 0;
    }

    draw() {
        if (!this.isFound) {
            push();
            translate(this.x_pos, this.y_pos);
            
            // Add floating animation
            this.hoverOffset = sin(frameCount * 0.05) * 5;
            translate(0, this.hoverOffset);
            
            // Add rotation animation
            this.rotation += 0.02;
            rotate(this.rotation);
            
            // Draw apple
            fill(255, 0, 0);
            ellipse(0, 0, this.size, this.size);
            
            // Apple leaf
            fill(34, 139, 34);
            ellipse(-10, -this.size/2, this.size/4, this.size/6);
            
            // Apple stem
            stroke(139, 69, 19);
            strokeWeight(3);
            line(0, -this.size/2, 0, -this.size/2 - 15);
            
            // Apple shading
            noStroke();
            fill(255, 100, 100, 150);
            ellipse(10, -10, this.size * 0.5, this.size * 0.5);
            
            pop();
        }
    }

    checkCollision(character) {
        if (!this.isFound) {
            let d = dist(character.world_x, character.y, 
                        this.x_pos, this.y_pos);
            if (d < this.size * 0.8) {
                this.isFound = true;
                game.gameState.score += 1;
            }
        }
    }
}

class Canyon {
    constructor(x, width, depth) {
        this.x_pos = x;
        this.width = width;
        this.depth = depth;
    }

    draw() {
        // Main canyon shape
        fill(139, 69, 19);
        beginShape();
        vertex(this.x_pos, game.worldPos.floorPos_y);
        vertex(this.x_pos + this.width / 4, game.worldPos.floorPos_y + this.depth / 2);
        vertex(this.x_pos + this.width / 2, game.worldPos.floorPos_y + this.depth);
        vertex(this.x_pos + (3 * this.width) / 4, game.worldPos.floorPos_y + this.depth / 2);
        vertex(this.x_pos + this.width, game.worldPos.floorPos_y);
        endShape(CLOSE);

        // Canyon details
        fill(101, 67, 33);
        beginShape();
        vertex(this.x_pos + 20, game.worldPos.floorPos_y);
        vertex(this.x_pos + this.width / 4 + 20, game.worldPos.floorPos_y + this.depth / 2.5);
        vertex(this.x_pos + this.width / 2, game.worldPos.floorPos_y + this.depth - 20);
        vertex(this.x_pos + (3 * this.width) / 4 - 20, game.worldPos.floorPos_y + this.depth / 2.5);
        vertex(this.x_pos + this.width - 20, game.worldPos.floorPos_y);
        endShape(CLOSE);

        // Draw river
        fill(30, 144, 255);
        rect(this.x_pos + 10, game.worldPos.floorPos_y + this.depth - 10, 
             this.width - 20, 10);
    }
}