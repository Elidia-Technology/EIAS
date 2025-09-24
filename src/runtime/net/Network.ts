
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
import { EventDispatcher, Event, EventType } from '../events/EventDispatcher';

/**
 * AS3-style URLRequest class
 */
export class URLRequest {
    public url: string;
    public method: string = 'GET';
    public data: any = null;
    public requestHeaders: Map<string, string> = new Map();
    public contentType: string = 'application/json';

    constructor(url: string = '') {
        this.url = url;
    }

    /**
     * Set request header
     */
    public setRequestHeader(name: string, value: string): void {
        this.requestHeaders.set(name, value);
    }

    /**
     * Get request header
     */
    public getRequestHeader(name: string): string | undefined {
        return this.requestHeaders.get(name);
    }
}

/**
 * AS3-style URLLoader class wrapping fetch API
 */
export class URLLoader extends EventDispatcher {
    public data: any = null;
    public dataFormat: string = 'text'; // 'text', 'json', 'binary'
    private request: URLRequest | null = null;

    constructor(request?: URLRequest) {
        super();
        if (request) {
            this.load(request);
        }
    }

    /**
     * Load data from URL
     */
    public async load(request: URLRequest): Promise<any> {
        this.request = request;
        
        try {
            const headers: Record<string, string> = {};
            
            // Add request headers
            request.requestHeaders.forEach((value, key) => {
                headers[key] = value;
            });

            // Set content type if not already set
            if (!headers['Content-Type'] && request.data) {
                headers['Content-Type'] = request.contentType;
            }

            const fetchOptions: RequestInit = {
                method: request.method,
                headers,
            };

            // Add body for non-GET requests
            if (request.method !== 'GET' && request.data) {
                if (typeof request.data === 'string') {
                    fetchOptions.body = request.data;
                } else {
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

            this.dispatchSimpleEvent(EventType.COMPLETE, { data: this.data });
            return this.data;

        } catch (error) {
            const errorEvent = new Event(EventType.ERROR, false, false, { error: error.message });
            this.dispatchEvent(errorEvent);
            throw error;
        }
    }

    /**
     * Close the connection (if applicable)
     */
    public close(): void {
        // For fetch API, there's no explicit close method
        // But we can dispatch a close event
        this.dispatchSimpleEvent('close', null);
    }
}

/**
 * AS3-style Socket class wrapping WebSocket
 */
export class Socket extends EventDispatcher {
    private socket: WebSocket | null = null;
    public connected: boolean = false;

    constructor() {
        super();
    }

    /**
     * Connect to a socket server
     */
    public connect(host: string, port: number): void {
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
            this.dispatchSimpleEvent(EventType.ERROR, { error });
        };
    }

    /**
     * Send data through socket
     */
    public writeUTFBytes(data: string): void {
        if (this.socket && this.connected) {
            this.socket.send(data);
        }
    }

    /**
     * Send binary data through socket
     */
    public writeBytes(data: ArrayBuffer): void {
        if (this.socket && this.connected) {
            this.socket.send(data);
        }
    }

    /**
     * Close socket connection
     */
    public close(): void {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }
}

/**
 * AS3-style XMLSocket class
 */
export class XMLSocket extends EventDispatcher {
    private socket: WebSocket | null = null;
    public connected: boolean = false;

    constructor() {
        super();
    }

    /**
     * Connect to XML socket server
     */
    public connect(host: string, port: number): void {
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
            } catch (error) {
                this.dispatchSimpleEvent(EventType.ERROR, { error: error.message });
            }
        };

        this.socket.onclose = () => {
            this.connected = false;
            this.dispatchSimpleEvent('close', null);
        };

        this.socket.onerror = (error) => {
            this.dispatchSimpleEvent(EventType.ERROR, { error });
        };
    }

    /**
     * Send XML data
     */
    public send(data: string): void {
        if (this.socket && this.connected) {
            this.socket.send(data + '\0'); // XML socket typically uses null terminator
        }
    }

    /**
     * Close connection
     */
    public close(): void {
        if (this.socket) {
            this.socket.close();
            this.connected = false;
        }
    }
}

/**
 * Helper functions for HTTP requests
 */
export class HTTPUtils {
    /**
     * Simple GET request
     */
    public static async get(url: string, headers?: Record<string, string>): Promise<any> {
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
    public static async post(url: string, data: any, headers?: Record<string, string>): Promise<any> {
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
    public static async put(url: string, data: any, headers?: Record<string, string>): Promise<any> {
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
    public static async delete(url: string, headers?: Record<string, string>): Promise<any> {
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
