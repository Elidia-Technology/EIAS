
/**
 * MIT License

Copyright (c) 2025 Saleem Ahmad

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const AS4Compiler_1 = require("../compiler/AS4Compiler");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class CLI {
    constructor() {
        this.compiler = new AS4Compiler_1.AS4Compiler();
    }
    /**
     * Compile AS file to JavaScript
     */
    async compile(file, options = {}) {
        console.log(`🔧 Compiling ${file}...`);
        if (!fs.existsSync(file)) {
            console.error(`❌ File not found: ${file}`);
            process.exit(1);
        }
        try {
            const result = await this.compiler.compile(file, options);
            if (result.success) {
                console.log(`✅ Compiled successfully!`);
                console.log(`📄 TypeScript: ${result.tsPath}`);
                console.log(`📄 JavaScript: ${result.jsPath}`);
            }
            else {
                console.error(`❌ Compilation failed: ${result.error}`);
                process.exit(1);
            }
        }
        catch (error) {
            console.error(`❌ Compilation error:`, error);
            process.exit(1);
        }
    }
    /**
     * Compile and run AS file
     */
    async run(file) {
        console.log(`🚀 Running ${file}...`);
        // First compile
        await this.compile(file);
        // Then run the compiled JavaScript
        const jsFile = file.replace('.as', '.js');
        const jsPath = path.join(path.dirname(file), 'dist', path.basename(jsFile));
        if (fs.existsSync(jsPath)) {
            console.log(`▶️  Executing ${jsPath}...`);
            const child_process = require('child_process');
            child_process.exec(`node "${jsPath}"`, (error, stdout, stderr) => {
                if (stdout)
                    console.log(stdout);
                if (stderr)
                    console.error(stderr);
                if (error) {
                    console.error(`❌ Runtime error:`, error);
                    process.exit(1);
                }
            });
        }
        else {
            console.error(`❌ Compiled JavaScript file not found: ${jsPath}`);
            process.exit(1);
        }
    }
    /**
     * Run tests
     */
    runTests() {
        console.log('🧪 Running AS4 test suite...');
        console.log('⚠️  Test framework not implemented yet');
    }
    /**
     * Generate scaffolding
     */
    generate(pattern) {
        console.log(`🏗️  Generating ${pattern}...`);
        switch (pattern.toLowerCase()) {
            case 'class':
                this.generateClass();
                break;
            case 'singleton':
                this.generateSingleton();
                break;
            case 'ai':
            case 'aimodel':
                this.generateAIModel();
                break;
            case 'sprite':
                this.generateSprite();
                break;
            default:
                console.error(`❌ Unknown pattern: ${pattern}`);
                console.log('Available patterns: class, singleton, ai, sprite');
                process.exit(1);
        }
    }
    /**
     * Generate basic class
     */
    generateClass() {
        const template = `package app {
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
}`;
        this.writeTemplate('MyClass.as', template);
    }
    /**
     * Generate singleton class
     */
    generateSingleton() {
        const template = `package app {
    import patterns.Singleton;

    public class MySingleton extends Singleton {
        private static var _instance:MySingleton;

        public function MySingleton() {
            super();
        }

        public static function getInstance():MySingleton {
            if (!_instance) {
                _instance = new MySingleton();
            }
            return _instance;
        }

        public function doSomething():void {
            trace("Singleton method called");
        }
    }
}`;
        this.writeTemplate('MySingleton.as', template);
    }
    /**
     * Generate AI model app
     */
    generateAIModel() {
        const template = `package app {
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
            ai.generateText("Hello, how are you?").then(function(response:String):void {
                trace("AI Response: " + response);
            }).catch(function(error:Error):void {
                trace("Error: " + error.message);
            });
        }
    }
}`;
        this.writeTemplate('MyAIApp.as', template);
    }
    /**
     * Generate sprite class
     */
    generateSprite() {
        const template = `package app {
    import graphics.Sprite;
    import graphics.Graphics;

    public class MySprite extends Sprite {
        public function MySprite() {
            super();
            draw();
        }

        private function draw():void {
            graphics.beginFill(0xFF0000, 1.0);
            graphics.drawRect(0, 0, 100, 100);
            graphics.endFill();
        }

        public function animate():void {
            x += 1;
            y += 1;
        }
    }
}`;
        this.writeTemplate('MySprite.as', template);
    }
    /**
     * Write template to file
     */
    writeTemplate(filename, content) {
        try {
            fs.writeFileSync(filename, content);
            console.log(`✅ Generated ${filename}`);
        }
        catch (error) {
            console.error(`❌ Failed to generate ${filename}:`, error);
            process.exit(1);
        }
    }
    /**
     * Install AS4 package
     */
    install(pkg) {
        console.log(`📦 Installing ${pkg}...`);
        console.log('⚠️  Package manager not implemented yet');
        console.log('💡 Try: npm install ' + pkg);
    }
    /**
     * Publish AS4 module
     */
    publish() {
        console.log('📤 Publishing module...');
        console.log('⚠️  Publishing not implemented yet');
        console.log('💡 Try: npm publish');
    }
}
exports.CLI = CLI;
//# sourceMappingURL=CLI.js.map