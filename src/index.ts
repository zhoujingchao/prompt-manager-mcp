import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import chokidar from 'chokidar';
import { loadPromptTemplates } from './const.js';


// Create an MCP server
const server = new McpServer({
  name: 'prompt-manager',
  version: '1.0.7',
});

const PromptsDir = process.env.PROMPTS_DIR;

if (!PromptsDir) {
  throw new Error('PROMPTS_DIR is not set');
}

let promptTemplate = loadPromptTemplates();

// Initialize file change watcher
const watcher = chokidar.watch(PromptsDir, {
  // ignore hidden files
  ignored: /(^|[\/\\])\../,
  persistent: true,
  // ignore initial scan
  ignoreInitial: true,
  awaitWriteFinish: {
    // wait for 1000ms after the file is written
    stabilityThreshold: 1000,
  },
});

// eventType
watcher
  .on('add', (filePath) => handleFileChange(filePath, 'add'))
  .on('change', (filePath) => handleFileChange(filePath, 'change'))
  .on('unlink', (filePath) => handleFileChange(filePath, 'unlink'))
  .on('addDir', (filePath) => handleFileChange(filePath, 'addDir'))

function handleFileChange(filePath: string, eventType: string) {
  console.info(`[${eventType}] ${filePath}`);
  promptTemplate = loadPromptTemplates();
}

// Add a tool to refresh prompt templates from the directory
server.tool('refresh_prompts', {}, async () => {
  try {
    promptTemplate = loadPromptTemplates();
    return {
      content: [
        {
          type: 'text',
          text: `Loaded ${promptTemplate.length} templates from ${PromptsDir}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error refreshing templates: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
      ],
    };
  }
});

// Add all_prompts tool
server.tool('all_prompts', {}, async () => {
  const tasks = promptTemplate.map((t) => ({
    id: t.id,
    action: t.action,
  }));

  return {
    content: [{ type: 'text', text: JSON.stringify(tasks, null, 2) }],
  };
});

// Add get_prompt_by_name tool
server.tool('get_prompt_by_name', { name: z.string() }, async ({ name }: { name: string }) => {
  const template = promptTemplate.find((t) => t.id === name || t.action === name);

  if (!template) {
    return {
      content: [{ type: 'text', text: `Task "${name}" not found` }],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            id: template.id,
            action: template.action,
            prompt: template.prompt,
          },
          null,
          2,
        ),
      },
    ],
  };
});

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
