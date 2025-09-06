import Link from "next/link";
import Image from "@/components/Image";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <Link className={`block ${className || ""}`} href="/">
            <Image
                className="opacity-100 dark:!hidden"
                src="/images/voice-cake-logo-dark.png"
                alt="Voice Cake Logo"
                priority
                quality={100}
            />
            <Image
                className="!hidden opacity-100 dark:!block"
                src="/images/voice-cake-logo-light.png"
                alt="Voice Cake Logo"
                priority
                quality={100}
            />
        </Link>
    );
};

export default Logo;
