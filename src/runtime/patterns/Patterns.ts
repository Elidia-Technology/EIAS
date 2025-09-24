
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
/**
 * Singleton pattern base class
 */
export abstract class Singleton {
    private static instances: Map<string, Singleton> = new Map();

    constructor() {
        const className = this.constructor.name;
        if (Singleton.instances.has(className)) {
            return Singleton.instances.get(className)!;
        }
        Singleton.instances.set(className, this);
    }

    public static getInstance<T extends Singleton>(this: new () => T): T {
        const className = this.name;
        if (!Singleton.instances.has(className)) {
            new this();
        }
        return Singleton.instances.get(className) as T;
    }
}

/**
 * Factory pattern base class
 */
export abstract class Factory<T> {
    protected registry: Map<string, new (...args: any[]) => T> = new Map();

    public register(key: string, constructor: new (...args: any[]) => T): void {
        this.registry.set(key, constructor);
    }

    public create(key: string, ...args: any[]): T {
        const Constructor = this.registry.get(key);
        if (!Constructor) {
            throw new Error(`No constructor registered for key: ${key}`);
        }
        return new Constructor(...args);
    }

    public hasType(key: string): boolean {
        return this.registry.has(key);
    }

    public getRegisteredTypes(): string[] {
        return Array.from(this.registry.keys());
    }
}

/**
 * Observer pattern interfaces and base class
 */
export interface IObserver {
    update(subject: ISubject, data?: any): void;
}

export interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(data?: any): void;
}

export class Subject implements ISubject {
    private observers: IObserver[] = [];

    public attach(observer: IObserver): void {
        const exists = this.observers.includes(observer);
        if (!exists) {
            this.observers.push(observer);
        }
    }

    public detach(observer: IObserver): void {
        const index = this.observers.indexOf(observer);
        if (index > -1) {
            this.observers.splice(index, 1);
        }
    }

    public notify(data?: any): void {
        for (const observer of this.observers) {
            observer.update(this, data);
        }
    }
}

/**
 * Strategy pattern base class
 */
export interface IStrategy<T = any, R = any> {
    execute(context: T): R;
}

export class Context<T = any, R = any> {
    private strategy: IStrategy<T, R>;

    constructor(strategy: IStrategy<T, R>) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: IStrategy<T, R>): void {
        this.strategy = strategy;
    }

    public executeStrategy(data: T): R {
        return this.strategy.execute(data);
    }
}

/**
 * Command pattern interfaces and base classes
 */
export interface ICommand {
    execute(): void;
    undo?(): void;
    canUndo?(): boolean;
}

export class CommandInvoker {
    private history: ICommand[] = [];
    private currentIndex: number = -1;

    public execute(command: ICommand): void {
        // Remove any commands after current index (for redo functionality)
        this.history = this.history.slice(0, this.currentIndex + 1);
        
        command.execute();
        this.history.push(command);
        this.currentIndex++;
    }

    public undo(): boolean {
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

    public redo(): boolean {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            const command = this.history[this.currentIndex];
            command.execute();
            return true;
        }
        return false;
    }

    public canUndo(): boolean {
        return this.currentIndex >= 0;
    }

    public canRedo(): boolean {
        return this.currentIndex < this.history.length - 1;
    }
}

/**
 * Decorator pattern utility functions
 */
export function log(target: any, propertyName: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;

    descriptor.value = function (...args: any[]) {
        console.log(`Calling ${propertyName} with arguments:`, args);
        const result = method.apply(this, args);
        console.log(`${propertyName} returned:`, result);
        return result;
    };
}

export function cache(target: any, propertyName: string, descriptor: PropertyDescriptor): void {
    const method = descriptor.value;
    const cacheMap = new Map();

    descriptor.value = function (...args: any[]) {
        const key = JSON.stringify(args);
        if (cacheMap.has(key)) {
            return cacheMap.get(key);
        }
        
        const result = method.apply(this, args);
        cacheMap.set(key, result);
        return result;
    };
}

export function timeout(ms: number) {
    return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
        const method = descriptor.value;

        descriptor.value = function (...args: any[]) {
            return Promise.race([
                method.apply(this, args),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error(`Method ${propertyName} timed out after ${ms}ms`)), ms)
                )
            ]);
        };
    };
}

/**
 * Facade pattern base class
 */
export abstract class Facade {
    protected services: Map<string, any> = new Map();

    protected addService(name: string, service: any): void {
        this.services.set(name, service);
    }

    protected getService<T>(name: string): T {
        const service = this.services.get(name);
        if (!service) {
            throw new Error(`Service ${name} not found`);
        }
        return service as T;
    }
}

/**
 * Adapter pattern base class
 */
export abstract class Adapter<TTarget, TAdaptee> {
    protected adaptee: TAdaptee;

    constructor(adaptee: TAdaptee) {
        this.adaptee = adaptee;
    }

    public abstract adapt(): TTarget;
}
