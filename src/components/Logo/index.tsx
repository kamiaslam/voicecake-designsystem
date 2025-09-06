import Link from "next/link";
import Image from "@/components/Image";

type LogoProps = {
    className?: string;
};

const Logo = ({ className }: LogoProps) => {
    return (
        <Link className={`block relative w-auto h-auto ${className || ""}`} href="/">
            <Image
                className="opacity-100 dark:!hidden"
                src="/images/voice-cake-logo-dark.png"
                alt="Voice Cake Logo"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: 'auto' }}
                priority
                quality={100}
            />
            <Image
                className="!hidden opacity-100 dark:!block"
                src="/images/voice-cake-logo-light.png"
                alt="Voice Cake Logo"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: 'auto', height: 'auto' }}
                priority
                quality={100}
            />
        </Link>
    );
};

export default Logo;
