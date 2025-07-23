import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import UserInitializer from "./components/userIntialize";

// ✅ Font setup
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO metadata
export const metadata = {
  title: "Evenza - Event Management",
  description:
    "Evenza is your go-to platform to post your own events and buy tickets for others. Discover, share, and join events with ease.",
  keywords: ["event management", "buy tickets", "host events", "Evenza"],
  openGraph: {
    title: "Evenza - Event Management",
    description:
      "Post your own events or book others easily with Evenza. A smooth, all-in-one event platform.",
    type: "website",
    locale: "en_US",
    url: "https://book-your-event.vercel.app", // replace with your domain
    siteName: "Evenza",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <UserInitializer />
          <Header />
          {children}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
