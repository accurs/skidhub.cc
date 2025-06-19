
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock = ({ code, language }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const getLanguageColor = (lang: string) => {
    const colors: Record<string, string> = {
      typescript: 'text-blue-400',
      javascript: 'text-yellow-400',
      python: 'text-green-400',
      css: 'text-purple-400',
      html: 'text-orange-400',
      java: 'text-red-400',
      json: 'text-cyan-400',
    };
    return colors[lang] || 'text-gray-400';
  };

  const highlightCode = (code: string, language: string) => {
    if (language === 'typescript' || language === 'javascript') {
      return code
        .replace(/(import|export|from|const|let|var|function|class|interface|type|return|if|else|for|while|switch|case|default|break|continue|try|catch|finally|throw|async|await)/g, '<span class="text-purple-400 font-medium">$1</span>')
        .replace(/(true|false|null|undefined)/g, '<span class="text-orange-400">$1</span>')
        .replace(/("[^"]*"|'[^']*'|`[^`]*`)/g, '<span class="text-green-400">$1</span>')
        .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>');
    }
    
    if (language === 'css') {
      return code
        .replace(/([.#]?[a-zA-Z-]+)(?=\s*{)/g, '<span class="text-yellow-400">$1</span>')
        .replace(/(color|background|margin|padding|border|font|width|height|display|position|top|right|bottom|left|z-index|opacity|transform|transition):/g, '<span class="text-blue-400">$1</span>:')
        .replace(/(#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|[0-9]+px|[0-9]+em|[0-9]+rem|[0-9]+%)/g, '<span class="text-orange-400">$1</span>')
        .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-gray-500 italic">$1</span>');
    }

    return code;
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className={`text-xs font-medium ${getLanguageColor(language)}`}>
          {language.toUpperCase()}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 px-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="bg-gray-950 overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code 
            className="text-gray-200 font-mono"
            dangerouslySetInnerHTML={{ __html: highlightCode(code, language) }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
