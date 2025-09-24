
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
 * AI Model configuration interface
 */
export interface AIModelConfig {
    apiKey?: string;
    baseUrl?: string;
    model?: string;
    maxTokens?: number;
    temperature?: number;
    timeout?: number;
}
/**
 * AI Model response interface
 */
export interface AIResponse {
    success: boolean;
    data?: any;
    error?: string;
    usage?: {
        prompt_tokens?: number;
        completion_tokens?: number;
        total_tokens?: number;
    };
}
/**
 * Unified AI Model interface supporting text, graphics, audio, video
 */
export declare class AIModel extends EventDispatcher {
    private provider;
    private config;
    private apiClient;
    constructor(provider: string, config?: AIModelConfig);
    /**
     * Initialize API client based on provider
     */
    private initializeClient;
    /**
     * Generate text using AI model
     */
    generateText(prompt: string, options?: any): Promise<string>;
    /**
     * Summarize text
     */
    summarize(text: string, options?: any): Promise<string>;
    /**
     * Generate code from prompt
     */
    generateCode(prompt: string, language?: string, options?: any): Promise<string>;
    /**
     * Generate image from text prompt
     */
    generateImage(prompt: string, options?: any): Promise<Buffer>;
    /**
     * Generate video from text prompt
     */
    generateVideo(prompt: string, options?: any): Promise<Buffer>;
    /**
     * Text-to-speech
     */
    speak(text: string, options?: any): Promise<Buffer>;
    /**
     * Speech-to-text (transcription)
     */
    transcribe(audioBuffer: Buffer, options?: any): Promise<string>;
    /**
     * Make API request (to be implemented based on provider)
     */
    private makeRequest;
    /**
     * Create OpenAI client
     */
    private createOpenAIClient;
    /**
     * Create HuggingFace client
     */
    private createHuggingFaceClient;
    /**
     * Create Replicate client
     */
    private createReplicateClient;
    /**
     * Create local inference client
     */
    private createLocalClient;
    /**
     * Get current provider
     */
    getProvider(): string;
    /**
     * Update configuration
     */
    updateConfig(config: Partial<AIModelConfig>): void;
}
//# sourceMappingURL=AIModel.d.ts.map