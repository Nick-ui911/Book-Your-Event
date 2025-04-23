import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

export default function SuccessMessage({ isVisible, onClose }) {
  const [animation, setAnimation] = useState('scale-90 opacity-0');
  
  useEffect(() => {
    if (isVisible) {
      // Start animation
      const entryTimer = setTimeout(() => {
        setAnimation('scale-100 opacity-100');
      }, 10);
      
      // Auto-close after 4 seconds
      const exitTimer = setTimeout(() => {
        setAnimation('scale-90 opacity-0');
        setTimeout(onClose, 300);
      }, 4000);
      
      return () => {
        clearTimeout(entryTimer);
        clearTimeout(exitTimer);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 backdrop-blur-sm transition-opacity duration-300">
      <div className={`bg-gradient-to-r from-blue-300 to-purple-300 text-black rounded-xl shadow-2xl p-8 max-w-md mx-auto text-center transform transition-all duration-300 ${animation}`}>
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-black h-16 w-16" />
        </div>
        <h2 className="text-3xl font-bold mb-3">Success!</h2>
        <p className="text-xl mb-6">
          Your event has been posted successfully!
        </p>
        <p className="text-lg text-black">
          Attendees can now find and register for your event.
        </p>
        <button 
          onClick={onClose}
          className="mt-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium py-2 px-6 rounded-lg hover:bg-green-50 transition-colors duration-200 shadow-md"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}