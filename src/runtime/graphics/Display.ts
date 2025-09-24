
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
import { EventDispatcher } from '../events/EventDispatcher';

/**
 * AS3-style Point class
 */
export class Point {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    public clone(): Point {
        return new Point(this.x, this.y);
    }

    public equals(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    public distance(point: Point): number {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

/**
 * AS3-style Rectangle class
 */
export class Rectangle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    constructor(x: number = 0, y: number = 0, width: number = 0, height: number = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public get left(): number {
        return this.x;
    }

    public get right(): number {
        return this.x + this.width;
    }

    public get top(): number {
        return this.y;
    }

    public get bottom(): number {
        return this.y + this.height;
    }

    public contains(x: number, y: number): boolean {
        return x >= this.x && x <= this.right && y >= this.y && y <= this.bottom;
    }

    public containsPoint(point: Point): boolean {
        return this.contains(point.x, point.y);
    }

    public intersects(rect: Rectangle): boolean {
        return !(rect.left > this.right || 
                rect.right < this.left || 
                rect.top > this.bottom || 
                rect.bottom < this.top);
    }

    public clone(): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
}

/**
 * Base DisplayObject class - foundation for all display objects
 */
export abstract class DisplayObject extends EventDispatcher {
    public x: number = 0;
    public y: number = 0;
    public width: number = 0;
    public height: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;
    public rotation: number = 0;
    public alpha: number = 1;
    public visible: boolean = true;
    public name: string = '';
    public parent: DisplayObjectContainer | null = null;
    
    protected _stage: Stage | null = null;

    constructor() {
        super();
    }

    /**
     * Get global bounds
     */
    public getBounds(targetCoordinateSpace?: DisplayObject): Rectangle {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    /**
     * Convert local point to global
     */
    public localToGlobal(point: Point): Point {
        // Simplified implementation - would need full transformation matrix
        return new Point(point.x + this.x, point.y + this.y);
    }

    /**
     * Convert global point to local
     */
    public globalToLocal(point: Point): Point {
        // Simplified implementation - would need full transformation matrix
        return new Point(point.x - this.x, point.y - this.y);
    }

    /**
     * Hit test point
     */
    public hitTestPoint(x: number, y: number, shapeFlag: boolean = false): boolean {
        return x >= this.x && x <= this.x + this.width && 
               y >= this.y && y <= this.y + this.height;
    }

    /**
     * Get stage reference
     */
    public get stage(): Stage | null {
        return this._stage;
    }

    /**
     * Abstract render method to be implemented by subclasses
     */
    public abstract render(context: any): void;
}

/**
 * DisplayObjectContainer - can contain child display objects
 */
export class DisplayObjectContainer extends DisplayObject {
    protected children: DisplayObject[] = [];

    constructor() {
        super();
    }

    /**
     * Add child display object
     */
    public addChild(child: DisplayObject): DisplayObject {
        if (child.parent) {
            child.parent.removeChild(child);
        }
        
        child.parent = this;
        child._stage = this._stage;
        this.children.push(child);
        
        this.dispatchSimpleEvent('childAdded', { child });
        return child;
    }

    /**
     * Remove child display object
     */
    public removeChild(child: DisplayObject): DisplayObject {
        const index = this.children.indexOf(child);
        if (index > -1) {
            this.children.splice(index, 1);
            child.parent = null;
            child._stage = null;
            this.dispatchSimpleEvent('childRemoved', { child });
        }
        return child;
    }

    /**
     * Get child at index
     */
    public getChildAt(index: number): DisplayObject {
        if (index < 0 || index >= this.children.length) {
            throw new Error('Index out of bounds');
        }
        return this.children[index];
    }

    /**
     * Get child by name
     */
    public getChildByName(name: string): DisplayObject | null {
        return this.children.find(child => child.name === name) || null;
    }

    /**
     * Get number of children
     */
    public get numChildren(): number {
        return this.children.length;
    }

    /**
     * Check if contains child
     */
    public contains(child: DisplayObject): boolean {
        return this.children.includes(child);
    }

    /**
     * Render all children
     */
    public render(context: any): void {
        if (!this.visible) return;

        // Save context state
        context.save();
        
        // Apply transformations
        context.translate(this.x, this.y);
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.rotation * Math.PI / 180);
        context.globalAlpha = this.alpha;

        // Render all children
        for (const child of this.children) {
            if (child.visible) {
                child.render(context);
            }
        }

        // Restore context state
        context.restore();
    }
}

/**
 * Sprite class - basic display object with graphics
 */
export class Sprite extends DisplayObjectContainer {
    public graphics: Graphics;

    constructor() {
        super();
        this.graphics = new Graphics();
    }

    public render(context: any): void {
        if (!this.visible) return;

        context.save();
        
        // Apply transformations
        context.translate(this.x, this.y);
        context.scale(this.scaleX, this.scaleY);
        context.rotate(this.rotation * Math.PI / 180);
        context.globalAlpha = this.alpha;

        // Render graphics
        this.graphics.render(context);

        // Render children
        super.render(context);

        context.restore();
    }
}

/**
 * Graphics class for drawing operations
 */
export class Graphics {
    private commands: Array<{ type: string; args: any[] }> = [];

    /**
     * Begin fill with color
     */
    public beginFill(color: number, alpha: number = 1): void {
        this.commands.push({
            type: 'beginFill',
            args: [color, alpha]
        });
    }

    /**
     * End fill
     */
    public endFill(): void {
        this.commands.push({
            type: 'endFill',
            args: []
        });
    }

    /**
     * Set line style
     */
    public lineStyle(thickness: number = 1, color: number = 0x000000, alpha: number = 1): void {
        this.commands.push({
            type: 'lineStyle',
            args: [thickness, color, alpha]
        });
    }

    /**
     * Move to point
     */
    public moveTo(x: number, y: number): void {
        this.commands.push({
            type: 'moveTo',
            args: [x, y]
        });
    }

    /**
     * Draw line to point
     */
    public lineTo(x: number, y: number): void {
        this.commands.push({
            type: 'lineTo',
            args: [x, y]
        });
    }

    /**
     * Draw rectangle
     */
    public drawRect(x: number, y: number, width: number, height: number): void {
        this.commands.push({
            type: 'drawRect',
            args: [x, y, width, height]
        });
    }

    /**
     * Draw circle
     */
    public drawCircle(x: number, y: number, radius: number): void {
        this.commands.push({
            type: 'drawCircle',
            args: [x, y, radius]
        });
    }

    /**
     * Clear all graphics
     */
    public clear(): void {
        this.commands = [];
    }

    /**
     * Render graphics commands to canvas context
     */
    public render(context: any): void {
        for (const command of this.commands) {
            switch (command.type) {
                case 'beginFill':
                    const [color, alpha] = command.args;
                    context.fillStyle = this.colorToHex(color);
                    context.globalAlpha = alpha;
                    context.beginPath();
                    break;
                    
                case 'endFill':
                    context.fill();
                    break;
                    
                case 'lineStyle':
                    const [thickness, lineColor, lineAlpha] = command.args;
                    context.lineWidth = thickness;
                    context.strokeStyle = this.colorToHex(lineColor);
                    context.globalAlpha = lineAlpha;
                    break;
                    
                case 'moveTo':
                    context.moveTo(command.args[0], command.args[1]);
                    break;
                    
                case 'lineTo':
                    context.lineTo(command.args[0], command.args[1]);
                    break;
                    
                case 'drawRect':
                    const [rx, ry, rw, rh] = command.args;
                    context.rect(rx, ry, rw, rh);
                    break;
                    
                case 'drawCircle':
                    const [cx, cy, radius] = command.args;
                    context.arc(cx, cy, radius, 0, 2 * Math.PI);
                    break;
            }
        }
    }

    /**
     * Convert color number to hex string
     */
    private colorToHex(color: number): string {
        return '#' + color.toString(16).padStart(6, '0');
    }
}

/**
 * Stage class - root display object container
 */
export class Stage extends DisplayObjectContainer {
    public stageWidth: number;
    public stageHeight: number;
    private canvas: any; // HTMLCanvasElement in browser, Canvas in Node.js
    private context: any;

    constructor(width: number = 800, height: number = 600) {
        super();
        this.stageWidth = width;
        this.stageHeight = height;
        this._stage = this;
        this.initializeCanvas();
    }

    /**
     * Initialize canvas (different for Node.js vs browser)
     */
    private initializeCanvas(): void {
        // In a real implementation, this would detect environment
        // and create appropriate canvas (node-canvas vs HTML5 Canvas)
        if (typeof window !== 'undefined') {
            // Browser environment
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.stageWidth;
            this.canvas.height = this.stageHeight;
            this.context = this.canvas.getContext('2d');
        } else {
            // Node.js environment - would require node-canvas
            try {
                const { createCanvas } = require('canvas');
                this.canvas = createCanvas(this.stageWidth, this.stageHeight);
                this.context = this.canvas.getContext('2d');
            } catch (error) {
                console.warn('node-canvas not available, graphics disabled');
            }
        }
    }

    /**
     * Render the entire stage
     */
    public render(context?: any): void {
        if (!this.context && !context) return;
        
        const ctx = context || this.context;
        
        // Clear the canvas
        ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        
        // Render all children
        super.render(ctx);
    }

    /**
     * Get canvas for external use
     */
    public getCanvas(): any {
        return this.canvas;
    }

    /**
     * Add stage to DOM (browser only)
     */
    public addToDOM(parent?: HTMLElement): void {
        if (typeof window !== 'undefined' && this.canvas) {
            const container = parent || document.body;
            container.appendChild(this.canvas);
        }
    }
}
