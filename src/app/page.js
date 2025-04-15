"use client";
import React, { useState } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Calendar, Map, Users, Star, ArrowRight, Search, Mail } from "lucide-react";

export default function Home() {
  const [email, setEmail] = useState('');
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Conference 2025",
      date: "May 15-17, 2025",
      location: "San Francisco, CA",
      attendees: 1500,
      image: ""
    },
    {
      id: 2,
      title: "Music Festival",
      date: "June 5-7, 2025",
      location: "Austin, TX",
      attendees: 5000,
      image: ""
    },
    {
      id: 3,
      title: "Design Summit",
      date: "July 21-23, 2025",
      location: "New York, NY",
      attendees: 800,
      image: ""
    }
  ];
  
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      text: "Evenza has transformed how I manage my events. The platform is intuitive and the features are incredible!",
      rating: 5
    },
    {
      id: 2,
      name: "Mark Williams",
      role: "Regular Attendee",
      text: "I've discovered so many amazing events through Evenza. Their ticket system is seamless and reliable.",
      rating: 5
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <div className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0  z-10" />
          <div className="relative w-full h-full">
            <Image
              src="/bgImage.png"
              alt="Evenza Events Background"
              fill
              priority
              className="object-cover z-0"
            />
          </div>
        </div>
        
        
        {/* Hero Content */}
        <div className="container mx-auto px-6 z-20 mt-24">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover. Book. Celebrate.
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Find and book the best events in your area or create and manage your own. 
              Evenza makes event management simple and enjoyable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/login" className="w-full sm:w-auto">
                <button className="w-full px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-lg font-medium">
                  Get Started Free
                </button>
              </Link>
              <Link href="/explore" className="w-full sm:w-auto">
                <button className="w-full px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-purple-700 transition text-lg font-medium">
                  Explore Events
                </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
      
      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need for Your Events</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Evenza provides powerful tools for event organizers and attendees, making the entire event experience seamless from start to finish.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Calendar size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Post & Manage Events</h3>
              <p className="text-gray-600">
                Easily post, publish, and manage your events with our intuitive dashboard and powerful tools.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Users size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sell Tickets Online</h3>
              <p className="text-gray-600">
                Set up ticketing options, manage registrations, and process payments securely within our platform.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <Map size={24} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Discover Local Events</h3>
              <p className="text-gray-600">
                Find exciting events happening near you with our advanced search and recommendation engine.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Events Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <Link href="/events" className="flex items-center text-purple-600 hover:text-purple-700 transition">
              View all events
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Calendar size={16} className="mr-2" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Map size={16} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-500">
                      <Users size={16} className="mr-2" />
                      <span>{event.attendees} attendees</span>
                    </div>
                    <Link href={`/events/${event.id}`}>
                      <button className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-sm">
                        Get tickets
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 px-6 bg-purple-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover why thousands of event organizers and attendees choose Evenza.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-8 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={20} 
                      className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center mr-4">
                    <span className="text-purple-700 font-medium">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 bg-purple-700 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Post Your Next Event?</h2>
          <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-8">
            Join thousands of event creators who trust Evenza for their event management needs.
          </p>
          <Link href="/signup">
            <button className="px-8 py-3 bg-white text-purple-700 rounded-full hover:bg-gray-100 transition text-lg font-medium">
              Get Started for Free
            </button>
          </Link>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter to get the latest updates on events and features.
          </p>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
      

    </div>
  );
}