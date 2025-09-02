"use client";

import AgentsPage from "@/templates/AgentsPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Agents() {
    return (
        <ProtectedRoute>
            <AgentsPage />
        </ProtectedRoute>
    );
}