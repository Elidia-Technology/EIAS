# AS4 Examples - Graphics and Animation

This guide demonstrates how to create visual applications and animations using AS4's graphics capabilities.

## Table of Contents

1. [Basic Drawing](#basic-drawing)
2. [Animated Sprite](#animated-sprite)
3. [Interactive Canvas](#interactive-canvas)
4. [Particle System](#particle-system)
5. [Game Character](#game-character)
6. [Drawing Application](#drawing-application)
7. [3D-Style Effects](#3d-style-effects)

---

## Basic Drawing

Simple graphics drawing and shapes.

### BasicDrawing.as

```actionscript
package examples.graphics {
    import as4.graphics.Sprite;
    import as4.graphics.Graphics;
    import as4.events.Event;

    public class BasicDrawing extends Sprite {
        private var canvas:Graphics;

        public function BasicDrawing() {
            super();
            canvas = this.graphics;
            drawShapes();
        }

        private function drawShapes():void {
            // Draw a filled rectangle
            canvas.beginFill(0xFF0000); // Red
            canvas.drawRect(50, 50, 100, 80);
            canvas.endFill();

            // Draw a circle with border
            canvas.lineStyle(3, 0x0000FF); // Blue border
            canvas.beginFill(0x00FF00); // Green fill
            canvas.drawCircle(200, 90, 40);
            canvas.endFill();

            // Draw a line
            canvas.lineStyle(2, 0x000000);
            canvas.moveTo(300, 50);
            canvas.lineTo(400, 130);

            // Draw a triangle
            canvas.beginFill(0xFFFF00); // Yellow
            canvas.moveTo(450, 50);
            canvas.lineTo(500, 130);
            canvas.lineTo(400, 130);
            canvas.lineTo(450, 50);
            canvas.endFill();

            // Draw gradient rectangle
            drawGradientRect(50, 200, 150, 100);

            // Draw rounded rectangle
            canvas.beginFill(0xFF00FF); // Magenta
            canvas.drawRoundRect(250, 200, 120, 80, 20);
            canvas.endFill();
        }

        private function drawGradientRect(x:Number, y:Number, width:Number, height:Number):void {
            // Simulate gradient with multiple rectangles
            var steps:int = 20;
            var stepWidth:Number = width / steps;
            
            for (var i:int = 0; i < steps; i++) {
                var ratio:Number = i / (steps - 1);
                var red:int = Math.floor(255 * (1 - ratio));
                var blue:int = Math.floor(255 * ratio);
                var color:uint = (red << 16) | blue;
                
                canvas.beginFill(color);
                canvas.drawRect(x + i * stepWidth, y, stepWidth, height);
                canvas.endFill();
            }
        }

        public function clear():void {
            canvas.clear();
        }

        public function redraw():void {
            clear();
            drawShapes();
        }
    }
}
```

---

## Animated Sprite

Create moving and animated sprites.

### AnimatedSprite.as

```actionscript
package examples.graphics {
    import as4.graphics.Sprite;
    import as4.graphics.Graphics;
    import as4.events.Event;
    import as4.utils.Timer;

    public class AnimatedSprite extends Sprite {
        private var animationTimer:Timer;
        private var currentFrame:int = 0;
        private var totalFrames:int = 8;
        private var frameWidth:Number = 64;
        private var frameHeight:Number = 64;
        private var animationSpeed:Number = 100; // milliseconds per frame

        public function AnimatedSprite() {
            super();
            createAnimation();
            startAnimation();
        }

        private function createAnimation():void {
            // Create animation frames (simulated sprite sheet)
            drawFrame(currentFrame);
        }

        private function drawFrame(frameIndex:int):void {
            graphics.clear();
            
            // Different animation frames
            switch(frameIndex) {
                case 0:
                case 4:
                    drawIdleFrame();
                    break;
                case 1:
                case 3:
                    drawWalkFrame1();
                    break;
                case 2:
                    drawWalkFrame2();
                    break;
                case 5:
                case 7:
                    drawJumpFrame();
                    break;
                case 6:
                    drawCrouchFrame();
                    break;
            }
        }

        private function drawIdleFrame():void {
            // Body
            graphics.beginFill(0x0066CC);
            graphics.drawRect(20, 20, 24, 32);
            graphics.endFill();
            
            // Head
            graphics.beginFill(0xFFCC99);
            graphics.drawCircle(32, 15, 8);
            graphics.endFill();
            
            // Arms
            graphics.beginFill(0xFFCC99);
            graphics.drawRect(10, 25, 8, 20);
            graphics.drawRect(46, 25, 8, 20);
            graphics.endFill();
            
            // Legs
            graphics.beginFill(0x003366);
            graphics.drawRect(22, 52, 8, 12);
            graphics.drawRect(34, 52, 8, 12);
            graphics.endFill();
        }

        private function drawWalkFrame1():void {
            // Similar to idle but with offset limbs
            graphics.beginFill(0x0066CC);
            graphics.drawRect(20, 20, 24, 32);
            graphics.endFill();
            
            graphics.beginFill(0xFFCC99);
            graphics.drawCircle(32, 15, 8);
            graphics.endFill();
            
            // Arms swinging
            graphics.beginFill(0xFFCC99);
            graphics.drawRect(8, 23, 8, 20); // Left arm forward
            graphics.drawRect(48, 27, 8, 20); // Right arm back
            graphics.endFill();
            
            // Legs walking
            graphics.beginFill(0x003366);
            graphics.drawRect(20, 52, 8, 12); // Left leg forward
            graphics.drawRect(36, 52, 8, 12); // Right leg back
            graphics.endFill();
        }

        private function drawWalkFrame2():void {
            // Opposite of frame 1
            graphics.beginFill(0x0066CC);
            graphics.drawRect(20, 20, 24, 32);
            graphics.endFill();
            
            graphics.beginFill(0xFFCC99);
            graphics.drawCircle(32, 15, 8);
            graphics.endFill();
            
            // Arms swinging opposite
            graphics.beginFill(0xFFCC99);
            graphics.drawRect(12, 27, 8, 20); // Left arm back
            graphics.drawRect(44, 23, 8, 20); // Right arm forward
            graphics.endFill();
            
            // Legs walking opposite
            graphics.beginFill(0x003366);
            graphics.drawRect(24, 52, 8, 12); // Left leg back
            graphics.drawRect(32, 52, 8, 12); // Right leg forward
            graphics.endFill();
        }

        private function drawJumpFrame():void {
            // Body in air
            graphics.beginFill(0x0066CC);
            graphics.drawRect(20, 18, 24, 32);
            graphics.endFill();
            
            graphics.beginFill(0xFFCC99);
            graphics.drawCircle(32, 13, 8);
            graphics.endFill();
            
            // Arms up
            graphics.beginFill(0xFFCC99);
            graphics.drawRect(6, 15, 8, 20);
            graphics.drawRect(50, 15, 8, 20);
            graphics.endFill();
            
            // Legs tucked
            graphics.beginFill(0x003366);
            graphics.drawRect(24, 48, 6, 10);
            graphics.drawRect(34, 48, 6, 10);
            graphics.endFill();
        }

        private function drawCrouchFrame():void {
            // Crouched body
            graphics.beginFill(0x0066CC);
            graphics.drawRect(20, 35, 24, 20);
            graphics.endFill();
            
            graphics.beginFill(0xFFCC99);
            graphics.drawCircle(32, 25, 8);
            graphics.endFill();
            
            // Arms down
            graphics.beginFill(0xFFCC99);
            graphics.drawRect(12, 40, 8, 15);
            graphics.drawRect(44, 40, 8, 15);
            graphics.endFill();
            
            // Legs bent
            graphics.beginFill(0x003366);
            graphics.drawRect(22, 55, 8, 9);
            graphics.drawRect(34, 55, 8, 9);
            graphics.endFill();
        }

        private function startAnimation():void {
            animationTimer = new Timer(animationSpeed, onAnimationTick);
            animationTimer.start();
        }

        private function onAnimationTick():void {
            currentFrame = (currentFrame + 1) % totalFrames;
            drawFrame(currentFrame);
        }

        public function stopAnimation():void {
            if (animationTimer) {
                animationTimer.stop();
            }
        }

        public function setAnimationSpeed(speed:Number):void {
            animationSpeed = speed;
            if (animationTimer) {
                animationTimer.delay = speed;
            }
        }

        public function gotoFrame(frame:int):void {
            if (frame >= 0 && frame < totalFrames) {
                currentFrame = frame;
                drawFrame(currentFrame);
            }
        }
    }
}
```

---

## Interactive Canvas

Create an interactive drawing surface.

### InteractiveCanvas.as

```actionscript
package examples.graphics {
    import as4.graphics.Sprite;
    import as4.graphics.Graphics;
    import as4.events.MouseEvent;
    import as4.events.Event;

    public class InteractiveCanvas extends Sprite {
        private var isDrawing:Boolean = false;
        private var currentTool:String = "brush";
        private var brushColor:uint = 0x000000;
        private var brushSize:Number = 3;
        private var lastX:Number;
        private var lastY:Number;
        
        private var shapes:Array;
        private var currentShape:Object;

        public function InteractiveCanvas(width:Number = 800, height:Number = 600) {
            super();
            shapes = [];
            setupCanvas(width, height);
            addEventListeners();
        }

        private function setupCanvas(width:Number, height:Number):void {
            // Draw canvas background
            graphics.beginFill(0xFFFFFF);
            graphics.lineStyle(1, 0xCCCCCC);
            graphics.drawRect(0, 0, width, height);
            graphics.endFill();
        }

        private function addEventListeners():void {
            addEventListener(MouseEvent.MOUSE_DOWN, onMouseDown);
            addEventListener(MouseEvent.MOUSE_MOVE, onMouseMove);
            addEventListener(MouseEvent.MOUSE_UP, onMouseUp);
        }

        private function onMouseDown(event:MouseEvent):void {
            isDrawing = true;
            lastX = event.localX;
            lastY = event.localY;

            switch(currentTool) {
                case "brush":
                    startBrushStroke();
                    break;
                case "line":
                    startLine();
                    break;
                case "rectangle":
                    startRectangle();
                    break;
                case "circle":
                    startCircle();
                    break;
            }
        }

        private function onMouseMove(event:MouseEvent):void {
            if (!isDrawing) return;

            switch(currentTool) {
                case "brush":
                    continueBrushStroke(event.localX, event.localY);
                    break;
                case "line":
                    updateLine(event.localX, event.localY);
                    break;
                case "rectangle":
                    updateRectangle(event.localX, event.localY);
                    break;
                case "circle":
                    updateCircle(event.localX, event.localY);
                    break;
            }
        }

        private function onMouseUp(event:MouseEvent):void {
            if (!isDrawing) return;
            
            isDrawing = false;
            
            switch(currentTool) {
                case "brush":
                    finishBrushStroke();
                    break;
                case "line":
                    finishLine(event.localX, event.localY);
                    break;
                case "rectangle":
                    finishRectangle(event.localX, event.localY);
                    break;
                case "circle":
                    finishCircle(event.localX, event.localY);
                    break;
            }
        }

        // Brush tool methods
        private function startBrushStroke():void {
            currentShape = {
                type: "brush",
                points: [{x: lastX, y: lastY}],
                color: brushColor,
                size: brushSize
            };
            
            graphics.lineStyle(brushSize, brushColor);
            graphics.moveTo(lastX, lastY);
        }

        private function continueBrushStroke(x:Number, y:Number):void {
            currentShape.points.push({x: x, y: y});
            graphics.lineTo(x, y);
            lastX = x;
            lastY = y;
        }

        private function finishBrushStroke():void {
            shapes.push(currentShape);
            currentShape = null;
        }

        // Line tool methods
        private function startLine():void {
            currentShape = {
                type: "line",
                startX: lastX,
                startY: lastY,
                endX: lastX,
                endY: lastY,
                color: brushColor,
                size: brushSize
            };
        }

        private function updateLine(x:Number, y:Number):void {
            currentShape.endX = x;
            currentShape.endY = y;
            redrawCanvas();
            
            // Draw preview line
            graphics.lineStyle(brushSize, brushColor);
            graphics.moveTo(currentShape.startX, currentShape.startY);
            graphics.lineTo(x, y);
        }

        private function finishLine(x:Number, y:Number):void {
            currentShape.endX = x;
            currentShape.endY = y;
            shapes.push(currentShape);
            currentShape = null;
            redrawCanvas();
        }

        // Rectangle tool methods
        private function startRectangle():void {
            currentShape = {
                type: "rectangle",
                startX: lastX,
                startY: lastY,
                width: 0,
                height: 0,
                color: brushColor,
                size: brushSize
            };
        }

        private function updateRectangle(x:Number, y:Number):void {
            currentShape.width = x - currentShape.startX;
            currentShape.height = y - currentShape.startY;
            redrawCanvas();
            
            // Draw preview rectangle
            graphics.lineStyle(brushSize, brushColor);
            graphics.drawRect(currentShape.startX, currentShape.startY, 
                            currentShape.width, currentShape.height);
        }

        private function finishRectangle(x:Number, y:Number):void {
            currentShape.width = x - currentShape.startX;
            currentShape.height = y - currentShape.startY;
            shapes.push(currentShape);
            currentShape = null;
            redrawCanvas();
        }

        // Circle tool methods
        private function startCircle():void {
            currentShape = {
                type: "circle",
                centerX: lastX,
                centerY: lastY,
                radius: 0,
                color: brushColor,
                size: brushSize
            };
        }

        private function updateCircle(x:Number, y:Number):void {
            var dx:Number = x - currentShape.centerX;
            var dy:Number = y - currentShape.centerY;
            currentShape.radius = Math.sqrt(dx * dx + dy * dy);
            redrawCanvas();
            
            // Draw preview circle
            graphics.lineStyle(brushSize, brushColor);
            graphics.drawCircle(currentShape.centerX, currentShape.centerY, currentShape.radius);
        }

        private function finishCircle(x:Number, y:Number):void {
            var dx:Number = x - currentShape.centerX;
            var dy:Number = y - currentShape.centerY;
            currentShape.radius = Math.sqrt(dx * dx + dy * dy);
            shapes.push(currentShape);
            currentShape = null;
            redrawCanvas();
        }

        private function redrawCanvas():void {
            graphics.clear();
            setupCanvas(800, 600); // Redraw background
            
            // Redraw all shapes
            for (var i:int = 0; i < shapes.length; i++) {
                var shape:Object = shapes[i];
                drawShape(shape);
            }
        }

        private function drawShape(shape:Object):void {
            graphics.lineStyle(shape.size, shape.color);
            
            switch(shape.type) {
                case "brush":
                    if (shape.points.length > 1) {
                        graphics.moveTo(shape.points[0].x, shape.points[0].y);
                        for (var j:int = 1; j < shape.points.length; j++) {
                            graphics.lineTo(shape.points[j].x, shape.points[j].y);
                        }
                    }
                    break;
                    
                case "line":
                    graphics.moveTo(shape.startX, shape.startY);
                    graphics.lineTo(shape.endX, shape.endY);
                    break;
                    
                case "rectangle":
                    graphics.drawRect(shape.startX, shape.startY, shape.width, shape.height);
                    break;
                    
                case "circle":
                    graphics.drawCircle(shape.centerX, shape.centerY, shape.radius);
                    break;
            }
        }

        // Public methods for tool control
        public function setTool(tool:String):void {
            currentTool = tool;
        }

        public function setBrushColor(color:uint):void {
            brushColor = color;
        }

        public function setBrushSize(size:Number):void {
            brushSize = size;
        }

        public function clearCanvas():void {
            shapes = [];
            graphics.clear();
            setupCanvas(800, 600);
        }

        public function undo():void {
            if (shapes.length > 0) {
                shapes.pop();
                redrawCanvas();
            }
        }

        public function exportDrawing():String {
            // Return simplified drawing data as JSON
            return JSON.stringify(shapes);
        }

        public function importDrawing(data:String):void {
            try {
                shapes = JSON.parse(data);
                redrawCanvas();
            } catch (error:Error) {
                trace("Error importing drawing: " + error.message);
            }
        }
    }
}
```

---

## Particle System

Create dynamic particle effects.

### ParticleSystem.as

```actionscript
package examples.graphics {
    import as4.graphics.Sprite;
    import as4.graphics.Graphics;
    import as4.events.Event;
    import as4.utils.Timer;

    public class ParticleSystem extends Sprite {
        private var particles:Array;
        private var maxParticles:int = 100;
        private var emissionRate:Number = 10; // particles per second
        private var updateTimer:Timer;
        private var emissionTimer:Timer;
        
        private var emitterX:Number = 400;
        private var emitterY:Number = 300;
        private var gravity:Number = 0.5;
        private var wind:Number = 0.1;

        public function ParticleSystem() {
            super();
            particles = [];
            startSystem();
        }

        private function startSystem():void {
            // Update particles at 60fps
            updateTimer = new Timer(1000 / 60, updateParticles);
            updateTimer.start();
            
            // Emit particles at specified rate
            emissionTimer = new Timer(1000 / emissionRate, emitParticle);
            emissionTimer.start();
        }

        private function emitParticle():void {
            if (particles.length >= maxParticles) {
                // Remove oldest particle
                particles.shift();
            }

            var particle:Object = createParticle();
            particles.push(particle);
        }

        private function createParticle():Object {
            // Random properties for variety
            var angle:Number = Math.random() * Math.PI * 2;
            var speed:Number = 2 + Math.random() * 5;
            var size:Number = 2 + Math.random() * 6;
            var life:Number = 60 + Math.random() * 120; // frames
            
            return {
                x: emitterX + (Math.random() - 0.5) * 20,
                y: emitterY + (Math.random() - 0.5) * 20,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                size: size,
                originalSize: size,
                life: life,
                maxLife: life,
                color: getRandomColor(),
                alpha: 1.0,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.2
            };
        }

        private function getRandomColor():uint {
            var colors:Array = [
                0xFF4444, // Red
                0xFF8844, // Orange
                0xFFFF44, // Yellow
                0x44FF44, // Green
                0x4444FF, // Blue
                0xFF44FF, // Magenta
                0x44FFFF  // Cyan
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        private function updateParticles():void {
            graphics.clear();
            
            for (var i:int = particles.length - 1; i >= 0; i--) {
                var particle:Object = particles[i];
                
                // Update physics
                particle.velocityY += gravity;
                particle.velocityX += wind;
                
                particle.x += particle.velocityX;
                particle.y += particle.velocityY;
                
                // Update rotation
                particle.rotation += particle.rotationSpeed;
                
                // Update life
                particle.life--;
                
                // Fade out over time
                particle.alpha = particle.life / particle.maxLife;
                particle.size = particle.originalSize * particle.alpha;
                
                // Remove dead particles
                if (particle.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                
                // Draw particle
                drawParticle(particle);
            }
        }

        private function drawParticle(particle:Object):void {
            // Calculate alpha-blended color
            var alpha:Number = particle.alpha;
            var color:uint = particle.color;
            
            graphics.beginFill(color, alpha);
            
            // Draw as rotated square
            var size:Number = particle.size;
            var halfSize:Number = size / 2;
            
            // Simple rotation by drawing at offset positions
            var cos:Number = Math.cos(particle.rotation);
            var sin:Number = Math.sin(particle.rotation);
            
            // Calculate rotated corners
            var x1:Number = particle.x + (-halfSize * cos - -halfSize * sin);
            var y1:Number = particle.y + (-halfSize * sin + -halfSize * cos);
            var x2:Number = particle.x + (halfSize * cos - -halfSize * sin);
            var y2:Number = particle.y + (halfSize * sin + -halfSize * cos);
            var x3:Number = particle.x + (halfSize * cos - halfSize * sin);
            var y3:Number = particle.y + (halfSize * sin + halfSize * cos);
            var x4:Number = particle.x + (-halfSize * cos - halfSize * sin);
            var y4:Number = particle.y + (-halfSize * sin + halfSize * cos);
            
            // Draw rotated quad
            graphics.moveTo(x1, y1);
            graphics.lineTo(x2, y2);
            graphics.lineTo(x3, y3);
            graphics.lineTo(x4, y4);
            graphics.lineTo(x1, y1);
            
            graphics.endFill();
        }

        // Public control methods
        public function setEmitterPosition(x:Number, y:Number):void {
            emitterX = x;
            emitterY = y;
        }

        public function setGravity(g:Number):void {
            gravity = g;
        }

        public function setWind(w:Number):void {
            wind = w;
        }

        public function setEmissionRate(rate:Number):void {
            emissionRate = rate;
            if (emissionTimer) {
                emissionTimer.delay = 1000 / rate;
            }
        }

        public function setMaxParticles(max:int):void {
            maxParticles = max;
        }

        public function burst(count:int = 20):void {
            for (var i:int = 0; i < count; i++) {
                emitParticle();
            }
        }

        public function stop():void {
            if (updateTimer) updateTimer.stop();
            if (emissionTimer) emissionTimer.stop();
        }

        public function start():void {
            if (updateTimer) updateTimer.start();
            if (emissionTimer) emissionTimer.start();
        }

        public function clear():void {
            particles = [];
            graphics.clear();
        }
    }
}
```

### Particle System Usage

```actionscript
// Create particle system
var particleSystem:ParticleSystem = new ParticleSystem();
stage.addChild(particleSystem);

// Configure the system
particleSystem.setEmitterPosition(400, 300);
particleSystem.setGravity(0.2);
particleSystem.setWind(0.05);
particleSystem.setEmissionRate(15);

// Create different effects
function createFireworks():void {
    particleSystem.setGravity(0.3);
    particleSystem.setWind(0);
    particleSystem.burst(50);
}

function createSnow():void {
    particleSystem.setGravity(0.1);
    particleSystem.setWind(-0.02);
    particleSystem.setEmissionRate(5);
}

function createFountain():void {
    particleSystem.setGravity(0.5);
    particleSystem.setWind(0.1);
    particleSystem.setEmissionRate(20);
}
```

This graphics documentation provides comprehensive examples for creating visual applications with AS4, from basic drawing to complex particle systems and interactive canvases.
