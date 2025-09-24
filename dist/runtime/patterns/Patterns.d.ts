
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
export declare abstract class Singleton {
    private static instances;
    constructor();
    static getInstance<T extends Singleton>(this: new () => T): T;
}
/**
 * Factory pattern base class
 */
export declare abstract class Factory<T> {
    protected registry: Map<string, new (...args: any[]) => T>;
    register(key: string, constructor: new (...args: any[]) => T): void;
    create(key: string, ...args: any[]): T;
    hasType(key: string): boolean;
    getRegisteredTypes(): string[];
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
export declare class Subject implements ISubject {
    private observers;
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(data?: any): void;
}
/**
 * Strategy pattern base class
 */
export interface IStrategy<T = any, R = any> {
    execute(context: T): R;
}
export declare class Context<T = any, R = any> {
    private strategy;
    constructor(strategy: IStrategy<T, R>);
    setStrategy(strategy: IStrategy<T, R>): void;
    executeStrategy(data: T): R;
}
/**
 * Command pattern interfaces and base classes
 */
export interface ICommand {
    execute(): void;
    undo?(): void;
    canUndo?(): boolean;
}
export declare class CommandInvoker {
    private history;
    private currentIndex;
    execute(command: ICommand): void;
    undo(): boolean;
    redo(): boolean;
    canUndo(): boolean;
    canRedo(): boolean;
}
/**
 * Decorator pattern utility functions
 */
export declare function log(target: any, propertyName: string, descriptor: PropertyDescriptor): void;
export declare function cache(target: any, propertyName: string, descriptor: PropertyDescriptor): void;
export declare function timeout(ms: number): (target: any, propertyName: string, descriptor: PropertyDescriptor) => void;
/**
 * Facade pattern base class
 */
export declare abstract class Facade {
    protected services: Map<string, any>;
    protected addService(name: string, service: any): void;
    protected getService<T>(name: string): T;
}
/**
 * Adapter pattern base class
 */
export declare abstract class Adapter<TTarget, TAdaptee> {
    protected adaptee: TAdaptee;
    constructor(adaptee: TAdaptee);
    abstract adapt(): TTarget;
}
//# sourceMappingURL=Patterns.d.ts.map