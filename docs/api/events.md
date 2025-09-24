# as4.events - Event System API Reference

The `as4.events` package provides a complete event system compatible with ActionScript 3, built on top of Node.js EventEmitter.

## Package Overview

| Class | Description |
|-------|-------------|
| [Event](#event) | Base event class for all AS4 events |
| [EventDispatcher](#eventdispatcher) | Main event dispatching class |
| [EventType](#eventtype) | Constants for common event types |

---

## Class: Event

The base class for all events in the AS4 system.

### Constructor

```typescript
new Event(type: string, bubbles?: boolean, cancelable?: boolean, data?: any)
```

**Parameters:**
- `type` - The event type string
- `bubbles` - Whether the event bubbles (default: false)
- `cancelable` - Whether the event can be canceled (default: false)
- `data` - Optional data payload

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `type` | string | The event type |
| `target` | any | The event target |
| `currentTarget` | any | The current event target |
| `bubbles` | boolean | Whether event bubbles |
| `cancelable` | boolean | Whether event can be canceled |
| `data` | any | Event data payload |

### Methods

#### preventDefault()
```typescript
preventDefault(): void
```
Prevents the default action for this event.

#### stopPropagation()
```typescript
stopPropagation(): void
```
Stops the event from propagating further.

### Example Usage

```actionscript
// Create a custom event
var customEvent:Event = new Event("userAction", true, true, { userId: 123 });

// Access event properties
trace("Event type: " + customEvent.type);
trace("Event data: " + customEvent.data.userId);
```

---

## Class: EventDispatcher

The main event dispatching class that provides AS3-style event handling.

### Constructor

```typescript
new EventDispatcher()
```

### Methods

#### addEventListener()
```typescript
addEventListener(type: string, listener: (event: Event) => void, useCapture?: boolean, priority?: number): void
```

Add an event listener for the specified event type.

**Parameters:**
- `type` - The event type to listen for
- `listener` - The function to call when event occurs
- `useCapture` - Whether to use capture phase (default: false)
- `priority` - Listener priority (default: 0)

#### removeEventListener()
```typescript
removeEventListener(type: string, listener: (event: Event) => void, useCapture?: boolean): void
```

Remove an event listener.

**Parameters:**
- `type` - The event type
- `listener` - The listener function to remove
- `useCapture` - Whether listener was registered with capture (default: false)

#### dispatchEvent()
```typescript
dispatchEvent(event: Event): boolean
```

Dispatch an event to all registered listeners.

**Parameters:**
- `event` - The event to dispatch

**Returns:** `true` if event was dispatched successfully

#### hasEventListener()
```typescript
hasEventListener(type: string): boolean
```

Check if there are any listeners for the specified event type.

**Parameters:**
- `type` - The event type to check

**Returns:** `true` if listeners exist

#### dispatchSimpleEvent()
```typescript
dispatchSimpleEvent(type: string, data?: any): boolean
```

Convenience method to dispatch a simple event with optional data.

**Parameters:**
- `type` - The event type
- `data` - Optional event data

**Returns:** `true` if event was dispatched successfully

### Example Usage

```actionscript
package app {
    import as4.events.EventDispatcher;
    import as4.events.Event;

    public class MyClass extends EventDispatcher {
        public function doSomething():void {
            // Dispatch a simple event
            dispatchSimpleEvent("actionComplete", { result: "success" });
            
            // Or create and dispatch a custom event
            var event:Event = new Event("customAction", false, false, { message: "Hello" });
            dispatchEvent(event);
        }
    }
}

// Usage
var myInstance:MyClass = new MyClass();

// Add event listeners
myInstance.addEventListener("actionComplete", function(event:Event):void {
    trace("Action completed: " + event.data.result);
});

myInstance.addEventListener("customAction", function(event:Event):void {
    trace("Custom action: " + event.data.message);
});

// Trigger events
myInstance.doSomething();
```

---

## Class: EventType

Constants for commonly used event types.

### Static Properties

| Constant | Value | Description |
|----------|-------|-------------|
| `ADDED` | "added" | Object added to display list |
| `REMOVED` | "removed" | Object removed from display list |
| `COMPLETE` | "complete" | Operation completed |
| `ERROR` | "error" | Error occurred |
| `CHANGE` | "change" | Value changed |
| `SELECT` | "select" | Selection made |
| `CLICK` | "click" | Click interaction |
| `TIMER` | "timer" | Timer tick |
| `TIMER_COMPLETE` | "timerComplete" | Timer completed |

### Example Usage

```actionscript
import as4.events.EventType;
import as4.events.EventDispatcher;

// Use predefined event types
dispatcher.addEventListener(EventType.COMPLETE, onComplete);
dispatcher.addEventListener(EventType.ERROR, onError);

function onComplete(event:Event):void {
    trace("Operation completed successfully");
}

function onError(event:Event):void {
    trace("Error occurred: " + event.data.message);
}
```

---

## Advanced Usage

### Custom Event Classes

Create custom event classes by extending the base Event class:

```actionscript
package app.events {
    import as4.events.Event;

    public class UserEvent extends Event {
        public static const LOGIN:String = "userLogin";
        public static const LOGOUT:String = "userLogout";
        
        public var userId:String;
        public var userName:String;

        public function UserEvent(type:String, userId:String, userName:String) {
            super(type, false, false);
            this.userId = userId;
            this.userName = userName;
        }
    }
}

// Usage
import app.events.UserEvent;

var userEvent:UserEvent = new UserEvent(UserEvent.LOGIN, "123", "john_doe");
dispatcher.dispatchEvent(userEvent);
```

### Event Bubbling Chain

```actionscript
// Parent-child event bubbling
public class Parent extends EventDispatcher {
    private var child:Child;
    
    public function Parent() {
        child = new Child();
        child.addEventListener("childEvent", onChildEvent);
    }
    
    private function onChildEvent(event:Event):void {
        trace("Parent received: " + event.type);
        // Re-dispatch to continue bubbling
        dispatchEvent(event);
    }
}

public class Child extends EventDispatcher {
    public function triggerEvent():void {
        var event:Event = new Event("childEvent", true, false, { source: "child" });
        dispatchEvent(event);
    }
}
```

### Performance Best Practices

1. **Remove listeners** when no longer needed:
```actionscript
// Always clean up
object.removeEventListener(EventType.COMPLETE, onComplete);
```

2. **Use weak references** for long-lived objects:
```actionscript
// Prevent memory leaks
addEventListener(EventType.CHANGE, onChange, false, 0, true);
```

3. **Batch event dispatching** for performance:
```actionscript
// Group related events
dispatchSimpleEvent("batchStart");
// ... multiple operations
dispatchSimpleEvent("batchComplete", { count: operationCount });
```

---

## See Also

- [utils.Timer](utils.md#timer) - Timer events
- [graphics.DisplayObject](graphics.md#displayobject) - Display list events
- [net.URLLoader](net.md#urlloader) - Network events
- [AI Integration Events](ai.md#events) - AI operation events
