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
      className={`absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-mono py-1 px-2 rounded transition-colors duration-150 ${isCopied ? 'opacity-70 cursor-default' : ''} ${className || ''}`}
      aria-label="Copy code to clipboard"
    >
      {isCopied ? 'Copied!' : 'Copy'}
    </button>
  );
};

export default CopyButton;
