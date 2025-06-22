import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MessageRendererProps {
  content: string;
  className?: string;
}

export function MessageRenderer({ content, className = "" }: MessageRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ children, ...props }) => (
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 mt-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3" {...props}>
              {children}
            </h3>
          ),
          h4: ({ children, ...props }) => (
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3" {...props}>
              {children}
            </h4>
          ),
          p: ({ children, ...props }) => (
            <p className="text-sm leading-relaxed my-2 text-gray-800 dark:text-gray-200" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-none ml-0 my-3 space-y-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-none ml-0 my-3 space-y-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => {
            // Simple bullet point styling for all list items
            return (
              <li className="text-sm leading-relaxed flex items-start gap-2" {...props}>
                <span className="text-orange-500 mt-1 flex-shrink-0">•</span>
                <span className="flex-1">{children}</span>
              </li>
            );
          },
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props}>
              {children}
            </strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic text-gray-800 dark:text-gray-200" {...props}>
              {children}
            </em>
          ),
          code: ({ children, className, ...props }) => {
            const isInline = !className?.includes('language-');
            
            if (isInline) {
              return (
                <code 
                  className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400" 
                  {...props}
                >
                  {children}
                </code>
              );
            } else {
              return (
                <code 
                  className="block bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap" 
                  {...props}
                >
                  {children}
                </code>
              );
            }
          },
          pre: ({ children, ...props }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-3 overflow-x-auto" {...props}>
              {children}
            </pre>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-orange-500 pl-4 py-2 my-3 bg-gray-50 dark:bg-gray-800/50 italic" {...props}>
              {children}
            </blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-3">
              <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          th: ({ children, ...props }) => (
            <th className="px-3 py-2 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-3 py-2 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr className="my-4 border-gray-200 dark:border-gray-700" {...props} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 