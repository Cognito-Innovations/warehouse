"use client";
import React, { useState, useEffect } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";

interface CopyButtonAdvancedProps {
  text: string;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost" | "minimal";
  showText?: boolean;
  showTooltip?: boolean;
  onCopy?: (text: string) => void;
  onError?: (error: Error) => void;
  disabled?: boolean;
}

const CopyButtonAdvanced: React.FC<CopyButtonAdvancedProps> = ({ 
  text, 
  className = "", 
  size = "md",
  variant = "default",
  showText = false,
  showTooltip = true,
  onCopy,
  onError,
  disabled = false
}) => {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  // Reset states after animation
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleCopy = async () => {
    if (disabled || !text) return;

    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      
      setCopied(true);
      setError(false);
      onCopy?.(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setError(true);
      setCopied(false);
      onError?.(err as Error);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "p-1";
      case "sm":
        return "p-1.5";
      case "lg":
        return "p-3";
      default:
        return "p-2";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "xs":
        return "w-3 h-3";
      case "sm":
        return "w-3.5 h-3.5";
      case "lg":
        return "w-5 h-5";
      default:
        return "w-4 h-4";
    }
  };

  const getVariantClasses = () => {
    const baseClasses = "rounded transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1";
    
    switch (variant) {
      case "outline":
        return `${baseClasses} border border-gray-300 hover:border-gray-400 ${
          copied ? "border-green-500 bg-green-50" : 
          error ? "border-red-500 bg-red-50" : 
          "hover:bg-gray-50"
        }`;
      case "ghost":
        return `${baseClasses} ${
          copied ? "bg-green-100 text-green-700" : 
          error ? "bg-red-100 text-red-700" : 
          "hover:bg-gray-100"
        }`;
      case "minimal":
        return `${baseClasses} ${
          copied ? "text-green-600" : 
          error ? "text-red-600" : 
          "text-gray-400 hover:text-gray-600"
        }`;
      default:
        return `${baseClasses} ${
          copied ? "text-green-600 hover:text-green-700 hover:bg-green-50" : 
          error ? "text-red-600 hover:text-red-700 hover:bg-red-50" : 
          "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        }`;
    }
  };

  const getStatusIcon = () => {
    if (error) {
      return <AlertCircle className={`${getIconSize()} animate-pulse`} />;
    }
    if (copied) {
      return <Check className={`${getIconSize()} animate-bounce`} />;
    }
    return <Copy className={`${getIconSize()}`} />;
  };

  const getTooltipText = () => {
    if (error) return "Copy failed";
    if (copied) return "Copied!";
    return "Copy to clipboard";
  };

  const getStatusText = () => {
    if (error) return "Failed";
    if (copied) return "Copied!";
    return "Copy";
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleCopy}
        className={`
          ${getSizeClasses()}
          ${getVariantClasses()}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
        title={showTooltip ? getTooltipText() : undefined}
        disabled={disabled || !text}
      >
        <div className="flex items-center gap-1">
          {getStatusIcon()}
          {showText && (
            <span className={`text-xs ${
              error ? "text-red-600" : 
              copied ? "text-green-600" : 
              "text-gray-500"
            }`}>
              {getStatusText()}
            </span>
          )}
        </div>
      </button>
      
      {/* Tooltip */}
      {showTooltip && (copied || error) && (
        <div className={`
          absolute -top-8 left-1/2 transform -translate-x-1/2 
          px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap text-xs font-medium
          ${error ? "bg-red-800 text-white" : "bg-gray-800 text-white"}
          animate-in fade-in-0 zoom-in-95 duration-200
        `}>
          {getTooltipText()}
        </div>
      )}
    </div>
  );
};

export default CopyButtonAdvanced;
