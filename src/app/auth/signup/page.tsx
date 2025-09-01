"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Logo from "@/components/Logo";

export default function SignUpPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignIn = () => {
        router.push("/auth/signin");
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Implement sign up functionality
        console.log("Sign up clicked", { email, password });
        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo className="w-auto h-12" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{" "}
                    <button
                        onClick={handleSignIn}
                        className="font-medium text-primary-02 hover:text-primary-01"
                    >
                        sign in to your existing account
                    </button>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSignUp}>
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
                        />
                        <Button type="submit" className="w-full" isBlack>
                            Create an account
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
