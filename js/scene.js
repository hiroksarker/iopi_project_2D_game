class Scene {
    constructor(worldPos) {
        this.worldPos = worldPos;
        this.gameObjects = {
            mountains: [],
            clouds: [],
            trees: [],
            canyons: [],
            collectables: []
        };
        this.setup();
    }

    setup() {
        this.initializeGameObjects();
    }

    initializeGameObjects() {
        // Initialize canyons
        this.gameObjects.canyons = [
            new Canyon(220, 150, height - this.worldPos.floorPos_y),
            new Canyon(570, 120, height - this.worldPos.floorPos_y),
            new Canyon(1000, 180, height - this.worldPos.floorPos_y)
        ];

        // Initialize collectables
        this.initializeCollectables();

        // Initialize clouds
        this.gameObjects.clouds = [
            { x_pos: 100, y_pos: 100, size: 60 },
            { x_pos: 300, y_pos: 150, size: 80 },
            { x_pos: 600, y_pos: 120, size: 70 },
            { x_pos: 900, y_pos: 100, size: 50 }
        ];

        // Initialize mountains
        this.gameObjects.mountains = [
            { x_pos: 50, y_pos: this.worldPos.floorPos_y, height: 300, width: 350 },
            { x_pos: 400, y_pos: this.worldPos.floorPos_y, height: 150, width: 200 },
            { x_pos: 700, y_pos: this.worldPos.floorPos_y, height: 400, width: 500 }
        ];

        // Initialize trees
        this.gameObjects.trees = [
            { x_pos: 200, y_pos: this.worldPos.floorPos_y },
            { x_pos: 500, y_pos: this.worldPos.floorPos_y },
            { x_pos: 800, y_pos: this.worldPos.floorPos_y }
        ];
    }

    initializeCollectables() {
        const canyon1 = this.gameObjects.canyons[0];
        const canyon2 = this.gameObjects.canyons[1];

        this.gameObjects.collectables = [
            new Collectable(canyon1.x_pos - 300, this.worldPos.floorPos_y - 120, 50),
            new Collectable(canyon1.x_pos - 100, this.worldPos.floorPos_y - 180, 50),
            new Collectable(canyon1.x_pos + canyon1.width + 100, this.worldPos.floorPos_y - 180, 50),
            new Collectable(canyon1.x_pos + canyon1.width + 300, this.worldPos.floorPos_y - 120, 50),
            new Collectable(canyon2.x_pos - 100, this.worldPos.floorPos_y - 180, 50),
            new Collectable(canyon2.x_pos + canyon2.width + 100, this.worldPos.floorPos_y - 180, 50),
            new Collectable(canyon2.x_pos + canyon2.width + 300, this.worldPos.floorPos_y - 120, 50)
        ];
    }

    drawSceneElements() {
        this.drawMountains();
        this.drawClouds();
        this.drawTrees();
    }

    drawMountains() {
        this.gameObjects.mountains.forEach(mountain => {
            // Main mountain body
            fill(119, 136, 153);
            triangle(
                mountain.x_pos, mountain.y_pos,
                mountain.x_pos + mountain.width / 2, mountain.y_pos - mountain.height,
                mountain.x_pos + mountain.width, mountain.y_pos
            );
            
            // Snow cap
            fill(255);
            triangle(
                mountain.x_pos + mountain.width / 4, mountain.y_pos - mountain.height / 2,
                mountain.x_pos + mountain.width / 2, mountain.y_pos - mountain.height,
                mountain.x_pos + (mountain.width * 3 / 4), mountain.y_pos - mountain.height / 2
            );
        });
    }

    drawClouds() {
        fill(255);
        this.gameObjects.clouds.forEach(cloud => {
            ellipse(cloud.x_pos, cloud.y_pos, cloud.size, cloud.size);
            ellipse(cloud.x_pos + 30, cloud.y_pos, cloud.size * 0.8, cloud.size * 0.8);
            ellipse(cloud.x_pos + 50, cloud.y_pos, cloud.size * 0.6, cloud.size * 0.6);
        });
    }

    drawTrees() {
        this.gameObjects.trees.forEach(tree => {
            // Tree trunk
            fill(139, 69, 19);
            rect(tree.x_pos - 20, tree.y_pos - 150, 40, 150);
            
            // Tree foliage
            fill(34, 139, 34);
            ellipse(tree.x_pos, tree.y_pos - 200, 150, 150);
            ellipse(tree.x_pos - 50, tree.y_pos - 150, 100, 100);
            ellipse(tree.x_pos + 50, tree.y_pos - 150, 100, 100);
        });
    }

    drawGameObjects() {
        // Draw canyons
        this.gameObjects.canyons.forEach(canyon => canyon.draw());
        
        // Draw collectables
        this.gameObjects.collectables.forEach(collectable => {
            if (!collectable.isFound) {
                collectable.draw();
            }
        });
    }
}