# AS4 Framework - Complete API Reference

This is the comprehensive API documentation for the AS4 framework, providing ActionScript 3 compatibility with modern Node.js capabilities.

## Table of Contents

1. [Graphics API](#graphics-api)
2. [Networking API](#networking-api)
3. [Storage API](#storage-api)
4. [Compiler API](#compiler-api)

---

## Graphics API

The AS4 graphics system provides a familiar ActionScript-style API for 2D graphics rendering, compatible with both Node.js (using node-canvas) and browser environments.

### DisplayObject

Base class for all display objects in the AS4 display hierarchy.

```actionscript
public class DisplayObject extends EventDispatcher
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `x` | Number | The x coordinate of the object |
| `y` | Number | The y coordinate of the object |
| `width` | Number | The width of the object |
| `height` | Number | The height of the object |
| `scaleX` | Number | Horizontal scale factor (1.0 = normal) |
| `scaleY` | Number | Vertical scale factor (1.0 = normal) |
| `rotation` | Number | Rotation in degrees |
| `alpha` | Number | Transparency (0.0 to 1.0) |
| `visible` | Boolean | Whether the object is visible |
| `parent` | DisplayObjectContainer | Parent container |

#### Methods

```actionscript
// Transform methods
public function getBounds(targetCoordinateSpace:DisplayObject = null):Rectangle
public function getRect(targetCoordinateSpace:DisplayObject = null):Rectangle
public function globalToLocal(point:Point):Point
public function localToGlobal(point:Point):Point

// Hit testing
public function hitTestPoint(x:Number, y:Number, shapeFlag:Boolean = false):Boolean
public function hitTestObject(obj:DisplayObject):Boolean
```

#### Example Usage

```actionscript
var sprite:Sprite = new Sprite();
sprite.x = 100;
sprite.y = 200;
sprite.scaleX = 1.5;
sprite.rotation = 45;
sprite.alpha = 0.8;

// Transform a point from local to global coordinates
var localPoint:Point = new Point(10, 10);
var globalPoint:Point = sprite.localToGlobal(localPoint);

// Check if a point hits the sprite
if (sprite.hitTestPoint(mouseX, mouseY)) {
    trace("Sprite clicked!");
}
```

### Sprite

Interactive display object that can contain graphics and other display objects.

```actionscript
public class Sprite extends DisplayObjectContainer
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `graphics` | Graphics | Graphics drawing surface |
| `buttonMode` | Boolean | Whether to show hand cursor on hover |
| `useHandCursor` | Boolean | Enable/disable hand cursor |

#### Methods

```actionscript
// Drawing shortcut methods
public function drawRect(x:Number, y:Number, width:Number, height:Number):void
public function drawCircle(x:Number, y:Number, radius:Number):void
public function clear():void

// Event handling
public function startDrag(lockCenter:Boolean = false, bounds:Rectangle = null):void
public function stopDrag():void
```

#### Example Usage

```actionscript
var sprite:Sprite = new Sprite();

// Draw a red rectangle
sprite.graphics.beginFill(0xFF0000);
sprite.graphics.drawRect(0, 0, 100, 50);
sprite.graphics.endFill();

// Make it interactive
sprite.buttonMode = true;
sprite.addEventListener(MouseEvent.CLICK, onClick);

function onClick(event:MouseEvent):void {
    sprite.startDrag();
}

// Add to stage
stage.addChild(sprite);
```

### Graphics

Provides drawing API for vector graphics rendering.

```actionscript
public class Graphics
```

#### Drawing Methods

```actionscript
// Fill methods
public function beginFill(color:uint, alpha:Number = 1.0):void
public function endFill():void
public function beginGradientFill(type:String, colors:Array, alphas:Array, ratios:Array):void

// Line methods
public function lineStyle(thickness:Number = NaN, color:uint = 0, alpha:Number = 1.0):void
public function moveTo(x:Number, y:Number):void
public function lineTo(x:Number, y:Number):void
public function curveTo(controlX:Number, controlY:Number, anchorX:Number, anchorY:Number):void

// Shape methods
public function drawRect(x:Number, y:Number, width:Number, height:Number):void
public function drawRoundRect(x:Number, y:Number, width:Number, height:Number, ellipseWidth:Number, ellipseHeight:Number = NaN):void
public function drawCircle(x:Number, y:Number, radius:Number):void
public function drawEllipse(x:Number, y:Number, width:Number, height:Number):void

// Utility methods
public function clear():void
public function copyFrom(sourceGraphics:Graphics):void
```

#### Example Usage

```actionscript
var graphics:Graphics = sprite.graphics;

// Draw a gradient rectangle
graphics.beginGradientFill(
    GradientType.LINEAR,
    [0xFF0000, 0x0000FF],
    [1, 1],
    [0, 255]
);
graphics.drawRect(0, 0, 200, 100);
graphics.endFill();

// Draw a curved line
graphics.lineStyle(3, 0x000000);
graphics.moveTo(50, 50);
graphics.curveTo(100, 25, 150, 50);

// Draw a complex shape
graphics.beginFill(0x00FF00);
graphics.moveTo(200, 50);
graphics.lineTo(250, 100);
graphics.lineTo(200, 150);
graphics.lineTo(150, 100);
graphics.lineTo(200, 50);
graphics.endFill();
```

### Stage

The root display container representing the main display area.

```actionscript
public class Stage extends DisplayObjectContainer
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `stageWidth` | Number | Width of the stage |
| `stageHeight` | Number | Height of the stage |
| `focus` | InteractiveObject | Object with keyboard focus |
| `frameRate` | Number | Target frame rate |
| `quality` | String | Rendering quality setting |

#### Methods

```actionscript
public function invalidate():void
public function isFocusInaccessible():Boolean
```

#### Example Usage

```actionscript
// Set up stage properties
stage.frameRate = 60;
stage.quality = StageQuality.HIGH;

// Handle stage resize
stage.addEventListener(Event.RESIZE, onStageResize);

function onStageResize(event:Event):void {
    trace("Stage size: " + stage.stageWidth + "x" + stage.stageHeight);
}

// Add objects to stage
var background:Sprite = new Sprite();
background.graphics.beginFill(0x336699);
background.graphics.drawRect(0, 0, stage.stageWidth, stage.stageHeight);
background.graphics.endFill();
stage.addChild(background);
```

### TextField

Display object for rendering and editing text.

```actionscript
public class TextField extends InteractiveObject
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `text` | String | The text content |
| `htmlText` | String | HTML formatted text |
| `textColor` | uint | Text color |
| `textWidth` | Number | Width of text content |
| `textHeight` | Number | Height of text content |
| `wordWrap` | Boolean | Enable word wrapping |
| `multiline` | Boolean | Allow multiple lines |
| `selectable` | Boolean | Allow text selection |
| `type` | String | TextField type (input/dynamic) |
| `maxChars` | int | Maximum character limit |

#### Methods

```actionscript
public function appendText(newText:String):void
public function getTextFormat(beginIndex:int = -1, endIndex:int = -1):TextFormat
public function setTextFormat(format:TextFormat, beginIndex:int = -1, endIndex:int = -1):void
```

#### Example Usage

```actionscript
var textField:TextField = new TextField();
textField.text = "Hello, AS4!";
textField.x = 50;
textField.y = 50;
textField.width = 200;
textField.height = 30;
textField.textColor = 0x000000;
textField.selectable = true;

// Style the text
var format:TextFormat = new TextFormat();
format.font = "Arial";
format.size = 16;
format.bold = true;
textField.setTextFormat(format);

stage.addChild(textField);

// Create an input field
var inputField:TextField = new TextField();
inputField.type = TextFieldType.INPUT;
inputField.border = true;
inputField.width = 200;
inputField.height = 25;
inputField.maxChars = 50;
stage.addChild(inputField);
```

---

## Networking API

AS4 provides modern networking capabilities while maintaining ActionScript-style APIs.

### URLRequest

Represents a request to load data from a URL.

```actionscript
public class URLRequest
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `url` | String | The URL to request |
| `method` | String | HTTP method (GET, POST, etc.) |
| `data` | Object | Data to send with request |
| `requestHeaders` | Array | HTTP headers |
| `contentType` | String | Content type of request data |

#### Methods

```actionscript
// Constructor
public function URLRequest(url:String = null)

// Header management
public function addRequestHeader(name:String, value:String):void
```

#### Example Usage

```actionscript
var request:URLRequest = new URLRequest("https://api.example.com/data");
request.method = URLRequestMethod.POST;
request.contentType = "application/json";
request.data = JSON.stringify({
    name: "John",
    email: "john@example.com"
});

// Add custom headers
request.addRequestHeader("Authorization", "Bearer " + token);
request.addRequestHeader("User-Agent", "AS4-App/1.0");
```

### URLLoader

Loads data from URLs with support for different data formats.

```actionscript
public class URLLoader extends EventDispatcher
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `data` | * | Loaded data |
| `dataFormat` | String | Format of loaded data |
| `bytesLoaded` | uint | Bytes loaded so far |
| `bytesTotal` | uint | Total bytes to load |

#### Events

| Event | Description |
|-------|-------------|
| `Event.COMPLETE` | Loading completed successfully |
| `IOErrorEvent.IO_ERROR` | Loading failed |
| `ProgressEvent.PROGRESS` | Loading progress update |

#### Methods

```actionscript
public function load(request:URLRequest):void
public function close():void
```

#### Example Usage

```actionscript
var loader:URLLoader = new URLLoader();
loader.dataFormat = URLLoaderDataFormat.JSON;

// Add event listeners
loader.addEventListener(Event.COMPLETE, onDataLoaded);
loader.addEventListener(IOErrorEvent.IO_ERROR, onLoadError);
loader.addEventListener(ProgressEvent.PROGRESS, onLoadProgress);

function onDataLoaded(event:Event):void {
    var data:Object = loader.data;
    trace("Loaded data:", data);
}

function onLoadError(event:IOErrorEvent):void {
    trace("Load error:", event.text);
}

function onLoadProgress(event:ProgressEvent):void {
    var percent:Number = (event.bytesLoaded / event.bytesTotal) * 100;
    trace("Loading: " + Math.round(percent) + "%");
}

// Start loading
var request:URLRequest = new URLRequest("https://api.example.com/users");
loader.load(request);
```

### Socket

TCP socket connection for real-time communication.

```actionscript
public class Socket extends EventDispatcher
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `connected` | Boolean | Whether socket is connected |
| `bytesAvailable` | uint | Bytes available to read |
| `endian` | String | Byte order for multi-byte data |

#### Events

| Event | Description |
|-------|-------------|
| `Event.CONNECT` | Connection established |
| `Event.CLOSE` | Connection closed |
| `IOErrorEvent.IO_ERROR` | Connection error |
| `ProgressEvent.SOCKET_DATA` | Data received |

#### Methods

```actionscript
public function connect(host:String, port:int):void
public function close():void
public function flush():void

// Data reading
public function readBytes(bytes:ByteArray, offset:uint = 0, length:uint = 0):void
public function readUTFBytes(length:uint):String
public function readUTF():String

// Data writing
public function writeBytes(bytes:ByteArray, offset:uint = 0, length:uint = 0):void
public function writeUTFBytes(value:String):void
public function writeUTF(value:String):void
```

#### Example Usage

```actionscript
var socket:Socket = new Socket();

// Add event listeners
socket.addEventListener(Event.CONNECT, onSocketConnect);
socket.addEventListener(Event.CLOSE, onSocketClose);
socket.addEventListener(ProgressEvent.SOCKET_DATA, onSocketData);
socket.addEventListener(IOErrorEvent.IO_ERROR, onSocketError);

function onSocketConnect(event:Event):void {
    trace("Connected to server");
    
    // Send a message
    socket.writeUTF("Hello Server!");
    socket.flush();
}

function onSocketData(event:ProgressEvent):void {
    while (socket.bytesAvailable > 0) {
        var message:String = socket.readUTF();
        trace("Received:", message);
    }
}

function onSocketClose(event:Event):void {
    trace("Connection closed");
}

function onSocketError(event:IOErrorEvent):void {
    trace("Socket error:", event.text);
}

// Connect to server
socket.connect("localhost", 8080);
```

---

## Storage API

AS4 provides both local storage (SharedObject) and database capabilities for data persistence.

### SharedObject

Local data storage similar to browser localStorage or Flash SharedObjects.

```actionscript
public class SharedObject extends EventDispatcher
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `data` | Object | Stored data object |
| `size` | uint | Size of stored data in bytes |

#### Static Methods

```actionscript
public static function getLocal(name:String, localPath:String = null, secure:Boolean = false):SharedObject
public static function getRemote(name:String, remotePath:String = null, persistence:Object = null, secure:Boolean = false):SharedObject
```

#### Instance Methods

```actionscript
public function flush(minDiskSpace:int = 0):String
public function clear():void
public function close():void
public function setProperty(propertyName:String, value:*):void
public function getProperty(propertyName:String):*
```

#### Example Usage

```actionscript
// Get a local shared object
var gameData:SharedObject = SharedObject.getLocal("gameProgress");

// Check if data exists
if (gameData.data.level == null) {
    // Initialize default data
    gameData.data.level = 1;
    gameData.data.score = 0;
    gameData.data.playerName = "Player";
    gameData.data.settings = {
        soundVolume: 0.8,
        musicVolume: 0.6,
        difficulty: "normal"
    };
}

// Read data
var currentLevel:int = gameData.data.level;
var playerScore:int = gameData.data.score;
trace("Player is on level " + currentLevel + " with score " + playerScore);

// Update data
gameData.data.level++;
gameData.data.score += 1000;

// Save to disk
var flushStatus:String = gameData.flush();
if (flushStatus == SharedObjectFlushStatus.FLUSHED) {
    trace("Game progress saved successfully");
} else {
    trace("Failed to save game progress");
}

// Using setProperty/getProperty methods
gameData.setProperty("lastPlayed", new Date());
var lastPlayed:Date = gameData.getProperty("lastPlayed");

// Store complex objects
var inventory:Array = [
    { id: 1, name: "Sword", quantity: 1 },
    { id: 2, name: "Potion", quantity: 5 },
    { id: 3, name: "Shield", quantity: 1 }
];
gameData.data.inventory = inventory;
gameData.flush();
```

### Database

SQL database interface for more complex data storage needs.

```actionscript
public class Database extends EventDispatcher
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `connected` | Boolean | Whether database is connected |
| `inTransaction` | Boolean | Whether in a transaction |

#### Methods

```actionscript
// Connection
public function open(reference:File, openMode:String = null):void
public function close():void

// Transactions
public function begin(option:String = null, responder:Responder = null):void
public function commit(responder:Responder = null):void
public function rollback(responder:Responder = null):void

// Queries
public function execute(statement:SQLStatement, responder:Responder = null):void
public function loadSchema(type:Class = null, name:String = null, database:String = "main", responder:Responder = null):void
```

#### Example Usage

```actionscript
var database:Database = new Database();

// Open database
var dbFile:File = File.documentsDirectory.resolvePath("gamedata.db");
database.open(dbFile);

// Create table
var createTable:SQLStatement = new SQLStatement();
createTable.sqlConnection = database;
createTable.text = `
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        level INTEGER DEFAULT 1,
        experience INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`;

createTable.addEventListener(SQLEvent.RESULT, onTableCreated);
createTable.execute();

function onTableCreated(event:SQLEvent):void {
    trace("Players table created successfully");
    insertPlayer("Alice", 5, 1250);
}

function insertPlayer(name:String, level:int, experience:int):void {
    var insertStmt:SQLStatement = new SQLStatement();
    insertStmt.sqlConnection = database;
    insertStmt.text = `
        INSERT INTO players (name, level, experience) 
        VALUES (?, ?, ?)
    `;
    insertStmt.parameters[0] = name;
    insertStmt.parameters[1] = level;
    insertStmt.parameters[2] = experience;
    
    insertStmt.addEventListener(SQLEvent.RESULT, onPlayerInserted);
    insertStmt.execute();
}

function onPlayerInserted(event:SQLEvent):void {
    trace("Player inserted with ID:", event.target.getResult().lastInsertRowID);
    queryPlayers();
}

function queryPlayers():void {
    var selectStmt:SQLStatement = new SQLStatement();
    selectStmt.sqlConnection = database;
    selectStmt.text = "SELECT * FROM players ORDER BY level DESC";
    
    selectStmt.addEventListener(SQLEvent.RESULT, onPlayersLoaded);
    selectStmt.execute();
}

function onPlayersLoaded(event:SQLEvent):void {
    var result:SQLResult = selectStmt.getResult();
    trace("Found " + result.data.length + " players:");
    
    for (var i:int = 0; i < result.data.length; i++) {
        var player:Object = result.data[i];
        trace(player.name + " - Level " + player.level + " (" + player.experience + " XP)");
    }
}
```

---

## Compiler API

The AS4 compiler transforms ActionScript files into JavaScript while maintaining compatibility.

### AS4Compiler

Main compiler class that handles the transformation process.

```actionscript
public class AS4Compiler
```

#### Methods

```actionscript
// File compilation
public function compileFile(inputPath:String, outputPath:String = null):CompilationResult
public function compileDirectory(inputDir:String, outputDir:String, options:CompilerOptions = null):Array

// String compilation
public function compileString(asCode:String, fileName:String = "inline.as"):CompilationResult

// Project compilation
public function compileProject(configPath:String):ProjectCompilationResult
```

#### Example Usage

```actionscript
var compiler:AS4Compiler = new AS4Compiler();

// Compile a single file
var result:CompilationResult = compiler.compileFile("src/Player.as", "dist/Player.js");

if (result.success) {
    trace("Compilation successful!");
    trace("Generated code:", result.outputCode);
} else {
    trace("Compilation failed:");
    for (var i:int = 0; i < result.errors.length; i++) {
        trace("Error:", result.errors[i].message);
    }
}

// Compile entire directory
var options:CompilerOptions = new CompilerOptions();
options.target = "es2020";
options.preserveComments = true;
options.sourceMap = true;

var results:Array = compiler.compileDirectory("src", "dist", options);
trace("Compiled " + results.length + " files");

// Compile from string
var asCode:String = `
package {
    public class Example {
        public function sayHello():String {
            return "Hello from AS4!";
        }
    }
}
`;

var stringResult:CompilationResult = compiler.compileString(asCode);
trace("Generated JavaScript:", stringResult.outputCode);
```

### CompilerOptions

Configuration options for the compilation process.

```actionscript
public class CompilerOptions
```

#### Properties

| Property | Type | Description |
|----------|------|-------------|
| `target` | String | Target ECMAScript version |
| `module` | String | Module system to use |
| `sourceMap` | Boolean | Generate source maps |
| `preserveComments` | Boolean | Keep comments in output |
| `minify` | Boolean | Minify the output |
| `strict` | Boolean | Enable strict mode |

#### Example Usage

```actionscript
var options:CompilerOptions = new CompilerOptions();
options.target = "es2020";
options.module = "commonjs";
options.sourceMap = true;
options.preserveComments = false;
options.minify = true;
options.strict = true;

var compiler:AS4Compiler = new AS4Compiler();
var result:CompilationResult = compiler.compileFile("src/App.as", "dist/app.js", options);
```

This comprehensive API reference provides detailed documentation for all major AS4 framework components, enabling developers to effectively use ActionScript-style programming in modern Node.js and browser environments.
