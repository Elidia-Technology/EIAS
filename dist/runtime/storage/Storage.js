
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
exports.StorageUtils = exports.SQLiteDatabase = exports.Database = exports.SharedObject = void 0;
const EventDispatcher_1 = require("../events/EventDispatcher");
/**
 * AS3-style SharedObject for persistent data storage
 * Node.js implementation using file system, browser uses localStorage/IndexedDB
 */
class SharedObject extends EventDispatcher_1.EventDispatcher {
    constructor(name, localPath = '/') {
        super();
        this.data = {};
        this.dirty = false;
        this.name = name;
        this.localPath = localPath;
        this.load();
    }
    /**
     * Get local shared object (AS3-style factory method)
     */
    static getLocal(name, localPath = '/') {
        const key = `${localPath}/${name}`;
        if (!SharedObject.instances.has(key)) {
            SharedObject.instances.set(key, new SharedObject(name, localPath));
        }
        return SharedObject.instances.get(key);
    }
    /**
     * Get/set data property
     */
    get data() {
        return this.data;
    }
    set data(value) {
        this.data = value;
        this.dirty = true;
    }
    /**
     * Load data from storage
     */
    load() {
        try {
            if (this.isNodeEnvironment()) {
                this.loadFromFile();
            }
            else {
                this.loadFromBrowser();
            }
        }
        catch (error) {
            console.warn(`Failed to load SharedObject ${this.name}:`, error);
            this.data = {};
        }
    }
    /**
     * Save data to storage
     */
    flush(minDiskSpace) {
        try {
            if (this.isNodeEnvironment()) {
                this.saveToFile();
            }
            else {
                this.saveToBrowser();
            }
            this.dirty = false;
            this.dispatchSimpleEvent('flush', { success: true });
            return 'flushed';
        }
        catch (error) {
            this.dispatchSimpleEvent('flush', { success: false, error: error.message });
            return 'error';
        }
    }
    /**
     * Clear stored data
     */
    clear() {
        this.data = {};
        this.dirty = true;
        try {
            if (this.isNodeEnvironment()) {
                this.deleteFile();
            }
            else {
                this.clearFromBrowser();
            }
        }
        catch (error) {
            console.warn(`Failed to clear SharedObject ${this.name}:`, error);
        }
    }
    /**
     * Close shared object
     */
    close() {
        if (this.dirty) {
            this.flush();
        }
        SharedObject.instances.delete(`${this.localPath}/${this.name}`);
    }
    /**
     * Get object size in bytes (approximate)
     */
    get size() {
        return JSON.stringify(this.data).length;
    }
    /**
     * Check if running in Node.js environment
     */
    isNodeEnvironment() {
        return typeof window === 'undefined' && typeof process !== 'undefined';
    }
    /**
     * Load data from file system (Node.js)
     */
    loadFromFile() {
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
    saveToFile() {
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
    deleteFile() {
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
    loadFromBrowser() {
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
    saveToBrowser() {
        const key = `as4_so_${this.localPath}_${this.name}`;
        const dataStr = JSON.stringify(this.data);
        // Try localStorage first
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem(key, dataStr);
                return;
            }
            catch (error) {
                // localStorage might be full or disabled
            }
        }
        // Fallback to sessionStorage
        if (typeof sessionStorage !== 'undefined') {
            try {
                sessionStorage.setItem(key, dataStr);
            }
            catch (error) {
                throw new Error('Unable to save to browser storage');
            }
        }
        else {
            throw new Error('Browser storage not available');
        }
    }
    /**
     * Clear data from browser storage
     */
    clearFromBrowser() {
        const key = `as4_so_${this.localPath}_${this.name}`;
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem(key);
        }
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.removeItem(key);
        }
    }
}
exports.SharedObject = SharedObject;
SharedObject.instances = new Map();
class Database extends EventDispatcher_1.EventDispatcher {
    constructor(config) {
        super();
        this.connected = false;
        this.config = config;
    }
}
exports.Database = Database;
/**
 * SQLite database implementation
 */
class SQLiteDatabase extends Database {
    constructor(config) {
        super(config);
        this.db = null;
    }
    async connect() {
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
        }
        catch (error) {
            this.dispatchSimpleEvent('error', { error: error.message });
            throw error;
        }
    }
    async disconnect() {
        if (this.db) {
            this.db.close();
            this.db = null;
            this.connected = false;
            this.dispatchSimpleEvent('disconnect', null);
        }
    }
    async get(key) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT value FROM key_value WHERE key = ?', [key], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row ? JSON.parse(row.value) : null);
                }
            });
        });
    }
    async set(key, value) {
        const jsonValue = JSON.stringify(value);
        return new Promise((resolve, reject) => {
            this.db.run('INSERT OR REPLACE INTO key_value (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)', [key, jsonValue], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async delete(key) {
        return new Promise((resolve, reject) => {
            this.db.run('DELETE FROM key_value WHERE key = ?', [key], (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    async query(sql, params = []) {
        return new Promise((resolve, reject) => {
            if (sql.toLowerCase().trim().startsWith('select')) {
                this.db.all(sql, params, (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(rows);
                    }
                });
            }
            else {
                this.db.run(sql, params, function (err) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({ lastID: this.lastID, changes: this.changes });
                    }
                });
            }
        });
    }
}
exports.SQLiteDatabase = SQLiteDatabase;
/**
 * Storage utility functions
 */
class StorageUtils {
    /**
     * Clear all AS4 shared objects
     */
    static clearAllSharedObjects() {
        if (typeof window !== 'undefined') {
            // Browser environment
            const keys = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith('as4_so_')) {
                    keys.push(key);
                }
            }
            keys.forEach(key => localStorage.removeItem(key));
        }
        else {
            // Node.js environment
            try {
                const fs = require('fs');
                const path = require('path');
                const os = require('os');
                const dataDir = path.join(os.homedir(), '.as4', 'sharedobjects');
                if (fs.existsSync(dataDir)) {
                    fs.rmSync(dataDir, { recursive: true, force: true });
                }
            }
            catch (error) {
                console.warn('Failed to clear shared objects:', error);
            }
        }
    }
    /**
     * Get storage usage information
     */
    static getStorageInfo() {
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
        }
        else {
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
            }
            catch (error) {
                return { totalSize: 0, count: 0, type: 'filesystem', error: error.message };
            }
        }
    }
}
exports.StorageUtils = StorageUtils;
//# sourceMappingURL=Storage.js.map