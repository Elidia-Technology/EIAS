# as4.patterns - Design Patterns API Reference

The `as4.patterns` package provides implementations of common design patterns optimized for AS4 development.

## Package Overview

| Pattern | Classes | Description |
|---------|---------|-------------|
| [Singleton](#singleton) | Singleton | Ensure single instance per class |
| [Factory](#factory) | Factory | Create objects without specifying exact class |
| [Observer](#observer) | Subject, IObserver, ISubject | Define one-to-many dependencies |
| [Strategy](#strategy) | Context, IStrategy | Encapsulate algorithms and make them interchangeable |
| [Command](#command) | CommandInvoker, ICommand | Encapsulate requests as objects |
| [Decorator](#decorator) | @log, @cache, @timeout | Add behavior to objects dynamically |
| [Facade](#facade) | Facade | Provide simplified interface to complex subsystem |
| [Adapter](#adapter) | Adapter | Allow incompatible interfaces to work together |

---

## Pattern: Singleton

Ensures a class has only one instance and provides global access to it.

### Class: Singleton

```typescript
abstract class Singleton
```

Base class for implementing singleton pattern.

#### Constructor

```typescript
constructor()
```

Automatically manages singleton instance creation.

#### Static Methods

```typescript
static getInstance<T extends Singleton>(): T
```

Get the singleton instance of a class.

### Example Usage

```actionscript
package app {
    import as4.patterns.Singleton;

    public class GameManager extends Singleton {
        private var score:int = 0;
        private var level:int = 1;

        public function GameManager() {
            super();
        }

        public static function getInstance():GameManager {
            return Singleton.getInstance.call(GameManager) as GameManager;
        }

        public function addScore(points:int):void {
            score += points;
            if (score >= level * 1000) {
                levelUp();
            }
        }

        private function levelUp():void {
            level++;
            trace("Level up! Now at level " + level);
        }

        public function getScore():int {
            return score;
        }

        public function getLevel():int {
            return level;
        }
    }
}

// Usage
var gameManager:GameManager = GameManager.getInstance();
gameManager.addScore(500);

// Same instance everywhere
var anotherRef:GameManager = GameManager.getInstance();
trace(gameManager === anotherRef); // true
```

### Configuration Singleton Example

```actionscript
public class Config extends Singleton {
    private var settings:Object;

    public function Config() {
        super();
        loadSettings();
    }

    public static function getInstance():Config {
        return Singleton.getInstance.call(Config) as Config;
    }

    private function loadSettings():void {
        settings = {
            apiUrl: "https://api.example.com",
            timeout: 5000,
            debugMode: true,
            version: "1.0.0"
        };
    }

    public function get(key:String):* {
        return settings[key];
    }

    public function set(key:String, value:*):void {
        settings[key] = value;
    }
}

// Usage anywhere in application
var config:Config = Config.getInstance();
var apiUrl:String = config.get("apiUrl");
config.set("debugMode", false);
```

---

## Pattern: Factory

Creates objects without specifying their exact classes.

### Class: Factory<T>

```typescript
abstract class Factory<T>
```

Generic factory base class.

#### Methods

```typescript
register(key: string, constructor: new (...args: any[]) => T): void
create(key: string, ...args: any[]): T
hasType(key: string): boolean
getRegisteredTypes(): string[]
```

### Example Usage

```actionscript
package game.entities {
    import as4.patterns.Factory;

    // Base enemy class
    public class Enemy {
        public var health:int;
        public var damage:int;

        public function Enemy(health:int, damage:int) {
            this.health = health;
            this.damage = damage;
        }

        public function attack():int {
            return damage;
        }
    }

    // Specific enemy types
    public class Goblin extends Enemy {
        public function Goblin() {
            super(50, 10);
        }
    }

    public class Dragon extends Enemy {
        public function Dragon() {
            super(200, 50);
        }
    }

    public class Skeleton extends Enemy {
        public function Skeleton() {
            super(30, 8);
        }
    }

    // Enemy factory
    public class EnemyFactory extends Factory {
        private static var _instance:EnemyFactory;

        public function EnemyFactory() {
            super();
            registerEnemies();
        }

        public static function getInstance():EnemyFactory {
            if (!_instance) {
                _instance = new EnemyFactory();
            }
            return _instance;
        }

        private function registerEnemies():void {
            register("goblin", Goblin);
            register("dragon", Dragon);
            register("skeleton", Skeleton);
        }

        public function createEnemy(type:String):Enemy {
            return create(type) as Enemy;
        }

        public function getAvailableEnemies():Array {
            return getRegisteredTypes();
        }
    }
}

// Usage
var factory:EnemyFactory = EnemyFactory.getInstance();

// Create different enemies
var goblin:Enemy = factory.createEnemy("goblin");
var dragon:Enemy = factory.createEnemy("dragon");

trace("Goblin health: " + goblin.health); // 50
trace("Dragon damage: " + dragon.damage); // 50

// List available enemy types
var enemyTypes:Array = factory.getAvailableEnemies();
trace("Available enemies: " + enemyTypes.join(", "));
```

### UI Component Factory Example

```actionscript
public class UIComponentFactory extends Factory {
    public function UIComponentFactory() {
        super();
        registerComponents();
    }

    private function registerComponents():void {
        register("button", Button);
        register("textfield", TextField);
        register("panel", Panel);
        register("slider", Slider);
    }

    public function createComponent(type:String, config:Object):UIComponent {
        var component:UIComponent = create(type) as UIComponent;
        component.configure(config);
        return component;
    }
}

// Usage
var factory:UIComponentFactory = new UIComponentFactory();

var loginButton:Button = factory.createComponent("button", {
    label: "Login",
    width: 100,
    height: 30
}) as Button;

var usernameField:TextField = factory.createComponent("textfield", {
    placeholder: "Username",
    width: 200
}) as TextField;
```

---

## Pattern: Observer

Defines a one-to-many dependency between objects.

### Interface: IObserver

```typescript
interface IObserver {
    update(subject: ISubject, data?: any): void
}
```

### Interface: ISubject

```typescript
interface ISubject {
    attach(observer: IObserver): void
    detach(observer: IObserver): void
    notify(data?: any): void
}
```

### Class: Subject

```typescript
class Subject implements ISubject
```

Concrete implementation of observable subject.

### Example Usage

```actionscript
package game {
    import as4.patterns.Subject;
    import as4.patterns.IObserver;
    import as4.patterns.ISubject;

    // Player data model
    public class Player extends Subject {
        private var _health:int = 100;
        private var _score:int = 0;
        private var _level:int = 1;

        public function get health():int {
            return _health;
        }

        public function set health(value:int):void {
            _health = Math.max(0, value);
            notify({ type: "healthChanged", health: _health });
        }

        public function get score():int {
            return _score;
        }

        public function set score(value:int):void {
            _score = value;
            notify({ type: "scoreChanged", score: _score });
        }

        public function takeDamage(amount:int):void {
            health -= amount;
            if (health <= 0) {
                notify({ type: "playerDied" });
            }
        }

        public function addScore(points:int):void {
            score += points;
            if (score >= level * 1000) {
                levelUp();
            }
        }

        private function levelUp():void {
            _level++;
            notify({ type: "levelUp", level: _level });
        }
    }

    // UI observers
    public class HealthBar implements IObserver {
        private var bar:Sprite;

        public function HealthBar() {
            bar = new Sprite();
        }

        public function update(subject:ISubject, data:*):void {
            if (data.type == "healthChanged") {
                updateHealthBar(data.health);
            } else if (data.type == "playerDied") {
                showGameOver();
            }
        }

        private function updateHealthBar(health:int):void {
            var percentage:Number = health / 100;
            bar.graphics.clear();
            bar.graphics.beginFill(0xFF0000);
            bar.graphics.drawRect(0, 0, 200 * percentage, 20);
            bar.graphics.endFill();
        }

        private function showGameOver():void {
            trace("GAME OVER!");
        }
    }

    public class ScoreDisplay implements IObserver {
        private var textField:TextField;

        public function ScoreDisplay() {
            textField = new TextField();
        }

        public function update(subject:ISubject, data:*):void {
            if (data.type == "scoreChanged") {
                textField.text = "Score: " + data.score;
            } else if (data.type == "levelUp") {
                showLevelUpMessage(data.level);
            }
        }

        private function showLevelUpMessage(level:int):void {
            trace("LEVEL UP! You are now level " + level);
        }
    }
}

// Usage
var player:Player = new Player();
var healthBar:HealthBar = new HealthBar();
var scoreDisplay:ScoreDisplay = new ScoreDisplay();

// Attach observers
player.attach(healthBar);
player.attach(scoreDisplay);

// Changes automatically notify observers
player.health = 75;  // Health bar updates
player.addScore(500); // Score display updates
player.takeDamage(80); // Both observers notified
```

---

## Pattern: Strategy

Encapsulates algorithms and makes them interchangeable.

### Interface: IStrategy<T, R>

```typescript
interface IStrategy<T, R> {
    execute(context: T): R
}
```

### Class: Context<T, R>

```typescript
class Context<T, R>
```

Context that uses a strategy.

### Example Usage

```actionscript
package game.ai {
    import as4.patterns.IStrategy;
    import as4.patterns.Context;

    // AI strategies for different enemy behaviors
    public class AggressiveStrategy implements IStrategy {
        public function execute(context:*):* {
            var enemy:Enemy = context as Enemy;
            var player:Player = enemy.getTarget();
            
            // Move directly toward player
            enemy.moveToward(player.x, player.y);
            
            // Attack if in range
            if (enemy.distanceTo(player) < 50) {
                enemy.attack(player);
            }
            
            return "aggressive";
        }
    }

    public class DefensiveStrategy implements IStrategy {
        public function execute(context:*):* {
            var enemy:Enemy = context as Enemy;
            var player:Player = enemy.getTarget();
            
            // Keep distance, attack from range
            if (enemy.distanceTo(player) < 100) {
                enemy.moveAway(player.x, player.y);
            }
            
            if (enemy.distanceTo(player) < 150 && enemy.distanceTo(player) > 80) {
                enemy.rangedAttack(player);
            }
            
            return "defensive";
        }
    }

    public class PatrolStrategy implements IStrategy {
        private var waypoints:Array = [[100, 100], [300, 100], [300, 300], [100, 300]];
        private var currentWaypoint:int = 0;

        public function execute(context:*):* {
            var enemy:Enemy = context as Enemy;
            var target:Point = waypoints[currentWaypoint];
            
            enemy.moveToward(target.x, target.y);
            
            if (enemy.distanceTo(target) < 10) {
                currentWaypoint = (currentWaypoint + 1) % waypoints.length;
            }
            
            return "patrolling";
        }
    }

    // Enemy with switchable AI
    public class SmartEnemy extends Enemy {
        private var aiContext:Context;
        private var aggressiveStrategy:AggressiveStrategy;
        private var defensiveStrategy:DefensiveStrategy;
        private var patrolStrategy:PatrolStrategy;

        public function SmartEnemy() {
            super();
            
            aggressiveStrategy = new AggressiveStrategy();
            defensiveStrategy = new DefensiveStrategy();
            patrolStrategy = new PatrolStrategy();
            
            aiContext = new Context(patrolStrategy); // Start with patrol
        }

        public function update():void {
            // Switch strategies based on conditions
            var player:Player = getTarget();
            var distance:Number = distanceTo(player);
            
            if (distance < 100 && health < 30) {
                // Low health, be defensive
                aiContext.setStrategy(defensiveStrategy);
            } else if (distance < 150) {
                // Player nearby, be aggressive
                aiContext.setStrategy(aggressiveStrategy);
            } else {
                // No player nearby, patrol
                aiContext.setStrategy(patrolStrategy);
            }
            
            // Execute current strategy
            var behavior:String = aiContext.executeStrategy(this);
            trace("Enemy behavior: " + behavior);
        }
    }
}
```

### Sorting Strategy Example

```actionscript
public class SortingContext extends Context {
    public function SortingContext() {
        super(new BubbleSortStrategy()); // Default strategy
    }

    public function sortArray(array:Array):Array {
        return executeStrategy(array);
    }
}

public class BubbleSortStrategy implements IStrategy {
    public function execute(context:*):* {
        var array:Array = context as Array;
        var sorted:Array = array.slice(); // Copy array
        
        for (var i:int = 0; i < sorted.length - 1; i++) {
            for (var j:int = 0; j < sorted.length - i - 1; j++) {
                if (sorted[j] > sorted[j + 1]) {
                    var temp:* = sorted[j];
                    sorted[j] = sorted[j + 1];
                    sorted[j + 1] = temp;
                }
            }
        }
        
        return sorted;
    }
}

public class QuickSortStrategy implements IStrategy {
    public function execute(context:*):* {
        var array:Array = context as Array;
        return quickSort(array.slice());
    }

    private function quickSort(array:Array):Array {
        if (array.length <= 1) return array;
        
        var pivot:* = array[Math.floor(array.length / 2)];
        var left:Array = [];
        var right:Array = [];
        
        for (var i:int = 0; i < array.length; i++) {
            if (i == Math.floor(array.length / 2)) continue;
            
            if (array[i] < pivot) {
                left.push(array[i]);
            } else {
                right.push(array[i]);
            }
        }
        
        return quickSort(left).concat([pivot], quickSort(right));
    }
}

// Usage
var sorter:SortingContext = new SortingContext();
var numbers:Array = [64, 34, 25, 12, 22, 11, 90];

// Use bubble sort
var result1:Array = sorter.sortArray(numbers);
trace("Bubble sort: " + result1);

// Switch to quick sort
sorter.setStrategy(new QuickSortStrategy());
var result2:Array = sorter.sortArray(numbers);
trace("Quick sort: " + result2);
```

---

## Pattern: Command

Encapsulates requests as objects, allowing you to parameterize clients with queues, requests, and operations.

### Interface: ICommand

```typescript
interface ICommand {
    execute(): void
    undo?(): void
    canUndo?(): boolean
}
```

### Class: CommandInvoker

```typescript
class CommandInvoker
```

Manages command execution and undo/redo functionality.

#### Methods

```typescript
execute(command: ICommand): void
undo(): boolean
redo(): boolean
canUndo(): boolean
canRedo(): boolean
```

### Example Usage

```actionscript
package editor {
    import as4.patterns.ICommand;
    import as4.patterns.CommandInvoker;

    // Drawing commands
    public class DrawLineCommand implements ICommand {
        private var canvas:Canvas;
        private var startX:Number;
        private var startY:Number;
        private var endX:Number;
        private var endY:Number;
        private var lineId:String;

        public function DrawLineCommand(canvas:Canvas, startX:Number, startY:Number, endX:Number, endY:Number) {
            this.canvas = canvas;
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
        }

        public function execute():void {
            lineId = canvas.drawLine(startX, startY, endX, endY);
            trace("Drew line: " + lineId);
        }

        public function undo():void {
            canvas.removeLine(lineId);
            trace("Undid line: " + lineId);
        }

        public function canUndo():Boolean {
            return lineId != null;
        }
    }

    public class DrawCircleCommand implements ICommand {
        private var canvas:Canvas;
        private var centerX:Number;
        private var centerY:Number;
        private var radius:Number;
        private var circleId:String;

        public function DrawCircleCommand(canvas:Canvas, centerX:Number, centerY:Number, radius:Number) {
            this.canvas = canvas;
            this.centerX = centerX;
            this.centerY = centerY;
            this.radius = radius;
        }

        public function execute():void {
            circleId = canvas.drawCircle(centerX, centerY, radius);
            trace("Drew circle: " + circleId);
        }

        public function undo():void {
            canvas.removeCircle(circleId);
            trace("Undid circle: " + circleId);
        }

        public function canUndo():Boolean {
            return circleId != null;
        }
    }

    // Macro command (composite)
    public class MacroCommand implements ICommand {
        private var commands:Array;

        public function MacroCommand(commands:Array) {
            this.commands = commands;
        }

        public function execute():void {
            for (var i:int = 0; i < commands.length; i++) {
                ICommand(commands[i]).execute();
            }
        }

        public function undo():void {
            // Undo in reverse order
            for (var i:int = commands.length - 1; i >= 0; i--) {
                var command:ICommand = commands[i];
                if (command.undo && command.canUndo()) {
                    command.undo();
                }
            }
        }

        public function canUndo():Boolean {
            return commands.length > 0;
        }
    }

    // Drawing editor
    public class DrawingEditor {
        private var canvas:Canvas;
        private var invoker:CommandInvoker;

        public function DrawingEditor() {
            canvas = new Canvas();
            invoker = new CommandInvoker();
        }

        public function drawLine(startX:Number, startY:Number, endX:Number, endY:Number):void {
            var command:ICommand = new DrawLineCommand(canvas, startX, startY, endX, endY);
            invoker.execute(command);
        }

        public function drawCircle(centerX:Number, centerY:Number, radius:Number):void {
            var command:ICommand = new DrawCircleCommand(canvas, centerX, centerY, radius);
            invoker.execute(command);
        }

        public function drawRectangle(x:Number, y:Number, width:Number, height:Number):void {
            // Composite command: draw rectangle as 4 lines
            var commands:Array = [
                new DrawLineCommand(canvas, x, y, x + width, y),
                new DrawLineCommand(canvas, x + width, y, x + width, y + height),
                new DrawLineCommand(canvas, x + width, y + height, x, y + height),
                new DrawLineCommand(canvas, x, y + height, x, y)
            ];
            
            var macro:ICommand = new MacroCommand(commands);
            invoker.execute(macro);
        }

        public function undo():void {
            if (invoker.canUndo()) {
                invoker.undo();
                trace("Undo successful");
            } else {
                trace("Nothing to undo");
            }
        }

        public function redo():void {
            if (invoker.canRedo()) {
                invoker.redo();
                trace("Redo successful");
            } else {
                trace("Nothing to redo");
            }
        }
    }
}

// Usage
var editor:DrawingEditor = new DrawingEditor();

editor.drawLine(10, 10, 100, 100);
editor.drawCircle(50, 50, 25);
editor.drawRectangle(20, 20, 60, 40);

editor.undo(); // Undo rectangle (4 lines)
editor.undo(); // Undo circle
editor.redo(); // Redo circle
```

---

## Decorator Functions

Add behavior to methods dynamically using AS4 decorators.

### @log Decorator

```typescript
@log
function methodName(): void { }
```

Automatically logs method calls and returns.

### @cache Decorator

```typescript
@cache
function expensiveCalculation(): any { }
```

Caches method results based on parameters.

### @timeout Decorator

```typescript
@timeout(5000)
async function apiCall(): Promise<any> { }
```

Adds timeout to async methods.

### Example Usage

```actionscript
package services {
    import as4.patterns.log;
    import as4.patterns.cache;
    import as4.patterns.timeout;

    public class ApiService {
        
        @log
        @cache
        @timeout(10000)
        public function fetchUserData(userId:String):Promise {
            return fetch("/api/users/" + userId).then(function(response:*):* {
                return response.json();
            });
        }

        @log
        public function processData(data:Array):Array {
            // Expensive processing
            var result:Array = [];
            for (var i:int = 0; i < data.length; i++) {
                result.push(expensiveTransform(data[i]));
            }
            return result;
        }

        @cache
        private function expensiveTransform(item:*):* {
            // Simulate expensive operation
            var result:* = item;
            for (var i:int = 0; i < 1000; i++) {
                result = Math.sin(result);
            }
            return result;
        }
    }
}
```

---

## Pattern: Facade

Provides a simplified interface to a complex subsystem.

### Class: Facade

```typescript
abstract class Facade
```

Base class for facade implementations.

### Example Usage

```actionscript
package multimedia {
    import as4.patterns.Facade;

    // Complex subsystem classes
    public class AudioEngine {
        public function loadSound(file:String):void { trace("Loading sound: " + file); }
        public function playSound(id:String):void { trace("Playing sound: " + id); }
        public function setVolume(volume:Number):void { trace("Setting volume: " + volume); }
    }

    public class VideoEngine {
        public function loadVideo(file:String):void { trace("Loading video: " + file); }
        public function playVideo(id:String):void { trace("Playing video: " + id); }
        public function setQuality(quality:String):void { trace("Setting quality: " + quality); }
    }

    public class EffectsEngine {
        public function loadEffect(file:String):void { trace("Loading effect: " + file); }
        public function playEffect(id:String, x:Number, y:Number):void { 
            trace("Playing effect: " + id + " at " + x + "," + y); 
        }
    }

    // Simplified facade
    public class MultimediaFacade extends Facade {
        private var audio:AudioEngine;
        private var video:VideoEngine;
        private var effects:EffectsEngine;

        public function MultimediaFacade() {
            super();
            audio = new AudioEngine();
            video = new VideoEngine();
            effects = new EffectsEngine();
            
            addService("audio", audio);
            addService("video", video);
            addService("effects", effects);
        }

        public function playBackgroundMusic(musicFile:String):void {
            audio.loadSound(musicFile);
            audio.setVolume(0.7);
            audio.playSound(musicFile);
        }

        public function playCutscene(videoFile:String):void {
            video.loadVideo(videoFile);
            video.setQuality("high");
            video.playVideo(videoFile);
        }

        public function playExplosion(x:Number, y:Number):void {
            effects.loadEffect("explosion.fx");
            audio.loadSound("explosion.wav");
            
            effects.playEffect("explosion.fx", x, y);
            audio.playSound("explosion.wav");
        }

        public function stopAll():void {
            // Simplified way to stop everything
            var audioService:AudioEngine = getService("audio");
            var videoService:VideoEngine = getService("video");
            // ... stop all media
        }
    }
}

// Usage - complex operations made simple
var multimedia:MultimediaFacade = new MultimediaFacade();

multimedia.playBackgroundMusic("theme.mp3");
multimedia.playCutscene("intro.mp4");
multimedia.playExplosion(100, 200);
```

---

## See Also

- [events.EventDispatcher](events.md) - Observer pattern implementation
- [ai.AIModel](ai.md) - Strategy pattern for AI providers
- [utils.Timer](utils.md) - Command pattern for scheduled operations
- [storage.SharedObject](storage.md) - Singleton pattern for data access
