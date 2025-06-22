"use client";

import type React from "react";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Lock, Loader2, Eye, EyeOff, X } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../lib/axios";

interface ResetPasswordState {
    status: "loading" | "valid" | "invalid";
    message?: string;
}

const ResetPassword = () => {
    const params = useSearchParams();
    const token = params.get("token");
    const router = useRouter();
    // const [resetState, setResetState] = useState<ResetPasswordState>({
    //     status: "loading",
    // });
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
        "",
    );

    const validatePasswords = () => {
        if (!newPassword.trim()) {
            setMessage("Please enter a new password.");
            setMessageType("error");
            return false;
        }

        if (newPassword.length < 8) {
            setMessage("Password must be at least 8 characters long.");
            setMessageType("error");
            return false;
        }

        if (!confirmNewPassword.trim()) {
            setMessage("Please confirm your password.");
            setMessageType("error");
            return false;
        }

        if (newPassword !== confirmNewPassword) {
            setMessage("Passwords do not match.");
            setMessageType("error");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePasswords()) {
            return;
        }

        setIsSubmitting(true);
        setMessage("");
        setMessageType("");

        try {
            // TODO: Replace with actual API call
            const { data } = await api.post(`/auth/reset-password`, {
                token,
                newPassword,
                confirmNewPassword,
            });

            setMessage(
                data.message ||
                    "Password reset successfully! Please log in with your new password.",
            );
            setMessageType("success");

            // Redirect to login after success
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (error) {
            setMessage(
                error.response.data.message ||
                    "Something went wrong. Please try again.",
            );
            setMessageType("error");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderContent = () => {
        return (
            <>
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-[#5928E4]/10 rounded-full flex items-center justify-center">
                        <Lock className="w-10 h-10 text-[#5928E4]" />
                    </div>
                </div>
                <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#101828]">
                        Reset Your Password
                    </h1>
                    <p className="text-gray-600 text-base">
                        Enter your new password below.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* New Password Input */}
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full pr-10"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={isSubmitting}
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Confirm Password Input */}
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={confirmNewPassword}
                                onChange={(e) =>
                                    setConfirmNewPassword(e.target.value)
                                }
                                className="w-full pr-10"
                                disabled={isSubmitting}
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                disabled={isSubmitting}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Password Requirements */}
                        <div className="text-left text-sm text-gray-600">
                            <p>Password must be at least 8 characters long.</p>
                        </div>

                        {/* Message Display */}
                        {message && (
                            <div
                                className={`p-4 rounded-lg border ${
                                    messageType === "success"
                                        ? "bg-green-50 border-green-200 text-green-800"
                                        : "bg-red-50 border-red-200 text-red-800"
                                }`}
                            >
                                <p className="text-sm font-medium">{message}</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-campus-gradient hover:opacity-90 text-white px-6"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Resetting Password...
                            </>
                        ) : (
                            "Reset Password"
                        )}
                    </Button>
                </form>
            </>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Navigation */}
            <Navbar></Navbar>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-16">
                <div className="max-w-md w-full text-center space-y-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default function ResetPasswordPage() {
    return (
        <Suspense>
            <ResetPassword />
        </Suspense>
    );
}
