
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
exports.Adapter = exports.Facade = exports.CommandInvoker = exports.Context = exports.Subject = exports.Factory = exports.Singleton = void 0;
exports.log = log;
exports.cache = cache;
exports.timeout = timeout;
/**
 * Singleton pattern base class
 */
class Singleton {
    constructor() {
        const className = this.constructor.name;
        if (Singleton.instances.has(className)) {
            return Singleton.instances.get(className);
        }
        Singleton.instances.set(className, this);
    }
    static getInstance() {
        const className = this.name;
        if (!Singleton.instances.has(className)) {
            new this();
        }
        return Singleton.instances.get(className);
    }
}
exports.Singleton = Singleton;
Singleton.instances = new Map();
/**
 * Factory pattern base class
 */
class Factory {
    constructor() {
        this.registry = new Map();
    }
    register(key, constructor) {
        this.registry.set(key, constructor);
    }
    create(key, ...args) {
        const Constructor = this.registry.get(key);
        if (!Constructor) {
            throw new Error(`No constructor registered for key: ${key}`);
        }
        return new Constructor(...args);
    }
    hasType(key) {
        return this.registry.has(key);
    }
    getRegisteredTypes() {
        return Array.from(this.registry.keys());
    }
}
exports.Factory = Factory;
class Subject {
    constructor() {
        this.observers = [];
    }
    attach(observer) {
        const exists = this.observers.includes(observer);
        if (!exists) {
            this.observers.push(observer);
        }
    }
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }
    notify(data) {
        for (const observer of this.observers) {
            observer.update(this, data);
        }
    }
}
exports.Subject = Subject;
class Context {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    executeStrategy(data) {
        return this.strategy.execute(data);
    }
}
exports.Context = Context;
class CommandInvoker {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
    }
    execute(command) {
        // Remove any commands after current index (for redo functionality)
        this.history = this.history.slice(0, this.currentIndex + 1);
        command.execute();
        this.history.push(command);
        this.currentIndex++;
    }
    undo() {
        if (this.currentIndex >= 0) {
            const command = this.history[this.currentIndex];
            if (command.undo && command.canUndo?.() !== false) {
                command.undo();
                this.currentIndex--;
                return true;
            }
        }
        return false;
    }
    redo() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            const command = this.history[this.currentIndex];
            command.execute();
            return true;
        }
        return false;
    }
    canUndo() {
        return this.currentIndex >= 0;
    }
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }
}
exports.CommandInvoker = CommandInvoker;
/**
 * Decorator pattern utility functions
 */
function log(target, propertyName, descriptor) {
    const method = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Calling ${propertyName} with arguments:`, args);
        const result = method.apply(this, args);
        console.log(`${propertyName} returned:`, result);
        return result;
    };
}
function cache(target, propertyName, descriptor) {
    const method = descriptor.value;
    const cacheMap = new Map();
    descriptor.value = function (...args) {
        const key = JSON.stringify(args);
        if (cacheMap.has(key)) {
            return cacheMap.get(key);
        }
        const result = method.apply(this, args);
        cacheMap.set(key, result);
        return result;
    };
}
function timeout(ms) {
    return function (target, propertyName, descriptor) {
        const method = descriptor.value;
        descriptor.value = function (...args) {
            return Promise.race([
                method.apply(this, args),
                new Promise((_, reject) => setTimeout(() => reject(new Error(`Method ${propertyName} timed out after ${ms}ms`)), ms))
            ]);
        };
    };
}
/**
 * Facade pattern base class
 */
class Facade {
    constructor() {
        this.services = new Map();
    }
    addService(name, service) {
        this.services.set(name, service);
    }
    getService(name) {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }
        return service;
    }
}
exports.Facade = Facade;
/**
 * Adapter pattern base class
 */
class Adapter {
    constructor(adaptee) {
        this.adaptee = adaptee;
    }
}
exports.Adapter = Adapter;
//# sourceMappingURL=Patterns.js.map