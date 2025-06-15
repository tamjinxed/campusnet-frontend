'use client';

import Navbar from "@/app/components/Navbar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import Link from "next/link";
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    console.log("Sign up data:", formData);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Navbar />

      <div className="min-h-screen flex flex-col lg:flex-row bg-white">
        {/* Left Side Image */}
        <div className="hidden lg:block lg:w-2/5 xl:w-1/2">
          <img
            src="/img/login.jpg"
            alt="Students"
            className="h-full max-w-[80%]  object-cover"
          />
        </div>

        {/* Right Side Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-md space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join CampusNet</h1>
              <p className="text-gray-600">Create your account to connect with your campus community</p>
            </div>

            <Card className="shadow-xl border-0">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-center text-xl text-gray-800">Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  {/* Username Field */}
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Choose a unique username"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your university email"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                      By creating an account, you agree to our{" "}
                      <Link href="/terms" className="text-purple-600 hover:underline">Terms of Service</Link> and{" "}
                      <Link href="/privacy" className="text-purple-700 hover:underline">Privacy Policy</Link>.
                    </label>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-campus-gradient hover:opacity-90 text-white font-semibold rounded-lg"
                    >
                      Create Account
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <Link href="/login" className="text-campus-purple hover:underline font-medium">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
