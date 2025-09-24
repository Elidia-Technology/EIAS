# AS4 Examples - AI Integration

This guide demonstrates how to integrate AI/ML capabilities into your AS4 applications.

## Table of Contents

1. [Basic Text Generation](#basic-text-generation)
2. [Chatbot Application](#chatbot-application)
3. [Image Generation App](#image-generation-app)
4. [Code Assistant](#code-assistant)
5. [Multi-Modal AI App](#multi-modal-ai-app)
6. [AI-Powered Game NPC](#ai-powered-game-npc)
7. [Voice Assistant](#voice-assistant)

---

## Basic Text Generation

Simple text generation using OpenAI GPT models.

### TextGenerator.as

```actionscript
package examples.ai {
    import as4.ai.AIModel;
    import as4.events.EventDispatcher;
    import as4.utils.trace;

    public class TextGenerator extends EventDispatcher {
        private var ai:AIModel;

        public function TextGenerator() {
            super();
            initializeAI();
        }

        private function initializeAI():void {
            ai = new AIModel("openai", {
                apiKey: process.env.OPENAI_API_KEY,
                model: "gpt-3.5-turbo",
                temperature: 0.7,
                maxTokens: 500
            });

            ai.addEventListener("error", onAIError);
        }

        public function generateStory(topic:String):void {
            var prompt:String = "Write a creative short story about: " + topic + 
                "\nMake it engaging and approximately 200 words.";

            trace("Generating story about: " + topic);

            ai.generateText(prompt).then(function(story:String):void {
                trace("Generated Story:\n" + story);
                dispatchSimpleEvent("storyGenerated", { story: story, topic: topic });
            }).catch(function(error:Error):void {
                trace("Error generating story: " + error.message);
            });
        }

        public function generatePoem(theme:String, style:String = "free verse"):void {
            var prompt:String = "Write a " + style + " poem about " + theme + 
                ". Make it beautiful and meaningful.";

            ai.generateText(prompt).then(function(poem:String):void {
                trace("Generated Poem:\n" + poem);
                dispatchSimpleEvent("poemGenerated", { poem: poem, theme: theme, style: style });
            });
        }

        public function generateDialogue(character1:String, character2:String, situation:String):void {
            var prompt:String = "Write a dialogue between " + character1 + " and " + character2 + 
                " in this situation: " + situation + 
                "\nMake it natural and interesting. Format as a script.";

            ai.generateText(prompt).then(function(dialogue:String):void {
                trace("Generated Dialogue:\n" + dialogue);
                dispatchSimpleEvent("dialogueGenerated", { 
                    dialogue: dialogue, 
                    characters: [character1, character2],
                    situation: situation 
                });
            });
        }

        private function onAIError(event:Event):void {
            trace("AI Error: " + event.data.error);
            dispatchSimpleEvent("error", event.data);
        }
    }
}
```

### Usage Example

```actionscript
// Create and use the text generator
var generator:TextGenerator = new TextGenerator();

// Listen for generated content
generator.addEventListener("storyGenerated", function(event:Event):void {
    trace("Story about " + event.data.topic + " is ready!");
    // Display story in UI
});

generator.addEventListener("poemGenerated", function(event:Event):void {
    trace("Poem in " + event.data.style + " style is ready!");
});

// Generate different types of content
generator.generateStory("a robot learning to paint");
generator.generatePoem("autumn leaves", "haiku");
generator.generateDialogue("Alice", "Mad Hatter", "having tea in Wonderland");
```

---

## Chatbot Application

Interactive chatbot with conversation memory.

### ChatBot.as

```actionscript
package examples.ai {
    import as4.ai.AIModel;
    import as4.events.EventDispatcher;
    import as4.utils.trace;
    import as4.storage.SharedObject;

    public class ChatBot extends EventDispatcher {
        private var ai:AIModel;
        private var conversationHistory:Array;
        private var personality:String;
        private var userName:String;
        private var storage:SharedObject;

        public function ChatBot(personality:String = "helpful assistant") {
            super();
            this.personality = personality;
            this.conversationHistory = [];
            
            initializeAI();
            loadConversationHistory();
        }

        private function initializeAI():void {
            ai = new AIModel("openai", {
                apiKey: process.env.OPENAI_API_KEY,
                model: "gpt-3.5-turbo",
                temperature: 0.8,
                maxTokens: 300
            });
        }

        private function loadConversationHistory():void {
            storage = SharedObject.getLocal("chatbot_history");
            if (storage.data.history) {
                conversationHistory = storage.data.history;
            }
        }

        private function saveConversationHistory():void {
            storage.data.history = conversationHistory;
            storage.flush();
        }

        public function setUserName(name:String):void {
            userName = name;
            addSystemMessage("User's name is " + name);
        }

        public function sendMessage(message:String):void {
            trace("User: " + message);
            
            // Add user message to history
            conversationHistory.push("User: " + message);
            
            // Build context for AI
            var context:String = buildContext();
            
            ai.generateText(context).then(function(response:String):void {
                // Clean up response (remove any "Assistant:" prefix)
                response = response.replace(/^(Assistant:|Bot:)\s*/i, "");
                
                trace("Bot: " + response);
                
                // Add bot response to history
                conversationHistory.push("Bot: " + response);
                
                // Keep history manageable (last 20 messages)
                if (conversationHistory.length > 20) {
                    conversationHistory = conversationHistory.slice(-20);
                }
                
                saveConversationHistory();
                
                dispatchSimpleEvent("botResponse", { 
                    message: response,
                    userMessage: message 
                });
                
            }).catch(function(error:Error):void {
                trace("Error getting bot response: " + error.message);
                var fallbackResponse:String = "I'm sorry, I'm having trouble responding right now.";
                dispatchSimpleEvent("botResponse", { message: fallbackResponse });
            });
        }

        private function buildContext():String {
            var context:String = "You are a " + personality + ".";
            
            if (userName) {
                context += " You are talking to " + userName + ".";
            }
            
            context += " Be helpful, friendly, and conversational.\n\n";
            
            // Add recent conversation history
            var recentHistory:Array = conversationHistory.slice(-10); // Last 10 messages
            for (var i:int = 0; i < recentHistory.length; i++) {
                context += recentHistory[i] + "\n";
            }
            
            context += "Bot:";
            
            return context;
        }

        private function addSystemMessage(message:String):void {
            conversationHistory.push("System: " + message);
        }

        public function clearHistory():void {
            conversationHistory = [];
            storage.data.history = [];
            storage.flush();
            trace("Conversation history cleared");
        }

        public function getConversationSummary():void {
            if (conversationHistory.length < 5) {
                trace("Not enough conversation to summarize");
                return;
            }

            var fullConversation:String = conversationHistory.join("\n");
            var prompt:String = "Summarize this conversation in 2-3 sentences:\n\n" + fullConversation;

            ai.generateText(prompt).then(function(summary:String):void {
                trace("Conversation Summary: " + summary);
                dispatchSimpleEvent("conversationSummary", { summary: summary });
            });
        }
    }
}
```

### ChatBot UI Example

```actionscript
package examples.ai {
    import as4.graphics.Sprite;
    import as4.graphics.TextField;
    import as4.graphics.Button;
    import as4.events.Event;

    public class ChatBotUI extends Sprite {
        private var chatBot:ChatBot;
        private var messageInput:TextField;
        private var chatDisplay:TextField;
        private var sendButton:Button;
        private var clearButton:Button;

        public function ChatBotUI() {
            super();
            initializeChatBot();
            createUI();
        }

        private function initializeChatBot():void {
            chatBot = new ChatBot("friendly AI assistant who loves to help with coding and creative projects");
            chatBot.setUserName("Developer");
            
            chatBot.addEventListener("botResponse", onBotResponse);
        }

        private function createUI():void {
            // Chat display area
            chatDisplay = new TextField();
            chatDisplay.width = 400;
            chatDisplay.height = 300;
            chatDisplay.y = 10;
            chatDisplay.text = "ChatBot: Hello! I'm here to help. What would you like to talk about?";
            addChild(chatDisplay);

            // Message input
            messageInput = new TextField();
            messageInput.width = 300;
            messageInput.height = 30;
            messageInput.y = 320;
            messageInput.placeholder = "Type your message here...";
            addChild(messageInput);

            // Send button
            sendButton = new Button();
            sendButton.label = "Send";
            sendButton.x = 310;
            sendButton.y = 320;
            sendButton.width = 60;
            sendButton.height = 30;
            sendButton.addEventListener("click", onSendMessage);
            addChild(sendButton);

            // Clear button
            clearButton = new Button();
            clearButton.label = "Clear";
            clearButton.x = 380;
            clearButton.y = 320;
            clearButton.width = 60;
            clearButton.height = 30;
            clearButton.addEventListener("click", onClearChat);
            addChild(clearButton);
        }

        private function onSendMessage(event:Event):void {
            var message:String = messageInput.text.trim();
            if (message.length == 0) return;

            // Add user message to display
            appendToChat("You: " + message);
            
            // Clear input
            messageInput.text = "";
            
            // Send to chatbot
            chatBot.sendMessage(message);
        }

        private function onBotResponse(event:Event):void {
            appendToChat("Bot: " + event.data.message);
        }

        private function appendToChat(message:String):void {
            chatDisplay.text += "\n\n" + message;
            // Auto-scroll to bottom
            chatDisplay.scrollV = chatDisplay.maxScrollV;
        }

        private function onClearChat(event:Event):void {
            chatBot.clearHistory();
            chatDisplay.text = "ChatBot: Chat history cleared. How can I help you?";
        }
    }
}
```

---

## Image Generation App

Generate images from text descriptions using AI.

### ImageGenerator.as

```actionscript
package examples.ai {
    import as4.ai.AIModel;
    import as4.events.EventDispatcher;
    import as4.utils.trace;
    import as4.net.URLRequest;
    import as4.net.URLLoader;

    public class ImageGenerator extends EventDispatcher {
        private var ai:AIModel;
        private var generationQueue:Array;
        private var isGenerating:Boolean = false;

        public function ImageGenerator() {
            super();
            initializeAI();
            generationQueue = [];
        }

        private function initializeAI():void {
            // Using Replicate for image generation (Stable Diffusion)
            ai = new AIModel("replicate", {
                apiKey: process.env.REPLICATE_API_TOKEN
            });
        }

        public function generateImage(prompt:String, options:Object = null):void {
            var imageOptions:Object = {
                prompt: prompt,
                width: 512,
                height: 512,
                num_inference_steps: 20,
                guidance_scale: 7.5,
                ...options
            };

            var request:Object = {
                prompt: prompt,
                options: imageOptions,
                timestamp: new Date().getTime()
            };

            generationQueue.push(request);
            processQueue();
        }

        private function processQueue():void {
            if (isGenerating || generationQueue.length == 0) {
                return;
            }

            isGenerating = true;
            var request:Object = generationQueue.shift();
            
            trace("Generating image: " + request.prompt);
            dispatchSimpleEvent("generationStarted", { prompt: request.prompt });

            ai.generateImage(request.prompt, request.options).then(function(imageBuffer:Buffer):void {
                trace("Image generated successfully!");
                
                // Save image to file
                var filename:String = "generated_" + request.timestamp + ".png";
                saveImageToFile(imageBuffer, filename);
                
                dispatchSimpleEvent("imageGenerated", {
                    prompt: request.prompt,
                    filename: filename,
                    buffer: imageBuffer
                });
                
                isGenerating = false;
                processQueue(); // Process next in queue
                
            }).catch(function(error:Error):void {
                trace("Error generating image: " + error.message);
                
                dispatchSimpleEvent("generationError", {
                    prompt: request.prompt,
                    error: error.message
                });
                
                isGenerating = false;
                processQueue(); // Continue with next
            });
        }

        private function saveImageToFile(imageBuffer:Buffer, filename:String):void {
            try {
                var fs = require('fs');
                var path = require('path');
                
                // Create images directory if it doesn't exist
                var imagesDir:String = "generated_images";
                if (!fs.existsSync(imagesDir)) {
                    fs.mkdirSync(imagesDir);
                }
                
                var filepath:String = path.join(imagesDir, filename);
                fs.writeFileSync(filepath, imageBuffer);
                
                trace("Image saved: " + filepath);
            } catch (error:Error) {
                trace("Error saving image: " + error.message);
            }
        }

        public function generateImageSeries(basePrompt:String, variations:Array):void {
            trace("Generating image series for: " + basePrompt);
            
            for (var i:int = 0; i < variations.length; i++) {
                var fullPrompt:String = basePrompt + ", " + variations[i];
                generateImage(fullPrompt, { 
                    series: true, 
                    variation: variations[i] 
                });
            }
        }

        public function generateImageWithStyles(prompt:String):void {
            var styles:Array = [
                "photorealistic",
                "digital art",
                "oil painting",
                "watercolor",
                "pencil sketch",
                "cartoon style"
            ];

            for (var i:int = 0; i < styles.length; i++) {
                var styledPrompt:String = prompt + ", " + styles[i] + " style";
                generateImage(styledPrompt, { style: styles[i] });
            }
        }

        public function getQueueStatus():Object {
            return {
                queueLength: generationQueue.length,
                isGenerating: isGenerating,
                nextPrompt: generationQueue.length > 0 ? generationQueue[0].prompt : null
            };
        }
    }
}
```

### Image Gallery UI

```actionscript
package examples.ai {
    import as4.graphics.Sprite;
    import as4.graphics.TextField;
    import as4.graphics.Button;
    import as4.events.Event;

    public class ImageGalleryUI extends Sprite {
        private var imageGenerator:ImageGenerator;
        private var promptInput:TextField;
        private var generateButton:Button;
        private var statusText:TextField;
        private var gallery:Sprite;
        private var generatedImages:Array;

        public function ImageGalleryUI() {
            super();
            generatedImages = [];
            initializeGenerator();
            createUI();
        }

        private function initializeGenerator():void {
            imageGenerator = new ImageGenerator();
            
            imageGenerator.addEventListener("generationStarted", onGenerationStarted);
            imageGenerator.addEventListener("imageGenerated", onImageGenerated);
            imageGenerator.addEventListener("generationError", onGenerationError);
        }

        private function createUI():void {
            // Title
            var title:TextField = new TextField();
            title.text = "AI Image Generator";
            title.x = 10;
            title.y = 10;
            addChild(title);

            // Prompt input
            promptInput = new TextField();
            promptInput.width = 400;
            promptInput.height = 60;
            promptInput.x = 10;
            promptInput.y = 40;
            promptInput.placeholder = "Describe the image you want to generate...";
            addChild(promptInput);

            // Generate button
            generateButton = new Button();
            generateButton.label = "Generate Image";
            generateButton.x = 10;
            generateButton.y = 110;
            generateButton.width = 120;
            generateButton.height = 30;
            generateButton.addEventListener("click", onGenerateClick);
            addChild(generateButton);

            // Style buttons
            createStyleButtons();

            // Status text
            statusText = new TextField();
            statusText.x = 140;
            statusText.y = 115;
            statusText.text = "Ready to generate";
            addChild(statusText);

            // Gallery area
            gallery = new Sprite();
            gallery.x = 10;
            gallery.y = 160;
            addChild(gallery);
        }

        private function createStyleButtons():void {
            var styles:Array = ["Realistic", "Digital Art", "Painting", "Sketch"];
            
            for (var i:int = 0; i < styles.length; i++) {
                var button:Button = new Button();
                button.label = styles[i];
                button.x = 140 + (i * 90);
                button.y = 110;
                button.width = 80;
                button.height = 30;
                button.data = styles[i].toLowerCase();
                button.addEventListener("click", onStyleClick);
                addChild(button);
            }
        }

        private function onGenerateClick(event:Event):void {
            var prompt:String = promptInput.text.trim();
            if (prompt.length == 0) {
                statusText.text = "Please enter a prompt";
                return;
            }

            imageGenerator.generateImage(prompt);
        }

        private function onStyleClick(event:Event):void {
            var button:Button = event.target as Button;
            var style:String = button.data;
            var prompt:String = promptInput.text.trim();
            
            if (prompt.length == 0) {
                statusText.text = "Please enter a prompt first";
                return;
            }

            var styledPrompt:String = prompt + ", " + style + " style";
            imageGenerator.generateImage(styledPrompt);
        }

        private function onGenerationStarted(event:Event):void {
            statusText.text = "Generating: " + event.data.prompt;
            generateButton.enabled = false;
        }

        private function onImageGenerated(event:Event):void {
            statusText.text = "Generated: " + event.data.filename;
            generateButton.enabled = true;
            
            // Add to gallery
            addImageToGallery(event.data);
        }

        private function onGenerationError(event:Event):void {
            statusText.text = "Error: " + event.data.error;
            generateButton.enabled = true;
        }

        private function addImageToGallery(imageData:Object):void {
            generatedImages.push(imageData);
            
            // Create image thumbnail (simplified)
            var thumbnail:Sprite = new Sprite();
            thumbnail.graphics.beginFill(0xCCCCCC);
            thumbnail.graphics.drawRect(0, 0, 100, 100);
            thumbnail.graphics.endFill();
            
            // Position in grid
            var row:int = Math.floor((generatedImages.length - 1) / 4);
            var col:int = (generatedImages.length - 1) % 4;
            thumbnail.x = col * 110;
            thumbnail.y = row * 110;
            
            // Add label
            var label:TextField = new TextField();
            label.text = imageData.filename;
            label.y = 105;
            label.width = 100;
            thumbnail.addChild(label);
            
            gallery.addChild(thumbnail);
        }
    }
}
```

---

## Code Assistant

AI-powered code generation and explanation tool.

### CodeAssistant.as

```actionscript
package examples.ai {
    import as4.ai.AIModel;
    import as4.events.EventDispatcher;
    import as4.utils.trace;

    public class CodeAssistant extends EventDispatcher {
        private var ai:AIModel;

        public function CodeAssistant() {
            super();
            initializeAI();
        }

        private function initializeAI():void {
            ai = new AIModel("openai", {
                apiKey: process.env.OPENAI_API_KEY,
                model: "gpt-4", // Better for code generation
                temperature: 0.2, // Lower temperature for more consistent code
                maxTokens: 1000
            });
        }

        public function generateClass(className:String, description:String, features:Array = null):void {
            var prompt:String = "Generate an ActionScript 3 class named '" + className + "' that " + description;
            
            if (features && features.length > 0) {
                prompt += "\n\nInclude these features:\n";
                for (var i:int = 0; i < features.length; i++) {
                    prompt += "- " + features[i] + "\n";
                }
            }
            
            prompt += "\n\nMake sure to include:\n";
            prompt += "- Proper package declaration\n";
            prompt += "- Private variables with getters/setters where appropriate\n";
            prompt += "- Constructor with parameters\n";
            prompt += "- Comprehensive documentation\n";
            prompt += "- Error handling where needed\n";

            trace("Generating class: " + className);

            ai.generateCode(prompt, "actionscript").then(function(code:String):void {
                trace("Generated class code:\n" + code);
                
                dispatchSimpleEvent("classGenerated", {
                    className: className,
                    code: code,
                    description: description
                });
            }).catch(function(error:Error):void {
                trace("Error generating class: " + error.message);
            });
        }

        public function explainCode(code:String, level:String = "intermediate"):void {
            var prompt:String = "Explain this ActionScript code for a " + level + " developer. " +
                "Break down what each part does and explain any patterns or concepts used:\n\n" + code;

            ai.generateText(prompt).then(function(explanation:String):void {
                trace("Code explanation:\n" + explanation);
                
                dispatchSimpleEvent("codeExplained", {
                    originalCode: code,
                    explanation: explanation,
                    level: level
                });
            });
        }

        public function optimizeCode(code:String, focus:String = "performance"):void {
            var prompt:String = "Optimize this ActionScript code for " + focus + ". " +
                "Provide the optimized code and explain what changes were made and why:\n\n" + code;

            ai.generateCode(prompt, "actionscript").then(function(response:String):void {
                // Parse response to separate code and explanation
                var parts:Array = response.split("Explanation:");
                var optimizedCode:String = parts[0].trim();
                var explanation:String = parts.length > 1 ? parts[1].trim() : "No explanation provided";
                
                trace("Optimized code:\n" + optimizedCode);
                trace("Optimization explanation:\n" + explanation);
                
                dispatchSimpleEvent("codeOptimized", {
                    originalCode: code,
                    optimizedCode: optimizedCode,
                    explanation: explanation,
                    focus: focus
                });
            });
        }

        public function findBugs(code:String):void {
            var prompt:String = "Analyze this ActionScript code for potential bugs, issues, and improvements. " +
                "For each issue found, provide:\n" +
                "1. The problem description\n" +
                "2. Line number or code section\n" +
                "3. Suggested fix\n" +
                "4. Severity level (critical, major, minor)\n\n" + code;

            ai.generateText(prompt).then(function(analysis:String):void {
                trace("Bug analysis:\n" + analysis);
                
                dispatchSimpleEvent("bugsAnalyzed", {
                    code: code,
                    analysis: analysis
                });
            });
        }

        public function generateFunction(functionName:String, description:String, parameters:Array = null, returnType:String = "void"):void {
            var prompt:String = "Generate an ActionScript function named '" + functionName + "' that " + description;
            
            prompt += "\n\nFunction signature:\n";
            prompt += "public function " + functionName + "(";
            
            if (parameters && parameters.length > 0) {
                var paramStrings:Array = [];
                for (var i:int = 0; i < parameters.length; i++) {
                    var param:Object = parameters[i];
                    paramStrings.push(param.name + ":" + param.type);
                }
                prompt += paramStrings.join(", ");
            }
            
            prompt += "):" + returnType;
            
            prompt += "\n\nInclude proper error handling and documentation.";

            ai.generateCode(prompt, "actionscript").then(function(code:String):void {
                trace("Generated function:\n" + code);
                
                dispatchSimpleEvent("functionGenerated", {
                    functionName: functionName,
                    code: code,
                    description: description
                });
            });
        }

        public function convertFromJavaScript(jsCode:String):void {
            var prompt:String = "Convert this JavaScript code to ActionScript 3. " +
                "Make sure to use proper AS3 syntax, types, and conventions:\n\n" + jsCode;

            ai.generateCode(prompt, "actionscript").then(function(asCode:String):void {
                trace("Converted to ActionScript:\n" + asCode);
                
                dispatchSimpleEvent("codeConverted", {
                    originalCode: jsCode,
                    convertedCode: asCode,
                    sourceLanguage: "javascript",
                    targetLanguage: "actionscript"
                });
            });
        }

        public function generateTestCase(code:String, className:String):void {
            var prompt:String = "Generate comprehensive unit tests for this ActionScript class. " +
                "Create test methods for all public methods and important scenarios:\n\n" + code;

            ai.generateCode(prompt, "actionscript").then(function(testCode:String):void {
                trace("Generated test case:\n" + testCode);
                
                dispatchSimpleEvent("testGenerated", {
                    originalCode: code,
                    testCode: testCode,
                    className: className
                });
            });
        }
    }
}
```

### Usage Example

```actionscript
// Create code assistant
var assistant:CodeAssistant = new CodeAssistant();

// Listen for generated code
assistant.addEventListener("classGenerated", function(event:Event):void {
    trace("New class ready: " + event.data.className);
    // Save to file or display in editor
});

assistant.addEventListener("codeExplained", function(event:Event):void {
    trace("Code explanation ready for " + event.data.level + " level");
});

// Generate a game character class
assistant.generateClass("GameCharacter", "represents a player character in an RPG game", [
    "Health and mana properties",
    "Attack and defense methods",
    "Inventory management",
    "Level progression system"
]);

// Explain existing code
var existingCode:String = `
public class Timer {
    private var interval:uint;
    private var callback:Function;
    
    public function Timer(interval:uint, callback:Function) {
        this.interval = interval;
        this.callback = callback;
    }
}`;

assistant.explainCode(existingCode, "beginner");

// Generate a specific function
assistant.generateFunction("calculateDamage", "calculates damage based on attack power and defense", [
    { name: "attackPower", type: "Number" },
    { name: "defense", type: "Number" },
    { name: "criticalHit", type: "Boolean" }
], "Number");
```

This comprehensive AI integration documentation shows how to build powerful AI-enabled applications using AS4. The examples cover text generation, image creation, chatbots, and code assistance - all using ActionScript-style syntax with modern AI capabilities.
