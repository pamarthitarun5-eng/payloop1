
import React, { useState } from 'react';
import { AdminCredentials } from '../types';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from './Icons';

interface RegisterPageProps {
  onRegister: (credentials: AdminCredentials) => void;
  onBack: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onBack }) => {
  const [businessName, setBusinessName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = () => {
    if (!businessName || !username || !password) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    onRegister({ businessName, username, password });
  };

  return (
    <div className="h-screen flex items-center justify-center w-full p-4">
      <div className="w-full max-w-sm p-8 md:p-10 border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-500 mb-8 text-sm hover:text-[#1E90FF] transition-colors">
          <ArrowLeftIcon className="h-4 w-4" /> Return
        </button>
        
        <h2 className="text-3xl font-serif">Create Account</h2>
        <p className="text-gray-500 text-sm mb-8">Register your business.</p>
        
        <div className="space-y-6">
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Business Name</label>
            <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="e.g. Nfinite Cafe" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
          </div>
          
          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#1E90FF]">
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">Confirm Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••" className="w-full bg-transparent border-b border-gray-300 py-2 text-black placeholder-gray-400 focus:border-[#1E90FF] focus:outline-none transition"/>
              <button onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-[#1E90FF]">
                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button onClick={handleRegister} className="w-full bg-[#1E90FF] text-white py-3 rounded-md font-semibold transition-all hover:bg-[#1079e0]">
            Register
          </button>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;