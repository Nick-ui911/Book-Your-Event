"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "@/redux/userSlice";
import axios from "axios";
import { BASE_URL } from "@/constants/apiUrl";

export default function UserInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile", {
          withCredentials: true,
        });
        const user = res?.data?.data?.user;
        if (user) {
          dispatch(addUser(user));
        } else {
          dispatch(removeUser()); // no user found
        }
      } catch (err) {
        // If 401 or error, clear the user from Redux
        dispatch(removeUser());
      }
    };

    getUser();
  }, []);

  return null;
}
