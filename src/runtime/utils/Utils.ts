
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
import { EventDispatcher, Event, EventType } from '../events/EventDispatcher';

/**
 * AS3-style Timer class wrapping setInterval/setTimeout
 */
export class Timer extends EventDispatcher {
    private delay: number;
    private repeatCount: number;
    private currentCount: number = 0;
    private timerId: NodeJS.Timeout | null = null;
    private running: boolean = false;

    constructor(delay: number, repeatCount: number = 0) {
        super();
        this.delay = delay;
        this.repeatCount = repeatCount;
    }

    /**
     * Start the timer
     */
    public start(): void {
        if (this.running) return;

        this.running = true;
        this.timerId = setInterval(() => {
            this.currentCount++;
            this.dispatchSimpleEvent(EventType.TIMER, { currentCount: this.currentCount });

            if (this.repeatCount > 0 && this.currentCount >= this.repeatCount) {
                this.stop();
                this.dispatchSimpleEvent(EventType.TIMER_COMPLETE, { currentCount: this.currentCount });
            }
        }, this.delay);
    }

    /**
     * Stop the timer
     */
    public stop(): void {
        if (!this.running) return;

        this.running = false;
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    /**
     * Reset the timer
     */
    public reset(): void {
        this.stop();
        this.currentCount = 0;
    }

    /**
     * Get current count
     */
    public getCurrentCount(): number {
        return this.currentCount;
    }

    /**
     * Check if timer is running
     */
    public isRunning(): boolean {
        return this.running;
    }
}

/**
 * AS3-style trace function with enhanced logging
 */
export function trace(...args: any[]): void {
    const stack = new Error().stack;
    const caller = stack?.split('\n')[2]?.trim() || 'unknown';
    const timestamp = new Date().toISOString();
    
    console.log(`[${timestamp}] [${caller}]`, ...args);
}

/**
 * AS3-style Math utilities
 */
export class MathUtils {
    public static readonly PI: number = Math.PI;
    public static readonly E: number = Math.E;

    public static abs(value: number): number {
        return Math.abs(value);
    }

    public static max(value1: number, value2: number): number {
        return Math.max(value1, value2);
    }

    public static min(value1: number, value2: number): number {
        return Math.min(value1, value2);
    }

    public static round(value: number): number {
        return Math.round(value);
    }

    public static floor(value: number): number {
        return Math.floor(value);
    }

    public static ceil(value: number): number {
        return Math.ceil(value);
    }

    public static random(): number {
        return Math.random();
    }

    public static sin(value: number): number {
        return Math.sin(value);
    }

    public static cos(value: number): number {
        return Math.cos(value);
    }

    public static tan(value: number): number {
        return Math.tan(value);
    }

    public static atan2(y: number, x: number): number {
        return Math.atan2(y, x);
    }

    public static sqrt(value: number): number {
        return Math.sqrt(value);
    }

    public static pow(base: number, exponent: number): number {
        return Math.pow(base, exponent);
    }
}

/**
 * AS3-style ByteArray mapped to Node.js Buffer
 */
export class ByteArray {
    private buffer: Buffer;
    private position: number = 0;

    constructor(data?: Buffer | Uint8Array | string) {
        if (data instanceof Buffer) {
            this.buffer = data;
        } else if (data instanceof Uint8Array) {
            this.buffer = Buffer.from(data);
        } else if (typeof data === 'string') {
            this.buffer = Buffer.from(data, 'utf8');
        } else {
            this.buffer = Buffer.alloc(0);
        }
    }

    public get length(): number {
        return this.buffer.length;
    }

    public get bytesAvailable(): number {
        return this.buffer.length - this.position;
    }

    public readByte(): number {
        if (this.position >= this.buffer.length) throw new Error('End of buffer');
        return this.buffer.readInt8(this.position++);
    }

    public readUnsignedByte(): number {
        if (this.position >= this.buffer.length) throw new Error('End of buffer');
        return this.buffer.readUInt8(this.position++);
    }

    public readInt(): number {
        if (this.position + 4 > this.buffer.length) throw new Error('End of buffer');
        const value = this.buffer.readInt32BE(this.position);
        this.position += 4;
        return value;
    }

    public readUTF(): string {
        const length = this.readUnsignedShort();
        if (this.position + length > this.buffer.length) throw new Error('End of buffer');
        const value = this.buffer.toString('utf8', this.position, this.position + length);
        this.position += length;
        return value;
    }

    public writeByte(value: number): void {
        this.ensureCapacity(1);
        this.buffer.writeInt8(value, this.position++);
    }

    public writeInt(value: number): void {
        this.ensureCapacity(4);
        this.buffer.writeInt32BE(value, this.position);
        this.position += 4;
    }

    public writeUTF(value: string): void {
        const utf8Buffer = Buffer.from(value, 'utf8');
        this.writeUnsignedShort(utf8Buffer.length);
        this.ensureCapacity(utf8Buffer.length);
        utf8Buffer.copy(this.buffer, this.position);
        this.position += utf8Buffer.length;
    }

    private readUnsignedShort(): number {
        if (this.position + 2 > this.buffer.length) throw new Error('End of buffer');
        const value = this.buffer.readUInt16BE(this.position);
        this.position += 2;
        return value;
    }

    private writeUnsignedShort(value: number): void {
        this.ensureCapacity(2);
        this.buffer.writeUInt16BE(value, this.position);
        this.position += 2;
    }

    private ensureCapacity(additional: number): void {
        const needed = this.position + additional;
        if (needed > this.buffer.length) {
            const newBuffer = Buffer.alloc(Math.max(needed, this.buffer.length * 2));
            this.buffer.copy(newBuffer);
            this.buffer = newBuffer;
        }
    }

    public toString(): string {
        return this.buffer.toString('utf8');
    }

    public toBuffer(): Buffer {
        return this.buffer;
    }
}
