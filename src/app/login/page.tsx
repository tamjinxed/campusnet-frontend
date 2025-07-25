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
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// For Auth
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user starts typing
        if (error) setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        
        try {
            const response = await login(formData);
            if (response?.isNewUser) {
                router.push("/profile/setup");
            } else {
                router.push("/dashboard");
            }
        } catch (err: any) {
            console.error("Login error:", err);
            let errorMessage = "Login failed. Please try again.";
            
            if (err.response) {
                switch (err.response.status) {
                    case 401:
                        errorMessage = "Invalid email or password.";
                        break;
                    case 404:
                        errorMessage = "Account not found. Please sign up.";
                        break;
                    case 500:
                        errorMessage = "Server error. Please try again later.";
                        break;
                }
            }
            
            setError(errorMessage);
            // Shake animation on error
            const form = e.currentTarget as HTMLFormElement;
            form.classList.add("animate-shake");
            setTimeout(() => form.classList.remove("animate-shake"), 500);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="flex min-h-[calc(100vh-80px)]">
                {/* Left Side - Animation Section */}
                <div className="hidden lg:flex lg:w-1/2 bg-campus-gradient relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* New Floating Campus Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            {/* Floating buildings */}
                            <div className="absolute bottom-0 left-1/4 w-16 h-32 bg-white/20 rounded-t-lg animate-float-slow"></div>
                            <div className="absolute bottom-0 left-1/2 w-24 h-40 bg-white/25 rounded-t-lg animate-float"></div>
                            <div className="absolute bottom-0 right-1/4 w-20 h-36 bg-white/30 rounded-t-lg animate-float-slower"></div>
                            
                            {/* Floating students */}
                            <div className="absolute top-1/4 left-1/3 w-12 h-12">
                                <div className="relative w-full h-full animate-float-delay-1">
                                    <div className="absolute w-8 h-8 bg-white/30 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            <div className="absolute top-1/3 right-1/4 w-10 h-10">
                                <div className="relative w-full h-full animate-float-delay-2">
                                    <div className="absolute w-6 h-6 bg-white/25 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full"></div>
                                </div>
                            </div>
                            
                            {/* Central logo */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                <h2 className="text-5xl font-bold mb-4 text-white animate-pulse-gentle">
                                    CampusNet
                                </h2>
                                <p className="text-xl text-white/90">
                                    Connect. Learn. Grow.
                                </p>
                            </div>
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
                                    {error && (
                                        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                            {error}
                                        </div>
                                    )}
                                    
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
                                            className="w-full h-12 bg-campus-gradient hover:opacity-90 text-white font-semibold rounded-lg transition-all"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Logging in...
                                                </>
                                            ) : (
                                                "Login"
                                            )}
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