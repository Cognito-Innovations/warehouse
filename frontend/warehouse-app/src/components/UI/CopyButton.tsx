"use client";
import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const CopyButton: React.FC<CopyButtonProps> = ({ 
  text, 
  className = "", 
  size = "md",
  showText = false 
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "p-1";
      case "lg":
        return "p-3";
      default:
        return "p-2";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-3 h-3";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-4 h-4";
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className={`
          ${getSizeClasses()}
          ${copied 
            ? "text-green-600 hover:text-green-700 hover:bg-green-50" 
            : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          }
          rounded transition-all duration-200 ease-in-out
          ${className}
        `}
        title={copied ? "Copied!" : "Copy to clipboard"}
        disabled={copied}
      >
        {copied ? (
          <Check className={`${getIconSize()} transition-transform duration-200`} />
        ) : (
          <Copy className={`${getIconSize()} transition-transform duration-200`} />
        )}
      </button>
      
      {/* Tooltip */}
      {copied && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
          Copied!
        </div>
      )}
      
      {/* Optional text display */}
      {showText && (
        <span className="ml-2 text-xs text-gray-500">
          {copied ? "Copied!" : "Copy"}
        </span>
      )}
    </div>
  );
};

export default CopyButton;
