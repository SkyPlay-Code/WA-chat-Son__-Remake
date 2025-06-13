import React from 'react';

interface DateIndicatorProps {
  date: string;
}

const DateIndicator: React.FC<DateIndicatorProps> = ({ date }) => {
  return (
    <div className="flex justify-center my-4 sticky top-2 z-10 animate-fade-in">
      <span className="bg-slate-200/70 dark:bg-slate-700/60 backdrop-blur-sm text-slate-600 dark:text-slate-300 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md">
        {date}
      </span>
    </div>
  );
};

export default DateIndicator;