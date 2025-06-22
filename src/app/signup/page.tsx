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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, type, checked, value } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.agreeTerms) {
            alert("You must agree to the Terms of Service and Privacy Policy.");
            return;
        }
        try {
            const { data } = await api.post("/auth/register", formData);
            router.push(`/email-verification-sent?email=${formData.email}`);
        } catch (err: any) {
            console.log(error);
            setError(err.response.data.message);
        }
    };

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
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="absolute w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 animate-float"
                                    style={{
                                        top: `${50 + 40 * Math.cos((i * Math.PI) / 3)}%`,
                                        left: `${50 + 40 * Math.sin((i * Math.PI) / 3)}%`,
                                        transform: "translate(-50%, -50%)",
                                        animationDelay: `${i * 0.5}s`,
                                    }}
                                >
                                    <div className="w-full h-full rounded-full bg-white/20 animate-pulse-gentle"></div>
                                </div>
                            ))}

                            {/* Connection Lines */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                    <line
                                        key={i}
                                        x1="50%"
                                        y1="50%"
                                        x2={`${50 + 40 * Math.sin((i * Math.PI) / 3)}%`}
                                        y2={`${50 + 40 * Math.cos((i * Math.PI) / 3)}%`}
                                        stroke="rgba(255,255,255,0.3)"
                                        strokeWidth="2"
                                        className="animate-pulse-gentle"
                                        style={{
                                            animationDelay: `${i * 0.3}s`,
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
                        <p
                            className="text-xl opacity-90 animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            Create your account and become part of a vibrant
                            campus community. Network, collaborate, and grow
                            together.
                        </p>
                        <div
                            className="flex space-x-8 mt-8 animate-fade-in"
                            style={{ animationDelay: "0.6s" }}
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold">10K+</div>
                                <div className="text-sm opacity-80">
                                    Students
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold">500+</div>
                                <div className="text-sm opacity-80">
                                    Communities
                                </div>
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
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Join CampusNet
                            </h1>
                            <p className="text-gray-600">
                                Create your account to connect with your campus
                                community
                            </p>
                        </div>

                        <Card className="shadow-xl border-0">
                            <CardHeader className="space-y-1 pb-6">
                                <CardTitle className="text-center text-xl text-gray-800">
                                    Sign Up
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">
                                                First Name
                                            </Label>
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
                                            <Label htmlFor="lastName">
                                                Last Name
                                            </Label>
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
                                        <Label htmlFor="username">
                                            Username
                                        </Label>
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
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
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
                                        <Label htmlFor="confirmPassword">
                                            Confirm Password
                                        </Label>
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
                                        <label
                                            htmlFor="agreeTerms"
                                            className="text-sm text-gray-700"
                                        >
                                            By creating an account, you agree to
                                            our{" "}
                                            <Link
                                                href="/terms"
                                                className="text-purple-600 hover:underline"
                                            >
                                                Terms of Service
                                            </Link>{" "}
                                            and{" "}
                                            <Link
                                                href="/privacy"
                                                className="text-purple-700 hover:underline"
                                            >
                                                Privacy Policy
                                            </Link>
                                            .
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
                                            <Link
                                                href="/login"
                                                className="text-campus-purple hover:underline font-medium"
                                            >
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
