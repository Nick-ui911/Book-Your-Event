"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Provider } from "react-redux"; // Import Provider
import { store } from "@/redux/store"; // Ensure you import the correct path to your store

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Evenza - Event Management</title>
        <meta
          name="description"
          content="Evenza is your go-to platform to post your own events and buy tickets for others. Discover, share, and join events with ease."
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          {" "}
          {/* Wrap with Provider */}
          <Header />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
