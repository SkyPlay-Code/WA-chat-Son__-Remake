import React, { useEffect, useRef, useState } from 'react';
import { Message, UserProfile, SenderType } from '../types';
import ChatHeader from './ChatHeader';
import MessageBubble from './MessageBubble';
import DateIndicator from './DateIndicator';
import TypingIndicator from './TypingIndicator'; // New import
// Icons for input bar removed as bar is removed: PaperAirplaneIcon, PaperClipIcon, FaceSmileIcon

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
        className="flex-grow p-4 md:p-6 space-y-1 chat-bg-light dark:chat-bg-dark bg-repeat overflow-y-auto" // Added overflow-y-auto
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
      {/* Dummy Message Input Bar Removed */}
    </div>
  );
};

export default ChatScreen;