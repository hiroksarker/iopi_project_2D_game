class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.size = 30;
        console.log("Player created at:", x, y); // Debug log
    }

    update() {
        console.log("Player position:", this.x, this.y); // Debug log
        // Handle player movement with arrow keys
        if (keyIsDown(LEFT_ARROW)) {
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            this.x += this.speed;
        }
        if (keyIsDown(UP_ARROW)) {
            this.y -= this.speed;
        }
        if (keyIsDown(DOWN_ARROW)) {
            this.y += this.speed;
        }

        // Keep player within canvas bounds
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }

    draw() {
        fill(0, 255, 0);  // Green color
        noStroke();  // Remove outline
        circle(this.x, this.y, this.size);
    }

    collidesWith(other) {
        // Simple circle collision detection
        let d = dist(this.x, this.y, other.x, other.y);
        return d < (this.size/2 + other.size/2);
    }
} 