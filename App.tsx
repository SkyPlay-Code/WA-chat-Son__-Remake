import React, { useState, useEffect } from 'react';
import AccessScreen from './components/AccessScreen';
import ChatScreen from './components/ChatScreen';
import { ACCESS_CODE, initialMessages, CHAT_PARTICIPANTS } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [accessCodeInput, setAccessCodeInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading state

  useEffect(() => {
    // Simulate initial loading, then fade in the app
    const timer = setTimeout(() => setIsLoading(false), 200); // Short delay for pre-render
    return () => clearTimeout(timer);
  }, []);
  
  const handleAccessSubmit = () => {
    if (accessCodeInput === ACCESS_CODE) {
      setIsAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage("Invalid access code. Please try again.");
      setAccessCodeInput(''); 
      // Trigger shake animation on error message if it's already visible
      const errorEl = document.getElementById('errorMessage');
      if (errorEl) {
        errorEl.classList.remove('animate-shake');
        void errorEl.offsetWidth; // Trigger reflow
        errorEl.classList.add('animate-shake');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-900">
        {/* Optional: Add a more sophisticated loading spinner here */}
      </div>
    );
  }

  return (
    <div className={`app-container h-screen w-screen animate-fade-in`}>
      {!isAuthenticated ? (
        <AccessScreen
          accessCode={accessCodeInput}
          onAccessCodeChange={setAccessCodeInput}
          onSubmit={handleAccessSubmit}
          errorMessage={errorMessage}
          receiverName={CHAT_PARTICIPANTS.other.name}
          senderName={CHAT_PARTICIPANTS.me.name}
        />
      ) : (
        <ChatScreen 
          messages={initialMessages} 
          currentUser={CHAT_PARTICIPANTS.me} 
          otherUser={CHAT_PARTICIPANTS.other} 
        />
      )}
    </div>
  );
};

export default App;