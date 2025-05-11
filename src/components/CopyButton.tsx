import { useState, useEffect } from 'react';

interface CopyButtonProps {
  textToCopy: string;
  className?: string; // Allow passing custom classes for styling
}

const CopyButton: React.FC<CopyButtonProps> = ({ textToCopy, className }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Optionally, provide user feedback about the error
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, 2000); // Reset "Copied!" message after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <button
      onClick={handleCopy}
      disabled={isCopied}
      style={{ backgroundColor: 'transparent', position: 'absolute', top: '0.25rem', right: '0.25rem' }} // Force transparent background and positioning
      className={`absolute top-1 right-1 bg-transparent text-gray-500 hover:text-gray-700 p-1.5 rounded transition-colors duration-150 ${isCopied ? 'text-green-500 opacity-70 cursor-default' : ''} ${className || ''}`}
      aria-label="Copy code to clipboard"
    >
      {isCopied ? 'Copied!' : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#6B7280" /* gray-500 */ viewBox="0 0 16 16">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
        </svg>
      )}
    </button>
  );
};

export default CopyButton;
