
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
 * AS3-style SharedObject for persistent data storage
 * Node.js implementation using file system, browser uses localStorage/IndexedDB
 */
export declare class SharedObject extends EventDispatcher {
    private name;
    private data;
    private localPath;
    private dirty;
    private static instances;
    private constructor();
    /**
     * Get local shared object (AS3-style factory method)
     */
    static getLocal(name: string, localPath?: string): SharedObject;
    /**
     * Get/set data property
     */
    get data(): any;
    set data(value: any);
    /**
     * Load data from storage
     */
    private load;
    /**
     * Save data to storage
     */
    flush(minDiskSpace?: number): string;
    /**
     * Clear stored data
     */
    clear(): void;
    /**
     * Close shared object
     */
    close(): void;
    /**
     * Get object size in bytes (approximate)
     */
    get size(): number;
    /**
     * Check if running in Node.js environment
     */
    private isNodeEnvironment;
    /**
     * Load data from file system (Node.js)
     */
    private loadFromFile;
    /**
     * Save data to file system (Node.js)
     */
    private saveToFile;
    /**
     * Delete file (Node.js)
     */
    private deleteFile;
    /**
     * Load data from browser storage
     */
    private loadFromBrowser;
    /**
     * Save data to browser storage
     */
    private saveToBrowser;
    /**
     * Clear data from browser storage
     */
    private clearFromBrowser;
}
/**
 * Database wrapper classes for optional database integration
 */
export interface DatabaseConfig {
    type: 'sqlite' | 'redis' | 'postgres' | 'mongo';
    connectionString?: string;
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
}
export declare abstract class Database extends EventDispatcher {
    protected config: DatabaseConfig;
    protected connected: boolean;
    constructor(config: DatabaseConfig);
    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;
    abstract get(key: string): Promise<any>;
    abstract set(key: string, value: any): Promise<void>;
    abstract delete(key: string): Promise<void>;
    abstract query(sql: string, params?: any[]): Promise<any>;
}
/**
 * SQLite database implementation
 */
export declare class SQLiteDatabase extends Database {
    private db;
    constructor(config: DatabaseConfig);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    delete(key: string): Promise<void>;
    query(sql: string, params?: any[]): Promise<any>;
}
/**
 * Storage utility functions
 */
export declare class StorageUtils {
    /**
     * Clear all AS4 shared objects
     */
    static clearAllSharedObjects(): void;
    /**
     * Get storage usage information
     */
    static getStorageInfo(): any;
}
//# sourceMappingURL=Storage.d.ts.map