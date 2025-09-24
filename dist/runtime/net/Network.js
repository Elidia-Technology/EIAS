
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
exports.HTTPUtils = exports.XMLSocket = exports.Socket = exports.URLLoader = exports.URLRequest = void 0;
const EventDispatcher_1 = require("../events/EventDispatcher");
/**
 * AS3-style URLRequest class
 */
class URLRequest {
    constructor(url = '') {
        this.method = 'GET';
        this.data = null;
        this.requestHeaders = new Map();
        this.contentType = 'application/json';
        this.url = url;
    }
    /**
     * Set request header
     */
    setRequestHeader(name, value) {
        this.requestHeaders.set(name, value);
    }
    /**
     * Get request header
     */
    getRequestHeader(name) {
        return this.requestHeaders.get(name);
    }
}
exports.URLRequest = URLRequest;
/**
 * AS3-style URLLoader class wrapping fetch API
 */
class URLLoader extends EventDispatcher_1.EventDispatcher {
    constructor(request) {
        super();
        this.data = null;
        this.dataFormat = 'text'; // 'text', 'json', 'binary'
        this.request = null;
        if (request) {
            this.load(request);
        }
    }
    /**
     * Load data from URL
     */
    async load(request) {
        this.request = request;
        try {
            const headers = {};
            // Add request headers
            request.requestHeaders.forEach((value, key) => {
                headers[key] = value;
            });
            // Set content type if not already set
            if (!headers['Content-Type'] && request.data) {
                headers['Content-Type'] = request.contentType;
            }
            const fetchOptions = {
                method: request.method,
                headers,
            };
            // Add body for non-GET requests
            if (request.method !== 'GET' && request.data) {
                if (typeof request.data === 'string') {
                    fetchOptions.body = request.data;
                }
                else {
                    fetchOptions.body = JSON.stringify(request.data);
                }
            }
            const response = await fetch(request.url, fetchOptions);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            // Parse response based on dataFormat
            switch (this.dataFormat) {
                case 'json':
                    this.data = await response.json();
                    break;
                case 'binary':
                    this.data = await response.arrayBuffer();
                    break;
                case 'text':
                default:
                    this.data = await response.text();
                    break;
            }
            this.dispatchSimpleEvent(EventDispatcher_1.EventType.COMPLETE, { data: this.data });
            return this.data;
        }
        catch (error) {
            const errorEvent = new EventDispatcher_1.Event(EventDispatcher_1.EventType.ERROR, false, false, { error: error.message });
            this.dispatchEvent(errorEvent);
            throw error;
        }
    }
    /**
     * Close the connection (if applicable)
     */
    close() {
        // For fetch API, there's no explicit close method
        // But we can dispatch a close event
        this.dispatchSimpleEvent('close', null);
    }
}
exports.URLLoader = URLLoader;
/**
 * AS3-style Socket class wrapping WebSocket
 */
class Socket extends EventDispatcher_1.EventDispatcher {
    constructor() {
        super();
        this.socket = null;
        this.connected = false;
    }
    /**
     * Connect to a socket server
     */
    connect(host, port) {
        const url = `ws://${host}:${port}`;
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            this.connected = true;
            this.dispatchSimpleEvent('connect', null);
        };
        this.socket.onmessage = (event) => {
            this.dispatchSimpleEvent('socketData', { data: event.data });
        };
        this.socket.onclose = () => {
            this.connected = false;
            this.dispatchSimpleEvent('close', null);
        };
        this.socket.onerror = (error) => {
            this.dispatchSimpleEvent(EventDispatcher_1.EventType.ERROR, { error });
        };
    }
    /**
     * Send data through socket
     */
    writeUTFBytes(data) {
        if (this.socket && this.connected) {
            this.socket.send(data);
        }
    }
    /**
     * Send binary data through socket
     */
    writeBytes(data) {
        if (this.socket && this.connected) {
            this.socket.send(data);
        }
    }
    /**
     * Close socket connection
     */
    close() {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }
}
exports.Socket = Socket;
/**
 * AS3-style XMLSocket class
 */
class XMLSocket extends EventDispatcher_1.EventDispatcher {
    constructor() {
        super();
        this.socket = null;
        this.connected = false;
    }
    /**
     * Connect to XML socket server
     */
    connect(host, port) {
        const url = `ws://${host}:${port}`;
        this.socket = new WebSocket(url);
        this.socket.onopen = () => {
            this.connected = true;
            this.dispatchSimpleEvent('connect', null);
        };
        this.socket.onmessage = (event) => {
            // Parse XML data
            try {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(event.data, 'text/xml');
                this.dispatchSimpleEvent('data', { data: xmlDoc });
            }
            catch (error) {
                this.dispatchSimpleEvent(EventDispatcher_1.EventType.ERROR, { error: error.message });
            }
        };
        this.socket.onclose = () => {
            this.connected = false;
            this.dispatchSimpleEvent('close', null);
        };
        this.socket.onerror = (error) => {
            this.dispatchSimpleEvent(EventDispatcher_1.EventType.ERROR, { error });
        };
    }
    /**
     * Send XML data
     */
    send(data) {
        if (this.socket && this.connected) {
            this.socket.send(data + '\0'); // XML socket typically uses null terminator
        }
    }
    /**
     * Close connection
     */
    close() {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }
}
exports.XMLSocket = XMLSocket;
/**
 * Helper functions for HTTP requests
 */
class HTTPUtils {
    /**
     * Simple GET request
     */
    static async get(url, headers) {
        const request = new URLRequest(url);
        request.method = 'GET';
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                request.setRequestHeader(key, value);
            });
        }
        const loader = new URLLoader();
        loader.dataFormat = 'json';
        return loader.load(request);
    }
    /**
     * Simple POST request
     */
    static async post(url, data, headers) {
        const request = new URLRequest(url);
        request.method = 'POST';
        request.data = data;
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                request.setRequestHeader(key, value);
            });
        }
        const loader = new URLLoader();
        loader.dataFormat = 'json';
        return loader.load(request);
    }
    /**
     * Simple PUT request
     */
    static async put(url, data, headers) {
        const request = new URLRequest(url);
        request.method = 'PUT';
        request.data = data;
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                request.setRequestHeader(key, value);
            });
        }
        const loader = new URLLoader();
        loader.dataFormat = 'json';
        return loader.load(request);
    }
    /**
     * Simple DELETE request
     */
    static async delete(url, headers) {
        const request = new URLRequest(url);
        request.method = 'DELETE';
        if (headers) {
            Object.entries(headers).forEach(([key, value]) => {
                request.setRequestHeader(key, value);
            });
        }
        const loader = new URLLoader();
        loader.dataFormat = 'json';
        return loader.load(request);
    }
}
exports.HTTPUtils = HTTPUtils;
//# sourceMappingURL=Network.js.map