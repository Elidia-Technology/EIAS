# AS4 CLI Reference

Complete command-line interface reference for the AS4 framework.

## Table of Contents

1. [Installation](#installation)
2. [Global Commands](#global-commands)
3. [Project Commands](#project-commands)
4. [Compilation Commands](#compilation-commands)
5. [Generator Commands](#generator-commands)
6. [Development Tools](#development-tools)
7. [Configuration](#configuration)
8. [Examples](#examples)

---

## Installation

### Global Installation

```bash
# Install AS4 CLI globally
npm install -g as4

# Verify installation
as4 --version
```

### Local Installation

```bash
# Install in project
npm install as4 --save-dev

# Use via npx
npx as4 --version

# Or via package.json scripts
```

---

## Global Commands

### `as4 --help`

Display help information for all available commands.

```bash
as4 --help
as4 -h
```

**Output:**
```
AS4 - ActionScript 3 for the Modern JavaScript Era

Usage: as4 <command> [options]

Commands:
  init          Initialize a new AS4 project
  compile       Compile ActionScript files to JavaScript
  run           Run compiled JavaScript files
  test          Run tests
  generate      Generate code templates
  install       Install AS4 dependencies
  publish       Publish AS4 package
  serve         Start development server

Options:
  -V, --version    output the version number
  -h, --help       display help for command

For more information on a command, run: as4 <command> --help
```

### `as4 --version`

Display the current version of AS4.

```bash
as4 --version
as4 -V
```

---

## Project Commands

### `as4 init`

Initialize a new AS4 project in the current directory.

```bash
as4 init [project-name] [options]
```

**Options:**
- `--template <template>` - Use a specific project template
- `--yes`, `-y` - Accept all defaults
- `--verbose` - Show detailed output

**Templates:**
- `basic` - Basic AS4 project (default)
- `game` - Game development template
- `webapp` - Web application template
- `library` - Library/package template
- `ai` - AI-integrated application template

**Examples:**
```bash
# Initialize with default settings
as4 init

# Initialize with specific name and template
as4 init my-game --template game

# Quick initialization with defaults
as4 init --yes
```

**Generated Structure:**
```
my-project/
├── src/
│   └── Main.as
├── tests/
├── assets/
├── as4.config.json
├── package.json
├── .gitignore
└── README.md
```

### `as4 install`

Install and configure AS4 dependencies.

```bash
as4 install [options]
```

**Options:**
- `--save`, `-S` - Save to dependencies
- `--save-dev`, `-D` - Save to devDependencies
- `--global`, `-g` - Install globally

**Examples:**
```bash
# Install all project dependencies
as4 install

# Install specific AS4 extensions
as4 install as4-graphics as4-ai --save
```

---

## Compilation Commands

### `as4 compile`

Compile ActionScript files to JavaScript.

```bash
as4 compile [source] [options]
```

**Options:**
- `--output <dir>`, `-o <dir>` - Output directory (default: dist)
- `--target <target>` - ECMAScript target (es5, es2015, es2020, etc.)
- `--watch`, `-w` - Watch for changes and recompile
- `--source-map` - Generate source maps
- `--minify` - Minify output
- `--strict` - Enable strict mode
- `--verbose` - Show detailed compilation info

**Examples:**
```bash
# Compile all files in src/
as4 compile

# Compile specific file
as4 compile src/Player.as

# Compile with watch mode
as4 compile --watch

# Compile with custom output directory
as4 compile --output build

# Compile with minification and source maps
as4 compile --minify --source-map
```

**Configuration:**
Create `as4.config.json` for project-specific settings:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "sourceMap": true,
    "strict": true,
    "minify": false
  },
  "include": ["src/**/*.as"],
  "exclude": ["node_modules", "tests"],
  "outputDir": "dist"
}
```

### `as4 run`

Run compiled JavaScript files with AS4 runtime.

```bash
as4 run [file] [options]
```

**Options:**
- `--node-options <options>` - Pass options to Node.js
- `--inspect` - Enable Node.js debugger
- `--env <env>` - Set environment variables

**Examples:**
```bash
# Run main application
as4 run

# Run specific file
as4 run dist/Game.js

# Run with debugger
as4 run --inspect

# Run with environment variables
as4 run --env NODE_ENV=development
```

---

## Generator Commands

### `as4 generate`

Generate code templates and scaffolding.

```bash
as4 generate <type> <name> [options]
```

**Available Types:**
- `class` - Generate a class
- `interface` - Generate an interface
- `event` - Generate a custom event class
- `component` - Generate a UI component
- `service` - Generate a service class
- `test` - Generate test files
- `ai` - Generate AI-integrated components

**Global Options:**
- `--output <dir>`, `-o <dir>` - Output directory
- `--package <package>` - Package name
- `--extends <class>` - Base class to extend
- `--implements <interface>` - Interface to implement

### `as4 generate class`

Generate a new ActionScript class.

```bash
as4 generate class <ClassName> [options]
```

**Options:**
- `--extends <BaseClass>` - Extend a base class
- `--implements <Interface>` - Implement interfaces
- `--singleton` - Generate singleton pattern
- `--event-dispatcher` - Extend EventDispatcher

**Examples:**
```bash
# Basic class
as4 generate class Player

# Class with inheritance
as4 generate class Enemy --extends Character

# Singleton class
as4 generate class GameManager --singleton

# Event-dispatching class
as4 generate class NetworkManager --event-dispatcher
```

**Generated Output:**
```actionscript
package {
    import as4.events.EventDispatcher;

    public class Player extends EventDispatcher {
        public function Player() {
            super();
            initialize();
        }

        private function initialize():void {
            // TODO: Initialize player
        }
    }
}
```

### `as4 generate component`

Generate UI components.

```bash
as4 generate component <ComponentName> [options]
```

**Options:**
- `--interactive` - Make component interactive
- `--animated` - Add animation support
- `--data-binding` - Add data binding

**Examples:**
```bash
# Basic UI component
as4 generate component Button

# Interactive animated component
as4 generate component MenuButton --interactive --animated
```

### `as4 generate ai`

Generate AI-integrated components.

```bash
as4 generate ai <Type> <Name> [options]
```

**AI Types:**
- `chatbot` - Conversational AI component
- `image-generator` - AI image generation
- `text-analyzer` - Text analysis component
- `recommendation` - Recommendation system

**Examples:**
```bash
# Generate a chatbot
as4 generate ai chatbot CustomerSupport

# Generate image generator
as4 generate ai image-generator ArtGenerator
```

---

## Development Tools

### `as4 test`

Run tests using the AS4 testing framework.

```bash
as4 test [pattern] [options]
```

**Options:**
- `--watch`, `-w` - Watch mode
- `--coverage` - Generate coverage report
- `--reporter <type>` - Test reporter (spec, json, tap)
- `--timeout <ms>` - Test timeout in milliseconds

**Examples:**
```bash
# Run all tests
as4 test

# Run specific test files
as4 test tests/Player.test.as

# Run tests with coverage
as4 test --coverage

# Run tests in watch mode
as4 test --watch
```

### `as4 serve`

Start a development server for AS4 applications.

```bash
as4 serve [options]
```

**Options:**
- `--port <port>`, `-p <port>` - Server port (default: 3000)
- `--host <host>` - Server host (default: localhost)
- `--open` - Open browser automatically
- `--hot` - Enable hot module replacement
- `--https` - Use HTTPS

**Examples:**
```bash
# Start development server
as4 serve

# Custom port and host
as4 serve --port 8080 --host 0.0.0.0

# HTTPS with auto-open
as4 serve --https --open
```

### `as4 build`

Build production-ready applications.

```bash
as4 build [options]
```

**Options:**
- `--mode <mode>` - Build mode (development, production)
- `--analyze` - Analyze bundle size
- `--clean` - Clean output directory first

**Examples:**
```bash
# Production build
as4 build --mode production

# Development build with analysis
as4 build --mode development --analyze
```

---

## Configuration

### Global Configuration

Global AS4 settings are stored in `~/.as4rc`:

```json
{
  "defaultTemplate": "basic",
  "editor": "code",
  "registry": "https://registry.as4js.org",
  "ai": {
    "defaultProvider": "openai",
    "apiKeys": {
      "openai": "your-api-key"
    }
  }
}
```

### Project Configuration

Project-specific settings in `as4.config.json`:

```json
{
  "compilerOptions": {
    "target": "es2020",
    "module": "commonjs",
    "sourceMap": true,
    "strict": true,
    "experimentalDecorators": true
  },
  "include": ["src/**/*.as"],
  "exclude": ["node_modules", "dist"],
  "outputDir": "dist",
  "assets": ["assets/**/*"],
  "ai": {
    "enabled": true,
    "providers": ["openai", "huggingface"]
  },
  "dev": {
    "port": 3000,
    "hot": true,
    "open": true
  }
}
```

### Environment Variables

AS4 respects these environment variables:

```bash
# AI API Keys
export OPENAI_API_KEY="your-openai-key"
export HUGGINGFACE_API_KEY="your-hf-key"
export REPLICATE_API_TOKEN="your-replicate-token"

# Development
export AS4_ENV="development"
export AS4_DEBUG="true"
export AS4_PORT="3000"

# Compilation
export AS4_TARGET="es2020"
export AS4_SOURCE_MAP="true"
```

---

## Examples

### Complete Project Setup

```bash
# 1. Create new AI-powered game project
as4 init space-adventure --template game

# 2. Navigate to project
cd space-adventure

# 3. Generate game components
as4 generate class SpaceShip --extends Sprite --event-dispatcher
as4 generate class Enemy --extends Character
as4 generate ai chatbot GameNPC
as4 generate component HUD --interactive

# 4. Compile and run
as4 compile --watch &
as4 run

# 5. Run tests
as4 test --coverage
```

### Development Workflow

```bash
# Start development mode
as4 serve --port 3000 --hot --open &
as4 compile --watch &
as4 test --watch

# Make changes to source files...
# (Auto-compilation and hot-reload happen automatically)

# Build for production
as4 build --mode production --clean
```

### Package Development

```bash
# Create library project
as4 init my-as4-library --template library

# Generate library components
as4 generate class MyLibrary --singleton
as4 generate interface IMyService
as4 generate test MyLibrary

# Build and test
as4 compile
as4 test

# Publish to registry
as4 publish
```

### Advanced Configuration

```bash
# Set global defaults
as4 config set defaultTemplate game
as4 config set editor vscode
as4 config set ai.defaultProvider openai

# View current configuration
as4 config list

# Reset configuration
as4 config reset
```

This CLI reference provides comprehensive documentation for all AS4 command-line tools, enabling efficient development workflows and project management.
