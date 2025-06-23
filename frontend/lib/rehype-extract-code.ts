import { visit } from 'unist-util-visit';
import { Element, Text } from 'hast';

// Custom rehype plugin to extract raw code content before syntax highlighting
export function rehypeExtractCode() {
  return (tree: any) => {
    visit(tree, 'element', (node: Element) => {
      // Find pre elements that contain code
      if (node.tagName === 'pre') {
        const codeElement = node.children.find(
          (child): child is Element => 
            child.type === 'element' && child.tagName === 'code'
        );

        if (codeElement) {
          // Extract the raw text content from the code element
          const rawText = extractTextContent(codeElement);
          
          // Add the raw text as a property to the pre element
          if (!node.properties) {
            node.properties = {};
          }
          node.properties.raw = rawText;
          
          // Also extract language from className if present
          const className = codeElement.properties?.className;
          if (Array.isArray(className)) {
            const langClass = className.find((cls: string) => 
              typeof cls === 'string' && cls.startsWith('language-')
            );
            if (langClass) {
              const language = langClass.replace('language-', '');
              node.properties['data-language'] = language;
            }
          }
        }
      }
    });
  };
}

// Helper function to extract text content from a node
function extractTextContent(node: Element | Text): string {
  if (node.type === 'text') {
    return node.value;
  }
  
  if (node.type === 'element' && node.children) {
    return node.children
      .map((child) => extractTextContent(child as Element | Text))
      .join('');
  }
  
  return '';
} 