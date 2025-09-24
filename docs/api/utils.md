# as4.utils - Utilities API Reference

The `as4.utils` package provides essential utility classes and functions for AS4 development.

## Package Overview

| Class/Function | Description |
|----------------|-------------|
| [Timer](#timer) | AS3-style timer for recurring operations |
| [trace()](#trace) | Enhanced logging function with metadata |
| [MathUtils](#mathutils) | Mathematical utility functions |
| [ByteArray](#bytearray) | Binary data manipulation |

---

## Class: Timer

AS3-style timer class for handling timed operations and animations.

### Constructor

```typescript
new Timer(delay: number, repeatCount?: number)
```

**Parameters:**
- `delay` - Time between timer events in milliseconds
- `repeatCount` - Number of times to repeat (0 = infinite, default: 0)

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `delay` | number | Time between events (ms) |
| `repeatCount` | number | Total repeat count |
| `currentCount` | number | Current iteration count |
| `running` | boolean | Whether timer is active |

### Methods

#### start()
```typescript
start(): void
```
Start the timer. Dispatches `timer` events at specified intervals.

#### stop()
```typescript
stop(): void
```
Stop the timer and pause execution.

#### reset()
```typescript
reset(): void
```
Stop the timer and reset currentCount to 0.

#### getCurrentCount()
```typescript
getCurrentCount(): number
```
Get the current iteration count.

#### isRunning()
```typescript
isRunning(): boolean
```
Check if the timer is currently running.

### Events

| Event | When Dispatched |
|-------|----------------|
| `timer` | Each timer interval |
| `timerComplete` | When repeatCount is reached |

### Example Usage

```actionscript
import as4.utils.Timer;
import as4.events.Event;
import as4.events.EventType;

// Create a timer that fires every second, 10 times
var timer:Timer = new Timer(1000, 10);

// Add event listeners
timer.addEventListener(EventType.TIMER, onTimerTick);
timer.addEventListener(EventType.TIMER_COMPLETE, onTimerComplete);

function onTimerTick(event:Event):void {
    trace("Timer tick: " + timer.getCurrentCount());
}

function onTimerComplete(event:Event):void {
    trace("Timer completed!");
}

// Start the timer
timer.start();

// Stop after 5 seconds
setTimeout(function():void {
    timer.stop();
    trace("Timer stopped manually");
}, 5000);
```

### Animation Example

```actionscript
public class AnimatedSprite extends Sprite {
    private var animationTimer:Timer;
    private var rotation:Number = 0;

    public function AnimatedSprite() {
        super();
        
        // 60 FPS animation timer
        animationTimer = new Timer(16.67, 0); // ~60 FPS
        animationTimer.addEventListener(EventType.TIMER, onAnimationFrame);
        animationTimer.start();
    }

    private function onAnimationFrame(event:Event):void {
        rotation += 2; // Rotate 2 degrees per frame
        this.rotation = rotation;
        
        // Update position
        x = Math.sin(rotation * Math.PI / 180) * 100;
        y = Math.cos(rotation * Math.PI / 180) * 100;
    }

    public function destroy():void {
        animationTimer.stop();
        animationTimer.removeEventListener(EventType.TIMER, onAnimationFrame);
    }
}
```

---

## Function: trace()

Enhanced logging function with file location and timestamp metadata.

### Syntax

```typescript
trace(...args: any[]): void
```

**Parameters:**
- `...args` - Any number of values to log

### Features

- **Timestamp** - Automatic ISO timestamp
- **Caller location** - File and line information
- **Multiple arguments** - Support for multiple values
- **Object serialization** - Automatic JSON serialization for objects

### Example Usage

```actionscript
import as4.utils.trace;

// Basic logging
trace("Hello, AS4!");

// Multiple arguments
trace("User ID:", 123, "Name:", "John Doe");

// Object logging
var user:Object = { id: 123, name: "John", active: true };
trace("User object:", user);

// Conditional tracing
if (DEBUG_MODE) {
    trace("Debug info:", debugData);
}
```

### Output Format

```
[2025-09-24T10:30:45.123Z] [at MyClass.doSomething (MyClass.as:42)] Hello, AS4!
[2025-09-24T10:30:45.124Z] [at MyClass.doSomething (MyClass.as:43)] User ID: 123 Name: John Doe
```

---

## Class: MathUtils

Utility class providing AS3-compatible mathematical functions and constants.

### Static Properties

| Property | Type | Value | Description |
|----------|------|-------|-------------|
| `PI` | number | Math.PI | Pi constant |
| `E` | number | Math.E | Euler's number |

### Static Methods

#### Basic Operations

```typescript
static abs(value: number): number          // Absolute value
static max(value1: number, value2: number): number  // Maximum
static min(value1: number, value2: number): number  // Minimum
static round(value: number): number        // Round to nearest integer
static floor(value: number): number        // Round down
static ceil(value: number): number         // Round up
static random(): number                    // Random 0-1
```

#### Trigonometric Functions

```typescript
static sin(value: number): number          // Sine
static cos(value: number): number          // Cosine  
static tan(value: number): number          // Tangent
static atan2(y: number, x: number): number // Arc tangent
```

#### Advanced Functions

```typescript
static sqrt(value: number): number         // Square root
static pow(base: number, exponent: number): number  // Power
```

### Example Usage

```actionscript
import as4.utils.MathUtils;

// Basic math operations
var angle:Number = MathUtils.PI / 4; // 45 degrees in radians
var distance:Number = MathUtils.sqrt(x*x + y*y);
var rounded:Number = MathUtils.round(3.14159);

// Trigonometry for rotation
var radians:Number = degrees * MathUtils.PI / 180;
var newX:Number = x + MathUtils.cos(radians) * speed;
var newY:Number = y + MathUtils.sin(radians) * speed;

// Random number generation
var randomInt:int = MathUtils.floor(MathUtils.random() * 100); // 0-99
var randomFloat:Number = MathUtils.random() * 2 - 1; // -1 to 1
```

### Game Development Example

```actionscript
public class Projectile extends Sprite {
    private var velocity:Point;
    private var gravity:Number = 0.5;

    public function Projectile(startX:Number, startY:Number, angle:Number, speed:Number) {
        super();
        
        x = startX;
        y = startY;
        
        // Calculate velocity components
        var radians:Number = angle * MathUtils.PI / 180;
        velocity = new Point(
            MathUtils.cos(radians) * speed,
            MathUtils.sin(radians) * speed
        );
    }

    public function update():void {
        // Apply velocity
        x += velocity.x;
        y += velocity.y;
        
        // Apply gravity
        velocity.y += gravity;
        
        // Rotation based on velocity direction
        rotation = MathUtils.atan2(velocity.y, velocity.x) * 180 / MathUtils.PI;
    }
}
```

---

## Class: ByteArray

Binary data manipulation class mapped to Node.js Buffer with AS3-compatible API.

### Constructor

```typescript
new ByteArray(data?: Buffer | Uint8Array | string)
```

**Parameters:**
- `data` - Initial data (Buffer, Uint8Array, or UTF-8 string)

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `length` | number | Total byte length |
| `bytesAvailable` | number | Bytes remaining from current position |
| `position` | number | Current read/write position |

### Reading Methods

```typescript
readByte(): number                    // Read signed byte (-128 to 127)
readUnsignedByte(): number           // Read unsigned byte (0 to 255)
readInt(): number                    // Read 32-bit signed integer
readUTF(): string                    // Read UTF-8 string with length prefix
```

### Writing Methods

```typescript
writeByte(value: number): void       // Write signed byte
writeInt(value: number): void        // Write 32-bit signed integer  
writeUTF(value: string): void        // Write UTF-8 string with length prefix
```

### Utility Methods

```typescript
toString(): string                   // Convert to UTF-8 string
toBuffer(): Buffer                   // Get underlying Buffer
clear(): void                        // Clear all data
```

### Example Usage

```actionscript
import as4.utils.ByteArray;

// Create and write data
var bytes:ByteArray = new ByteArray();
bytes.writeUTF("Hello, World!");
bytes.writeInt(42);
bytes.writeByte(255);

// Reset position to read
bytes.position = 0;

// Read data back
var message:String = bytes.readUTF();
var number:int = bytes.readInt();
var byteValue:int = bytes.readUnsignedByte();

trace("Message:", message);  // "Hello, World!"
trace("Number:", number);    // 42
trace("Byte:", byteValue);   // 255
```

### Network Protocol Example

```actionscript
public class NetworkPacket {
    private var data:ByteArray;

    public function NetworkPacket() {
        data = new ByteArray();
    }

    public function writeHeader(packetType:int, packetId:int):void {
        data.writeInt(packetType);
        data.writeInt(packetId);
        data.writeInt(Date.now()); // Timestamp
    }

    public function writePlayerData(playerId:String, x:Number, y:Number):void {
        data.writeUTF(playerId);
        data.writeInt(x * 100); // Fixed-point for precision
        data.writeInt(y * 100);
    }

    public function serialize():Buffer {
        return data.toBuffer();
    }

    public function deserialize(buffer:Buffer):void {
        data = new ByteArray(buffer);
        
        var packetType:int = data.readInt();
        var packetId:int = data.readInt();
        var timestamp:int = data.readInt();
        
        trace("Packet type:", packetType, "ID:", packetId, "Time:", timestamp);
    }
}
```

### File I/O Example

```actionscript
import as4.utils.ByteArray;
import as4.storage.SharedObject;

public class GameSave {
    public function saveGame(playerData:Object):void {
        var saveData:ByteArray = new ByteArray();
        
        // Write save file header
        saveData.writeUTF("GAME_SAVE_V1");
        saveData.writeInt(playerData.level);
        saveData.writeInt(playerData.score);
        saveData.writeInt(playerData.lives);
        
        // Write inventory
        saveData.writeInt(playerData.inventory.length);
        for (var i:int = 0; i < playerData.inventory.length; i++) {
            saveData.writeUTF(playerData.inventory[i].name);
            saveData.writeInt(playerData.inventory[i].quantity);
        }
        
        // Save to SharedObject
        var so:SharedObject = SharedObject.getLocal("gamedata");
        so.data.saveFile = saveData.toBuffer();
        so.flush();
    }

    public function loadGame():Object {
        var so:SharedObject = SharedObject.getLocal("gamedata");
        if (!so.data.saveFile) return null;
        
        var saveData:ByteArray = new ByteArray(so.data.saveFile);
        saveData.position = 0;
        
        // Read header
        var version:String = saveData.readUTF();
        if (version !== "GAME_SAVE_V1") return null;
        
        var playerData:Object = {
            level: saveData.readInt(),
            score: saveData.readInt(),
            lives: saveData.readInt(),
            inventory: []
        };
        
        // Read inventory
        var inventoryCount:int = saveData.readInt();
        for (var i:int = 0; i < inventoryCount; i++) {
            playerData.inventory.push({
                name: saveData.readUTF(),
                quantity: saveData.readInt()
            });
        }
        
        return playerData;
    }
}
```

---

## Performance Tips

1. **Timer Management**
   ```actionscript
   // Always clean up timers
   timer.stop();
   timer.removeEventListener(EventType.TIMER, handler);
   ```

2. **Efficient Tracing**
   ```actionscript
   // Use conditional tracing for production
   if (CONFIG::debug) {
       trace("Debug information");
   }
   ```

3. **ByteArray Optimization**
   ```actionscript
   // Pre-allocate for known data sizes
   var bytes:ByteArray = new ByteArray(Buffer.alloc(expectedSize));
   ```

---

## See Also

- [events.EventDispatcher](events.md#eventdispatcher) - Timer events
- [graphics.DisplayObject](graphics.md#displayobject) - Animation utilities
- [storage.SharedObject](storage.md#sharedobject) - Data persistence
- [patterns.Observer](patterns.md#observer) - Event-driven patterns
