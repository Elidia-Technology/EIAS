
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
export class SharedObject extends EventDispatcher {
    private name: string;
    private data: any = {};
    private localPath: string;
    private dirty: boolean = false;

    private static instances: Map<string, SharedObject> = new Map();

    private constructor(name: string, localPath: string = '/') {
        super();
        this.name = name;
        this.localPath = localPath;
        this.load();
    }

    /**
     * Get local shared object (AS3-style factory method)
     */
    public static getLocal(name: string, localPath: string = '/'): SharedObject {
        const key = `${localPath}/${name}`;
        
        if (!SharedObject.instances.has(key)) {
            SharedObject.instances.set(key, new SharedObject(name, localPath));
        }
        
        return SharedObject.instances.get(key)!;
    }

    /**
     * Get/set data property
     */
    public get data(): any {
        return this.data;
    }

    public set data(value: any) {
        this.data = value;
        this.dirty = true;
    }

    /**
     * Load data from storage
     */
    private load(): void {
        try {
            if (this.isNodeEnvironment()) {
                this.loadFromFile();
            } else {
                this.loadFromBrowser();
            }
        } catch (error) {
            console.warn(`Failed to load SharedObject ${this.name}:`, error);
            this.data = {};
        }
    }

    /**
     * Save data to storage
     */
    public flush(minDiskSpace?: number): string {
        try {
            if (this.isNodeEnvironment()) {
                this.saveToFile();
            } else {
                this.saveToBrowser();
            }
            
            this.dirty = false;
            this.dispatchSimpleEvent('flush', { success: true });
            return 'flushed';
        } catch (error) {
            this.dispatchSimpleEvent('flush', { success: false, error: error.message });
            return 'error';
        }
    }

    /**
     * Clear stored data
     */
    public clear(): void {
        this.data = {};
        this.dirty = true;
        
        try {
            if (this.isNodeEnvironment()) {
                this.deleteFile();
            } else {
                this.clearFromBrowser();
            }
        } catch (error) {
            console.warn(`Failed to clear SharedObject ${this.name}:`, error);
        }
    }

    /**
     * Close shared object
     */
    public close(): void {
        if (this.dirty) {
            this.flush();
        }
        SharedObject.instances.delete(`${this.localPath}/${this.name}`);
    }

    /**
     * Get object size in bytes (approximate)
     */
    public get size(): number {
        return JSON.stringify(this.data).length;
    }

    /**
     * Check if running in Node.js environment
     */
    private isNodeEnvironment(): boolean {
        return typeof window === 'undefined' && typeof process !== 'undefined';
    }

    /**
     * Load data from file system (Node.js)
     */
    private loadFromFile(): void {
        const fs = require('fs');
        const path = require('path');
        const os = require('os');
        
        const dataDir = path.join(os.homedir(), '.as4', 'sharedobjects', this.localPath);
        const filePath = path.join(dataDir, `${this.name}.json`);
        
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            this.data = JSON.parse(content);
        }
    }

    /**
     * Save data to file system (Node.js)
     */
    private saveToFile(): void {
        const fs = require('fs');
        const path = require('path');
        const os = require('os');
        
        const dataDir = path.join(os.homedir(), '.as4', 'sharedobjects', this.localPath);
        const filePath = path.join(dataDir, `${this.name}.json`);
        
        // Ensure directory exists
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        
        // Write data
        fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2));
    }

    /**
     * Delete file (Node.js)
     */
    private deleteFile(): void {
        const fs = require('fs');
        const path = require('path');
        const os = require('os');
        
        const dataDir = path.join(os.homedir(), '.as4', 'sharedobjects', this.localPath);
        const filePath = path.join(dataDir, `${this.name}.json`);
        
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }

    /**
     * Load data from browser storage
     */
    private loadFromBrowser(): void {
        const key = `as4_so_${this.localPath}_${this.name}`;
        
        // Try localStorage first
        if (typeof localStorage !== 'undefined') {
            const stored = localStorage.getItem(key);
            if (stored) {
                this.data = JSON.parse(stored);
                return;
            }
        }
        
        // Fallback to sessionStorage
        if (typeof sessionStorage !== 'undefined') {
            const stored = sessionStorage.getItem(key);
            if (stored) {
                this.data = JSON.parse(stored);
            }
        }
    }

    /**
     * Save data to browser storage
     */
    private saveToBrowser(): void {
        const key = `as4_so_${this.localPath}_${this.name}`;
        const dataStr = JSON.stringify(this.data);
        
        // Try localStorage first
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(key, dataStr);
                return;
            } catch (error) {
                // localStorage might be full or disabled
            }
        }
        
        // Fallback to sessionStorage
        if (typeof sessionStorage !== 'undefined') {
            try {
                sessionStorage.setItem(key, dataStr);
            } catch (error) {
                throw new Error('Unable to save to browser storage');
            }
        } else {
            throw new Error('Browser storage not available');
        }
    }

    /**
     * Clear data from browser storage
     */
    private clearFromBrowser(): void {
        const key = `as4_so_${this.localPath}_${this.name}`;
        
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
        
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(key);
        }
    }
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

