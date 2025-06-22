"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, Loader2 } from "lucide-react";
import { Suspense, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../lib/axios";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
        "",
    );
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setMessage("Please enter your email address.");
            setMessageType("error");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage("Please enter a valid email address.");
            setMessageType("error");
            return;
        }

        setIsSubmitting(true);
        setMessage("");
        setMessageType("");

        try {
            const { data } = await api.post("/auth/forgot-password", {
                email,
            });

            setMessageType("success");
            setMessage(
                data.message ||
                    "If an account with that email exists, we've sent you a password reset link.",
            );
            setIsSubmitted(true);
        } catch (error) {
            if (process.env.NODE_ENV != "development") console.log(error);
            setMessage("Something went wrong. Please try again.");
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTryAgain = () => {
        setIsSubmitted(false);
        setMessage("");
        setMessageType("");
        setEmail("");
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <Navbar></Navbar>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full text-center space-y-8">
                    {/* Email Icon */}
                    <div className="flex justify-center">
                        <div className="w-20 h-20 bg-[#5928E4]/10 rounded-full flex items-center justify-center">
                            <Mail className="w-10 h-10 text-[#5928E4]" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="space-y-4">
                        <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
                            Forgot Your Password?
                        </h1>
                        <p className="text-gray-600 text-base">
                            {isSubmitted
                                ? "We've sent you a password reset link if an account exists with that email."
                                : "Enter your email address and we'll send you a link to reset your password."}
                        </p>
                    </div>

                    {!isSubmitted ? (
                        /* Email Input Form */
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full text-left"
                                    disabled={isSubmitting}
                                />

                                {/* Message Display */}
                                {message && (
                                    <div
                                        className={`p-4 rounded-lg border ${
                                            messageType === "success"
                                                ? "bg-green-50 border-green-200 text-green-800"
                                                : "bg-red-50 border-red-200 text-red-800"
                                        }`}
                                    >
                                        <p className="text-sm font-medium">
                                            {message}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-campus-gradient hover:opacity-90 text-white px-6"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    "Send Reset Link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        /* Success State */
                        <div className="space-y-6">
                            {/* Success Message */}
                            {message && (
                                <div className="p-4 rounded-lg border bg-green-50 border-green-200 text-green-800">
                                    <p className="text-sm font-medium">
                                        {message}
                                    </p>
                                </div>
                            )}

                            <div className="space-y-4 text-gray-600">
                                <p>
                                    Please check your email inbox and spam
                                    folder.
                                </p>
                                <p>
                                    The reset link will expire in 1 hour for
                                    security reasons.
                                </p>
                            </div>

                            {/* Try Again Button */}
                            <Button
                                onClick={handleTryAgain}
                                variant="outline"
                                className="bg-campus-gradient hover:opacity-90 text-white px-6"
                            >
                                Try Different Email
                            </Button>
                        </div>
                    )}

                    {/* Back to Login Link */}
                    <div className="pt-4">
                        <Link
                            href="/login"
                            className="text-sm text-[#5928E4] hover:text-[#4a22c7] hover:underline"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default function ForgotPasswordPage() {
    return (
        <Suspense>
            <ForgotPassword />
        </Suspense>
    );
}
