"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for older browsers
      fallbackCopy(text);
    }
  };

  // Fallback copy method for browsers that don't support the Clipboard API
  const fallbackCopy = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Fallback copy failed:', error);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={copy}
      disabled={isCopied}
      className={`h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      title={isCopied ? "Copied!" : "Copy code"}
    >
      {isCopied ? (
        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
      ) : (
        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
      )}
    </Button>
  );
} 