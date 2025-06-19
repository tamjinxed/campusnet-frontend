"use client";

import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoutes";
import api from "../lib/axios";
import { useEffect, useState } from "react";

function DashboardPage() {
    const { user, logout } = useAuth();

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">
                    Welcome, {user?.userProfile?.first_name}!
                </h1>
                <button
                    onClick={logout}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </div>
            <div>
                <h2 className="text-2xl font-semibold">Your Feed</h2>
            </div>
        </div>
    );
}

// Wrap the page component with the ProtectedRoute HOC
export default function ProtectedDashboard() {
    return (
        <ProtectedRoute>
            <DashboardPage />
        </ProtectedRoute>
    );
}
