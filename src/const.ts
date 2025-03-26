import fs from 'fs';
import path from 'path';

// Configurable prompts directory
let _promptsDir = process.env.PROMPTS_DIR;

if (!_promptsDir) {
  throw new Error('PROMPTS_DIR is not set');
}

/**
 * Get the current prompts directory path
 * @returns The current prompts directory path
 */
export const getPromptsDir = (): string =>  _promptsDir;

/**
 * Load a prompt template from the configured directory
 * @param name - Name of the prompt template (without extension)
 * @returns The content of the prompt template
 */
export const getPromptTemplate = (name: string): string => {
  try {
    const promptPath = path.join(_promptsDir, `${name}.md`);
    
    if (fs.existsSync(promptPath)) {
      try {
        const content = fs.readFileSync(promptPath, 'utf-8');
        return content;
      } catch (readError) {
        console.error(`Error reading prompt template: ${readError}`);
        throw readError;
      }
    } else {
      throw new Error(`Prompt template not found for ${name}`);
    }
  } catch (error) {
    const promptPath = path.join(_promptsDir, `${name}.md`);
    console.error(`Failed to load prompt ${name}:`, error);
    return `Error loading prompt: ${name} (promptPath: ${promptPath}) (${error instanceof Error ? error.message : String(error)})`;
  }
};

// Load prompt templates dynamically
export const loadPromptTemplates = (): Array<{id: string, action: string, prompt: string}> => {
  try {
    if (!fs.existsSync(_promptsDir)) {
      throw new Error('PROMPTS_DIR is not set');
    }
    
    const files = fs.readdirSync(_promptsDir).filter(file => file.endsWith('.md'));
    return files.map(file => {
      const name = file.replace('.md', '');
      return {
        id: name,
        action: name,
        prompt: getPromptTemplate(name)
      };
    });
  } catch (error) {
    console.error('Error loading prompt templates:', error);
    return [];
  }
};
