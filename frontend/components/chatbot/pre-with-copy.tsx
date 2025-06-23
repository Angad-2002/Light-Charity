import React from 'react';
import { CopyButton } from './copy-button';

interface PreWithCopyProps {
  children?: React.ReactNode;
  className?: string;
  raw?: string;
  'data-language'?: string;
  [key: string]: any;
}

export function PreWithCopy({ 
  children, 
  className = '', 
  raw,
  'data-language': dataLanguage,
  ...props 
}: PreWithCopyProps) {
  // Extract language from className if not provided in data-language
  const getLanguage = () => {
    if (dataLanguage) return dataLanguage;
    
    // Extract language from className like "language-javascript"
    const match = className.match(/language-(\w+)/);
    return match ? match[1] : 'code';
  };

  // Extract raw text content from children if raw is not provided
  const getRawText = (): string => {
    if (raw) return raw;
    
    // Try to extract text content from the code element
    if (React.isValidElement(children)) {
      const codeElement = React.Children.toArray(children).find(
        (child) => React.isValidElement(child) && child.type === 'code'
      ) as React.ReactElement;
      
      if (codeElement && codeElement.props.children) {
        if (typeof codeElement.props.children === 'string') {
          return codeElement.props.children;
        }
        // Handle nested text nodes
        return React.Children.toArray(codeElement.props.children)
          .map((child) => typeof child === 'string' ? child : '')
          .join('');
      }
    }
    
    // Fallback: try to get text content from any children
    return React.Children.toArray(children)
      .map((child) => typeof child === 'string' ? child : '')
      .join('');
  };

  const language = getLanguage();
  const rawText = getRawText();

  return (
    <div className="relative group my-3">
      {/* Code header with language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 border-b-0 rounded-t-lg">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          {language}
        </span>
        <CopyButton 
          text={rawText} 
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
      
      {/* Code content */}
      <pre 
        {...props}
        className={`bg-gray-50 dark:bg-gray-900 p-3 rounded-t-none rounded-b-lg overflow-x-auto border border-gray-200 dark:border-gray-700 ${className}`}
      >
        {children}
      </pre>
    </div>
  );
} 