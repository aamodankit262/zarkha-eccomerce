"use client";

import type React from "react";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Linkedin,
  Instagram,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { categories } from "@/data/constant";
import logoImage from "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.png";
import HeaderSearchBar from "@/components/common/HeaderSeachbar";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("All");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FAF6F2" }}>
      {/* Header */}
      <HeaderSearchBar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Information */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                Visit Us For A Personalized Shopping Experience
              </h1>

              <div className="space-y-6">
                <div className="flex items-start space-x-3">
                  <div
                    className="w-3 h-3 rounded-full mt-2"
                    style={{ backgroundColor: "#FF8A18" }}
                  ></div>
                  <p className="text-gray-700 leading-relaxed">
                    Get Expert Guidance And Hands-On Support — Stop By Our
                    Centre Today!
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className="w-3 h-3 rounded-full mt-2"
                    style={{ backgroundColor: "#FF8A18" }}
                  ></div>
                  <p className="text-gray-700 leading-relaxed">
                    Visit Our Centre For A Hands-On Experience
                  </p>
                </div>

                <div className="flex items-start space-x-3">
                  <div
                    className="w-3 h-3 rounded-full mt-2"
                    style={{ backgroundColor: "#FF8A18" }}
                  ></div>
                  <p className="text-gray-700 leading-relaxed">
                    Visit Us And Unlock Exclusive Discounts Available For A
                    Limited Time.
                  </p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-600 mt-1" />
              <div>
                <p className="text-gray-700 font-medium">
                  Akshya Nagar 1st Block 1st Cross, Rammurthy Nagar,
                </p>
                <p className="text-gray-700 font-medium">Bangalore-560016</p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <p className="text-gray-700 font-medium mb-3">Follow Us:</p>
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
                  <Facebook className="h-4 w-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
                  <Linkedin className="h-4 w-4 text-white" />
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:opacity-80">
                  <Instagram className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Connect With Us
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter Full Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <User className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Email and Mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Emails Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter Emails Address"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="mobile"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleInputChange}
                      placeholder="Enter Mobile Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Write Message
                </label>
                <div className="relative">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter Message"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  <div className="absolute right-3 top-3">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 px-6 text-white font-medium rounded-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-opacity"
                style={{ backgroundColor: "#FF8A18" }}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
