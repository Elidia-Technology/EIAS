# AS4 Framework

ActionScript 4 framework for Node.js and browser with AI/ML integration.

## 🚀 Features

### Core Language Support
- **AS3-like syntax**: Variables, functions, classes, interfaces, inheritance
- **Type system**: String, int, Number, Boolean mapping to TypeScript types
- **OOP features**: public/private/protected modifiers, getters/setters
- **Dynamic classes** and package/namespace support
- **Vector.<Type>** → Array<Type> transformation

### Event System
- **EventDispatcher** wrapping Node.js EventEmitter
- **AS3-style methods**: addEventListener, removeEventListener, dispatchEvent
- **Custom events** with bubbling and cancellation support

### Utilities
- **Timer class** for setInterval/setTimeout operations
- **Enhanced trace()** with file/line metadata logging
- **MathUtils** with AS3-style static methods
- **ByteArray** mapped to Node.js Buffer for binary data

### AI/ML Integration
- **Unified AIModel interface** supporting multiple providers:
  - OpenAI GPT models
  - HuggingFace transformers
  - Replicate API
  - Local inference (llama.cpp, transformers.js)
- **Text generation**: generateText(), summarize(), generateCode()
- **Graphics**: generateImage() with Stable Diffusion/DALL·E
- **Audio**: speak() (TTS) and transcribe() (STT)
- **Video**: generateVideo() for AI video creation

### Graphics & Display
- **Display list hierarchy**: DisplayObject, DisplayObjectContainer, Sprite
- **Graphics class** for vector drawing (beginFill, drawRect, drawCircle)
- **Stage class** for rendering pipeline
- **Cross-platform**: node-canvas for Node.js, HTML5 Canvas for browser

### Networking
- **URLRequest/URLLoader** wrapping modern fetch API
- **Socket classes**: Socket, XMLSocket with WebSocket backend
- **HTTP utilities**: GET, POST, PUT, DELETE helpers
- **JSON/XML** request/response parsing

### Storage & Persistence
- **SharedObject** equivalent:
  - Node.js: File system storage
  - Browser: localStorage/IndexedDB
- **Database wrappers**: SQLite, Redis, PostgreSQL, MongoDB
- **Cross-platform** data persistence

### Design Patterns
- **Singleton**: Global service management
- **Factory**: Object creation patterns
- **Observer**: Event-driven architecture
- **Strategy**: Swappable algorithms (AI backends)
- **Command**: Queued operations with undo/redo
- **Decorator**: Method logging, caching, timeout
- **Facade/Adapter**: Unified APIs for external services

## 🛠️ CLI Tools

```bash
# Install AS4
npm install -g as4

# Compile ActionScript to JavaScript
as4 compile MyApp.as
as4 compile MyApp.as --outDir ./build --watch

# Compile and run
as4 run MyApp.as

# Generate scaffolding
as4 generate class      # Basic class template
as4 generate singleton  # Singleton pattern
as4 generate ai         # AI-powered app
as4 generate sprite     # Graphics sprite

# Testing
as4 test

# Package management
as4 install <package>
as4 publish
```

## 📝 Example Usage

### Basic Class
```actionscript
package app {
    public class MyClass {
        private var _value:String;

        public function MyClass(value:String = "") {
            _value = value;
        }

        public function getValue():String {
            return _value;
        }
    }
}
```

### AI Integration
```actionscript
package app {
    import ai.AIModel;
    import utils.Timer;

    public class MyAIApp {
        private var ai:AIModel;

        public function MyAIApp() {
            ai = new AIModel("gpt", { 
                apiKey: process.env.OPENAI_KEY 
            });
        }

        public function run():void {
            ai.generateText("Tell me a story").then(function(story:String):void {
                trace("AI Story: " + story);
            });

            ai.generateImage("A dragon in space").then(function(imageBuffer:Buffer):void {
                trace("Generated image with size: " + imageBuffer.length);
            });
        }
    }
}
```

### Graphics & Animation
```actionscript
package app {
    import graphics.Sprite;
    import graphics.Stage;
    import utils.Timer;

    public class MySprite extends Sprite {
        public function MySprite() {
            super();
            draw();
            animate();
        }

        private function draw():void {
            graphics.beginFill(0xFF0000, 1.0);
            graphics.drawRect(0, 0, 100, 100);
            graphics.endFill();
        }

        private function animate():void {
            var timer:Timer = new Timer(16, this.onFrame); // 60 FPS
            timer.start();
        }

        private function onFrame():void {
            rotation += 1;
            x = Math.sin(rotation * Math.PI / 180) * 100;
        }
    }
}
```

### Networking
```actionscript
package app {
    import net.URLRequest;
    import net.URLLoader;

    public class NetworkApp {
        public function loadData():void {
            var request:URLRequest = new URLRequest("https://api.example.com/data");
            request.method = "POST";
            request.data = { message: "Hello API" };

            var loader:URLLoader = new URLLoader();
            loader.dataFormat = "json";
            loader.addEventListener("complete", onLoadComplete);
            loader.load(request);
        }

        private function onLoadComplete(event:Event):void {
            trace("Loaded data: " + JSON.stringify(event.data));
        }
    }
}
```

## 🏗️ Architecture

```
as4/
├── bin/as4              # CLI entry point
├── src/
│   ├── compiler/        # .as → .ts → .js pipeline
│   ├── runtime/
│   │   ├── events/      # EventDispatcher system
│   │   ├── utils/       # Timer, trace, Math, ByteArray
│   │   ├── patterns/    # Design patterns
│   │   ├── ai/          # AI/ML integration
│   │   ├── graphics/    # Display objects, Stage
│   │   ├── net/         # Networking classes
│   │   └── storage/     # SharedObject, Database
│   ├── cli/             # CLI implementation
│   └── scaffolding/     # Code generators
└── example/             # Sample applications
```

## 🚀 Compilation Pipeline

1. **Parse** .as files with custom ActionScript parser
2. **Transform** AS3 syntax to TypeScript AST using ts-morph
3. **Type mapping**: String→string, int→number, Vector→Array
4. **Import resolution**: AS3 packages → TypeScript modules
5. **Emit** TypeScript and JavaScript files

## 🌐 Cross-Platform Runtime

- **Node.js**: Full feature set with file system, networking, canvas
- **Browser**: DOM integration, WebGL, WebAudio, localStorage
- **Shared APIs**: Events, AI, networking adapt to environment

## 🔌 Plugin System

- **Compiler plugins**: Custom syntax, transformations
- **Runtime plugins**: New AI providers, physics engines
- **Package ecosystem**: AS4-specific modules via npm

## 📦 Installation

```bash
# Global installation
npm install -g as4

# Local development
git clone <as4-repo>
cd as4
npm install
npm run build
npm link
```

## 🧪 Testing

```bash
as4 test                    # Run full test suite
as4 compile example/*.as    # Test compilation
as4 run example/MyAIApp.as  # Test execution
```

## 🤝 Contributing

AS4 is designed to be fully extensible:

- **Add AI providers**: Implement AIModel interface
- **New syntax**: Extend compiler transformations
- **Runtime features**: Add to appropriate runtime modules
- **Design patterns**: Contribute reusable patterns

## 📄 License

MIT - Build amazing ActionScript-style applications with modern Node.js and AI capabilities!

---

**AS4** brings the familiar ActionScript 3 development experience to the modern JavaScript ecosystem with powerful AI integration, cross-platform runtime, and enterprise-ready architecture. Perfect for developers who love AS3 syntax but want to leverage Node.js, TypeScript, and cutting-edge AI capabilities.
