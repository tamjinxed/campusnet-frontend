"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/app/components/ui/card";
import Link from "next/link";

// For Auth
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(formData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="flex min-h-[calc(100vh-80px)]">
                {/* Left Side - Animation Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-campus-gradient relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Floating Elements Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative">
                            {/* Main Circle */}
                            <div className="w-96 h-96 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center animate-float">
                                <div className="w-72 h-72 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                    <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <h2 className="text-4xl font-bold mb-4 animate-pulse-gentle">
                                                CampusNet
                                            </h2>
                                            <p className="text-xl opacity-90">
                                                Connect. Learn. Grow.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Orbiting Elements */}
                            <div
                                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 w-16 h-16 bg-white/20 rounded-full animate-float"
                                style={{ animationDelay: "1s" }}
                            ></div>
                            <div
                                className="absolute bottom-0 right-0 transform translate-x-8 translate-y-8 w-12 h-12 bg-white/20 rounded-full animate-float"
                                style={{ animationDelay: "2s" }}
                            ></div>
                            <div
                                className="absolute top-1/2 left-0 transform -translate-x-8 -translate-y-1/2 w-20 h-20 bg-white/20 rounded-full animate-float"
                                style={{ animationDelay: "0.5s" }}
                            ></div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="absolute bottom-20 left-20 right-20 text-white z-10">
                        <h1 className="text-5xl font-bold mb-6 animate-fade-in">
                            Welcome Back
                        </h1>
                        <p
                            className="text-xl opacity-90 animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            Connect with your campus community and discover
                            endless opportunities for learning and growth.
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center animate-fade-in">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Login to your account
                            </h2>
                            <p className="text-gray-600">
                                Enter your credentials to access your profile
                            </p>
                        </div>

                        <Card className="shadow-xl border-0">
                            <CardHeader className="space-y-1 pb-6">
                                <CardTitle className="text-center text-xl text-gray-800">
                                    Sign In
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={handleChange}
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
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="h-12"
                                            required
                                        />
                                    </div>

                                    <div className="text-right">
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-campus-purple hover:underline"
                                        >
                                            Forgot Password?
                                        </Link>
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-campus-gradient hover:opacity-90 text-white font-semibold rounded-lg"
                                        >
                                            Login
                                        </Button>
                                    </div>

                                    <div className="text-center pt-4">
                                        <p className="text-sm text-gray-600">
                                            Don't have an account?{" "}
                                            <Link
                                                href="/signup"
                                                className="text-campus-purple hover:underline font-medium"
                                            >
                                                Create one
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
};

export default Login;
