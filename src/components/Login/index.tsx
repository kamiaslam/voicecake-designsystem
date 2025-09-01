import { useState } from "react";
import Button from "../Button";
import Image from "../Image";
import Logo from "../Logo";
import ThemeButton from "../ThemeButton";
import SignIn from "./SignIn";
import CreateAccount from "./CreateAccount";
import ResetPassword from "./ResetPassword";

const Login = ({}) => {
    const [isSignIn, setIsSignIn] = useState(true);
    const [isResetPassword, setIsResetPassword] = useState(false);

    return (
        <div className="min-h-screen bg-b-surface1 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <Logo className="w-auto h-12" />
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-b-surface2 py-8 px-4 shadow-lg sm:rounded-xl sm:px-10 border border-b-border">
                    <div className="mb-10 text-h4 text-center max-md:mb-6 max-md:text-h5 text-t-primary">
                        {isResetPassword
                            ? "Reset password"
                            : isSignIn
                            ? "Sign in to Dashboard"
                            : "Create an account"}
                    </div>
                    
                    {isResetPassword ? (
                        <ResetPassword
                            handleSignIn={() => {
                                setIsSignIn(true);
                                setIsResetPassword(false);
                            }}
                        />
                    ) : (
                        <>
                            <Button className="w-full gap-2" isGray>
                                <Image
                                    className="size-6 opacity-100"
                                    src="/images/google.svg"
                                    width={24}
                                    height={24}
                                    alt="Google"
                                />
                                Sign {isSignIn ? "in" : "up"} with Google
                            </Button>
                            <div className="mt-6 text-center text-caption text-t-tertiary">
                                {isSignIn
                                    ? "Or sign in with email"
                                    : "Or use your email"}
                            </div>
                            {isSignIn ? (
                                <SignIn
                                    handleSignUp={() => setIsSignIn(false)}
                                    handleForgotPassword={() =>
                                        setIsResetPassword(true)
                                    }
                                />
                            ) : (
                                <CreateAccount handleSignIn={() => setIsSignIn(true)} />
                            )}
                        </>
                    )}
                    
                    {/* Theme Toggle */}
                    <div className="mt-6 flex justify-center">
                        <ThemeButton rowProps="flex-row w-22"/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
