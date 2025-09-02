"use client";

import HomePage from "@/templates/HomePage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
            <HomePage />
        </ProtectedRoute>
    );
}
