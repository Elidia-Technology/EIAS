# AS4 Examples - Game Development

This guide demonstrates how to build games using AS4's comprehensive game development features.

## Table of Contents

1. [Simple Platformer](#simple-platformer)
2. [Space Shooter](#space-shooter)
3. [Puzzle Game](#puzzle-game) 
4. [RPG Character System](#rpg-character-system)
5. [Multiplayer Game](#multiplayer-game)
6. [AI-Powered Game](#ai-powered-game)

---

## Simple Platformer

A basic 2D platformer with player movement, collision detection, and level design.

### PlatformerGame.as

```actionscript
package examples.games {
    import as4.graphics.Sprite;
    import as4.graphics.Stage;
    import as4.events.Event;
    import as4.events.KeyboardEvent;
    import as4.utils.Timer;

    public class PlatformerGame extends Sprite {
        private var player:Player;
        private var platforms:Array;
        private var gameTimer:Timer;
        private var keys:Object;
        private var gravity:Number = 0.8;
        private var gameWidth:Number = 800;
        private var gameHeight:Number = 600;
        private var score:int = 0;
        private var level:int = 1;

        public function PlatformerGame() {
            super();
            keys = {};
            initializeGame();
            setupEventListeners();
            startGameLoop();
        }

        private function initializeGame():void {
            // Create player
            player = new Player(100, 400);
            addChild(player);

            // Create platforms
            platforms = [];
            createLevel(level);

            // Draw background
            drawBackground();
        }

        private function createLevel(levelNum:int):void {
            // Clear existing platforms
            for (var i:int = 0; i < platforms.length; i++) {
                removeChild(platforms[i]);
            }
            platforms = [];

            // Level 1 platforms
            if (levelNum == 1) {
                addPlatform(0, gameHeight - 40, gameWidth, 40); // Ground
                addPlatform(200, 500, 150, 20);
                addPlatform(400, 400, 150, 20);
                addPlatform(600, 300, 150, 20);
                addPlatform(300, 250, 100, 20);
                addPlatform(500, 150, 200, 20);
            }
        }

        private function addPlatform(x:Number, y:Number, width:Number, height:Number):void {
            var platform:Platform = new Platform(x, y, width, height);
            platforms.push(platform);
            addChild(platform);
        }

        private function drawBackground():void {
            // Sky gradient
            graphics.beginFill(0x87CEEB);
            graphics.drawRect(0, 0, gameWidth, gameHeight);
            graphics.endFill();

            // Clouds
            for (var i:int = 0; i < 5; i++) {
                var cloudX:Number = Math.random() * gameWidth;
                var cloudY:Number = Math.random() * 200 + 50;
                drawCloud(cloudX, cloudY);
            }
        }

        private function drawCloud(x:Number, y:Number):void {
            graphics.beginFill(0xFFFFFF, 0.8);
            graphics.drawCircle(x, y, 30);
            graphics.drawCircle(x + 25, y, 35);
            graphics.drawCircle(x + 50, y, 30);
            graphics.drawCircle(x + 25, y - 15, 25);
            graphics.endFill();
        }

        private function setupEventListeners():void {
            stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
            stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
        }

        private function onKeyDown(event:KeyboardEvent):void {
            keys[event.keyCode] = true;
        }

        private function onKeyUp(event:KeyboardEvent):void {
            keys[event.keyCode] = false;
        }

        private function startGameLoop():void {
            gameTimer = new Timer(1000 / 60, updateGame); // 60 FPS
            gameTimer.start();
        }

        private function updateGame():void {
            handleInput();
            updatePlayer();
            checkCollisions();
            updateCamera();
            checkGameState();
        }

        private function handleInput():void {
            // Arrow keys or WASD
            if (keys[37] || keys[65]) { // Left
                player.moveLeft();
            }
            if (keys[39] || keys[68]) { // Right
                player.moveRight();
            }
            if (keys[38] || keys[87] || keys[32]) { // Up/Jump/Space
                player.jump();
            }
        }

        private function updatePlayer():void {
            player.update(gravity);
            
            // Keep player in bounds
            if (player.x < 0) player.x = 0;
            if (player.x > gameWidth - player.width) player.x = gameWidth - player.width;
            
            // Check if player fell off screen
            if (player.y > gameHeight + 100) {
                resetPlayer();
            }
        }

        private function checkCollisions():void {
            player.onGround = false;
            
            for (var i:int = 0; i < platforms.length; i++) {
                var platform:Platform = platforms[i];
                
                if (checkCollision(player, platform)) {
                    resolveCollision(player, platform);
                }
            }
        }

        private function checkCollision(rect1:Object, rect2:Object):Boolean {
            return !(rect1.x + rect1.width <= rect2.x ||
                    rect2.x + rect2.width <= rect1.x ||
                    rect1.y + rect1.height <= rect2.y ||
                    rect2.y + rect2.height <= rect1.y);
        }

        private function resolveCollision(player:Player, platform:Platform):void {
            var overlapX:Number = Math.min(player.x + player.width - platform.x,
                                         platform.x + platform.width - player.x);
            var overlapY:Number = Math.min(player.y + player.height - platform.y,
                                         platform.y + platform.height - player.y);

            if (overlapX < overlapY) {
                // Horizontal collision
                if (player.x < platform.x) {
                    player.x = platform.x - player.width;
                } else {
                    player.x = platform.x + platform.width;
                }
                player.velocityX = 0;
            } else {
                // Vertical collision
                if (player.y < platform.y) {
                    // Player is above platform (landing)
                    player.y = platform.y - player.height;
                    player.velocityY = 0;
                    player.onGround = true;
                } else {
                    // Player hit platform from below
                    player.y = platform.y + platform.height;
                    player.velocityY = 0;
                }
            }
        }

        private function updateCamera():void {
            // Simple camera follow
            var targetX:Number = -(player.x - gameWidth / 2);
            var targetY:Number = -(player.y - gameHeight / 2);
            
            // Smooth camera movement
            this.x += (targetX - this.x) * 0.1;
            this.y += (targetY - this.y) * 0.1;
            
            // Keep camera in bounds
            if (this.x > 0) this.x = 0;
            if (this.y > 0) this.y = 0;
        }

        private function checkGameState():void {
            // Check if player reached end of level
            if (player.x > gameWidth - 50) {
                nextLevel();
            }
        }

        private function nextLevel():void {
            level++;
            score += 1000;
            player.x = 100;
            player.y = 400;
            createLevel(level);
            trace("Level " + level + " - Score: " + score);
        }

        private function resetPlayer():void {
            player.x = 100;
            player.y = 400;
            player.velocityX = 0;
            player.velocityY = 0;
            score = Math.max(0, score - 100);
            trace("Player reset - Score: " + score);
        }
    }
}
```

### Player.as

```actionscript
package examples.games {
    import as4.graphics.Sprite;

    public class Player extends Sprite {
        public var velocityX:Number = 0;
        public var velocityY:Number = 0;
        public var onGround:Boolean = false;
        public var speed:Number = 5;
        public var jumpPower:Number = 15;
        public var friction:Number = 0.8;

        public function Player(x:Number, y:Number) {
            super();
            this.x = x;
            this.y = y;
            draw();
        }

        private function draw():void {
            // Player body
            graphics.beginFill(0x0066FF);
            graphics.drawRect(0, 0, 30, 40);
            graphics.endFill();
            
            // Player face
            graphics.beginFill(0xFFCC99);
            graphics.drawRect(5, 5, 20, 15);
            graphics.endFill();
            
            // Eyes
            graphics.beginFill(0x000000);
            graphics.drawCircle(10, 10, 2);
            graphics.drawCircle(20, 10, 2);
            graphics.endFill();
        }

        public function moveLeft():void {
            velocityX -= speed * 0.3;
            if (velocityX < -speed) velocityX = -speed;
        }

        public function moveRight():void {
            velocityX += speed * 0.3;
            if (velocityX > speed) velocityX = speed;
        }

        public function jump():void {
            if (onGround) {
                velocityY = -jumpPower;
                onGround = false;
            }
        }

        public function update(gravity:Number):void {
            // Apply gravity
            velocityY += gravity;
            
            // Apply friction
            velocityX *= friction;
            
            // Update position
            x += velocityX;
            y += velocityY;
            
            // Terminal velocity
            if (velocityY > 20) velocityY = 20;
        }

        public function get width():Number {
            return 30;
        }

        public function get height():Number {
            return 40;
        }
    }
}
```

### Platform.as

```actionscript
package examples.games {
    import as4.graphics.Sprite;

    public class Platform extends Sprite {
        private var platformWidth:Number;
        private var platformHeight:Number;

        public function Platform(x:Number, y:Number, width:Number, height:Number) {
            super();
            this.x = x;
            this.y = y;
            this.platformWidth = width;
            this.platformHeight = height;
            draw();
        }

        private function draw():void {
            // Platform surface
            graphics.beginFill(0x8B4513);
            graphics.drawRect(0, 0, platformWidth, platformHeight);
            graphics.endFill();
            
            // Platform highlight
            graphics.beginFill(0xDEB887);
            graphics.drawRect(0, 0, platformWidth, 3);
            graphics.endFill();
        }

        public function get width():Number {
            return platformWidth;
        }

        public function get height():Number {
            return platformHeight;
        }
    }
}
```

---

## Space Shooter

Classic space shooting game with enemies, power-ups, and progression.

### SpaceShooter.as

```actionscript
package examples.games {
    import as4.graphics.Sprite;
    import as4.events.Event;
    import as4.events.KeyboardEvent;
    import as4.utils.Timer;

    public class SpaceShooter extends Sprite {
        private var player:Ship;
        private var enemies:Array;
        private var bullets:Array;
        private var enemyBullets:Array;
        private var powerUps:Array;
        private var stars:Array;
        
        private var gameTimer:Timer;
        private var enemySpawnTimer:Timer;
        private var keys:Object;
        
        private var score:int = 0;
        private var lives:int = 3;
        private var level:int = 1;
        private var gameWidth:Number = 800;
        private var gameHeight:Number = 600;

        public function SpaceShooter() {
            super();
            keys = {};
            initializeGame();
            setupEventListeners();
            startGame();
        }

        private function initializeGame():void {
            // Initialize arrays
            enemies = [];
            bullets = [];
            enemyBullets = [];
            powerUps = [];
            stars = [];

            // Create player ship
            player = new Ship(gameWidth / 2, gameHeight - 100, true);
            addChild(player);

            // Create starfield
            createStarfield();

            // Draw UI
            drawUI();
        }

        private function createStarfield():void {
            for (var i:int = 0; i < 100; i++) {
                var star:Star = new Star(
                    Math.random() * gameWidth,
                    Math.random() * gameHeight,
                    1 + Math.random() * 2
                );
                stars.push(star);
                addChild(star);
            }
        }

        private function drawUI():void {
            // Draw UI background
            graphics.beginFill(0x000000, 0.8);
            graphics.drawRect(0, 0, gameWidth, 50);
            graphics.endFill();
        }

        private function setupEventListeners():void {
            stage.addEventListener(KeyboardEvent.KEY_DOWN, onKeyDown);
            stage.addEventListener(KeyboardEvent.KEY_UP, onKeyUp);
        }

        private function onKeyDown(event:KeyboardEvent):void {
            keys[event.keyCode] = true;
        }

        private function onKeyUp(event:KeyboardEvent):void {
            keys[event.keyCode] = false;
        }

        private function startGame():void {
            // Main game loop
            gameTimer = new Timer(1000 / 60, updateGame);
            gameTimer.start();

            // Enemy spawning
            enemySpawnTimer = new Timer(2000, spawnEnemy);
            enemySpawnTimer.start();
        }

        private function updateGame():void {
            handleInput();
            updateStars();
            updatePlayer();
            updateBullets();
            updateEnemies();
            updatePowerUps();
            checkCollisions();
            updateUI();
        }

        private function handleInput():void {
            if (keys[37] || keys[65]) { // Left
                player.moveLeft();
            }
            if (keys[39] || keys[68]) { // Right
                player.moveRight();
            }
            if (keys[38] || keys[87]) { // Up
                player.moveUp();
            }
            if (keys[40] || keys[83]) { // Down
                player.moveDown();
            }
            if (keys[32]) { // Space - shoot
                shoot();
            }
        }

        private function updateStars():void {
            for (var i:int = 0; i < stars.length; i++) {
                var star:Star = stars[i];
                star.update();
                
                if (star.y > gameHeight) {
                    star.y = -5;
                    star.x = Math.random() * gameWidth;
                }
            }
        }

        private function updatePlayer():void {
            player.update();
            
            // Keep player in bounds
            if (player.x < 0) player.x = 0;
            if (player.x > gameWidth - player.width) player.x = gameWidth - player.width;
            if (player.y < 50) player.y = 50;
            if (player.y > gameHeight - player.height) player.y = gameHeight - player.height;
        }

        private function shoot():void {
            var bullet:Bullet = player.shoot();
            if (bullet) {
                bullets.push(bullet);
                addChild(bullet);
            }
        }

        private function updateBullets():void {
            // Player bullets
            for (var i:int = bullets.length - 1; i >= 0; i--) {
                var bullet:Bullet = bullets[i];
                bullet.update();
                
                if (bullet.y < 0) {
                    removeChild(bullet);
                    bullets.splice(i, 1);
                }
            }

            // Enemy bullets
            for (i = enemyBullets.length - 1; i >= 0; i--) {
                var enemyBullet:Bullet = enemyBullets[i];
                enemyBullet.update();
                
                if (enemyBullet.y > gameHeight) {
                    removeChild(enemyBullet);
                    enemyBullets.splice(i, 1);
                }
            }
        }

        private function updateEnemies():void {
            for (var i:int = enemies.length - 1; i >= 0; i--) {
                var enemy:Ship = enemies[i];
                enemy.update();
                
                // Enemy shooting
                if (Math.random() < 0.02) { // 2% chance per frame
                    var enemyBullet:Bullet = enemy.shoot();
                    if (enemyBullet) {
                        enemyBullets.push(enemyBullet);
                        addChild(enemyBullet);
                    }
                }
                
                // Remove enemies that go off screen
                if (enemy.y > gameHeight + 50) {
                    removeChild(enemy);
                    enemies.splice(i, 1);
                }
            }
        }

        private function updatePowerUps():void {
            for (var i:int = powerUps.length - 1; i >= 0; i--) {
                var powerUp:PowerUp = powerUps[i];
                powerUp.update();
                
                if (powerUp.y > gameHeight + 50) {
                    removeChild(powerUp);
                    powerUps.splice(i, 1);
                }
            }
        }

        private function checkCollisions():void {
            // Player bullets vs enemies
            for (var i:int = bullets.length - 1; i >= 0; i--) {
                var bullet:Bullet = bullets[i];
                
                for (var j:int = enemies.length - 1; j >= 0; j--) {
                    var enemy:Ship = enemies[j];
                    
                    if (checkCollision(bullet, enemy)) {
                        // Destroy bullet and enemy
                        removeChild(bullet);
                        bullets.splice(i, 1);
                        
                        removeChild(enemy);
                        enemies.splice(j, 1);
                        
                        // Add score
                        score += 100;
                        
                        // Chance to drop power-up
                        if (Math.random() < 0.3) {
                            spawnPowerUp(enemy.x, enemy.y);
                        }
                        
                        break;
                    }
                }
            }

            // Enemy bullets vs player
            for (i = enemyBullets.length - 1; i >= 0; i--) {
                var enemyBullet:Bullet = enemyBullets[i];
                
                if (checkCollision(enemyBullet, player)) {
                    removeChild(enemyBullet);
                    enemyBullets.splice(i, 1);
                    
                    playerHit();
                    break;
                }
            }

            // Player vs power-ups
            for (i = powerUps.length - 1; i >= 0; i--) {
                var powerUp:PowerUp = powerUps[i];
                
                if (checkCollision(player, powerUp)) {
                    removeChild(powerUp);
                    powerUps.splice(i, 1);
                    
                    applyPowerUp(powerUp.type);
                    break;
                }
            }

            // Player vs enemies (direct collision)
            for (i = 0; i < enemies.length; i++) {
                if (checkCollision(player, enemies[i])) {
                    playerHit();
                    break;
                }
            }
        }

        private function checkCollision(obj1:Object, obj2:Object):Boolean {
            return !(obj1.x + obj1.width <= obj2.x ||
                    obj2.x + obj2.width <= obj1.x ||
                    obj1.y + obj1.height <= obj2.y ||
                    obj2.y + obj2.height <= obj1.y);
        }

        private function spawnEnemy():void {
            var enemyType:int = Math.floor(Math.random() * 3);
            var enemy:Ship = new Ship(Math.random() * (gameWidth - 50), -50, false, enemyType);
            enemies.push(enemy);
            addChild(enemy);
        }

        private function spawnPowerUp(x:Number, y:Number):void {
            var powerUpType:String = Math.random() < 0.5 ? "weapon" : "health";
            var powerUp:PowerUp = new PowerUp(x, y, powerUpType);
            powerUps.push(powerUp);
            addChild(powerUp);
        }

        private function applyPowerUp(type:String):void {
            switch(type) {
                case "weapon":
                    player.upgradeWeapon();
                    break;
                case "health":
                    lives = Math.min(lives + 1, 5);
                    break;
            }
        }

        private function playerHit():void {
            lives--;
            player.flash(); // Visual feedback
            
            if (lives <= 0) {
                gameOver();
            }
        }

        private function updateUI():void {
            // Clear UI area
            graphics.clear();
            graphics.beginFill(0x000000, 0.8);
            graphics.drawRect(0, 0, gameWidth, 50);
            graphics.endFill();
            
            // Draw text (simplified - would use TextField in real implementation)
            trace("Score: " + score + " Lives: " + lives + " Level: " + level);
        }

        private function gameOver():void {
            gameTimer.stop();
            enemySpawnTimer.stop();
            trace("GAME OVER - Final Score: " + score);
        }
    }
}
```

This game development documentation demonstrates how to create complete games using AS4, including physics, collision detection, AI, and game state management. The examples show progressively more complex game mechanics and patterns commonly used in game development.
