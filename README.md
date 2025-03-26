# Prompt Manager MCP Server

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

## Configuration

### NPX

```
{
  "mcpServers": {
    "prompt-manager": {
      "command": "env",
      "args": [
         "PROMPTS_DIR=<YOUR_PROMPTS_DIR>",
         "npx",
         "-y",
         "@modelcontextprotocol/prompt-manager"
      ]
    }
  }
}
```

## License

This MCP server is licensed under the MIT License. This means you are free to use, modify, and distribute the software, subject to the terms and conditions of the MIT License. For more details, please see the LICENSE file in the project repository.


