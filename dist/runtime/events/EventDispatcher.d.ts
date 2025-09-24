
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
import { EventEmitter } from 'events';
/**
 * AS3-style Event class
 */
export declare class Event {
    type: string;
    target: any;
    currentTarget: any;
    bubbles: boolean;
    cancelable: boolean;
    data: any;
    constructor(type: string, bubbles?: boolean, cancelable?: boolean, data?: any);
    preventDefault(): void;
    stopPropagation(): void;
}
/**
 * AS3-style EventDispatcher wrapping Node.js EventEmitter
 */
export declare class EventDispatcher extends EventEmitter {
    constructor();
    /**
     * AS3-style addEventListener
     */
    addEventListener(type: string, listener: (event: Event) => void, useCapture?: boolean, priority?: number): void;
    /**
     * AS3-style removeEventListener
     */
    removeEventListener(type: string, listener: (event: Event) => void, useCapture?: boolean): void;
    /**
     * AS3-style dispatchEvent
     */
    dispatchEvent(event: Event): boolean;
    /**
     * AS3-style hasEventListener
     */
    hasEventListener(type: string): boolean;
    /**
     * Convenience method to dispatch a simple event
     */
    dispatchSimpleEvent(type: string, data?: any): boolean;
}
/**
 * Common event types (AS3-style constants)
 */
export declare class EventType {
    static readonly ADDED: string;
    static readonly REMOVED: string;
    static readonly COMPLETE: string;
    static readonly ERROR: string;
    static readonly CHANGE: string;
    static readonly SELECT: string;
    static readonly CLICK: string;
    static readonly TIMER: string;
    static readonly TIMER_COMPLETE: string;
}
//# sourceMappingURL=EventDispatcher.d.ts.map