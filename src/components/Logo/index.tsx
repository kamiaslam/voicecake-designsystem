import Link from "next/link";
import Image from "@/components/Image";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <Link className={`block w-12 h-12 ${className || ""}`} href="/">
            <Image
                className="size-full opacity-100 dark:!hidden"
                src="/images/voice-cake-logo-dark.png"
                alt="Voice Cake Logo"
                width={48}
                height={48}
                priority
                quality={100}
            />
            <Image
                className="size-full !hidden opacity-100 dark:!block"
                src="/images/voice-cake-logo-light.png"
                alt="Voice Cake Logo"
                width={48}
                height={48}
                priority
                quality={100}
            />
        </Link>
    );
};

export default Logo;
