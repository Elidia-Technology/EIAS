
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
 * AS3-style Timer class wrapping setInterval/setTimeout
 */
export declare class Timer extends EventDispatcher {
    private delay;
    private repeatCount;
    private currentCount;
    private timerId;
    private running;
    constructor(delay: number, repeatCount?: number);
    /**
     * Start the timer
     */
    start(): void;
    /**
     * Stop the timer
     */
    stop(): void;
    /**
     * Reset the timer
     */
    reset(): void;
    /**
     * Get current count
     */
    getCurrentCount(): number;
    /**
     * Check if timer is running
     */
    isRunning(): boolean;
}
/**
 * AS3-style trace function with enhanced logging
 */
export declare function trace(...args: any[]): void;
/**
 * AS3-style Math utilities
 */
export declare class MathUtils {
    static readonly PI: number;
    static readonly E: number;
    static abs(value: number): number;
    static max(value1: number, value2: number): number;
    static min(value1: number, value2: number): number;
    static round(value: number): number;
    static floor(value: number): number;
    static ceil(value: number): number;
    static random(): number;
    static sin(value: number): number;
    static cos(value: number): number;
    static tan(value: number): number;
    static atan2(y: number, x: number): number;
    static sqrt(value: number): number;
    static pow(base: number, exponent: number): number;
}
/**
 * AS3-style ByteArray mapped to Node.js Buffer
 */
export declare class ByteArray {
    private buffer;
    private position;
    constructor(data?: Buffer | Uint8Array | string);
    get length(): number;
    get bytesAvailable(): number;
    readByte(): number;
    readUnsignedByte(): number;
    readInt(): number;
    readUTF(): string;
    writeByte(value: number): void;
    writeInt(value: number): void;
    writeUTF(value: string): void;
    private readUnsignedShort;
    private writeUnsignedShort;
    private ensureCapacity;
    toString(): string;
    toBuffer(): Buffer;
}
//# sourceMappingURL=Utils.d.ts.map