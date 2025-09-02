"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/context/authContext";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider disableTransitionOnChange>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ThemeProvider>
    );
};

export default Providers;
