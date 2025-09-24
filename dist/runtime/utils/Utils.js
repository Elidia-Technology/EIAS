
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
exports.ByteArray = exports.MathUtils = exports.Timer = void 0;
exports.trace = trace;
const EventDispatcher_1 = require("../events/EventDispatcher");
/**
 * AS3-style Timer class wrapping setInterval/setTimeout
 */
class Timer extends EventDispatcher_1.EventDispatcher {
    constructor(delay, repeatCount = 0) {
        super();
        this.currentCount = 0;
        this.timerId = null;
        this.running = false;
        this.delay = delay;
        this.repeatCount = repeatCount;
    }
    /**
     * Start the timer
     */
    start() {
        if (this.running)
            return;
        this.running = true;
        this.timerId = setInterval(() => {
            this.currentCount++;
            this.dispatchSimpleEvent(EventDispatcher_1.EventType.TIMER, { currentCount: this.currentCount });
            if (this.repeatCount > 0 && this.currentCount >= this.repeatCount) {
                this.stop();
                this.dispatchSimpleEvent(EventDispatcher_1.EventType.TIMER_COMPLETE, { currentCount: this.currentCount });
            }
        }, this.delay);
    }
    /**
     * Stop the timer
     */
    stop() {
        if (!this.running)
            return;
        this.running = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }
    /**
     * Reset the timer
     */
    reset() {
        this.stop();
        this.currentCount = 0;
    }
    /**
     * Get current count
     */
    getCurrentCount() {
        return this.currentCount;
    }
    /**
     * Check if timer is running
     */
    isRunning() {
        return this.running;
    }
}
exports.Timer = Timer;
/**
 * AS3-style trace function with enhanced logging
 */
function trace(...args) {
    const stack = new Error().stack;
    const caller = stack?.split('\n')[2]?.trim() || 'unknown';
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${caller}]`, ...args);
}
/**
 * AS3-style Math utilities
 */
class MathUtils {
    static abs(value) {
        return Math.abs(value);
    }
    static max(value1, value2) {
        return Math.max(value1, value2);
    }
    static min(value1, value2) {
        return Math.min(value1, value2);
    }
    static round(value) {
        return Math.round(value);
    }
    static floor(value) {
        return Math.floor(value);
    }
    static ceil(value) {
        return Math.ceil(value);
    }
    static random() {
        return Math.random();
    }
    static sin(value) {
        return Math.sin(value);
    }
    static cos(value) {
        return Math.cos(value);
    }
    static tan(value) {
        return Math.tan(value);
    }
    static atan2(y, x) {
        return Math.atan2(y, x);
    }
    static sqrt(value) {
        return Math.sqrt(value);
    }
    static pow(base, exponent) {
        return Math.pow(base, exponent);
    }
}
exports.MathUtils = MathUtils;
MathUtils.PI = Math.PI;
MathUtils.E = Math.E;
/**
 * AS3-style ByteArray mapped to Node.js Buffer
 */
class ByteArray {
    constructor(data) {
        this.position = 0;
        if (data instanceof Buffer) {
            this.buffer = data;
        }
        else if (data instanceof Uint8Array) {
            this.buffer = Buffer.from(data);
        }
        else if (typeof data === 'string') {
            this.buffer = Buffer.from(data, 'utf8');
        }
        else {
            this.buffer = Buffer.alloc(0);
        }
    }
    get length() {
        return this.buffer.length;
    }
    get bytesAvailable() {
        return this.buffer.length - this.position;
    }
    readByte() {
        if (this.position >= this.buffer.length)
            throw new Error('End of buffer');
        return this.buffer.readInt8(this.position++);
    }
    readUnsignedByte() {
        if (this.position >= this.buffer.length)
            throw new Error('End of buffer');
        return this.buffer.readUInt8(this.position++);
    }
    readInt() {
        if (this.position + 4 > this.buffer.length)
            throw new Error('End of buffer');
        const value = this.buffer.readInt32BE(this.position);
        this.position += 4;
        return value;
    }
    readUTF() {
        const length = this.readUnsignedShort();
        if (this.position + length > this.buffer.length)
            throw new Error('End of buffer');
        const value = this.buffer.toString('utf8', this.position, this.position + length);
        this.position += length;
        return value;
    }
    writeByte(value) {
        this.ensureCapacity(1);
        this.buffer.writeInt8(value, this.position++);
    }
    writeInt(value) {
        this.ensureCapacity(4);
        this.buffer.writeInt32BE(value, this.position);
        this.position += 4;
    }
    writeUTF(value) {
        const utf8Buffer = Buffer.from(value, 'utf8');
        this.writeUnsignedShort(utf8Buffer.length);
        this.ensureCapacity(utf8Buffer.length);
        utf8Buffer.copy(this.buffer, this.position);
        this.position += utf8Buffer.length;
    }
    readUnsignedShort() {
        if (this.position + 2 > this.buffer.length)
            throw new Error('End of buffer');
        const value = this.buffer.readUInt16BE(this.position);
        this.position += 2;
        return value;
    }
    writeUnsignedShort(value) {
        this.ensureCapacity(2);
        this.buffer.writeUInt16BE(value, this.position);
        this.position += 2;
    }
    ensureCapacity(additional) {
        const needed = this.position + additional;
        if (needed > this.buffer.length) {
            const newBuffer = Buffer.alloc(Math.max(needed, this.buffer.length * 2));
            this.buffer.copy(newBuffer);
            this.buffer = newBuffer;
        }
    }
    toString() {
        return this.buffer.toString('utf8');
    }
    toBuffer() {
        return this.buffer;
    }
}
exports.ByteArray = ByteArray;
//# sourceMappingURL=Utils.js.map