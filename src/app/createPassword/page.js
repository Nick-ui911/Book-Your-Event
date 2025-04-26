"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import { Lock, Eye, EyeOff, Check, AlertCircle, Key, Shield } from "lucide-react";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const router = useRouter();

  // Check password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  // Check if passwords match
  useEffect(() => {
    if (!confirmPassword) return;
    setPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.patch(BASE_URL + "/createPassword", {
        password,
      });

      setMessage(response.data.message);
      setPassword("");
      setConfirmPassword("");

      // Optional: redirect to dashboard or login page
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to create password";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const SmallSpinner = () => (
    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-middle text-white">
      <span className="sr-only">Loading...</span>
    </div>
  );

  return (
  <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-300  py-12 px-4 ">
      <div className="max-w-md mx-auto mt-8 p-8 border rounded-xl shadow-lg bg-white dark:bg-gray-800">
      <div className="flex flex-col items-center mb-6">
        <div className="p-4 bg-green-100 dark:bg-green-900 rounded-full mb-4">
          <Lock className="h-10 w-10 text-green-600 dark:text-green-300" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Create Password</h2>
        <p className="text-center mt-2 text-gray-600 dark:text-gray-300">
          You don't have a password yet. Create one to secure your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" /> : 
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              }
            </button>
          </div>
          
          {password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1 flex-1 rounded-full ${
                      i < passwordStrength 
                        ? passwordStrength === 1 ? 'bg-red-500' 
                        : passwordStrength === 2 ? 'bg-yellow-500' 
                        : passwordStrength === 3 ? 'bg-blue-500' 
                        : 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  ></div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {passwordStrength === 0 && "Too weak"}
                {passwordStrength === 1 && "Weak password"}
                {passwordStrength === 2 && "Medium strength"}
                {passwordStrength === 3 && "Strong password"}
                {passwordStrength === 4 && "Very strong password"}
              </p>
            </div>
          )}
          
          {password && passwordStrength > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-4">
              <div className={`flex items-center text-xs ${password.length >= 8 ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <Check className={`h-4 w-4 mr-1 ${password.length >= 8 ? 'opacity-100' : 'opacity-40'}`} />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center text-xs ${/[A-Z]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <Check className={`h-4 w-4 mr-1 ${/[A-Z]/.test(password) ? 'opacity-100' : 'opacity-40'}`} />
                <span>Uppercase letter</span>
              </div>
              <div className={`flex items-center text-xs ${/[0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <Check className={`h-4 w-4 mr-1 ${/[0-9]/.test(password) ? 'opacity-100' : 'opacity-40'}`} />
                <span>Number</span>
              </div>
              <div className={`flex items-center text-xs ${/[^A-Za-z0-9]/.test(password) ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                <Check className={`h-4 w-4 mr-1 ${/[^A-Za-z0-9]/.test(password) ? 'opacity-100' : 'opacity-40'}`} />
                <span>Special character</span>
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Confirm Password</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Shield className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${
                confirmPassword 
                  ? passwordMatch 
                    ? 'border-green-500 focus:border-green-500 focus:ring-green-500' 
                    : 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600 focus:border-green-500 focus:ring-green-500'
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? 
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" /> : 
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
              }
            </button>
          </div>
          {confirmPassword && !passwordMatch && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Passwords don't match</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || (confirmPassword && !passwordMatch)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <SmallSpinner/> : "Create Password"}
          </button>
        </div>

        {message && (
          <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-start">
            <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300">{message}</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </form>
    </div>
  </div>
  );
}