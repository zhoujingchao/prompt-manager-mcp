# MCP Prompt Manager

A Model Context Protocol (MCP) service for managing, retrieving, and refreshing prompt templates.

## Overview

Prompt Manager is a lightweight service built on the MCP (Model Context Protocol) SDK that provides tools for AI assistants to:

1. Retrieve a list of all available prompt templates
2. Get specific prompt templates by name
3. Refresh the prompt template cache

This service enables AI assistants to access and utilize pre-defined prompt templates stored as Markdown files.

## Features

- **Template Management**: Load prompt templates from a configurable directory
- **Template Retrieval**: Access templates by name
- **Dynamic Refresh**: Reload templates without restarting the service
- **MCP Integration**: Seamlessly works with AI assistants that support MCP

## Prerequisites

- Node.js (v22 or later)
- npm or yarn

## Installation

1. Clone this repository:
   ```
   git clone <repository-url>
   cd prompt-manager
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Configure the environment:
   - Set the `PROMPTS_DIR` variable to the absolute path of your prompts directory in the `.env`

## Usage

### Starting the service

```
npm run dev
```

This will build the project and start the service with the MCP inspector for debugging.

### Production use

```
npm run build
npm start
```

### Available MCP Tools

The service provides the following tools:

1. **refresh_prompts**
   - Reloads all prompt templates from the configured directory
   - Parameters: None
   - Returns: A message indicating the number of templates loaded

2. **all_prompts**
   - Lists all available prompt templates
   - Parameters: None
   - Returns: An array of template objects with id and action properties

3. **get_prompt_by_name**
   - Retrieves a specific prompt template
   - Parameters: `name` (string) - the name/id of the template
   - Returns: The template object including the prompt content

## Prompt Template Format

Prompt templates are stored as Markdown files in the configured directory. The filename (without extension) is used as both the template ID and action name.

Example prompt template file structure:
```
/prompts
  ├── coding_task.md
  ├── summarize.md
  └── translate.md
```

## Development

### Project Structure

- `/src` - Source code
  - `index.ts` - Main application file with MCP server setup
  - `const.ts` - Utility functions for loading templates
- `/dist` - Compiled JavaScript output
- `/bin` - Executable scripts

### Building the Project

```
npm run build
```

This compiles TypeScript to JavaScript using esbuild.

### Testing

Run the service with the MCP inspector for testing:

```
npm run dev
```

## License

ISC

## Dependencies

- [@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - MCP SDK for creating MCP servers
- [zod](https://github.com/colinhacks/zod) - TypeScript-first schema validation
