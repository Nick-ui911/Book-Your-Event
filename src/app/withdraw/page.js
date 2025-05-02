"use client";

import { useState } from "react";
import SmallSpinner from "../components/SmallSpinner";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import { useSelector } from "react-redux";
import { CheckCircle, AlertCircle, CreditCard, Building, User, DollarSign, ArrowRight, Shield } from "lucide-react";

export default function WithdrawForm() {
  const user = useSelector((store) => store.user);
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holderName, setHolderName] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(BASE_URL + "/withdraw", {
        accountNumber,
        ifsc,
        holderName,
        amount: Number(amount), // ensure it's a number
      });

      setAlert({
        show: true,
        type: "success",
        message: `${user?.name || "User"}, your withdrawal request has been submitted!`
      });
      
      setAccountNumber("");
      setIfsc("");
      setHolderName("");
      setAmount("");
    } catch (err) {
      setAlert({
        show: true,
        type: "error",
        message: "Withdrawal failed. Please try again."
      });
      console.error(err);
    } finally {
      setLoading(false);
      
      // Auto-hide alert after 5 seconds
      setTimeout(() => {
        setAlert({ show: false, type: "", message: "" });
      }, 5000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Alert Component */}
        {alert.show && (
          <div 
            className={`p-4 rounded-lg flex items-center shadow-md transform transition-all duration-500 ease-in-out ${alert.show ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'} 
              ${alert.type === "success" ? "bg-green-50 text-green-800 border-l-4 border-green-500" : 
              "bg-red-50 text-red-800 border-l-4 border-red-500"}`}
          >
            <span className="mr-3">
              {alert.type === "success" ? 
                <CheckCircle className="h-5 w-5 text-green-500" /> : 
                <AlertCircle className="h-5 w-5 text-red-500" />
              }
            </span>
            <span className="flex-1 font-medium">{alert.message}</span>
          </div>
        )}

        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 relative">
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="w-24 h-24 rounded-full bg-white absolute -top-12 -left-12"></div>
              <div className="w-32 h-32 rounded-full bg-white absolute -bottom-16 -right-16"></div>
            </div>
            <h2 className="text-2xl font-bold text-white text-center mb-1">Withdraw Funds</h2>
            <p className="text-blue-100 text-center text-sm">Fast and secure bank transfers</p>
          </div>

          {/* Form */}
          <form onSubmit={handleWithdraw} className="p-8 space-y-6">
            <div className="space-y-5">
              {/* Account Number */}
              <div className="space-y-2">
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 ml-1">Account Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="accountNumber"
                    type="text"
                    placeholder="Enter your account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* IFSC Code */}
              <div className="space-y-2">
                <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700 ml-1">IFSC Code</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="ifscCode"
                    type="text"
                    placeholder="Enter bank IFSC code"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="space-y-2">
                <label htmlFor="holderName" className="block text-sm font-medium text-gray-700 ml-1">Account Holder Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="holderName"
                    type="text"
                    placeholder="Enter account holder's name"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 ml-1">Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-blue-500" />
                  </div>
                  <input
                    id="amount"
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="flex items-center p-3 bg-blue-50 rounded-lg text-blue-700 text-sm">
              <Shield className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>Your transaction is protected with secure encryption</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-4 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-blue-500/30 
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg transform hover:-translate-y-1"}`}
            >
              {loading ? <SmallSpinner /> : (
                <>
                  <span className="mr-2">Process Withdrawal</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Info Note */}
        <div className="bg-white p-4 rounded-xl shadow-md text-center border border-gray-100">
          <div className="flex items-center justify-center mb-2 text-blue-600">
            <Building className="h-5 w-5 mr-2" />
            <h3 className="font-medium">Processing Information</h3>
          </div>
          <p className="text-sm text-gray-600">
            Funds will be transferred to your bank account within 1-3 business days.
            <br />All transactions are secure and encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}