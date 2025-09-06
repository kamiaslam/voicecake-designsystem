import { useTheme } from "next-themes";
import Icon from "@/components/Icon";

type ThemeButtonProps = {
    className?: string;
    rowProps?: string;
};

const ThemeButton = ({ className, rowProps }: ThemeButtonProps) => {
    const { setTheme, theme } = useTheme();

    return (
        <div
            className={`group flex ${rowProps} flex-col gap-1 w-12 p-1.5 px-[5px] py-[3px] bg-b-surface2 rounded-full cursor-pointer transition-all hover:shadow-depth dark:bg-linear-to-b dark:from-[#2A2A2A] dark:to-[#202020] ${
                className || ""
            }`}
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
            {["light", "dark"].map((theme) => (
                <button
                    className="w-[16px] h-[16px] rounded-full text-0 fill-t-secondary transition-colors last:bg-b-surface1 last:fill-t-primary dark:first:bg-[#363636] dark:first:fill-t-primary dark:last:bg-transparent dark:last:fill-t-secondary group-hover:!fill-t-primary"
                    key={theme}
                >
                    <Icon
                        className="!size-4 fill-inherit"
                        name={theme === "dark" ? "moon" : "sun"}
                    />
                </button>
            ))}
        </div>
    );
};

export default ThemeButton;
