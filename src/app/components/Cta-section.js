"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CTASection() {
  const [randomValues, setRandomValues] = useState(null);

  useEffect(() => {
    // Generate random values only on the client side
    const values = [...Array(5)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      width: `${Math.random() * 300 + 100}px`,
      height: `${Math.random() * 300 + 100}px`,
      opacity: Math.random() * 0.5,
    }));
    setRandomValues(values);
  }, []);

  return (
    <section className="py-24 px-6 bg-gradient-to-r from-purple-600 to-purple-400 text-white relative overflow-hidden">
      {/* Background Pattern */}
      {randomValues && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {randomValues.map((style, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: style.top,
                  left: style.left,
                  width: style.width,
                  height: style.height,
                  opacity: style.opacity,
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
          Ready to Make Your Event{" "}
          <span className="text-yellow-300">Unforgettable</span>?
        </h2>

        <p className="text-xl text-purple-50 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join thousands of successful event creators who trust Evenza to
          bring their vision to life.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-12">
          <Link href="/login">
            <button className="px-8 py-4 bg-white text-purple-700 rounded-full hover:bg-yellow-100 transition duration-300 text-lg font-semibold shadow-lg flex items-center gap-2 w-full md:w-auto justify-center">
              Get Started for Free
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-8 items-center">
          <div className="flex items-center">
            <div className="flex -space-x-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full border-2 border-purple-400 bg-purple-${
                    200 + i * 100
                  } flex items-center justify-center font-bold text-xs`}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <span className="ml-4 text-purple-100">
              +2,500 event creators this month
            </span>
          </div>

          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="ml-2 text-purple-100">
              No credit card required
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
