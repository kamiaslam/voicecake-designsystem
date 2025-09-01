"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Logo from "@/components/Logo";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignUp = () => {
        router.push("/auth/signup");
    };

    const handleForgotPassword = () => {
        // TODO: Implement forgot password functionality
        console.log("Forgot password clicked");
    };

    const handleSignIn = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement sign in functionality
        console.log("Sign in clicked", { email, password });
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo className="w-auto h-12" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{" "}
                    <button
                        onClick={handleSignUp}
                        className="font-medium text-primary-02 hover:text-primary-01"
                    >
                        create a new account
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignIn}>
                        <Field
                            innerLabel="Email"
                            placeholder="Enter email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Field
                            innerLabel="Password"
                            placeholder="Enter password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            handleForgotPassword={handleForgotPassword}
                        />
                        <Button type="submit" className="w-full" isBlack>
                            Sign in
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
