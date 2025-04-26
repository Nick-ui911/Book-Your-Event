"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { addUser } from "@/redux/userSlice";
import {
  AlertCircle,
  Check,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Edit,
  Key,
} from "lucide-react";
import Spinner from "../components/spinner";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userdata = useSelector((store) => store.user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile");
        setUser(res?.data?.data?.user);
        dispatch(addUser(res?.data?.data?.user));
      } catch (error) {
        console.error("Failed to load profile:", error);
        setError("Failed to load profile");
        if (error.response?.status === 401) {
          router.push("/login");
          return;
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch, router]);



  // Loading state
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );

  // Auth check
  if (!userdata) {
    return <Spinner/>;
  }

  const formattedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-300  py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Profile Header */}
          <div className=" bg-fuchsia-200 px-6 py-12 text-center relative">
            <div className="absolute top-4 right-4 space-x-2 flex">
              <button
                onClick={() => router.push("/profileEdit")}
                className="bg-white text-black px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => router.push("/updatePassword")}
                className="bg-white text-black px-3 py-2 rounded-lg hover:bg-indigo-50 transition-all duration-200 flex items-center"
              >
                <Key className="w-4 h-4 mr-1" />
                <span>Change Password</span>
              </button>
            </div>

            <div className="inline-block rounded-full bg-white p-2 mb-4">
              {user?.photoUrl ? (
                <img
                  src={user.photoUrl}
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                  <UserIcon className="w-12 h-12 text-black" />
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-black">
              {user?.name || "User"}
            </h1>
            <p className="text-black mt-2">Member since {formattedDate}</p>
          </div>

          {/* Profile Content */}
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Personal Information
            </h2>

            <div className="space-y-4">
              <ProfileItem
                icon={<Mail className="w-5 h-5 text-indigo-500" />}
                label="Email"
                value={user?.email}
              />

              <ProfileItem
                icon={<Phone className="w-5 h-5 text-indigo-500" />}
                label="Mobile Number"
                value={user?.mobileNo || "Not provided"}
              />

              <ProfileItem
                icon={<UserIcon className="w-5 h-5 text-indigo-500" />}
                label="Gender"
                value={user?.gender || "Not specified"}
              />
            </div>

            {/* Display wallet information if available */}
            {user?.wallet && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Wallet Information
                </h2>
                <div className="bg-indigo-50 rounded-lg p-4 flex items-center">
                  <CreditCard className="w-6 h-6 text-indigo-500 mr-3" />
                  <div>
                    <p className="text-gray-500">Wallet ID</p>
                    <p className="font-medium text-gray-800">
                      {user.wallet.toString().slice(-8)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Display recent payments if available */}
            {user?.payments && user.payments.length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Recent Payments
                </h2>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                          To
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                          Amount
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                          Method
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.payments.slice(0, 3).map((payment, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {payment.toUser || "User"}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            ${payment.amount}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {payment.paymentMethod || "Standard"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileItem({ icon, label, value }) {
  return (
    <div className="flex items-start p-4 bg-gray-50 rounded-lg">
      <div className="mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-medium text-gray-800">{value || "N/A"}</p>
      </div>
    </div>
  );
}
