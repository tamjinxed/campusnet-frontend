"use client";

import Navbar from "@/app/components/Navbar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/axios";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: "",
    general: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors] || errors.general) {
      setErrors({
        ...errors,
        [name]: "",
        general: "",
      });
    }
  };

  const router = useRouter();

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeTerms: "",
      general: "",
    };

    // Validate first name
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    // Validate last name
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9])/.test(formData.password)) {
      newErrors.password = "Password must include uppercase, lowercase, number, and special character";
      isValid = false;
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Validate terms agreement
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await api.post("/auth/register", {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });
      router.push(`/email-verification-sent?email=${encodeURIComponent(formData.email)}`);
    } catch (err: any) {
      console.error("Registration error:", err);
      let errorMessage = "An error occurred during registration. Please try again.";
      if (err.response) {
        if (err.response.status === 409) {
          if (err.response.data.message.includes("email")) {
            setErrors(prev => ({ ...prev, email: "This email is already registered" }));
          } else if (err.response.data.message.includes("username")) {
            setErrors(prev => ({ ...prev, username: "This username is already taken" }));
          } else {
            errorMessage = err.response.data.message;
          }
        } else {
          errorMessage = err.response.data.message || errorMessage;
        }
      }
      setErrors(prev => ({ ...prev, general: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation nodes data
  const animationNodes = [
    { id: 1, top: "30%", left: "15%", delay: "0s" },
    { id: 2, top: "70%", left: "15%", delay: "0.5s" },
    { id: 3, top: "10%", left: "50%", delay: "1s" },
    { id: 4, top: "90%", left: "50%", delay: "1.5s" },
    { id: 5, top: "30%", left: "85%", delay: "2s" },
    { id: 6, top: "70%", left: "85%", delay: "2.5s" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Animation Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-campus-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Dynamic Grid Animation */}
          <div className="absolute inset-0">
            <div className="grid grid-cols-8 grid-rows-8 h-full w-full gap-4 p-8 opacity-30">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/20 rounded-lg animate-pulse-gentle"
                  style={{
                    animationDelay: `${(i * 0.1) % 3}s`,
                    animationDuration: `${2 + (i % 3)}s`,
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Floating Network Nodes */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Central Hub */}
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center animate-float">
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm"></div>
              </div>

              {/* Connected Nodes */}
              {animationNodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 animate-float"
                  style={{
                    top: node.top,
                    left: node.left,
                    transform: "translate(-50%, -50%)",
                    animationDelay: node.delay,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white/20 animate-pulse-gentle"></div>
                </div>
              ))}

              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {animationNodes.map((node) => (
                  <line
                    key={node.id}
                    x1="50%"
                    y1="50%"
                    x2={node.left}
                    y2={node.top}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="2"
                    className="animate-pulse-gentle"
                    style={{
                      animationDelay: node.delay,
                    }}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Text Content */}
          <div className="absolute bottom-20 left-20 right-20 text-white z-10">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in">
              Join CampusNet
            </h1>
            <p className="text-xl opacity-90 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              Create your account and become part of a vibrant campus community. Network, collaborate, and grow together.
            </p>
            <div className="flex space-x-8 mt-8 animate-fade-in" style={{ animationDelay: "0.6s" }}>
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-80">Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm opacity-80">Communities</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">1K+</div>
                <div className="text-sm opacity-80">Events</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          {/* Floating Network Nodes (Mobile) */}
          <div className="absolute inset-0 lg:hidden flex items-center justify-center opacity-20">
            <div className="relative w-full h-full">
              {/* Central Hub */}
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center animate-float mx-auto my-20">
                <div className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm"></div>
              </div>

              {/* Connected Nodes */}
              {animationNodes.map((node) => (
                <div
                  key={node.id}
                  className="absolute w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 animate-float"
                  style={{
                    top: node.top,
                    left: node.left,
                    transform: "translate(-50%, -50%)",
                    animationDelay: node.delay,
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white/20 animate-pulse-gentle"></div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md space-y-8 z-10">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white lg:text-gray-900 mb-2">
                Join CampusNet
              </h1>
              <p className="text-white/90 lg:text-gray-600">
                Create your account to connect with your campus community
              </p>
            </div>

            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-center text-xl text-gray-800">
                  Sign Up
                </CardTitle>
              </CardHeader>
              <CardContent>
                {errors.general && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      {errors.general}
                    </AlertDescription>
                  </Alert>
                )}

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
                      {errors.firstName && (
                        <p className="text-sm text-red-600">{errors.firstName}</p>
                      )}
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
                      {errors.lastName && (
                        <p className="text-sm text-red-600">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

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
                    {errors.username && (
                      <p className="text-sm text-red-600">{errors.username}</p>
                    )}
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
                    {errors.email && (
                      <p className="text-sm text-red-600">{errors.email}</p>
                    )}
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
                    {errors.password && (
                      <p className="text-sm text-red-600">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Must be at least 8 characters with uppercase, lowercase, number, and special character
                    </p>
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
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
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
                      <Link href="/terms" className="text-purple-600 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-purple-700 hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </label>
                  </div>
                  {errors.agreeTerms && (
                    <p className="text-sm text-red-600">{errors.agreeTerms}</p>
                  )}

                  <div className="pt-4">
                    <Button
                      type="submit"
                      className="w-full h-12 bg-campus-gradient hover:opacity-90 text-white font-semibold rounded-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        "Create Account"
                      )}
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