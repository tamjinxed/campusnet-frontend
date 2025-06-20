"use client";

import Navbar from "../components/Navbar";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { useState, useEffect, Suspense } from "react";
import api from "../lib/axios";

interface VerificationState {
    status: "loading" | "success" | "error";
    email?: string;
    message?: string;
}

const VerifyEmail = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const token = searchParams.get("token");
    const [verificationState, setVerificationState] =
        useState<VerificationState>({
            status: "loading",
            email: undefined,
            message: undefined,
        });

    const [showEmailInput, setShowEmailInput] = useState(false);
    const [emailInput, setEmailInput] = useState("");
    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const { data } = await api.get(
                    `/auth/verify-email?token=${token}`,
                );

                setVerificationState({
                    status: "success",
                });
            } catch (error) {
                setVerificationState({
                    status: "error",
                    message: error?.response?.data?.message,
                });
            }
        };

        if (token) {
            verifyToken();
        }
    }, [token, router]);

    const handleResendEmail = async () => {
        if (!emailInput.trim()) {
            setResendMessage("Please enter your email address.");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput)) {
            setResendMessage("Please enter a valid email address.");
            return;
        }

        setIsResending(true);
        setResendMessage("");

        try {
            const { data } = await api.post("/auth/resend-verification-email", {
                email: emailInput,
            });

            router.push(`/email-verification-sent?email=${emailInput}`);
        } catch (error) {
            setResendMessage(
                error?.response?.data?.message ||
                    "Failed to resend email. Please try again.",
            );
        } finally {
            setIsResending(false);
        }
    };

    const handleRequestEmailView = () => {
        setShowEmailInput(true);
        setResendMessage("");
    };

    const handleCancelRequest = () => {
        setShowEmailInput(false);
        setEmailInput("");
        setResendMessage("");
    };

    const renderContent = () => {
        switch (verificationState.status) {
            case "loading":
                return (
                    <>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-[#5928E4]/10 rounded-full flex items-center justify-center">
                                <Loader2 className="w-10 h-10 text-[#5928E4] animate-spin" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
                                Verifying Your Email
                            </h1>
                            <p className="text-gray-600 text-base">
                                Please wait while we verify your email
                                address...
                            </p>
                        </div>
                    </>
                );

            case "success":
                return (
                    <>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <Check
                                    className="w-10 h-10 text-green-600"
                                    strokeWidth={3}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
                                Email Verified Successfully!
                            </h1>
                            <p className="text-gray-600 text-base">
                                Redirecting you to complete your profile...
                            </p>
                        </div>
                    </>
                );

            case "error":
                return (
                    <>
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                                <X
                                    className="w-10 h-10 text-red-600"
                                    strokeWidth={3}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
                                Verification Failed
                            </h1>
                            <p className="text-gray-600 text-base">
                                {verificationState.message}
                            </p>
                        </div>

                        {/* Email Input Section */}
                        {showEmailInput ? (
                            <div className="pt-6 space-y-4 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-[#101828]">
                                    Request New Verification Email
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Enter your email address to receive a new
                                    verification link.
                                </p>

                                <div className="space-y-3">
                                    <Input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={emailInput}
                                        onChange={(e) =>
                                            setEmailInput(e.target.value)
                                        }
                                        className="w-full"
                                        disabled={isResending}
                                    />

                                    {resendMessage && (
                                        <p
                                            className={`text-sm ${resendMessage.includes("successfully") ? "text-green-600" : "text-red-600"}`}
                                        >
                                            {resendMessage}
                                        </p>
                                    )}

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={handleResendEmail}
                                            disabled={isResending}
                                            className="flex-1 bg-[#5928E4] hover:bg-[#4a22c7] text-white"
                                        >
                                            {isResending ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Sending...
                                                </>
                                            ) : (
                                                "Send Verification Email"
                                            )}
                                        </Button>
                                        <Button
                                            onClick={handleCancelRequest}
                                            variant="outline"
                                            disabled={isResending}
                                            className="px-4"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="pt-4 space-y-3">
                                <Button
                                    onClick={handleRequestEmailView}
                                    className="bg-[#5928E4] hover:bg-[#4a22c7] text-white px-8 py-3 text-base font-medium"
                                >
                                    Request New Verification Email
                                </Button>
                                <div>
                                    <Link
                                        href="/login"
                                        className="text-sm text-[#5928E4] hover:text-[#4a22c7] hover:underline"
                                    >
                                        Back to Login
                                    </Link>
                                </div>
                            </div>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full text-center space-y-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export function VerifyEmailPage() {
    return (
        <Suspense>
            <VerifyEmail />
        </Suspense>
    );
}
