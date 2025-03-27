import fs from 'fs';
import path from 'path';

// Configurable prompts directory
const PromptsDir = process.env.PROMPTS_DIR;

if (!PromptsDir) {
  throw new Error('PROMPTS_DIR is not set');
}

/**
 * Load a prompt template from the configured directory
 * @param filePath - file path of the prompt template
 * @returns The content of the prompt template
 */
export const getPromptTemplate = (filePath: string): string => {
  try {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content;
      } catch (readError) {
        console.error(`Error reading prompt template: ${readError}`);
        throw readError;
      }
    } else {
      throw new Error(`Prompt template not found for ${name}`);
    }
  } catch (error) {
    console.error(`Failed to load prompt ${name}:`, error);
    return `Error loading prompt: ${name} (filePath: ${filePath}) (${error instanceof Error ? error.message : String(error)})`;
  }
};

/**
 * @param {string} directoryPath - target directory
 * @param {Array} results - .md files
 * @returns {Array} - all .md files in the directory
 */
function findAllMarkdownFiles(directoryPath: string, results: string[] = []) {
  const files = fs.readdirSync(directoryPath);
  
  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findAllMarkdownFiles(filePath, results);
    } else if (stat.isFile() && path.extname(file) === '.md') {
      results.push(filePath);
    }
  }
  
  return results;
}

// Load prompt templates dynamically
export const loadPromptTemplates = (): Array<{id: string, action: string, prompt: string}> => {
  try {
    const markdownFiles = findAllMarkdownFiles(PromptsDir);
    return markdownFiles.map(filePath => {
      const name = path.basename(filePath, '.md');
      return {
        id: name,
        action: name,
        filePath,
        prompt: getPromptTemplate(filePath)
      };
    });
  } catch (error) {
    console.error('Error loading prompt templates:', error);
    return [];
  }
};
