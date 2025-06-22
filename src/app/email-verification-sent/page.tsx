"use client";

import Navbar from "@/app/components/Navbar";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
import { Mail, Loader2 } from "lucide-react";
import api from "@/app/lib/axios";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";

const EmailVerificationSent = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get("email");

    const [isResending, setIsResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "">(
        "",
    );

    const handleResendEmail = async () => {
        setIsResending(true);
        setResendMessage("");
        setMessageType("");
        try {
            const { data } = await api.post("/auth/resend-verification-email", {
                email,
            });
            setResendMessage(
                data.message ||
                    "Verification email sent successfully! Please check your inbox.",
            );
            setMessageType("success");
        } catch (error) {
            setResendMessage(
                error.response.data.message ||
                    "Something went wrong. Please try again.",
            );
            setMessageType("error");
        } finally {
            setIsResending(false);
        }
    };
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
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
                            Please Verify Your Email
                        </h1>

                        <p className="text-gray-600 text-base">
                            We have sent an email to{" "}
                            <span className="font-semibold text-[#101828]">
                                {email}
                            </span>
                            .
                        </p>
                    </div>

                    {/* Instructions */}
                    <div className="space-y-4 text-gray-600">
                        <p>
                            Just{" "}
                            <span className="font-semibold text-[#101828]">
                                click on the link
                            </span>{" "}
                            in that email to complete your signup.
                        </p>
                        <p>
                            If you don't see it, you may need to{" "}
                            <span className="font-semibold text-[#101828]">
                                check your spam folder
                            </span>
                        </p>
                    </div>

                    {/* Additional Help Text */}
                    <div className="pt-8">
                        <p className="text-gray-600 mb-6">
                            Still can't find the email? No problem.
                        </p>

                        {/* Message Display */}
                        {resendMessage && (
                            <div className="pt-4">
                                <div
                                    className={`p-4 mb-5 rounded-lg border ${
                                        messageType === "success"
                                            ? "bg-green-50 border-green-200 text-green-800"
                                            : "bg-red-50 border-red-200 text-red-800"
                                    }`}
                                >
                                    <p className="text-sm font-medium">
                                        {resendMessage}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Resend Button */}
                        <Button
                            onClick={handleResendEmail}
                            disabled={isResending}
                            className="bg-campus-gradient hover:opacity-90 text-white px-6"
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Resend Email Verification Mail"
                            )}
                        </Button>
                    </div>

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

export default function EmailVerificationSentPage() {
    return (
        <Suspense>
            <EmailVerificationSent />
        </Suspense>
    );
}
