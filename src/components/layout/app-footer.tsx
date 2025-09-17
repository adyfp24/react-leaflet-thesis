import { appConfig } from '@/config/app'
import { ModeToggle } from '../custom/mode-toggle'
import { Linkedin, Mail, Twitter } from 'lucide-react'

export function AppFooter() {
    return (
        <footer className="flex flex-col items-center justify-between gap-4 min-h-[3rem] md:h-20 py-6 md:flex-row border-t border-gray-200/50 dark:border-gray-800/50 mt-8">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                footer
            </p>
        </footer>
    )
}