
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
export declare class Point {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    clone(): Point;
    equals(point: Point): boolean;
    distance(point: Point): number;
}
/**
 * AS3-style Rectangle class
 */
export declare class Rectangle {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x?: number, y?: number, width?: number, height?: number);
    get left(): number;
    get right(): number;
    get top(): number;
    get bottom(): number;
    contains(x: number, y: number): boolean;
    containsPoint(point: Point): boolean;
    intersects(rect: Rectangle): boolean;
    clone(): Rectangle;
}
/**
 * Base DisplayObject class - foundation for all display objects
 */
export declare abstract class DisplayObject extends EventDispatcher {
    x: number;
    y: number;
    width: number;
    height: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    alpha: number;
    visible: boolean;
    name: string;
    parent: DisplayObjectContainer | null;
    protected _stage: Stage | null;
    constructor();
    /**
     * Get global bounds
     */
    getBounds(targetCoordinateSpace?: DisplayObject): Rectangle;
    /**
     * Convert local point to global
     */
    localToGlobal(point: Point): Point;
    /**
     * Convert global point to local
     */
    globalToLocal(point: Point): Point;
    /**
     * Hit test point
     */
    hitTestPoint(x: number, y: number, shapeFlag?: boolean): boolean;
    /**
     * Get stage reference
     */
    get stage(): Stage | null;
    /**
     * Abstract render method to be implemented by subclasses
     */
    abstract render(context: any): void;
}
/**
 * DisplayObjectContainer - can contain child display objects
 */
export declare class DisplayObjectContainer extends DisplayObject {
    protected children: DisplayObject[];
    constructor();
    /**
     * Add child display object
     */
    addChild(child: DisplayObject): DisplayObject;
    /**
     * Remove child display object
     */
    removeChild(child: DisplayObject): DisplayObject;
    /**
     * Get child at index
     */
    getChildAt(index: number): DisplayObject;
    /**
     * Get child by name
     */
    getChildByName(name: string): DisplayObject | null;
    /**
     * Get number of children
     */
    get numChildren(): number;
    /**
     * Check if contains child
     */
    contains(child: DisplayObject): boolean;
    /**
     * Render all children
     */
    render(context: any): void;
}
/**
 * Sprite class - basic display object with graphics
 */
export declare class Sprite extends DisplayObjectContainer {
    graphics: Graphics;
    constructor();
    render(context: any): void;
}
/**
 * Graphics class for drawing operations
 */
export declare class Graphics {
    private commands;
    /**
     * Begin fill with color
     */
    beginFill(color: number, alpha?: number): void;
    /**
     * End fill
     */
    endFill(): void;
    /**
     * Set line style
     */
    lineStyle(thickness?: number, color?: number, alpha?: number): void;
    /**
     * Move to point
     */
    moveTo(x: number, y: number): void;
    /**
     * Draw line to point
     */
    lineTo(x: number, y: number): void;
    /**
     * Draw rectangle
     */
    drawRect(x: number, y: number, width: number, height: number): void;
    /**
     * Draw circle
     */
    drawCircle(x: number, y: number, radius: number): void;
    /**
     * Clear all graphics
     */
    clear(): void;
    /**
     * Render graphics commands to canvas context
     */
    render(context: any): void;
    /**
     * Convert color number to hex string
     */
    private colorToHex;
}
/**
 * Stage class - root display object container
 */
export declare class Stage extends DisplayObjectContainer {
    stageWidth: number;
    stageHeight: number;
    private canvas;
    private context;
    constructor(width?: number, height?: number);
    /**
     * Initialize canvas (different for Node.js vs browser)
     */
    private initializeCanvas;
    /**
     * Render the entire stage
     */
    render(context?: any): void;
    /**
     * Get canvas for external use
     */
    getCanvas(): any;
    /**
     * Add stage to DOM (browser only)
     */
    addToDOM(parent?: HTMLElement): void;
}
//# sourceMappingURL=Display.d.ts.map