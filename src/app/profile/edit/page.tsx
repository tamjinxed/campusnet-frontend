"use client"

import ProtectedRoute from "@/app/components/ProtectedRoutes"
import EditProfilePage from "@/app/profile/edit/EditProfilePage"

export default function EditProfilePageWrapper() {
    return (
        <ProtectedRoute>
            <EditProfilePage />
        </ProtectedRoute>
    )
}
