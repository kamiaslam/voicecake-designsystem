"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/authContext";
import { FinanceProvider } from "@/context/financeContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider disableTransitionOnChange>
            <AuthProvider>
                <FinanceProvider>
                    {children}
                </FinanceProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Providers;
