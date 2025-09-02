"use client";

import OverviewPage from "@/templates/Products/OverviewPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function DashboardPage() {
    return (
        <ProtectedRoute>
            <OverviewPage />
        </ProtectedRoute>
    );
}
