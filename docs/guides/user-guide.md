# AS4 Framework - User Guide

A comprehensive guide to getting started with AS4 - ActionScript 3 for the modern JavaScript era.

## Table of Contents

1. [Installation & Setup](#installation--setup)
2. [Your First AS4 Application](#your-first-as4-application)
3. [Project Structure](#project-structure)
4. [ActionScript to JavaScript Migration](#actionscript-to-javascript-migration)
5. [Working with Events](#working-with-events)
6. [Graphics and Animation](#graphics-and-animation)
7. [Networking and APIs](#networking-and-apis)
8. [AI Integration](#ai-integration)
9. [Design Patterns](#design-patterns)
10. [Testing and Debugging](#testing-and-debugging)
11. [Deployment](#deployment)
12. [Best Practices](#best-practices)

---

## Installation & Setup

### Prerequisites

- Node.js 16 or higher
- npm or yarn package manager
- A code editor (VS Code recommended)

### Installing AS4

```bash
# Install AS4 globally
npm install -g as4

# Or install locally in your project
npm install as4 --save-dev

# Verify installation
as4 --version
```

### Setting up your development environment

1. **Create a new project:**
   ```bash
   mkdir my-as4-app
   cd my-as4-app
   as4 init
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Verify setup:**
   ```bash
   as4 --help
   ```

### Project Configuration

AS4 projects use `as4.config.json` for configuration:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "sourceMap": true,
    "strict": true
  },
  "include": ["src/**/*.as"],
  "exclude": ["node_modules", "dist"],
  "outputDir": "dist"
}
```

---

## Your First AS4 Application

Let's create a simple "Hello World" application to get started.

### Step 1: Create the main class

Create `src/Main.as`:

```actionscript
package {
    import as4.events.EventDispatcher;
    import as4.utils.trace;

    public class Main extends EventDispatcher {
        public function Main() {
            super();
            initialize();
        }

        private function initialize():void {
            trace("Hello, AS4 World!");
            
            // Create a simple timer
            var timer:Timer = new Timer(1000, 5);
            timer.addEventListener(TimerEvent.TIMER, onTimer);
            timer.addEventListener(TimerEvent.TIMER_COMPLETE, onTimerComplete);
            timer.start();
        }

        private function onTimer(event:TimerEvent):void {
            trace("Timer tick: " + event.target.currentCount);
        }

        private function onTimerComplete(event:TimerEvent):void {
            trace("Timer completed!");
        }
    }
}
```

### Step 2: Compile and run

```bash
# Compile the project
as4 compile

# Run the compiled JavaScript
node dist/Main.js
```

Expected output:
```
Hello, AS4 World!
Timer tick: 1
Timer tick: 2
Timer tick: 3
Timer tick: 4
Timer tick: 5
Timer completed!
```

### Step 3: Add package.json scripts

Update your `package.json`:

```json
{
  "scripts": {
    "build": "as4 compile",
    "start": "node dist/Main.js",
    "dev": "as4 compile --watch",
    "test": "as4 test"
  }
}
```

Now you can use:
```bash
npm run build  # Compile once
npm run start  # Run the app
npm run dev    # Watch for changes
```

---

## Project Structure

A typical AS4 project follows this structure:

```
my-as4-app/
├── src/                    # ActionScript source files
│   ├── Main.as            # Entry point
│   ├── models/            # Data models
│   ├── views/             # UI components
│   ├── controllers/       # Application logic
│   └── utils/             # Utility classes
├── assets/                # Static assets
│   ├── images/
│   ├── sounds/
│   └── data/
├── tests/                 # Test files
│   ├── unit/
│   └── integration/
├── dist/                  # Compiled JavaScript output
├── docs/                  # Documentation
├── as4.config.json        # AS4 configuration
├── package.json           # Node.js configuration
└── README.md
```

### Organizing your code

**By feature:**
```
src/
├── player/
│   ├── Player.as
│   ├── PlayerController.as
│   └── PlayerView.as
├── inventory/
│   ├── Item.as
│   ├── Inventory.as
│   └── InventoryUI.as
└── game/
    ├── Game.as
    ├── GameState.as
    └── GameLoop.as
```

**By layer:**
```
src/
├── models/
│   ├── Player.as
│   ├── Item.as
│   └── GameState.as
├── views/
│   ├── PlayerView.as
│   ├── InventoryView.as
│   └── GameView.as
├── controllers/
│   ├── PlayerController.as
│   ├── GameController.as
│   └── UIController.as
└── services/
    ├── DataService.as
    ├── APIService.as
    └── AudioService.as
```

---

## ActionScript to JavaScript Migration

AS4 makes it easy to migrate existing ActionScript code to modern JavaScript environments.

### Key Differences and Solutions

#### 1. Package and Import System

**ActionScript 3:**
```actionscript
package com.example.utils {
    import flash.events.EventDispatcher;
    
    public class Utility extends EventDispatcher {
        // class implementation
    }
}
```

**AS4:**
```actionscript
package com.example.utils {
    import as4.events.EventDispatcher;
    
    public class Utility extends EventDispatcher {
        // Same class implementation works!
    }
}
```

#### 2. Event System

**ActionScript 3:**
```actionscript
addEventListener(MouseEvent.CLICK, onClick);
dispatchEvent(new CustomEvent("dataLoaded"));
```

**AS4:**
```actionscript
// Same syntax works!
addEventListener(MouseEvent.CLICK, onClick);
dispatchEvent(new CustomEvent("dataLoaded"));

// Or use the enhanced version
dispatchSimpleEvent("dataLoaded", { data: result });
```

#### 3. Display Objects

**ActionScript 3:**
```actionscript
var sprite:Sprite = new Sprite();
sprite.graphics.beginFill(0xFF0000);
sprite.graphics.drawRect(0, 0, 100, 100);
addChild(sprite);
```

**AS4:**
```actionscript
// Identical syntax!
var sprite:Sprite = new Sprite();
sprite.graphics.beginFill(0xFF0000);
sprite.graphics.drawRect(0, 0, 100, 100);
addChild(sprite);
```

#### 4. Networking

**ActionScript 3:**
```actionscript
var loader:URLLoader = new URLLoader();
loader.addEventListener(Event.COMPLETE, onDataLoaded);
loader.load(new URLRequest("data.json"));
```

**AS4:**
```actionscript
// Same API with modern features
var loader:URLLoader = new URLLoader();
loader.addEventListener(Event.COMPLETE, onDataLoaded);
loader.load(new URLRequest("https://api.example.com/data.json"));

// Or use Promise-based approach
loader.loadAsync("https://api.example.com/data.json")
    .then(onDataLoaded)
    .catch(onError);
```

### Migration Strategy

1. **Start with core classes** - Migrate your foundational classes first
2. **Update imports** - Change Flash imports to AS4 imports
3. **Test incrementally** - Compile and test each migrated class
4. **Enhance gradually** - Add modern features like async/await
5. **Leverage new capabilities** - Integrate AI, modern networking, etc.

---

## Working with Events

AS4's event system is built on Node.js EventEmitter but maintains ActionScript compatibility.

### Basic Event Handling

```actionscript
package {
    import as4.events.EventDispatcher;
    import as4.events.Event;

    public class EventExample extends EventDispatcher {
        public function EventExample() {
            super();
            setupEvents();
        }

        private function setupEvents():void {
            // Standard event listener
            addEventListener("customEvent", onCustomEvent);
            
            // Event with data
            addEventListener("dataEvent", onDataEvent);
            
            // Once listener (removes itself after first call)
            addEventListener("oneTimeEvent", onOneTimeEvent, false, 0, true);
        }

        public function triggerEvents():void {
            // Dispatch simple event
            dispatchEvent(new Event("customEvent"));
            
            // Dispatch event with data
            var dataEvent:Event = new Event("dataEvent");
            dataEvent.data = { message: "Hello!", timestamp: new Date() };
            dispatchEvent(dataEvent);
            
            // Dispatch with helper method
            dispatchSimpleEvent("oneTimeEvent", { value: 42 });
        }

        private function onCustomEvent(event:Event):void {
            trace("Custom event received!");
        }

        private function onDataEvent(event:Event):void {
            trace("Data event:", event.data.message);
        }

        private function onOneTimeEvent(event:Event):void {
            trace("One-time event:", event.data.value);
        }
    }
}
```

### Custom Events

```actionscript
package events {
    import as4.events.Event;

    public class PlayerEvent extends Event {
        public static const LEVEL_UP:String = "levelUp";
        public static const HEALTH_CHANGED:String = "healthChanged";
        public static const INVENTORY_UPDATED:String = "inventoryUpdated";

        public var playerData:Object;
        public var oldValue:*;
        public var newValue:*;

        public function PlayerEvent(type:String, playerData:Object = null, bubbles:Boolean = false, cancelable:Boolean = false) {
            super(type, bubbles, cancelable);
            this.playerData = playerData;
        }

        // Convenience factory methods
        public static function levelUp(player:Object, newLevel:int):PlayerEvent {
            var event:PlayerEvent = new PlayerEvent(LEVEL_UP, player);
            event.newValue = newLevel;
            return event;
        }

        public static function healthChanged(player:Object, oldHealth:Number, newHealth:Number):PlayerEvent {
            var event:PlayerEvent = new PlayerEvent(HEALTH_CHANGED, player);
            event.oldValue = oldHealth;
            event.newValue = newHealth;
            return event;
        }
    }
}
```

### Event-Driven Architecture

```actionscript
package {
    import as4.events.EventDispatcher;
    import events.PlayerEvent;

    public class GameManager extends EventDispatcher {
        private var eventBus:EventDispatcher;

        public function GameManager() {
            super();
            eventBus = new EventDispatcher();
            setupEventBus();
        }

        private function setupEventBus():void {
            // Central event handling
            eventBus.addEventListener(PlayerEvent.LEVEL_UP, onPlayerLevelUp);
            eventBus.addEventListener(PlayerEvent.HEALTH_CHANGED, onPlayerHealthChanged);
            eventBus.addEventListener("gameStateChanged", onGameStateChanged);
        }

        public function getEventBus():EventDispatcher {
            return eventBus;
        }

        private function onPlayerLevelUp(event:PlayerEvent):void {
            trace("Player leveled up to:", event.newValue);
            // Update UI, save game, etc.
        }

        private function onPlayerHealthChanged(event:PlayerEvent):void {
            trace("Player health:", event.oldValue, "->", event.newValue);
            // Update health bar, check for game over, etc.
        }

        private function onGameStateChanged(event:Event):void {
            trace("Game state changed:", event.data.newState);
        }
    }
}
```

---

## Graphics and Animation

AS4 provides a powerful graphics API compatible with ActionScript 3 while supporting modern rendering backends.

### Basic Drawing

```actionscript
package {
    import as4.graphics.Sprite;
    import as4.graphics.Graphics;

    public class GraphicsExample extends Sprite {
        public function GraphicsExample() {
            super();
            createGraphics();
        }

        private function createGraphics():void {
            // Draw a gradient background
            graphics.beginGradientFill(
                GradientType.LINEAR,
                [0x0066CC, 0x004499],
                [1, 1],
                [0, 255],
                createGradientMatrix(400, 300, Math.PI/2)
            );
            graphics.drawRect(0, 0, 400, 300);
            graphics.endFill();

            // Draw shapes
            drawShapes();
            
            // Create animated elements
            createAnimations();
        }

        private function drawShapes():void {
            // Circle with border
            graphics.lineStyle(3, 0xFFFFFF);
            graphics.beginFill(0xFF6600);
            graphics.drawCircle(100, 100, 50);
            graphics.endFill();

            // Rounded rectangle
            graphics.beginFill(0x00FF66);
            graphics.drawRoundRect(200, 50, 120, 80, 15);
            graphics.endFill();

            // Custom path
            graphics.lineStyle(2, 0xFF0066);
            graphics.moveTo(50, 200);
            graphics.curveTo(150, 150, 250, 200);
            graphics.curveTo(350, 250, 450, 200);
        }

        private function createAnimations():void {
            // Animated rotating square
            var rotatingSquare:Sprite = new Sprite();
            rotatingSquare.graphics.beginFill(0xFFFF00);
            rotatingSquare.graphics.drawRect(-25, -25, 50, 50);
            rotatingSquare.graphics.endFill();
            rotatingSquare.x = 300;
            rotatingSquare.y = 200;
            addChild(rotatingSquare);

            // Animation timer
            var timer:Timer = new Timer(16); // ~60 FPS
            timer.addEventListener(TimerEvent.TIMER, function(event:TimerEvent):void {
                rotatingSquare.rotation += 2;
                rotatingSquare.scaleX = 1 + Math.sin(getTimer() / 1000) * 0.3;
                rotatingSquare.scaleY = 1 + Math.cos(getTimer() / 1000) * 0.3;
            });
            timer.start();
        }

        private function createGradientMatrix(width:Number, height:Number, rotation:Number):Matrix {
            var matrix:Matrix = new Matrix();
            matrix.createGradientBox(width, height, rotation);
            return matrix;
        }
    }
}
```

### Advanced Animation System

```actionscript
package animation {
    import as4.events.EventDispatcher;
    import as4.utils.Timer;

    public class Tween extends EventDispatcher {
        private var target:Object;
        private var properties:Object;
        private var duration:Number;
        private var easingFunction:Function;
        private var startValues:Object;
        private var startTime:Number;
        private var timer:Timer;

        public function Tween(target:Object, properties:Object, duration:Number, easing:Function = null) {
            super();
            this.target = target;
            this.properties = properties;
            this.duration = duration;
            this.easingFunction = easing || easeLinear;
            
            startValues = {};
            for (var prop:String in properties) {
                startValues[prop] = target[prop];
            }
        }

        public function start():void {
            startTime = getTimer();
            timer = new Timer(16); // ~60 FPS
            timer.addEventListener(TimerEvent.TIMER, onUpdate);
            timer.start();
        }

        public function stop():void {
            if (timer) {
                timer.stop();
                timer = null;
            }
        }

        private function onUpdate(event:TimerEvent):void {
            var elapsed:Number = getTimer() - startTime;
            var progress:Number = Math.min(elapsed / duration, 1);
            var easedProgress:Number = easingFunction(progress);

            // Update all properties
            for (var prop:String in properties) {
                var startValue:Number = startValues[prop];
                var endValue:Number = properties[prop];
                var currentValue:Number = startValue + (endValue - startValue) * easedProgress;
                target[prop] = currentValue;
            }

            // Check if complete
            if (progress >= 1) {
                stop();
                dispatchEvent(new Event(Event.COMPLETE));
            }
        }

        // Easing functions
        private function easeLinear(t:Number):Number {
            return t;
        }

        public static function easeInOut(t:Number):Number {
            return t * t * (3 - 2 * t);
        }

        public static function easeOutBounce(t:Number):Number {
            if (t < 1/2.75) {
                return 7.5625 * t * t;
            } else if (t < 2/2.75) {
                return 7.5625 * (t -= 1.5/2.75) * t + 0.75;
            } else if (t < 2.5/2.75) {
                return 7.5625 * (t -= 2.25/2.75) * t + 0.9375;
            } else {
                return 7.5625 * (t -= 2.625/2.75) * t + 0.984375;
            }
        }
    }
}
```

### Using the Animation System

```actionscript
// Create a sprite to animate
var animatedSprite:Sprite = new Sprite();
animatedSprite.graphics.beginFill(0xFF0000);
animatedSprite.graphics.drawCircle(0, 0, 25);
animatedSprite.graphics.endFill();
stage.addChild(animatedSprite);

// Animate position
var moveTween:Tween = new Tween(animatedSprite, {x: 400, y: 300}, 2000, Tween.easeInOut);
moveTween.addEventListener(Event.COMPLETE, onMoveComplete);
moveTween.start();

function onMoveComplete(event:Event):void {
    // Chain another animation
    var scaleTween:Tween = new Tween(animatedSprite, {scaleX: 2, scaleY: 2}, 1000, Tween.easeOutBounce);
    scaleTween.start();
}
```

---

## Networking and APIs

AS4 provides modern networking capabilities while maintaining ActionScript-style APIs.

### HTTP Requests

```actionscript
package {
    import as4.net.URLLoader;
    import as4.net.URLRequest;
    import as4.events.Event;
    import as4.utils.trace;

    public class APIExample {
        private var loader:URLLoader;

        public function APIExample() {
            setupNetworking();
        }

        private function setupNetworking():void {
            loader = new URLLoader();
            loader.addEventListener(Event.COMPLETE, onDataLoaded);
            loader.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
        }

        public function loadUserData(userId:int):void {
            var request:URLRequest = new URLRequest("https://jsonplaceholder.typicode.com/users/" + userId);
            request.method = URLRequestMethod.GET;
            request.addRequestHeader("Accept", "application/json");
            
            loader.load(request);
        }

        private function onDataLoaded(event:Event):void {
            var userData:Object = JSON.parse(loader.data as String);
            trace("User loaded:", userData.name, userData.email);
        }

        private function onLoadError(event:IOErrorEvent):void {
            trace("Failed to load user data:", event.text);
        }

        // Modern async/await style
        public async function loadUserDataAsync(userId:int):Promise {
            try {
                var request:URLRequest = new URLRequest("https://jsonplaceholder.typicode.com/users/" + userId);
                var data:String = await loader.loadAsync(request);
                var userData:Object = JSON.parse(data);
                return userData;
            } catch (error:Error) {
                trace("Error loading user:", error.message);
                throw error;
            }
        }
    }
}
```

### WebSocket Communication

```actionscript
package {
    import as4.net.Socket;
    import as4.events.Event;

    public class WebSocketExample extends EventDispatcher {
        private var socket:Socket;
        private var reconnectAttempts:int = 0;
        private var maxReconnectAttempts:int = 5;

        public function WebSocketExample() {
            super();
            connect();
        }

        private function connect():void {
            socket = new Socket();
            socket.addEventListener(Event.CONNECT, onConnect);
            socket.addEventListener(Event.CLOSE, onDisconnect);
            socket.addEventListener(ProgressEvent.SOCKET_DATA, onMessage);
            socket.addEventListener(IOErrorEvent.IO_ERROR, onError);
            
            socket.connect("localhost", 8080);
        }

        private function onConnect(event:Event):void {
            trace("Connected to server");
            reconnectAttempts = 0;
            
            // Send initial message
            sendMessage("hello", { client: "as4-app", version: "1.0" });
        }

        private function onDisconnect(event:Event):void {
            trace("Disconnected from server");
            attemptReconnect();
        }

        private function onMessage(event:ProgressEvent):void {
            while (socket.bytesAvailable > 0) {
                var messageData:String = socket.readUTF();
                var message:Object = JSON.parse(messageData);
                handleMessage(message);
            }
        }

        private function onError(event:IOErrorEvent):void {
            trace("Socket error:", event.text);
            attemptReconnect();
        }

        private function handleMessage(message:Object):void {
            switch (message.type) {
                case "chat":
                    trace("Chat message:", message.data.text);
                    dispatchSimpleEvent("chatMessage", message.data);
                    break;
                    
                case "userJoined":
                    trace("User joined:", message.data.username);
                    dispatchSimpleEvent("userJoined", message.data);
                    break;
                    
                case "gameUpdate":
                    dispatchSimpleEvent("gameUpdate", message.data);
                    break;
            }
        }

        public function sendMessage(type:String, data:Object):void {
            if (socket && socket.connected) {
                var message:Object = { type: type, data: data, timestamp: new Date().getTime() };
                socket.writeUTF(JSON.stringify(message));
                socket.flush();
            }
        }

        private function attemptReconnect():void {
            if (reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                trace("Attempting to reconnect... (" + reconnectAttempts + "/" + maxReconnectAttempts + ")");
                
                // Wait before reconnecting
                var timer:Timer = new Timer(2000, 1);
                timer.addEventListener(TimerEvent.TIMER_COMPLETE, function():void {
                    connect();
                });
                timer.start();
            } else {
                trace("Max reconnection attempts reached");
                dispatchSimpleEvent("connectionFailed");
            }
        }
    }
}
```

This user guide provides comprehensive coverage of AS4's capabilities, from basic setup to advanced features, helping developers transition from ActionScript 3 to modern JavaScript environments while maintaining familiar syntax and patterns.
