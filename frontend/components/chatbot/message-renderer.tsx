import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { PreWithCopy } from './pre-with-copy';
import { rehypeExtractCode } from '../../lib/rehype-extract-code';
import '../../styles/highlight.css';

interface MessageRendererProps {
  content: string;
  className?: string;
}

export function MessageRenderer({ content, className = "" }: MessageRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeExtractCode, rehypeHighlight, rehypeRaw, rehypeSanitize]}
        components={{
          // Custom styling for different markdown elements
          h1: ({ children, ...props }) => (
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3 mt-4 border-b border-gray-200 dark:border-gray-700 pb-2" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 mt-3 border-b border-gray-100 dark:border-gray-800 pb-1" {...props}>
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
          h5: ({ children, ...props }) => (
            <h5 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1 mt-2" {...props}>
              {children}
            </h5>
          ),
          h6: ({ children, ...props }) => (
            <h6 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 mt-2" {...props}>
              {children}
            </h6>
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
          li: ({ children, node, ...props }) => {
            // Check if this is part of an ordered list
            const isOrdered = node?.parent?.tagName === 'ol';
            const index = node?.parent?.children?.findIndex((child: any) => child === node) ?? 0;
            
            return (
              <li className="text-sm leading-relaxed flex items-start gap-2" {...props}>
                <span className="text-orange-500 mt-1 flex-shrink-0 min-w-[1rem]">
                  {isOrdered ? `${Math.floor(index / 2) + 1}.` : '•'}
                </span>
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
                  className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-orange-600 dark:text-orange-400 border" 
                  {...props}
                >
                  {children}
                </code>
              );
            } else {
              return (
                <code 
                  className={`block bg-gray-50 dark:bg-gray-900 p-3 rounded-lg text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap overflow-x-auto border ${className || ''}`}
                  {...props}
                >
                  {children}
                </code>
              );
            }
          },
          pre: ({ children, ...props }) => (
            <PreWithCopy {...props}>
              {children}
            </PreWithCopy>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-orange-500 pl-4 py-2 my-3 bg-gray-50 dark:bg-gray-800/50 italic rounded-r" {...props}>
              <div className="text-gray-700 dark:text-gray-300">
                {children}
              </div>
            </blockquote>
          ),
          a: ({ children, href, ...props }) => (
            <a 
              href={href} 
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline decoration-orange-400 hover:decoration-orange-600 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
              {...props}
            >
              {children}
            </a>
          ),
          table: ({ children, ...props }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-gray-200 dark:border-gray-700">
              <table className="min-w-full" {...props}>
                {children}
              </table>
            </div>
          ),
          thead: ({ children, ...props }) => (
            <thead className="bg-gray-50 dark:bg-gray-800" {...props}>
              {children}
            </thead>
          ),
          tbody: ({ children, ...props }) => (
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700" {...props}>
              {children}
            </tbody>
          ),
          th: ({ children, ...props }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </th>
          ),
          td: ({ children, ...props }) => (
            <td className="px-4 py-3 text-sm text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700" {...props}>
              {children}
            </td>
          ),
          hr: ({ ...props }) => (
            <hr className="my-4 border-gray-200 dark:border-gray-700" {...props} />
          ),
          // Handle task lists (checkboxes)
          input: ({ type, checked, ...props }) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
          // Custom component for strikethrough text
          del: ({ children, ...props }) => (
            <del className="text-gray-500 dark:text-gray-400 line-through" {...props}>
              {children}
            </del>
          ),
          // Handle subscript and superscript
          sub: ({ children, ...props }) => (
            <sub className="text-xs" {...props}>{children}</sub>
          ),
          sup: ({ children, ...props }) => (
            <sup className="text-xs" {...props}>{children}</sup>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 