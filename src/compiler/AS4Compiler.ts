
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
import { Project, SourceFile, SyntaxKind } from 'ts-morph';
import * as fs from 'fs';
import * as path from 'path';

export class AS4Compiler {
    private project: Project;

    constructor() {
        this.project = new Project({
            tsConfigFilePath: path.join(__dirname, '../../tsconfig.json'),
        });
    }

    /**
     * Compile .as file to TypeScript and JavaScript
     */
    public async compile(asFilePath: string, options: CompileOptions = {}): Promise<CompileResult> {
        try {
            const asContent = fs.readFileSync(asFilePath, 'utf-8');
            const tsContent = this.transformAS3ToTS(asContent);
            
            const outputDir = options.outDir || path.join(path.dirname(asFilePath), 'dist');
            const baseName = path.basename(asFilePath, '.as');
            const tsPath = path.join(outputDir, `${baseName}.ts`);
            const jsPath = path.join(outputDir, `${baseName}.js`);

            // Ensure output directory exists
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }

            // Write TypeScript file
            fs.writeFileSync(tsPath, tsContent);

            // Add to ts-morph project and emit JavaScript
            const sourceFile = this.project.createSourceFile(tsPath, tsContent, { overwrite: true });
            await this.project.emit();

            return {
                success: true,
                tsPath,
                jsPath,
                content: tsContent
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Transform AS3 syntax to TypeScript
     */
    private transformAS3ToTS(asContent: string): string {
        let tsContent = asContent;

        // Basic AS3 → TS transformations
        
        // 1. Package statements → TypeScript modules
        tsContent = tsContent.replace(/package\s+([^{]*)\s*\{/g, (match, packageName) => {
            return `// package ${packageName.trim()}\nexport namespace ${packageName.trim().replace(/\./g, '_')} {`;
        });

        // 2. Import statements
        tsContent = tsContent.replace(/import\s+([^;]+);/g, (match, importPath) => {
            return `import * as ${importPath.replace(/\./g, '_')} from './${importPath.replace(/\./g, '/')}';`;
        });

        // 3. Variable declarations with AS3 types
        tsContent = tsContent.replace(/var\s+(\w+):(\w+)/g, (match, varName, type) => {
            const tsType = this.mapAS3TypeToTS(type);
            return `${varName}: ${tsType}`;
        });

        // 4. Function declarations
        tsContent = tsContent.replace(/function\s+(\w+)\(([^)]*)\):(\w+)/g, (match, funcName, params, returnType) => {
            const tsReturnType = this.mapAS3TypeToTS(returnType);
            const tsParams = this.transformParameters(params);
            return `${funcName}(${tsParams}): ${tsReturnType}`;
        });

        // 5. Class declarations
        tsContent = tsContent.replace(/public\s+class\s+(\w+)(\s+extends\s+\w+)?/g, (match, className, extendsClause) => {
            return `export class ${className}${extendsClause || ''}`;
        });

        // 6. Visibility modifiers (AS3 uses them differently)
        tsContent = tsContent.replace(/public\s+var/g, 'public');
        tsContent = tsContent.replace(/private\s+var/g, 'private');
        tsContent = tsContent.replace(/protected\s+var/g, 'protected');

        // 7. Vector.<Type> → Array<Type>
        tsContent = tsContent.replace(/Vector\.<(\w+)>/g, 'Array<$1>');

        // 8. Add necessary imports at the top
        const imports = this.generateImports(asContent);
        if (imports) {
            tsContent = imports + '\n\n' + tsContent;
        }

        return tsContent;
    }

    /**
     * Map AS3 types to TypeScript types
     */
    private mapAS3TypeToTS(as3Type: string): string {
        const typeMap: { [key: string]: string } = {
            'String': 'string',
            'int': 'number',
            'uint': 'number',
            'Number': 'number',
            'Boolean': 'boolean',
            'void': 'void',
            'Object': 'any',
            'Array': 'any[]',
            '*': 'any'
        };

        return typeMap[as3Type] || as3Type;
    }

    /**
     * Transform function parameters
     */
    private transformParameters(params: string): string {
        if (!params.trim()) return '';

        return params.split(',').map(param => {
            const trimmed = param.trim();
            const colonIndex = trimmed.indexOf(':');
            
            if (colonIndex > -1) {
                const paramName = trimmed.substring(0, colonIndex).trim();
                const paramType = trimmed.substring(colonIndex + 1).trim();
                return `${paramName}: ${this.mapAS3TypeToTS(paramType)}`;
            }
            return `${trimmed}: any`;
        }).join(', ');
    }

    /**
     * Generate necessary imports based on AS3 content
     */
    private generateImports(asContent: string): string {
        const imports: string[] = [];

        if (asContent.includes('Timer')) {
            imports.push("import { Timer } from '../runtime/utils/Timer';");
        }
        if (asContent.includes('EventDispatcher') || asContent.includes('addEventListener')) {
            imports.push("import { EventDispatcher } from '../runtime/events/EventDispatcher';");
        }
        if (asContent.includes('AIModel')) {
            imports.push("import { AIModel } from '../runtime/ai/AIModel';");
        }
        if (asContent.includes('URLRequest')) {
            imports.push("import { URLRequest } from '../runtime/net/URLRequest';");
        }
        if (asContent.includes('Singleton')) {
            imports.push("import { Singleton } from '../runtime/patterns/Singleton';");
        }
        if (asContent.includes('trace(')) {
            imports.push("import { trace } from '../runtime/utils/trace';");
        }

        return imports.join('\n');
    }
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
