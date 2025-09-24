# as4.ai - AI/ML Integration API Reference

The `as4.ai` package provides unified AI/ML capabilities with support for text, image, audio, and video generation across multiple providers.

## Package Overview

| Class/Interface | Description |
|-----------------|-------------|
| [AIModel](#aimodel) | Main AI model interface for all providers |
| [AIModelConfig](#aimodelconfig) | Configuration interface for AI models |
| [AIResponse](#airesponse) | Standard response format for AI operations |

---

## Class: AIModel

Unified AI model interface supporting multiple providers and modalities (text, image, audio, video).

### Constructor

```typescript
new AIModel(provider: string, config?: AIModelConfig)
```

**Parameters:**
- `provider` - AI provider name ("openai", "gpt", "huggingface", "hf", "replicate", "local")
- `config` - Optional configuration object

### Supported Providers

| Provider | Models | Capabilities |
|----------|--------|--------------|
| `openai` / `gpt` | GPT-3.5, GPT-4, DALL-E | Text, Image, Audio |
| `huggingface` / `hf` | Various transformers | Text, Image, Audio |
| `replicate` | Stable Diffusion, LLaMA | Text, Image, Video |
| `local` | llama.cpp, transformers.js | Text (local inference) |

### Text Generation Methods

#### generateText()
```typescript
generateText(prompt: string, options?: any): Promise<string>
```

Generate text based on a prompt.

**Parameters:**
- `prompt` - The input text prompt
- `options` - Provider-specific options (temperature, maxTokens, etc.)

**Returns:** Promise resolving to generated text

#### summarize()
```typescript
summarize(text: string, options?: any): Promise<string>
```

Summarize the provided text.

**Parameters:**
- `text` - Text to summarize
- `options` - Summarization options

**Returns:** Promise resolving to summary text

#### generateCode()
```typescript
generateCode(prompt: string, language?: string, options?: any): Promise<string>
```

Generate code from a natural language prompt.

**Parameters:**
- `prompt` - Description of desired code
- `language` - Target programming language (default: "javascript")
- `options` - Generation options

**Returns:** Promise resolving to generated code

### Image Generation Methods

#### generateImage()
```typescript
generateImage(prompt: string, options?: any): Promise<Buffer>
```

Generate an image from a text prompt.

**Parameters:**
- `prompt` - Text description of desired image
- `options` - Image options (size, style, format, etc.)

**Returns:** Promise resolving to image data as Buffer

### Audio Methods

#### speak()
```typescript
speak(text: string, options?: any): Promise<Buffer>
```

Convert text to speech (TTS).

**Parameters:**
- `text` - Text to convert to speech
- `options` - Voice options (voice, speed, pitch, etc.)

**Returns:** Promise resolving to audio data as Buffer

#### transcribe()
```typescript
transcribe(audioBuffer: Buffer, options?: any): Promise<string>
```

Convert speech to text (STT).

**Parameters:**
- `audioBuffer` - Audio data to transcribe
- `options` - Transcription options (language, model, etc.)

**Returns:** Promise resolving to transcribed text

### Video Generation Methods

#### generateVideo()
```typescript
generateVideo(prompt: string, options?: any): Promise<Buffer>
```

Generate video from a text prompt.

**Parameters:**
- `prompt` - Text description of desired video
- `options` - Video options (duration, resolution, style, etc.)

**Returns:** Promise resolving to video data as Buffer

### Utility Methods

#### getProvider()
```typescript
getProvider(): string
```

Get the current AI provider name.

#### updateConfig()
```typescript
updateConfig(config: Partial<AIModelConfig>): void
```

Update the model configuration.

### Events

| Event | When Dispatched |
|-------|----------------|
| `error` | When AI operation fails |
| `complete` | When AI operation completes successfully |

### Example Usage

#### Basic Text Generation

```actionscript
import as4.ai.AIModel;

// Initialize with OpenAI
var ai:AIModel = new AIModel("openai", {
    apiKey: process.env.OPENAI_API_KEY,
    model: "gpt-4",
    temperature: 0.7
});

// Generate text
ai.generateText("Write a short story about a robot").then(function(story:String):void {
    trace("Generated story: " + story);
}).catch(function(error:Error):void {
    trace("Error: " + error.message);
});
```

#### Code Generation

```actionscript
// Generate ActionScript code
ai.generateCode("Create a function that calculates factorial", "actionscript").then(function(code:String):void {
    trace("Generated code:\n" + code);
});

// Generate with specific requirements
var prompt:String = "Create a REST API client class with GET, POST, PUT, DELETE methods";
ai.generateCode(prompt, "actionscript", {
    maxTokens: 500,
    temperature: 0.3
}).then(function(code:String):void {
    trace("API client code:\n" + code);
});
```

#### Image Generation

```actionscript
// Generate an image
ai.generateImage("A futuristic city with flying cars at sunset", {
    size: "512x512",
    style: "digital_art"
}).then(function(imageBuffer:Buffer):void {
    // Save image to file or display
    var fs = require('fs');
    fs.writeFileSync('generated_image.png', imageBuffer);
    trace("Image saved!");
});
```

#### Audio Processing

```actionscript
// Text to speech
ai.speak("Hello, this is AS4 speaking!", {
    voice: "en-US-Neural2-A",
    speed: 1.0
}).then(function(audioBuffer:Buffer):void {
    // Play or save audio
    var fs = require('fs');
    fs.writeFileSync('speech.wav', audioBuffer);
    trace("Speech generated!");
});

// Speech to text
var fs = require('fs');
var audioData:Buffer = fs.readFileSync('input_audio.wav');

ai.transcribe(audioData, {
    language: "en-US"
}).then(function(transcript:String):void {
    trace("Transcription: " + transcript);
});
```

---

## Interface: AIModelConfig

Configuration interface for AI model initialization.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `apiKey` | string | API key for the provider |
| `baseUrl` | string | Base URL for API endpoints |
| `model` | string | Specific model name |
| `maxTokens` | number | Maximum tokens for generation |
| `temperature` | number | Randomness (0.0-1.0) |
| `timeout` | number | Request timeout in milliseconds |

### Example

```actionscript
var config:AIModelConfig = {
    apiKey: "your-api-key",
    model: "gpt-4",
    maxTokens: 1000,
    temperature: 0.7,
    timeout: 30000
};
```

---

## Interface: AIResponse

Standard response format for AI operations.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `success` | boolean | Whether operation succeeded |
| `data` | any | Response data |
| `error` | string | Error message (if failed) |
| `usage` | object | Token usage information |

---

## Advanced Examples

### Multi-Modal AI Application

```actionscript
package app {
    import as4.ai.AIModel;
    import as4.events.EventDispatcher;
    import as4.utils.trace;

    public class MultiModalAI extends EventDispatcher {
        private var textAI:AIModel;
        private var imageAI:AIModel;
        private var audioAI:AIModel;

        public function MultiModalAI() {
            super();
            initializeModels();
        }

        private function initializeModels():void {
            // Different models for different tasks
            textAI = new AIModel("openai", {
                apiKey: process.env.OPENAI_KEY,
                model: "gpt-4"
            });

            imageAI = new AIModel("replicate", {
                apiKey: process.env.REPLICATE_KEY
            });

            audioAI = new AIModel("openai", {
                apiKey: process.env.OPENAI_KEY,
                model: "whisper-1"
            });
        }

        public function createStory(topic:String):void {
            trace("Creating multimedia story about: " + topic);

            // Step 1: Generate story text
            textAI.generateText("Write a short story about " + topic).then(function(story:String):void {
                trace("Story generated: " + story.substring(0, 100) + "...");

                // Step 2: Generate illustration
                return imageAI.generateImage("Illustration for: " + story.substring(0, 200));

            }).then(function(imageBuffer:Buffer):void {
                trace("Image generated, size: " + imageBuffer.length + " bytes");

                // Step 3: Generate narration
                return audioAI.speak(story);

            }).then(function(audioBuffer:Buffer):void {
                trace("Audio generated, size: " + audioBuffer.length + " bytes");
                
                dispatchSimpleEvent("storyComplete", {
                    text: story,
                    image: imageBuffer,
                    audio: audioBuffer
                });

            }).catch(function(error:Error):void {
                trace("Error in story creation: " + error.message);
                dispatchSimpleEvent("storyError", { error: error.message });
            });
        }
    }
}
```

### AI-Powered Game NPC

```actionscript
package game {
    import as4.ai.AIModel;
    import as4.events.EventDispatcher;
    import as4.utils.Timer;

    public class IntelligentNPC extends EventDispatcher {
        private var ai:AIModel;
        private var personality:String;
        private var memory:Array;
        private var responseTimer:Timer;

        public function IntelligentNPC(name:String, personality:String) {
            super();
            
            this.personality = personality;
            this.memory = [];
            
            ai = new AIModel("openai", {
                apiKey: process.env.OPENAI_KEY,
                model: "gpt-3.5-turbo",
                temperature: 0.8
            });

            // Add response delay for realism
            responseTimer = new Timer(1000, 1);
            responseTimer.addEventListener("timerComplete", onResponseReady);
        }

        public function interact(playerMessage:String):void {
            // Store interaction in memory
            memory.push("Player: " + playerMessage);
            
            // Generate contextual response
            var context:String = buildContext();
            var prompt:String = context + "\nPlayer: " + playerMessage + "\nNPC Response:";

            ai.generateText(prompt, {
                maxTokens: 150,
                temperature: 0.8
            }).then(function(response:String):void {
                memory.push("NPC: " + response);
                
                // Simulate thinking time
                responseTimer.start();
                
                dispatchSimpleEvent("npcResponse", { 
                    message: response,
                    delay: 1000
                });
            });
        }

        private function buildContext():String {
            var context:String = "You are an NPC in a game with this personality: " + personality + "\n";
            context += "Recent conversation:\n";
            
            // Include last 5 interactions for context
            var start:int = Math.max(0, memory.length - 5);
            for (var i:int = start; i < memory.length; i++) {
                context += memory[i] + "\n";
            }
            
            return context;
        }

        private function onResponseReady(event:Event):void {
            dispatchSimpleEvent("responseReady");
        }
    }
}

// Usage
var npc:IntelligentNPC = new IntelligentNPC("Wise Sage", 
    "A wise old sage who speaks in riddles and gives helpful advice");

npc.addEventListener("npcResponse", function(event:Event):void {
    trace("NPC says: " + event.data.message);
});

npc.interact("Where can I find the magical sword?");
```

### AI Code Assistant

```actionscript
package tools {
    import as4.ai.AIModel;
    import as4.utils.trace;

    public class CodeAssistant {
        private var ai:AIModel;

        public function CodeAssistant() {
            ai = new AIModel("openai", {
                apiKey: process.env.OPENAI_KEY,
                model: "gpt-4",
                temperature: 0.2 // Lower temperature for more consistent code
            });
        }

        public function generateClass(className:String, description:String):void {
            var prompt:String = "Generate an ActionScript 3 class named " + className + 
                " that " + description + ". Include proper documentation and error handling.";

            ai.generateCode(prompt, "actionscript").then(function(code:String):void {
                trace("Generated class:\n" + code);
            });
        }

        public function explainCode(code:String):void {
            var prompt:String = "Explain this ActionScript code in detail:\n\n" + code;

            ai.generateText(prompt).then(function(explanation:String):void {
                trace("Code explanation:\n" + explanation);
            });
        }

        public function optimizeCode(code:String):void {
            var prompt:String = "Optimize this ActionScript code for better performance and readability:\n\n" + code;

            ai.generateCode(prompt, "actionscript").then(function(optimizedCode:String):void {
                trace("Optimized code:\n" + optimizedCode);
            });
        }

        public function findBugs(code:String):void {
            var prompt:String = "Analyze this ActionScript code for potential bugs and suggest fixes:\n\n" + code;

            ai.generateText(prompt).then(function(analysis:String):void {
                trace("Bug analysis:\n" + analysis);
            });
        }
    }
}
```

---

## Provider-Specific Configuration

### OpenAI Configuration

```actionscript
var openaiConfig:AIModelConfig = {
    apiKey: "sk-...",
    model: "gpt-4",
    maxTokens: 1000,
    temperature: 0.7,
    baseUrl: "https://api.openai.com/v1" // Optional custom endpoint
};
```

### HuggingFace Configuration

```actionscript
var hfConfig:AIModelConfig = {
    apiKey: "hf_...",
    model: "microsoft/DialoGPT-medium",
    baseUrl: "https://api-inference.huggingface.co/models/"
};
```

### Local Inference Configuration

```actionscript
var localConfig:AIModelConfig = {
    baseUrl: "http://localhost:8080", // Local llama.cpp server
    model: "llama-2-7b-chat",
    maxTokens: 500
};
```

---

## Error Handling

```actionscript
ai.addEventListener("error", function(event:Event):void {
    trace("AI Error: " + event.data.error);
    
    // Handle specific error types
    switch (event.data.error) {
        case "API_KEY_INVALID":
            // Handle authentication error
            break;
        case "RATE_LIMITED":
            // Handle rate limiting
            break;
        case "MODEL_UNAVAILABLE":
            // Handle model issues
            break;
        default:
            // General error handling
            break;
    }
});
```

---

## Performance Optimization

1. **Batch Operations**
   ```actionscript
   // Process multiple prompts efficiently
   var prompts:Array = ["prompt1", "prompt2", "prompt3"];
   Promise.all(prompts.map(function(prompt:String):Promise {
       return ai.generateText(prompt);
   })).then(function(results:Array):void {
       // Process all results
   });
   ```

2. **Caching Responses**
   ```actionscript
   var responseCache:Object = {};
   
   function cachedGenerate(prompt:String):Promise<String> {
       if (responseCache[prompt]) {
           return Promise.resolve(responseCache[prompt]);
       }
       
       return ai.generateText(prompt).then(function(result:String):String {
           responseCache[prompt] = result;
           return result;
       });
   }
   ```

3. **Streaming for Long Content**
   ```actionscript
   // For providers that support streaming
   ai.generateText(prompt, { stream: true }).then(function(stream:any):void {
       stream.on('data', function(chunk:String):void {
           trace("Received chunk: " + chunk);
       });
   });
   ```

---

## See Also

- [utils.Timer](utils.md#timer) - Timing AI operations
- [net.URLLoader](net.md#urlloader) - Custom API integration
- [storage.SharedObject](storage.md#sharedobject) - Caching AI responses
- [events.EventDispatcher](events.md#eventdispatcher) - AI event handling
