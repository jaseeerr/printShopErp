import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

const PasswordForm = () => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const passwordsMatch = password === repeatPassword && password !== '';

  return (
    <div className=" bg-gray-100 flex items-center justify-center px-4">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Change Password</h2>
        
        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="repeatPassword" className="block mb-2 text-sm font-medium text-gray-700">
            Repeat Password
          </label>
          <div className="relative">
            <input
              type={showRepeatPassword ? 'text' : 'password'}
              id="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <button
              type="button"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800"
            >
              {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {(password || repeatPassword) && (
          <div className={`mb-6 flex items-center ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
            {passwordsMatch ? (
              <>
                <Check size={20} className="mr-2" />
                <span>Passwords match</span>
              </>
            ) : (
              <>
                <X size={20} className="mr-2" />
                <span>Passwords do not match</span>
              </>
            )}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-50 transition-colors duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PasswordForm;