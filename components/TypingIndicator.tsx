import React, { useEffect } from 'react';

interface TypingIndicatorProps {
  avatarUrl?: string;
}

// Module-level counter and ID for managing the injected style tag
let typingIndicatorInstanceCount = 0;
const TYPING_INDICATOR_STYLE_ID = 'typing-indicator-dynamic-styles';

const typingIndicatorCSS = `
  .typing-dot-pulse {
    animation-name: typing_indicator_custom_pulse_kf;
    animation-duration: 1.2s;
    animation-iteration-count: infinite;
    animation-timing-function: ease-in-out;
  }
  .typing-dot-pulse.delay-0s {
    animation-delay: 0s;
  }
  .typing-dot-pulse.delay-200ms {
    animation-delay: 0.2s;
  }
  .typing-dot-pulse.delay-400ms {
    animation-delay: 0.4s;
  }

  @keyframes typing_indicator_custom_pulse_kf {
    0%, 100% {
      opacity: 0.5;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ avatarUrl }) => {
  useEffect(() => {
    typingIndicatorInstanceCount++;

    if (typingIndicatorInstanceCount === 1) {
      // Only add style if it's the first instance and style doesn't exist
      if (!document.getElementById(TYPING_INDICATOR_STYLE_ID)) {
        const styleElement = document.createElement('style');
        styleElement.id = TYPING_INDICATOR_STYLE_ID;
        styleElement.innerHTML = typingIndicatorCSS;
        document.head.appendChild(styleElement);
      }
    }

    return () => {
      typingIndicatorInstanceCount--;
      if (typingIndicatorInstanceCount === 0) {
        const styleElement = document.getElementById(TYPING_INDICATOR_STYLE_ID);
        if (styleElement) {
          styleElement.remove();
        }
      }
    };
  }, []);

  return (
    <div className="flex items-end space-x-2 animate-fade-in-up my-1.5 group">
      {avatarUrl ? (
        <img src={avatarUrl} alt="typing user avatar" className="w-7 h-7 rounded-full object-cover self-end shadow-sm mb-1" />
      ) : (
        <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-500 self-end shadow-sm mb-1" />
      )}
      <div className="px-3.5 py-3 bg-white dark:bg-slate-600 rounded-r-xl rounded-tl-xl shadow-md">
        <div className="flex space-x-1.5 items-center">
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full typing-dot-pulse delay-0s"></div>
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full typing-dot-pulse delay-200ms"></div>
          <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full typing-dot-pulse delay-400ms"></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
