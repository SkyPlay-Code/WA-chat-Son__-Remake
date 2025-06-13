import React from 'react';
import { LockClosedIcon, ArrowRightIcon } from './icons/HeroIcons';

interface AccessScreenProps {
  accessCode: string;
  onAccessCodeChange: (code: string) => void;
  onSubmit: () => void;
  errorMessage: string;
  receiverName: string;
  senderName: string;
}

const AccessScreen: React.FC<AccessScreenProps> = ({
  accessCode,
  onAccessCodeChange,
  onSubmit,
  errorMessage,
  receiverName,
  senderName
}) => {
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center animated-gradient-background p-4 transition-all duration-500 ease-in-out">
      <div className="bg-white/10 dark:bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500 ease-in-out scale-100 hover:scale-105 animate-fade-in-down">
        <div className="flex justify-center mb-6">
          <LockClosedIcon className="h-16 w-16 text-white/90" />
        </div>
        <h2 className="text-3xl font-bold text-center text-white mb-3">Access Required</h2>
        <p className="text-sm text-center text-white/80 mb-6 px-4">
          To access this chat between <strong className="font-semibold text-white">{receiverName}</strong> and <strong className="font-semibold text-white">{senderName}</strong>, please enter the access code.
        </p>
        <div className="space-y-5">
          <input
            type="password"
            id="accessCodeInput"
            value={accessCode}
            onChange={(e) => onAccessCodeChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter access code"
            aria-label="Access Code"
            aria-required="true"
            aria-invalid={!!errorMessage}
            aria-describedby="errorMessage"
            className="w-full px-4 py-3.5 rounded-lg border-2 border-white/30 focus:border-white/70 bg-white/20 dark:bg-slate-700/30 text-white dark:text-slate-100 placeholder-white/60 dark:placeholder-slate-400 focus:ring-2 focus:ring-white/50 dark:focus:ring-sky-400/50 outline-none transition-all duration-300 text-center text-lg tracking-wider"
          />
          <button
            id="accessCodeButton"
            onClick={onSubmit}
            className="w-full flex items-center justify-center bg-white/90 hover:bg-white text-teal-600 dark:bg-sky-500 dark:hover:bg-sky-400 dark:text-white font-bold py-3.5 px-6 rounded-lg shadow-xl hover:shadow-2xl transform transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-white/50 dark:focus:ring-sky-300/50 active:scale-95 group"
          >
            Access Chat
            <ArrowRightIcon className="h-5 w-5 ml-2.5 transform transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>
        {errorMessage && (
          <p id="errorMessage" role="alert" className="text-red-300 dark:text-red-400 text-sm font-semibold text-center mt-5 animate-shake">
            {errorMessage}
          </p>
        )}
      </div>
      <footer className="absolute bottom-4 text-center text-xs text-white/60 dark:text-slate-400/70">
        <p>&copy; {new Date().getFullYear()} Confidential Chat Viewer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AccessScreen;