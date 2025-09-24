
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
export declare class AS4Compiler {
    private project;
    constructor();
    /**
     * Compile .as file to TypeScript and JavaScript
     */
    compile(asFilePath: string, options?: CompileOptions): Promise<CompileResult>;
    /**
     * Transform AS3 syntax to TypeScript
     */
    private transformAS3ToTS;
    /**
     * Map AS3 types to TypeScript types
     */
    private mapAS3TypeToTS;
    /**
     * Transform function parameters
     */
    private transformParameters;
    /**
     * Generate necessary imports based on AS3 content
     */
    private generateImports;
}
export interface CompileOptions {
    outDir?: string;
    watch?: boolean;
}
export interface CompileResult {
    success: boolean;
    tsPath?: string;
    jsPath?: string;
    content?: string;
    error?: string;
}
//# sourceMappingURL=AS4Compiler.d.ts.map