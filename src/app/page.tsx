"use client";

// my-flirty-website\src\app\page.tsx
import { useState } from 'react'; // useState is a React Hook, requiring "use client"
import commentsData from '@/data/flirtyComments.json'; // Use @/ for src directory alias
import React from 'react'; // Added for useEffect

// This component needs to be a Client Component because it uses useState

// Define a type for your data structure that matches the actual JSON
interface CommentEntry {
  date: string;
  specialDay: string;
  flirtyComment: string;
  risqueComment: string;
  innocentlyDirtyComment: string;
  graphicFlirtyComment: string;
}

// Function to find the closest date to today
function findClosestDateToToday(): string {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-11
  const currentDay = today.getDate();
  
  // Convert current date to format like "Jan 15"
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentDateString = `${monthNames[currentMonth]} ${currentDay}`;
  
  // First, try to find an exact match
  const exactMatch = commentsData.find(comment => comment.date === currentDateString);
  if (exactMatch) {
    return currentDateString;
  }
  
  // If no exact match, find the closest date
  let closestDate = commentsData[0]?.date || '';
  let minDifference = Infinity;
  
  commentsData.forEach(comment => {
    if (comment.date) {
      const [month, day] = comment.date.split(' ');
      const commentMonth = monthNames.indexOf(month);
      const commentDay = parseInt(day);
      
      // Calculate difference in days (simplified - assumes same year)
      const difference = Math.abs((commentMonth * 30 + commentDay) - (currentMonth * 30 + currentDay));
      
      if (difference < minDifference) {
        minDifference = difference;
        closestDate = comment.date;
      }
    }
  });
  
  return closestDate;
}

