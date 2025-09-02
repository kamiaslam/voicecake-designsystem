"use client";

import BillingPage from "@/templates/BillingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <BillingPage />
    </ProtectedRoute>
  );
}