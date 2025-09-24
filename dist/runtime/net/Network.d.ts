
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
 * AS3-style URLRequest class
 */
export declare class URLRequest {
    url: string;
    method: string;
    data: any;
    requestHeaders: Map<string, string>;
    contentType: string;
    constructor(url?: string);
    /**
     * Set request header
     */
    setRequestHeader(name: string, value: string): void;
    /**
     * Get request header
     */
    getRequestHeader(name: string): string | undefined;
}
/**
 * AS3-style URLLoader class wrapping fetch API
 */
export declare class URLLoader extends EventDispatcher {
    data: any;
    dataFormat: string;
    private request;
    constructor(request?: URLRequest);
    /**
     * Load data from URL
     */
    load(request: URLRequest): Promise<any>;
    /**
     * Close the connection (if applicable)
     */
    close(): void;
}
/**
 * AS3-style Socket class wrapping WebSocket
 */
export declare class Socket extends EventDispatcher {
    private socket;
    connected: boolean;
    constructor();
    /**
     * Connect to a socket server
     */
    connect(host: string, port: number): void;
    /**
     * Send data through socket
     */
    writeUTFBytes(data: string): void;
    /**
     * Send binary data through socket
     */
    writeBytes(data: ArrayBuffer): void;
    /**
     * Close socket connection
     */
    close(): void;
}
/**
 * AS3-style XMLSocket class
 */
export declare class XMLSocket extends EventDispatcher {
    private socket;
    connected: boolean;
    constructor();
    /**
     * Connect to XML socket server
     */
    connect(host: string, port: number): void;
    /**
     * Send XML data
     */
    send(data: string): void;
    /**
     * Close connection
     */
    close(): void;
}
/**
 * Helper functions for HTTP requests
 */
export declare class HTTPUtils {
    /**
     * Simple GET request
     */
    static get(url: string, headers?: Record<string, string>): Promise<any>;
    /**
     * Simple POST request
     */
    static post(url: string, data: any, headers?: Record<string, string>): Promise<any>;
    /**
     * Simple PUT request
     */
    static put(url: string, data: any, headers?: Record<string, string>): Promise<any>;
    /**
     * Simple DELETE request
     */
    static delete(url: string, headers?: Record<string, string>): Promise<any>;
}
//# sourceMappingURL=Network.d.ts.map