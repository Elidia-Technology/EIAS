# Getting Started with AS4

Welcome to AS4 (ActionScript 4) - a modern ActionScript-style framework for Node.js and browser development with built-in AI/ML capabilities.

## Table of Contents

1. [Installation](#installation)
2. [Your First AS4 Application](#your-first-as4-application)
3. [Basic Concepts](#basic-concepts)
4. [Project Structure](#project-structure)
5. [CLI Commands](#cli-commands)
6. [Next Steps](#next-steps)

---

## Installation

### Prerequisites

- **Node.js** 16.0 or higher
- **npm** or **yarn** package manager

### Global Installation (Recommended)

```bash
npm install -g as4
```

### Local Installation

```bash
npm install as4
```

### Verify Installation

```bash
as4 --version
```

You should see the AS4 version number displayed.

---

## Your First AS4 Application

Let's create a simple "Hello World" application to get you started.

### Step 1: Create a New Project Directory

```bash
mkdir my-as4-app
cd my-as4-app
```

### Step 2: Initialize Project

```bash
npm init -y
```

### Step 3: Generate Your First Class

```bash
as4 generate class
```

This creates a file called `MyClass.as` with basic ActionScript structure:

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

        public function setValue(value:String):void {
            _value = value;
        }
    }
}
```

### Step 4: Create a Main Application

Create a file called `HelloWorld.as`:

```actionscript
package app {
    public class HelloWorld {
        public function HelloWorld() {
            trace("Hello, AS4 World!");
            
            var myObject:MyClass = new MyClass("Welcome to AS4");
            trace("Message: " + myObject.getValue());
            
            myObject.setValue("AS4 is awesome!");
            trace("Updated message: " + myObject.getValue());
        }

        public function run():void {
            trace("Application is running...");
        }
    }
}

// Create and run the application
var app:HelloWorld = new HelloWorld();
app.run();
```

### Step 5: Compile and Run

```bash
# Compile the AS4 code to JavaScript
as4 compile HelloWorld.as

# Or compile and run in one step
as4 run HelloWorld.as
```

You should see output like:

```
Hello, AS4 World!
Message: Welcome to AS4
Updated message: AS4 is awesome!
Application is running...
```

---

## Basic Concepts

### ActionScript 3 Compatibility

AS4 maintains compatibility with ActionScript 3 syntax while adding modern features:

```actionscript
// Variables with types
var name:String = "John";
var age:int = 30;
var isActive:Boolean = true;

// Functions with return types
public function calculateSum(a:Number, b:Number):Number {
    return a + b;
}

// Classes and inheritance
public class Person {
    private var _name:String;
    
    public function Person(name:String) {
        _name = name;
    }
    
    public function get name():String {
        return _name;
    }
}
```

### Modern JavaScript Integration

AS4 compiles to modern TypeScript/JavaScript:

```actionscript
// AS4 ActionScript
var numbers:Vector.<int> = new Vector.<int>();
numbers.push(1, 2, 3);

// Compiles to TypeScript
let numbers: Array<number> = new Array<number>();
numbers.push(1, 2, 3);
```

### Event System

AS4 provides a robust event system:

```actionscript
import as4.events.EventDispatcher;
import as4.events.Event;

public class MyComponent extends EventDispatcher {
    public function doSomething():void {
        // Dispatch custom event
        dispatchSimpleEvent("actionComplete", { result: "success" });
    }
}

// Usage
var component:MyComponent = new MyComponent();
component.addEventListener("actionComplete", function(event:Event):void {
    trace("Action completed: " + event.data.result);
});
```

---

## Project Structure

A typical AS4 project follows this structure:

```
my-as4-project/
├── src/                    # AS4 source files
│   ├── app/               # Main application package
│   │   ├── Main.as
│   │   └── controllers/
│   ├── models/            # Data models
│   └── views/             # UI components
├── dist/                  # Compiled output
├── assets/                # Resources (images, sounds, etc.)
├── package.json
└── tsconfig.json          # TypeScript configuration
```

### Example Project Setup

Create the following files:

**src/app/Main.as**
```actionscript
package app {
    import as4.utils.trace;
    import models.User;
    import views.UserView;

    public class Main {
        private var user:User;
        private var userView:UserView;

        public function Main() {
            initialize();
        }

        private function initialize():void {
            trace("Initializing AS4 application...");
            
            user = new User("John Doe", "john@example.com");
            userView = new UserView(user);
            userView.display();
        }

        public function run():void {
            trace("Application running successfully!");
        }
    }
}

var app:Main = new Main();
app.run();
```

**src/models/User.as**
```actionscript
package models {
    public class User {
        private var _name:String;
        private var _email:String;

        public function User(name:String, email:String) {
            _name = name;
            _email = email;
        }

        public function get name():String {
            return _name;
        }

        public function get email():String {
            return _email;
        }

        public function toString():String {
            return "User: " + _name + " (" + _email + ")";
        }
    }
}
```

**src/views/UserView.as**
```actionscript
package views {
    import models.User;
    import as4.utils.trace;

    public class UserView {
        private var user:User;

        public function UserView(user:User) {
            this.user = user;
        }

        public function display():void {
            trace("Displaying user information:");
            trace("Name: " + user.name);
            trace("Email: " + user.email);
        }
    }
}
```

---

## CLI Commands

AS4 provides several CLI commands for development:

### Compilation Commands

```bash
# Compile a single file
as4 compile src/app/Main.as

# Compile with custom output directory
as4 compile src/app/Main.as --outDir build

# Watch mode (recompile on changes)
as4 compile src/app/Main.as --watch
```

### Execution Commands

```bash
# Compile and run
as4 run src/app/Main.as

# Run compiled JavaScript directly
node dist/src/app/Main.js
```

### Code Generation

```bash
# Generate different types of templates
as4 generate class        # Basic class template
as4 generate singleton    # Singleton pattern
as4 generate ai          # AI-powered application
as4 generate sprite      # Graphics sprite class
```

### Testing

```bash
# Run test suite
as4 test
```

### Package Management

```bash
# Install AS4 packages
as4 install package-name

# Publish AS4 module
as4 publish
```

---

## Next Steps

Now that you have a basic AS4 application running, explore these areas:

### 1. **Learn the Core APIs**
- [Events System](../api/events.md) - Handle user interactions and system events
- [Utilities](../api/utils.md) - Timer, trace, math, and binary data utilities
- [Design Patterns](../api/patterns.md) - Implement robust architecture patterns

### 2. **Add AI Capabilities**
- [AI Integration](../api/ai.md) - Text generation, image creation, speech processing
- See [AI Examples](../examples/ai.md) for practical implementations

### 3. **Build Visual Applications**
- [Graphics System](../api/graphics.md) - Display objects, sprites, and animations
- [Graphics Examples](../examples/graphics.md) for interactive applications

### 4. **Connect to Networks**
- [Networking](../api/net.md) - HTTP requests, WebSockets, and real-time communication
- [Networking Examples](../examples/networking.md) for client-server applications

### 5. **Persist Data**
- [Storage](../api/storage.md) - SharedObject, databases, and cross-platform storage
- Learn about data persistence patterns

### 6. **Advanced Topics**
- [Developer Guide](developer-guide.md) - Advanced development techniques
- [Migration Guide](migration.md) - Migrate existing ActionScript 3 projects
- [Performance Optimization](performance.md) - Best practices for production

---

## Common Issues and Solutions

### Issue: "as4 command not found"

**Solution:** Ensure AS4 is installed globally:
```bash
npm install -g as4
```

### Issue: Compilation errors with imports

**Solution:** Check import paths match your file structure:
```actionscript
// Correct import for src/models/User.as
import models.User;
```

### Issue: Node.js modules not found

**Solution:** Install AS4 dependencies:
```bash
npm install as4
```

### Issue: TypeScript compilation errors

**Solution:** Ensure you have the proper tsconfig.json:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true
  }
}
```

---

## Getting Help

- **Documentation**: Browse the [API Reference](../api/) for detailed information
- **Examples**: Check out [code examples](../examples/) for common patterns
- **Issues**: Report bugs and request features on GitHub
- **Community**: Join the AS4 developer community

---

**Congratulations!** You now have a working AS4 development environment. Start building amazing applications with ActionScript-style syntax and modern AI capabilities!

## Quick Reference Card

```actionscript
// Basic AS4 template
package app {
    import as4.utils.trace;
    import as4.events.EventDispatcher;

    public class MyApp extends EventDispatcher {
        public function MyApp() {
            super();
            initialize();
        }

        private function initialize():void {
            trace("App initialized!");
        }

        public function run():void {
            dispatchSimpleEvent("appStarted");
        }
    }
}
```

Save this template and modify it for your specific needs!
