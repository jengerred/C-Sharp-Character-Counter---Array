import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-bash';
// Add other languages as needed
// import 'prismjs/themes/prism-okaidia.css'; // Example theme, or use custom styles

import CopyButton from './CopyButton';

interface CodeBlockProps {
  codeString: string;
  language: string;
  title?: string;
  className?: string; // Allow passing additional classes for the pre tag
}

const CodeBlock: React.FC<CodeBlockProps> = ({ codeString, language, title, className }) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [codeString, language]);

  // Base styles for the main block <div> - flex container
  const mainBlockStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    color: '#333',
    backgroundColor: '#f8f8f8', // Main component background
    border: '2px solid #3b82f6', // Blue border
    borderRadius: '0.5rem',
    overflowX: 'auto',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '0.875em',
    lineHeight: '1.5',
    paddingRight: '1rem',
  };

  // Styles for the new inner wrapper that will contain the button and pre
  const contentWrapperStyle: React.CSSProperties = {
    position: 'relative', // For CopyButton absolute positioning
    padding: '1rem',      // Uniform padding
    width: '100%',
    // VISIBLE BACKGROUND FOR DEBUGGING
  };

  // Minimal style for the <pre> tag itself
  const preTagStyle: React.CSSProperties = {
    margin: 0,
    padding: 0, 
    backgroundColor: 'transparent',
    border: 'none',
    boxShadow: 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
  };

  return (
    <div className="my-4" style={mainBlockStyle}>
      {/* {title && <h4 className="text-md font-semibold mb-1 text-gray-700 px-4 pt-3">{title}</h4>} // TITLE TEMPORARILY REMOVED */}
      <div style={contentWrapperStyle}> {/* Yellow background div */}
        <CopyButton textToCopy={codeString} /> {/* Has absolute top-1 right-1 */}
        <pre tabIndex={0} style={preTagStyle} className={`language-${language}${className ? ` ${className}` : ''}`}>
          <code className={`language-${language}`}>{codeString}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;
