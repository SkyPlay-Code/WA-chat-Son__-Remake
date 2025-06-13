import React from 'react';
import { UserProfile } from '../types';
import { ArrowLeftIcon } from './icons/HeroIcons';

interface ChatHeaderProps {
  user: UserProfile;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ user }) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white p-3 md:p-4 flex items-center space-x-3 shadow-md sticky top-0 z-20 animate-fade-in-down">
      <button aria-label="Back" className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-full transition-colors md:hidden">
        <ArrowLeftIcon className="w-6 h-6" />
      </button>
      {user.avatarUrl ? (
        <img
          src={user.avatarUrl}
          alt={`${user.name}'s avatar`}
          className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover border-2 border-white dark:border-slate-500 shadow-sm"
        />
      ) : (
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-slate-300 dark:bg-slate-500 flex items-center justify-center text-slate-500 dark:text-slate-300 text-xl font-semibold shadow-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-grow">
        <h2 className="font-semibold text-base md:text-lg truncate">{user.name}</h2>
        {/* Display status only if it exists, otherwise display nothing */}
        {user.status && (
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            {user.status}
          </p>
        )}
      </div>
      {/* Call and options buttons removed */}
    </div>
  );
};

export default ChatHeader;