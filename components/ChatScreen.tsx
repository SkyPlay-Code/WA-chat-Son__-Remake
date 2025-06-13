import React, { useEffect, useRef, useState } from 'react';
import { Message, UserProfile, SenderType } from '../types';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import DateIndicator from './DateIndicator';
import TypingIndicator from './TypingIndicator'; // New import
import { PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon } from './icons/HeroIcons';

interface ChatScreenProps {
  messages: Message[];
  currentUser: UserProfile;
  otherUser: UserProfile;
}

const MESSAGE_LOAD_DELAY = 1200; // ms between messages
const TYPING_INDICATOR_DURATION = 800; // ms to show typing indicator

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, currentUser, otherUser }) => {
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [displayedMessages, setDisplayedMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (currentMessageIndex < messages.length) {
      const nextMessage = messages[currentMessageIndex];
      
      let delay = MESSAGE_LOAD_DELAY;
      if (nextMessage.sender === SenderType.OTHER) {
        setIsTyping(true);
        delay += TYPING_INDICATOR_DURATION; 
      }

      const timer = setTimeout(() => {
        if (nextMessage.sender === SenderType.OTHER) {
          setIsTyping(false);
        }
        setDisplayedMessages((prevMessages) => [...prevMessages, nextMessage]);
        setCurrentMessageIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [currentMessageIndex, messages]);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [displayedMessages, isTyping]); // Scroll on new message or typing indicator change

  const groupMessagesByDate = (msgs: Message[]): Record<string, Message[]> => {
    return msgs.reduce<Record<string, Message[]>>((acc, msg) => {
      const dateKey = msg.date;
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(msg);
      return acc;
    }, {});
  };

  const groupedDisplayedMessages = groupMessagesByDate(displayedMessages);
  const sortedDates = Object.keys(groupedDisplayedMessages).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-white dark:bg-slate-800 shadow-2xl overflow-hidden rounded-none sm:rounded-lg animate-fade-in">
      <ChatHeader user={otherUser} />
      <div 
        ref={chatAreaRef}
        className="flex-grow p-4 md:p-6 space-y-1 chat-bg-light dark:chat-bg-dark bg-repeat"
        aria-live="polite"
      >
        {sortedDates.map((date) => (
          <React.Fragment key={date}>
            <DateIndicator date={formatDateForDisplay(date)} />
            {groupedDisplayedMessages[date].map((msg, index) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSenderMe={msg.sender === SenderType.ME}
                showAvatar={msg.sender === SenderType.OTHER && (index === 0 || groupedDisplayedMessages[date][index-1]?.sender !== SenderType.OTHER)}
                avatarUrl={otherUser.avatarUrl}
              />
            ))}
          </React.Fragment>
        ))}
        {isTyping && <TypingIndicator avatarUrl={otherUser.avatarUrl} />}
      </div>
      {/* Dummy Message Input Bar */}
      <div className="bg-slate-100 dark:bg-slate-700 p-3 md:p-4 border-t border-slate-200 dark:border-slate-600 flex items-center space-x-2 md:space-x-3">
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
          <FaceSmileIcon className="w-6 h-6 md:w-7 md:h-7" />
        </button>
        <button className="p-2 text-slate-500 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300 transition-colors rounded-full hover:bg-slate-200 dark:hover:bg-slate-600">
          <PaperClipIcon className="w-6 h-6 md:w-7 md:h-7 transform rotate-45" />
        </button>
        <input
          type="text"
          placeholder="Type a message..."
          disabled
          className="flex-grow p-3 rounded-full bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 focus:ring-2 focus:ring-teal-500 dark:focus:ring-teal-400 focus:border-transparent outline-none text-sm md:text-base text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        />
        <button className="p-3 bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white rounded-full transition-colors shadow-md hover:shadow-lg transform active:scale-95">
          <PaperAirplaneIcon className="w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;