export default function HomePage() {
  const [flirtLevel, setFlirtLevel] = useState<'flirtyComment' | 'risqueComment' | 'innocentlyDirtyComment' | 'graphicFlirtyComment'>('flirtyComment');
  const [selectedDate, setSelectedDate] = useState<string>(() => findClosestDateToToday());
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [showRandomMessage, setShowRandomMessage] = useState(false);
  const [isAgeVerified, setIsAgeVerified] = useState(false);
  const [showAgeVerification, setShowAgeVerification] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState('');

  const handleDateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(event.target.value);
    setFlirtLevel('flirtyComment');
  };

  const handleFlirtLevelChange = (level: typeof flirtLevel) => {
    setFlirtLevel(level);
  };

  const handleCopyToClipboard = async () => {
    if (currentComment) {
      try {
        await navigator.clipboard.writeText(currentComment[flirtLevel]);
        setShowCopiedMessage(true);
        setTimeout(() => setShowCopiedMessage(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const handleShowRandomComment = () => {
    const randomIndex = Math.floor(Math.random() * commentsData.length);
    const randomComment = commentsData[randomIndex];
    if (randomComment.date) {
      setSelectedDate(randomComment.date);
      setShowRandomMessage(true);
      setTimeout(() => setShowRandomMessage(false), 2000);
    }
  };

  const handleIYKYKClick = () => {
    setShowAgeVerification(true);
  };

  const handleAgeVerification = () => {
    setIsAgeVerified(true);
    setShowAgeVerification(false);
    setFlirtLevel('graphicFlirtyComment');
  };

  const handleCountdownClick = () => {
    setShowCountdown(true);
    setTimeout(() => setShowCountdown(false), 2000); // Hide after 2 seconds
  };

  // Countdown calculation
  React.useEffect(() => {
    const targetDate = new Date('December 20, 2027 18:00:00').getTime();
    
    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setCountdown('Time has arrived...');
      }
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const currentComment = commentsData.find(comment => comment.date === selectedDate) as CommentEntry | undefined;



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-5xl w-full py-10 relative z-10">
        <div className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl shadow-2xl max-w-3xl w-full mx-auto space-y-10 border border-white/20">
          {/* Header with animated gradient text */}
          <div className="text-center space-y-4">
            <h1 className="text-6xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse">
              Daily Flirt
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
            <p className="text-white/80 text-lg font-medium">
              Your daily dose of tingles (
              <button 
                onClick={handleIYKYKClick}
                className={`transition-all duration-300 cursor-pointer ${
                  flirtLevel === 'graphicFlirtyComment' 
                    ? 'text-red-300 hover:text-red-100' 
                    : 'text-pink-300 hover:text-pink-100'
                }`}
                title="Click for graphic content (18+)"
              >
                IYKYK
              </button>
              )
            </p>
          </div>

          {/* Date Selector with glassmorphism */}
          <div className="w-full space-y-4">
            <label className="block font-bold text-white text-xl text-center">
              ✨ Select Your Date ✨
            </label>
            <div className="relative group">
              <select
                value={selectedDate}
                onChange={handleDateChange}
                className="w-full p-5 border-2 border-white/30 rounded-2xl shadow-lg focus:ring-4 focus:ring-purple-400/50 focus:border-purple-400 text-lg bg-white/10 backdrop-blur-sm text-white font-semibold appearance-none cursor-pointer transition-all duration-300 hover:bg-white/20 hover:border-white/50 group-hover:scale-[1.02]"
              >
                {commentsData.map((comment) => (
                  <option key={comment.date} value={comment.date} className="text-gray-900 bg-white">
                    {comment.date} - {comment.specialDay}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Flirt Level Selector with floating cards */}
          <div className="space-y-6">
            <h3 className="text-center text-white/90 text-lg font-semibold">Choose Your Flirt Level</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className={`relative p-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                  flirtLevel === 'flirtyComment' 
                    ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-2xl shadow-pink-500/50 border-2 border-pink-400' 
                    : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
                onClick={() => handleFlirtLevelChange('flirtyComment')}
              >
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                  😊
                </div>
                Flirty
              </button>
              <button
                className={`relative p-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                  flirtLevel === 'innocentlyDirtyComment' 
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-2xl shadow-purple-500/50 border-2 border-purple-400' 
                    : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
                onClick={() => handleFlirtLevelChange('innocentlyDirtyComment')}
              >
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">
                  😇
                </div>
                Innocent
              </button>
              <button
                className={`relative p-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 ${
                  flirtLevel === 'risqueComment' 
                    ? 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-2xl shadow-indigo-500/50 border-2 border-indigo-400' 
                    : 'bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40'
                }`}
                onClick={() => handleFlirtLevelChange('risqueComment')}
              >
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full flex items-center justify-center text-xs font-bold">
                  😏
                </div>
                Risqué
              </button>
              
            </div>
          </div>

          {/* Display Comment with animated reveal */}
          {currentComment && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative p-8 border-2 border-white/30 rounded-3xl bg-white/10 backdrop-blur-xl shadow-2xl w-full transform transition-all duration-500 hover:scale-[1.02]">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                    💬
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl text-white font-bold leading-relaxed mb-4">
                      &quot;{currentComment ? currentComment[flirtLevel] : 'No comment found'}&quot;
                    </p>
                    {flirtLevel === 'graphicFlirtyComment' && (
                      <p className="text-sm text-red-300 mt-2">
                        🔞 Graphic content active
                      </p>
                    )}

                  </div>
                </div>
              </div>
            </div>
          )}
          {!currentComment && (
            <div className="text-center p-8 border-2 border-red-400/30 rounded-3xl bg-red-500/10 backdrop-blur-sm">
              <p className="text-red-300 text-xl font-bold">No comment found for the selected date.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 space-y-4 z-20">
        <button 
          onClick={handleCopyToClipboard}
          disabled={!currentComment}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white text-2xl hover:scale-110 transition-all duration-300 transform hover:-translate-y-1 ${
            currentComment 
              ? 'bg-gradient-to-br from-pink-500 to-purple-600 shadow-pink-500/50 hover:shadow-pink-500/70' 
              : 'bg-gradient-to-br from-gray-400 to-gray-500 shadow-gray-400/50 cursor-not-allowed'
          }`}
          title="Copy comment to clipboard"
        >
          💕
        </button>
        <button 
          onClick={handleShowRandomComment}
          className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full shadow-2xl shadow-purple-500/50 flex items-center justify-center text-white text-2xl hover:scale-110 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-purple-500/70"
          title="Show random comment"
        >
          ✨
        </button>
      </div>

      {/* Age verification modal overlay */}
      {showAgeVerification && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 p-10 rounded-3xl shadow-2xl max-w-md w-full border border-white/20 text-center">
            <div className="space-y-6">
              <div className="text-6xl">🔞</div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Age Verification Required
              </h1>
              <p className="text-white/80 text-lg leading-relaxed">
                This content contains graphic adult material. You must be 18 or older to continue.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleAgeVerification}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  I am 18 or older
                </button>
                <button
                  onClick={() => setShowAgeVerification(false)}
                  className="w-full bg-white/10 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  Innocent
                </button>
              </div>
              <p className="text-white/60 text-sm">
                By clicking &ldquo;I am 18 or older&rdquo;, you confirm that you are of legal age to view this content.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Feedback messages */}
      {showCopiedMessage && (
        <div className="fixed top-8 right-8 z-30">
          <div className="bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
            <span>✅</span>
            <span className="font-semibold">Copied to clipboard!</span>
          </div>
        </div>
      )}

      {showRandomMessage && (
        <div className="fixed top-8 right-8 z-30">
          <div className="bg-purple-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 animate-bounce">
            <span>🎲</span>
            <span className="font-semibold">Random comment selected!</span>
          </div>
        </div>
      )}

      {/* Secret Countdown Modal */}
      {showCountdown && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl max-w-md w-full border border-white/20 text-center">
            <div className="text-6xl font-bold text-white font-mono">
              {countdown}
            </div>
          </div>
        </div>
      )}

      {/* Animated footer */}
      <footer className="mt-12 text-center space-y-2 relative z-10">
        <div className="flex items-center justify-center space-x-2 text-white/60 text-sm font-medium">
          <span>Powered by</span>
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-bold">Next.js</span>
          <span>&</span>
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-bold">Tailwind CSS</span>
        </div>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent mx-auto"></div>
        <div className="text-white/40 text-xs font-medium">
          Made with <button 
            onClick={handleCountdownClick}
            className="hover:scale-110 transition-transform duration-300"
          >
            💕
          </button> by <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent font-bold">LaskoCreative</span>
        </div>
      </footer>
    </div>
  );
}