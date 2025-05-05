"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants/apiUrl";
import {
  Shield,
  Eye,
  EyeOff,
  Key,
  Lock,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import SmallSpinner from "../components/SmallSpinner";

export default function UpdatePasswordForm() {
  const user = useSelector((store) => store.user);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Only run this on the client-side after user is available
    if (!user?.password) {
      router.push("/createPassword");
    }
  }, [user, router]);

  // Check password strength
  useEffect(() => {
    if (!newPassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (newPassword.length >= 8) strength += 1;
    if (/[A-Z]/.test(newPassword)) strength += 1;
    if (/[0-9]/.test(newPassword)) strength += 1;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 1;

    setPasswordStrength(strength);
  }, [newPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await axios.patch(BASE_URL + "/updatePassword", {
        oldPassword,
        newPassword,
      });

      setMessage(response.data.message);
      router.push("/profile");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Failed to update password";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-300  py-12 px-4">
      <div className="max-w-md mx-auto p-8 border rounded-xl shadow-lg bg-white dark:bg-gray-800">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-300" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
          Update Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showOldPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowOldPassword(!showOldPassword)}
              >
                {showOldPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                )}
              </button>
            </div>

            {newPassword && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full ${
                        i < passwordStrength
                          ? passwordStrength === 1
                            ? "bg-red-500"
                            : passwordStrength === 2
                            ? "bg-yellow-500"
                            : passwordStrength === 3
                            ? "bg-blue-500"
                            : "bg-green-500"
                          : "bg-gray-200 dark:bg-gray-700"
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center"
          >
            {loading ? <SmallSpinner /> : "Update Password"}
          </button>

          {message && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
              <p className="text-sm text-green-700">{message}</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
