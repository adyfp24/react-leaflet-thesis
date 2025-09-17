import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

interface AppLogoProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppLogo({ className, ...props }: AppLogoProps) {
    return (
        <div className={cn("font-bold text-xl flex items-center", className)} {...props}>
            <Avatar className="mr-2 w-8 h-8">
                <AvatarImage src="/logo/kisel-logo-clean.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            Kisel Console
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">v1.0</span>
        </div>
    )
}