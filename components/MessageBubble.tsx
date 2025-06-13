import React, { useState, useEffect } from 'react';
import { Message, SenderType } from '../types';
import { CheckBadgeIcon } from './icons/HeroIcons';

interface MessageBubbleProps {
  message: Message;
  isSenderMe: boolean;
  showAvatar?: boolean;
  avatarUrl?: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSenderMe, showAvatar, avatarUrl }) => {
  const [isRead, setIsRead] = useState(false);

  useEffect(() => {
    if (isSenderMe) {
      // Simulate message being read after a delay
      const readTimer = setTimeout(() => {
        setIsRead(true);
      }, 2000 + Math.random() * 2000); // Random delay for realism
      return () => clearTimeout(readTimer);
    }
  }, [isSenderMe, message.id]);

  const bubbleAlignment = isSenderMe ? 'justify-end' : 'justify-start';
  const bubbleColor = isSenderMe 
    ? 'bg-teal-500 dark:bg-teal-600 text-white' 
    : 'bg-white dark:bg-slate-600 text-slate-800 dark:text-slate-100';
  const bubbleRadius = isSenderMe 
    ? 'rounded-l-xl rounded-br-xl' // Pointy tip for sent
    : 'rounded-r-xl rounded-bl-xl'; // Pointy tip for received

  const createMarkup = (htmlString: string) => {
    return { __html: htmlString.replace(/<br\s*\/?>/gi, '<br/>') };
  };

  return (
    <div className={`flex ${bubbleAlignment} items-end space-x-2 group animate-fade-in-up my-1.5`}>
      {showAvatar && !isSenderMe && (
        avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="w-7 h-7 rounded-full object-cover self-end shadow-sm mb-1" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-slate-300 dark:bg-slate-500 self-end shadow-sm mb-1" />
        )
      )}
       {!isSenderMe && !showAvatar && <div className="w-7"></div>} {/* Spacer if no avatar, to maintain alignment */}
      
      <div 
        className={`max-w-[70%] md:max-w-[65%] lg:max-w-[60%] px-3.5 py-2 shadow-md ${bubbleColor} ${bubbleRadius} transition-all duration-200 group-hover:shadow-lg group-hover:scale-[1.02]`}
      >
        <div className="text-sm leading-relaxed selection:bg-teal-300 selection:text-teal-900" dangerouslySetInnerHTML={createMarkup(message.text)} />
        <div className={`text-xs mt-1.5 flex items-center ${isSenderMe ? 'justify-end text-teal-100 dark:text-teal-300/80' : 'justify-end text-slate-400 dark:text-slate-500'}`}>
          <span className="opacity-80">{message.timestamp}</span>
          {isSenderMe && (
            <CheckBadgeIcon 
              className={`w-4 h-4 ml-1 transition-colors duration-500 ${isRead ? 'text-sky-300 dark:text-sky-400' : 'text-teal-200/70 dark:text-teal-300/60'}`} 
            />
          )}
        </div>
      </div>
      {/* Spacer for sent messages to align with received messages that might have an avatar indent */}
      {isSenderMe && <div className={showAvatar ? "w-0" : "w-0"}></div>} 
    </div>
  );
};

export default MessageBubble;