export abstract class Database extends EventDispatcher {
    protected config: DatabaseConfig;
    protected connected: boolean = false;

    constructor(config: DatabaseConfig) {
        super();
        this.config = config;
    }

    public abstract connect(): Promise<void>;
    public abstract disconnect(): Promise<void>;
    public abstract get(key: string): Promise<any>;
    public abstract set(key: string, value: any): Promise<void>;
    public abstract delete(key: string): Promise<void>;
    public abstract query(sql: string, params?: any[]): Promise<any>;
}

/**
 * SQLite database implementation
 */
export class SQLiteDatabase extends Database {
    private db: any = null;

    constructor(config: DatabaseConfig) {
        super(config);
    }

    public async connect(): Promise<void> {
        try {
            const sqlite3 = require('sqlite3').verbose();
            const dbPath = this.config.connectionString || ':memory:';
            
            this.db = new sqlite3.Database(dbPath);
            this.connected = true;
            
            // Create key-value table if it doesn't exist
            await this.query(`
                CREATE TABLE IF NOT EXISTS key_value (
                    key TEXT PRIMARY KEY,
                    value TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            
            this.dispatchSimpleEvent('connect', null);
        } catch (error) {
            this.dispatchSimpleEvent('error', { error: error.message });
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.connected = false;
            this.dispatchSimpleEvent('disconnect', null);
        }
    }

    public async get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT value FROM key_value WHERE key = ?', [key], (err: any, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? JSON.parse(row.value) : null);
                }
            });
        });
    }

    public async set(key: string, value: any): Promise<void> {
        const jsonValue = JSON.stringify(value);
        return new Promise((resolve, reject) => {
            this.db.run(
                'INSERT OR REPLACE INTO key_value (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
                [key, jsonValue],
                (err: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    public async delete(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM key_value WHERE key = ?', [key], (err: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public async query(sql: string, params: any[] = []): Promise<any> {
        return new Promise((resolve, reject) => {
            if (sql.toLowerCase().trim().startsWith('select')) {
                this.db.all(sql, params, (err: any, rows: any) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            } else {
                this.db.run(sql, params, function(err: any) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ lastID: this.lastID, changes: this.changes });
                    }
                });
            }
        });
    }
}

/**
 * Storage utility functions
 */
export class StorageUtils {
    /**
     * Clear all AS4 shared objects
     */
    public static clearAllSharedObjects(): void {
        if (typeof window !== 'undefined') {
            // Browser environment
            const keys: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('as4_so_')) {
                    keys.push(key);
                }
            }
            keys.forEach(key => localStorage.removeItem(key));
        } else {
            // Node.js environment
            try {
                const fs = require('fs');
                const path = require('path');
                const os = require('os');
                
                const dataDir = path.join(os.homedir(), '.as4', 'sharedobjects');
                if (fs.existsSync(dataDir)) {
                    fs.rmSync(dataDir, { recursive: true, force: true });
                }
            } catch (error) {
                console.warn('Failed to clear shared objects:', error);
            }
        }
    }

    /**
     * Get storage usage information
     */
    public static getStorageInfo(): any {
        if (typeof window !== 'undefined') {
            // Browser environment
            let totalSize = 0;
            let count = 0;
            
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('as4_so_')) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        totalSize += value.length;
                        count++;
                    }
                }
            }
            
            return { totalSize, count, type: 'localStorage' };
        } else {
            // Node.js environment
            try {
                const fs = require('fs');
                const path = require('path');
                const os = require('os');
                
                const dataDir = path.join(os.homedir(), '.as4', 'sharedobjects');
                let totalSize = 0;
                let count = 0;
                
                if (fs.existsSync(dataDir)) {
                    const files = fs.readdirSync(dataDir, { recursive: true });
                    for (const file of files) {
                        if (typeof file === 'string' && file.endsWith('.json')) {
                            const filePath = path.join(dataDir, file);
                            const stats = fs.statSync(filePath);
                            totalSize += stats.size;
                            count++;
                        }
                    }
                }
                
                return { totalSize, count, type: 'filesystem' };
            } catch (error) {
                return { totalSize: 0, count: 0, type: 'filesystem', error: error.message };
            }
        }
    }
}
