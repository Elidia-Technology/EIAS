
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
export declare class CLI {
    private compiler;
    constructor();
    /**
     * Compile AS file to JavaScript
     */
    compile(file: string, options?: any): Promise<void>;
    /**
     * Compile and run AS file
     */
    run(file: string): Promise<void>;
    /**
     * Run tests
     */
    runTests(): void;
    /**
     * Generate scaffolding
     */
    generate(pattern: string): void;
    /**
     * Generate basic class
     */
    private generateClass;
    /**
     * Generate singleton class
     */
    private generateSingleton;
    /**
     * Generate AI model app
     */
    private generateAIModel;
    /**
     * Generate sprite class
     */
    private generateSprite;
    /**
     * Write template to file
     */
    private writeTemplate;
    /**
     * Install AS4 package
     */
    install(pkg: string): void;
    /**
     * Publish AS4 module
     */
    publish(): void;
}
//# sourceMappingURL=CLI.d.ts.map