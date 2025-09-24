
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
export class Event {
    public type: string;
    public target: any;
    public currentTarget: any;
    public bubbles: boolean;
    public cancelable: boolean;
    public data: any;

    constructor(type: string, bubbles: boolean = false, cancelable: boolean = false, data: any = null) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.data = data;
    }

    public preventDefault(): void {
        // Implementation for event prevention
    }

    public stopPropagation(): void {
        // Implementation for stopping event propagation
    }
}

/**
 * AS3-style EventDispatcher wrapping Node.js EventEmitter
 */
export class EventDispatcher extends EventEmitter {
    constructor() {
        super();
    }

    /**
     * AS3-style addEventListener
     */
    public addEventListener(type: string, listener: (event: Event) => void, useCapture: boolean = false, priority: number = 0): void {
        this.on(type, listener);
    }

    /**
     * AS3-style removeEventListener
     */
    public removeEventListener(type: string, listener: (event: Event) => void, useCapture: boolean = false): void {
        this.off(type, listener);
    }

    /**
     * AS3-style dispatchEvent
     */
    public dispatchEvent(event: Event): boolean {
        event.target = this;
        event.currentTarget = this;
        this.emit(event.type, event);
        return true;
    }

    /**
     * AS3-style hasEventListener
     */
    public hasEventListener(type: string): boolean {
        return this.listenerCount(type) > 0;
    }

    /**
     * Convenience method to dispatch a simple event
     */
    public dispatchSimpleEvent(type: string, data: any = null): boolean {
        const event = new Event(type, false, false, data);
        return this.dispatchEvent(event);
    }
}

/**
 * Common event types (AS3-style constants)
 */
export class EventType {
    public static readonly ADDED: string = 'added';
    public static readonly REMOVED: string = 'removed';
    public static readonly COMPLETE: string = 'complete';
    public static readonly ERROR: string = 'error';
    public static readonly CHANGE: string = 'change';
    public static readonly SELECT: string = 'select';
    public static readonly CLICK: string = 'click';
    public static readonly TIMER: string = 'timer';
    public static readonly TIMER_COMPLETE: string = 'timerComplete';
}
