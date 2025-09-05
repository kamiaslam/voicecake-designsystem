"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/authContext";
import { FinanceProvider } from "@/context/financeContext";
import { AgentEditProvider } from "@/context/agentEditContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider disableTransitionOnChange>
            <AuthProvider>
                <FinanceProvider>
                    <AgentEditProvider>
                        {children}
                    </AgentEditProvider>
                </FinanceProvider>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Providers;
