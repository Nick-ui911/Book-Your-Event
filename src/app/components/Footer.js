// app/components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ArrowRight,
  Calendar,
  User,
  MessageSquare,
  Shield,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    toast.success(`Thanks for subscribing with: ${email}`);
    setEmail("");
  };
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="w-full bg-gradient-to-r from-[#1f1c2c] to-[#928dab]
 text-white"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-black font-bold">
                E
              </span>
              <h3 className="text-xl font-bold">EVENZA</h3>
            </div>
            <p className="text-black text-sm">
              Discover and join amazing events in your city. From concerts to
              workshops, conferences to meetups - find your next experience with
              Evenza.
            </p>
            <div className="flex space-x-4 pt-2">
              <a
                href="#"
                className="text-black hover:text-white transition-colors duration-200"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-black hover:text-white transition-colors duration-200"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/nikhilsinghbaghel8/"
                className="text-black hover:text-white transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/nikhil-singh-318515308/"
                className="text-black hover:text-white transition-colors duration-200"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-blue-700 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/events"
                  className="text-black hover:text-white flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Browse Events</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/postevent"
                  className="text-black hover:text-white flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Create Event</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/venues"
                  className="text-black hover:text-white flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Venues</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-black hover:text-white flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>Blog</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-black hover:text-white flex items-center transition-all duration-200 hover:translate-x-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>
          {/* Column 3: Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-blue-700 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <span className="text-black">
                  123 Event Street, San Francisco, CA 94107
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <a
                  href="tel:+919755716505"
                  className="text-black hover:text-white transition-colors duration-200"
                >
                  (+91)9755716505
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:nbaghel392@gmail.com"
                  className="text-black hover:text-white transition-colors duration-200"
                >
                  nbaghel392@gmail.com
                </a>
              </li>
              {/* New Link to Contact Page */}
              <li className="flex items-center">
                <a
                  href="/contact"
                  className="text-black hover:text-white transition-colors duration-200 flex items-center"
                >
                  <Mail className="h-5 w-5 mr-2 text-blue-400 flex-shrink-0" />
                  Contact Page
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-blue-700 pb-2">
              Newsletter
            </h3>
            <p className="text-black text-sm">
              Subscribe to our newsletter for updates on upcoming events and
              special offers.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col space-y-2"
            >
              <ToastContainer />
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="px-4 py-2 w-full rounded-l-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-r-md flex items-center justify-center transition-colors duration-200"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-black">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Footer with Copyright */}
      <div className="bg-blue-950 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 sm:mb-0">
            © {currentYear} Evenza. All rights reserved.
          </div>

          <div className="flex flex-wrap justify-center space-x-6">
            <Link
              href="/terms"
              className="text-gray-400 hover:text-white text-sm flex items-center"
            >
              <Shield className="h-4 w-4 mr-1" />
              <span>Terms</span>
            </Link>
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-white text-sm flex items-center"
            >
              <Shield className="h-4 w-4 mr-1" />
              <span>Privacy</span>
            </Link>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-white text-sm flex items-center"
            >
              <Shield className="h-4 w-4 mr-1" />
              <span>Cookies</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
