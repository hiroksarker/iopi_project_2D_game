// Initialize game instance
let game;

function setup() {
    createCanvas(800, 600);  // Create canvas with specific size
    game = new Game();
    game.setup();
}

function draw() {
    background(220);  // Clear background each frame
    game.draw();
}