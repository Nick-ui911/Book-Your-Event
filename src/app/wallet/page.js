"use client";
import { BASE_URL } from "@/constants/apiUrl";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/spinner";
import { setWalletData } from "@/redux/walletSlice";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock,
  CreditCard,
  MoreHorizontal,
  RefreshCw,
  ChevronRight,
  Shield,
  Activity
} from "lucide-react";

const Page = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const wallet = useSelector((store) => store.wallet);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchMyWalletData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${BASE_URL}/wallet`, {
        withCredentials: true,
      });
      const walletData = res?.data?.data || [];
      dispatch(setWalletData(walletData));
    } catch (err) {
      console.error("Failed to fetch wallet data:", err);
      if (err.response && err.response.status === 401) {
        router.push("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyWalletData();
  }, []);

  if (!user || isLoading) return <Spinner />;

  const walletInfo = wallet?.[0];
  const history = walletInfo?.history || [];
  const balance = walletInfo?.balance || 0;

  const getFilteredTransactions = () => {
    if (activeFilter === "all") return history;
    return history.filter((entry) => entry.type === activeFilter);
  };

  const filteredHistory = getFilteredTransactions();

  const getTransactionColor = (type) => {
    switch (type.toLowerCase()) {
      case "credit":
        return "text-green-600";
      case "debit":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  const getTransactionIcon = (type) => {
    switch (type.toLowerCase()) {
      case "credit":
        return <ArrowDownCircle className="w-6 h-6 text-green-600" />;
      case "debit":
        return <ArrowUpCircle className="w-6 h-6 text-red-600" />;
      default:
        return <CreditCard className="w-6 h-6 text-blue-600" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-4 py-1.5 text-sm font-medium mb-3">
                <Wallet className="h-4 w-4 mr-2" />
                Financial Dashboard
              </div>
              <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
            </div>
            <button
              onClick={fetchMyWalletData}
              className="p-2.5 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
              aria-label="Refresh wallet data"
            >
              <RefreshCw className="h-5 w-5 text-blue-600" />
            </button>
          </div>
          <p className="mt-2 text-gray-600">
            Track your credits and debits over time.
          </p>
        </div>

        {/* Balance Card */}
        <div className="mb-8">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full translate-x-1/4 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-20 w-24 h-24 bg-white opacity-10 rounded-full translate-y-1/3"></div>
            <div className="absolute bottom-0 left-10 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2"></div>

            <div className="relative p-6 sm:p-8 text-white">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-medium opacity-90">
                  Current Balance
                </h2>
                <div className="flex items-center bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <Shield className="h-4 w-4 mr-1.5" />
                  <span className="text-sm text-black font-medium">
                    Secure Wallet
                  </span>
                </div>
              </div>

              <div className="flex items-baseline mb-4">
                <span className="text-4xl sm:text-5xl font-bold">
                  ₹{balance.toLocaleString('en-IN')}
                </span>
                <span className="ml-2 text-white text-opacity-70">INR</span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-white text-opacity-80 text-sm">
                  <span className="opacity-80">Account Owner:</span>
                  <div className="font-medium mt-1">{user?.name || "Account Owner"}</div>
                </div>
                <div className="flex items-center text-sm">
                  <Activity className="h-4 w-4 mr-1.5 text-white text-opacity-70" />
                  <span className="text-white text-opacity-70">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push("/withdraw")}
            className="flex flex-col items-center justify-center bg-white rounded-xl shadow-lg py-5 transition-all duration-200 hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-1 border border-gray-100"
          >
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
              <ArrowUpCircle className="h-6 w-6 text-red-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">Withdraw</span>
          </button>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Transaction History
            </h2>
          </div>

          {/* Filters */}
          <div className="flex items-center mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
              className={`px-4 py-2 text-sm font-medium rounded-full mr-2 whitespace-nowrap transition-all duration-200 ${
                activeFilter === "all"
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Transactions
            </button>
          </div>

          {/* List */}
          {filteredHistory.length > 0 ? (
            <div className="space-y-3">
              {filteredHistory.map((entry, idx) => (
                <div
                  key={idx}
                  className="flex items-center p-4 border border-gray-100 rounded-xl transition-all duration-200 hover:bg-blue-50 hover:border-blue-200 group"
                >
                  <div className="mr-4 bg-white p-2 rounded-lg shadow-sm group-hover:shadow">
                    {getTransactionIcon(entry.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium capitalize text-gray-900">
                          {entry.type}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {entry.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${getTransactionColor(
                            entry.type
                          )}`}
                        >
                          {entry.type.toLowerCase() === "credit" ? "+" : "-"}₹
                          {entry.amount.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500 flex items-center justify-end mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(entry.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-300 ml-2 group-hover:text-blue-500 transition-colors" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4 border border-gray-200">
                <Clock className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No transactions found
              </h3>
              <p className="text-gray-500 max-w-xs mx-auto">
                {activeFilter !== "all"
                  ? `No ${activeFilter} transactions in your history.`
                  : "Your transaction history will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;