# AS4 Framework - FAQ

Frequently Asked Questions about the AS4 framework.

## Table of Contents

1. [General Questions](#general-questions)
2. [Installation & Setup](#installation--setup)
3. [ActionScript Compatibility](#actionscript-compatibility)
4. [Performance](#performance)
5. [AI Integration](#ai-integration)
6. [Development Workflow](#development-workflow)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)
9. [Migration](#migration)
10. [Contributing](#contributing)

---

## General Questions

### What is AS4?

AS4 (ActionScript 4) is a modern framework that brings ActionScript 3 syntax and capabilities to the Node.js and browser environments. It provides:

- Full ActionScript 3 compatibility
- Modern JavaScript runtime
- AI/ML integration
- Cross-platform development
- Enterprise design patterns

### Why use AS4 instead of pure JavaScript?

AS4 offers several advantages:

- **Familiar syntax** for ActionScript developers
- **Strong typing** and compile-time error checking
- **Rich class system** with inheritance and interfaces
- **Built-in event system** similar to ActionScript
- **Graphics API** for visual applications
- **AI integration** out of the box
- **Enterprise patterns** for scalable applications

### Is AS4 compatible with existing ActionScript code?

Yes! AS4 maintains high compatibility with ActionScript 3:

- Same syntax and language features
- Compatible event system
- Similar display object hierarchy
- Familiar networking APIs
- Easy migration path from Flash/AIR applications

### What platforms does AS4 support?

AS4 runs on:

- **Node.js** (server-side applications)
- **Web browsers** (client-side applications)
- **Electron** (desktop applications)
- **React Native** (mobile applications, with adapters)

---

## Installation & Setup

### How do I install AS4?

```bash
# Global installation
npm install -g as4

# Project-specific installation
npm install as4 --save-dev
```

### What are the system requirements?

- Node.js 16 or higher
- npm or yarn package manager
- 4GB RAM minimum (8GB recommended for AI features)
- Modern operating system (Windows 10+, macOS 10.15+, Ubuntu 18+)

### Can I use AS4 with existing Node.js projects?

Yes! AS4 can be integrated into existing projects:

```bash
# Add to existing project
cd my-existing-project
npm install as4 --save-dev
as4 init --integrate
```

### How do I set up my IDE for AS4 development?

**VS Code (Recommended):**
1. Install the AS4 extension: `as4-language-support`
2. Configure syntax highlighting for `.as` files
3. Enable TypeScript checking for better IntelliSense

**Other editors:**
- Configure syntax highlighting for ActionScript
- Set up build tasks to run `as4 compile`
- Install Node.js debugging extensions

---

## ActionScript Compatibility

### What ActionScript 3 features are supported?

**Fully Supported:**
- Classes, interfaces, inheritance
- Packages and imports
- Events and EventDispatcher
- Strong typing with type annotations
- Access modifiers (public, private, protected)
- Static members and methods
- Getters and setters
- Vector and Array collections

**Partially Supported:**
- Display objects (adapted for web/canvas)
- Graphics API (using modern canvas)
- Networking (HTTP, WebSockets)
- File system operations

**Not Supported:**
- Flash-specific APIs (Stage3D, AIR-only features)
- Some legacy Flash player features
- ActionScript bytecode compilation

### How do I migrate Flash display objects?

AS4 provides compatible display object classes:

```actionscript
// ActionScript 3 code works as-is
var sprite:Sprite = new Sprite();
sprite.graphics.beginFill(0xFF0000);
sprite.graphics.drawRect(0, 0, 100, 100);
sprite.graphics.endFill();
addChild(sprite);
```

For advanced graphics, use the modern Canvas API integration.

### Can I use existing ActionScript libraries?

Many ActionScript libraries can be ported to AS4:

1. **Pure logic libraries** - Usually work with minimal changes
2. **Display libraries** - May need adaptation for web canvas
3. **Flash-specific libraries** - Require more extensive modification

### How do I handle Vector vs Array?

AS4 provides Vector-like functionality:

```actionscript
// Traditional approach
var numbers:Vector.<Number> = new Vector.<Number>();

// AS4 approach (also supported)
var numbers:Array = [];
var typedNumbers:Vector.<Number> = Vector.<Number>(numbers);
```

---

## Performance

### How does AS4 performance compare to native JavaScript?

AS4 performance characteristics:

- **Compilation overhead** - One-time cost during build
- **Runtime performance** - Similar to TypeScript/JavaScript
- **Memory usage** - Comparable to native JavaScript
- **Startup time** - Slightly slower due to AS4 runtime initialization

**Optimization tips:**
- Use `--minify` for production builds
- Enable tree-shaking with modern bundlers
- Use typed arrays for numeric computations
- Cache compiled JavaScript for deployment

### Can I optimize AS4 applications?

Yes, several optimization strategies:

**Compilation:**
```bash
as4 compile --minify --target es2020 --tree-shake
```

**Code level:**
```actionscript
// Use typed collections
var numbers:Vector.<Number> = new Vector.<Number>(1000, true);

// Avoid creating objects in loops
var reusablePoint:Point = new Point();
for (var i:int = 0; i < items.length; i++) {
    reusablePoint.x = items[i].x;
    reusablePoint.y = items[i].y;
    processPoint(reusablePoint);
}
```

### How do I profile AS4 applications?

Use standard Node.js profiling tools:

```bash
# CPU profiling
node --prof dist/app.js

# Memory profiling
node --inspect dist/app.js
# Then use Chrome DevTools

# AS4-specific profiling
as4 run --profile dist/app.js
```

---

## AI Integration

### What AI providers does AS4 support?

AS4 integrates with major AI providers:

- **OpenAI** (GPT, DALL-E, Whisper)
- **HuggingFace** (Various models)
- **Replicate** (Stable Diffusion, etc.)
- **Local models** (ONNX, TensorFlow.js)
- **Custom providers** (via plugin system)

### How do I set up AI features?

1. **Install AI dependencies:**
   ```bash
   npm install as4-ai
   ```

2. **Configure API keys:**
   ```bash
   export OPENAI_API_KEY="your-key"
   export HUGGINGFACE_API_KEY="your-key"
   ```

3. **Use in code:**
   ```actionscript
   var ai:AIModel = new AIModel("openai");
   ai.generateText("Hello world").then(function(result:String):void {
       trace(result);
   });
   ```

### Can I use AS4 without AI features?

Yes! AI integration is optional:

```json
// as4.config.json
{
  "ai": {
    "enabled": false
  }
}
```

This reduces bundle size and removes AI dependencies.

### How do I handle AI API costs?

Cost management strategies:

- **Rate limiting** - Implement request throttling
- **Caching** - Store frequently used results
- **Local models** - Use smaller, local models when appropriate
- **User quotas** - Implement usage limits per user

---

## Development Workflow

### What's the recommended development workflow?

1. **Project setup:**
   ```bash
   as4 init my-project
   cd my-project
   ```

2. **Development mode:**
   ```bash
   as4 compile --watch &
   as4 serve --hot
   ```

3. **Testing:**
   ```bash
   as4 test --watch
   ```

4. **Production build:**
   ```bash
   as4 build --mode production
   ```

### How do I debug AS4 applications?

**Node.js debugging:**
```bash
as4 run --inspect dist/app.js
```

**Browser debugging:**
- Enable source maps: `as4 compile --source-map`
- Use browser developer tools
- Set breakpoints in original AS4 code

**VS Code debugging:**
Create `.vscode/launch.json`:
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug AS4 App",
  "program": "${workspaceFolder}/dist/app.js",
  "preLaunchTask": "as4-compile"
}
```

### Can I use AS4 with existing build tools?

Yes! AS4 integrates with popular tools:

**Webpack:**
```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.as$/,
        use: 'as4-loader'
      }
    ]
  }
};
```

**Gulp:**
```javascript
const as4 = require('gulp-as4');

gulp.task('compile', () => {
  return gulp.src('src/**/*.as')
    .pipe(as4())
    .pipe(gulp.dest('dist'));
});
```

---

## Deployment

### How do I deploy AS4 applications?

**Node.js applications:**
```bash
# Build for production
as4 build --mode production

# Deploy compiled JavaScript
npm start
```

**Web applications:**
```bash
# Build for web
as4 build --target browser --minify

# Deploy to static hosting (Netlify, Vercel, etc.)
```

**Electron applications:**
```bash
# Install electron
npm install electron --save-dev

# Build and package
as4 build --target electron
electron-builder
```

### What about Docker deployment?

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/app.js"]
```

Build and deploy:
```bash
as4 build --mode production
docker build -t my-as4-app .
docker run -p 3000:3000 my-as4-app
```

### How do I handle environment configuration?

Use environment variables:

```actionscript
// Access environment variables
var apiUrl:String = process.env.API_URL || "http://localhost:3000";
var debugMode:Boolean = process.env.NODE_ENV === "development";
```

Create `.env` files:
```
# .env.development
NODE_ENV=development
API_URL=http://localhost:3000
DEBUG=true

# .env.production
NODE_ENV=production
API_URL=https://api.myapp.com
DEBUG=false
```

---

## Troubleshooting

### Common compilation errors

**"Cannot find module" error:**
```bash
# Install missing dependencies
npm install

# Check import paths
import as4.events.EventDispatcher; // Correct
import flash.events.EventDispatcher; // Incorrect for AS4
```

**Type errors:**
```actionscript
// Specify types explicitly
var result:String = someFunction() as String;

// Or use type assertions
var result:String = <String>someFunction();
```

**Circular dependency errors:**
- Restructure imports
- Use forward declarations
- Consider dependency injection

### Runtime errors

**"EventDispatcher not found":**
```bash
# Install AS4 runtime
npm install as4-runtime
```

**Graphics not rendering:**
- Check if canvas is properly initialized
- Verify display object hierarchy
- Ensure stage is set up correctly

### Performance issues

**Slow compilation:**
- Use incremental compilation: `--incremental`
- Exclude unnecessary files
- Use compilation cache

**High memory usage:**
- Enable garbage collection hints
- Use object pooling for frequently created objects
- Avoid memory leaks in event listeners

---

## Migration

### How do I migrate from Flash/AIR?

**Step-by-step migration:**

1. **Assess codebase** - Identify Flash-specific dependencies
2. **Update imports** - Change Flash imports to AS4 imports
3. **Adapt display code** - Update graphics for web canvas
4. **Handle file system** - Use Node.js fs module for file operations
5. **Test thoroughly** - Verify functionality across platforms

**Example migration:**
```actionscript
// Before (Flash)
import flash.display.Sprite;
import flash.events.MouseEvent;

// After (AS4)
import as4.display.Sprite;
import as4.events.MouseEvent;

// Code remains largely the same
```

### Can I migrate gradually?

Yes! Incremental migration is supported:

1. **Start with core classes** - Migrate foundational code first
2. **Use compatibility layer** - AS4 provides Flash compatibility shims
3. **Test frequently** - Verify each migrated component
4. **Modernize gradually** - Add new features using AS4 capabilities

### What about existing Flash assets?

**Vector graphics:**
- Convert to SVG or canvas drawing code
- Use tools like Adobe Animate CC export

**Bitmaps:**
- Standard web formats (PNG, JPG, WebP)
- Use AS4 asset loading system

**Sounds:**
- Convert to web audio formats (MP3, OGG, AAC)
- Use Web Audio API integration

---

## Contributing

### How can I contribute to AS4?

**Ways to contribute:**
- Report bugs and issues
- Submit feature requests
- Contribute code improvements
- Write documentation
- Create tutorials and examples
- Help with community support

### Where is the source code?

AS4 is open source:
- **Main repository:** https://github.com/as4js/as4
- **Documentation:** https://github.com/as4js/docs
- **Examples:** https://github.com/as4js/examples

### How do I report bugs?

1. **Check existing issues** - Search for similar problems
2. **Create minimal reproduction** - Provide simple test case
3. **Include details:**
   - AS4 version
   - Node.js version
   - Operating system
   - Error messages
   - Steps to reproduce

### Can I create AS4 extensions?

Yes! AS4 supports a plugin system:

```javascript
// Create an AS4 plugin
module.exports = {
  name: 'my-as4-plugin',
  version: '1.0.0',
  install(as4) {
    // Add functionality to AS4
    as4.registerTemplate('my-template', templateCode);
    as4.addCompilerPlugin(myCompilerPlugin);
  }
};
```

---

**Need more help?**

- 📖 **Documentation:** https://as4js.org/docs
- 💬 **Community Discord:** https://discord.gg/as4js
- 🐛 **Bug Reports:** https://github.com/as4js/as4/issues
- 📧 **Email Support:** support@as4js.org
- 📚 **Tutorials:** https://as4js.org/tutorials
