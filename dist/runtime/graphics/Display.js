
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Stage = exports.Graphics = exports.Sprite = exports.DisplayObjectContainer = exports.DisplayObject = exports.Rectangle = exports.Point = void 0;
const EventDispatcher_1 = require("../events/EventDispatcher");
/**
 * AS3-style Point class
 */
class Point {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Point(this.x, this.y);
    }
    equals(point) {
        return this.x === point.x && this.y === point.y;
    }
    distance(point) {
        const dx = this.x - point.x;
        const dy = this.y - point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}
exports.Point = Point;
/**
 * AS3-style Rectangle class
 */
class Rectangle {
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    get left() {
        return this.x;
    }
    get right() {
        return this.x + this.width;
    }
    get top() {
        return this.y;
    }
    get bottom() {
        return this.y + this.height;
    }
    contains(x, y) {
        return x >= this.x && x <= this.right && y >= this.y && y <= this.bottom;
    }
    containsPoint(point) {
        return this.contains(point.x, point.y);
    }
    intersects(rect) {
        return !(rect.left > this.right ||
            rect.right < this.left ||
            rect.top > this.bottom ||
            rect.bottom < this.top);
    }
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
}
exports.Rectangle = Rectangle;
/**
 * Base DisplayObject class - foundation for all display objects
 */
class DisplayObject extends EventDispatcher_1.EventDispatcher {
    constructor() {
        super();
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        this.name = '';
        this.parent = null;
        this._stage = null;
    }
    /**
     * Get global bounds
     */
    getBounds(targetCoordinateSpace) {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
    /**
     * Convert local point to global
     */
    localToGlobal(point) {
        // Simplified implementation - would need full transformation matrix
        return new Point(point.x + this.x, point.y + this.y);
    }
    /**
     * Convert global point to local
     */
    globalToLocal(point) {
        // Simplified implementation - would need full transformation matrix
        return new Point(point.x - this.x, point.y - this.y);
    }
    /**
     * Hit test point
     */
    hitTestPoint(x, y, shapeFlag = false) {
        return x >= this.x && x <= this.x + this.width &&
            y >= this.y && y <= this.y + this.height;
    }
    /**
     * Get stage reference
     */
    get stage() {
        return this._stage;
    }
}
exports.DisplayObject = DisplayObject;
/**
 * DisplayObjectContainer - can contain child display objects
 */
class DisplayObjectContainer extends DisplayObject {
    constructor() {
        super();
        this.children = [];
    }
    /**
     * Add child display object
     */
    addChild(child) {
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
    removeChild(child) {
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
    getChildAt(index) {
        if (index < 0 || index >= this.children.length) {
            throw new Error('Index out of bounds');
        }
        return this.children[index];
    }
    /**
     * Get child by name
     */
    getChildByName(name) {
        return this.children.find(child => child.name === name) || null;
    }
    /**
     * Get number of children
     */
    get numChildren() {
        return this.children.length;
    }
    /**
     * Check if contains child
     */
    contains(child) {
        return this.children.includes(child);
    }
    /**
     * Render all children
     */
    render(context) {
        if (!this.visible)
            return;
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
exports.DisplayObjectContainer = DisplayObjectContainer;
/**
 * Sprite class - basic display object with graphics
 */
class Sprite extends DisplayObjectContainer {
    constructor() {
        super();
        this.graphics = new Graphics();
    }
    render(context) {
        if (!this.visible)
            return;
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
exports.Sprite = Sprite;
/**
 * Graphics class for drawing operations
 */
class Graphics {
    constructor() {
        this.commands = [];
    }
    /**
     * Begin fill with color
     */
    beginFill(color, alpha = 1) {
        this.commands.push({
            type: 'beginFill',
            args: [color, alpha]
        });
    }
    /**
     * End fill
     */
    endFill() {
        this.commands.push({
            type: 'endFill',
            args: []
        });
    }
    /**
     * Set line style
     */
    lineStyle(thickness = 1, color = 0x000000, alpha = 1) {
        this.commands.push({
            type: 'lineStyle',
            args: [thickness, color, alpha]
        });
    }
    /**
     * Move to point
     */
    moveTo(x, y) {
        this.commands.push({
            type: 'moveTo',
            args: [x, y]
        });
    }
    /**
     * Draw line to point
     */
    lineTo(x, y) {
        this.commands.push({
            type: 'lineTo',
            args: [x, y]
        });
    }
    /**
     * Draw rectangle
     */
    drawRect(x, y, width, height) {
        this.commands.push({
            type: 'drawRect',
            args: [x, y, width, height]
        });
    }
    /**
     * Draw circle
     */
    drawCircle(x, y, radius) {
        this.commands.push({
            type: 'drawCircle',
            args: [x, y, radius]
        });
    }
    /**
     * Clear all graphics
     */
    clear() {
        this.commands = [];
    }
    /**
     * Render graphics commands to canvas context
     */
    render(context) {
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
    colorToHex(color) {
        return '#' + color.toString(16).padStart(6, '0');
    }
}
exports.Graphics = Graphics;
/**
 * Stage class - root display object container
 */
class Stage extends DisplayObjectContainer {
    constructor(width = 800, height = 600) {
        super();
        this.stageWidth = width;
        this.stageHeight = height;
        this._stage = this;
        this.initializeCanvas();
    }
    /**
     * Initialize canvas (different for Node.js vs browser)
     */
    initializeCanvas() {
        // In a real implementation, this would detect environment
        // and create appropriate canvas (node-canvas vs HTML5 Canvas)
        if (typeof window !== 'undefined') {
            // Browser environment
            this.canvas = document.createElement('canvas');
            this.canvas.width = this.stageWidth;
            this.canvas.height = this.stageHeight;
            this.context = this.canvas.getContext('2d');
        }
        else {
            // Node.js environment - would require node-canvas
            try {
                const { createCanvas } = require('canvas');
                this.canvas = createCanvas(this.stageWidth, this.stageHeight);
                this.context = this.canvas.getContext('2d');
            }
            catch (error) {
                console.warn('node-canvas not available, graphics disabled');
            }
        }
    }
    /**
     * Render the entire stage
     */
    render(context) {
        if (!this.context && !context)
            return;
        const ctx = context || this.context;
        // Clear the canvas
        ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
        // Render all children
        super.render(ctx);
    }
    /**
     * Get canvas for external use
     */
    getCanvas() {
        return this.canvas;
    }
    /**
     * Add stage to DOM (browser only)
     */
    addToDOM(parent) {
        if (typeof window !== 'undefined' && this.canvas) {
            const container = parent || document.body;
            container.appendChild(this.canvas);
        }
    }
}
exports.Stage = Stage;
//# sourceMappingURL=Display.js.map