
import React, { useState, useEffect } from 'react';
import { InfinityIcon } from './Icons';

interface ChoicePageProps {
  onGoToRegister: () => void;
  onGoToLogin: () => void;
}

const AnimatedItem: React.FC<{ delay: number; children: React.ReactNode }> = ({ delay, children }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVisible(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <div className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {children}
        </div>
    );
};


const ChoicePage: React.FC<ChoicePageProps> = ({ onGoToRegister, onGoToLogin }) => {
  return (
    <div className="h-screen flex items-center justify-center w-full relative z-10 text-center">
      <div>
        <AnimatedItem delay={100}>
            <InfinityIcon className="mx-auto h-12 w-12 text-[#1E90FF] mb-5" />
        </AnimatedItem>
        <AnimatedItem delay={300}>
            <h1 className="text-5xl md:text-6xl font-serif">
                Pay<span className="italic">Loop</span>
            </h1>
        </AnimatedItem>
        <AnimatedItem delay={500}>
            <p className="mt-2 text-gray-500">Define your journey.</p>
        </AnimatedItem>
        
        <AnimatedItem delay={700}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-5">
            <button 
              onClick={onGoToRegister} 
              className="bg-transparent border border-gray-300 text-gray-700 px-8 py-3 rounded-md w-48 transition-all hover:border-[#1E90FF] hover:text-[#1E90FF] hover:-translate-y-0.5"
            >
              Register Admin
            </button>
            <button 
              onClick={onGoToLogin} 
              className="bg-[#1E90FF] text-white border border-[#1E90FF] px-8 py-3 rounded-md w-48 font-semibold transition-all hover:bg-[#1079e0] hover:border-[#1079e0] hover:-translate-y-0.5"
            >
              Login
            </button>
          </div>
        </AnimatedItem>
      </div>
    </div>
  );
};

export default ChoicePage;