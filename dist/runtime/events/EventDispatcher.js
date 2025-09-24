
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
exports.EventType = exports.EventDispatcher = exports.Event = void 0;
const events_1 = require("events");
/**
 * AS3-style Event class
 */
class Event {
    constructor(type, bubbles = false, cancelable = false, data = null) {
        this.type = type;
        this.bubbles = bubbles;
        this.cancelable = cancelable;
        this.data = data;
    }
    preventDefault() {
        // Implementation for event prevention
    }
    stopPropagation() {
        // Implementation for stopping event propagation
    }
}
exports.Event = Event;
/**
 * AS3-style EventDispatcher wrapping Node.js EventEmitter
 */
class EventDispatcher extends events_1.EventEmitter {
    constructor() {
        super();
    }
    /**
     * AS3-style addEventListener
     */
    addEventListener(type, listener, useCapture = false, priority = 0) {
        this.on(type, listener);
    }
    /**
     * AS3-style removeEventListener
     */
    removeEventListener(type, listener, useCapture = false) {
        this.off(type, listener);
    }
    /**
     * AS3-style dispatchEvent
     */
    dispatchEvent(event) {
        event.target = this;
        event.currentTarget = this;
        this.emit(event.type, event);
        return true;
    }
    /**
     * AS3-style hasEventListener
     */
    hasEventListener(type) {
        return this.listenerCount(type) > 0;
    }
    /**
     * Convenience method to dispatch a simple event
     */
    dispatchSimpleEvent(type, data = null) {
        const event = new Event(type, false, false, data);
        return this.dispatchEvent(event);
    }
}
exports.EventDispatcher = EventDispatcher;
/**
 * Common event types (AS3-style constants)
 */
class EventType {
}
exports.EventType = EventType;
EventType.ADDED = 'added';
EventType.REMOVED = 'removed';
EventType.COMPLETE = 'complete';
EventType.ERROR = 'error';
EventType.CHANGE = 'change';
EventType.SELECT = 'select';
EventType.CLICK = 'click';
EventType.TIMER = 'timer';
EventType.TIMER_COMPLETE = 'timerComplete';
//# sourceMappingURL=EventDispatcher.js.map